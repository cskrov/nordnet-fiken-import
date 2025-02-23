import { getEnv } from 'api/env';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  out: './drizzle',
  schema: './db/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: getEnv('DATABASE_URL'),
  },
});
