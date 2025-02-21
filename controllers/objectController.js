import * as objectService from '../services/objectService.js';

export const uploadObject = async (req, res) => {
  const bucketName = req.params.bucket_name;
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded." });
  }
  try {
    const result = await objectService.uploadObject(bucketName, req.file);
    res.json(result);
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
};

export const listObjects = async (req, res) => {
  const bucketName = req.params.bucket_name;
  try {
    const objects = await objectService.listObjects(bucketName);
    res.json({ objects });
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
};

export const downloadObject = async (req, res) => {
  const { bucket_name, object_name } = req.params;
  try {
    await objectService.downloadObject(bucket_name, object_name, res);
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
};

export const deleteObject = async (req, res) => {
  const { bucket_name, object_name } = req.params;
  try {
    await objectService.deleteObject(bucket_name, object_name);
    res.json({ message: `Object '${object_name}' deleted from bucket '${bucket_name}'.` });
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
};
