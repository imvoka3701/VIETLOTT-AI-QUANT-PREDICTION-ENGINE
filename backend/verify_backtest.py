import requests
import time

t0 = time.time()
res = requests.post(
    'http://127.0.0.1:8000/api/backtest/run',
    json={'game_type': 'mega645', 'num_test_draws': 25, 'tickets_per_draw': 5, 'strategy': 'ensemble_ga'}
).json()
elapsed = time.time() - t0

print(f"Time: {elapsed:.2f}s")
print(f"Total tickets evaluated: {res.get('total_tickets_evaluated')}")
print(f"Average matched balls: {res.get('average_matched_balls')}")
print(f"Win rates: {res.get('win_rates')}")
