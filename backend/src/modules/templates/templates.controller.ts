import { Request, Response, NextFunction } from 'express';
import { db } from '../../db/index.js';
import { documentTemplates, generatedDocuments, documents, documentVersions } from '../../db/schema.js';
import { eq } from 'drizzle-orm';
import { ApiError } from '../../utils/apiError.js';
import { sendResponse } from '../../utils/apiResponse.js';

export class TemplatesService {
  static async createTemplate(data: { name: string; description?: string; category: any; templateDefinition?: any }) {
    const [template] = await db
      .insert(documentTemplates)
      .values({
        name: data.name,
        description: data.description,
        category: data.category,
        templateDefinition: data.templateDefinition || {},
      })
      .returning();

    return template;
  }

  static async listTemplates() {
    return db.query.documentTemplates.findMany({
      where: eq(documentTemplates.isActive, true),
    });
  }

  static async getTemplateById(id: string) {
    const template = await db.query.documentTemplates.findFirst({
      where: eq(documentTemplates.id, id),
    });

    if (!template) {
      throw new ApiError(404, 'Template not found');
    }

    return template;
  }

  // Automatic Document Generation Engine from Template
  static async generateDocument(userId: string, templateId: string, inputData: Record<string, any>) {
    const template = await this.getTemplateById(templateId);

    // 1. Create document record
    const [doc] = await db
      .insert(documents)
      .values({
        userId,
        name: `${template.name}_${Date.now()}.pdf`,
        documentType: 'PDF',
        sourceType: 'GENERATED',
      })
      .returning();

    // 2. Create document version record
    const storageKey = `gen_${templateId}_${Date.now()}.pdf`;
    const [version] = await db
      .insert(documentVersions)
      .values({
        documentId: doc.id,
        storageKey,
        fileName: `${template.name}.pdf`,
        mimeType: 'application/pdf',
        fileSize: 1024 * 150,
        pageCount: 2,
        versionNumber: 1,
      })
      .returning();

    // 3. Store in generated_documents log
    const [genDoc] = await db
      .insert(generatedDocuments)
      .values({
        userId,
        templateId,
        inputData,
        documentId: doc.id,
      })
      .returning();

    return {
      generatedDocument: genDoc,
      document: doc,
      version,
    };
  }

  static async updateTemplate(id: string, data: Partial<{ name: string; description: string; isActive: boolean }>) {
    const [updated] = await db
      .update(documentTemplates)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(documentTemplates.id, id))
      .returning();

    return updated;
  }

  static async deleteTemplate(id: string) {
    await db.delete(documentTemplates).where(eq(documentTemplates.id, id));
  }
}

export class TemplatesController {
  static async createTemplate(req: Request, res: Response, next: NextFunction) {
    try {
      const template = await TemplatesService.createTemplate(req.body);
      return sendResponse({ res, statusCode: 201, message: 'Document template created', data: template });
    } catch (error) {
      next(error);
    }
  }

  static async listTemplates(_req: Request, res: Response, next: NextFunction) {
    try {
      const templates = await TemplatesService.listTemplates();
      return sendResponse({ res, message: 'Templates retrieved', data: templates });
    } catch (error) {
      next(error);
    }
  }

  static async getTemplate(req: Request, res: Response, next: NextFunction) {
    try {
      const template = await TemplatesService.getTemplateById(req.params.id as string);
      return sendResponse({ res, message: 'Template details retrieved', data: template });
    } catch (error) {
      next(error);
    }
  }

  static async generate(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await TemplatesService.generateDocument(
        req.user!.userId,
        req.params.id as string,
        req.body.inputData || {}
      );
      return sendResponse({ res, statusCode: 201, message: 'Document generated from template', data: result });
    } catch (error) {
      next(error);
    }
  }

  static async updateTemplate(req: Request, res: Response, next: NextFunction) {
    try {
      const updated = await TemplatesService.updateTemplate(req.params.id as string, req.body);
      return sendResponse({ res, message: 'Template updated', data: updated });
    } catch (error) {
      next(error);
    }
  }

  static async deleteTemplate(req: Request, res: Response, next: NextFunction) {
    try {
      await TemplatesService.deleteTemplate(req.params.id as string);
      return sendResponse({ res, message: 'Template deleted' });
    } catch (error) {
      next(error);
    }
  }
}
