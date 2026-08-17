const Product = require('../models/productModel');

const productDao = {
    /**
     * Create a new product.
     * @param {Object} productData 
     * @returns {Promise<Object>} Saved product document
     */
    create: async (productData) => {
        const product = new Product(productData);
        return await product.save();
    },

    /**
     * Get product stats (total, expired, soon, safe counts) for a user.
     * @param {string} userId
     * @returns {Promise<Object>} Object containing stats counts
     */
    getStats: async (userId) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const soonDate = new Date(today);
        soonDate.setDate(today.getDate() + 7);

        const [total, expired, soon, safe] = await Promise.all([
            Product.countDocuments({ userId }),
            Product.countDocuments({ userId, expiryDate: { $lt: today } }),
            Product.countDocuments({ userId, expiryDate: { $gte: today, $lte: soonDate } }),
            Product.countDocuments({ userId, expiryDate: { $gt: soonDate } })
        ]);

        return { total, expired, soon, safe };
    },

    /**
     * Find a product by ID and verify user ownership.
     * @param {string} id 
     * @param {string} userId 
     * @returns {Promise<Object|null>} Product document or null
     */
    findByIdAndUser: async (id, userId) => {
        return await Product.findOne({ _id: id, userId });
    },

    /**
     * Update a product by ID and user ownership.
     * @param {string} id 
     * @param {string} userId 
     * @param {Object} updateData 
     * @returns {Promise<Object|null>} Updated product document or null
     */
    update: async (id, userId, updateData) => {
        return await Product.findOneAndUpdate(
            { _id: id, userId },
            { $set: updateData },
            { new: true, runValidators: true }
        );
    },

    /**
     * Delete a product by ID and user ownership.
     * @param {string} id 
     * @param {string} userId 
     * @returns {Promise<Object|null>} Deleted product document or null
     */
    delete: async (id, userId) => {
        return await Product.findOneAndDelete({ _id: id, userId });
    },

    /**
     * Find products nearing expiry for a user with pagination.
     * @param {string} userId 
     * @param {number} page 
     * @param {number} limit 
     * @returns {Promise<Array>} List of product documents
     */
    findNearingExpiry: async (userId, page = 1, limit = 20) => {
        const skip = (page - 1) * limit;
        return await Product.find({ userId })
            .sort({ expiryDate: 1 })
            .skip(skip)
            .limit(limit);
    },

    /**
     * Search products by title or UPC and filter by expiry date.
     * @param {string} userId 
     * @param {Object} options 
     * @param {string} [options.search] - Title or UPC search term
     * @param {number} [options.expiryWithinMonths] - Filter by expiry within months limit
     * @param {number} [options.page=1] - Pagination page
     * @param {number} [options.limit=20] - Pagination limit
     * @returns {Promise<{ products: Array, total: number }>} Found products and total count
     */
    searchAndFilter: async (userId, options = {}) => {
        const { search, category, status, expiryWithinMonths, page = 1, limit = 20 } = options;
        const query = { userId };

        // 1. Search filter: Title or UPC matching
        if (search) {
            query.$or = [
                { title: new RegExp(search, 'i') },
                { upc: search }
            ];
        }

        // 2. Category filter
        if (category && category !== 'all') {
            query.category = category;
        }

        // 3. Status filter
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (status === 'expired') {
            query.expiryDate = { $lt: today };
        } else if (status === 'soon') {
            const soonDate = new Date(today);
            soonDate.setDate(today.getDate() + 7);
            query.expiryDate = { $gte: today, $lte: soonDate };
        } else if (status === 'safe') {
            const soonDate = new Date(today);
            soonDate.setDate(today.getDate() + 7);
            query.expiryDate = { $gt: soonDate };
        }

        // 4. Expiry date filter (months threshold)
        if (expiryWithinMonths) {
            const maxDate = new Date(today);
            maxDate.setMonth(today.getMonth() + expiryWithinMonths);
            query.expiryDate = {
                $gte: today,
                $lte: maxDate
            };
        }

        const skip = (page - 1) * limit;
        
        const [products, total] = await Promise.all([
            Product.find(query)
                .sort({ expiryDate: 1 })
                .skip(skip)
                .limit(limit),
            Product.countDocuments(query)
        ]);

        return { products, total };
    }
};

module.exports = productDao;
