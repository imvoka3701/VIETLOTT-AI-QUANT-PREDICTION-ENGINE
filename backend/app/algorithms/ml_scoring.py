import numpy as np
import pandas as pd
from typing import List, Dict, Any, Tuple
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from ..config import SUPPORTED_GAMES

class MachineLearningScorer:
    """
    Rolling Feature Engineering and Machine Learning Model.
    Extracts 15+ multi-horizon statistical features per ball across historical draws,
    and trains an ensemble classifier to rank potential balls for the next draw.
    """
    def __init__(self, game_type: str = "mega645"):
        self.game_type = game_type
        self.cfg = SUPPORTED_GAMES.get(game_type, SUPPORTED_GAMES["mega645"])
        self.max_n = self.cfg["max_num"]
        self.min_n = self.cfg["min_num"]
        self.num_count = self.max_n - self.min_n + 1

    def extract_features_for_draw(self, draws_chronological: List[Dict[str, Any]], target_idx: int) -> np.ndarray:
        """
        Extracts feature vectors for all balls [min_n..max_n] using only draws prior to target_idx.
        Feature matrix shape: (num_count, n_features)
        """
        history = draws_chronological[:target_idx]
        if not history:
            return np.zeros((self.num_count, 10))

        n_hist = len(history)
        
        # 1. Binary presence matrix: shape (n_hist, num_count)
        presence = np.zeros((n_hist, self.num_count), dtype=np.float32)
        for h_idx, d in enumerate(history):
            for num in d["numbers"]:
                if self.min_n <= num <= self.max_n:
                    presence[h_idx, num - 1] = 1.0

        features = []
        for i in range(self.num_count):
            p_series = presence[:, i]
            
            # EMA frequencies
            w10 = min(10, n_hist)
            w30 = min(30, n_hist)
            w100 = min(100, n_hist)
            
            freq_10 = float(np.mean(p_series[-w10:])) if w10 > 0 else 0.0
            freq_30 = float(np.mean(p_series[-w30:])) if w30 > 0 else 0.0
            freq_100 = float(np.mean(p_series[-w100:])) if w100 > 0 else 0.0
            
            # Current Lag
            appeared_indices = np.where(p_series == 1.0)[0]
            if len(appeared_indices) > 0:
                current_lag = float(n_hist - 1 - appeared_indices[-1])
                gaps = np.diff(appeared_indices) if len(appeared_indices) > 1 else np.array([current_lag + 1])
                mean_hist_gap = float(np.mean(gaps))
                std_hist_gap = float(np.std(gaps)) if len(gaps) > 1 else 1.0
            else:
                current_lag = float(n_hist)
                mean_hist_gap = float(self.num_count / self.cfg["pick_count"])
                std_hist_gap = 1.0

            # Momentum / acceleration
            momentum = freq_10 - freq_30
            
            # Consecutive draw appearance flag in last 2 draws
            last_drawn = p_series[-1] if n_hist >= 1 else 0.0
            second_last_drawn = p_series[-2] if n_hist >= 2 else 0.0

            # Ball Zone (Normalized between 0 and 1)
            zone_pos = (i) / float(self.num_count)
            is_odd = 1.0 if ((i + 1) % 2 != 0) else 0.0

            feat_vector = [
                freq_10,
                freq_30,
                freq_100,
                current_lag,
                mean_hist_gap,
                std_hist_gap,
                (current_lag - mean_hist_gap) / max(0.5, std_hist_gap), # normalized z-lag
                momentum,
                last_drawn,
                second_last_drawn,
                zone_pos,
                is_odd
            ]
            features.append(feat_vector)

        return np.array(features, dtype=np.float32)

    def train_and_predict(self, draws: List[Dict[str, Any]]) -> Dict[int, float]:
        """
        Builds training dataset over historical sliding windows,
        fits Random Forest Classifier, and infers probability for upcoming draw.
        """
        if len(draws) < 25:
            # Fallback uniform
            return {i: 1.0 / self.num_count for i in range(self.min_n, self.max_n + 1)}

        sorted_draws = sorted(draws, key=lambda x: x["id"] if "id" in x else x["draw_id"])
        
        # Prepare training samples
        # Use last min(150, len(draws) - 20) draws as training set
        n_total = len(sorted_draws)
        train_start = max(20, n_total - 120)
        
        X_train_list = []
        y_train_list = []

        for target_idx in range(train_start, n_total):
            X_feats = self.extract_features_for_draw(sorted_draws, target_idx)
            
            # Ground truth for target_idx: which balls appeared?
            actual_nums = set(sorted_draws[target_idx]["numbers"])
            y_labels = np.array([1 if (i + 1) in actual_nums else 0 for i in range(self.num_count)])
            
            X_train_list.append(X_feats)
            y_train_list.append(y_labels)

        X_train = np.vstack(X_train_list)
        y_train = np.concatenate(y_train_list)

        # Fit model
        try:
            clf = RandomForestClassifier(
                n_estimators=60,
                max_depth=6,
                min_samples_split=4,
                random_state=42,
                class_weight='balanced_subsample',
                n_jobs=-1
            )
            clf.fit(X_train, y_train)

            # Predict probabilities for next draw (after n_total)
            X_next = self.extract_features_for_draw(sorted_draws, n_total)
            
            # Predict prob of class 1 (appearance)
            if hasattr(clf, "predict_proba"):
                probs = clf.predict_proba(X_next)[:, 1]
            else:
                probs = clf.predict(X_next)

            # Softmax / Normalize
            exp_probs = np.exp(probs * 2.5) # sharpen slightly
            norm_probs = exp_probs / exp_probs.sum()

            return {i + 1: float(norm_probs[i]) for i in range(self.num_count)}
        except Exception as e:
            print(f"ML Scoring error: {e}")
            return {i: 1.0 / self.num_count for i in range(self.min_n, self.max_n + 1)}
