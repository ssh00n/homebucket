import express from 'express';
import { createBucket, listBuckets, deleteBucket } from '../controllers/bucketController.js';
import { validateBucketToken } from '../middlewares/authMiddleware.js';
const router = express.Router();


/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * /buckets:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     summary: Create a new bucket
 *     description: Create a bucket with the given name. Requires valid bearer token.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               bucket_name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Bucket created successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized - No token provided
 *       403:
 *         description: Forbidden - Invalid token
 */
router.post('/', validateBucketToken, createBucket);

/**
 * @swagger
 * /buckets:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: List all buckets
 *     description: Retrieve a list of all buckets
 *     responses:
 *       200:
 *         description: List of buckets retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get('/', validateBucketToken, listBuckets);

/**
 * @swagger
 * /buckets/{bucket_name}:
 *   delete:
 *     security:
 *       - bearerAuth: []
 *     summary: Delete a bucket
 *     description: Delete a bucket by name
 *     parameters:
 *       - in: path
 *         name: bucket_name
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Bucket deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Bucket not found
 */
router.delete('/:bucket_name', validateBucketToken, deleteBucket);

export default router;
