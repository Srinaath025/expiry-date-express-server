const { validationResult } = require('express-validator');
const authService = require('../services/authService');

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
};

module.exports = authController;
