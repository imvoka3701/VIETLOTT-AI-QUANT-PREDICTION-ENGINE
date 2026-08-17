import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Ticket,
  CheckCircle2,
  Trophy,
  Trash2,
  PlusCircle,
  Sparkles,
  AlertCircle,
  HelpCircle
} from 'lucide-react';
import LotteryBall from './LotteryBall';

export default function LiveTracker({ selectedGame, latestDraw, onRefreshDraws }) {
  const [tickets, setTickets] = useState([]);
  const [isChecking, setIsChecking] = useState(false);
  const [checkSummary, setCheckSummary] = useState(null);
  const [newNumbers, setNewNumbers] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    fetchTickets();
  }, [selectedGame]);

  const fetchTickets = async () => {
    try {
      const res = await fetch(`/api/tracker/tickets?game_type=${selectedGame}`);
      if (res.ok) {
        const data = await res.json();
        setTickets(data || []);
      }
    } catch (e) {
      console.error('Error fetching tickets:', e);
    }
  };

  const handleCheckAll = async () => {
    if (!latestDraw) return;
    setIsChecking(true);
    try {
      const res = await fetch('/api/tracker/check_all', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          game_type: selectedGame,
          draw_id: latestDraw.draw_id
        })
      });

      if (res.ok) {
        const data = await res.json();
        setCheckSummary(data);
        fetchTickets();

        if (data.winning_tickets_count > 0) {
          confetti({
            particleCount: 100,
            spread: 80,
            origin: { y: 0.5 }
          });
        }
      }
    } catch (e) {
      console.error('Error checking tickets:', e);
    } finally {
      setIsChecking(false);
    }
  };

  const handleAddCustomTicket = async (e) => {
    e.preventDefault();
    const parsed = newNumbers
      .split(/[\s,.-]+/)
      .map((n) => parseInt(n.trim(), 10))
      .filter((n) => !isNaN(n) && n > 0 && n <= (selectedGame === 'mega645' ? 45 : 55));

    const uniqueNums = Array.from(new Set(parsed));
    if (uniqueNums.length !== 6) {
      alert('Vui lòng nhập đúng 6 số hợp lệ không trùng lặp!');
      return;
    }

    try {
      const res = await fetch('/api/tracker/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          game_type: selectedGame,
          numbers: uniqueNums,
          algorithm_used: 'Người dùng nhập tay',
          confidence_score: 50.0
        })
      });

      if (res.ok) {
        setNewNumbers('');
        setShowAddForm(false);
        fetchTickets();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteTicket = async (id) => {
    try {
      const res = await fetch(`/api/tracker/tickets/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setTickets(tickets.filter((t) => t.id !== id));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const winningSet = new Set(latestDraw?.numbers || []);

  return (
    <div className="flex flex-col gap-6">
      {/* Latest Draw Showcase Banner */}
      {latestDraw && (
        <div className="glass-panel-glow p-6 rounded-2xl border border-indigo-500/40 relative overflow-hidden">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold rounded-md uppercase">
                  Kết Quả Mới Nhất
                </span>
                <span className="text-xs text-slate-400">
                  Kỳ #{latestDraw.draw_id} ({latestDraw.draw_date})
                </span>
              </div>
              <h3 className="text-xl font-black text-white">
                Bóng Quay Trúng Thưởng
              </h3>
            </div>

            {/* Winning Balls Display */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 bg-slate-950/80 p-3 rounded-2xl border border-slate-800">
              {latestDraw.numbers.map((n) => (
                <LotteryBall key={n} number={n} size="lg" isMatched />
              ))}
              {latestDraw.bonus_number && (
                <>
                  <span className="text-slate-600 font-bold px-1">+</span>
                  <LotteryBall number={latestDraw.bonus_number} size="lg" isBonus isMatched />
                </>
              )}
            </div>

            {/* Auto Check Button */}
            <button
              onClick={handleCheckAll}
              disabled={isChecking || tickets.length === 0}
              className="w-full md:w-auto px-5 py-3.5 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-black text-xs sm:text-sm rounded-xl shadow-lg shadow-amber-500/20 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <CheckCircle2 className={`w-5 h-5 ${isChecking ? 'animate-spin' : ''}`} />
              {isChecking ? 'Đang So Vé...' : `So Toàn Bộ Vé (${tickets.length})`}
            </button>
          </div>
        </div>
      )}

      {/* Check Summary Alert if available */}
      {checkSummary && (
        <div className="p-4 bg-emerald-950/40 border border-emerald-500/40 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Trophy className="w-6 h-6 text-yellow-400" />
            <div>
              <h4 className="text-sm font-bold text-white">
                Kết Quả So Vé Kỳ #{checkSummary.draw_id}
              </h4>
              <p className="text-xs text-emerald-300">
                Đã kiểm tra {checkSummary.total_tickets_checked} vé $\rightarrow$ Có{' '}
                <strong className="text-yellow-300 text-sm font-bold">
                  {checkSummary.winning_tickets_count} vé
                </strong>{' '}
                trúng giải!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tickets Portfolio Header & Add Action */}
      <div className="glass-panel p-6 rounded-2xl flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Ticket className="w-5 h-5 text-cyan-400" />
              Danh Mục Vé Đang Theo Dõi (Portfolio)
            </h3>
            <p className="text-xs text-slate-400">
              Vé đã sinh từ AI hoặc nhập tay. Hệ thống tự động so số và đánh dấu trúng thưởng.
            </p>
          </div>

          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <PlusCircle className="w-4 h-4 text-cyan-400" />
            {showAddForm ? 'Đóng Form' : 'Thêm Vé Bằng Tay'}
          </button>
        </div>

        {/* Add Ticket Form Modal/Drawer */}
        {showAddForm && (
          <form onSubmit={handleAddCustomTicket} className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
            <label className="block text-xs font-medium text-slate-300">
              Nhập 6 số cách nhau bởi dấu cách hoặc dấu phẩy (Ví dụ: 03 14 22 29 38 41):
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={newNumbers}
                onChange={(e) => setNewNumbers(e.target.value)}
                placeholder="03 14 22 29 38 41"
                className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white font-mono"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs rounded-lg transition-all cursor-pointer"
              >
                Thêm Vào Danh Mục
              </button>
            </div>
          </form>
        )}

        {/* Tickets Grid */}
        {tickets.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center border-2 border-dashed border-slate-800 rounded-xl bg-slate-950/40">
            <Ticket className="w-12 h-12 text-slate-700 mb-2" />
            <p className="text-slate-400 font-medium text-sm">Chưa có vé nào trong danh mục.</p>
            <p className="text-xs text-slate-600 mt-1">
              Hãy chuyển sang tab <strong>Dự Đoán AI</strong> để sinh bộ vé tối ưu hoặc bấm "Thêm Vé Bằng Tay".
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {tickets.map((t, idx) => {
              const matchedCount = t.numbers.filter((n) => winningSet.has(n)).length;
              const isWinner = matchedCount >= 3;

              return (
                <div
                  key={t.id}
                  className={`p-4 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all ${
                    isWinner
                      ? 'bg-gradient-to-r from-amber-950/40 via-slate-950 to-slate-950 border-amber-500/50 shadow-md shadow-amber-500/10'
                      : 'bg-slate-950/70 border-slate-800/80'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-slate-900 border border-slate-800 text-[10px] font-mono font-bold text-slate-400 flex items-center justify-center">
                      {idx + 1}
                    </span>

                    {/* Ball list with matched highlights */}
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      {t.numbers.map((n) => {
                        const isMatch = winningSet.has(n);
                        return <LotteryBall key={n} number={n} size="sm" isMatched={isMatch} />;
                      })}
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
                    <div className="text-left sm:text-right">
                      {t.is_checked ? (
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold text-white">
                            Trúng: <strong className={matchedCount >= 3 ? 'text-amber-400 text-sm' : 'text-slate-400'}>{matchedCount}/6</strong>
                          </span>
                          <span
                            className={`px-2 py-0.5 text-[10px] font-black rounded ${
                              isWinner
                                ? 'bg-amber-500 text-slate-950'
                                : 'bg-slate-800 text-slate-400'
                            }`}
                          >
                            {t.prize_tier || (matchedCount >= 3 ? 'Trúng thưởng' : 'Không trúng')}
                          </span>
                        </div>
                      ) : (
                        <span className="text-[11px] text-slate-500 italic">Chưa so thưởng</span>
                      )}

                      <div className="text-[10px] text-slate-500 mt-0.5">
                        {t.algorithm_used} {t.confidence_score > 0 ? `(${t.confidence_score}%)` : ''}
                      </div>
                    </div>

                    <button
                      onClick={() => handleDeleteTicket(t.id)}
                      className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-950/30 rounded-lg transition-all cursor-pointer"
                      title="Xóa vé này"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
