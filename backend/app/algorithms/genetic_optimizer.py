import random
import numpy as np
from typing import List, Dict, Any, Set, Optional, Tuple
from ..config import SUPPORTED_GAMES

class GeneticTicketOptimizer:
    """
    Multi-Objective Genetic Algorithm for Lottery Portfolio Optimization.
    Evolves a population of candidate tickets over multiple generations
    optimizing ensemble probability, entropy dispersion, Gaussian sum fit, and custom constraints.
    """
    def __init__(self, game_type: str = "mega645"):
        self.game_type = game_type
        self.cfg = SUPPORTED_GAMES.get(game_type, SUPPORTED_GAMES["mega645"])
        self.max_n = self.cfg["max_num"]
        self.min_n = self.cfg["min_num"]
        self.pick_n = self.cfg["pick_count"]
        
        # Theoretical ideal sum
        # E(sum) = pick_n * (min_n + max_n) / 2
        self.ideal_sum = self.pick_n * (self.min_n + self.max_n) / 2.0
        self.ideal_sum_std = (self.max_n - self.min_n) * 4.5

    def calculate_fitness(
        self,
        chromosome: List[int],
        ball_scores: Dict[int, float],
        favorite_nums: Set[int],
        banned_nums: Set[int],
        sum_range: Optional[Tuple[int, int]] = None
    ) -> float:
        """
        Multi-objective fitness function scoring a 6-number ticket:
        Fitness = w1*Score + w2*SumFit + w3*OddEvenFit + w4*SpreadFit - Penalties
        """
        chrom_set = set(chromosome)
        
        # Hard constraint violations
        if len(chrom_set) != self.pick_n:
            return -1000.0 # Duplicates invalid
        
        if any(b in chrom_set for b in banned_nums):
            return -1000.0 # Contains banned numbers
            
        if not favorite_nums.issubset(chrom_set):
            return -1000.0 # Missing required favorites

        ticket_sum = sum(chromosome)
        if sum_range:
            min_s, max_s = sum_range
            if ticket_sum < min_s or ticket_sum > max_s:
                return -500.0

        # 1. Ensemble Probability Score (w1 = 0.45)
        # Sum of normalized probabilities of chosen balls
        prob_score = sum(ball_scores.get(b, 0.01) for b in chromosome)
        norm_prob_score = prob_score * 10.0

        # 2. Gaussian Sum Alignment (w2 = 0.20)
        # Difference from theoretical mean
        sum_z = abs(ticket_sum - self.ideal_sum) / self.ideal_sum_std
        sum_fit = max(0.0, 1.0 - sum_z * 0.5)

        # 3. Odd/Even Balance (w3 = 0.15)
        # Ideal: 3/3, 4/2, 2/4. Extreme: 6/0, 0/6 get penalised
        odd_count = sum(1 for b in chromosome if b % 2 != 0)
        if odd_count in (3, 2, 4):
            odd_fit = 1.0
        elif odd_count in (1, 5):
            odd_fit = 0.5
        else: # 0 or 6
            odd_fit = 0.1

        # 4. Dispersion / Distance Spread (w4 = 0.20)
        sorted_chrom = sorted(chromosome)
        consecutive_count = sum(1 for i in range(len(sorted_chrom)-1) if sorted_chrom[i+1] - sorted_chrom[i] == 1)
        
        # Penalize if 3+ consecutive numbers (e.g. 14, 15, 16)
        consec_penalty = 0.0
        if consecutive_count >= 2:
            consec_penalty = 0.3 * consecutive_count

        spread_range = (sorted_chrom[-1] - sorted_chrom[0]) / float(self.max_n - self.min_n)
        spread_fit = max(0.0, spread_range - consec_penalty)

        total_fitness = (
            0.45 * norm_prob_score +
            0.20 * sum_fit +
            0.15 * odd_fit +
            0.20 * spread_fit
        )
        return float(total_fitness)

    def optimize(
        self,
        ball_scores: Dict[int, float],
        num_tickets: int = 5,
        population_size: int = 150,
        generations: int = 120,
        favorite_nums: Optional[List[int]] = None,
        banned_nums: Optional[List[int]] = None,
        sum_range: Optional[Tuple[int, int]] = None
    ) -> List[Dict[str, Any]]:
        """
        Executes Genetic Algorithm optimization to generate top optimal tickets.
        """
        fav_set = set(favorite_nums or [])
        ban_set = set(banned_nums or [])
        available_pool = [b for b in range(self.min_n, self.max_n + 1) if b not in ban_set and b not in fav_set]

        if len(fav_set) > self.pick_n:
            fav_set = set(list(fav_set)[:self.pick_n])
        needed_picks = self.pick_n - len(fav_set)

        # Initialize Population
        population: List[List[int]] = []
        for _ in range(population_size):
            sampled = random.sample(available_pool, needed_picks)
            chrom = list(fav_set) + sampled
            random.shuffle(chrom)
            population.append(chrom)

        # Evolution Loop
        for gen in range(generations):
            # Evaluate fitness
            scores = [
                self.calculate_fitness(chrom, ball_scores, fav_set, ban_set, sum_range)
                for chrom in population
            ]

            # Sort population by fitness descending
            sorted_pairs = sorted(zip(population, scores), key=lambda x: x[1], reverse=True)
            population = [pair[0] for pair in sorted_pairs]
            current_best_score = sorted_pairs[0][1]

            # Elitism: retain top 15%
            elite_count = max(2, int(population_size * 0.15))
            next_generation = [list(population[i]) for i in range(elite_count)]

            # Generate rest of population
            while len(next_generation) < population_size:
                # Tournament Selection
                p1 = self._tournament_select(population, scores, k=4)
                p2 = self._tournament_select(population, scores, k=4)

                # Crossover
                child = self._crossover(p1, p2, fav_set, available_pool, needed_picks)

                # Mutation
                if random.random() < 0.25:
                    child = self._mutate(child, fav_set, available_pool)

                next_generation.append(child)

            population = next_generation

        # Final Evaluation & Extract Unique Best Tickets
        final_scores = [
            self.calculate_fitness(chrom, ball_scores, fav_set, ban_set, sum_range)
            for chrom in population
        ]
        sorted_final = sorted(zip(population, final_scores), key=lambda x: x[1], reverse=True)

        unique_tickets = []
        seen_combos = set()

        for chrom, fit in sorted_final:
            sorted_ticket = tuple(sorted(chrom))
            if sorted_ticket not in seen_combos and fit > 0:
                seen_combos.add(sorted_ticket)
                
                t_list = list(sorted_ticket)
                odd_c = sum(1 for x in t_list if x % 2 != 0)
                even_c = self.pick_n - odd_c
                t_sum = sum(t_list)

                # Compute normalized confidence percentage
                confidence_pct = min(99.2, max(45.0, fit * 38.0))

                unique_tickets.append({
                    "numbers": t_list,
                    "fitness_score": round(fit, 4),
                    "confidence": round(confidence_pct, 1),
                    "sum": t_sum,
                    "odd_even": f"{odd_c}L/{even_c}C",
                    "strategy": "Genetic Algorithm Multi-Objective"
                })

                if len(unique_tickets) >= num_tickets:
                    break

        return unique_tickets

    def _tournament_select(self, population: List[List[int]], scores: List[float], k: int = 4) -> List[int]:
        candidates = random.sample(range(len(population)), k)
        best_idx = max(candidates, key=lambda idx: scores[idx])
        return population[best_idx]

    def _crossover(
        self,
        p1: List[int],
        p2: List[int],
        fav_set: Set[int],
        available_pool: List[int],
        needed_picks: int
    ) -> List[int]:
        # Filter non-favorite elements
        pool1 = [x for x in p1 if x not in fav_set]
        pool2 = [x for x in p2 if x not in fav_set]
        
        # Combine unique elements
        combined = list(dict.fromkeys(pool1[:len(pool1)//2] + pool2))
        
        # If not enough, fill from available pool
        for x in pool1:
            if x not in combined:
                combined.append(x)
        for x in available_pool:
            if len(combined) >= needed_picks:
                break
            if x not in combined:
                combined.append(x)

        child_picks = combined[:needed_picks]
        return list(fav_set) + child_picks

    def _mutate(self, chromosome: List[int], fav_set: Set[int], available_pool: List[int]) -> List[int]:
        mutated = list(chromosome)
        non_fav_indices = [i for i, x in enumerate(mutated) if x not in fav_set]
        if not non_fav_indices:
            return mutated

        swap_idx = random.choice(non_fav_indices)
        current_set = set(mutated)
        candidates = [x for x in available_pool if x not in current_set]
        if candidates:
            mutated[swap_idx] = random.choice(candidates)
        return mutated
