from fastapi import APIRouter
from task_manager.logic.task_logic import *
from task_manager.logic.user_logic import *
from fastapi import HTTPException, Request, status
router = APIRouter()


# Registration route
@router.post("/register/")
async def register_user(user: UserModel):
    user_id = create_user(user)
    if user_id:
        return {"message": "User registered successfully!", "user_id": str(user_id)}
    else:
        raise HTTPException(status_code=400, detail="Sorry, A User with this email already exists.")


# Login route
@router.post("/login/")
async def login_user(request: Request):
    data = await request.json()
    email = data.get('email')
    password = data.get('password')
    user_info = authenticate_user(email, password)
    if user_info:
        return {"message": "Successfully Logged in!", "user_id": user_info["user_id"]}
    else:
        raise HTTPException(status_code=401, detail="Invalid email or password")


# Creation of a new task
@router.post("/tasks/", status_code=status.HTTP_201_CREATED)
async def create_task(task: TaskModel):
    task_id = insert_task(task)
    if task_id:
        return {
            "task_id": str(task_id),
            "message": "Task created successfully.",
            "task": task,
        }
    else:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to insert task.")


# Get a specific Task by its ID
@router.get("/tasks/{task_id}")
async def read_task(task_id: str):
    try:
        task_id_obj = ObjectId(task_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid task ID format.")

    task = get_task_by_id(task_id_obj)
    if task:
        task['_id'] = str(task['_id'])
        return task
    else:
        raise HTTPException(status_code=404, detail="Task was not found.")


# Updates a specific Task by its ID
@router.put("/tasks/{task_id}")
async def update_task(task_id: str, task: TaskModel):
    try:
        task_id_obj = ObjectId(task_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid task ID format.")
    updated_task = update_task_by_id(task_id_obj, task)

    if updated_task:
        updated_task['_id'] = str(updated_task['_id'])
        return {"message": "Task has been updated successfully"}
    else:
        raise HTTPException(status_code=404, detail="Task was not found.")


# Deletes a specific Task by its ID
@router.delete("/tasks/{task_id}")
async def delete_task(task_id: str):
    try:
        task_id = task_id.strip()
        task_id_obj = ObjectId(task_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid task ID format.")

    deleted_task = delete_task_by_id(task_id_obj)
    if deleted_task:
        deleted_task['_id'] = str(deleted_task['_id'])
        return {"message": "Task deleted successfully"}
    else:
        raise HTTPException(status_code=404, detail="Task was not found.")


# Get ALL Tasks for the Authenticated User
@router.get("/tasks/")
async def get_tasks(user_id: str, is_completed: bool = None):
    filter_query = {"user_id": user_id}
    if is_completed is not None:
        filter_query["is_completed"] = is_completed

    tasks = tasks_collection.find(filter_query)
    tasks_list = []
    for task in tasks:
        task["_id"] = str(task["_id"])
        tasks_list.append(task)

    return {"tasks": tasks_list}


# Marking Task as completed
@router.patch("/tasks/complete")
async def mark_task_as_complete(task_id: str):
    try:
        task_id_obj = ObjectId(task_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid task ID format.")
    updated_task = await mark_task_complete_logic(task_id_obj)

    if updated_task:
        updated_task["_id"] = str(updated_task["_id"])
        return {
            "message": "Task marked as complete successfully.",
            "task": updated_task,
        }
    else:
        raise HTTPException(status_code=404, detail="Task was not found.")


# Get Completed Tasks of a user
@router.get("/tasks/completed/")
async def get_completed_tasks(user_id: str):
    filter_query = {"user_id": user_id, "is_completed": True}
    try:
        tasks = tasks_collection.find(filter_query)
        tasks_list = []
        for task in tasks:
            task["_id"] = str(task["_id"])
            tasks_list.append(task)

        return {"completed_tasks": tasks_list}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred while fetching completed tasks: {str(e)}"
        )


# Get User Details (Email, Name, Etc..)
@router.get("/user/details_by_id", response_model=UserModel)
async def get_user_details_by_id(user_id: str):
    try:
        user = get_user_by_user_id(user_id)
        return user
    except HTTPException as e:
        raise e
