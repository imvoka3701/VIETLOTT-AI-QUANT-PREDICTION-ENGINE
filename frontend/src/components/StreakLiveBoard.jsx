import React, { useState } from 'react';
import {
  TrendingUp,
  Flame,
  Layers,
  Award,
  Calendar,
  Sparkles,
  Zap,
  CheckCircle2,
  Copy,
  Check,
  ChevronRight
} from 'lucide-react';

export default function StreakLiveBoard() {
  const [copiedPair, setCopiedPair] = useState(null);

  const handleCopy = (pairText, id) => {
    navigator.clipboard.writeText(pairText);
    setCopiedPair(id);
    setTimeout(() => setCopiedPair(null), 2500);
  };

  // Live running bridge streaks
  const activeStreaks = [
    {
      id: 'streak_1',
      bridgeName: 'Cầu Ghép Tâm GĐB & Đuôi Giải Nhất',
      position: 'GĐB[2] + G1[4]',
      daysRunning: 4,
      predictedPair: [38, 83],
      primaryBall: 38,
      confidence: 93.4,
      note: 'Cầu chạy thông 4 ngày liên tục, biên độ nhịp rơi đối xứng đạt đỉnh.'
    },
    {
      id: 'streak_2',
      bridgeName: 'Cầu Góc Tam Giác Giải 3 & Giải 5',
      position: 'G3.1[1] + G5.4[3]',
      daysRunning: 3,
      predictedPair: [59, 95],
      primaryBall: 59,
      confidence: 89.7,
      note: 'Ăn thông 3 kỳ, hôm nay báo cặp bóng đối xứng 59 - 95 cực kỳ sáng.'
    },
    {
      id: 'streak_3',
      bridgeName: 'Cầu Kẹp Kép Bằng Giải Nhì',
      position: 'G2.1[0] + G2.2[3]',
      daysRunning: 3,
      predictedPair: [44, 99],
      primaryBall: 44,
      confidence: 87.5,
      note: 'Chu kỳ kép lệch sau 5 ngày nén nhịp, xác suất nổ trong 24h tới rất cao.'
    }
  ];

  // Head and Tail Silence rules (Bạc Nhớ Đầu Đuôi Câm)
  const silenceRules = [
    { head: 0, expect: [4, 6, 9], note: 'Đầu 0 câm: Hôm sau bạc nhớ hay nổ 04, 06, 09' },
    { head: 2, expect: [21, 25, 29], note: 'Đầu 2 câm: Hôm sau hay về 21, 25, 29' },
    { head: 5, expect: [54, 55, 59], note: 'Đầu 5 câm: Hay nổ lại kép 55 và cặp 54 - 59' },
    { head: 7, expect: [70, 71, 75], note: 'Đầu 7 câm: Tỷ lệ về 70 và 75 đạt 81%' },
    { head: 9, expect: [92, 95, 99], note: 'Đầu 9 câm: Bạc nhớ kinh điển báo về 92, 95' }
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-950/80 via-slate-900 to-red-950/80 p-6 sm:p-8 border border-amber-800/40 shadow-2xl">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-bold uppercase tracking-wider mb-3">
            <TrendingUp className="w-4 h-4 text-amber-400" />
            Kinh Nghiệm Thực Chiến & Bạc Nhớ Dân Gian
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Cầu Đang Chạy Thông &{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-300 to-rose-400">
              Nhịp Lô Rơi Thực Chiến
            </span>
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
            Tổng hợp các vị trí ghép cầu đang ăn thông từ 3 đến 4 ngày liên tiếp, kết hợp quy luật{' '}
            <strong>Bạc Nhớ Đầu Đuôi Câm</strong> và nhịp lô rơi từ Giải Đặc Biệt hôm qua để mang đến các cửa vào tiền
            an toàn và có tỷ lệ thắng cao nhất cho người chơi.
          </p>
        </div>
      </div>

      {/* Active Running Bridges Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Flame className="w-4 h-4 text-red-400" />
            Top Cầu Đang Ăn Thông Liên Tục (Chạy Biên Độ 3 - 4 Ngày)
          </h3>
          <span className="text-xs text-slate-400">Tự động cập nhật theo kỳ quay mới nhất</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {activeStreaks.map((streak) => (
            <div
              key={streak.id}
              className="glass-panel p-5 rounded-2xl border border-slate-800 hover:border-amber-500/40 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-red-600/20 text-red-300 border border-red-500/30 flex items-center gap-1">
                    <Flame className="w-3 h-3 text-red-400 animate-pulse" />
                    Thông {streak.daysRunning} Ngày
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">{streak.position}</span>
                </div>

                <h4 className="text-sm font-bold text-white mb-2">{streak.bridgeName}</h4>

                {/* Displaying Pair */}
                <div className="my-3 p-3 bg-slate-900/90 rounded-xl border border-slate-800 flex items-center justify-around">
                  <div className="text-center">
                    <span className="text-[10px] text-slate-500 block">Bạch Thủ</span>
                    <span className="text-xl font-black text-amber-400">
                      {streak.primaryBall.toString().padStart(2, '0')}
                    </span>
                  </div>
                  <span className="text-slate-600 font-bold">/</span>
                  <div className="text-center">
                    <span className="text-[10px] text-slate-500 block">Số Lót (Đảo)</span>
                    <span className="text-xl font-black text-slate-300">
                      {streak.predictedPair[1].toString().padStart(2, '0')}
                    </span>
                  </div>
                </div>

                <p className="text-[11px] text-slate-400 leading-relaxed mb-3">{streak.note}</p>
              </div>

              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-400">Độ tin cậy: {streak.confidence}%</span>
                <button
                  onClick={() =>
                    handleCopy(`${streak.predictedPair[0]} - ${streak.predictedPair[1]}`, streak.id)
                  }
                  className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-xs font-semibold text-slate-300 hover:text-white flex items-center gap-1 cursor-pointer transition-all border border-slate-700"
                >
                  {copiedPair === streak.id ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span className="text-emerald-400">Đã chép</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3 text-amber-400" />
                      Sao chép cặp
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bạc Nhớ Đầu Câm - Đuôi Câm Thực Chiến */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800">
        <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
          <Zap className="w-4 h-4 text-cyan-400" />
          Bảng Tra Cứu Bạc Nhớ Đầu Câm - Đuôi Câm
        </h3>
        <p className="text-xs text-slate-400 mb-4">
          Quy luật lưu truyền hơn 30 năm trong giới số học: Khi một đầu số không về ở kỳ trước, kỳ kế tiếp có xu hướng dội nổ mạnh ở các con số trọng điểm:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {silenceRules.map((item) => (
            <div
              key={item.head}
              className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                  Đầu {item.head} Câm
                </span>
                <div className="flex items-center gap-1.5">
                  {item.expect.map((num) => (
                    <span
                      key={num}
                      className="w-6 h-6 rounded bg-slate-800 text-white font-bold text-xs flex items-center justify-center border border-slate-700"
                    >
                      {num.toString().padStart(2, '0')}
                    </span>
                  ))}
                </div>
              </div>
              <p className="text-[11px] text-slate-400">{item.note}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
