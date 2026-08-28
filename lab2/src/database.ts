import { Pool } from "pg";

let pool: Pool | null = null;

export function getPool(): Pool {
  if (!pool) {
    pool = new Pool({
      host: process.env.PGHOST || "localhost",
      port: process.env.PGPORT ? parseInt(process.env.PGPORT, 10) : 5432,
      user: process.env.PGUSER || "postgres",
      password: process.env.PGPASSWORD || "postgres",
      database: process.env.PGDATABASE || "student_management",
    });
  }
  return pool;
}

// Allows tests to point the pool at a fresh Testcontainers database,
// and to close the old pool cleanly before doing so.
export async function resetPool(): Promise<void> {
  if (pool) {
    await pool.end();
    pool = null;
  }
}