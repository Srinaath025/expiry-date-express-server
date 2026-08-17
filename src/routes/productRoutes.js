const express = require('express');
const productController = require('../controllers/productController');
const { productValidators } = require('../utils/productValidators');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       required:
 *         - title
 *         - amount
 *         - expiryDate
 *       properties:
 *         _id:
 *           type: string
 *           description: Unique product identifier
 *         userId:
 *           type: string
 *           description: Reference to the user who owns the product
 *         title:
 *           type: string
 *           description: Product title
 *         upc:
 *           type: string
 *           description: UPC barcode or manual barcode code
 *         amount:
 *           type: string
 *           description: Quantity or volume descriptor (e.g. 500g, 1 Gallon)
 *         expiryDate:
 *           type: string
 *           format: date-time
 *           description: Expiry date
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     ProductRequest:
 *       type: object
 *       required:
 *         - title
 *         - amount
 *         - expiryDate
 *       properties:
 *         title:
 *           type: string
 *           example: Organic Milk
 *         amount:
 *           type: string
 *           example: 1 Gallon
 *         expiryDate:
 *           type: string
 *           format: date
 *           example: "2026-09-17"
 *         upc:
 *           type: string
 *           example: "012000002263"
 *     ProductListResponse:
 *       type: object
 *       properties:
 *         products:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Product'
 *         total:
 *           type: integer
 *           description: Total matching products count
 *         page:
 *           type: integer
 *         limit:
 *           type: integer
 */

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Retrieve products nearing expiry (supports search, filter, and pagination)
 *     tags: [Products]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Number of records to return
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search query matching title (case-insensitive) or UPC (exact match)
 *       - in: query
 *         name: expiryFilter
 *         schema:
 *           type: string
 *           enum: [1month, 3months]
 *         description: Filter products expiring within the specified timeline
 *     responses:
 *       200:
 *         description: Successfully fetched list of products
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductListResponse'
 *       401:
 *         description: Unauthorized
 */
router.get('/', protect, productController.getProducts);

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Add a new product
 *     tags: [Products]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductRequest'
 *     responses:
 *       201:
 *         description: Product added successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Validation errors
 *       401:
 *         description: Unauthorized
 */
router.post('/', protect, productValidators, productController.createProduct);

/**
 * @swagger
 * /products/{id}:
 *   put:
 *     summary: Update an existing product by ID
 *     tags: [Products]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product database ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductRequest'
 *     responses:
 *       200:
 *         description: Product updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Validation errors
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Product not found or not owned by user
 */
router.put('/:id', protect, productValidators, productController.updateProduct);

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Delete a product by ID
 *     tags: [Products]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product database ID
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Product not found or not owned by user
 */
router.delete('/:id', protect, productController.deleteProduct);

module.exports = router;
