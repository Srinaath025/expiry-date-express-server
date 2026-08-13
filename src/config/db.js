const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/expiry-date-manager');
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`MongoDB connection error: ${error.message}`);
        console.warn(`[WARNING] MongoDB is not running or accessible. DB operations will fail until MongoDB is started or MONGODB_URI in .env is updated.`);
    }
};

module.exports = connectDB;
