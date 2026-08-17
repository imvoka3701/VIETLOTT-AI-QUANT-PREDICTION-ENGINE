import sys
from pathlib import Path

# Add backend directory to sys.path
sys.path.insert(0, str(Path(__file__).resolve().parent))

from app.main import app
from app.core.database import init_db, get_total_draws_count
from app.core.seed_data import seed_database_if_empty
from app.algorithms.ensemble import EnsemblePredictionEngine
from app.algorithms.genetic_optimizer import GeneticTicketOptimizer
from app.core.database import get_draws

print("1. Testing DB Init & Seeding...")
init_db()
seed_database_if_empty()
m_count = get_total_draws_count("mega645")
p_count = get_total_draws_count("power655")
print(f"   Mega 6/45 count: {m_count}, Power 6/55 count: {p_count}")

print("2. Testing Ensemble Prediction...")
draws = get_draws("mega645", limit=150)
ens = EnsemblePredictionEngine("mega645")
ens_res = ens.run_ensemble(draws, run_mc=True)
print(f"   Top recommended picks: {ens_res['top_picks']}")
print(f"   Ranked balls count: {len(ens_res['ranked_balls'])}")

print("3. Testing Genetic Algorithm Optimizer...")
optimizer = GeneticTicketOptimizer("mega645")
tickets = optimizer.optimize(
    ball_scores=ens_res["normalized_probabilities"],
    num_tickets=3,
    population_size=100,
    generations=50
)
print(f"   Generated tickets count: {len(tickets)}")
for idx, t in enumerate(tickets, 1):
    print(f"   Ticket #{idx}: {t['numbers']} | Fitness: {t['fitness_score']} | Odd/Even: {t['odd_even']}")

print("\n>>> ALL BACKEND TESTS PASSED SUCCESSFULLY! <<<")
