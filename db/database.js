import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_FILE = path.join(__dirname, '..', 'homebucket.db');

async function initDB() {
  const db = await open({
    filename: DB_FILE,
    driver: sqlite3.Database,
  });
  await db.exec(`
    CREATE TABLE IF NOT EXISTS buckets (
      id TEXT PRIMARY KEY,
      name TEXT UNIQUE NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS objects (
      id TEXT PRIMARY KEY,
      bucket_name TEXT NOT NULL,
      object_name TEXT NOT NULL,
      file_path TEXT NOT NULL,
      size INTEGER,
      upload_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(bucket_name, object_name)
    );
    
    CREATE TRIGGER IF NOT EXISTS update_buckets_timestamp
    AFTER UPDATE ON buckets
    BEGIN
      UPDATE buckets SET updated_at = CURRENT_TIMESTAMP
      WHERE id = NEW.id;
    END;
  `);
  return db;
}

export { initDB };
