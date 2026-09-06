from fastapi import APIRouter, Query, HTTPException
from typing import Optional, List, Dict, Any
from pydantic import BaseModel
from ..algorithms.traditional_lottery import TraditionalLotteryEngine
from ..algorithms.explainable_ai import ExplainableAIEngine
from ..core.database import get_draws

router = APIRouter(prefix="/api/traditional", tags=["Traditional Lottery & XAI"])

class PascalRequest(BaseModel):
    special_prize: str
    first_prize: str

@router.get("/predict")
def get_traditional_prediction(region: str = Query("xsmb", enum=["xsmb", "xsmn", "xsmt"])):
    """
    Returns full quantitative prediction suite for traditional 3-region lotteries:
    Bạch Thủ, Song Thủ, Lô Xiên 2/3, Dàn Đề 10/20/36 số, and Cầu Pascal.
    """
    engine = TraditionalLotteryEngine(region)
    result = engine.predict_traditional(region)
    return result

@router.post("/pascal")
def compute_custom_pascal(payload: PascalRequest):
    """Computes dynamic Pascal reduction triangle from custom user input"""
    engine = TraditionalLotteryEngine("xsmb")
    triangle = engine.generate_pascal_triangle(payload.special_prize, payload.first_prize)
    return triangle

@router.get("/explain")
def explain_number_rationale(
    number: int = Query(..., ge=1, le=80),
    game_type: str = Query("mega645", enum=["mega645", "power655", "keno"])
):
    """
    Explainable AI (XAI) endpoint: Returns complete mathematical evidence
    (Bayesian Hazard, Markov Chain transition, Rolling momentum) explaining why a number is selected.
    """
    draws = get_draws(game_type if game_type != "keno" else "mega645", limit=150)
    engine = ExplainableAIEngine(game_type)
    explanation = engine.explain_number(number, draws)
    return explanation
