import pg from 'pg';
import * as dotenv from 'dotenv';

dotenv.config();

async function verify() {
  const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/sih_nitk_2026',
  });

  // Verify database connection
  const dbNameResult = await pool.query("SELECT current_database(), version();");
  console.log("Connected Database:", dbNameResult.rows[0].current_database);
  console.log("PostgreSQL Version:", dbNameResult.rows[0].version.split(',')[0]);

  // Check tables
  const tables = await pool.query(`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
    ORDER BY table_name;
  `);

  console.log(`\nVerified Database Tables Total: ${tables.rowCount}`);
  tables.rows.forEach((t, i) => console.log(` ${String(i + 1).padStart(2, ' ')}. ${t.table_name}`));

  // Check enums
  const enums = await pool.query(`
    SELECT t.typname AS enum_name, ARRAY_AGG(e.enumlabel ORDER BY e.enumsortorder) AS enum_values
    FROM pg_type t
    JOIN pg_enum e ON t.oid = e.enumtypid
    JOIN pg_catalog.pg_namespace n ON n.oid = t.typnamespace
    WHERE n.nspname = 'public'
    GROUP BY t.typname
    ORDER BY t.typname;
  `);

  console.log(`\nVerified Custom Enums Total: ${enums.rowCount}`);
  enums.rows.forEach((e, i) => {
    const vals = Array.isArray(e.enum_values) ? e.enum_values.join(', ') : String(e.enum_values);
    console.log(` ${String(i + 1).padStart(2, ' ')}. ${e.enum_name}: [${vals}]`);
  });

  await pool.end();
}

verify().catch((err) => {
  console.error("Verification failed:", err);
  process.exit(1);
});
