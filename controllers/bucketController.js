import * as bucketService from '../services/bucketService.js';

export const createBucket = async (req, res) => {
  const { bucket_name } = req.body;
  if (!bucket_name) {
    return res.status(400).json({ error: "Bucket name is required." });
  }
  try {
    await bucketService.createBucket(bucket_name);
    res.json({ message: `Bucket '${bucket_name}' created successfully.` });
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
};
export const listBuckets = async (req, res) => {
  try {
    const buckets = await bucketService.listBuckets();
    res.json({ buckets });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteBucket = async (req, res) => {
  const bucket_name = req.params.bucket_name;
  try {
    await bucketService.deleteBucket(bucket_name);
    res.json({ message: `Bucket '${bucket_name}' deleted successfully.` });
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
};