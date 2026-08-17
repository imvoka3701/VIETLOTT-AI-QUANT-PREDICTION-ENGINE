from fastapi import APIRouter, Query
from typing import Optional, List, Dict, Any
from itertools import combinations
from collections import Counter
import numpy as np

from ..core.database import get_draws
from ..algorithms.markov_chain import MarkovChainModel
from ..algorithms.bayesian_inference import BayesianHazardModel
from ..config import SUPPORTED_GAMES

router = APIRouter(prefix="/api/analytics", tags=["Analytics"])

@router.get("/frequency")
def get_frequency_stats(
    game_type: str = Query("mega645", enum=["mega645", "power655", "keno"]),
    limit_draws: int = Query(100, ge=10, le=1000)
):
    draws = get_draws(game_type, limit=limit_draws)
    cfg = SUPPORTED_GAMES.get(game_type, SUPPORTED_GAMES["mega645"])
    min_n, max_n = cfg["min_num"], cfg["max_num"]
    total_draws = len(draws)

    counts = Counter()
    for d in draws:
        for num in d["numbers"]:
            if min_n <= num <= max_n:
                counts[num] += 1

    avg_freq = total_draws * (cfg["pick_count"] / (max_n - min_n + 1))
    
    ball_stats = []
    for num in range(min_n, max_n + 1):
        c = counts[num]
        rate = round((c / max(1, total_draws)) * 100, 2)
        
        # Categorize
        if c > avg_freq * 1.15:
            status = "HOT"
        elif c < avg_freq * 0.85:
            status = "COLD"
        else:
            status = "WARM"

        ball_stats.append({
            "number": num,
            "count": c,
            "rate_pct": rate,
            "status": status,
            "deviation": round(c - avg_freq, 1)
        })

    # Sort descending
    sorted_by_freq = sorted(ball_stats, key=lambda x: x["count"], reverse=True)

    return {
        "game_type": game_type,
        "draws_analyzed": total_draws,
        "average_frequency": round(avg_freq, 2),
        "hot_numbers": [b["number"] for b in sorted_by_freq if b["status"] == "HOT"][:10],
        "cold_numbers": [b["number"] for b in sorted_by_freq if b["status"] == "COLD"][-10:],
        "all_balls": sorted_by_freq
    }

@router.get("/gaps")
def get_gaps_stats(game_type: str = Query("mega645", enum=["mega645", "power655", "keno"])):
    draws = get_draws(game_type, limit=300)
    bayes = BayesianHazardModel(game_type)
    gaps_data = bayes.compute_gaps(draws)
    
    formatted = []
    for num, st in gaps_data.items():
        # Hazard status
        cur_gap = st["current_gap"]
        mean_gap = st["mean_gap"]
        if cur_gap > mean_gap * 1.5:
            hazard_level = "CRITICAL_OVERDUE" # Quá hạn báo động đỏ
        elif cur_gap > mean_gap:
            hazard_level = "OVERDUE"          # Chậm về
        elif cur_gap < mean_gap * 0.5:
            hazard_level = "FRESH"            # Mới về gần đây
        else:
            hazard_level = "NORMAL"

        formatted.append({
            "number": num,
            "current_gap": cur_gap,
            "mean_gap": st["mean_gap"],
            "max_gap": st["max_gap"],
            "appearances": st["appearances"],
            "hazard_level": hazard_level,
            "gaps_history": st["gaps_history"]
        })

    formatted_sorted = sorted(formatted, key=lambda x: x["current_gap"], reverse=True)
    return {
        "game_type": game_type,
        "top_overdue": formatted_sorted[:10],
        "all_gaps": formatted_sorted
    }

@router.get("/markov_matrix")
def get_markov_matrix(game_type: str = Query("mega645", enum=["mega645", "power655", "keno"])):
    draws = get_draws(game_type, limit=300)
    markov = MarkovChainModel(game_type)
    return markov.get_transition_heatmap_data(draws)

@router.get("/pairs")
def get_cooccurrence_pairs(
    game_type: str = Query("mega645", enum=["mega645", "power655", "keno"]),
    limit_draws: int = Query(200, ge=20, le=500)
):
    draws = get_draws(game_type, limit=limit_draws)
    pair_counts = Counter()
    triplet_counts = Counter()

    for d in draws:
        sorted_nums = sorted(d["numbers"])
        # 2-pairs
        for p in combinations(sorted_nums, 2):
            pair_counts[p] += 1
        # 3-triplets
        for t in combinations(sorted_nums, 3):
            triplet_counts[t] += 1

    top_pairs = [
        {"pair": list(k), "count": v, "rate_pct": round((v / len(draws)) * 100, 2)}
        for k, v in pair_counts.most_common(15)
    ]

    top_triplets = [
        {"triplet": list(k), "count": v, "rate_pct": round((v / len(draws)) * 100, 2)}
        for k, v in triplet_counts.most_common(10)
    ]

    return {
        "game_type": game_type,
        "draws_analyzed": len(draws),
        "top_pairs": top_pairs,
        "top_triplets": top_triplets
    }

@router.get("/distribution")
def get_sum_and_parity_distribution(
    game_type: str = Query("mega645", enum=["mega645", "power655", "keno"]),
    limit_draws: int = Query(200, ge=20, le=500)
):
    draws = get_draws(game_type, limit=limit_draws)
    cfg = SUPPORTED_GAMES.get(game_type, SUPPORTED_GAMES["mega645"])
    pick_n = cfg["pick_count"]

    sums = [sum(d["numbers"]) for d in draws]
    odd_counts = [sum(1 for x in d["numbers"] if x % 2 != 0) for d in draws]

    # Histogram of sums
    sum_hist, bin_edges = np.histogram(sums, bins=12)
    bins_data = [
        {"bin": f"{int(bin_edges[i])}-{int(bin_edges[i+1])}", "count": int(sum_hist[i])}
        for i in range(len(sum_hist))
    ]

    # Odd/Even counter
    odd_even_counts = Counter(odd_counts)
    odd_even_data = [
        {
            "label": f"{k} Lẻ / {pick_n - k} Chẵn",
            "odd_count": k,
            "even_count": pick_n - k,
            "count": odd_even_counts[k],
            "rate_pct": round((odd_even_counts[k] / len(draws)) * 100, 2)
        }
        for k in range(pick_n + 1)
    ]

    return {
        "game_type": game_type,
        "draws_analyzed": len(draws),
        "mean_sum": round(float(np.mean(sums)), 1),
        "min_sum": int(np.min(sums)),
        "max_sum": int(np.max(sums)),
        "sum_histogram": bins_data,
        "odd_even_distribution": odd_even_data
    }
