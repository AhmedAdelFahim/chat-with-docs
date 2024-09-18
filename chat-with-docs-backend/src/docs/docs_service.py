import uuid
import semchunk
from transformers import AutoTokenizer
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_core.documents import Document
from langchain_text_splitters import RecursiveCharacterTextSplitter
from sqlalchemy.orm import Session
from database.database_service import save_docs, engine
from utils.constants import MODELS
from docs.docs_model import CollectionItem, EmbeddingItem
from fastapi.encoders import jsonable_encoder
from sqlalchemy import func, cast, Text

def preprocess_chunk(chunk):
    print('\n----------------' + chunk+'\n----------------')
    return chunk.lower()

def to_docs(chunks):
    docs = []
    for chunk in chunks:
        doc = Document(
            page_content=preprocess_chunk(chunk),
            metadata={
                "id": str(uuid.uuid4())
            }
        )
        docs.append(doc)
    return docs


def split_text_into_docs(txt):
    chunk_size = 500
    chunker = semchunk.chunkerify('umarbutler/emubert', chunk_size) or \
           semchunk.chunkerify('cl100k_base', chunk_size) or \
           semchunk.chunkerify(AutoTokenizer.from_pretrained('umarbutler/emubert'), chunk_size) or \
           semchunk.chunkerify(lambda text: len(text.split()), chunk_size)
    # text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=100)
    # splitted_txt = text_splitter.split_text(txt)
    splitted_txt = chunker(txt)
    docs = to_docs(splitted_txt)
    return docs

def save_embeddings(docs, collection_name):
    embeddings = HuggingFaceEmbeddings(model_name=MODELS['MODEL_ALL_MINI_LM_L6_V2'])
    save_docs(docs, embeddings, collection_name=collection_name)
  
def list_collections():
    session = Session(engine)
    q = session.query(CollectionItem, func.count(CollectionItem.name)).join(EmbeddingItem, EmbeddingItem.collection_id == CollectionItem.uuid, isouter=True).group_by(CollectionItem.name, CollectionItem.uuid)
    res = session.execute(q)
    collections = []
    for (item, count) in res.all():
        i = jsonable_encoder(item)
        i["chunks_num"] = count
        collections.append(i)
    return collections

def delete_collection(uuid):
    session = Session(engine)    
    q = session.query(CollectionItem).filter(cast(CollectionItem.uuid, Text) == uuid).delete()
    session.commit()
    return q    


# embeddings = HuggingFaceEmbeddings(model_name=MODELS['MODEL_ALL_MINI_LM_L6_V2'])
# get_instance(embeddings)
