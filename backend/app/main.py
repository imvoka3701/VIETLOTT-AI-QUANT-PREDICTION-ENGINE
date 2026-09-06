from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import os

from .core.database import init_db
from .core.seed_data import seed_database_if_empty
from .core.security import SecurityHeadersMiddleware, RateLimiterMiddleware
from .api import draws, analytics, predict, tracker, backtest, sync, traditional

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: init DB and seed real/default history if empty
    init_db()
    seed_database_if_empty()
    print("[+] Vietlott AI & Multi-Lottery Quant Engine initialized with Security Hardening.")
    yield
    # Shutdown

app = FastAPI(
    title="Vietlott & National Lottery AI Quant Engine API",
    description="High-dimensional mathematical, Bayesian, Markov, Genetic & Explainable AI (XAI) API for Lotteries",
    version="2.5.0",
    lifespan=lifespan
)

# 1. Security Headers Middleware (OWASP protection against XSS, clickjacking, MIME sniffing)
app.add_middleware(SecurityHeadersMiddleware)

# 2. Rate Limiting Middleware (DoS prevention on CPU-intensive prediction & backtest routes)
app.add_middleware(RateLimiterMiddleware)

# 3. Secure CORS Middleware (Restricting origins to trusted client hosts)
allowed_origins_env = os.getenv("ALLOWED_ORIGINS")
allowed_origins = [o.strip() for o in allowed_origins_env.split(",")] if allowed_origins_env else [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:8000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_origin_regex=r"^https?://(localhost|127\.0\.0\.1)(:\d+)?$",
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# Register Routers
app.include_router(draws.router)
app.include_router(analytics.router)
app.include_router(predict.router)
app.include_router(tracker.router)
app.include_router(backtest.router)
app.include_router(sync.router)
app.include_router(traditional.router)

@app.get("/")
def root():
    return {
        "status": "online",
        "app": "Vietlott & National Lottery AI Quant Engine API",
        "security": "hardened",
        "docs_url": "/docs"
    }

@app.get("/health")
def health_check():
    return {"status": "healthy", "security": "active"}
