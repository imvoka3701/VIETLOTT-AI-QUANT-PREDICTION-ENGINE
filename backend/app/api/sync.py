from fastapi import APIRouter, Query
from typing import Optional
from ..core.crawler import crawl_vietlott_online
from ..core.database import get_connection

router = APIRouter(prefix="/api/sync", tags=["Live Sync"])

@router.post("")
def trigger_sync(game_type: str = Query("mega645", enum=["mega645", "power655", "keno"])):
    res = crawl_vietlott_online(game_type)
    return res

@router.get("/logs")
def get_sync_logs(limit: int = Query(20, ge=1, le=100)):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
    SELECT * FROM sync_logs
    ORDER BY id DESC
    LIMIT ?
    """, (limit,))
    rows = cursor.fetchall()
    conn.close()
    return [dict(r) for r in rows]
