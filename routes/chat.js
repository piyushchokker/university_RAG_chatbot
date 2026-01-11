const express = require('express');
const { spawn } = require('child_process');
const path = require('path');
const axios = require('axios');
const jwt = require('jsonwebtoken');
const { getStudentById } = require('../database/db');

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'krmangalam-university-secret-key-2024';
const RAG_API_URL = process.env.RAG_API_URL || 'http://localhost:5000';

// Middleware to verify JWT token
function verifyToken(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'No token provided'
        });
    }
    
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Invalid or expired token'
        });
    }
}

// Chat endpoint
router.post('/chat', verifyToken, async (req, res) => {
    try {
        const { message } = req.body;
        const userType = req.user.userType;
        
        console.log('📨 Chat request received:', { message, userType, userId: req.user.id });
        
        if (!message || !message.trim()) {
            return res.status(400).json({
                success: false,
                message: 'Message is required'
            });
        }
        
        // Get student information if user is a student
        let studentCourse = null;
        let studentSchool = null;
        
        if (userType === 'student') {
            try {
                const student = await getStudentById(req.user.id);
                if (student) {
                    studentCourse = student.course;
                    studentSchool = mapCourseToSchool(studentCourse);
                    console.log('👤 Student context:', { course: studentCourse, school: studentSchool });
                }
            } catch (error) {
                console.error('Error fetching student data:', error);
            }
        }
        
        // Call Python RAG API
        try {
            console.log(`🔗 Calling RAG API at ${RAG_API_URL}/chat`);
            const response = await axios.post(`${RAG_API_URL}/chat`, {
                query: message,
                student_course: studentCourse,
                student_school: studentSchool,
                k: 3,
                use_base: true
            }, {
                timeout: 30000 // 30 second timeout
            });
            
            console.log('✅ RAG API Response:', response.data);
            
            if (response.data.success) {
                return res.json({
                    success: true,
                    response: response.data.response,
                    sources: response.data.sources,
                    query_type: response.data.query_type
                });
            } else {
                console.error('❌ RAG API returned error:', response.data);
                return res.status(500).json({
                    success: false,
                    message: response.data.message || 'Error processing query'
                });
            }
        } catch (apiError) {
            console.error('❌ RAG API Error:', apiError.message);
            console.error('Error Code:', apiError.code);
            console.error('Error Response:', apiError.response?.data);
            
            // Check if it's a connection error
            if (apiError.code === 'ECONNREFUSED' || apiError.code === 'ENOTFOUND' || apiError.message.includes('connect')) {
                console.error('⚠️ RAG API is not running or not accessible');
                return res.json({
                    success: true,
                    response: "I'm currently being set up. The RAG system is not available right now. Please ensure the Python RAG API server is running, or contact the registrar office for assistance.",
                    sources: [],
                    query_type: 'general'
                });
            }
            
            // Check if it's a timeout
            if (apiError.code === 'ECONNABORTED' || apiError.message.includes('timeout')) {
                return res.json({
                    success: true,
                    response: "The request is taking longer than expected. Please try again with a simpler question, or contact the registrar office.",
                    sources: [],
                    query_type: 'general'
                });
            }
            
            // Fallback response for other errors
            return res.json({
                success: true,
                response: "I'm currently being set up. The RAG system encountered an issue. For immediate assistance, please contact the registrar office.",
                sources: [],
                query_type: 'general'
            });
        }
        
    } catch (error) {
        console.error('❌ Chat endpoint error:', error);
        console.error('Error stack:', error.stack);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// Helper function to map course to school
function mapCourseToSchool(course) {
    if (!course) return null;
    
    const courseLower = course.toLowerCase();
    
    // Engineering courses
    if (courseLower.includes('b.tech') || courseLower.includes('btech') || 
        courseLower.includes('m.tech') || courseLower.includes('mtech') ||
        courseLower.includes('bca') || courseLower.includes('mca') ||
        courseLower.includes('b.sc') || courseLower.includes('bsc')) {
        return 'soet';
    }
    
    // Management courses
    if (courseLower.includes('mba') || courseLower.includes('bba')) {
        return 'som';
    }
    
    // Law courses
    if (courseLower.includes('llb') || courseLower.includes('llm')) {
        return 'sol';
    }
    
    // Architecture
    if (courseLower.includes('arch')) {
        return 'soa';
    }
    
    // Commerce
    if (courseLower.includes('b.com') || courseLower.includes('bcom') ||
        courseLower.includes('m.com') || courseLower.includes('mcom')) {
        return 'soc';
    }
    
    // Pharmacy
    if (courseLower.includes('pharm')) {
        return 'soph';
    }
    
    // Education
    if (courseLower.includes('b.ed') || courseLower.includes('bed') ||
        courseLower.includes('m.ed') || courseLower.includes('med')) {
        return 'soe';
    }
    
    return null;
}

// Health check for RAG API
router.get('/health', async (req, res) => {
    try {
        const response = await axios.get(`${RAG_API_URL}/health`, {
            timeout: 5000
        });
        res.json({
            success: true,
            rag_api_status: 'connected',
            message: 'RAG API is available'
        });
    } catch (error) {
        res.json({
            success: false,
            rag_api_status: 'disconnected',
            message: 'RAG API is not available. Please ensure Python API server is running.'
        });
    }
});

module.exports = router;

