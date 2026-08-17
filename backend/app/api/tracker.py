from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any

from ..core.database import (
    get_user_tickets,
    save_user_ticket,
    delete_user_ticket,
    update_ticket_check_result,
    get_latest_draw,
    get_draws
)
from ..config import SUPPORTED_GAMES

router = APIRouter(prefix="/api/tracker", tags=["Live Tracker & Ticket Checker"])

class SaveTicketRequest(BaseModel):
    game_type: str = "mega645"
    numbers: List[int]
    algorithm_used: str = "custom"
    confidence_score: float = 0.0
    target_draw_id: Optional[str] = None
    notes: Optional[str] = ""

class BatchSaveTicketsRequest(BaseModel):
    game_type: str = "mega645"
    tickets: List[Dict[str, Any]]
    target_draw_id: Optional[str] = None

class CheckTicketsRequest(BaseModel):
    game_type: str = "mega645"
    draw_id: Optional[str] = None # If None, checks against latest draw

def calculate_prize(game_type: str, matched_count: int, has_bonus_match: bool = False) -> str:
    """
    Vietlott Prize Tier rules:
    Mega 6/45:
    - 6 matches: JACKPOT (>= 12 tỷ)
    - 5 matches: Giải Nhất (10.000.000đ)
    - 4 matches: Giải Nhì (300.000đ)
    - 3 matches: Giải Ba (30.000đ)

    Power 6/55:
    - 6 matches: JACKPOT 1 (>= 30 tỷ)
    - 5 matches + Bonus: JACKPOT 2 (>= 3 tỷ)
    - 5 matches: Giải Nhất (40.000.000đ)
    - 4 matches: Giải Nhì (500.000đ)
    - 3 matches: Giải Ba (50.000đ)
    """
    if game_type == "mega645":
        if matched_count == 6:
            return "JACKPOT (Tối thiểu 12 Tỷ)"
        elif matched_count == 5:
            return "GIẢI NHẤT (10 Triệu)"
        elif matched_count == 4:
            return "GIẢI NHÌ (300k)"
        elif matched_count == 3:
            return "GIẢI BA (30k)"
        else:
            return "Không trúng"
    elif game_type == "power655":
        if matched_count == 6:
            return "JACKPOT 1 (Tối thiểu 30 Tỷ)"
        elif matched_count == 5 and has_bonus_match:
            return "JACKPOT 2 (Tối thiểu 3 Tỷ)"
        elif matched_count == 5:
            return "GIẢI NHẤT (40 Triệu)"
        elif matched_count == 4:
            return "GIẢI NHÌ (500k)"
        elif matched_count == 3:
            return "GIẢI BA (50k)"
        else:
            return "Không trúng"
    else:
        return f"Trúng {matched_count} số"

@router.get("/tickets")
def list_tickets(game_type: Optional[str] = None):
    return get_user_tickets(game_type)

@router.post("/tickets")
def create_ticket(req: SaveTicketRequest):
    ticket_id = save_user_ticket(
        game_type=req.game_type,
        numbers=req.numbers,
        algorithm=req.algorithm_used,
        confidence=req.confidence_score,
        target_draw_id=req.target_draw_id,
        notes=req.notes or ""
    )
    return {"success": True, "ticket_id": ticket_id, "message": "Đã lưu vé vào danh mục theo dõi!"}

@router.post("/tickets/batch")
def batch_create_tickets(req: BatchSaveTicketsRequest):
    saved_ids = []
    for t in req.tickets:
        tid = save_user_ticket(
            game_type=req.game_type,
            numbers=t["numbers"],
            algorithm=t.get("strategy", "Genetic Algorithm"),
            confidence=t.get("confidence", 0.0),
            target_draw_id=req.target_draw_id,
            notes=f"Fitness: {t.get('fitness_score', '')}"
        )
        saved_ids.append(tid)
    return {"success": True, "saved_count": len(saved_ids), "ticket_ids": saved_ids}

@router.delete("/tickets/{ticket_id}")
def remove_ticket(ticket_id: int):
    delete_user_ticket(ticket_id)
    return {"success": True, "message": "Đã xóa vé."}

@router.post("/check_all")
def check_all_tickets(req: CheckTicketsRequest):
    """
    Checks all saved tickets against the designated draw and updates their prize status.
    """
    if req.draw_id:
        draws = get_draws(req.game_type, limit=50)
        target_draw = next((d for d in draws if str(d["draw_id"]) == str(req.draw_id)), None)
    else:
        target_draw = get_latest_draw(req.game_type)

    if not target_draw:
        raise HTTPException(status_code=404, detail="Không tìm thấy kỳ quay để đối chiếu.")

    winning_numbers = set(target_draw["numbers"])
    bonus_number = target_draw.get("bonus_number")

    user_tickets = get_user_tickets(req.game_type)
    results = []
    winning_count = 0

    for t in user_tickets:
        ticket_nums = set(t["numbers"])
        matched = len(ticket_nums.intersection(winning_numbers))
        has_bonus = bool(bonus_number and bonus_number in ticket_nums)
        
        prize = calculate_prize(req.game_type, matched, has_bonus)
        if matched >= 3:
            winning_count += 1

        update_ticket_check_result(t["id"], matched, prize)

        results.append({
            "ticket_id": t["id"],
            "numbers": t["numbers"],
            "matched_count": matched,
            "matched_numbers": list(ticket_nums.intersection(winning_numbers)),
            "prize_tier": prize,
            "is_winner": matched >= 3
        })

    return {
        "game_type": req.game_type,
        "draw_id": target_draw["draw_id"],
        "draw_date": target_draw["draw_date"],
        "winning_numbers": target_draw["numbers"],
        "bonus_number": bonus_number,
        "total_tickets_checked": len(user_tickets),
        "winning_tickets_count": winning_count,
        "results": results
    }
