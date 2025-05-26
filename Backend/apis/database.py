from . import *

load_dotenv()


Mongo_Connection = os.getenv("MONGO_DETAILS")
client = AsyncIOMotorClient(Mongo_Connection)


#databases
db = client.file_db
db1 = client.user_db


#collections
file_col = db.file_collection
parsed_data_col  = db.parsed_data_chunks
users_col = db1.users_collection

