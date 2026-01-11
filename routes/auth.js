const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getStudentByEmail, getRegistrarByEmail } = require('../database/db');

const router = express.Router();

// JWT Secret (in production, use environment variable)
const JWT_SECRET = process.env.JWT_SECRET || 'krmangalam-university-secret-key-2024';

// Login endpoint
router.post('/login', async (req, res) => {
    try {
        const { email, password, userType = 'student' } = req.body;

        // Validation
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required'
            });
        }

        // Validate userType
        if (userType !== 'student' && userType !== 'registrar') {
            return res.status(400).json({
                success: false,
                message: 'Invalid user type'
            });
        }

        // Email format validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid email format'
            });
        }

        let user = null;
        let userData = null;

        // Find user based on type
        if (userType === 'student') {
            user = await getStudentByEmail(email.toLowerCase().trim());
            if (user) {
                const isPasswordValid = await bcrypt.compare(password, user.password_hash);
                if (isPasswordValid) {
                    userData = {
                        id: user.id,
                        student_id: user.student_id,
                        email: user.email,
                        full_name: user.full_name,
                        course: user.course,
                        year: user.year,
                        phone: user.phone
                    };
                }
            }
        } else {
            // Registrar login
            user = await getRegistrarByEmail(email.toLowerCase().trim());
            if (user) {
                const isPasswordValid = await bcrypt.compare(password, user.password_hash);
                if (isPasswordValid) {
                    userData = {
                        id: user.id,
                        email: user.email,
                        full_name: user.full_name,
                        department: user.department,
                        phone: user.phone
                    };
                }
            }
        }

        if (!user || !userData) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Generate JWT token
        const tokenPayload = {
            id: user.id,
            email: user.email,
            userType: userType
        };

        if (userType === 'student') {
            tokenPayload.student_id = user.student_id;
        }

        const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: '7d' });

        // Return success response
        const response = {
            success: true,
            message: 'Login successful',
            token: token,
            userType: userType
        };

        if (userType === 'student') {
            response.student = userData;
        } else {
            response.registrar = userData;
        }

        res.json(response);

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error. Please try again later.'
        });
    }
});

// Verify token endpoint (for protected routes)
router.get('/verify', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'No token provided'
            });
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        res.json({
            success: true,
            student: decoded
        });
    } catch (error) {
        res.status(401).json({
            success: false,
            message: 'Invalid or expired token'
        });
    }
});

module.exports = router;
