import random
from typing import List, Dict, Any, Optional
from .markov_chain import MarkovChainModel
from .bayesian_inference import BayesianHazardModel
from .genetic_optimizer import GeneticTicketOptimizer
from ..config import SUPPORTED_GAMES

class StrategyBacktester:
    """
    High-Performance Backtesting engine evaluating algorithmic prediction accuracy
    over sliding historical time windows.
    """
    def __init__(self, game_type: str = "mega645"):
        self.game_type = game_type
        self.cfg = SUPPORTED_GAMES.get(game_type, SUPPORTED_GAMES["mega645"])
        self.max_n = self.cfg["max_num"]
        self.min_n = self.cfg["min_num"]
        self.num_count = self.max_n - self.min_n + 1
        self.pick_n = self.cfg["pick_count"]

    def run_backtest(
        self,
        draws: List[Dict[str, Any]],
        num_test_draws: int = 25,
        tickets_per_draw: int = 5,
        strategy: str = "ensemble_ga"
    ) -> Dict[str, Any]:
        """
        Runs sliding-window walk-forward validation across the last `num_test_draws` draws.
        Optimized for real-time responsiveness (< 2 seconds).
        """
        sorted_draws = sorted(draws, key=lambda x: x["id"] if "id" in x else x["draw_id"])
        total_len = len(sorted_draws)
        
        if total_len < num_test_draws + 20:
            num_test_draws = max(5, total_len - 20)

        test_start_idx = total_len - num_test_draws
        
        match_counter = {i: 0 for i in range(self.pick_n + 1)}
        total_tickets_evaluated = 0
        total_matched_balls = 0
        
        # Baseline random counter for comparison
        random_match_counter = {i: 0 for i in range(self.pick_n + 1)}
        
        history_results = []
        
        markov = MarkovChainModel(self.game_type)
        bayesian = BayesianHazardModel(self.game_type)
        ga_optimizer = GeneticTicketOptimizer(self.game_type)

        for t_idx in range(test_start_idx, total_len):
            history_subset = sorted_draws[:t_idx]
            actual_draw = sorted_draws[t_idx]
            actual_numbers = set(actual_draw["numbers"])

            # Fast ensemble blending Markov + Bayesian Hazard (sub-millisecond computation)
            m_probs = markov.predict_next_probabilities(history_subset)
            b_probs = bayesian.predict_next_probabilities(history_subset)
            
            ball_scores = {}
            for num in range(self.min_n, self.max_n + 1):
                ball_scores[num] = (m_probs.get(num, 0.0) * 0.45 + b_probs.get(num, 0.0) * 0.55)

            if strategy == "ensemble_ga":
                generated_tickets = ga_optimizer.optimize(
                    ball_scores=ball_scores,
                    num_tickets=tickets_per_draw,
                    population_size=50,
                    generations=25
                )
                tickets_to_test = [t["numbers"] for t in generated_tickets]
            elif strategy == "top_ranked":
                sorted_by_score = sorted(ball_scores.items(), key=lambda x: x[1], reverse=True)
                top_pool = [x[0] for x in sorted_by_score[:self.pick_n + 6]]
                tickets_to_test = []
                for _ in range(tickets_per_draw):
                    tickets_to_test.append(sorted(random.sample(top_pool, self.pick_n)))
            else:
                sorted_by_score = sorted(ball_scores.items(), key=lambda x: x[1], reverse=True)
                top_pick = [x[0] for x in sorted_by_score[:self.pick_n]]
                tickets_to_test = [top_pick]

            draw_best_match = 0
            # Test tickets
            for ticket in tickets_to_test:
                matched = len(set(ticket).intersection(actual_numbers))
                match_counter[matched] += 1
                total_matched_balls += matched
                total_tickets_evaluated += 1
                if matched > draw_best_match:
                    draw_best_match = matched

                # Random ticket baseline
                rand_t = set(random.sample(range(self.min_n, self.max_n + 1), self.pick_n))
                rand_matched = len(rand_t.intersection(actual_numbers))
                random_match_counter[rand_matched] += 1

            history_results.append({
                "draw_id": actual_draw["draw_id"],
                "draw_date": actual_draw["draw_date"],
                "actual_numbers": actual_draw["numbers"],
                "best_matched": draw_best_match,
                "tickets_tested_count": len(tickets_to_test)
            })

        avg_matched = round(total_matched_balls / max(1, total_tickets_evaluated), 2)
        
        # Calculate Win Tier Rates
        win_rates = {
            f"Trúng {k} số": {
                "count": match_counter[k],
                "rate_pct": round((match_counter[k] / max(1, total_tickets_evaluated)) * 100, 2),
                "random_baseline_pct": round((random_match_counter[k] / max(1, total_tickets_evaluated)) * 100, 2)
            }
            for k in range(3, self.pick_n + 1)
        }

        return {
            "game_type": self.game_type,
            "strategy": strategy,
            "num_draws_tested": num_test_draws,
            "total_tickets_evaluated": total_tickets_evaluated,
            "average_matched_balls": avg_matched,
            "match_distribution": match_counter,
            "win_rates": win_rates,
            "history_test_details": history_results[-10:]
        }
