# K.R. Mangalam University - RAG-Based Chatbot System

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [System Architecture](#system-architecture)
3. [Features](#features)
4. [Technology Stack](#technology-stack)
5. [Project Structure](#project-structure)
6. [Installation & Setup](#installation--setup)
7. [Configuration](#configuration)
8. [Usage Guide](#usage-guide)
9. [API Documentation](#api-documentation)
10. [Database Schema](#database-schema)
11. [RAG System Details](#rag-system-details)
12. [Testing](#testing)
13. [Deployment](#deployment)
14. [Troubleshooting](#troubleshooting)
15. [Future Enhancements](#future-enhancements)

---

## 🎯 Project Overview

This project is a **Retrieval-Augmented Generation (RAG)** based chatbot system for K.R. Mangalam University. The system allows students to ask questions about university-related information, and provides intelligent responses based on documents uploaded by the registrar office.

### Key Objectives

- Provide 24/7 automated assistance to students
- Centralized knowledge base management through document uploads
- Hierarchical document organization by school and course
- Intelligent query routing (general vs. course-specific)
- Secure authentication for students and registrar personnel

### User Roles

1. **Students**: Can login and chat with the AI assistant
2. **Registrar Office**: Can upload and manage documents for the knowledge base

---

## 🏗️ System Architecture

### High-Level Architecture

```
┌─────────────────┐
│   Frontend      │
│  (HTML/CSS/JS)  │
└────────┬────────┘
         │
         │ HTTP/REST
         │
┌────────▼─────────────────────────────────┐
│      Node.js Backend (Express)          │
│  - Authentication (JWT)                 │
│  - Document Management                    │
│  - API Routing                            │
└────────┬─────────────────────────────────┘
         │
         │ HTTP/REST (Axios)
         │
┌────────▼─────────────────────────────────┐
│   Python RAG API (Flask)                 │
│  - Document Vectorization                 │
│  - Query Processing                       │
│  - LLM Integration (Google Gemini)         │
└────────┬─────────────────────────────────┘
         │
         │
┌────────▼─────────────────────────────────┐
│   Vector Database (ChromaDB)             │
│  - Hierarchical Storage                   │
│  - Semantic Search                         │
└──────────────────────────────────────────┘
```

### Data Flow

1. **Document Upload Flow:**
   - Registrar uploads PDF → Node.js backend
   - File saved to `uploads/school/course/`
   - Metadata stored in SQLite database
   - Background process triggers Python RAG API
   - Python API vectorizes document → ChromaDB
   - Vector store saved to `vector_stores/school/course/`

2. **Query Flow:**
   - Student sends message → Node.js backend
   - Node.js authenticates and extracts student context
   - Node.js calls Python RAG API with query + context
   - Python API detects query type (general/course-specific)
   - Retrieves relevant chunks from appropriate vector store(s)
   - Generates answer using Google Gemini LLM
   - Returns response to Node.js → Frontend → Student

---

## ✨ Features

### Student Features
- ✅ Secure login with email/password
- ✅ Interactive chat interface
- ✅ Course-specific context awareness
- ✅ General university information queries
- ✅ Source citations for answers
- ✅ Session management

### Registrar Features
- ✅ Secure login for registrar personnel
- ✅ Document upload with metadata
- ✅ Hierarchical organization (School → Course)
- ✅ General university document repository
- ✅ Document management (view, delete)
- ✅ Automatic vectorization

### System Features
- ✅ Hierarchical vector database structure
- ✅ Intelligent query routing
- ✅ Multi-source retrieval
- ✅ Conversation history logging
- ✅ Error handling and fallbacks

---

## 🛠️ Technology Stack

### Frontend
- **HTML5** - Structure
- **CSS3** - Styling (custom with gradients matching university branding)
- **JavaScript (ES6+)** - Client-side logic
- **Fetch API** - HTTP requests

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **SQLite3** - Database
- **JWT (jsonwebtoken)** - Authentication
- **bcryptjs** - Password hashing
- **Multer** - File upload handling
- **Axios** - HTTP client for Python API communication

### RAG System
- **Python 3.x** - Runtime
- **Flask** - API framework
- **Flask-CORS** - Cross-origin resource sharing
- **LangChain** - LLM framework
- **ChromaDB** - Vector database
- **SentenceTransformers** - Embeddings
- **Google Gemini API** - Large Language Model
- **PyPDF2** - PDF processing

### Development Tools
- **Streamlit** - Testing interface
- **Nodemon** - Development server (optional)

---

## 📁 Project Structure

```
DeanProject/
│
├── index.html                 # Login page (Student/Registrar)
├── dashboard.html             # Chatbot interface (Student)
├── registrar.html             # Document upload page (Registrar)
│
├── styles.css                 # Login page styles
├── chatbot.css                # Chatbot interface styles
├── registrar.css              # Registrar page styles
│
├── script.js                  # Login logic
├── chatbot.js                 # Chatbot frontend logic
├── registrar.js               # Registrar page logic
│
├── server.js                  # Main Node.js server
├── package.json               # Node.js dependencies
│
├── routes/
│   ├── auth.js                # Authentication routes
│   ├── documents.js            # Document management routes
│   └── chat.js                 # Chat API routes
│
├── database/
│   ├── db.js                  # Database operations
│   └── university.db           # SQLite database file
│
├── middleware/
│   └── auth.js                 # JWT authentication middleware
│
├── uploads/                   # Uploaded documents (hierarchical)
│   ├── base/
│   │   └── [course]/
│   └── [school]/
│       └── [course]/
│
├── kchatmodel/                # Python RAG system
│   ├── api_server.py           # Flask API server
│   ├── rag_utils.py            # RAG core functions
│   ├── start_rag_api.py        # API server launcher
│   └── requirements.txt        # Python dependencies
│
├── vector_stores/              # ChromaDB vector databases (hierarchical)
│   ├── base/
│   │   └── [course]/
│   └── [school]/
│       └── [course]/
│
├── test_chatbot_streamlit.py  # Streamlit testing app
├── test-rag-connection.js     # RAG API connection test
├── test-chat-api.js            # Full chat flow test
│
└── PROJECT_DOCUMENTATION.md    # This file
```

---

## 🚀 Installation & Setup

### Prerequisites

- **Node.js** (v14 or higher)
- **Python** (v3.8 or higher)
- **npm** (comes with Node.js)
- **pip** (Python package manager)
- **Google API Key** (for Gemini LLM)

### Step 1: Clone/Download Project

```bash
cd DeanProject
```

### Step 2: Install Node.js Dependencies

```bash
npm install
```

This installs:
- express
- cors
- bcryptjs
- sqlite3
- dotenv
- jsonwebtoken
- multer
- axios

### Step 3: Install Python Dependencies

```bash
cd kchatmodel
pip install -r requirements.txt
```

Or install specific packages:
```bash
pip install flask flask-cors langchain chromadb sentence-transformers google-generativeai pypdf2
```

### Step 4: Environment Configuration

Create a `.env` file in the root directory:

```env
# JWT Secret Key (change in production)
JWT_SECRET=your-super-secret-jwt-key-here

# Google Gemini API Key
GOOGLE_API_KEY=your-google-api-key-here

# RAG API Configuration
RAG_API_URL=http://localhost:5000
RAG_API_PORT=5000

# Server Port
PORT=3000
```

### Step 5: Initialize Database

The database will be created automatically on first server start, but you can manually initialize:

```bash
npm run init-db
```

### Step 6: Start Servers

**Terminal 1 - Python RAG API:**
```bash
npm run rag-api
```

**Terminal 2 - Node.js Server:**
```bash
npm start
```

### Step 7: Access Application

- **Login Page:** http://localhost:3000
- **Chatbot (after login):** http://localhost:3000/dashboard.html
- **Registrar Page (after login):** http://localhost:3000/registrar.html

---

## ⚙️ Configuration

### Database Configuration

The system uses SQLite3. Database file location: `database/university.db`

### File Upload Configuration

- **Base Directory:** `uploads/`
- **Max File Size:** Configured in `routes/documents.js`
- **Allowed Types:** PDF (configurable)

### Vector Store Configuration

- **Base Directory:** `vector_stores/`
- **Embedding Model:** SentenceTransformers (default)
- **Chunk Size:** 1000 characters (configurable)
- **Chunk Overlap:** 100 characters (configurable)

### LLM Configuration

- **Model:** Google Gemini 2.5 Flash
- **Temperature:** 0 (deterministic responses)
- **API Endpoint:** Configured via `GOOGLE_API_KEY`

---

## 📖 Usage Guide

### For Students

1. **Login:**
   - Go to http://localhost:3000
   - Select "Student" option
   - Enter email and password
   - Click "Login"

2. **Using the Chatbot:**
   - Type your question in the chat input
   - Wait for response
   - View source information by expanding "Response Details"
   - Ask follow-up questions

3. **Example Questions:**
   - "What are the admission requirements?"
   - "Tell me about my course curriculum"
   - "What are the hostel facilities?"
   - "When are the exams scheduled?"

### For Registrar Office

1. **Login:**
   - Go to http://localhost:3000
   - Select "Registrar" option
   - Enter registrar email and password
   - Click "Login"

2. **Upload Documents:**
   - Select School (or "Upload to KRMU" for general docs)
   - Select Course (or category for general docs)
   - Enter document title
   - Select document type
   - Enter academic year (optional)
   - Add description (optional)
   - Choose PDF file
   - Click "Upload Document"

3. **View Uploaded Documents:**
   - Scroll down to see uploaded documents
   - Documents are organized by school and course
   - View metadata and upload date

---

## 🔌 API Documentation

### Authentication Endpoints

#### POST `/api/auth/login`

Login endpoint for students and registrars.

**Request Body:**
```json
{
  "email": "student1@krmangalam.edu.in",
  "password": "Student@123",
  "userType": "student"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "jwt_token_here",
  "userType": "student",
  "student": {
    "id": 1,
    "student_id": "STU001",
    "full_name": "John Doe",
    "email": "student1@krmangalam.edu.in",
    "course": "B.Tech Computer Science"
  }
}
```

### Document Management Endpoints

#### POST `/api/documents/upload`

Upload a document (requires authentication).

**Headers:**
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Form Data:**
- `school`: School code (e.g., "soet", "base")
- `course`: Course code (e.g., "btech_cse", "general")
- `documentTitle`: Document title
- `documentType`: Type of document
- `academicYear`: Academic year (optional)
- `description`: Description (optional)
- `file`: PDF file

**Response:**
```json
{
  "success": true,
  "message": "Document uploaded successfully. Vectorization in progress.",
  "document": {
    "id": 1,
    "school": "soet",
    "course": "btech_cse",
    "document_title": "Course Curriculum 2024",
    "filename": "curriculum_2024.pdf",
    "uploaded_at": "2024-01-15T10:30:00Z"
  }
}
```

#### GET `/api/documents`

Get all documents (requires authentication).

**Response:**
```json
{
  "success": true,
  "documents": [
    {
      "id": 1,
      "school": "soet",
      "course": "btech_cse",
      "document_title": "Course Curriculum 2024",
      "filename": "curriculum_2024.pdf",
      "uploaded_at": "2024-01-15T10:30:00Z"
    }
  ]
}
```

### Chat Endpoints

#### POST `/api/chat`

Send a chat message (requires authentication).

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "message": "What are the admission requirements?"
}
```

**Response:**
```json
{
  "success": true,
  "response": "Based on the information available...",
  "sources": [
    {
      "source_file": "admission_guide.pdf",
      "school": "base",
      "course": "admissions"
    }
  ],
  "query_type": "general"
}
```

### Python RAG API Endpoints

#### GET `/health`

Health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "message": "RAG API server is running"
}
```

#### POST `/chat`

Process chat query (called by Node.js backend).

**Request Body:**
```json
{
  "query": "What are the admission requirements?",
  "student_course": "B.Tech Computer Science",
  "student_school": "soet",
  "k": 3,
  "use_base": true
}
```

**Response:**
```json
{
  "success": true,
  "response": "Based on the information...",
  "sources": [...],
  "query_type": "general"
}
```

#### POST `/process-document`

Vectorize a document (called by Node.js backend).

**Request Body:**
```json
{
  "file_path": "uploads/soet/btech_cse/curriculum.pdf",
  "school": "soet",
  "course": "btech_cse",
  "chunk_size": 1000,
  "chunk_overlap": 100
}
```

**Response:**
```json
{
  "success": true,
  "message": "Document processed successfully",
  "chunks_created": 45
}
```

---

## 🗄️ Database Schema

### Students Table

```sql
CREATE TABLE students (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    full_name TEXT NOT NULL,
    course TEXT NOT NULL,
    phone TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Registrars Table

```sql
CREATE TABLE registrars (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    full_name TEXT NOT NULL,
    department TEXT,
    phone TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Documents Table

```sql
CREATE TABLE documents (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    registrar_id INTEGER NOT NULL,
    school TEXT NOT NULL,
    course TEXT NOT NULL,
    document_title TEXT NOT NULL,
    document_type TEXT NOT NULL,
    academic_year TEXT,
    description TEXT,
    filename TEXT NOT NULL,
    original_filename TEXT NOT NULL,
    file_path TEXT NOT NULL,
    file_size INTEGER NOT NULL,
    mime_type TEXT DEFAULT 'application/pdf',
    uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (registrar_id) REFERENCES registrars(id) ON DELETE CASCADE
);
```

### Indexes

- `idx_student_email` on `students(email)`
- `idx_registrar_email` on `registrars(email)`
- `idx_documents_school` on `documents(school)`
- `idx_documents_course` on `documents(course)`
- `idx_documents_school_course` on `documents(school, course)`

---

## 🤖 RAG System Details

### Query Type Detection

The system automatically detects whether a query is:
- **General**: University-wide information (admissions, fees, facilities)
- **Course-Specific**: Information about a particular course or school

**Detection Logic:**
- Keyword matching for course/school names
- Student context (if logged in)
- Query content analysis

### Vector Store Hierarchy

```
vector_stores/
├── base/                    # General university documents
│   ├── general/
│   ├── admissions/
│   ├── examinations/
│   ├── scholarships/
│   └── ...
└── [school]/                # School-specific documents
    └── [course]/
        └── [vector_db]
```

### Retrieval Process

1. **Query Analysis**: Determine if general or course-specific
2. **Vector Store Selection**: Choose appropriate store(s)
3. **Semantic Search**: Find relevant document chunks
4. **Context Assembly**: Combine retrieved chunks
5. **LLM Generation**: Generate answer using Gemini
6. **Response Formatting**: Return answer with sources

### Chunking Strategy

- **Chunk Size**: 1000 characters
- **Chunk Overlap**: 100 characters
- **Method**: Recursive character text splitter
- **Metadata**: Includes school, course, source file

---

## 🧪 Testing

### Test Scripts

1. **Test RAG API Connection:**
   ```bash
   npm run test:rag
   ```

2. **Test Full Chat Flow:**
   ```bash
   npm run test:chat
   ```

3. **Streamlit Testing Interface:**
   ```bash
   npm run test:streamlit
   # Or: streamlit run test_chatbot_streamlit.py
   ```

### Manual Testing

1. **Login Test:**
   - Test student login
   - Test registrar login
   - Test invalid credentials

2. **Chat Test:**
   - General queries
   - Course-specific queries
   - Edge cases (empty queries, long queries)

3. **Document Upload Test:**
   - Upload to different schools/courses
   - Upload general documents
   - Verify vectorization

### Test Credentials

**Student:**
- Email: `student1@krmangalam.edu.in`
- Password: `Student@123`

**Registrar:**
- Email: `registrar@krmangalam.edu.in`
- Password: `Registrar@123`

---

## 🚢 Deployment

### Production Considerations

1. **Environment Variables:**
   - Use strong `JWT_SECRET`
   - Secure `GOOGLE_API_KEY`
   - Configure production database

2. **Security:**
   - Enable HTTPS
   - Implement rate limiting
   - Add input validation
   - Sanitize file uploads

3. **Performance:**
   - Use production-grade database (PostgreSQL)
   - Implement caching
   - Optimize vector store queries
   - Use CDN for static files

4. **Monitoring:**
   - Log all API requests
   - Monitor error rates
   - Track response times
   - Set up alerts

### Deployment Steps

1. Set up production server
2. Install dependencies
3. Configure environment variables
4. Initialize database
5. Set up process managers (PM2 for Node.js, systemd for Python)
6. Configure reverse proxy (Nginx)
7. Set up SSL certificates
8. Deploy and test

---

## 🔧 Troubleshooting

### Common Issues

#### 1. "ModuleNotFoundError: No module named 'flask_cors'"

**Solution:**
```bash
pip install flask-cors
# Or
pip install -r kchatmodel/requirements.txt
```

#### 2. "ECONNREFUSED" when calling RAG API

**Solution:**
- Ensure Python RAG API is running: `npm run rag-api`
- Check if port 5000 is available
- Verify `RAG_API_URL` in environment

#### 3. "Invalid password" on login

**Solution:**
- Check database has seeded users
- Verify password hashing
- Run migration: `npm run migrate`

#### 4. Chat returns "I'm still learning" message

**Solution:**
- Check both servers are running
- Verify Python RAG API is accessible
- Check browser console for errors
- Verify `.env` has `GOOGLE_API_KEY`

#### 5. Documents not vectorizing

**Solution:**
- Check Python RAG API logs
- Verify file paths are correct
- Check ChromaDB permissions
- Ensure `GOOGLE_API_KEY` is set

#### 6. PowerShell execution policy error

**Solution:**
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

Or run commands directly:
```bash
cd kchatmodel
python start_rag_api.py
```

### Debug Mode

Enable debug logging:

**Node.js:**
```javascript
// In server.js
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});
```

**Python:**
```python
# In api_server.py
app.run(debug=True)
```

---

## 🔮 Future Enhancements

### Planned Features

- [ ] Multi-language support
- [ ] Voice input/output
- [ ] File upload from chat (for student queries)
- [ ] Advanced analytics dashboard
- [ ] Email notifications
- [ ] Integration with university systems
- [ ] Mobile app
- [ ] Admin panel for document management
- [ ] Conversation export
- [ ] Feedback system
- [ ] A/B testing for responses
- [ ] Advanced query understanding
- [ ] Multi-modal support (images, tables)

### Technical Improvements

- [ ] Migrate to PostgreSQL for production
- [ ] Implement Redis caching
- [ ] Add rate limiting
- [ ] Implement WebSocket for real-time chat
- [ ] Add unit and integration tests
- [ ] CI/CD pipeline
- [ ] Docker containerization
- [ ] Kubernetes deployment
- [ ] Monitoring and logging (ELK stack)
- [ ] Performance optimization

---

## 📝 License

[Specify your license here]

## 👥 Contributors

[Add contributor names]

## 📞 Support

For issues and questions:
- Create an issue in the repository
- Contact the development team
- Check the troubleshooting section

---

## 📚 Additional Resources

- [LangChain Documentation](https://python.langchain.com/)
- [ChromaDB Documentation](https://docs.trychroma.com/)
- [Google Gemini API](https://ai.google.dev/)
- [Express.js Guide](https://expressjs.com/)
- [Streamlit Documentation](https://docs.streamlit.io/)

---

**Last Updated:** [Current Date]
**Version:** 1.0.0

