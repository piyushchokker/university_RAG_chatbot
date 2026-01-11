# K.R. Mangalam University - RAG-Based Chatbot

A comprehensive RAG (Retrieval-Augmented Generation) chatbot system for university student assistance.

## 🚀 Quick Start

### Prerequisites
- Node.js (v14+)
- Python (v3.8+)
- Google API Key (for Gemini)

### Installation

```bash
# Install Node.js dependencies
npm install

# Install Python dependencies
cd kchatmodel
pip install -r requirements.txt
cd ..
```

### Configuration

Create `.env` file:
```env
JWT_SECRET=your-secret-key
GOOGLE_API_KEY=your-google-api-key
RAG_API_URL=http://localhost:5000
PORT=3000
```

### Run Servers

**Terminal 1 - Python RAG API:**
```bash
npm run rag-api
```

**Terminal 2 - Node.js Server:**
```bash
npm start
```

**Terminal 3 - Streamlit Tester (Optional):**
```bash
npm run test:streamlit
```

### Access

- **Login:** http://localhost:3000
- **Test Credentials:**
  - Student: `student1@krmangalam.edu.in` / `Student@123`
  - Registrar: `registrar@krmangalam.edu.in` / `Registrar@123`

## 📁 Project Structure

```
DeanProject/
├── Frontend (HTML/CSS/JS)
├── Backend (Node.js/Express)
├── Database (SQLite)
├── RAG System (Python/Flask)
└── Vector Stores (ChromaDB)
```

## 🎯 Features

- ✅ Student chatbot interface
- ✅ Registrar document management
- ✅ Hierarchical document organization
- ✅ Intelligent query routing
- ✅ Course-specific context awareness
- ✅ Secure authentication

## 📖 Documentation

See [PROJECT_DOCUMENTATION.md](./PROJECT_DOCUMENTATION.md) for complete documentation.

## 🧪 Testing

```bash
# Test RAG API connection
npm run test:rag

# Test full chat flow
npm run test:chat

# Streamlit testing interface
npm run test:streamlit
```

## 🛠️ Tech Stack

- **Frontend:** HTML, CSS, JavaScript
- **Backend:** Node.js, Express.js
- **Database:** SQLite
- **RAG:** Python, Flask, LangChain, ChromaDB
- **LLM:** Google Gemini

## 📝 License

[Your License Here]

---

For detailed documentation, see [PROJECT_DOCUMENTATION.md](./PROJECT_DOCUMENTATION.md)
