import dotenv from 'dotenv';

dotenv.config();

export const validateBucketToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Authorization token is required' });
    }

    const token = authHeader.split(' ')[1];
    const tokenList = JSON.parse(process.env.BUCKET_TOKEN_LIST || '[]');

    if (!tokenList.includes(token)) {
      return res.status(403).json({ error: 'Invalid token' });
    }

    next();
  } catch (error) {
    return res.status(500).json({ error: 'Error validating token' });
  }
};