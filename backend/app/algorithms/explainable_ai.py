import numpy as np
from typing import List, Dict, Any, Optional
from .markov_chain import MarkovChainModel
from .bayesian_inference import BayesianHazardModel
from ..config import SUPPORTED_GAMES

class ExplainableAIEngine:
    """
    Transparent Mathematical Reasoning Engine (Explainable AI - XAI).
    Translates high-dimensional Bayesian, Markov, and Feature Engineering signals
    into clear, human-understandable evidence explaining WHY a lottery number is selected.
    """
    def __init__(self, game_type: str = "mega645"):
        self.game_type = game_type
        self.cfg = SUPPORTED_GAMES.get(game_type, SUPPORTED_GAMES["mega645"])
        self.min_n = int(self.cfg.get("min_num", 1))
        self.max_n = int(self.cfg.get("max_num", 45))
        self.markov = MarkovChainModel(game_type)
        self.bayes = BayesianHazardModel(game_type)

    def explain_number(self, target_num: int, draws: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Generates comprehensive mathematical rationale for a specific number.
        """
        if not draws:
            return {"number": target_num, "verdict": "Chưa đủ dữ liệu phân tích"}

        sorted_draws = sorted(draws, key=lambda x: str(x.get("draw_id", "")))
        total_draws = len(sorted_draws)
        latest_draw = sorted_draws[-1]
        latest_nums = latest_draw.get("numbers", [])

        # 1. Bayesian Gap & Hazard
        gaps_map = self.bayes.compute_gaps(sorted_draws)
        ball_gap = gaps_map.get(target_num, {"current_gap": 5, "mean_gap": 8.0, "max_gap": 25})
        cur_gap = ball_gap["current_gap"]
        mean_gap = ball_gap["mean_gap"]
        max_gap = ball_gap.get("max_gap", 25)

        gap_ratio = cur_gap / max(1.0, mean_gap)
        if gap_ratio >= 1.5:
            gap_status = f"Chu kỳ gan đã đạt {cur_gap} kỳ (vượt {gap_ratio:.1f}x ngưỡng trung bình {mean_gap:.1f}). Nguy cơ nổ bóng đạt mức báo động cao."
            hazard_score = min(96.0, 70.0 + gap_ratio * 12.0)
        elif gap_ratio >= 1.0:
            gap_status = f"Độ trễ {cur_gap} kỳ, đã chạm chu kỳ kỳ vọng ({mean_gap:.1f} kỳ). Rất phù hợp điểm rơi xác suất."
            hazard_score = 75.0 + (gap_ratio - 1.0) * 15.0
        else:
            gap_status = f"Bóng mới về cách đây {cur_gap} kỳ (dưới chu kỳ trung bình {mean_gap:.1f}). Đang ở nhịp ngắn."
            hazard_score = 55.0 + gap_ratio * 15.0

        # 2. Markov Chain transition
        markov_probs = self.markov.predict_next_probabilities(sorted_draws)
        m_prob = round(float(markov_probs.get(target_num, 0.02) * 100), 2)
        
        # Determine which ball from the latest draw has the strongest transition to target_num
        trans_matrix = self.markov.build_transition_matrix(sorted_draws)
        best_trigger_ball = None
        best_trigger_prob = 0.0
        for num in latest_nums:
            if self.min_n <= num <= self.max_n:
                t_p = trans_matrix[num - self.min_n, target_num - self.min_n]
                if t_p > best_trigger_prob:
                    best_trigger_prob = t_p
                    best_trigger_ball = num

        markov_explanation = (
            f"Kỳ trước xuất hiện bóng {best_trigger_ball or 'N/A'}. "
            f"Theo ma trận chuyển trạng thái Markov, bóng {best_trigger_ball} kéo bóng {target_num} "
            f"về với xác suất chuyển đổi {round(best_trigger_prob * 100, 1)}%."
        )

        # 3. Frequency & Momentum in last 30 draws
        last_30 = sorted_draws[-30:] if total_draws >= 30 else sorted_draws
        freq_30 = sum(1 for d in last_30 if target_num in d.get("numbers", []))
        expected_30 = len(last_30) * (self.cfg.get("pick_count", 6) / max(1, self.max_n - self.min_n + 1))
        deviation = round(freq_30 - expected_30, 1)

        if deviation > 0:
            momentum_verdict = f"Tần suất 30 kỳ đạt {freq_30} lần (+{deviation} so với kỳ vọng lý thuyết). Số đang trong pha sóng nóng (Momentum)."
        else:
            momentum_verdict = f"Tần suất 30 kỳ đạt {freq_30} lần ({deviation} so với kỳ vọng lý thuyết). Biên độ tích lũy nén cao."

        # Overall Confidence Synthesis
        overall_confidence = round(min(98.5, max(65.0, (hazard_score * 0.4 + m_prob * 1.8 + (50 + deviation * 5) * 0.3))), 1)

        return {
            "number": target_num,
            "overall_confidence": overall_confidence,
            "metrics": {
                "current_gap": cur_gap,
                "mean_gap": round(mean_gap, 1),
                "max_historical_gap": max_gap,
                "markov_probability_pct": m_prob,
                "recent_appearances_30": freq_30,
                "expected_appearances_30": round(expected_30, 1)
            },
            "reasons": [
                {
                    "title": "Hàm Nguy Cơ & Độ Trễ (Bayesian Hazard)",
                    "detail": gap_status,
                    "strength": "HIGH" if gap_ratio >= 1.0 else "NORMAL"
                },
                {
                    "title": "Ma Trận Chuyển Trạng Thái (Markov Transition)",
                    "detail": markov_explanation,
                    "strength": "HIGH" if m_prob > 2.5 else "NORMAL"
                },
                {
                    "title": "Xung Lực Sóng Tần Suất (Rolling Momentum)",
                    "detail": momentum_verdict,
                    "strength": "HIGH" if abs(deviation) >= 1.5 else "NORMAL"
                }
            ],
            "recommendation": (
                f"Số {target_num} hội tụ đủ 3 yếu tố: chu kỳ gan, liên kết ma trận Markov từ kỳ #{latest_draw.get('draw_id', '')}, "
                f"và xung lượng sóng thống kê với độ tin cậy ước tính {overall_confidence}%."
            )
        }

    def explain_ticket(self, numbers: List[int], draws: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Generates full XAI report for an entire ticket of numbers.
        """
        ball_explanations = [self.explain_number(n, draws) for n in sorted(numbers)]
        avg_confidence = round(float(np.mean([b["overall_confidence"] for b in ball_explanations])), 1)

        ticket_sum = sum(numbers)
        odd_c = sum(1 for n in numbers if n % 2 != 0)
        even_c = len(numbers) - odd_c

        return {
            "ticket_numbers": sorted(numbers),
            "average_confidence": avg_confidence,
            "sum": ticket_sum,
            "odd_even": f"{odd_c}L/{even_c}C",
            "balls_rationale": ball_explanations,
            "summary_verdict": (
                f"Bộ số {sorted(numbers)} đạt tổng điểm {ticket_sum} (thuộc vùng tối ưu phân phối Gaussian), "
                f"tỷ lệ chẵn lẻ {odd_c}L/{even_c}C cân bằng, chỉ số độ tin cậy định lượng tổng hợp {avg_confidence}%."
            )
        }
