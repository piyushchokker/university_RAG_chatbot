"""
Streamlit App to Test Chatbot API
Run with: streamlit run test_chatbot_streamlit.py
"""

import streamlit as st
import requests
import json
from datetime import datetime

# Configuration
NODE_API_URL = "http://localhost:3000"
RAG_API_URL = "http://localhost:5000"

# Page config
st.set_page_config(
    page_title="KChat API Tester",
    page_icon="🤖",
    layout="wide"
)

# Initialize session state
if 'messages' not in st.session_state:
    st.session_state.messages = []
if 'auth_token' not in st.session_state:
    st.session_state.auth_token = None
if 'user_info' not in st.session_state:
    st.session_state.user_info = None

def check_api_health():
    """Check if both APIs are running"""
    status = {
        'node_api': False,
        'rag_api': False
    }
    
    try:
        response = requests.get(f"{NODE_API_URL}/api/health", timeout=5)
        if response.status_code == 200:
            status['node_api'] = True
    except:
        pass
    
    try:
        response = requests.get(f"{RAG_API_URL}/health", timeout=5)
        if response.status_code == 200:
            status['rag_api'] = True
    except:
        pass
    
    return status

def login(email, password, user_type='student'):
    """Login and get auth token"""
    try:
        response = requests.post(
            f"{NODE_API_URL}/api/auth/login",
            json={
                "email": email,
                "password": password,
                "userType": user_type
            },
            timeout=10
        )
        
        if response.status_code == 200:
            data = response.json()
            if data.get('success'):
                return data.get('token'), data.get('student') or data.get('registrar')
        return None, None
    except Exception as e:
        st.error(f"Login error: {str(e)}")
        return None, None

def send_chat_message(message, token):
    """Send message to chat API"""
    try:
        response = requests.post(
            f"{NODE_API_URL}/api/chat",
            headers={
                "Authorization": f"Bearer {token}",
                "Content-Type": "application/json"
            },
            json={"message": message},
            timeout=30
        )
        
        if response.status_code == 200:
            return response.json()
        else:
            return {"success": False, "message": f"Error: {response.status_code}"}
    except Exception as e:
        return {"success": False, "message": f"Request error: {str(e)}"}

# Main UI
st.title("🤖 KChat API Tester")
st.markdown("Test the chatbot API with a simple interface")

# Sidebar for configuration
with st.sidebar:
    st.header("⚙️ Configuration")
    
    # API Status
    st.subheader("API Status")
    api_status = check_api_health()
    
    if api_status['node_api']:
        st.success("✅ Node.js API: Running")
    else:
        st.error("❌ Node.js API: Not running")
        st.info("Start with: `npm start`")
    
    if api_status['rag_api']:
        st.success("✅ Python RAG API: Running")
    else:
        st.error("❌ Python RAG API: Not running")
        st.info("Start with: `npm run rag-api`")
    
    st.divider()
    
    # Login Section
    st.subheader("🔐 Authentication")
    
    if st.session_state.auth_token:
        st.success("✅ Logged in")
        if st.session_state.user_info:
            st.json(st.session_state.user_info)
        if st.button("Logout"):
            st.session_state.auth_token = None
            st.session_state.user_info = None
            st.session_state.messages = []
            st.rerun()
    else:
        with st.form("login_form"):
            email = st.text_input("Email", value="student1@krmangalam.edu.in")
            password = st.text_input("Password", type="password", value="Student@123")
            user_type = st.selectbox("User Type", ["student", "registrar"])
            
            if st.form_submit_button("Login"):
                with st.spinner("Logging in..."):
                    token, user_info = login(email, password, user_type)
                    if token:
                        st.session_state.auth_token = token
                        st.session_state.user_info = user_info
                        st.success("Login successful!")
                        st.rerun()
                    else:
                        st.error("Login failed. Check credentials.")

# Main chat interface
if not st.session_state.auth_token:
    st.warning("⚠️ Please login in the sidebar to use the chatbot")
    st.info("""
    **Default Test Credentials:**
    - Email: `student1@krmangalam.edu.in`
    - Password: `Student@123`
    - User Type: `student`
    """)
else:
    # Display chat history
    st.subheader("💬 Chat")
    
    # Chat container
    chat_container = st.container()
    
    with chat_container:
        for message in st.session_state.messages:
            with st.chat_message(message["role"]):
                st.markdown(message["content"])
                if message.get("metadata"):
                    with st.expander("📋 Response Details"):
                        st.json(message["metadata"])
    
    # Chat input
    if prompt := st.chat_input("Type your message here..."):
        # Add user message
        st.session_state.messages.append({
            "role": "user",
            "content": prompt,
            "timestamp": datetime.now().isoformat()
        })
        
        # Display user message
        with st.chat_message("user"):
            st.markdown(prompt)
        
        # Get bot response
        with st.chat_message("assistant"):
            with st.spinner("Thinking..."):
                response = send_chat_message(prompt, st.session_state.auth_token)
                
                if response.get("success"):
                    answer = response.get("response", "No response received")
                    st.markdown(answer)
                    
                    # Show metadata
                    metadata = {
                        "query_type": response.get("query_type"),
                        "sources_count": len(response.get("sources", [])),
                        "sources": response.get("sources", [])
                    }
                    
                    with st.expander("📋 Response Details"):
                        st.json(metadata)
                        if response.get("sources"):
                            st.subheader("📚 Sources")
                            for i, source in enumerate(response.get("sources", [])[:5], 1):
                                st.text(f"Source {i}: {source.get('source_file', 'Unknown')}")
                else:
                    error_msg = response.get("message", "Unknown error")
                    st.error(f"❌ Error: {error_msg}")
                    metadata = {"error": error_msg}
                
                # Add bot message to history
                st.session_state.messages.append({
                    "role": "assistant",
                    "content": answer if response.get("success") else error_msg,
                    "metadata": metadata,
                    "timestamp": datetime.now().isoformat()
                })
    
    # Clear chat button
    if st.button("🗑️ Clear Chat History"):
        st.session_state.messages = []
        st.rerun()
    
    # Show chat stats
    if st.session_state.messages:
        st.divider()
        st.caption(f"Total messages: {len(st.session_state.messages)}")

# Footer
st.divider()
st.caption("💡 Tip: Make sure both Node.js and Python RAG API servers are running before testing")

