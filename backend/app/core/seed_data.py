import random
import json
from datetime import datetime, timedelta
from typing import List, Dict, Any
from .database import insert_many_draws, get_total_draws_count

def generate_realistic_vietlott_history(game_type: str, count: int = 500) -> List[Dict[str, Any]]:
    """
    Generates a realistic historical dataset for Vietlott games
    with natural frequency variance, realistic jackpot growth & reset patterns.
    """
    draws = []
    end_date = datetime.now()
    
    if game_type == "mega645":
        min_n, max_n, pick_n = 1, 45, 6
        current_jackpot = 12_000_000_000 # 12 tỷ min
        # Wed, Fri, Sun draws
        days_step = 2.33
        start_draw_num = 1350 - count
    elif game_type == "power655":
        min_n, max_n, pick_n = 1, 55, 6
        current_jackpot1 = 30_000_000_000 # 30 tỷ min
        current_jackpot2 = 3_000_000_000  # 3 tỷ min
        days_step = 2.33
        start_draw_num = 1150 - count
    else:
        min_n, max_n, pick_n = 1, 80, 20
        days_step = 0.01
        start_draw_num = 10000 - count

    # Add realistic non-uniform distribution weights (some numbers naturally have higher frequency hot/cold cycles)
    rng = random.Random(42 if game_type == "mega645" else 99)
    weights = [rng.uniform(0.75, 1.25) for _ in range(max_n)]

    current_date = end_date - timedelta(days=int(count * 2.33))
    
    for i in range(count):
        draw_id = str(start_draw_num + i).zfill(5)
        # advance date
        current_date += timedelta(days=2 if (i % 3 != 2) else 3)
        draw_date_str = current_date.strftime("%Y-%m-%d")

        # Pick unique numbers using weighted sampling
        available = list(range(min_n, max_n + 1))
        avail_weights = list(weights)
        selected = []
        for _ in range(pick_n):
            pick = rng.choices(available, weights=avail_weights, k=1)[0]
            selected.append(pick)
            idx = available.index(pick)
            available.pop(idx)
            avail_weights.pop(idx)

        bonus_num = None
        if game_type == "power655":
            bonus_num = rng.choices(available, weights=avail_weights, k=1)[0]

        if game_type == "mega645":
            # jackpot grows by 1-3 tỷ per draw, occasionally won & resets
            if rng.random() < 0.06: # won!
                jackpot_val = current_jackpot
                current_jackpot = 12_000_000_000
            else:
                current_jackpot += rng.randint(800_000_000, 2_500_000_000)
                jackpot_val = current_jackpot
            jp2_val = 0
        elif game_type == "power655":
            if rng.random() < 0.03: # JP1 won
                jackpot_val = current_jackpot1
                current_jackpot1 = 30_000_000_000
            else:
                current_jackpot1 += rng.randint(1_500_000_000, 5_000_000_000)
                jackpot_val = current_jackpot1

            if rng.random() < 0.12: # JP2 won
                jp2_val = current_jackpot2
                current_jackpot2 = 3_000_000_000
            else:
                current_jackpot2 += rng.randint(200_000_000, 600_000_000)
                jp2_val = current_jackpot2
        else:
            jackpot_val = 2_000_000_000
            jp2_val = 0

        draws.append({
            "game_type": game_type,
            "draw_id": draw_id,
            "draw_date": draw_date_str,
            "numbers": sorted(selected),
            "bonus_number": bonus_num,
            "jackpot1_value": jackpot_val,
            "jackpot2_value": jp2_val
        })

    return draws

def seed_database_if_empty():
    """Checks and seeds database with real Vietlott data if possible, with mock fallback"""
    from .crawler import sync_real_vietlott_data, fetch_keno_latest
    from .database import insert_many_keno_draws, get_keno_draws

    for gtype in ["mega645", "power655"]:
        count = get_total_draws_count(gtype)
        if count < 10:
            print(f"[*] Syncing real historical data for {gtype} from vietlott.vn...")
            try:
                res = sync_real_vietlott_data(gtype)
                print(f"[+] {res['message']}")
            except Exception as e:
                print(f"[-] Real sync failed ({e}), using realistic synthetic fallback...")
                draws = generate_realistic_vietlott_history(gtype, count=300)
                inserted = insert_many_draws(draws)
                print(f"[+] Successfully seeded {inserted} fallback draws for {gtype}.")

    # Seed Keno
    if len(get_keno_draws(limit=5)) == 0:
        try:
            keno_draws = fetch_keno_latest()
            if keno_draws:
                insert_many_keno_draws(keno_draws)
                print(f"[+] Synced {len(keno_draws)} initial live Keno draws.")
        except Exception as e:
            print(f"[-] Initial Keno sync error: {e}")

