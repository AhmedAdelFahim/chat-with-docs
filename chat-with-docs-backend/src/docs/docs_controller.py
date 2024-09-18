from typing import Union
from fastapi import APIRouter, UploadFile,Form

from docs.docs_service import list_collections, split_text_into_docs, save_embeddings, delete_collection

router = APIRouter()


@router.post("/load")
async def load_doc(category_name: str = Form(), file: Union[UploadFile, None] = Form()):
    print(category_name, file)
    if (file):   
        if file.content_type == 'text/plain':
            content = file.file.read().decode("utf-8")
            docs = split_text_into_docs(content)
            save_embeddings(docs, collection_name = category_name)
        return {"message": "saved successfully"}
    else:
        raise 'no file provided'

@router.get("/list")
async def list_doc():
    collections = list_collections()
    return {
        "collections": collections
    }
    
@router.delete("/{uuid}")
async def delete_doc(uuid: str):
    print(uuid, 'ooooooooooooooooo')
    res = delete_collection(uuid)
    return {
        "message": "delete successfully"
    }
