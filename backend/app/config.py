import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / "data"
DATA_DIR.mkdir(parents=True, exist_ok=True)

DB_PATH = DATA_DIR / "vietlott.db"

SUPPORTED_GAMES = {
    "mega645": {
        "name": "Mega 6/45",
        "min_num": 1,
        "max_num": 45,
        "pick_count": 6,
        "draw_days": [2, 4, 6], # Wed (2), Fri (4), Sun (6) (0-indexed where Mon=0)
        "jackpot_min": 12_000_000_000, # 12 tỷ VND
    },
    "power655": {
        "name": "Power 6/55",
        "min_num": 1,
        "max_num": 55,
        "pick_count": 6,
        "has_bonus": True,
        "draw_days": [1, 3, 5], # Tue (1), Thu (3), Sat (5)
        "jackpot1_min": 30_000_000_000, # 30 tỷ VND
        "jackpot2_min": 3_000_000_000,  # 3 tỷ VND
    },
    "keno": {
        "name": "Keno",
        "min_num": 1,
        "max_num": 80,
        "pick_count": 20,
        "interval_minutes": 10,
    }
}
