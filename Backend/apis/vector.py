from . import *
from . database import *
import asyncio

embedding = HuggingFaceEmbeddings()

async def create_faiss_index(file_id: str):
    chunk_docs_cursor = parsed_data_col.find({"file_id": file_id})
    chunks = await chunk_docs_cursor.to_list(None)
    
    documents = [Document(page_content=chunk['chunk']) for chunk in chunks]

    vectorstore = FAISS.from_documents(documents, embedding)
    vectorstore.save_local(f"vector_index_{file_id}")  # save per file or globally
    return vectorstore
