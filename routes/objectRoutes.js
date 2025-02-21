import express from 'express';
import multer from 'multer';
import { uploadObject, listObjects, downloadObject, deleteObject } from '../controllers/objectController.js';
import { validateBucketToken } from '../middlewares/authMiddleware.js';

const router = express.Router({ mergeParams: true });

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 200 * 1024 * 1024 } // 200MB
});

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
 * /buckets/{bucket_name}/objects:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     summary: Upload an object
 *     description: Upload a file to specified bucket
 *     parameters:
 *       - in: path
 *         name: bucket_name
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: File uploaded successfully
 *       400:
 *         description: No file uploaded
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.post('/', validateBucketToken, upload.single('file'), uploadObject);

/**
 * @swagger
 * /buckets/{bucket_name}/objects:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: List objects
 *     description: List all objects in a bucket
 *     parameters:
 *       - in: path
 *         name: bucket_name
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of objects retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get('/', validateBucketToken, listObjects);

/**
 * @swagger
 * /buckets/{bucket_name}/objects/{object_name}:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Download object
 *     description: Download a specific object from a bucket
 *     parameters:
 *       - in: path
 *         name: bucket_name
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: object_name
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: File downloaded successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Object not found
 */
router.get('/:object_name', validateBucketToken, downloadObject);

/**
 * @swagger
 * /buckets/{bucket_name}/objects/{object_name}:
 *   delete:
 *     security:
 *       - bearerAuth: []
 *     summary: Delete object
 *     description: Delete a specific object from a bucket
 *     parameters:
 *       - in: path
 *         name: bucket_name
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: object_name
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Object deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Object not found
 */
router.delete('/:object_name', validateBucketToken, deleteObject);

export default router;
