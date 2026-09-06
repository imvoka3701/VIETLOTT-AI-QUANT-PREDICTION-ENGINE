import React, { useState, useEffect } from 'react';
import { Clock, TrendingUp, Sparkles, RefreshCw, Trophy, Calendar, ChevronDown, ChevronUp, Radio } from 'lucide-react';

export default function CountdownBanner({ countdownData, onSync, isSyncing }) {
  const [timeLeft, setTimeLeft] = useState(countdownData?.seconds_remaining || 0);
  const [showSchedule, setShowSchedule] = useState(false);
  const [todaySchedule, setTodaySchedule] = useState([]);

  useEffect(() => {
    if (countdownData?.seconds_remaining !== undefined) {
      setTimeLeft(countdownData.seconds_remaining);
    }
  }, [countdownData]);

  useEffect(() => {
    fetchTodaySchedule();
  }, []);

  const fetchTodaySchedule = async () => {
    try {
      const res = await fetch('/api/draws/today_schedule');
      if (res.ok) {
        const data = await res.json();
        setTodaySchedule(data.schedule || []);
      }
    } catch (e) {
      console.error('Error fetching today schedule:', e);
    }
  };

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
      return `${(val / 1_000_000_000).toLocaleString('vi-VN', { maximumFractionDigits: 2 })} TỶ VNĐ`;
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
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-semibold rounded-full flex items-center gap-1.5 uppercase tracking-wider">
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              Kỳ Quay Tiếp Theo #{countdownData?.next_draw_id || '01559'}
            </span>
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              Mở thưởng: {countdownData?.next_draw_time || '18:15'}
            </span>
            <span className="px-2 py-0.5 rounded bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-[10px] font-bold">
              Xác thực vietlott.vn
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex flex-wrap items-center gap-2">
            Jackpot Hiện Tại:
            <span className="bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 bg-clip-text text-transparent drop-shadow-sm font-mono">
              {formatMoney(countdownData?.current_jackpot1 || 12_000_000_000)}
            </span>
          </h2>

          {countdownData?.current_jackpot2 > 0 && (
            <p className="text-sm font-medium text-orange-300 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-orange-400" />
              Jackpot 2: <span className="font-mono font-bold text-amber-200">{formatMoney(countdownData.current_jackpot2)}</span>
            </p>
          )}

          <div className="flex items-center gap-3 mt-1">
            <button
              onClick={() => setShowSchedule(!showSchedule)}
              className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer transition-all"
            >
              <Calendar className="w-3.5 h-3.5" />
              {showSchedule ? 'Ẩn lịch mở thưởng trong ngày' : 'Xem lịch mở thưởng toàn quốc hôm nay'}
              {showSchedule ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
          </div>
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
            title="Đồng bộ kết quả mới nhất từ vietlott.vn"
          >
            <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
            {isSyncing ? 'Đang đồng bộ...' : 'Đồng Bộ vietlott.vn'}
          </button>
        </div>
      </div>

      {/* Expanded Daily Schedule Drawer */}
      {showSchedule && (
        <div className="mt-6 pt-5 border-t border-slate-800/80 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3 animate-fadeIn">
          {todaySchedule.map((item) => (
            <div
              key={item.id}
              className={`p-3 rounded-xl border transition-all ${
                item.is_today
                  ? 'bg-slate-900/80 border-cyan-500/40 shadow-sm shadow-cyan-500/10'
                  : 'bg-slate-950/40 border-slate-800/60 opacity-60'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  {item.category === 'vietlott' ? 'Vietlott' : 'Truyền Thống'}
                </span>
                {item.is_today ? (
                  <span className="flex items-center gap-1 text-[9px] font-bold text-emerald-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                    Hôm nay
                  </span>
                ) : (
                  <span className="text-[9px] text-slate-500">Khác ngày</span>
                )}
              </div>
              <h4 className="text-xs font-bold text-white line-clamp-1">{item.name}</h4>
              <div className="flex items-center gap-1 text-[11px] text-amber-300 font-mono font-semibold mt-1">
                <Clock className="w-3 h-3 text-amber-400" />
                {item.time}
              </div>
              {item.channels && item.channels.length > 0 && (
                <p className="text-[10px] text-slate-400 mt-1 line-clamp-1">
                  Đài: {item.channels.join(', ')}
                </p>
              )}
              {item.frequency && (
                <p className="text-[10px] text-cyan-300/80 mt-1">
                  {item.frequency}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
