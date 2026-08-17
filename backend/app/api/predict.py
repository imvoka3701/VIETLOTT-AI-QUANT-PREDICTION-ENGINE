from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any, Tuple

from ..core.database import get_draws
from ..algorithms.ensemble import EnsemblePredictionEngine
from ..algorithms.genetic_optimizer import GeneticTicketOptimizer
from ..algorithms.monte_carlo import MonteCarloSimulator

router = APIRouter(prefix="/api/predict", tags=["Prediction"])

class EnsembleRequest(BaseModel):
    game_type: str = "mega645"
    weights: Optional[Dict[str, float]] = Field(
        default={"markov": 0.25, "bayesian": 0.30, "ml": 0.30, "monte_carlo": 0.15}
    )
    run_mc: bool = True

class GenerateTicketsRequest(BaseModel):
    game_type: str = "mega645"
    num_tickets: int = Field(default=5, ge=1, le=50)
    favorite_numbers: Optional[List[int]] = Field(default=[])
    banned_numbers: Optional[List[int]] = Field(default=[])
    sum_min: Optional[int] = None
    sum_max: Optional[int] = None
    weights: Optional[Dict[str, float]] = None
    population_size: int = Field(default=150, ge=30, le=500)
    generations: int = Field(default=100, ge=20, le=400)

class MonteCarloRequest(BaseModel):
    game_type: str = "mega645"
    num_simulations: int = Field(default=50000, ge=5000, le=200000)

@router.post("/ensemble")
def run_ensemble_prediction(req: EnsembleRequest):
    draws = get_draws(req.game_type, limit=300)
    if not draws:
        raise HTTPException(status_code=400, detail="No historical draws available to train models.")

    engine = EnsemblePredictionEngine(req.game_type)
    result = engine.run_ensemble(draws, weights=req.weights, run_mc=req.run_mc)
    return result

@router.post("/generate_tickets")
def generate_smart_tickets(req: GenerateTicketsRequest):
    draws = get_draws(req.game_type, limit=300)
    if not draws:
        raise HTTPException(status_code=400, detail="No historical draws available.")

    # 1. Run ensemble model to obtain prior ball probability vector
    engine = EnsemblePredictionEngine(req.game_type)
    ens_res = engine.run_ensemble(draws, weights=req.weights, run_mc=False)
    ball_scores = ens_res["normalized_probabilities"]

    # 2. Run Genetic Algorithm Optimizer with constraints
    optimizer = GeneticTicketOptimizer(req.game_type)
    
    sum_range = None
    if req.sum_min is not None and req.sum_max is not None:
        sum_range = (req.sum_min, req.sum_max)

    tickets = optimizer.optimize(
        ball_scores=ball_scores,
        num_tickets=req.num_tickets,
        population_size=req.population_size,
        generations=req.generations,
        favorite_nums=req.favorite_numbers,
        banned_nums=req.banned_numbers,
        sum_range=sum_range
    )

    return {
        "game_type": req.game_type,
        "tickets_generated_count": len(tickets),
        "tickets": tickets,
        "parameters": {
            "favorite_numbers": req.favorite_numbers,
            "banned_numbers": req.banned_numbers,
            "sum_range": sum_range,
            "generations": req.generations
        }
    }

@router.post("/monte_carlo")
def run_monte_carlo(req: MonteCarloRequest):
    draws = get_draws(req.game_type, limit=300)
    if not draws:
        raise HTTPException(status_code=400, detail="No historical draws available.")

    engine = EnsemblePredictionEngine(req.game_type)
    ens_res = engine.run_ensemble(draws, run_mc=False)
    base_probs = ens_res["normalized_probabilities"]

    mc = MonteCarloSimulator(req.game_type)
    sim_res = mc.run_simulation(base_probs, num_simulations=req.num_simulations)
    return sim_res
