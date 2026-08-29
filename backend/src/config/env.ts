import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  PORT: z.string().default('5000'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  DATABASE_URL: z.string().default('postgresql://postgres:postgres@localhost:5432/sih_nitk_2026'),
  JWT_SECRET: z.string().default('docprint_super_secret_jwt_key_2026'),
  JWT_EXPIRES_IN: z.string().default('15m'),
  REFRESH_TOKEN_SECRET: z.string().default('docprint_super_secret_refresh_key_2026'),
  REFRESH_TOKEN_EXPIRES_IN: z.string().default('7d'),
  RAZORPAY_KEY_ID: z.string().default('rzp_test_mock_key'),
  RAZORPAY_KEY_SECRET: z.string().default('mock_secret'),
  RAZORPAY_WEBHOOK_SECRET: z.string().default('mock_webhook_secret'),
  STORAGE_DIR: z.string().default('./storage_uploads'),
  R2_ACCOUNT_ID: z.string().optional().default('3590633133a952349f4b478697ad342f'),
  R2_ACCESS_KEY_ID: z.string().optional().default('6a256ff415a5af5dc86d77c44f7d9068'),
  R2_SECRET_ACCESS_KEY: z.string().optional().default('c9a427a7760839df292a5a8b55bc4ca6373c5a45edf0daf3d9a45c240cddf272'),
  R2_BUCKET_NAME: z.string().optional().default('onbillo'),
  R2_ENDPOINT: z.string().optional().default('https://3590633133a952349f4b478697ad342f.r2.cloudflarestorage.com'),
});

export const env = envSchema.parse(process.env);
