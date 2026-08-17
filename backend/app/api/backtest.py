from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import Optional

from ..core.database import get_draws
from ..algorithms.backtester import StrategyBacktester

router = APIRouter(prefix="/api/backtest", tags=["Backtesting"])

class BacktestRequest(BaseModel):
    game_type: str = "mega645"
    num_test_draws: int = Field(default=30, ge=5, le=100)
    tickets_per_draw: int = Field(default=5, ge=1, le=20)
    strategy: str = Field(default="ensemble_ga")

@router.post("/run")
def run_backtesting(req: BacktestRequest):
    draws = get_draws(req.game_type, limit=250)
    if len(draws) < 30:
        raise HTTPException(status_code=400, detail="Không đủ dữ liệu lịch sử để chạy backtest (cần tối thiểu 30 kỳ).")

    tester = StrategyBacktester(req.game_type)
    result = tester.run_backtest(
        draws=draws,
        num_test_draws=req.num_test_draws,
        tickets_per_draw=req.tickets_per_draw,
        strategy=req.strategy
    )
    return result
