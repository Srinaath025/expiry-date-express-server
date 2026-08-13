const User = require('../models/userModel');

const userDao = {
    findByEmail: async (email) => {
        const user = await User.findOne({ email: email.toLowerCase() });
        return user;
    },
    findById: async (id) => {
        const user = await User.findById(id).select('-password');
        return user;
    },
    create: async (userData) => {
        const user = new User(userData);
        return await user.save();
    },
};

module.exports = userDao;
