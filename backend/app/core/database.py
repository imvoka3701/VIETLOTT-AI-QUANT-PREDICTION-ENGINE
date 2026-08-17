import sqlite3
import json
from datetime import datetime
from typing import List, Dict, Any, Optional
from ..config import DB_PATH

def get_connection():
    conn = sqlite3.connect(str(DB_PATH))
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_connection()
    cursor = conn.cursor()

    # Draws table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS draws (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        game_type TEXT NOT NULL,
        draw_id TEXT NOT NULL,
        draw_date TEXT NOT NULL,
        numbers TEXT NOT NULL, -- JSON array of ints [1, 2, 3, 4, 5, 6]
        bonus_number INTEGER,
        jackpot1_value REAL DEFAULT 0,
        jackpot2_value REAL DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(game_type, draw_id)
    )
    """)

    # User saved & predicted tickets table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS user_tickets (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        game_type TEXT NOT NULL,
        target_draw_id TEXT,
        numbers TEXT NOT NULL, -- JSON array of ints
        algorithm_used TEXT DEFAULT 'custom',
        confidence_score REAL DEFAULT 0.0,
        notes TEXT,
        is_checked INTEGER DEFAULT 0,
        matched_count INTEGER DEFAULT 0,
        prize_tier TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    """)

    # Sync Logs
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS sync_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        game_type TEXT NOT NULL,
        synced_count INTEGER DEFAULT 0,
        latest_draw_id TEXT,
        status TEXT,
        message TEXT,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    """)

    cursor.execute("CREATE INDEX IF NOT EXISTS idx_draws_game_date ON draws(game_type, draw_date DESC)")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_draws_game_drawid ON draws(game_type, draw_id)")

    conn.commit()
    conn.close()

def insert_or_update_draw(game_type: str, draw_id: str, draw_date: str, numbers: List[int], bonus_number: Optional[int] = None, jackpot1: float = 0, jackpot2: float = 0) -> bool:
    conn = get_connection()
    cursor = conn.cursor()
    numbers_sorted = sorted(numbers)
    numbers_json = json.dumps(numbers_sorted)
    
    try:
        cursor.execute("""
        INSERT INTO draws (game_type, draw_id, draw_date, numbers, bonus_number, jackpot1_value, jackpot2_value)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(game_type, draw_id) DO UPDATE SET
            draw_date=excluded.draw_date,
            numbers=excluded.numbers,
            bonus_number=excluded.bonus_number,
            jackpot1_value=excluded.jackpot1_value,
            jackpot2_value=excluded.jackpot2_value
        """, (game_type, str(draw_id), draw_date, numbers_json, bonus_number, jackpot1, jackpot2))
        conn.commit()
        return True
    except Exception as e:
        print(f"Error inserting draw {draw_id}: {e}")
        return False
    finally:
        conn.close()

def insert_many_draws(draws_list: List[Dict[str, Any]]) -> int:
    conn = get_connection()
    cursor = conn.cursor()
    inserted_count = 0
    try:
        for d in draws_list:
            numbers_sorted = sorted(d["numbers"])
            numbers_json = json.dumps(numbers_sorted)
            cursor.execute("""
            INSERT OR IGNORE INTO draws (game_type, draw_id, draw_date, numbers, bonus_number, jackpot1_value, jackpot2_value)
            VALUES (?, ?, ?, ?, ?, ?, ?)
            """, (
                d["game_type"],
                str(d["draw_id"]),
                d["draw_date"],
                numbers_json,
                d.get("bonus_number"),
                d.get("jackpot1_value", 0),
                d.get("jackpot2_value", 0)
            ))
            if cursor.rowcount > 0:
                inserted_count += 1
        conn.commit()
    except Exception as e:
        print(f"Batch insert error: {e}")
    finally:
        conn.close()
    return inserted_count

def get_draws(game_type: str, limit: int = 100, offset: int = 0) -> List[Dict[str, Any]]:
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
    SELECT * FROM draws
    WHERE game_type = ?
    ORDER BY id DESC
    LIMIT ? OFFSET ?
    """, (game_type, limit, offset))
    rows = cursor.fetchall()
    conn.close()

    result = []
    for r in rows:
        d = dict(r)
        d["numbers"] = json.loads(d["numbers"])
        result.append(d)
    return result

def get_total_draws_count(game_type: str) -> int:
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT COUNT(*) as total FROM draws WHERE game_type = ?", (game_type,))
    row = cursor.fetchone()
    conn.close()
    return row["total"] if row else 0

def get_latest_draw(game_type: str) -> Optional[Dict[str, Any]]:
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
    SELECT * FROM draws
    WHERE game_type = ?
    ORDER BY id DESC
    LIMIT 1
    """, (game_type,))
    row = cursor.fetchone()
    conn.close()
    if row:
        d = dict(row)
        d["numbers"] = json.loads(d["numbers"])
        return d
    return None

def save_user_ticket(game_type: str, numbers: List[int], algorithm: str = "custom", confidence: float = 0.0, target_draw_id: str = None, notes: str = "") -> int:
    conn = get_connection()
    cursor = conn.cursor()
    numbers_json = json.dumps(sorted(numbers))
    cursor.execute("""
    INSERT INTO user_tickets (game_type, target_draw_id, numbers, algorithm_used, confidence_score, notes)
    VALUES (?, ?, ?, ?, ?, ?)
    """, (game_type, target_draw_id, numbers_json, algorithm, confidence, notes))
    ticket_id = cursor.lastrowid
    conn.commit()
    conn.close()
    return ticket_id

def get_user_tickets(game_type: Optional[str] = None) -> List[Dict[str, Any]]:
    conn = get_connection()
    cursor = conn.cursor()
    if game_type:
        cursor.execute("SELECT * FROM user_tickets WHERE game_type = ? ORDER BY id DESC", (game_type,))
    else:
        cursor.execute("SELECT * FROM user_tickets ORDER BY id DESC")
    rows = cursor.fetchall()
    conn.close()

    result = []
    for r in rows:
        d = dict(r)
        d["numbers"] = json.loads(d["numbers"])
        result.append(d)
    return result

def update_ticket_check_result(ticket_id: int, matched_count: int, prize_tier: str):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
    UPDATE user_tickets
    SET is_checked = 1, matched_count = ?, prize_tier = ?
    WHERE id = ?
    """, (matched_count, prize_tier, ticket_id))
    conn.commit()
    conn.close()

def delete_user_ticket(ticket_id: int) -> bool:
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM user_tickets WHERE id = ?", (ticket_id,))
    conn.commit()
    conn.close()
    return True
