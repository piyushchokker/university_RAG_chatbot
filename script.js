// API Base URL - adjust if your server runs on a different port
const API_BASE_URL = window.location.origin.includes('localhost') 
    ? 'http://localhost:3000' 
    : window.location.origin;

// User Type Selection Handler
document.addEventListener('DOMContentLoaded', function() {
    const studentBtn = document.getElementById('studentBtn');
    const registrarBtn = document.getElementById('registrarBtn');
    const userTypeInput = document.getElementById('userType');
    
    studentBtn.addEventListener('click', function() {
        studentBtn.classList.add('active');
        registrarBtn.classList.remove('active');
        userTypeInput.value = 'student';
    });
    
    registrarBtn.addEventListener('click', function() {
        registrarBtn.classList.add('active');
        studentBtn.classList.remove('active');
        userTypeInput.value = 'registrar';
    });
});

// Login Form Handler
document.getElementById('loginForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const userType = document.getElementById('userType').value;
    const loginButton = document.querySelector('.login-button');
    const errorMessage = document.getElementById('error-message');
    
    // Clear previous errors
    if (errorMessage) {
        errorMessage.remove();
    }
    
    // Add loading state
    loginButton.classList.add('loading');
    loginButton.disabled = true;
    loginButton.querySelector('span').textContent = 'Logging in...';
    
    try {
        const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password, userType })
        });
        
        const data = await response.json();
        
        if (response.ok && data.success) {
            // Store token and user data
            localStorage.setItem('authToken', data.token);
            localStorage.setItem('userType', data.userType);
            
            if (data.userType === 'student') {
                localStorage.setItem('studentData', JSON.stringify(data.student));
            } else {
                localStorage.setItem('registrarData', JSON.stringify(data.registrar));
            }
            
            // Show success message
            loginButton.querySelector('span').textContent = 'Login Successful!';
            loginButton.style.background = 'linear-gradient(135deg, #00a000 0%, #00c800 100%)';
            
            // Redirect based on user type
            setTimeout(() => {
                if (data.userType === 'student') {
                    window.location.href = '/dashboard.html';
                } else {
                    window.location.href = '/registrar.html';
                }
            }, 1000);
        } else {
            // Show error message
            showErrorMessage(data.message || 'Invalid email or password');
            loginButton.querySelector('span').textContent = 'Login';
            loginButton.classList.remove('loading');
            loginButton.disabled = false;
        }
        
    } catch (error) {
        console.error('Login error:', error);
        showErrorMessage('Network error. Please check if the server is running.');
        loginButton.querySelector('span').textContent = 'Login';
        loginButton.classList.remove('loading');
        loginButton.disabled = false;
    }
});

// Function to show error messages
function showErrorMessage(message) {
    const form = document.getElementById('loginForm');
    const existingError = document.getElementById('error-message');
    
    if (existingError) {
        existingError.remove();
    }
    
    const errorDiv = document.createElement('div');
    errorDiv.id = 'error-message';
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    
    const loginButton = document.querySelector('.login-button');
    form.insertBefore(errorDiv, loginButton);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (errorDiv.parentNode) {
            errorDiv.remove();
        }
    }, 5000);
}

// Add some interactive effects
document.querySelectorAll('.form-group input').forEach(input => {
    input.addEventListener('focus', function() {
        this.parentElement.style.transform = 'scale(1.02)';
        this.parentElement.style.transition = 'transform 0.2s ease';
    });
    
    input.addEventListener('blur', function() {
        this.parentElement.style.transform = 'scale(1)';
    });
});

// Enter key to submit
document.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        const form = document.getElementById('loginForm');
        if (form) {
            form.dispatchEvent(new Event('submit'));
        }
    }
});
