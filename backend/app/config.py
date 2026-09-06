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
        "draw_time": "18:00",
        "jackpot_min": 12_000_000_000, # 12 tỷ VND
    },
    "power655": {
        "name": "Power 6/55",
        "min_num": 1,
        "max_num": 55,
        "pick_count": 6,
        "has_bonus": True,
        "draw_days": [1, 3, 5], # Tue (1), Thu (3), Sat (5)
        "draw_time": "18:00",
        "jackpot1_min": 30_000_000_000, # 30 tỷ VND
        "jackpot2_min": 3_000_000_000,  # 3 tỷ VND
    },
    "keno": {
        "name": "Keno",
        "min_num": 1,
        "max_num": 80,
        "pick_count": 20,
        "interval_minutes": 10,
        "start_time": "06:00",
        "end_time": "21:55",
        "draw_days": [0, 1, 2, 3, 4, 5, 6],
    },
    "max3d": {
        "name": "Max 3D",
        "draw_days": [0, 2, 4], # Mon, Wed, Fri
        "draw_time": "18:00",
    },
    "max3dpro": {
        "name": "Max 3D Pro",
        "draw_days": [1, 3, 5], # Tue, Thu, Sat
        "draw_time": "18:00",
    }
}

# Daily national lottery broadcast timeline
DAILY_LOTTERY_TIMELINE = [
    {
        "id": "keno_continuous",
        "name": "Vietlott Keno",
        "time": "06:00 - 21:55",
        "frequency": "10 phút / kỳ (96 kỳ/ngày)",
        "category": "vietlott",
        "days": [0, 1, 2, 3, 4, 5, 6]
    },
    {
        "id": "xsmn",
        "name": "Xổ Số Miền Nam (XSMN)",
        "time": "16:15",
        "category": "traditional",
        "channels": {
            0: ["TP.HCM", "Đồng Tháp", "Cà Mau"],
            1: ["Bến Tre", "Vũng Tàu", "Bạc Liêu"],
            2: ["Đồng Nai", "Cần Thơ", "Sóc Trăng"],
            3: ["Tây Ninh", "An Giang", "Bình Thuận"],
            4: ["Vĩnh Long", "Bình Dương", "Trà Vinh"],
            5: ["TP.HCM", "Long An", "Bình Phước", "Hậu Giang"],
            6: ["Tiền Giang", "Kiên Giang", "Đà Lạt"]
        }
    },
    {
        "id": "xsmt",
        "name": "Xổ Số Miền Trung (XSMT)",
        "time": "17:15",
        "category": "traditional",
        "channels": {
            0: ["Thừa Thiên Huế", "Phú Yên"],
            1: ["Đắk Lắk", "Quảng Nam"],
            2: ["Đà Nẵng", "Khánh Hòa"],
            3: ["Bình Định", "Quảng Trị", "Quảng Bình"],
            4: ["Gia Lai", "Ninh Thuận"],
            5: ["Đà Nẵng", "Quảng Ngãi", "Đắk Nông"],
            6: ["Khánh Hòa", "Kon Tum", "Thừa Thiên Huế"]
        }
    },
    {
        "id": "vietlott_major",
        "name": "Vietlott Mega 6/45 & Power 6/55",
        "time": "18:00",
        "category": "vietlott",
        "days": [0, 1, 2, 3, 4, 5, 6]
    },
    {
        "id": "xsmb",
        "name": "Xổ Số Miền Bắc (XSMB)",
        "time": "18:15",
        "category": "traditional",
        "days": [0, 1, 2, 3, 4, 5, 6]
    }
]
