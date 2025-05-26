from fastapi import FastAPI
from apis import *
from fastapi.middleware.cors import CORSMiddleware

app= FastAPI()


from apis.file import api_router as file_router
from apis.chatbot import api_router as chat_router
from apis.user import api_router as user_router



app.include_router(file_router)
app.include_router(chat_router)
app.include_router(user_router)

origins = [
    "http://localhost:5173", 
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  
    allow_credentials=True, 
    allow_methods=["*"],  
    allow_headers=["*"], 
    expose_headers=["*"]
)