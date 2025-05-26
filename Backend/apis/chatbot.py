from . import *
from . database import *
import requests
from langchain.vectorstores import FAISS
# from langchain.embeddings import HuggingFaceEmbeddings
from langchain.schema import Document
from langchain_huggingface import HuggingFaceEmbeddings

load_dotenv()

embedding = HuggingFaceEmbeddings()
TOGETHER_API_KEY = os.getenv("TOGETHER_API_KEY")


class Message(BaseModel):
    role: str
    content: str
class ChatRequest(BaseModel):
    file_id: str
    messages: List[Message] 


def ask_llama2(messages: list):
    url = "https://api.together.xyz/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {TOGETHER_API_KEY}",
        "Content-Type": "application/json"
    }
    formatted_messages = [
        msg.dict() if isinstance(msg, Message) else msg for msg in messages
    ]
    data = {
        "model": "meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo",  
        "messages": formatted_messages,
        "temperature": 0.7,
        "max_tokens": 300
    }

    response = requests.post(url, headers=headers, json=data)

    try:
        res_json = response.json()
        print("TOGETHER AI RAW RESPONSE:", res_json)
        return res_json["choices"][0]["message"]["content"].strip()
    except Exception as e:
        return f"❌ Error: {str(e)}\nRaw Response: {response.text}"

@api_router.post("/chat", tags=["Chatbot"])
async def chat_with_context(request: ChatRequest):
    file_id = request.file_id
    messages = request.messages

    vectorstore = FAISS.load_local(
        f"vector_index_{file_id}",
        embedding,
        allow_dangerous_deserialization=True
    )
    retriever = vectorstore.as_retriever()
    
    # Using only latest message to fetch relevant docs
    user_question = messages[-1].content
    docs = retriever.get_relevant_documents(user_question)
    context = "\n".join([doc.page_content for doc in docs])

    # Injecting context into latest user message
    messages[-1] = Message(
        role=messages[-1].role,
        content=f"""Use this content:\n{context}\n\nUser question:\n{user_question}"""
    )
    # Ask the LLM
    answer = ask_llama2(messages)
    return {
    "messages": [msg.dict() for msg in messages] + [{"role": "assistant", "content": answer}]
     }

@api_router.post("/generate_questions",tags=["Chatbot"])
async def generate_questions_api(file_id: str):
    chunks = await parsed_data_col.find({"file_id": file_id}).to_list(None)
    content = "\n".join([chunk['chunk'] for chunk in chunks])

    prompt = f"Generate 5 multiple-choice questions from the following content:\n\n{content}"
    questions = ask_llama2(prompt)

    return {"questions": questions}
