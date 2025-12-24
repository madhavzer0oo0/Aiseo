import os
from dotenv import load_dotenv

load_dotenv()
DATABASE_URL = "sqlite:///./aiseo.db"

SECRET_KEY = os.getenv("SECRET_KEY", "supersecretkey")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30
