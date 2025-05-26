from . import *
from . database import *
from security.auth import *

load_dotenv()

#ALL SCHEMAS
class user_schema(BaseModel):
    name : str
    email : EmailStr
    phone_number : int
    password: str
    confirm_password : str
    role : Optional[str] = "User"
    status : Optional[str] = "Active"
    @validator('name')
    def validate_name(cls, v):
        if not v.strip():
            raise ValueError('Name must not be empty')
        if len(v) < 3:
            raise ValueError('Name must be at least 3 characters long')
        return v

    @validator('phone_number')
    def validate_mobile(cls, value):
        if len(str(value)) != 10:
            raise ValueError('Mobile number must be 10 digits.')
        return value
    @validator('role')
    def validate_role(cls, v):
        if v != "User":
            raise ValueError('Role must be User')
        return v

    @validator('status')
    def validate_status(cls, v):
        if v not in ['Active', 'InActive']:
            raise ValueError('Status must be either Active or Inactive')
        return v
    @validator('password')
    def validate_password(cls, v):
        if len(v) < 8:
            raise ValueError('Password must be at least 8 characters long')
        if not re.search(r'[A-Z]', v):
            raise ValueError('Password must contain at least one uppercase letter')
        if not re.search(r'[a-z]', v):
            raise ValueError('Password must contain at least one lowercase letter')
        if not re.search(r'\d', v):
            raise ValueError('Password must contain at least one number')
        if not re.search(r'[!@#$%^&*(),.?":{}|<>]', v):
            raise ValueError('Password must contain at least one special character')
        return v


# Create a CryptContext with bcrypt
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def generating_user_id():
    id_number = random.randint(100000, 999999)
    generated_id = f"UID{id_number}"
    return generated_id


@api_router.post("/Create_user", tags=["Users"])
async def saving_users(user:user_schema):
    user_id = generating_user_id()

    email_check = await users_col.find_one({"email":user.email})
    if email_check:
        raise HTTPException(status_code=400, detail="Email Id Already Existed!")
    if user.password != user.confirm_password:
        raise HTTPException(status_code=400, detail="Passwords do not match")
    
    hashed_password = hash_password(user.password)
    
    document = {
        "user_id" : user_id,
        "name" : user.name,
        "email" : user.email,
        "phone_number" : user.phone_number,
        "password" : hashed_password,
        "role": user.role,
        "status":user.status,
    }
    
    response_data = {
        "user_id": user_id,
        "name": user.name,
        "email": user.email,
        "phone_number": user.phone_number,
        "role": user.role
    }
    result = await users_col.insert_one(document)
    return {
        "message" : "User Account Created",
        "user_details": response_data
    }



@api_router.put("/Update_user", tags=["Users"])
async def update_admin_details(user_id: str, update_data: user_schema = Body(...)):
    user = await users_col.find_one({"user_id": user_id})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    update_dict = update_data.dict()

    await users_col.update_one({"user_id": user_id}, {"$set": update_dict})

    return {"message": "Admin details updated successfully", "updated_fields": update_dict}


@api_router.post("/Login", tags=["Login For User"])
async def users_login(form_data: OAuth2PasswordRequestForm = Depends()):
    email = form_data.username  
    password = form_data.password
    user_details = await users_col.find_one({"email":email})
    if not user_details:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    hashed_password = user_details["password"]
    is_valid = verify_password(password,hashed_password)

    if is_valid:
        access_token = create_access_token(data={"user_id": user_details["user_id"]})
        return {"Message": "User Authenticated, Login Successfull",
                "access_token": access_token,
                "token_type": "bearer",
                "name":user_details["name"],
                "role":user_details["role"],
                "status":user_details["status"],
                "user_id":user_details["user_id"],
               }
    else :
        raise HTTPException(status_code=401, detail="Invalid email or password")
    