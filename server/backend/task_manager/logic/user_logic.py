from http.client import HTTPException

from bson import ObjectId

from task_manager.models.UserModel import *
from task_manager.database.database import *


def create_user(user: UserModel):
    existing_user = users_collection.find_one({"email": user.email})
    if existing_user:
        return None

    new_user = {
        "full_name": user.full_name,
        "email": user.email,
        "password": user.password
    }
    result = users_collection.insert_one(new_user)
    return str(result.inserted_id)


def authenticate_user(email: str, password: str) -> dict:
    user = users_collection.find_one({"email": email})
    if not user:
        return None

    if password == user["password"]:
        return {"user_id": str(user["_id"])}
    return None


def get_user_by_id(user_id: str):
    return users_collection.find_one({"_id": user_id}, {"password": 0})


def get_user_by_user_id(user_id: str) -> UserModel:
    print(f"Fetching user with user_id: {user_id}")

    try:
        user = users_collection.find_one({"_id": ObjectId(user_id)})
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid ObjectId format: {str(e)}")

    print(f"Found user: {user}")

    if user is None:
        raise HTTPException(status_code=404, detail="User not found")

    return UserModel(
        full_name=user.get("full_name", ""),
        email=user.get("email", ""),
        password=user.get("password", ""),
        user_id=str(user["_id"])
    )






