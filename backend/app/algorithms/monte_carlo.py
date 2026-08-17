import numpy as np
from typing import List, Dict, Any, Tuple
from collections import Counter
from ..config import SUPPORTED_GAMES

class MonteCarloSimulator:
    """
    High-Performance Vectorized Monte Carlo Simulation.
    Simulates 25,000 - 50,000 virtual draws parameterized by underlying model probabilities,
    identifying recurring high-affinity clusters, sum distributions, and balanced subsets.
    """
    def __init__(self, game_type: str = "mega645"):
        self.game_type = game_type
        self.cfg = SUPPORTED_GAMES.get(game_type, SUPPORTED_GAMES["mega645"])
        self.max_n = int(self.cfg["max_num"])
        self.min_n = int(self.cfg["min_num"])
        self.num_count = int(self.max_n - self.min_n + 1)
        self.pick_n = int(self.cfg["pick_count"])

    def run_simulation(
        self,
        base_probabilities: Dict[int, float],
        num_simulations: int = 25000
    ) -> Dict[str, Any]:
        """
        Executes Monte Carlo sampling.
        """
        balls = np.arange(self.min_n, self.max_n + 1)
        prob_array = np.array([base_probabilities.get(int(b), 1.0 / self.num_count) for b in balls], dtype=np.float64)
        prob_array = prob_array / prob_array.sum()

        # Vectorized Gumbel-Max sampling without replacement
        gumbel_noise = -np.log(-np.log(np.random.uniform(1e-10, 1.0, size=(num_simulations, self.num_count))))
        perturbed = np.log(prob_array) + gumbel_noise
        
        top_indices = np.argpartition(perturbed, -self.pick_n, axis=1)[:, -self.pick_n:]
        simulated_draws = balls[top_indices]
        simulated_draws.sort(axis=1)

        # 1. Individual Ball Frequencies
        flat_balls = simulated_draws.flatten()
        counts = Counter(flat_balls)
        ball_frequencies = {int(b): int(counts[b]) for b in balls}

        # 2. Sum Distribution
        sums = simulated_draws.sum(axis=1)
        sum_hist, sum_bin_edges = np.histogram(sums, bins=15)
        sum_distribution = {
            "bins": [f"{int(sum_bin_edges[i])}-{int(sum_bin_edges[i+1])}" for i in range(len(sum_hist))],
            "counts": [int(x) for x in sum_hist],
            "mean_sum": float(np.mean(sums)),
            "std_sum": float(np.std(sums)),
            "min_sum": int(np.min(sums)),
            "max_sum": int(np.max(sums))
        }

        # 3. Odd/Even Distribution
        odd_counts = np.sum(simulated_draws % 2 != 0, axis=1)
        odd_even_hist = Counter(odd_counts)
        odd_even_distribution = {f"{int(k)} Lẻ / {self.pick_n - int(k)} Chẵn": int(v) for k, v in sorted(odd_even_hist.items())}

        # 4. Top Most Frequent Combinations
        comb_tuples = [tuple(int(x) for x in row) for row in simulated_draws]
        comb_counter = Counter(comb_tuples)
        top_combs = []
        for comb, freq in comb_counter.most_common(10):
            top_combs.append({
                "numbers": [int(x) for x in comb],
                "frequency": int(freq),
                "percentage": round(float((freq / num_simulations) * 100), 4),
                "sum": int(sum(comb)),
                "odd_count": int(sum(1 for x in comb if x % 2 != 0))
            })

        # Probability distribution vector
        sim_probs = {int(b): float(counts[b] / (num_simulations * self.pick_n)) for b in balls}

        return {
            "num_simulations": int(num_simulations),
            "ball_frequencies": ball_frequencies,
            "simulated_probabilities": sim_probs,
            "sum_distribution": sum_distribution,
            "odd_even_distribution": odd_even_distribution,
            "top_combinations": top_combs
        }
