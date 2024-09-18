from typing import Union
from pydantic import BaseModel
from fastapi import UploadFile
from pgvector.sqlalchemy import Vector
from sqlalchemy.orm import DeclarativeBase
from sqlalchemy.orm import mapped_column
from sqlalchemy import String, Text, UUID
from sqlalchemy.orm import Mapped



class Base(DeclarativeBase):
    pass

class AddingModel(BaseModel):
    category_name: str =None
    file: Union[UploadFile, None] = None
    
class EmbeddingItem(Base):
    __tablename__ = "langchain_pg_embedding"
    id: Mapped[int] = mapped_column(primary_key=True)
    collection_id: Mapped[str] = mapped_column(String(2000))
    embedding = mapped_column(Vector(384))
    document: Mapped[str] = mapped_column(Text(2000))
    
class CollectionItem(Base):
    __tablename__ = "langchain_pg_collection"
    uuid: Mapped[str] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(255))
    

    