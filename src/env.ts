import { z } from 'zod';

const envSchema = z.object({
    PORT: z.string().default('3000'),
    NODE_ENV: z.string().default('development'),
    DATABASE_URL: z.string().url(),
    AWS_REGION: z.string(),
    AWS_ACCESS_KEY_ID: z.string(),
    AWS_SECRET_ACCESS_KEY: z.string(),
    AWS_BUCKET: z.string(),
    });

    export const env = envSchema.parse(process.env); 