from langchain_postgres import PGVector
from langchain_openai import OpenAIEmbeddings
from dotenv import load_dotenv
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from langchain_openai import ChatOpenAI
from langchain.messages import HumanMessage

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
    model="gpt-5-nano",
    # stream_usage=True,
    # temperature=None,
    # max_tokens=None,
    # timeout=None,
    # reasoning_effort="low",
    # max_retries=2,
    # api_key="...",  # If you prefer to pass api key in directly
    # base_url="...",
    # organization="...",
    # other params...
)






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

    prompt = f"""Based on the following context:{context}, answer the question:{query} and if you have no context for the query then answer that i dont have answer for that """

    # Invoke LLM and get response
    response = llm.invoke(prompt)

    # Print the answer
    print(type(response.content))
    return response.content

