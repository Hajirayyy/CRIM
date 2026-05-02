import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv()

MONGODB_URL = os.getenv("MONGODB_URL")
DB_NAME = os.getenv("DB_NAME", "crim")

client = AsyncIOMotorClient(MONGODB_URL)
db = client[DB_NAME]

# Collections
uploads_collection = db["uploads"]
customers_collection = db["customers"]
users_collection = db["users"]