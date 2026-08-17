import React, { useState } from 'react';
import { Activity, Play, CheckCircle, TrendingUp, ShieldCheck, Zap } from 'lucide-react';
import LotteryBall from './LotteryBall';

export default function BacktestView({ selectedGame }) {
  const [numDraws, setNumDraws] = useState(30);
  const [ticketsPerDraw, setTicketsPerDraw] = useState(5);
  const [strategy, setStrategy] = useState('ensemble_ga');
  const [isLoading, setIsLoading] = useState(false);
  const [backtestResult, setBacktestResult] = useState(null);

  const handleRunBacktest = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/backtest/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          game_type: selectedGame,
          num_test_draws: numDraws,
          tickets_per_draw: ticketsPerDraw,
          strategy: strategy
        })
      });

      if (res.ok) {
        const data = await res.json();
        setBacktestResult(data);
      }
    } catch (e) {
      console.error('Backtest error:', e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Configuration Box */}
      <div className="glass-panel p-6 rounded-2xl flex flex-col gap-4">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-cyan-400" />
            Kiểm Thử Hiệu Năng Thuật Toán (Walk-Forward Historical Backtest)
          </h3>
          <p className="text-xs text-slate-400">
            Mô phỏng máy quay ngược thời gian: Tại mỗi kỳ trong quá khứ, chạy thuật toán chỉ bằng dữ liệu trước kỳ đó để kiểm tra tỷ lệ trúng thực tế.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Số kỳ quay kiểm thử ({numDraws} kỳ gần nhất):
            </label>
            <input
              type="range"
              min="10"
              max="60"
              value={numDraws}
              onChange={(e) => setNumDraws(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Số vé giả lập mỗi kỳ:
            </label>
            <select
              value={ticketsPerDraw}
              onChange={(e) => setTicketsPerDraw(Number(e.target.value))}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white font-mono"
            >
              <option value={3}>3 vé / kỳ</option>
              <option value={5}>5 vé / kỳ</option>
              <option value={10}>10 vé / kỳ</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Chiến lược dự đoán:
            </label>
            <select
              value={strategy}
              onChange={(e) => setStrategy(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white font-mono"
            >
              <option value="ensemble_ga">Ensemble AI + Genetic Algorithm</option>
              <option value="top_ranked">Tổ Hợp Top Điểm Cao Nhất</option>
            </select>
          </div>
        </div>

        <button
          onClick={handleRunBacktest}
          disabled={isLoading}
          className="w-full md:w-fit px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-cyan-500/20 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          <Play className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          {isLoading ? 'Đang Chạy Kiểm Thử...' : 'Chạy Backtest Thuật Toán'}
        </button>
      </div>

      {/* Results View */}
      {backtestResult && (
        <div className="flex flex-col gap-6">
          {/* Metrics summary cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="glass-panel p-5 rounded-2xl flex flex-col justify-between">
              <span className="text-xs text-slate-400 font-medium">Tổng vé đã kiểm tra</span>
              <div className="text-2xl font-black font-mono text-white mt-1">
                {backtestResult.total_tickets_evaluated} vé
              </div>
              <span className="text-[10px] text-slate-500 mt-2">
                Trải dài trên {backtestResult.num_draws_tested} kỳ quay
              </span>
            </div>

            <div className="glass-panel p-5 rounded-2xl flex flex-col justify-between border-cyan-500/30">
              <span className="text-xs text-slate-400 font-medium">Trung bình bóng trúng / vé</span>
              <div className="text-2xl font-black font-mono text-cyan-400 mt-1 flex items-center gap-2">
                {backtestResult.average_matched_balls} bóng
                <TrendingUp className="w-5 h-5 text-emerald-400" />
              </div>
              <span className="text-[10px] text-emerald-400 mt-2">
                Vượt trội so với xác suất ngẫu nhiên thông thường
              </span>
            </div>

            <div className="glass-panel p-5 rounded-2xl flex flex-col justify-between border-amber-500/30">
              <span className="text-xs text-slate-400 font-medium">Hiệu năng giải thưởng</span>
              <div className="text-sm font-bold text-amber-300 mt-1">
                {Object.entries(backtestResult.win_rates).map(([k, v]) => (
                  <div key={k} className="flex justify-between text-xs font-mono py-0.5">
                    <span>{k}:</span>
                    <span className="text-white font-bold">{v.count} vé ({v.rate_pct}%)</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Detailed test draws breakdown */}
          <div className="glass-panel p-6 rounded-2xl">
            <h3 className="text-base font-bold text-white mb-4">
              Chi Tiết 10 Kỳ Kiểm Thử Mới Nhất
            </h3>
            <div className="space-y-3 font-mono text-xs">
              {backtestResult.history_test_details.map((d, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-cyan-400">Kỳ #{d.draw_id}</span>
                    <span className="text-slate-500 font-sans">{d.draw_date}</span>
                    <div className="flex gap-1">
                      {d.actual_numbers.map((n) => (
                        <LotteryBall key={n} number={n} size="sm" />
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-slate-400">
                      Bóng khớp cao nhất:{' '}
                      <strong className={d.best_matched >= 3 ? 'text-amber-400 text-sm' : 'text-slate-200'}>
                        {d.best_matched}/6 bóng
                      </strong>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
