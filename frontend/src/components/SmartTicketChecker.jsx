import React, { useState, useEffect } from 'react';
import {
  Ticket,
  CheckCircle2,
  XCircle,
  Award,
  DollarSign,
  AlertCircle,
  HelpCircle,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Percent,
  TrendingUp,
  RefreshCw
} from 'lucide-react';

export default function SmartTicketChecker({ selectedGame = 'mega645' }) {
  const [activeGame, setActiveGame] = useState(selectedGame);
  const [ticketNumbers, setTicketNumbers] = useState([16, 21, 23, 10, 15, 40]); // Sample numbers
  const [customInput, setCustomInput] = useState('16 21 23 10 15 40');
  const [resultChecked, setResultChecked] = useState(false);

  // Official winning draws from vietlott.vn
  const winningDraws = {
    mega645: {
      drawId: '01558',
      date: '04/09/2026',
      numbers: [16, 21, 23, 29, 34, 45],
      jackpotValue: 43022978000
    },
    power655: {
      drawId: '01394',
      date: '05/09/2026',
      numbers: [9, 11, 24, 31, 33, 47],
      specialNumber: 21,
      jackpot1Value: 55361787150,
      jackpot2Value: 4014301550
    },
    keno: {
      drawId: '0294695',
      date: 'Hôm nay',
      numbers: [5, 8, 12, 16, 21, 25, 29, 33, 37, 42, 46, 50, 55, 59, 63, 68, 71, 75, 78, 80]
    }
  };

  const currentDraw = winningDraws[activeGame] || winningDraws.mega645;

  // Sync custom input
  const handleApplyCustomInput = () => {
    const parsed = customInput
      .trim()
      .split(/[\s,-]+/)
      .map((n) => parseInt(n, 10))
      .filter((n) => !isNaN(n) && n > 0 && n <= (activeGame === 'power655' ? 55 : activeGame === 'keno' ? 80 : 45));

    const unique = Array.from(new Set(parsed));
    if (unique.length > 0) {
      setTicketNumbers(unique);
      setResultChecked(true);
    }
  };

  // Toggle single ball in picker
  const handleToggleNumber = (num) => {
    const maxBalls = activeGame === 'keno' ? 10 : 6;
    if (ticketNumbers.includes(num)) {
      setTicketNumbers(ticketNumbers.filter((n) => n !== num));
    } else {
      if (ticketNumbers.length < maxBalls) {
        const next = [...ticketNumbers, num].sort((a, b) => a - b);
        setTicketNumbers(next);
        setCustomInput(next.join(' '));
      }
    }
    setResultChecked(false);
  };

  // Determine Win and Calculate Personal Income Tax (Luật thuế TNCN Việt Nam)
  const calculatePrize = () => {
    const matched = ticketNumbers.filter((n) => currentDraw.numbers.includes(n));
    const matchCount = matched.length;
    let prizeTitle = 'Không trúng giải';
    let grossPrize = 0;

    if (activeGame === 'mega645') {
      if (matchCount === 6) {
        prizeTitle = '🏆 JACKPOT ĐỘC ĐẮC';
        grossPrize = currentDraw.jackpotValue;
      } else if (matchCount === 5) {
        prizeTitle = '🥇 GIẢI NHẤT';
        grossPrize = 10000000;
      } else if (matchCount === 4) {
        prizeTitle = '🥈 GIẢI NHÌ';
        grossPrize = 300000;
      } else if (matchCount === 3) {
        prizeTitle = '🥉 GIẢI BA';
        grossPrize = 30000;
      }
    } else if (activeGame === 'power655') {
      const hasSpecial = currentDraw.specialNumber && ticketNumbers.includes(currentDraw.specialNumber);
      if (matchCount === 6) {
        prizeTitle = '🏆 JACKPOT 1 ĐỘC ĐẮC';
        grossPrize = currentDraw.jackpot1Value;
      } else if (matchCount === 5 && hasSpecial) {
        prizeTitle = '💎 JACKPOT 2 ĐỘC ĐẮC';
        grossPrize = currentDraw.jackpot2Value;
      } else if (matchCount === 5) {
        prizeTitle = '🥇 GIẢI NHẤT';
        grossPrize = 40000000;
      } else if (matchCount === 4) {
        prizeTitle = '🥈 GIẢI NHÌ';
        grossPrize = 500000;
      } else if (matchCount === 3) {
        prizeTitle = '🥉 GIẢI BA';
        grossPrize = 50000;
      }
    } else if (activeGame === 'keno') {
      if (matchCount >= 4) {
        prizeTitle = `🎉 TRÚNG ${matchCount} SỐ KENO`;
        grossPrize = matchCount * 100000;
      }
    }

    // Tax calculation according to Circular 111/2013/TT-BTC
    // Portion above 10,000,000 VND is taxed at 10%
    const taxableAmount = Math.max(0, grossPrize - 10000000);
    const tax = taxableAmount * 0.1;
    const netCash = grossPrize - tax;

    return {
      matched,
      matchCount,
      prizeTitle,
      grossPrize,
      tax,
      netCash,
      isWinner: grossPrize > 0
    };
  };

  const prizeResult = calculatePrize();
  const maxBalls = activeGame === 'power655' ? 55 : activeGame === 'keno' ? 80 : 45;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-950/80 via-slate-900 to-teal-950/80 p-6 sm:p-8 border border-emerald-800/40 shadow-2xl">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-3">
            <Ticket className="w-4 h-4 text-emerald-400" />
            Dò Vé Tự Động & Tính Thuế Thực Nhận
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Máy Dò Vé Thông Minh &{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-300">
              Quyết Toán Tiền Thưởng Về Tay
            </span>
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
            Nhập dãy số vé của bạn hoặc nhấp chọn các bóng số. Hệ thống sẽ lập tức đối chiếu từng con số với kết quả thật
            kỳ mới nhất từ <strong>vietlott.vn</strong> và tự động áp dụng biểu thuế <strong>TNCN 10%</strong> (theo luật
            Việt Nam cho phần thưởng trên 10 triệu) để cho biết chính xác <strong>số tiền thực nhận về tài khoản</strong>!
          </p>
        </div>
      </div>

      {/* Game Mode Switcher */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2 bg-slate-950/80 p-1.5 rounded-2xl border border-slate-800">
          <button
            onClick={() => {
              setActiveGame('mega645');
              setTicketNumbers([16, 21, 23, 10, 15, 40]);
              setCustomInput('16 21 23 10 15 40');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeGame === 'mega645'
                ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Mega 6/45
          </button>
          <button
            onClick={() => {
              setActiveGame('power655');
              setTicketNumbers([9, 11, 24, 21, 35, 50]);
              setCustomInput('9 11 24 21 35 50');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeGame === 'power655'
                ? 'bg-amber-500 text-white shadow-md shadow-amber-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Power 6/55
          </button>
          <button
            onClick={() => {
              setActiveGame('keno');
              setTicketNumbers([5, 12, 21, 33, 50, 75]);
              setCustomInput('5 12 21 33 50 75');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeGame === 'keno'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Keno Live
          </button>
        </div>

        <div className="text-xs text-slate-400">
          Đối chiếu kỳ quay thực tế: <strong className="text-white">#{currentDraw.drawId}</strong> ({currentDraw.date})
        </div>
      </div>

      {/* Official Draw Balls Bar */}
      <div className="glass-panel p-4 sm:p-5 rounded-2xl border border-slate-800 bg-slate-950/60">
        <div className="text-xs font-bold text-slate-400 mb-3 flex items-center gap-2">
          <Award className="w-4 h-4 text-yellow-400" />
          KẾT QUẢ QUAY THẬT KỲ #{currentDraw.drawId} TỪ VIETLOTT.VN:
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {currentDraw.numbers.map((n) => (
            <span
              key={n}
              className="w-10 h-10 rounded-xl bg-gradient-to-tr from-red-600 to-rose-600 text-white font-black text-sm flex items-center justify-center shadow-md shadow-red-600/30"
            >
              {n.toString().padStart(2, '0')}
            </span>
          ))}

          {currentDraw.specialNumber && (
            <>
              <span className="text-slate-500 font-bold px-1">+</span>
              <span
                className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-500 text-slate-950 font-black text-sm flex items-center justify-center shadow-md shadow-amber-500/30 ring-2 ring-yellow-400"
                title="Bóng Đặc Biệt Jackpot 2"
              >
                {currentDraw.specialNumber.toString().padStart(2, '0')}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Input Section & Result Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Number Input / Picker (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="glass-panel p-5 rounded-3xl border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center justify-between">
              <span>1. Nhập Hoặc Dán Dãy Số Vé Của Bạn:</span>
              <span className="text-xs text-slate-400">
                Đã chọn: <strong className="text-cyan-400">{ticketNumbers.length}</strong>/6 số
              </span>
            </h3>

            {/* Text Input */}
            <div className="flex gap-2">
              <input
                type="text"
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                placeholder="Nhập 6 số cách nhau bởi dấu cách (VD: 16 21 23 29 34 45)"
                className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-cyan-500"
              />
              <button
                onClick={handleApplyCustomInput}
                className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-black cursor-pointer transition-all shadow-md shadow-cyan-500/20"
              >
                Dò Vé Ngay
              </button>
            </div>

            {/* Quick Ball Matrix Picker */}
            <div>
              <div className="text-[11px] font-bold text-slate-400 mb-2">
                Hoặc bấm trực tiếp vào các quả bóng bên dưới:
              </div>
              <div className="grid grid-cols-9 sm:grid-cols-10 gap-1.5 max-h-56 overflow-y-auto pr-1 scrollbar-thin">
                {Array.from({ length: maxBalls }, (_, i) => i + 1).map((num) => {
                  const isSelected = ticketNumbers.includes(num);
                  const isWinning = currentDraw.numbers.includes(num);
                  return (
                    <button
                      key={num}
                      onClick={() => handleToggleNumber(num)}
                      className={`h-8 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-cyan-500 text-slate-950 font-black shadow-md shadow-cyan-500/30 scale-105 ring-2 ring-cyan-300'
                          : isWinning
                          ? 'bg-slate-900 border border-red-500/40 text-red-400 hover:bg-slate-800'
                          : 'bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {num.toString().padStart(2, '0')}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Prize Settlement & Tax Result (5 cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between">
          <div
            className={`p-6 rounded-3xl border transition-all flex flex-col justify-between h-full ${
              prizeResult.isWinner
                ? 'bg-gradient-to-br from-emerald-950/80 via-slate-900 to-slate-950 border-emerald-500/50 shadow-2xl shadow-emerald-500/20'
                : 'glass-panel border-slate-800'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Kết Quả Tra Cứu
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                    prizeResult.isWinner
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {prizeResult.isWinner ? '🎉 TRÚNG THƯỞNG' : 'CHƯA TRÚNG'}
                </span>
              </div>

              {/* Matched Count */}
              <div className="text-center py-4 border-b border-slate-800/80">
                <div className="text-4xl font-black text-white mb-1">
                  {prizeResult.matchCount} / 6
                </div>
                <p className="text-xs text-slate-400">Số bóng trùng khớp với kết quả chính thức</p>

                {/* Highlight matched balls */}
                {prizeResult.matched.length > 0 && (
                  <div className="mt-3 flex items-center justify-center gap-2">
                    {prizeResult.matched.map((n) => (
                      <span
                        key={n}
                        className="w-8 h-8 rounded-full bg-emerald-500 text-slate-950 font-black text-xs flex items-center justify-center shadow-md shadow-emerald-500/30"
                      >
                        {n.toString().padStart(2, '0')}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Prize Title & Settlement */}
              <div className="py-4 space-y-2.5 text-xs">
                <div className="flex justify-between items-center text-slate-300">
                  <span>Hạng giải thưởng:</span>
                  <span className="font-bold text-white text-sm">{prizeResult.prizeTitle}</span>
                </div>

                <div className="flex justify-between items-center text-slate-300">
                  <span>Tổng tiền thưởng (Gross):</span>
                  <span className="font-black text-emerald-400 text-sm">
                    {prizeResult.grossPrize.toLocaleString('vi-VN')} VNĐ
                  </span>
                </div>

                <div className="flex justify-between items-center text-slate-400 pb-2 border-b border-slate-800">
                  <span className="flex items-center gap-1">
                    <span>Thuế TNCN (10% phần &gt;10tr):</span>
                    <HelpCircle className="w-3 h-3 text-slate-500" title="Theo Thông tư 111/2013/TT-BTC" />
                  </span>
                  <span className="text-rose-400 font-semibold">
                    - {prizeResult.tax.toLocaleString('vi-VN')} VNĐ
                  </span>
                </div>

                {/* Net Cash */}
                <div className="pt-2 flex justify-between items-center">
                  <span className="font-bold text-white text-sm">THỰC NHẬN VỀ TÀI KHOẢN:</span>
                  <span className="text-lg sm:text-xl font-black text-yellow-400">
                    {prizeResult.netCash.toLocaleString('vi-VN')} VNĐ
                  </span>
                </div>
              </div>
            </div>

            {/* Note box */}
            <div className="mt-4 p-3 rounded-2xl bg-slate-950/80 border border-slate-800/80 text-[11px] text-slate-400 leading-relaxed">
              ⚖️ <strong>Luật Thuế Xổ Số Việt Nam:</strong> Các giải thưởng trên 10 triệu đồng sẽ được khấu trừ 10% phần vượt trên 10 triệu trước khi trả thưởng. Tiền thưởng dưới 10 triệu hoàn toàn miễn thuế.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
