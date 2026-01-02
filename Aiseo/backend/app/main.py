from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import seo
from app.routes import auth
from app.core.database import Base, engine

Base.metadata.create_all(bind=engine)

app = FastAPI(title="AISEO Backend")

# 🔥 CORS MUST be added BEFORE routes
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],   # THIS enables OPTIONS
    allow_headers=["*"],   # THIS enables preflight headers
)

# Routes
app.include_router(auth.router)
app.include_router(seo.router)

