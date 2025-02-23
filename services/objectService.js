import { promises as fs } from 'fs';
import fsSync from 'fs';
import path from 'path';
import zlib from 'zlib';
import { initDB } from '../db/database.js';
import util from 'util';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const gzip = util.promisify(zlib.gzip);
const DATA_DIR = path.join(__dirname, '..', 'storage');

async function uploadObject(bucketName, file) {
  const bucketDir = path.join(DATA_DIR, bucketName);
  try {
    await fs.access(bucketDir);
  } catch (err) {
    throw { status: 404, message: "Bucket not found." };
  }
  let compressedBuffer;
  try {
    compressedBuffer = await gzip(file.buffer);
  } catch (err) {
    throw { status: 500, message: "Error compressing file." };
  }
  // const originalName = file.originalname;
  const originalName = Buffer.from(file.originalname, 'latin1').toString('utf8');
  const filePath = path.join(bucketDir, originalName + '.gz');
  try {
    await fs.writeFile(filePath, compressedBuffer);
  } catch (err) {
    throw { status: 500, message: "Error saving file." };
  }
  const fileSize = compressedBuffer.length;
  const db = await initDB();
  try {
    await db.run(
      `INSERT INTO objects (bucket_name, object_name, file_path, size) VALUES (?, ?, ?, ?)`,
      [bucketName, originalName, filePath, fileSize]
    );
  } catch (err) {
    throw { status: 400, message: "Object already exists or DB error." };
  }
  return { message: `File '${originalName}' uploaded and compressed successfully to bucket '${bucketName}'.`, size: fileSize };
}

async function listObjects(bucketName) {
  const bucketDir = path.join(DATA_DIR, bucketName);
  try {
    await fs.access(bucketDir);
  } catch (err) {
    throw { status: 404, message: "Bucket not found." };
  }
  const db = await initDB();
  const rows = await db.all(
    `SELECT object_name, size, upload_time FROM objects WHERE bucket_name = ?`,
    [bucketName]
  );
  return rows;
}

async function downloadObject(bucketName, objectName, res) {
  const db = await initDB();
  const row = await db.get(
    `SELECT file_path FROM objects WHERE bucket_name = ? AND object_name = ?`,
    [bucketName, objectName]
  );
  if (!row) {
    throw { status: 404, message: "Object not found." };
  }
  const filePath = row.file_path;
  try {
    await fs.access(filePath);
  } catch (err) {
    throw { status: 404, message: "File not found on disk." };
  }
  res.setHeader('Content-Disposition', `attachment; filename="${objectName}"`);
  const readStream = fsSync.createReadStream(filePath);
  const gunzipStream = zlib.createGunzip();
  readStream.pipe(gunzipStream).pipe(res);
}

async function deleteObject(bucketName, objectName) {
  const db = await initDB();
  const row = await db.get(
    `SELECT file_path FROM objects WHERE bucket_name = ? AND object_name = ?`,
    [bucketName, objectName]
  );
  if (!row) {
    throw { status: 404, message: "Object not found." };
  }
  const filePath = row.file_path;
  await db.run(`DELETE FROM objects WHERE bucket_name = ? AND object_name = ?`, [bucketName, objectName]);
  try {
    await fs.unlink(filePath);
  } catch (err) {
    throw { status: 500, message: "Error deleting file from disk." };
  }
}

export {
  uploadObject,
  listObjects,
  downloadObject,
  deleteObject,
};
