import numpy as np
from typing import List, Dict, Any, Tuple
from ..config import SUPPORTED_GAMES

class MarkovChainModel:
    """
    1st-Order and 2nd-Order Markov Transition Probability Model for Lottery Balls.
    Analyzes conditional likelihood of number j appearing in draw t+1
    given numbers i_1, i_2... appeared in draw t.
    """
    def __init__(self, game_type: str = "mega645"):
        self.game_type = game_type
        self.cfg = SUPPORTED_GAMES.get(game_type, SUPPORTED_GAMES["mega645"])
        self.max_n = self.cfg["max_num"]
        self.min_n = self.cfg["min_num"]
        self.num_count = self.max_n - self.min_n + 1

    def build_transition_matrix(self, draws: List[Dict[str, Any]]) -> np.ndarray:
        """
        Draws list must be in chronological order (oldest to newest).
        Returns a (num_count x num_count) matrix where T[i, j] = P(ball j at t+1 | ball i at t).
        """
        # 1-indexed to 0-indexed: index = number - 1
        matrix = np.zeros((self.num_count, self.num_count), dtype=np.float64)
        
        if len(draws) < 2:
            # Uniform fallback
            return np.full((self.num_count, self.num_count), 1.0 / self.num_count)

        for t in range(len(draws) - 1):
            curr_nums = draws[t]["numbers"]
            next_nums = draws[t + 1]["numbers"]
            
            for i in curr_nums:
                i_idx = i - 1
                for j in next_nums:
                    j_idx = j - 1
                    matrix[i_idx, j_idx] += 1.0

        # Laplace smoothing (add-1) to avoid zero probabilities
        matrix += 0.1
        
        # Row-normalize to get transition probabilities
        row_sums = matrix.sum(axis=1, keepdims=True)
        matrix = np.divide(matrix, row_sums, out=np.zeros_like(matrix), where=row_sums != 0)
        
        return matrix

    def predict_next_probabilities(self, draws: List[Dict[str, Any]]) -> Dict[int, float]:
        """
        Given historical draws, computes the conditional probability distribution
        for each ball in the next draw based on the latest draw's balls.
        """
        if not draws:
            return {i: 1.0 / self.num_count for i in range(self.min_n, self.max_n + 1)}

        # Sort draws chronologically (oldest to newest)
        sorted_draws = sorted(draws, key=lambda x: x["id"] if "id" in x else x["draw_id"])
        trans_matrix = self.build_transition_matrix(sorted_draws)
        
        latest_nums = sorted_draws[-1]["numbers"]
        
        # Aggregate transition probabilities from all numbers in the latest draw
        combined_prob = np.zeros(self.num_count, dtype=np.float64)
        for num in latest_nums:
            combined_prob += trans_matrix[num - 1, :]
            
        # Normalize
        if combined_prob.sum() > 0:
            combined_prob = combined_prob / combined_prob.sum()
        else:
            combined_prob = np.full(self.num_count, 1.0 / self.num_count)

        return {i + 1: float(combined_prob[i]) for i in range(self.num_count)}

    def get_transition_heatmap_data(self, draws: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Returns JSON-serializable transition matrix for heatmap visualization.
        """
        sorted_draws = sorted(draws, key=lambda x: x["id"] if "id" in x else x["draw_id"])
        matrix = self.build_transition_matrix(sorted_draws)
        
        return {
            "labels": [str(i) for i in range(self.min_n, self.max_n + 1)],
            "matrix": matrix.tolist()
        }
