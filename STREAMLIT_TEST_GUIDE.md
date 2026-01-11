# Streamlit Chatbot API Tester

A simple Streamlit app to test the chatbot API without dealing with the full frontend.

## Quick Start

### 1. Install Streamlit (if not already installed)
```bash
pip install streamlit
```

Or install all requirements:
```bash
pip install -r kchatmodel/requirements.txt
```

### 2. Start Both Servers

**Terminal 1 - Python RAG API:**
```bash
npm run rag-api
```

**Terminal 2 - Node.js Server:**
```bash
npm start
```

### 3. Run Streamlit App

**Terminal 3 - Streamlit:**
```bash
streamlit run test_chatbot_streamlit.py
```

The app will open automatically in your browser at `http://localhost:8501`

## Features

✅ **API Status Check** - See if both APIs are running  
✅ **Easy Login** - Pre-filled with test credentials  
✅ **Chat Interface** - Simple chat UI to test messages  
✅ **Response Details** - View query type, sources, and metadata  
✅ **Chat History** - See all previous messages  
✅ **Error Handling** - Clear error messages if something goes wrong

## Default Test Credentials

- **Email:** `student1@krmangalam.edu.in`
- **Password:** `Student@123`
- **User Type:** `student`

## Usage

1. Check API status in the sidebar (both should be green ✅)
2. Login using the sidebar form (credentials are pre-filled)
3. Type your message in the chat input at the bottom
4. View the response and expand "Response Details" to see metadata
5. Continue chatting or clear history to start fresh

## Troubleshooting

**If Node.js API shows ❌:**
- Make sure `npm start` is running
- Check if port 3000 is available

**If Python RAG API shows ❌:**
- Make sure `npm run rag-api` is running
- Check if port 5000 is available
- Verify Python dependencies are installed

**If login fails:**
- Check the database has test users
- Verify credentials are correct
- Check Node.js server logs for errors

**If chat doesn't respond:**
- Check both API servers are running
- Look at server console logs for errors
- Verify `.env` file has `GOOGLE_API_KEY` set

