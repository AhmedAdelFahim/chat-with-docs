import os
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
# from chat_controller import router as chat_router
load_dotenv()
from docs.docs_controller import router as docs_router
from chat.chat_controller import router as chat_router
# print(os.getenv('ANTHROPIC_API_KEY'))
print(os.environ.get('ANTHROPIC_API_KEY'))
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(chat_router, prefix='/v1/chat')
app.include_router(docs_router, prefix='/v1/docs')
app.mount("/static", StaticFiles(directory="static"), name="static")
