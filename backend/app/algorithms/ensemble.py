import numpy as np
from typing import List, Dict, Any, Optional
from .markov_chain import MarkovChainModel
from .bayesian_inference import BayesianHazardModel
from .ml_scoring import MachineLearningScorer
from .monte_carlo import MonteCarloSimulator
from ..config import SUPPORTED_GAMES

class EnsemblePredictionEngine:
    """
    Multi-Model Algorithmic Ensemble Engine.
    Blends Markov Chain Transitions, Bayesian Hazard Rates, Random Forest Scorer,
    and Monte Carlo Simulations into a unified high-dimensional probability ranking.
    """
    def __init__(self, game_type: str = "mega645"):
        self.game_type = game_type
        self.cfg = SUPPORTED_GAMES.get(game_type, SUPPORTED_GAMES["mega645"])
        self.max_n = int(self.cfg["max_num"])
        self.min_n = int(self.cfg["min_num"])
        self.num_count = int(self.max_n - self.min_n + 1)

        self.markov = MarkovChainModel(game_type)
        self.bayesian = BayesianHazardModel(game_type)
        self.ml_scorer = MachineLearningScorer(game_type)
        self.monte_carlo = MonteCarloSimulator(game_type)

    def run_ensemble(
        self,
        draws: List[Dict[str, Any]],
        weights: Optional[Dict[str, float]] = None,
        run_mc: bool = True
    ) -> Dict[str, Any]:
        """
        Executes full algorithmic suite and blends scores.
        """
        if weights is None:
            weights = {
                "markov": 0.25,
                "bayesian": 0.30,
                "ml": 0.30,
                "monte_carlo": 0.15
            }

        # 1. Markov Chain probabilities
        raw_markov = self.markov.predict_next_probabilities(draws)
        markov_probs = {int(k): float(v) for k, v in raw_markov.items()}

        # 2. Bayesian Hazard probabilities
        raw_bayes = self.bayesian.predict_next_probabilities(draws)
        bayesian_probs = {int(k): float(v) for k, v in raw_bayes.items()}

        # 3. ML Scorer probabilities
        raw_ml = self.ml_scorer.train_and_predict(draws)
        ml_probs = {int(k): float(v) for k, v in raw_ml.items()}

        # 4. Monte Carlo Simulation based on preliminary blend
        temp_blend = {}
        for num in range(self.min_n, self.max_n + 1):
            temp_blend[num] = (
                markov_probs.get(num, 0.0) * weights.get("markov", 0.3) +
                bayesian_probs.get(num, 0.0) * weights.get("bayesian", 0.35) +
                ml_probs.get(num, 0.0) * weights.get("ml", 0.35)
            )

        mc_result = None
        if run_mc:
            mc_result = self.monte_carlo.run_simulation(temp_blend, num_simulations=25000)
            mc_probs = {int(k): float(v) for k, v in mc_result["simulated_probabilities"].items()}
        else:
            mc_probs = {int(num): float(1.0 / self.num_count) for num in range(self.min_n, self.max_n + 1)}

        # Final Ensemble Aggregation
        w_m = float(weights.get("markov", 0.25))
        w_b = float(weights.get("bayesian", 0.30))
        w_l = float(weights.get("ml", 0.30))
        w_c = float(weights.get("monte_carlo", 0.15))
        total_w = max(0.001, w_m + w_b + w_l + w_c)

        final_scores = {}
        for num in range(self.min_n, self.max_n + 1):
            score = (
                w_m * markov_probs.get(num, 0.0) +
                w_b * bayesian_probs.get(num, 0.0) +
                w_l * ml_probs.get(num, 0.0) +
                w_c * mc_probs.get(num, 0.0)
            ) / total_w
            final_scores[int(num)] = float(score)

        # Normalize final scores to sum = 1
        sum_scores = sum(final_scores.values())
        normalized_scores = {int(num): float(s / sum_scores) for num, s in final_scores.items()}

        # Ranked list
        ranked_balls = sorted(
            [
                {
                    "number": int(num),
                    "score": round(float(normalized_scores[num] * 100), 3),
                    "markov_score": round(float(markov_probs.get(num, 0) * 100), 2),
                    "bayesian_score": round(float(bayesian_probs.get(num, 0) * 100), 2),
                    "ml_score": round(float(ml_probs.get(num, 0) * 100), 2),
                    "mc_score": round(float(mc_probs.get(num, 0) * 100), 2)
                }
                for num in range(self.min_n, self.max_n + 1)
            ],
            key=lambda x: x["score"],
            reverse=True
        )

        return {
            "game_type": self.game_type,
            "weights_used": weights,
            "normalized_probabilities": normalized_scores,
            "ranked_balls": ranked_balls,
            "top_picks": [int(b["number"]) for b in ranked_balls[:self.cfg["pick_count"]]],
            "markov_probabilities": markov_probs,
            "bayesian_probabilities": bayesian_probs,
            "ml_probabilities": ml_probs,
            "monte_carlo_result": mc_result
        }
