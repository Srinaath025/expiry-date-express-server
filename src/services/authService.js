const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userDao = require('../dao/userDao');

const authService = {
    register: async ({ name, email, password }) => {
        const existingUser = await userDao.findByEmail(email);
        if (existingUser) {
            const error = new Error('User with this email already exists');
            error.statusCode = 400;
            throw error;
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await userDao.create({
            name,
            email,
            password: hashedPassword,
        });

        const token = jwt.sign(
            {
                _id: newUser._id,
                name: newUser.name,
                email: newUser.email,
            },
            process.env.JWT_SECRET || 'fallback_secret',
            { expiresIn: '1h' }
        );

        const userResponse = newUser.toObject();
        delete userResponse.password;

        return {
            user: userResponse,
            token,
        };
    },

    login: async ({ email, password }) => {
        const user = await userDao.findByEmail(email);
        if (!user) {
            const error = new Error('Invalid email or password');
            error.statusCode = 400;
            throw error;
        }

        const isPasswordMatched = await bcrypt.compare(password, user.password);
        if (!isPasswordMatched) {
            const error = new Error('Invalid email or password');
            error.statusCode = 400;
            throw error;
        }

        const token = jwt.sign(
            {
                _id: user._id,
                name: user.name,
                email: user.email,
            },
            process.env.JWT_SECRET || 'fallback_secret',
            { expiresIn: '1h' }
        );

        const userResponse = user.toObject();
        delete userResponse.password;

        return {
            user: userResponse,
            token,
        };
    },
};

module.exports = authService;
