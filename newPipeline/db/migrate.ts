import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { db } from './db';

async function runMigration() {
  await migrate(db, { migrationsFolder: './drizzle' });
}

runMigration();
