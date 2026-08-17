const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    upc: {
        type: String,
        required: false,
        trim: true
    },
    amount: {
        type: String,
        required: true,
        trim: true
    },
    category: {
        type: String,
        required: true,
        enum: ['Pantry', 'Fridge', 'Freezer', 'Medicine', 'Beverages', 'Cleaning', 'Other'],
        default: 'Pantry'
    },
    expiryDate: {
        type: Date,
        required: true
    }
}, {
    timestamps: true
});

// Indexes for optimized query execution
// 1. Dashboard query: retrieve by user and sort by expiry date
productSchema.index({ userId: 1, expiryDate: 1 });

// 2. Lookup query: retrieve by user and search by UPC barcode
productSchema.index({ userId: 1, upc: 1 });

// 3. Search query: retrieve by user and search by Title prefix or regex
productSchema.index({ userId: 1, title: 1 });

module.exports = mongoose.model('Product', productSchema);
