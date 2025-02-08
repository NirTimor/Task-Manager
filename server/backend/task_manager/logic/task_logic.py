from http.client import HTTPException
from bson import ObjectId
from pymongo import ReturnDocument
from task_manager.database.database import *
from task_manager.models.TaskModel import *
from pymongo.errors import PyMongoError


def insert_task(task_data: TaskModel):
    try:
        result = tasks_collection.insert_one(task_data.dict())
        return result.inserted_id
    except PyMongoError as e:
        print(f"An error occurred while inserting task: {e}")
        return None


def get_task_by_id(task_id):
    try:
        task = tasks_collection.find_one({"_id": task_id})
        return task
    except PyMongoError as e:
        print(f"An error occurred while retrieving task: {e}")
        return None


def get_tasks_by_user_id(user_id: str):
    print(f"Fetching tasks for user_id: {user_id}")  # Debugging line
    tasks = list(tasks_collection.find({"user_id": user_id}))
    print(f"Found tasks: {tasks}")  # Debugging line
    return tasks


def insert_task(task: TaskModel):
    task_data = task.dict()
    task_data["created_at"] = datetime.utcnow()
    result = tasks_collection.insert_one(task_data)
    return str(result.inserted_id) if result.acknowledged else None


def update_task_by_id(task_id: ObjectId, task_data: TaskModel):
    updated_task = tasks_collection.find_one_and_update(
        {"_id": task_id},
        {"$set": task_data.dict(exclude_unset=True)},
        return_document=ReturnDocument.AFTER
    )
    return updated_task


def delete_task_by_id(task_id: ObjectId):
    deleted_task = tasks_collection.find_one_and_delete({"_id": task_id})
    return deleted_task


def get_tasks(user_id: Optional[str] = None, status: Optional[str] = None):
    query = {}

    if user_id:
        try:
            query["user_id"] = ObjectId(user_id)
        except Exception:
            raise HTTPException(status_code=400, detail="Invalid user ID format.")

    if status:
        if status == "completed":
            query["is_completed"] = True
        elif status == "incomplete":
            query["is_completed"] = False
        else:
            raise HTTPException(status_code=400, detail="Invalid status value. Use 'completed' or 'incomplete'.")

    tasks = list(tasks_collection.find(query))

    for task in tasks:
        if "_id" in task:
            task["_id"] = str(task["_id"])
        if "user_id" in task and isinstance(task["user_id"], ObjectId):
            task["user_id"] = str(task["user_id"])

    return tasks


def serialize_task(task):
    task['_id'] = str(task['_id'])
    return task


async def mark_task_complete_logic(task_id_obj):
    task = await tasks_collection.find_one({"_id": task_id_obj})  # Check if task exists
    if not task:
        return None  # Task not found

    await tasks_collection.update_one({"_id": task_id_obj}, {"$set": {"is_completed": True}})

    updated_task = await tasks_collection.find_one({"_id": task_id_obj})
    return updated_task  # Return the updated task









