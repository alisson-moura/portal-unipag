import { z } from 'zod';

export const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  PORT: z.coerce.number().default(3000),
  DATABASE_URL: z.string().url(),
  MOVINGPAY_BASE_URL: z
    .string()
    .url()
    .default('https://api-vendedor.movingpay.com.br'),
  MOVINGPAY_API_VERSION: z.string().default('v1'),
  MOVINGPAY_PREFIX: z.string().default('api'),
  MOVINGPAY_API_EMAIL: z.string().email(),
  MOVINGPAY_API_PASSWORD: z.string(),
  AUTH_JWT_SECRET: z.string(),
  AUTH_JWT_EXPIRES_IN: z.string(),
});

export type Env = z.infer<typeof envSchema>;
