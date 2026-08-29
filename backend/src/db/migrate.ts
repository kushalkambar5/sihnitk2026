import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import pg from 'pg';
import * as dotenv from 'dotenv';

dotenv.config();

async function runMigrate() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not set in environment variables');
  }

  console.log('Connecting to PostgreSQL database...');
  const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
  });

  const db = drizzle(pool);

  console.log('Running migrations...');
  const start = Date.now();

  try {
    await migrate(db, { migrationsFolder: './drizzle' });
    const end = Date.now();
    console.log(`✅ All 40 tables and enums created successfully in ${end - start}ms!`);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

runMigrate();
