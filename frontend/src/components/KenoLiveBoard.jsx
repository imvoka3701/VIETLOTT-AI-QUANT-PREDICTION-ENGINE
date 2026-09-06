import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  RefreshCw,
  Flame,
  Snowflake,
  BarChart2,
  Cpu,
  Zap,
  CheckCircle2,
  Copy,
  Radio
} from 'lucide-react';
import confetti from 'canvas-confetti';
import LotteryBall from './LotteryBall';

export default function KenoLiveBoard() {
  const [kenoData, setKenoData] = useState(null);
  const [quantData, setQuantData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshCountdown, setRefreshCountdown] = useState(30);

  // Predictor state
  const [pickSize, setPickSize] = useState(5);
  const [strategy, setStrategy] = useState('balanced');
  const [generatedTicket, setGeneratedTicket] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchKenoData();
    fetchQuantData();
  }, []);

  // Auto refresh timer
  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => {
      setRefreshCountdown((prev) => {
        if (prev <= 1) {
          fetchKenoData(true);
          return 30;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [autoRefresh]);

  const fetchKenoData = async (silent = false) => {
    if (!silent) setIsLoading(true);
    try {
      const res = await fetch('/api/draws/keno/latest?limit=15');
      if (res.ok) {
        const data = await res.json();
        setKenoData(data);
      }
    } catch (e) {
      console.error('Error fetching Keno:', e);
    } finally {
      if (!silent) setIsLoading(false);
    }
  };

  const fetchQuantData = async () => {
    try {
      const res = await fetch('/api/draws/keno/quant');
      if (res.ok) {
        setQuantData(await res.json());
      }
    } catch (e) {
      console.error('Error fetching Keno quant:', e);
    }
  };

  const handleManualSync = async () => {
    setIsSyncing(true);
    try {
      await fetch('/api/sync?game_type=keno', { method: 'POST' });
      await Promise.all([fetchKenoData(true), fetchQuantData()]);
      setRefreshCountdown(30);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleGenerateTicket = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch(`/api/draws/keno/predict?pick_size=${pickSize}&strategy=${strategy}`);
      if (res.ok) {
        const data = await res.json();
        setGeneratedTicket(data);
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.8 },
          colors: ['#06b6d4', '#3b82f6', '#10b981']
        });
      }
    } catch (e) {
      console.error('Error generating Keno ticket:', e);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyNumbers = () => {
    if (!generatedTicket?.numbers) return;
    navigator.clipboard.writeText(generatedTicket.numbers.map((n) => String(n).padStart(2, '0')).join(', '));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const latestDraw = kenoData?.latest;
  const winningSet = new Set(latestDraw?.numbers || []);

  return (
    <div className="flex flex-col gap-6 animate-fadeIn">
      {/* Keno Live Stream Header Bar */}
      <div className="glass-panel p-5 rounded-2xl border border-cyan-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/30">
            <Radio className="w-5 h-5 text-white animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-black text-white tracking-tight">
                VIETLOTT KENO <span className="text-cyan-400">LIVE STREAM</span>
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/40 animate-pulse">
                Quay 10 Phút/Kỳ
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Kỳ mới nhất: <span className="text-white font-mono font-bold">#{latestDraw?.draw_id || '0294695'}</span> • Ngày: {latestDraw?.draw_date || 'Hôm nay'}
            </p>
          </div>
        </div>

        {/* Quick Result Badges & Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs font-semibold flex items-center gap-2">
            <span className="text-slate-400 text-[11px]">Chẵn/Lẻ:</span>
            <span className="text-cyan-300 font-bold">{latestDraw?.even_odd || 'Hòa'}</span>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs font-semibold flex items-center gap-2">
            <span className="text-slate-400 text-[11px]">Lớn/Nhỏ:</span>
            <span className="text-amber-300 font-bold">{latestDraw?.big_small || 'Nhỏ'}</span>
          </div>

          <button
            onClick={handleManualSync}
            disabled={isSyncing}
            className="px-3 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-cyan-600/30 transition-all cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
            {isSyncing ? 'Đang lấy...' : `Làm mới (${refreshCountdown}s)`}
          </button>
        </div>
      </div>

      {/* Main 80-Ball Matrix */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-4">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              Bảng Số Keno Thời Gian Thực (Ma Trận 80 Số)
            </h3>
            <p className="text-xs text-slate-400">
              20 con số vừa mở thưởng được phát sáng nổi bật trên toàn bộ ma trận 1 - 80.
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1.5 text-slate-400">
              <span className="w-3 h-3 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 inline-block shadow-sm shadow-cyan-400"></span>
              Số Trúng (20 số)
            </span>
            <span className="flex items-center gap-1.5 text-slate-400">
              <span className="w-3 h-3 rounded-full bg-slate-900 border border-slate-700 inline-block"></span>
              Chưa về
            </span>
          </div>
        </div>

        {/* 10 x 8 Grid */}
        <div className="grid grid-cols-5 sm:grid-cols-10 gap-2 p-3 bg-slate-950/80 rounded-xl border border-slate-800/80">
          {Array.from({ length: 80 }, (_, i) => i + 1).map((num) => {
            const isHit = winningSet.has(num);
            const freq = quantData?.ball_frequencies?.[num]?.count || 0;
            return (
              <div
                key={num}
                className={`h-11 rounded-xl flex flex-col items-center justify-center font-mono font-bold transition-all relative group cursor-pointer ${
                  isHit
                    ? 'bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-600 text-white shadow-lg shadow-cyan-500/40 ring-2 ring-cyan-300 scale-105 z-10'
                    : 'bg-slate-900/60 hover:bg-slate-800/80 text-slate-400 hover:text-white border border-slate-800/60'
                }`}
              >
                <span className="text-sm leading-none">{String(num).padStart(2, '0')}</span>
                <span className={`text-[8px] leading-none mt-0.5 ${isHit ? 'text-cyan-100' : 'text-slate-500'}`}>
                  {freq > 0 ? `${freq} lần` : ''}
                </span>

                {/* Tooltip on hover */}
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 hidden group-hover:flex px-2 py-1 bg-slate-950 text-white text-[10px] rounded border border-slate-700 whitespace-nowrap z-30 shadow-xl pointer-events-none">
                  Số {num}: Về {freq} lần gần đây
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Grid 2 Columns: Analytics & AI Predictor Studio */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Streaks & Zones (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          {/* 4 Zones Distribution */}
          <div className="glass-panel p-5 rounded-2xl border border-slate-800">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5 mb-3">
              <BarChart2 className="w-4 h-4 text-cyan-400" />
              Mật Độ 4 Vùng Số (Quadrant Spread)
            </h4>
            <div className="space-y-2.5">
              {[
                { label: 'Vùng 1 (01 - 20)', key: 'zone1', color: 'from-cyan-500 to-blue-500' },
                { label: 'Vùng 2 (21 - 40)', key: 'zone2', color: 'from-blue-500 to-indigo-500' },
                { label: 'Vùng 3 (41 - 60)', key: 'zone3', color: 'from-indigo-500 to-purple-500' },
                { label: 'Vùng 4 (61 - 80)', key: 'zone4', color: 'from-purple-500 to-pink-500' }
              ].map((z) => {
                const count = quantData?.zone_distribution?.[z.key] || 0;
                const total = Math.max(1, (quantData?.zone_distribution?.zone1 || 0) +
                                           (quantData?.zone_distribution?.zone2 || 0) +
                                           (quantData?.zone_distribution?.zone3 || 0) +
                                           (quantData?.zone_distribution?.zone4 || 0));
                const pct = Math.round((count / total) * 100);
                return (
                  <div key={z.key} className="flex flex-col gap-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">{z.label}</span>
                      <span className="text-white font-mono font-bold">{count} bóng ({pct}%)</span>
                    </div>
                    <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                      <div className={`h-full bg-gradient-to-r ${z.color} rounded-full`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Hot & Cold Numbers */}
          <div className="glass-panel p-5 rounded-2xl border border-slate-800">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5 mb-3">
              <Flame className="w-4 h-4 text-amber-400" />
              Top Số Nóng & Số Lạnh Gần Đây
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                <span className="text-[11px] font-bold text-amber-300 flex items-center gap-1 mb-2">
                  <Flame className="w-3.5 h-3.5" /> Số Nóng (Về nhiều)
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {quantData?.hot_balls?.slice(0, 5).map((b) => (
                    <span key={b.number} className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-mono font-bold flex items-center justify-center">
                      {String(b.number).padStart(2, '0')}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-cyan-500/10 border border-cyan-500/20 rounded-xl">
                <span className="text-[11px] font-bold text-cyan-300 flex items-center gap-1 mb-2">
                  <Snowflake className="w-3.5 h-3.5" /> Số Lạnh (Lâu chưa về)
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {quantData?.cold_balls?.slice(0, 5).map((b) => (
                    <span key={b.number} className="w-7 h-7 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-xs font-mono font-bold flex items-center justify-center">
                      {String(b.number).padStart(2, '0')}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: AI Keno Predictor Studio (7 Cols) */}
        <div className="lg:col-span-7 glass-panel p-6 rounded-2xl border border-cyan-500/30 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 bg-cyan-500/20 rounded-lg border border-cyan-500/40 text-cyan-400">
                <Cpu className="w-4 h-4" />
              </div>
              <h3 className="text-base font-bold text-white">
                Studio Soi Cầu & Sinh Bộ Số Keno AI
              </h3>
            </div>
            <p className="text-xs text-slate-400 mb-5">
              Hệ thống kết hợp phân tích ma trận 4 vùng, tần suất sóng momentum và cân bằng xác suất để gợi ý vé tối ưu.
            </p>

            {/* Config Selectors */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              {/* Pick size */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Chọn Bậc Chơi (Số lượng bóng)
                </label>
                <div className="grid grid-cols-5 gap-1.5">
                  {[2, 3, 4, 5, 6, 7, 8, 9, 10].map((k) => (
                    <button
                      key={k}
                      onClick={() => setPickSize(k)}
                      className={`py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                        pickSize === k
                          ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30'
                          : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
                      }`}
                    >
                      Bậc {k}
                    </button>
                  ))}
                </div>
              </div>

              {/* Strategy */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Chiến Thuật Toán Học
                </label>
                <select
                  value={strategy}
                  onChange={(e) => setStrategy(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 cursor-pointer"
                >
                  <option value="balanced">Cân Bằng 4 Vùng (Độ Phân Tán Cao)</option>
                  <option value="hot_momentum">Bắt Đà Nóng (Hot Momentum)</option>
                  <option value="counter_cyclical">Nghịch Chu Kỳ (Bắt Số Chờ Gan)</option>
                </select>
              </div>
            </div>

            {/* Action button */}
            <button
              onClick={handleGenerateTicket}
              disabled={isGenerating}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-sm shadow-xl shadow-cyan-600/30 transition-all flex items-center justify-center gap-2 active:scale-98 cursor-pointer disabled:opacity-50"
            >
              <Zap className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
              {isGenerating ? 'Đang tính toán ma trận xác suất...' : `Sinh Bộ Số Keno Bậc ${pickSize}`}
            </button>
          </div>

          {/* Generated Result Card */}
          {generatedTicket && (
            <div className="mt-6 p-4 rounded-xl bg-slate-950/90 border border-cyan-500/40 shadow-xl shadow-cyan-950/40 animate-fadeIn">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Bộ Số Gợi Ý Bậc {generatedTicket.pick_size} • Độ Tự Tin: {generatedTicket.confidence_score}%
                </span>
                <button
                  onClick={handleCopyNumbers}
                  className="text-xs text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer transition-colors"
                >
                  {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Đã sao chép!' : 'Copy dãy số'}
                </button>
              </div>

              <div className="flex flex-wrap gap-2 mb-3">
                {generatedTicket.numbers.map((n) => (
                  <span
                    key={n}
                    className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-white font-mono text-base font-black flex items-center justify-center shadow-md shadow-cyan-500/30"
                  >
                    {String(n).padStart(2, '0')}
                  </span>
                ))}
              </div>

              <div className="flex flex-wrap gap-3 text-xs text-slate-400 border-t border-slate-800/80 pt-2">
                <span>Chẵn/Lẻ: <b className="text-slate-200">{generatedTicket.odd_even_split}</b></span>
                <span>•</span>
                <span>Tài/Xỉu: <b className="text-slate-200">{generatedTicket.big_small_split}</b></span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
