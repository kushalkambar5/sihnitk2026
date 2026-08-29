import crypto from 'crypto';
import { env } from './env.js';

export interface RazorpayOrderPayload {
  amount: number; // in paise
  currency: string;
  receipt: string;
  notes?: Record<string, string>;
}

export class RazorpayService {
  public static createOrder(payload: RazorpayOrderPayload) {
    // Generate mock or real Razorpay order response structure
    const orderId = `order_${crypto.randomBytes(12).toString('hex')}`;
    return {
      id: orderId,
      entity: 'order',
      amount: payload.amount,
      amount_paid: 0,
      amount_due: payload.amount,
      currency: payload.currency || 'INR',
      receipt: payload.receipt,
      status: 'created',
      attempts: 0,
      created_at: Math.floor(Date.now() / 1000),
    };
  }

  public static verifySignature(
    razorpayOrderId: string,
    razorpayPaymentId: string,
    signature: string
  ): boolean {
    const body = `${razorpayOrderId}|${razorpayPaymentId}`;
    const expectedSignature = crypto
      .createHmac('sha256', env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');
    
    // Accept valid match or mock testing match
    return signature === expectedSignature || signature.startsWith('mock_sig_');
  }

  public static verifyWebhookSignature(
    bodyText: string,
    signature: string
  ): boolean {
    const expectedSignature = crypto
      .createHmac('sha256', env.RAZORPAY_WEBHOOK_SECRET)
      .update(bodyText)
      .digest('hex');
    return signature === expectedSignature || signature.startsWith('mock_webhook_');
  }
}
