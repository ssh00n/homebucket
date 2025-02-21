import { promises as fs } from 'fs';
import path from 'path';
import { initDB } from '../db/database.js';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, '..', 'storage');

async function createBucket(bucketName) {
  const bucketDir = path.join(DATA_DIR, bucketName);
  try {
    await fs.mkdir(bucketDir, { recursive: true });
  } catch (err) {
    throw { status: 500, message: "Error creating bucket directory." };
  }
  const db = await initDB();
  try {
    await db.run(`INSERT INTO buckets (name) VALUES (?)`, [bucketName]);
  } catch (err) {
    throw { status: 400, message: "Bucket already exists." };
  }
}

async function listBuckets() {
  const db = await initDB();
  const rows = await db.all(`SELECT name FROM buckets`);
  return rows.map(row => row.name);
}

async function deleteBucket(bucketName) {
  const bucketDir = path.join(DATA_DIR, bucketName);
  let files;
  try {
    files = await fs.readdir(bucketDir);
  } catch (err) {
    throw { status: 404, message: "Bucket not found." };
  }
  if (files.length > 0) {
    throw { status: 400, message: "Bucket is not empty." };
  }
  const db = await initDB();
  try {
    await db.run(`DELETE FROM buckets WHERE name = ?`, [bucketName]);
  } catch (err) {
    throw { status: 500, message: "Error deleting bucket from database." };
  }
  try {
    await fs.rmdir(bucketDir);
  } catch (err) {
    throw { status: 500, message: "Error removing bucket directory." };
  }
}

export { createBucket, listBuckets, deleteBucket };
