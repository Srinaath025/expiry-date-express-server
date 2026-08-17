const { validationResult } = require('express-validator');
const productDao = require('../dao/productDao');

const productController = {
    /**
     * Get products nearing expiry with pagination, searching, and filtering.
     */
    getProducts: async (req, res) => {
        try {
            const userId = req.user._id;
            const page = Math.max(1, parseInt(req.query.page) || 1);
            const limit = Math.min(20, Math.max(1, parseInt(req.query.limit) || 20));
            const search = req.query.search || '';
            const category = req.query.category || 'all';
            const status = req.query.status || 'all';
            const expiryFilter = req.query.expiryFilter;

            let expiryWithinMonths = null;
            if (expiryFilter === '1month') {
                expiryWithinMonths = 1;
            } else if (expiryFilter === '3months') {
                expiryWithinMonths = 3;
            } else if (expiryFilter) {
                const parsed = parseInt(expiryFilter);
                if (!isNaN(parsed)) {
                    expiryWithinMonths = parsed;
                }
            }

            const [{ products, total }, stats] = await Promise.all([
                productDao.searchAndFilter(userId, {
                    search,
                    category,
                    status,
                    expiryWithinMonths,
                    page,
                    limit,
                }),
                productDao.getStats(userId)
            ]);

            return res.status(200).json({
                products,
                total,
                page,
                limit,
                stats,
            });
        } catch (error) {
            return res.status(500).json({
                message: error.message || 'Internal server error',
            });
        }
    },

    /**
     * Create a new product.
     */
    createProduct: async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const userId = req.user._id;
            const { title, upc, amount, category, expiryDate } = req.body;

            const product = await productDao.create({
                userId,
                title,
                upc,
                amount,
                category,
                expiryDate,
            });

            return res.status(201).json(product);
        } catch (error) {
            return res.status(500).json({
                message: error.message || 'Internal server error',
            });
        }
    },

    /**
     * Update an existing product.
     */
    updateProduct: async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const userId = req.user._id;
            const productId = req.params.id;
            const { title, upc, amount, category, expiryDate } = req.body;

            const updatedProduct = await productDao.update(productId, userId, {
                title,
                upc,
                amount,
                category,
                expiryDate,
            });

            if (!updatedProduct) {
                return res.status(404).json({ message: 'Product not found or unauthorized' });
            }

            return res.status(200).json(updatedProduct);
        } catch (error) {
            return res.status(500).json({
                message: error.message || 'Internal server error',
            });
        }
    },

    /**
     * Delete a product.
     */
    deleteProduct: async (req, res) => {
        try {
            const userId = req.user._id;
            const productId = req.params.id;

            const deletedProduct = await productDao.delete(productId, userId);

            if (!deletedProduct) {
                return res.status(404).json({ message: 'Product not found or unauthorized' });
            }

            return res.status(200).json({ message: 'Product deleted successfully' });
        } catch (error) {
            return res.status(500).json({
                message: error.message || 'Internal server error',
            });
        }
    },
};

module.exports = productController;
