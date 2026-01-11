/**
 * Test script for Chat API
 * This tests the full flow: Node.js API -> Python RAG API
 * 
 * Usage:
 * 1. Make sure both servers are running:
 *    - Terminal 1: npm run rag-api
 *    - Terminal 2: npm start
 * 2. Run this script: node test-chat-api.js
 */

const axios = require('axios');

const NODE_API_URL = 'http://localhost:3000';
const RAG_API_URL = 'http://localhost:5000';

// Test credentials (use a real student account from your database)
const TEST_EMAIL = 'student1@krmangalam.edu.in';
const TEST_PASSWORD = 'Student@123';

async function testChatAPI() {
    console.log('🧪 Testing Chat API Flow...\n');
    
    let authToken = null;
    
    // Step 1: Login to get token
    console.log('1️⃣ Logging in to get authentication token...');
    try {
        const loginResponse = await axios.post(`${NODE_API_URL}/api/auth/login`, {
            email: TEST_EMAIL,
            password: TEST_PASSWORD,
            userType: 'student'
        });
        
        if (loginResponse.data.success) {
            authToken = loginResponse.data.token;
            console.log('✅ Login successful!');
            console.log('   Student:', loginResponse.data.student?.full_name);
            console.log('   Course:', loginResponse.data.student?.course);
        } else {
            console.error('❌ Login failed:', loginResponse.data.message);
            return;
        }
    } catch (error) {
        console.error('❌ Login error:', error.message);
        if (error.response) {
            console.error('   Response:', error.response.data);
        }
        return;
    }
    
    // Step 2: Test health endpoints
    console.log('\n2️⃣ Testing health endpoints...');
    
    // Node.js health
    try {
        const nodeHealth = await axios.get(`${NODE_API_URL}/api/health`);
        console.log('✅ Node.js API:', nodeHealth.data.message);
    } catch (error) {
        console.error('❌ Node.js API health check failed:', error.message);
    }
    
    // Python RAG API health
    try {
        const ragHealth = await axios.get(`${RAG_API_URL}/health`);
        console.log('✅ Python RAG API:', ragHealth.data.message);
    } catch (error) {
        console.error('❌ Python RAG API health check failed:', error.message);
        console.error('   → Make sure Python RAG API is running: npm run rag-api');
        return;
    }
    
    // Step 3: Test chat endpoint
    console.log('\n3️⃣ Testing chat endpoint...');
    const testMessages = [
        'Hello',
        'What are the admission requirements?',
        'Tell me about my course'
    ];
    
    for (const message of testMessages) {
        console.log(`\n   📨 Sending: "${message}"`);
        try {
            const chatResponse = await axios.post(
                `${NODE_API_URL}/api/chat`,
                { message: message },
                {
                    headers: {
                        'Authorization': `Bearer ${authToken}`,
                        'Content-Type': 'application/json'
                    },
                    timeout: 30000
                }
            );
            
            if (chatResponse.data.success) {
                console.log('   ✅ Response received:');
                console.log('      Type:', chatResponse.data.query_type);
                console.log('      Answer:', chatResponse.data.response.substring(0, 150) + '...');
                if (chatResponse.data.sources && chatResponse.data.sources.length > 0) {
                    console.log('      Sources:', chatResponse.data.sources.length, 'documents');
                }
            } else {
                console.error('   ❌ Chat failed:', chatResponse.data.message);
            }
        } catch (error) {
            console.error('   ❌ Chat error:', error.message);
            if (error.response) {
                console.error('      Status:', error.response.status);
                console.error('      Data:', error.response.data);
            }
        }
        
        // Wait a bit between messages
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    console.log('\n✅ Chat API test complete!');
}

// Run the test
testChatAPI().catch(error => {
    console.error('❌ Test failed:', error);
    process.exit(1);
});

