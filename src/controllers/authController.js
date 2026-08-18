const { validationResult } = require('express-validator');
const authService = require('../services/authService');
const userDao = require('../dao/userDao');

const authController = {
    register: async (request, response) => {
        const errors = validationResult(request);
        if (!errors.isEmpty()) {
            return response.status(400).json({
                errors: errors.array()
            });
        }

        try {
            const { name, email, password } = request.body;
            const { user, token } = await authService.register({ name, email, password });

            response.cookie('jwtToken', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
                path: '/'
            });

            return response.status(201).json({
                message: 'User registered successfully',
                user: user
            });
        } catch (error) {
            return response.status(error.statusCode || 500).json({
                message: error.message || 'Internal server error'
            });
        }
    },

    login: async (request, response) => {
        const errors = validationResult(request);
        if (!errors.isEmpty()) {
            return response.status(400).json({
                errors: errors.array()
            });
        }

        try {
            const { email, password } = request.body;
            const { user, token } = await authService.login({ email, password });

            response.cookie('jwtToken', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
                path: '/'
            });

            return response.status(200).json({
                message: 'User authenticated successfully',
                user: user
            });
        } catch (error) {
            return response.status(error.statusCode || 400).json({
                message: error.message || 'Invalid email or password'
            });
        }
    },

    getMe: async (request, response) => {
        try {
            // req.user is populated by the protect middleware
            const user = await userDao.findByEmail(request.user.email);
            if (!user) {
                return response.status(404).json({ message: 'User not found.' });
            }
            const userResponse = user.toObject();
            delete userResponse.password;
            return response.status(200).json({ user: userResponse });
        } catch (error) {
            return response.status(500).json({ message: error.message || 'Internal server error' });
        }
    },

    logout: async (request, response) => {
        try {
            response.clearCookie('jwtToken', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
                path: '/'
            });

            return response.status(200).json({
                message: 'Logged out successfully'
            });
        } catch (error) {
            return response.status(500).json({
                message: error.message || 'Error logging out'
            });
        }
    },
};

module.exports = authController;
