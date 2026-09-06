import numpy as np
from typing import List, Dict, Any, Tuple
from itertools import combinations
from collections import Counter
from ..config import SUPPORTED_GAMES

class CoOccurrenceEngine:
    """
    Analyzes pairwise co-appearance C(N, 2), triplet clusters C(N, 3),
    and consecutive repeat (bóng rơi / lô rơi) across historical draws.
    """
    def __init__(self, game_type: str = "mega645"):
        self.game_type = game_type
        self.cfg = SUPPORTED_GAMES.get(game_type, SUPPORTED_GAMES["mega645"])
        self.min_n = int(self.cfg["min_num"])
        self.max_n = int(self.cfg["max_num"])
        self.num_count = self.max_n - self.min_n + 1

    def build_pair_matrix(self, draws: List[Dict[str, Any]]) -> np.ndarray:
        """
        Builds symmetric matrix where M[i, j] is the frequency of ball i and j appearing together.
        0-indexed: index 0 corresponds to min_n (1).
        """
        matrix = np.zeros((self.num_count, self.num_count), dtype=np.int32)
        for d in draws:
            nums = [n for n in d["numbers"] if self.min_n <= n <= self.max_n]
            for u, v in combinations(nums, 2):
                idx_u = u - self.min_n
                idx_v = v - self.min_n
                matrix[idx_u, idx_v] += 1
                matrix[idx_v, idx_u] += 1
        return matrix

    def get_top_pairs(self, draws: List[Dict[str, Any]], top_k: int = 15) -> List[Dict[str, Any]]:
        """
        Ranks top 2-ball combinations by frequency and probability.
        """
        if not draws:
            return []

        pair_counter = Counter()
        for d in draws:
            nums = sorted([n for n in d["numbers"] if self.min_n <= n <= self.max_n])
            for pair in combinations(nums, 2):
                pair_counter[pair] += 1

        total_draws = max(1, len(draws))
        top_list = []
        for (u, v), count in pair_counter.most_common(top_k):
            prob = round((count / total_draws) * 100, 2)
            top_list.append({
                "ball_1": u,
                "ball_2": v,
                "pair_label": f"{str(u).zfill(2)} - {str(v).zfill(2)}",
                "count": count,
                "percentage": prob
            })
        return top_list

    def get_top_triplets(self, draws: List[Dict[str, Any]], top_k: int = 10) -> List[Dict[str, Any]]:
        """
        Ranks top 3-ball combinations.
        """
        if not draws:
            return []

        triplet_counter = Counter()
        for d in draws:
            nums = sorted([n for n in d["numbers"] if self.min_n <= n <= self.max_n])
            for trip in combinations(nums, 3):
                triplet_counter[trip] += 1

        total_draws = max(1, len(draws))
        res = []
        for (u, v, w), count in triplet_counter.most_common(top_k):
            if count >= 2:  # Only report if appeared multiple times
                res.append({
                    "balls": [u, v, w],
                    "label": f"{str(u).zfill(2)} - {str(v).zfill(2)} - {str(w).zfill(2)}",
                    "count": count,
                    "percentage": round((count / total_draws) * 100, 2)
                })
        return res

    def get_consecutive_repeats(self, draws: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Analyzes consecutive repeat rate ('bóng rơi'): balls in draw t that repeat in draw t+1.
        """
        if len(draws) < 2:
            return {"average_repeats": 0, "repeat_frequency": {}}

        sorted_draws = sorted(draws, key=lambda x: str(x.get("draw_id", "")))
        repeat_counts_per_draw = []
        ball_repeat_frequency = Counter()

        for t in range(len(sorted_draws) - 1):
            curr_nums = set(sorted_draws[t]["numbers"])
            next_nums = set(sorted_draws[t + 1]["numbers"])
            overlap = curr_nums.intersection(next_nums)
            repeat_counts_per_draw.append(len(overlap))
            for b in overlap:
                ball_repeat_frequency[b] += 1

        avg_rep = round(float(np.mean(repeat_counts_per_draw)), 2) if repeat_counts_per_draw else 0.0

        top_repeat_balls = [
            {"number": b, "repeat_count": count}
            for b, count in ball_repeat_frequency.most_common(8)
        ]

        return {
            "average_repeats_per_draw": avg_rep,
            "most_repeated_balls": top_repeat_balls,
            "total_analyzed_transitions": len(repeat_counts_per_draw)
        }

    def get_matrix_payload(self, draws: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Returns JSON-ready co-occurrence matrix for interactive frontend heatmaps.
        """
        matrix = self.build_pair_matrix(draws)
        labels = [str(i).zfill(2) for i in range(self.min_n, self.max_n + 1)]
        return {
            "labels": labels,
            "matrix": matrix.tolist(),
            "max_pair_freq": int(matrix.max()) if matrix.size > 0 else 0
        }
