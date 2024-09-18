from langchain_postgres import PGVector
from sqlalchemy import create_engine
from sqlalchemy.orm import Session
POSTGRES_CONNECTION = "postgresql+psycopg://postgres:postgress@0.0.0.0:5454/chat_with_docs"
engine = create_engine(POSTGRES_CONNECTION, echo=True)

def get_instance(embeddings, collection_name = None):
    db = PGVector(
                embeddings=embeddings,
                connection=POSTGRES_CONNECTION,
                collection_name=collection_name,
                use_jsonb=True,
            )
    return db

def save_docs(docs, embeddings, collection_name = None):
    db = PGVector.from_documents(docs, 
                                 embedding=embeddings, 
                                 connection=POSTGRES_CONNECTION,
                                 collection_name=collection_name,
                                 use_jsonb=True,
                                 collection_metadata={"hnsw:space": "cosine"})
    return db