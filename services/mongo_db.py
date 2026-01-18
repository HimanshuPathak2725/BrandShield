import os
from pymongo import MongoClient
import certifi

class MongoDB:
    def __init__(self):
        self.client = None
        self.db = None

    def init_app(self, app=None):
        mongo_uri = os.getenv('MONGO_URI', 'mongodb://localhost:27017/brandshield')
        # Use certifi for SSL certificates if needed (common with cloud MongoDB)
        try:
            self.client = MongoClient(mongo_uri, tlsCAFile=certifi.where())
            self.db = self.client.get_database()
            print(f"✅ Connected to MongoDB at {self.db.name}")
        except Exception as e:
            print(f"❌ Failed to connect to MongoDB: {e}")

mongo = MongoDB()

def get_db():
    return mongo.db
