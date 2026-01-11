from watchdog.events import PatternMatchingEventHandler
from watchdog.observers import Observer
from pathlib import Path
import time
from unstructured.partition.pdf import partition_pdf
from unstructured.chunking.title import chunk_by_title
from langchain_core.documents import Document
from langchain_postgres import PGVector
from langchain_openai import OpenAIEmbeddings
from dotenv import load_dotenv
import os
from queue import Queue

files_queue=Queue()

load_dotenv()

OPENAI_API_KEY=os.getenv("OPENAI_API_KEY")


embedding_model = OpenAIEmbeddings(api_key=OPENAI_API_KEY)

CONNECTION_STRING = "postgresql+psycopg2://postgres:root@localhost:5432/universitydb"

vectorstore = PGVector(
    connection=CONNECTION_STRING,
    embeddings=embedding_model,
    collection_name="vectordb",
    use_jsonb=True
)



class MyHandler(PatternMatchingEventHandler):

    def on_created(self, event):
        if event.is_directory:
            return  # ignore folders

        file_path = Path(event.src_path)
        print(f"New file detected: {file_path.name}")

        time.sleep(2)
        files_queue.put(file_path)
     

def observer_setup():

    handler=MyHandler(patterns=["*.pdf","*.txt"],ignore_directories=True)

    observer = Observer()

    files_path=r"./uploads"

    observer.schedule(handler,files_path,recursive=True)

    observer.start()
    print("Watching folder... Press Ctrl+C to stop.")
    return observer




def text_extractor(chunks):
    docs=[]
    for chunk in chunks:
        docs.append(
            Document(
                page_content=chunk.text,
                metadata={
                    "source":chunk.metadata.filename,
                    "pages":chunk.metadata.page_number
                }
                
            )

        )

    return docs 


def main():

    # observer booting
    observer=observer_setup()


    while True:
        try:
            if not files_queue.empty() :
                item=files_queue.get()

                elements=partition_pdf(item,strategy="hi_res")

                chunks=chunk_by_title(
                    elements=elements,
                    max_characters=3000,
                    new_after_n_chars=2400,
                    combine_text_under_n_chars=500
                )

                docs=text_extractor(chunks=chunks)

                vectorstore.add_documents(docs)      

                print(f"created {len(chunks)} chunks")


            
            time.sleep(1)

        except KeyboardInterrupt:
            observer.stop()
            break

    observer.join()

if __name__ == "__main__":
    main()