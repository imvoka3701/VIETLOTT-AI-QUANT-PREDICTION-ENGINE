import React, { useState, useEffect } from 'react';
import { Clock, TrendingUp, Sparkles, RefreshCw, Trophy } from 'lucide-react';

export default function CountdownBanner({ countdownData, onSync, isSyncing }) {
  const [timeLeft, setTimeLeft] = useState(countdownData?.seconds_remaining || 0);

  useEffect(() => {
    if (countdownData?.seconds_remaining) {
      setTimeLeft(countdownData.seconds_remaining);
    }
  }, [countdownData]);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatMoney = (val) => {
    if (!val) return '0 ₫';
    if (val >= 1_000_000_000) {
      return `${(val / 1_000_000_000).toLocaleString('vi-VN', { maximumFractionDigits: 1 })} TỶ VNĐ`;
    }
    return `${(val / 1_000_000).toLocaleString('vi-VN')} TRIỆU VNĐ`;
  };

  const days = Math.floor(timeLeft / (3600 * 24));
  const hours = Math.floor((timeLeft % (3600 * 24)) / 3600);
  const minutes = Math.floor((timeLeft % 3600) / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="relative overflow-hidden rounded-2xl glass-panel-glow p-6 text-white mb-8 border border-indigo-500/30">
      {/* Background ambient glow */}
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left: Jackpot & Draw Info */}
        <div className="lg:col-span-7 flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-semibold rounded-full flex items-center gap-1.5 uppercase tracking-wider">
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              Kỳ Quay Tiếp Theo #{countdownData?.next_draw_id || '01350'}
            </span>
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              Mở thưởng: {countdownData?.next_draw_time || '18:15'}
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-2">
            Jackpot Ước Tính:
            <span className="bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 bg-clip-text text-transparent drop-shadow-sm font-mono">
              {formatMoney(countdownData?.estimated_jackpot1 || 14_000_000_000)}
            </span>
          </h2>

          {countdownData?.current_jackpot2 > 0 && (
            <p className="text-sm font-medium text-orange-300 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-orange-400" />
              Jackpot 2: <span className="font-mono font-bold">{formatMoney(countdownData.current_jackpot2)}</span>
            </p>
          )}

          <p className="text-xs text-slate-400">
            Hệ thống AI đang theo dõi luồng quay thưởng và tự động đồng bộ kết quả.
          </p>
        </div>

        {/* Right: Countdown Timer & Sync Action */}
        <div className="lg:col-span-5 flex flex-col sm:flex-row items-center justify-end gap-4">
          <div className="flex items-center gap-2 bg-slate-950/60 border border-slate-800/80 p-3 rounded-xl">
            <div className="flex flex-col items-center px-2">
              <span className="font-mono text-2xl font-black text-cyan-400">{String(days).padStart(2, '0')}</span>
              <span className="text-[10px] text-slate-400 uppercase">Ngày</span>
            </div>
            <span className="text-xl font-bold text-slate-600">:</span>
            <div className="flex flex-col items-center px-2">
              <span className="font-mono text-2xl font-black text-cyan-400">{String(hours).padStart(2, '0')}</span>
              <span className="text-[10px] text-slate-400 uppercase">Giờ</span>
            </div>
            <span className="text-xl font-bold text-slate-600">:</span>
            <div className="flex flex-col items-center px-2">
              <span className="font-mono text-2xl font-black text-cyan-400">{String(minutes).padStart(2, '0')}</span>
              <span className="text-[10px] text-slate-400 uppercase">Phút</span>
            </div>
            <span className="text-xl font-bold text-slate-600">:</span>
            <div className="flex flex-col items-center px-2">
              <span className="font-mono text-2xl font-black text-amber-400 animate-pulse">{String(seconds).padStart(2, '0')}</span>
              <span className="text-[10px] text-slate-400 uppercase">Giây</span>
            </div>
          </div>

          <button
            onClick={onSync}
            disabled={isSyncing}
            className="w-full sm:w-auto px-4 py-3 rounded-xl font-semibold text-xs flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg shadow-indigo-600/30 transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
            title="Đồng bộ kết quả mới nhất"
          >
            <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
            {isSyncing ? 'Đang đồng bộ...' : 'Đồng Bộ Kết Quả'}
          </button>
        </div>
      </div>
    </div>
  );
}
