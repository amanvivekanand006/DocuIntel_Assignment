from . import *
from . database import *
from . vector import *

async def save_file_to_gridfs(file_bytes: bytes, filename: str, content_type: str):
    fs = AsyncIOMotorGridFSBucket(db)
    file_stream = BytesIO(file_bytes)
    file_id = await fs.upload_from_stream(filename, file_stream, metadata={"content_type": content_type})
    return str(file_id)



async def get_file_from_gridfs(file_id: str):
    fs = AsyncIOMotorGridFSBucket(db)
    oid = ObjectId(file_id)
    file_obj = await fs.open_download_stream(oid)
    return file_obj


def parse_uploaded_file(file_bytes: bytes, filename: str):
    temp_dir = tempfile.gettempdir()
    file_path = os.path.join(temp_dir, filename)

    with open(file_path, "wb") as f:
        f.write(file_bytes)

    elements = partition(filename=file_path)
    extracted_data = [str(element) for element in elements]

    return extracted_data


async def save_chunks_to_db(file_id: str, chunks: list[str]):
    documents = [{"file_id": file_id, "chunk": chunk} for chunk in chunks]
    await parsed_data_col.insert_many(documents)



@api_router.post("/Upload_file", tags=["File"])
async def upload_file(file: UploadFile = File(...)):
    try:
        content = await file.read()

        file_id = await save_file_to_gridfs(content, file.filename, file.content_type)
        parsed_data = parse_uploaded_file(content, file.filename)

        chunk_docs = [{"file_id": file_id, "chunk": chunk} for chunk in parsed_data]
        await parsed_data_col.insert_many(chunk_docs)

        # await save_chunks_to_db(file_id, parsed_data)
        await create_faiss_index(file_id)

        return {
            "message": "File uploaded successfully",
            "file_id": file_id,
            "parsed_content": parsed_data
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Something Went Wrong, Please check your network connection! {str(e)}")


@api_router.get("/view_file", tags=["File"])
async def get_file(id:str):
    try:
        oid = ObjectId(id)
        file = await get_file_from_gridfs(oid)

        file_info = await db.fs.files.find_one({"_id": oid})
        if not file_info:
            raise HTTPException(status_code=404, detail="File not found")
        
        content_type = file_info.get("contentType", "application/octet-stream")
        filename = file_info.get("filename", "file")
        
        return StreamingResponse(
            file,
            media_type=content_type,
            headers={"Content-Disposition": f"inline; filename={filename}"}
        )
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))
    