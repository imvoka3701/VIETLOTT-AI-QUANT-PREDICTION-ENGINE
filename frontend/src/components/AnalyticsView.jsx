import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import {
  BarChart3,
  Flame,
  Snowflake,
  AlertTriangle,
  Grid,
  Users,
  PieChart
} from 'lucide-react';
import LotteryBall from './LotteryBall';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

export default function AnalyticsView({ selectedGame }) {
  const [subTab, setSubTab] = useState('frequency'); // 'frequency', 'gaps', 'markov', 'pairs', 'distribution'
  const [freqData, setFreqData] = useState(null);
  const [gapsData, setGapsData] = useState(null);
  const [markovData, setMarkovData] = useState(null);
  const [pairsData, setPairsData] = useState(null);
  const [distData, setDistData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAllAnalytics();
  }, [selectedGame]);

  const fetchAllAnalytics = async () => {
    setIsLoading(true);
    try {
      const [fRes, gRes, mRes, pRes, dRes] = await Promise.all([
        fetch(`/api/analytics/frequency?game_type=${selectedGame}`),
        fetch(`/api/analytics/gaps?game_type=${selectedGame}`),
        fetch(`/api/analytics/markov_matrix?game_type=${selectedGame}`),
        fetch(`/api/analytics/co_occurrence_matrix?game_type=${selectedGame}`),
        fetch(`/api/analytics/distribution?game_type=${selectedGame}`)
      ]);

      if (fRes.ok) setFreqData(await fRes.json());
      if (gRes.ok) setGapsData(await gRes.json());
      if (mRes.ok) setMarkovData(await mRes.json());
      if (pRes.ok) setPairsData(await pRes.json());
      if (dRes.ok) setDistData(await dRes.json());
    } catch (e) {
      console.error('Analytics load error:', e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Sub Navigation Bar */}
      <div className="flex flex-wrap gap-2 p-1.5 bg-slate-950/60 rounded-xl border border-slate-800 w-fit">
        <button
          onClick={() => setSubTab('frequency')}
          className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
            subTab === 'frequency'
              ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Flame className="w-4 h-4 text-amber-400" />
          Tần Suất & Hot/Cold
        </button>

        <button
          onClick={() => setSubTab('gaps')}
          className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
            subTab === 'gaps'
              ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <AlertTriangle className="w-4 h-4 text-red-400" />
          Chu Kỳ & Độ Trễ (Gaps)
        </button>

        <button
          onClick={() => setSubTab('markov')}
          className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
            subTab === 'markov'
              ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Grid className="w-4 h-4 text-purple-400" />
          Ma Trận Markov
        </button>

        <button
          onClick={() => setSubTab('pairs')}
          className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
            subTab === 'pairs'
              ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Users className="w-4 h-4 text-emerald-400" />
          Cặp Số & Bộ Ba Cùng Về
        </button>

        <button
          onClick={() => setSubTab('distribution')}
          className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
            subTab === 'distribution'
              ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <PieChart className="w-4 h-4 text-yellow-400" />
          Phân Bố Tổng & Chẵn/Lẻ
        </button>
      </div>

      {isLoading ? (
        <div className="glass-panel p-12 rounded-2xl flex items-center justify-center text-slate-400">
          Đang tính toán các chỉ số thống kê...
        </div>
      ) : (
        <>
          {/* TAB 1: Frequency & Hot/Cold */}
          {subTab === 'frequency' && freqData && (
            <div className="glass-panel p-6 rounded-2xl flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-cyan-400" />
                    Thống Kê Tần Suất & Trạng Thái Bóng
                  </h3>
                  <p className="text-xs text-slate-400">
                    Phân tích trên {freqData.draws_analyzed} kỳ quay gần nhất (Tần suất trung bình: {freqData.average_frequency} lần/bóng).
                  </p>
                </div>
              </div>

              {/* Hot vs Cold Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-red-950/20 border border-red-500/30 rounded-xl">
                  <div className="flex items-center gap-2 text-red-400 font-bold text-sm mb-3">
                    <Flame className="w-4 h-4 text-red-500" />
                    Top Bóng Nóng (Hot Numbers - Phong Độ Cao)
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {freqData.hot_numbers.map((n) => (
                      <LotteryBall key={n} number={n} size="sm" />
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-blue-950/20 border border-blue-500/30 rounded-xl">
                  <div className="flex items-center gap-2 text-blue-400 font-bold text-sm mb-3">
                    <Snowflake className="w-4 h-4 text-blue-500" />
                    Top Bóng Lạnh (Cold Numbers - Vắng Bóng Lâu)
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {freqData.cold_numbers.map((n) => (
                      <LotteryBall key={n} number={n} size="sm" />
                    ))}
                  </div>
                </div>
              </div>

              {/* All Balls Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-3">
                {freqData.all_balls.map((b) => (
                  <div
                    key={b.number}
                    className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl flex flex-col items-center gap-2 hover:border-slate-700 transition-all"
                  >
                    <LotteryBall number={b.number} size="sm" />
                    <div className="text-center font-mono">
                      <div className="text-xs font-bold text-white">{b.count} lần</div>
                      <div className="text-[10px] text-slate-400">{b.rate_pct}%</div>
                      <span
                        className={`inline-block px-1.5 py-0.5 mt-1 text-[9px] font-bold rounded ${
                          b.status === 'HOT'
                            ? 'bg-red-500/20 text-red-400'
                            : b.status === 'COLD'
                            ? 'bg-blue-500/20 text-blue-400'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {b.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: Gaps & Overdue */}
          {subTab === 'gaps' && gapsData && (
            <div className="glass-panel p-6 rounded-2xl flex flex-col gap-6">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-400" />
                  Độ Trễ & Cảnh Báo Chu Kỳ (Gap Hazard Decay)
                </h3>
                <p className="text-xs text-slate-400">
                  Số kỳ liên tiếp bóng chưa về so với chu kỳ trung bình (Mean Interval).
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {gapsData.all_gaps.map((g) => (
                  <div
                    key={g.number}
                    className={`p-4 rounded-xl border flex items-center justify-between ${
                      g.hazard_level === 'CRITICAL_OVERDUE'
                        ? 'bg-red-950/30 border-red-500/50'
                        : g.hazard_level === 'OVERDUE'
                        ? 'bg-amber-950/20 border-amber-500/40'
                        : 'bg-slate-950/60 border-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <LotteryBall number={g.number} size="md" />
                      <div>
                        <div className="text-xs font-mono font-bold text-white">
                          Chưa về: <span className="text-red-400 text-sm font-black">{g.current_gap}</span> kỳ
                        </div>
                        <div className="text-[11px] text-slate-400">
                          Chu kỳ TB: {g.mean_gap} | Kỷ lục: {g.max_gap}
                        </div>
                      </div>
                    </div>

                    <span
                      className={`px-2 py-1 text-[10px] font-bold rounded-lg ${
                        g.hazard_level === 'CRITICAL_OVERDUE'
                          ? 'bg-red-500 text-white animate-pulse'
                          : g.hazard_level === 'OVERDUE'
                          ? 'bg-amber-500/20 text-amber-300'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {g.hazard_level === 'CRITICAL_OVERDUE' ? 'BÁO ĐỘNG ĐỎ' : g.hazard_level}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: Markov Transition Heatmap */}
          {subTab === 'markov' && markovData && (
            <div className="glass-panel p-6 rounded-2xl flex flex-col gap-6">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Grid className="w-5 h-5 text-purple-400" />
                  Ma Trận Xác Suất Chuyển Trạng Thái Markov
                </h3>
                <p className="text-xs text-slate-400">
                  Hàng i: Bóng xuất hiện ở kỳ t $\rightarrow$ Cột j: Xác suất bóng j xuất hiện ở kỳ t+1.
                </p>
              </div>

              <div className="overflow-x-auto max-h-[500px] border border-slate-800 rounded-xl p-2 bg-slate-950/80">
                <table className="text-[10px] font-mono border-collapse">
                  <thead>
                    <tr>
                      <th className="p-1 bg-slate-900 text-slate-400 sticky top-0 left-0 z-20">i \ j</th>
                      {markovData.labels.map((l) => (
                        <th key={l} className="p-1 bg-slate-900 text-cyan-400 sticky top-0 z-10 min-w-[28px] text-center">
                          {l}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {markovData.matrix.map((row, rIdx) => (
                      <tr key={rIdx}>
                        <td className="p-1 bg-slate-900 text-cyan-400 sticky left-0 z-10 font-bold text-center">
                          {markovData.labels[rIdx]}
                        </td>
                        {row.map((val, cIdx) => {
                          const intensity = Math.min(1, val * 12);
                          const bg = `rgba(139, 92, 246, ${intensity})`;
                          return (
                            <td
                              key={cIdx}
                              style={{ backgroundColor: bg }}
                              className="p-1 text-center border border-slate-900/40 text-white/90 hover:ring-1 hover:ring-cyan-400 cursor-default"
                              title={`P(Bóng ${markovData.labels[cIdx]} tại t+1 | Bóng ${markovData.labels[rIdx]} tại t) = ${(val * 100).toFixed(2)}%`}
                            >
                              {(val * 100).toFixed(0)}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: Pairs & Triplets */}
          {subTab === 'pairs' && pairsData && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Pairs */}
              <div className="glass-panel p-6 rounded-2xl flex flex-col gap-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-emerald-400" />
                  Top Cặp 2 Số Hay Đi Cùng Nhau
                </h3>
                <div className="space-y-2.5">
                  {pairsData.top_pairs.map((p, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-mono font-bold text-slate-500">#{idx + 1}</span>
                        <div className="flex gap-1.5">
                          <LotteryBall number={p.pair[0]} size="sm" />
                          <LotteryBall number={p.pair[1]} size="sm" />
                        </div>
                      </div>
                      <div className="text-right font-mono text-xs">
                        <span className="font-bold text-emerald-400">{p.count} lần</span>
                        <span className="text-slate-500 ml-2">({p.rate_pct}%)</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Triplets */}
              <div className="glass-panel p-6 rounded-2xl flex flex-col gap-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-cyan-400" />
                  Top Bộ 3 Số Cùng Xuất Hiện
                </h3>
                <div className="space-y-2.5">
                  {pairsData.top_triplets.map((t, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-mono font-bold text-slate-500">#{idx + 1}</span>
                        <div className="flex gap-1.5">
                          <LotteryBall number={t.triplet[0]} size="sm" />
                          <LotteryBall number={t.triplet[1]} size="sm" />
                          <LotteryBall number={t.triplet[2]} size="sm" />
                        </div>
                      </div>
                      <div className="text-right font-mono text-xs">
                        <span className="font-bold text-cyan-400">{t.count} lần</span>
                        <span className="text-slate-500 ml-2">({t.rate_pct}%)</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Consecutive Repeats (Bóng Rơi) */}
              {pairsData.consecutive_repeats && (
                <div className="lg:col-span-2 glass-panel p-6 rounded-2xl flex flex-col gap-4 border border-indigo-500/30">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                    <div>
                      <h3 className="text-base font-bold text-white flex items-center gap-2">
                        <Flame className="w-5 h-5 text-amber-400" />
                        Thống Kê Nhịp Bóng Rơi (Xuất Hiện 2 Kỳ Liên Tiếp)
                      </h3>
                      <p className="text-xs text-slate-400">
                        Đo lường xác suất một quả bóng xuất hiện ở kỳ trước và tiếp tục rơi lại ở kỳ sau.
                      </p>
                    </div>
                    <span className="px-3 py-1 bg-amber-500/20 text-amber-300 font-mono font-bold text-xs rounded-full border border-amber-500/30">
                      TB: {pairsData.consecutive_repeats.average_repeats_per_draw} bóng/kỳ
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-2">
                    {pairsData.consecutive_repeats.most_repeated_balls?.map((b) => (
                      <div key={b.number} className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl flex items-center justify-between">
                        <LotteryBall number={b.number} size="sm" />
                        <div className="text-right">
                          <span className="text-xs font-mono font-bold text-amber-300">{b.repeat_count} lần</span>
                          <p className="text-[10px] text-slate-500">lặp liên tiếp</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 5: Sum & Odd/Even Distribution */}
          {subTab === 'distribution' && distData && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Sum Histogram Bar Chart */}
              <div className="lg:col-span-8 glass-panel p-6 rounded-2xl flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-yellow-400" />
                    Phân Phối Chuẩn Tổng Điểm (Gaussian Sum Distribution)
                  </h3>
                  <div className="text-xs font-mono text-slate-400">
                    Tổng TB: <strong className="text-yellow-400">{distData.mean_sum}</strong> | Min: {distData.min_sum} | Max: {distData.max_sum}
                  </div>
                </div>

                <div className="h-64 w-full">
                  <Bar
                    data={{
                      labels: distData.sum_histogram.map((d) => d.bin),
                      datasets: [
                        {
                          label: 'Số kỳ xuất hiện',
                          data: distData.sum_histogram.map((d) => d.count),
                          backgroundColor: 'rgba(234, 179, 8, 0.7)',
                          borderColor: '#eab308',
                          borderWidth: 1,
                          borderRadius: 6
                        }
                      ]
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: { display: false }
                      },
                      scales: {
                        x: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#94a3b8', font: { size: 10 } } },
                        y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#94a3b8', font: { size: 10 } } }
                      }
                    }}
                  />
                </div>
              </div>

              {/* Odd/Even Doughnut */}
              <div className="lg:col-span-4 glass-panel p-6 rounded-2xl flex flex-col gap-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <PieChart className="w-5 h-5 text-indigo-400" />
                  Tỉ Lệ Chẵn / Lẻ
                </h3>
                <div className="h-56 w-full flex items-center justify-center">
                  <Doughnut
                    data={{
                      labels: distData.odd_even_distribution.map((d) => d.label),
                      datasets: [
                        {
                          data: distData.odd_even_distribution.map((d) => d.count),
                          backgroundColor: [
                            '#ef4444',
                            '#f97316',
                            '#eab308',
                            '#10b981',
                            '#06b6d4',
                            '#8b5cf6',
                            '#ec4899'
                          ],
                          borderWidth: 0
                        }
                      ]
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: { position: 'bottom', labels: { color: '#94a3b8', boxWidth: 10, font: { size: 10 } } }
                      }
                    }}
                  />
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
