# RAG Chatbot API Integration

## Architecture Overview

The system uses a hybrid architecture:
- **Node.js/Express**: Main API server (authentication, document management)
- **Python/Flask**: RAG API server (vectorization, query processing)
- **ChromaDB**: Hierarchical vector stores for fast retrieval

## Setup Instructions

### 1. Install Python Dependencies

```bash
cd kchatmodel
pip install -r requirements.txt
```

### 2. Set Environment Variables

Create a `.env` file in the project root:

```env
GOOGLE_API_KEY=your_google_api_key_here
RAG_API_URL=http://localhost:5000
RAG_API_PORT=5000
```

### 3. Start Python RAG API Server

```bash
# Option 1: Using npm script
npm run rag-api

# Option 2: Direct Python
cd kchatmodel
python start_rag_api.py
```

The RAG API will start on `http://localhost:5000`

### 4. Start Node.js Server

```bash
npm start
```

The main server will start on `http://localhost:3000`

## How It Works

### Document Upload Flow

1. Registrar uploads PDF via `/api/documents/upload`
2. File saved to `uploads/school/course/`
3. Document metadata saved to SQLite database
4. Background process calls Python API to vectorize document
5. Vector store created at `vector_store/school/course/`

### Query Flow

1. Student sends message via `/api/chat`
2. Node.js extracts student's course information
3. Node.js calls Python RAG API with query + context
4. Python detects query type (general vs course-specific)
5. Retrieves from appropriate vector store(s)
6. Returns answer with sources

### Hierarchical Vector Stores

```
vector_store/
├── base/
│   ├── general/
│   ├── admissions/
│   ├── examinations/
│   └── ...
├── soet/
│   ├── btech_cse/
│   ├── btech_it/
│   └── ...
├── som/
│   ├── mba/
│   ├── bba/
│   └── ...
└── ...
```

## API Endpoints

### Node.js API (Port 3000)

- `POST /api/chat` - Chat endpoint (requires JWT token)
- `POST /api/documents/upload` - Upload document (registrar only)
- `GET /api/documents` - Get all documents
- `DELETE /api/documents/:id` - Delete document

### Python RAG API (Port 5000)

- `POST /chat` - Process chat query
- `POST /process-document` - Vectorize a document
- `GET /vector-store-info` - Get vector store information
- `GET /health` - Health check

## Query Detection Logic

The system automatically detects if a query is:
- **General**: Searches base repository (admissions, fees, etc.)
- **Course-specific**: Searches specific school/course vector store

Detection uses:
- Keyword matching (course names, school names)
- Student's enrolled course context
- Query content analysis

## Testing

1. Start both servers:
   ```bash
   # Terminal 1: Python RAG API
   npm run rag-api
   
   # Terminal 2: Node.js Server
   npm start
   ```

2. Upload a document as registrar
3. Wait for vectorization (check console logs)
4. Ask questions as student in chatbot

## Troubleshooting

- **RAG API not responding**: Check if Python server is running on port 5000
- **Vectorization fails**: Check file paths and permissions
- **No answers**: Ensure documents are vectorized (check `vector_store/` folder)

