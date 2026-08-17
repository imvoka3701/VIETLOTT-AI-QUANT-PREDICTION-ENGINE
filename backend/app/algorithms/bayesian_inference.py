import numpy as np
from scipy import stats
from typing import List, Dict, Any
from ..config import SUPPORTED_GAMES

class BayesianHazardModel:
    """
    Bayesian Inference and Gap Hazard Decay Model.
    Computes posterior probability of arrival given time elapsed since last appearance (Lag/Gap),
    combined with Beta-Binomial prior on overall frequency.
    """
    def __init__(self, game_type: str = "mega645"):
        self.game_type = game_type
        self.cfg = SUPPORTED_GAMES.get(game_type, SUPPORTED_GAMES["mega645"])
        self.max_n = self.cfg["max_num"]
        self.min_n = self.cfg["min_num"]
        self.num_count = self.max_n - self.min_n + 1
        self.pick_n = self.cfg["pick_count"]
        self.base_prob = self.pick_n / self.num_count

    def compute_gaps(self, draws: List[Dict[str, Any]]) -> Dict[int, Dict[str, Any]]:
        """
        Calculates for each ball:
        - current_gap: number of draws since last appearance
        - mean_gap: average interval between appearances
        - std_gap: standard deviation of intervals
        - max_gap: maximum historical interval
        - appearances: total count
        """
        sorted_draws = sorted(draws, key=lambda x: x["id"] if "id" in x else x["draw_id"])
        total_draws = len(sorted_draws)
        
        history_gaps = {i: [] for i in range(self.min_n, self.max_n + 1)}
        last_seen_idx = {i: -1 for i in range(self.min_n, self.max_n + 1)}
        appearances = {i: 0 for i in range(self.min_n, self.max_n + 1)}

        for idx, draw in enumerate(sorted_draws):
            for num in draw["numbers"]:
                if self.min_n <= num <= self.max_n:
                    appearances[num] += 1
                    if last_seen_idx[num] != -1:
                        gap = idx - last_seen_idx[num]
                        history_gaps[num].append(gap)
                    last_seen_idx[num] = idx

        stats_data = {}
        for num in range(self.min_n, self.max_n + 1):
            if last_seen_idx[num] != -1:
                current_gap = (total_draws - 1) - last_seen_idx[num]
            else:
                current_gap = total_draws

            gaps = history_gaps[num]
            mean_gap = float(np.mean(gaps)) if gaps else (1.0 / self.base_prob)
            std_gap = float(np.std(gaps)) if len(gaps) > 1 else (mean_gap * 0.5)
            max_gap = max(gaps) if gaps else current_gap

            stats_data[num] = {
                "current_gap": current_gap,
                "mean_gap": round(mean_gap, 2),
                "std_gap": round(std_gap, 2),
                "max_gap": max_gap,
                "appearances": appearances[num],
                "gaps_history": gaps[-10:] # last 10 gaps
            }
            
        return stats_data

    def predict_next_probabilities(self, draws: List[Dict[str, Any]]) -> Dict[int, float]:
        """
        Combines Beta-Binomial prior frequency with Weibull/Geometric hazard function for current lag.
        """
        if not draws:
            return {i: 1.0 / self.num_count for i in range(self.min_n, self.max_n + 1)}

        gaps_stats = self.compute_gaps(draws)
        total_draws = len(draws)
        
        # Prior parameters (Beta distribution prior)
        alpha_prior = 2.0
        beta_prior = alpha_prior * (self.num_count / self.pick_n - 1.0)

        scores = {}
        for num, st in gaps_stats.items():
            # 1. Bayesian posterior mean for frequency
            alpha_post = alpha_prior + st["appearances"]
            beta_post = beta_prior + (total_draws - st["appearances"])
            freq_posterior = alpha_post / (alpha_post + beta_post)

            # 2. Hazard rate based on current gap vs mean gap
            cur_gap = st["current_gap"]
            mean_gap = max(1.0, st["mean_gap"])
            std_gap = max(1.0, st["std_gap"])

            # Z-score of current gap relative to normal expectation
            # When cur_gap > mean_gap, probability increases due to mean reversion pressure
            z = (cur_gap - mean_gap) / std_gap
            
            # Hazard multiplier: sigmoid curve centered at z=0
            hazard_multiplier = 1.0 / (1.0 + np.exp(-1.2 * z))
            hazard_multiplier = 0.5 + hazard_multiplier # range [0.5, 1.5]

            score = freq_posterior * hazard_multiplier
            scores[num] = max(0.001, score)

        # Normalize to probability distribution
        total_score = sum(scores.values())
        return {num: float(score / total_score) for num, score in scores.items()}
