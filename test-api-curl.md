# API Testing Guide

## Quick Test Commands

### 1. Test Python RAG API Health
```bash
curl http://localhost:5000/health
```

### 2. Test Node.js API Health
```bash
curl http://localhost:3000/api/health
```

### 3. Test Login (Get Auth Token)
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"student1@krmangalam.edu.in\",\"password\":\"Student@123\",\"userType\":\"student\"}"
```

### 4. Test Chat API (Replace TOKEN with actual token from step 3)
```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d "{\"message\":\"Hello, what are the admission requirements?\"}"
```

### 5. Test Python RAG API Directly
```bash
curl -X POST http://localhost:5000/chat \
  -H "Content-Type: application/json" \
  -d "{\"query\":\"Hello\",\"student_course\":null,\"student_school\":null,\"k\":3,\"use_base\":true}"
```

## Using Browser Console

Open browser DevTools (F12) → Console tab, then paste:

```javascript
// Test login
fetch('http://localhost:3000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'student1@krmangalam.edu.in',
    password: 'Student@123',
    userType: 'student'
  })
})
.then(r => r.json())
.then(data => {
  console.log('Login:', data);
  const token = data.token;
  
  // Test chat
  return fetch('http://localhost:3000/api/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ message: 'Hello' })
  });
})
.then(r => r.json())
.then(data => console.log('Chat Response:', data))
.catch(err => console.error('Error:', err));
```

