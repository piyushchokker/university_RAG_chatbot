// API Configuration
const API_BASE_URL = window.location.origin.includes('localhost') 
    ? 'http://127.0.0.1:5050/response' 
    : window.location.origin;

// const CHATBOT_API_URL = 'http://127.0.0.1:5050/response';

// Get student data from localStorage
let studentData = null;

// Initialize chatbot
document.addEventListener('DOMContentLoaded', function() {
    // Check authentication
    const token = localStorage.getItem('authToken');
    const storedStudentData = localStorage.getItem('studentData');
    
    if (!token || !storedStudentData) {
        window.location.href = '/index.html';
        return;
    }
    
    try {
        studentData = JSON.parse(storedStudentData);
        displayStudentInfo();
    } catch (error) {
        console.error('Error parsing student data:', error);
        window.location.href = '/index.html';
    }
    
    // Setup input handlers
    const messageInput = document.getElementById('messageInput');
    const sendButton = document.getElementById('sendButton');
    
    messageInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });
    
    messageInput.addEventListener('input', function() {
        sendButton.disabled = messageInput.value.trim() === '';
    });
    
    // Initial focus
    messageInput.focus();
});

// Display student information in header
function displayStudentInfo() {
    if (studentData) {
        const nameElement = document.getElementById('studentName');
        const courseElement = document.getElementById('studentCourse');
        
        if (nameElement) {
            nameElement.textContent = studentData.full_name || 'Student';
        }
        
        if (courseElement) {
            courseElement.textContent = studentData.course || 'Course';
        }
    }
}

// Send message
async function sendMessage() {
    const messageInput = document.getElementById('messageInput');
    const message = messageInput.value.trim();
    
    if (!message) return;
    
    // Hide welcome screen
    const welcomeScreen = document.getElementById('welcomeScreen');
    if (welcomeScreen) {
        welcomeScreen.style.display = 'none';
    }
    
    // Add user message to chat
    addMessage('user', message);
    
    // Clear input
    messageInput.value = '';
    document.getElementById('sendButton').disabled = false;
    
    // Show typing indicator
    showTypingIndicator();
    
    // Send to chatbot backend API
    try {
        const response = await fetch(
            `http://127.0.0.1:5050/response/${encodeURIComponent(message)}`
        );
        
        hideTypingIndicator();
        
        if (response.ok) {
            const botMessage = await response.text();
            // Remove surrounding quotes if present
            const cleanMessage = botMessage.replace(/^["']|["']$/g, '');
            addMessage('bot', cleanMessage);
        } else {
            addMessage('bot', 'Sorry, I encountered an error. Please try again.');
        }
    } catch (error) {
        console.error('Chat error:', error);
        hideTypingIndicator();
        
        // Check if it's a network error
        if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
            addMessage('bot', 'Unable to connect to the server. Please check if the server is running and try again.');
        } else {
            addMessage('bot', 'An error occurred while processing your message. Please try again.');
        }
    }
}

// Send suggestion
function sendSuggestion(suggestion) {
    const messageInput = document.getElementById('messageInput');
    messageInput.value = suggestion;
    sendMessage();
}

// Add message to chat
function addMessage(type, content) {
    const chatMessages = document.getElementById('chatMessages');
    const welcomeScreen = document.getElementById('welcomeScreen');
    
    if (welcomeScreen) {
        welcomeScreen.style.display = 'none';
    }
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    
    const avatar = document.createElement('div');
    avatar.className = 'message-avatar';
    
    if (type === 'user') {
        avatar.textContent = studentData?.full_name?.charAt(0).toUpperCase() || 'U';
    } else {
        // Use university logo for bot messages
        const logoImg = document.createElement('img');
        logoImg.src = 'images/krmu.jpeg';
        logoImg.alt = 'K.R. Mangalam University';
        logoImg.className = 'bot-avatar-logo';
        avatar.appendChild(logoImg);
    }
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    contentDiv.textContent = content;
    
    const timeDiv = document.createElement('div');
    timeDiv.className = 'message-time';
    timeDiv.textContent = new Date().toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
    });
    
    messageDiv.appendChild(avatar);
    messageDiv.appendChild(contentDiv);
    contentDiv.appendChild(timeDiv);
    
    chatMessages.appendChild(messageDiv);
    
    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Show typing indicator
function showTypingIndicator() {
    const typingIndicator = document.getElementById('typingIndicator');
    if (typingIndicator) {
        typingIndicator.classList.add('active');
        const chatMessages = document.getElementById('chatMessages');
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
}

// Hide typing indicator
function hideTypingIndicator() {
    const typingIndicator = document.getElementById('typingIndicator');
    if (typingIndicator) {
        typingIndicator.classList.remove('active');
    }
}

// Logout function
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('studentData');
        window.location.href = '/index.html';
    }
}

// Add welcome message on load
window.addEventListener('load', function() {
    // Optional: Add a welcome message from bot
    setTimeout(() => {
        // This can be enabled once backend is ready
        // addMessage('bot', `Hello ${studentData?.full_name || 'there'}! How can I help you today?`);
    }, 500);
});
