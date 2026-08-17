from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from .core.database import init_db
from .core.seed_data import seed_database_if_empty
from .api import draws, analytics, predict, tracker, backtest, sync

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: init DB and seed default history if empty
    init_db()
    seed_database_if_empty()
    print("[+] Vietlott AI & Algorithmic Engine initialized.")
    yield
    # Shutdown

app = FastAPI(
    title="Vietlott Algorithmic & Prediction Engine API",
    description="High-dimensional mathematical, Bayesian, Markov & Genetic Algorithm API for Vietlott Lottery Analysis",
    version="1.0.0",
    lifespan=lifespan
)

# Allow Cross-Origin for React Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register Routers
app.include_router(draws.router)
app.include_router(analytics.router)
app.include_router(predict.router)
app.include_router(tracker.router)
app.include_router(backtest.router)
app.include_router(sync.router)

@app.get("/")
def root():
    return {
        "status": "online",
        "app": "Vietlott AI Engine API",
        "docs_url": "/docs"
    }

@app.get("/health")
def health_check():
    return {"status": "healthy"}
