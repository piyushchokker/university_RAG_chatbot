from langchain_postgres import PGVector
from langchain_openai import OpenAIEmbeddings
from dotenv import load_dotenv
import os
import json
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from langchain_openai import ChatOpenAI
from langchain.messages import AIMessage, SystemMessage, HumanMessage


load_dotenv()
app=FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

OPENAI_API_KEY=os.getenv("OPENAI_API_KEY")


embedding_model = OpenAIEmbeddings(api_key=OPENAI_API_KEY)

CONNECTION_STRING = "postgresql+psycopg2://postgres:root@localhost:5432/universitydb"

llm = ChatOpenAI(
    model="gpt-5-nano"
)


db=[]


@app.get("/response/{query}")
def qa(query):


    vectorstore = PGVector(
    connection=CONNECTION_STRING,
    embeddings=embedding_model,
    collection_name="vectordb",
    use_jsonb=True
    )


    docs = vectorstore.similarity_search(query,k=1)

    # Combine document contents into context
    context = "\n\n".join([doc.page_content for doc in docs])


    prompt = f"""Based on the following context:{context}, answer the question {query} and if you have no context for the query then answer that i dont have answer for that """ 

    db.append(HumanMessage(prompt))
    # Invoke LLM and get response
    response = llm.invoke(db)

    # Print the answer
    print(type(response.content))
    
    db.append(AIMessage(response.content))
    
    return response.content


@app.get("/api/file-status")
async def get_file_status():
    """Get the processing status of all files"""
    try:
        with open("file_processing_status.json", 'r') as f:
            return json.load(f)
    except FileNotFoundError:
        return {}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))