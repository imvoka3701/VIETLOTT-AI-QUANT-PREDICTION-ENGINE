import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Cpu,
  Sliders,
  Sparkles,
  Zap,
  BookmarkPlus,
  CheckCircle2,
  Filter,
  Flame,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import LotteryBall from './LotteryBall';

export default function PredictionStudio({ selectedGame, onSaveTickets }) {
  const maxNum = selectedGame === 'mega645' ? 45 : 55;

  // Algorithm Weights
  const [weights, setWeights] = useState({
    markov: 25,
    bayesian: 30,
    ml: 30,
    monte_carlo: 15
  });

  // Constraints
  const [favoriteNums, setFavoriteNums] = useState([]);
  const [bannedNums, setBannedNums] = useState([]);
  const [sumRange, setSumRange] = useState(
    selectedGame === 'mega645' ? [110, 160] : [140, 200]
  );
  const [numTickets, setNumTickets] = useState(5);
  const [generations, setGenerations] = useState(100);

  // States
  const [isLoading, setIsLoading] = useState(false);
  const [ensembleData, setEnsembleData] = useState(null);
  const [generatedTickets, setGeneratedTickets] = useState([]);
  const [savedStatus, setSavedStatus] = useState({});

  useEffect(() => {
    // Reset selections on game change
    setFavoriteNums([]);
    setBannedNums([]);
    setSumRange(selectedGame === 'mega645' ? [110, 160] : [140, 200]);
    loadEnsembleData();
  }, [selectedGame]);

  const loadEnsembleData = async () => {
    try {
      const wNormalized = {
        markov: weights.markov / 100,
        bayesian: weights.bayesian / 100,
        ml: weights.ml / 100,
        monte_carlo: weights.monte_carlo / 100
      };

      const res = await fetch('/api/predict/ensemble', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          game_type: selectedGame,
          weights: wNormalized,
          run_mc: true
        })
      });
      if (res.ok) {
        const data = await res.json();
        setEnsembleData(data);
      }
    } catch (e) {
      console.error('Error loading ensemble:', e);
    }
  };

  const handleRunGeneticOptimization = async () => {
    setIsLoading(true);
    try {
      const wNormalized = {
        markov: weights.markov / 100,
        bayesian: weights.bayesian / 100,
        ml: weights.ml / 100,
        monte_carlo: weights.monte_carlo / 100
      };

      const res = await fetch('/api/predict/generate_tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          game_type: selectedGame,
          num_tickets: numTickets,
          favorite_numbers: favoriteNums,
          banned_numbers: bannedNums,
          sum_min: sumRange[0],
          sum_max: sumRange[1],
          weights: wNormalized,
          population_size: 160,
          generations: generations
        })
      });

      if (res.ok) {
        const data = await res.json();
        setGeneratedTickets(data.tickets || []);
        
        // Trigger confetti celebration
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.6 }
        });
      }
    } catch (e) {
      console.error('Error optimizing:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleBallSelection = (num, type) => {
    if (type === 'favorite') {
      if (favoriteNums.includes(num)) {
        setFavoriteNums(favoriteNums.filter((n) => n !== num));
      } else {
        if (favoriteNums.length >= 5) return;
        setBannedNums(bannedNums.filter((n) => n !== num));
        setFavoriteNums([...favoriteNums, num]);
      }
    } else if (type === 'banned') {
      if (bannedNums.includes(num)) {
        setBannedNums(bannedNums.filter((n) => n !== num));
      } else {
        setFavoriteNums(favoriteNums.filter((n) => n !== num));
        setBannedNums([...bannedNums, num]);
      }
    }
  };

  const handleSaveSingle = async (ticket, idx) => {
    try {
      const res = await fetch('/api/tracker/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          game_type: selectedGame,
          numbers: ticket.numbers,
          algorithm_used: 'Genetic Algorithm Multi-Objective',
          confidence_score: ticket.confidence,
          notes: `Fitness: ${ticket.fitness_score}`
        })
      });
      if (res.ok) {
        setSavedStatus((prev) => ({ ...prev, [idx]: true }));
        if (onSaveTickets) onSaveTickets();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSaveAll = async () => {
    if (!generatedTickets.length) return;
    try {
      const res = await fetch('/api/tracker/tickets/batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          game_type: selectedGame,
          tickets: generatedTickets
        })
      });
      if (res.ok) {
        const newStatus = {};
        generatedTickets.forEach((_, idx) => {
          newStatus[idx] = true;
        });
        setSavedStatus(newStatus);
        if (onSaveTickets) onSaveTickets();
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
      {/* Left Column: Algorithm Config & Constraints */}
      <div className="xl:col-span-5 flex flex-col gap-6">
        {/* Algorithmic Suite Card */}
        <div className="glass-panel p-6 rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Cpu className="w-5 h-5 text-cyan-400" />
              Trọng Số Mô Hình Toán Học
            </h3>
            <span className="text-xs text-slate-400">Ensemble Tuning</span>
          </div>

          <div className="space-y-4 text-xs">
            {/* Markov */}
            <div>
              <div className="flex justify-between mb-1 text-slate-300">
                <span className="font-medium">1. Ma Trận Chuyển Trạng Thái Markov</span>
                <span className="font-mono text-cyan-400 font-bold">{weights.markov}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={weights.markov}
                onChange={(e) => setWeights({ ...weights, markov: Number(e.target.value) })}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
            </div>

            {/* Bayes */}
            <div>
              <div className="flex justify-between mb-1 text-slate-300">
                <span className="font-medium">2. Suy Diễn Bayes & Chu Kỳ Weibull</span>
                <span className="font-mono text-indigo-400 font-bold">{weights.bayesian}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={weights.bayesian}
                onChange={(e) => setWeights({ ...weights, bayesian: Number(e.target.value) })}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-400"
              />
            </div>

            {/* ML */}
            <div>
              <div className="flex justify-between mb-1 text-slate-300">
                <span className="font-medium">3. Machine Learning (Rolling Features)</span>
                <span className="font-mono text-purple-400 font-bold">{weights.ml}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={weights.ml}
                onChange={(e) => setWeights({ ...weights, ml: Number(e.target.value) })}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-400"
              />
            </div>

            {/* Monte Carlo */}
            <div>
              <div className="flex justify-between mb-1 text-slate-300">
                <span className="font-medium">4. Mô Phỏng Đa Luồng Monte Carlo</span>
                <span className="font-mono text-amber-400 font-bold">{weights.monte_carlo}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={weights.monte_carlo}
                onChange={(e) => setWeights({ ...weights, monte_carlo: Number(e.target.value) })}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
              />
            </div>
          </div>
        </div>

        {/* Constraint Filters Card */}
        <div className="glass-panel p-6 rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Filter className="w-5 h-5 text-indigo-400" />
              Bộ Lọc & Ràng Buộc Thông Minh
            </h3>
          </div>

          {/* Number Picker Grid for Favorites / Banned */}
          <div className="mb-4">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="text-slate-300 font-medium flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-amber-400" />
                Bóng Yêu Thích (Tối đa 5):
              </span>
              <span className="text-slate-400">Đã chọn: {favoriteNums.length}/5</span>
            </div>

            <div className="flex flex-wrap gap-1.5 p-2.5 bg-slate-950/60 rounded-xl border border-slate-800 max-h-36 overflow-y-auto">
              {Array.from({ length: maxNum }, (_, i) => i + 1).map((n) => {
                const isFav = favoriteNums.includes(n);
                const isBan = bannedNums.includes(n);
                return (
                  <button
                    key={n}
                    onClick={() => toggleBallSelection(n, 'favorite')}
                    className={`w-7 h-7 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                      isFav
                        ? 'bg-amber-500 text-slate-950 ring-2 ring-amber-300'
                        : isBan
                        ? 'bg-red-950/40 text-red-700 opacity-40 line-through'
                        : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    {String(n).padStart(2, '0')}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Target Sum & Genetic Parameters */}
          <div className="space-y-4 text-xs pt-2 border-t border-slate-800">
            <div>
              <div className="flex justify-between mb-1 text-slate-300">
                <span>Khoảng Tổng Điểm 6 Bóng (Sum Range):</span>
                <span className="font-mono text-cyan-400 font-bold">
                  {sumRange[0]} - {sumRange[1]}
                </span>
              </div>
              <div className="flex gap-2 items-center">
                <input
                  type="number"
                  value={sumRange[0]}
                  onChange={(e) => setSumRange([Number(e.target.value), sumRange[1]])}
                  className="w-20 bg-slate-950 border border-slate-800 rounded px-2 py-1 text-cyan-300 font-mono text-center"
                />
                <span className="text-slate-500">đến</span>
                <input
                  type="number"
                  value={sumRange[1]}
                  onChange={(e) => setSumRange([sumRange[0], Number(e.target.value)])}
                  className="w-20 bg-slate-950 border border-slate-800 rounded px-2 py-1 text-cyan-300 font-mono text-center"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 mb-1">Số lượng vé sinh:</label>
                <select
                  value={numTickets}
                  onChange={(e) => setNumTickets(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white font-mono"
                >
                  <option value={3}>3 Vé</option>
                  <option value={5}>5 Vé</option>
                  <option value={10}>10 Vé</option>
                  <option value={15}>15 Vé</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Số thế hệ GA:</label>
                <select
                  value={generations}
                  onChange={(e) => setGenerations(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white font-mono"
                >
                  <option value={60}>60 Thế Hệ (Nhanh)</option>
                  <option value={120}>120 Thế Hệ (Chuẩn)</option>
                  <option value={250}>250 Thế Hệ (Chuyên Sâu)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <button
            onClick={handleRunGeneticOptimization}
            disabled={isLoading}
            className="w-full mt-6 py-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white shadow-xl shadow-cyan-500/20 active:scale-[0.98] transition-all cursor-pointer disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Zap className="w-5 h-5 animate-spin text-cyan-300" />
                Đang Tiến Hóa & Tối Ưu Quần Thể GA...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 text-yellow-300" />
                CHẠY THUẬT TOÁN DỰ ĐOÁN & TỐI ƯU GA
              </>
            )}
          </button>
        </div>
      </div>

      {/* Right Column: Ranked Ball Pool & Generated Tickets */}
      <div className="xl:col-span-7 flex flex-col gap-6">
        {/* Top High Probability Balls Pool */}
        {ensembleData && (
          <div className="glass-panel p-6 rounded-2xl">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                Top Bóng Tiềm Năng Nhất (Xác Suất Tổng Hợp)
              </h3>
              <span className="text-xs text-emerald-400 font-mono font-semibold">
                Đã phân tích 300+ kỳ
              </span>
            </div>

            <p className="text-xs text-slate-400 mb-4">
              Xếp hạng xác suất kết hợp từ 4 mô hình định lượng (Markov, Bayesian Hazard, ML Classifier, Monte Carlo):
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
              {ensembleData.ranked_balls.slice(0, 6).map((ball, idx) => (
                <div
                  key={ball.number}
                  className="bg-slate-950/70 border border-slate-800/80 p-3 rounded-xl flex flex-col items-center gap-2 hover:border-cyan-500/50 transition-all"
                >
                  <span className="text-[10px] font-bold text-slate-500">#{idx + 1}</span>
                  <LotteryBall number={ball.number} size="md" />
                  <div className="text-center">
                    <span className="text-xs font-mono font-bold text-cyan-400">{ball.score}%</span>
                    <p className="text-[9px] text-slate-500">Điểm AI</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Generated Optimal Tickets */}
        <div className="glass-panel p-6 rounded-2xl flex-1 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <Cpu className="w-5 h-5 text-cyan-400" />
                Danh Mục Vé Tối Ưu Pareto (Genetic Evolution)
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Các bộ số đã tối ưu hóa hàm thích nghi đa mục tiêu (Entropy, Gaussian Sum, Odd/Even).
              </p>
            </div>

            {generatedTickets.length > 0 && (
              <button
                onClick={handleSaveAll}
                className="px-3 py-1.5 bg-emerald-600/20 border border-emerald-500/40 hover:bg-emerald-600/30 text-emerald-300 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <BookmarkPlus className="w-4 h-4" />
                Lưu Tất Cả
              </button>
            )}
          </div>

          {generatedTickets.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center p-12 text-center border-2 border-dashed border-slate-800 rounded-xl bg-slate-950/30">
              <Cpu className="w-12 h-12 text-slate-700 mb-3 animate-pulse" />
              <p className="text-slate-400 font-medium text-sm">Chưa có vé nào được sinh.</p>
              <p className="text-xs text-slate-600 mt-1 max-w-sm">
                Hãy tùy chỉnh trọng số mô hình ở cột bên trái và bấm "CHẠY THUẬT TOÁN" để nhận các bộ số tối ưu.
              </p>
            </div>
          ) : (
            <div className="space-y-3.5">
              {generatedTickets.map((ticket, idx) => {
                const isSaved = savedStatus[idx];
                return (
                  <div
                    key={idx}
                    className="p-4 bg-slate-950/70 border border-slate-800/80 hover:border-indigo-500/40 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-slate-900 border border-slate-800 text-[10px] font-mono font-bold text-slate-400 flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <div className="flex items-center gap-1.5 sm:gap-2">
                        {ticket.numbers.map((n) => (
                          <LotteryBall key={n} number={n} size="sm" />
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
                      <div className="text-left sm:text-right text-[11px] font-mono text-slate-400">
                        <div className="flex items-center gap-2">
                          <span className="text-slate-300">Tổng: <strong className="text-white">{ticket.sum}</strong></span>
                          <span>|</span>
                          <span className="text-slate-300">{ticket.odd_even}</span>
                        </div>
                        <span className="text-cyan-400 font-semibold">Độ tin cậy: {ticket.confidence}%</span>
                      </div>

                      <button
                        onClick={() => handleSaveSingle(ticket, idx)}
                        disabled={isSaved}
                        className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                          isSaved
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                        }`}
                        title="Lưu vé để tự động so thưởng"
                      >
                        {isSaved ? (
                          <>
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                            Đã Lưu
                          </>
                        ) : (
                          <>
                            <BookmarkPlus className="w-4 h-4" />
                            Lưu Vé
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
