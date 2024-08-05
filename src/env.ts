import { z } from 'zod';

const envSchema = z.object({
    PORT: z.string().default('3000'),
    NODE_ENV: z.string().default('development'),
    DATABASE_URL: z.string().url(),
    });

    export const env = envSchema.parse(process.env); 