import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import pool from "./db.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const migrationsDir = path.join(__dirname, "migrations");

const runMigrations = async () => {
  const client = await pool.connect();

  try {
    // Create a table to track completed migrations.
    await client.query(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        filename TEXT UNIQUE NOT NULL,
        executed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);

    const files = (await fs.readdir(migrationsDir))
      .filter((file) => /^\d+_.+\.sql$/.test(file))
      .sort((a, b) => {
        const numberA = Number(a.match(/^\d+/)[0]);
        const numberB = Number(b.match(/^\d+/)[0]);
        return numberA - numberB || a.localeCompare(b);
      });

    for (const file of files) {
      const result = await client.query(
        "SELECT 1 FROM schema_migrations WHERE filename = $1",
        [file]
      );

      if (result.rowCount > 0) {
        console.log(`⏭️ Skipping ${file}`);
        continue;
      }

      const filePath = path.join(migrationsDir, file);
      const sql = await fs.readFile(filePath, "utf8");

      console.log(`▶️ Running ${file}`);

      await client.query("BEGIN");

      try {
        await client.query(sql);

        await client.query(
          "INSERT INTO schema_migrations (filename) VALUES ($1)",
          [file]
        );

        await client.query("COMMIT");
        console.log(`✅ Completed ${file}`);
      } catch (error) {
        await client.query("ROLLBACK");
        throw new Error(`Migration failed: ${file}`, { cause: error });
      }
    }

    console.log("🎉 All migrations completed.");
  } finally {
    client.release();
    await pool.end();
  }
};

runMigrations().catch((error) => {
  console.error("❌ Migration runner failed:", error);
  process.exitCode = 1;
});