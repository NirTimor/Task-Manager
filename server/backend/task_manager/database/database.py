import pymongo
client = pymongo.MongoClient('mongodb://localhost:27017')
DATABASE_NAME = 'task_manager'
db = client[DATABASE_NAME]
tasks_collection = db['tasks_list']
users_collection = db['users_list']
