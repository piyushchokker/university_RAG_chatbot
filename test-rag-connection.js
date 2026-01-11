/**
 * Test script to check RAG API connection
 * Run: node test-rag-connection.js
 */

const axios = require('axios');

const RAG_API_URL = process.env.RAG_API_URL || 'http://localhost:5000';

async function testConnection() {
    console.log('🧪 Testing RAG API Connection...\n');
    
    // Test 1: Health check
    console.log('1️⃣ Testing health endpoint...');
    try {
        const healthResponse = await axios.get(`${RAG_API_URL}/health`, { timeout: 5000 });
        console.log('✅ Health check passed:', healthResponse.data);
    } catch (error) {
        console.error('❌ Health check failed:', error.message);
        if (error.code === 'ECONNREFUSED') {
            console.error('   → Python RAG API server is not running!');
            console.error('   → Start it with: npm run rag-api');
        }
        return;
    }
    
    // Test 2: Chat endpoint
    console.log('\n2️⃣ Testing chat endpoint...');
    try {
        const chatResponse = await axios.post(`${RAG_API_URL}/chat`, {
            query: 'Hello, test message',
            student_course: null,
            student_school: null,
            k: 3,
            use_base: true
        }, { timeout: 30000 });
        
        console.log('✅ Chat endpoint response:', {
            success: chatResponse.data.success,
            response: chatResponse.data.response?.substring(0, 100) + '...',
            query_type: chatResponse.data.query_type
        });
    } catch (error) {
        console.error('❌ Chat endpoint failed:', error.message);
        if (error.response) {
            console.error('   → Response status:', error.response.status);
            console.error('   → Response data:', error.response.data);
        }
        if (error.code === 'ECONNREFUSED') {
            console.error('   → Python RAG API server is not running!');
        }
    }
    
    console.log('\n✅ Connection test complete!');
}

testConnection().catch(console.error);

