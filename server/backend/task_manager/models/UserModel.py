from typing import Optional
from pydantic import BaseModel, EmailStr


class UserModel(BaseModel):
    full_name: str
    email: EmailStr
    password: str
    user_id: Optional[str]
