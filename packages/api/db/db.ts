import { getEnv } from 'api/env';
import { SQL } from 'bun';
import { drizzle } from 'drizzle-orm/bun-sql';
import { migrate } from 'drizzle-orm/bun-sql/migrator';

export const db = drizzle(new SQL(getEnv('DATABASE_URL')));

await migrate(db, { migrationsFolder: './drizzle' });
