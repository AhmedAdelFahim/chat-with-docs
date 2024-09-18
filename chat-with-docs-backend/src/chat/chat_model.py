from pydantic import BaseModel
from typing import Union
from fastapi import UploadFile

class AskingModel(BaseModel):
    question: str =None
    model_name: str =None
    response_type: str =None
    response_lang: str =None
    category_name: Union[str, None] =None
    file: Union[UploadFile, None] = None
    
class AnsweringModel(BaseModel):
    question: str =None
    model_name: str =None
    context: str =None
    response_lang: str =None
    