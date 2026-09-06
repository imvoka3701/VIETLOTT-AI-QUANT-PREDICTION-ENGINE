from fastapi import APIRouter, Query, HTTPException
from typing import Optional, List
from ..core.database import get_draws, get_latest_draw, get_total_draws_count
from ..config import SUPPORTED_GAMES
from datetime import datetime, timedelta

router = APIRouter(prefix="/api/draws", tags=["Draws"])

@router.get("")
def list_draws(
    game_type: str = Query("mega645", enum=["mega645", "power655", "keno"]),
    limit: int = Query(50, ge=1, le=500),
    offset: int = Query(0, ge=0),
    search: Optional[str] = None
):
    total = get_total_draws_count(game_type)
    draws = get_draws(game_type, limit=limit, offset=offset)
    
    if search:
        search_term = search.strip()
        # Filter by draw_id or contains number
        if search_term.isdigit():
            s_num = int(search_term)
            draws = [d for d in draws if s_num in d["numbers"] or search_term in d["draw_id"]]
        else:
            draws = [d for d in draws if search_term in d["draw_date"] or search_term in d["draw_id"]]

    return {
        "game_type": game_type,
        "total": total,
        "limit": limit,
        "offset": offset,
        "draws": draws
    }

@router.get("/latest")
def get_latest(game_type: str = Query("mega645", enum=["mega645", "power655", "keno"])):
    latest = get_latest_draw(game_type)
    if not latest:
        raise HTTPException(status_code=404, detail=f"No draws found for {game_type}")
    return latest

@router.get("/countdown")
def get_countdown(game_type: str = Query("mega645", enum=["mega645", "power655", "keno"])):
    """
    Computes time remaining until next official draw.
    Vietlott draws occur at 18:00 - 18:30 on respective draw days.
    Mega 6/45: Wed (2), Fri (4), Sun (6)
    Power 6/55: Tue (1), Thu (3), Sat (5)
    """
    now = datetime.now()
    game_cfg = SUPPORTED_GAMES.get(game_type, SUPPORTED_GAMES["mega645"])
    draw_days = game_cfg.get("draw_days", [2, 4, 6])
    
    # Target draw time is 18:15 (6:15 PM)
    target_time = now.replace(hour=18, minute=15, second=0, microsecond=0)
    
    # Find next draw date
    current_weekday = now.weekday() # 0 = Monday ... 6 = Sunday
    days_ahead = None

    if current_weekday in draw_days and now < target_time:
        days_ahead = 0
    else:
        for offset in range(1, 8):
            next_day = (current_weekday + offset) % 7
            if next_day in draw_days:
                days_ahead = offset
                break

    if days_ahead is None:
        days_ahead = 1

    next_draw_dt = (now + timedelta(days=days_ahead)).replace(hour=18, minute=15, second=0, microsecond=0)
    time_left_seconds = max(0, int((next_draw_dt - now).total_seconds()))

    latest = get_latest_draw(game_type)
    next_draw_id = str(int(latest["draw_id"]) + 1).zfill(5) if latest else "01350"
    
    # Estimate Jackpot
    current_jp1 = latest["jackpot1_value"] if latest else game_cfg.get("jackpot_min", 12_000_000_000)
    est_jp1 = current_jp1 + 2_000_000_000

    return {
        "game_type": game_type,
        "game_name": game_cfg["name"],
        "next_draw_id": next_draw_id,
        "next_draw_time": next_draw_dt.strftime("%Y-%m-%d %H:%M:%S"),
        "seconds_remaining": time_left_seconds,
        "current_jackpot1": current_jp1,
        "estimated_jackpot1": est_jp1,
        "current_jackpot2": latest.get("jackpot2_value", 0) if latest else 0,
    }

@router.get("/today_schedule")
def get_today_schedule():
    """
    Returns today's complete lottery timeline (Keno, XSMN, XSMT, Vietlott, XSMB)
    with real-time status and time remaining.
    """
    from ..config import DAILY_LOTTERY_TIMELINE
    now = datetime.now()
    today_weekday = now.weekday()

    schedule_items = []
    for item in DAILY_LOTTERY_TIMELINE:
        is_today = True
        if "days" in item and today_weekday not in item["days"]:
            is_today = False

        channels = []
        if "channels" in item and today_weekday in item["channels"]:
            channels = item["channels"][today_weekday]

        schedule_items.append({
            "id": item["id"],
            "name": item["name"],
            "time": item["time"],
            "category": item["category"],
            "is_today": is_today,
            "channels": channels,
            "frequency": item.get("frequency", "")
        })

    return {
        "current_time": now.strftime("%Y-%m-%d %H:%M:%S"),
        "weekday": today_weekday,
        "schedule": schedule_items
    }

@router.get("/keno/latest")
def get_keno_latest_draws(limit: int = Query(20, ge=1, le=50)):
    """Returns the latest Keno draws from the live stream"""
    from ..core.database import get_keno_draws, get_latest_keno_draw
    draws = get_keno_draws(limit=limit)
    return {
        "count": len(draws),
        "latest": get_latest_keno_draw(),
        "draws": draws
    }

@router.get("/keno/quant")
def get_keno_quant_analysis():
    """Returns quantitative stats for Keno: hot/cold, streaks, and zones"""
    from ..core.database import get_keno_draws
    from ..algorithms.keno_quant import KenoQuantEngine
    draws = get_keno_draws(limit=30)
    engine = KenoQuantEngine()
    stats = engine.analyze_keno_history(draws)
    return stats

@router.get("/keno/predict")
def get_keno_prediction(
    pick_size: int = Query(5, ge=2, le=10),
    strategy: str = Query("balanced", enum=["balanced", "hot_momentum", "counter_cyclical"])
):
    """Generates AI-recommended Keno ticket for a given pick size"""
    from ..core.database import get_keno_draws
    from ..algorithms.keno_quant import KenoQuantEngine
    draws = get_keno_draws(limit=30)
    engine = KenoQuantEngine()
    ticket = engine.generate_optimal_ticket(draws, pick_size=pick_size, strategy=strategy)
    return ticket
