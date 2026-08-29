import EmbeddedPostgres from 'embedded-postgres';
import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import pg from 'pg';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config();

async function isPgRunning(): Promise<boolean> {
  const client = new pg.Client({
    user: 'postgres',
    password: 'postgres',
    host: 'localhost',
    port: 5432,
    database: 'postgres',
    connectionTimeoutMillis: 1500,
  });

  try {
    await client.connect();
    await client.end();
    return true;
  } catch {
    return false;
  }
}

async function main() {
  const running = await isPgRunning();

  if (!running) {
    console.log('Initializing Embedded PostgreSQL Database Engine...');
    const pgEngine = new EmbeddedPostgres({
      databaseDir: path.resolve('./.pg_data'),
      user: 'postgres',
      password: 'postgres',
      port: 5432,
      persistent: true,
    });

    try {
      await pgEngine.initialise();
    } catch (err: any) {
      console.log('Database already initialized.');
    }

    try {
      await pgEngine.start();
      console.log('🚀 PostgreSQL database server started on port 5432!');
    } catch (err: any) {
      console.log('Database server notice during start.');
    }
  } else {
    console.log('🚀 PostgreSQL database server is already running on port 5432!');
  }

  // Create database sih_nitk_2026 if not exists
  const rootClient = new pg.Client({
    user: 'postgres',
    password: 'postgres',
    host: 'localhost',
    port: 5432,
    database: 'postgres',
  });

  await rootClient.connect();
  const res = await rootClient.query("SELECT 1 FROM pg_database WHERE datname = 'sih_nitk_2026'");
  if (res.rowCount === 0) {
    console.log('Creating database sih_nitk_2026...');
    await rootClient.query('CREATE DATABASE sih_nitk_2026');
    console.log('Database sih_nitk_2026 created!');
  } else {
    console.log('Database sih_nitk_2026 already exists.');
  }
  await rootClient.end();

  // Connect to sih_nitk_2026 and run migrations
  const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/sih_nitk_2026';
  const pool = new pg.Pool({ connectionString });
  const db = drizzle(pool);

  console.log('Running Drizzle migrations to create all tables and enums...');
  const start = Date.now();
  await migrate(db, { migrationsFolder: './drizzle' });
  const end = Date.now();
  console.log(`\n✅ SUCCESS: Migration finished in ${end - start}ms!`);

  // Verify created tables
  const tableCheck = await pool.query(`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
    ORDER BY table_name;
  `);

  console.log(`\n📋 Created PostgreSQL Tables Total: ${tableCheck.rowCount}`);
  console.table(tableCheck.rows.map((row, idx) => ({ '#': idx + 1, 'Table Name': row.table_name })));

  await pool.end();
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
