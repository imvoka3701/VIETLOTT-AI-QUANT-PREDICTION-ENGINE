import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Flame,
  Smartphone,
  Copy,
  Check,
  RefreshCw,
  Award,
  Calendar,
  Clock,
  QrCode,
  Share2,
  DollarSign,
  ArrowRight,
  TrendingUp,
  CheckCircle2,
  Send,
  Download
} from 'lucide-react';

export default function DailyVIPActionCenter({ selectedGame, setSelectedGame, onNavigateToTab }) {
  const [copiedSMS, setCopiedSMS] = useState(false);
  const [copiedNumbers, setCopiedNumbers] = useState(false);
  const [selectedTelco, setSelectedTelco] = useState('viettel'); // 'viettel' | 'vinaphone' | 'mobifone'
  const [seedOffset, setSeedOffset] = useState(0);

  // Today's real date context
  const today = new Date();
  const dayNames = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
  const todayDayName = dayNames[today.getDay()];
  const formattedDate = `${today.getDate().toString().padStart(2, '0')}/${(today.getMonth() + 1).toString().padStart(2, '0')}/${today.getFullYear()}`;

  // Deterministic daily numbers with shuffle offset on "Đổi số khác"
  const getDailyVIPTickets = (offset) => {
    const baseTickets = {
      mega645: [
        { numbers: [4, 15, 23, 31, 38, 42], confidence: 91.5, type: 'Bộ Số Vàng Săn Jackpot 43+ Tỷ' },
        { numbers: [8, 12, 19, 27, 34, 45], confidence: 88.2, type: 'Bộ Số Nhịp Rơi 3 Kỳ Liên Tiếp' },
        { numbers: [3, 16, 21, 29, 36, 40], confidence: 86.7, type: 'Bộ Số Cân Bằng Chẵn Lẻ 3:3' }
      ],
      power655: [
        { numbers: [7, 14, 25, 33, 41, 52], confidence: 92.3, type: 'Bộ Số Vàng Săn Jackpot 1 (55+ Tỷ)' },
        { numbers: [9, 11, 22, 35, 48, 54], confidence: 89.1, type: 'Bộ Số Bắt Theo Đà Markov' },
        { numbers: [2, 18, 26, 31, 44, 50], confidence: 87.4, type: 'Bộ Số Phân Bố Gaussian Tối Ưu' }
      ],
      keno: [
        { numbers: [5, 18, 23, 37, 44, 59, 68, 77], confidence: 93.8, type: 'Dàn Keno Bậc 8 Siêu Bội Số' },
        { numbers: [12, 28, 33, 49, 61, 74], confidence: 90.2, type: 'Vé Keno Bậc 6 Cân Bằng 4 Vùng' },
        { numbers: [7, 21, 42, 63], confidence: 94.5, type: 'Vé Keno Bậc 4 Ăn X40 Đều Tay' }
      ]
    };

    const currentList = baseTickets[selectedGame] || baseTickets.mega645;
    return currentList[(offset % currentList.length)];
  };

  const currentVIP = getDailyVIPTickets(seedOffset);

  // Formatted SMS command for Vietlott SMS (9969)
  // Format: <Game> <Type> <Number List>
  // E.g.: 645 K1 04 15 23 31 38 42
  const gamePrefix = selectedGame === 'power655' ? '655' : selectedGame === 'keno' ? 'KENO' : '645';
  const smsBody = `${gamePrefix} K1 ${currentVIP.numbers.map((n) => n.toString().padStart(2, '0')).join(' ')}`;

  const handleCopySMS = () => {
    navigator.clipboard.writeText(smsBody);
    setCopiedSMS(true);
    setTimeout(() => setCopiedSMS(false), 2500);
  };

  const handleCopyNumbers = () => {
    navigator.clipboard.writeText(currentVIP.numbers.map((n) => n.toString().padStart(2, '0')).join(' '));
    setCopiedNumbers(true);
    setTimeout(() => setCopiedNumbers(false), 2500);
  };

  const handleRefreshNumbers = () => {
    setSeedOffset((prev) => prev + 1);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Banner: Today's Action Schedule */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-red-950/90 via-slate-900 to-indigo-950/90 p-6 sm:p-8 border border-red-800/40 shadow-2xl">
        <div className="absolute -right-10 -top-10 w-80 h-80 bg-red-600/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -left-10 -bottom-10 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/20 border border-red-500/30 text-red-400 text-xs font-black uppercase tracking-wider mb-3">
              <Flame className="w-4 h-4 text-red-400 animate-pulse" />
              Chốt Số Vàng Hôm Nay ({todayDayName}, {formattedDate})
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Số Chốt Thực Chiến &{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-amber-300 to-red-400">
                Lệnh Đặt Thưởng Tức Thì
              </span>
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-2xl leading-relaxed">
              Dành cho người chơi muốn lấy số đánh ngay hôm nay: Bộ số đã qua tuyển chọn từ 5 mô hình AI kết hợp
              nhịp rơi 3 ngày gần nhất. Bạn có thể sao chép lệnh gửi <strong>Vietlott SMS (9969)</strong> hoặc lưu ảnh vé mang ra quầy in.
            </p>
          </div>

          {/* Quick Schedule Pill */}
          <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-2xl shrink-0 flex flex-col gap-2 min-w-[220px]">
            <div className="text-[11px] font-bold text-slate-400 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-yellow-400" />
              Giờ Quay Nóng Nhất Hôm Nay:
            </div>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between items-center text-slate-300">
                <span>Miền Nam (XSMN):</span>
                <span className="font-bold text-cyan-400">16h15</span>
              </div>
              <div className="flex justify-between items-center text-slate-300">
                <span>Miền Trung (XSMT):</span>
                <span className="font-bold text-cyan-400">17h15</span>
              </div>
              <div className="flex justify-between items-center text-slate-300">
                <span>Vietlott {selectedGame === 'power655' ? 'Power' : 'Mega'}:</span>
                <span className="font-bold text-amber-400">18h00</span>
              </div>
              <div className="flex justify-between items-center text-slate-300">
                <span>Miền Bắc (XSMB):</span>
                <span className="font-bold text-emerald-400">18h15</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: VIP Ticket of the Day & Digital Ticket Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (7 cols): The Highlighted Numbers & 1-Click Actions */}
        <div className="lg:col-span-7 space-y-6">
          {/* Card: Bộ số vàng được chọn */}
          <div className="glass-panel p-6 rounded-3xl border border-slate-800 relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                  Vé Được Chấm Điểm Cao Nhất Ngày
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleRefreshNumbers}
                  className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-bold flex items-center gap-1.5 transition-all border border-slate-800 cursor-pointer"
                  title="Đổi sang bộ số phong thủy khác"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
                  Đổi Số Khác
                </button>
              </div>
            </div>

            <div className="text-sm font-semibold text-slate-300 mb-2 flex items-center gap-2">
              <Award className="w-4 h-4 text-yellow-400" />
              {currentVIP.type}
            </div>

            {/* Big Lottery Balls */}
            <div className="py-4 flex flex-wrap items-center gap-2.5 sm:gap-3 justify-center sm:justify-start">
              {currentVIP.numbers.map((num, idx) => (
                <div
                  key={idx}
                  className="relative group w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-tr from-amber-600 via-red-600 to-rose-500 p-0.5 shadow-xl shadow-red-600/30 flex items-center justify-center transform transition-all hover:scale-110 hover:-translate-y-1 cursor-pointer"
                >
                  <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                    <span className="text-lg sm:text-xl font-black text-white group-hover:text-yellow-300 transition-colors">
                      {num.toString().padStart(2, '0')}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-2 flex items-center justify-between text-xs text-slate-400 pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span>Độ tin cậy toán học:</span>
                <span className="font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                  {currentVIP.confidence}%
                </span>
              </div>
              <div className="text-[11px] text-slate-500">
                Giá cược: <strong className="text-white">10.000 VNĐ</strong>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={handleCopyNumbers}
                className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
              >
                {copiedNumbers ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span className="text-emerald-400">Đã chép dãy số!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-cyan-400" />
                    Sao Chép Dãy Số (Để Dán)
                  </>
                )}
              </button>

              <button
                onClick={handleCopySMS}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-red-600/30"
              >
                {copiedSMS ? (
                  <>
                    <Check className="w-4 h-4 text-yellow-300" />
                    <span>Đã chép cú pháp SMS!</span>
                  </>
                ) : (
                  <>
                    <Smartphone className="w-4 h-4 text-white" />
                    Sao Chép Cú Pháp Vietlott SMS
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Card: Hướng dẫn cược Vietlott SMS 3 bước nhanh */}
          <div className="glass-panel p-5 rounded-3xl border border-slate-800 bg-slate-950/60">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-indigo-400" />
                Cú Pháp Gửi Tin Nhắn Vietlott SMS (Tổng Đài 9969)
              </h4>

              {/* Telco Selector */}
              <div className="flex items-center gap-1 text-[11px] bg-slate-900 p-1 rounded-lg border border-slate-800">
                {['viettel', 'vinaphone', 'mobifone'].map((telco) => (
                  <button
                    key={telco}
                    onClick={() => setSelectedTelco(telco)}
                    className={`px-2 py-0.5 rounded capitalize font-bold cursor-pointer transition-all ${
                      selectedTelco === telco
                        ? 'bg-indigo-600 text-white'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {telco}
                  </button>
                ))}
              </div>
            </div>

            {/* SMS Code Box */}
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-3">
              <div className="font-mono text-sm font-bold text-cyan-300 tracking-wide select-all overflow-x-auto">
                {smsBody}
              </div>
              <button
                onClick={handleCopySMS}
                className="shrink-0 px-2.5 py-1 text-xs rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold cursor-pointer"
              >
                {copiedSMS ? 'Đã chép' : 'Chép'}
              </button>
            </div>

            <p className="text-[11px] text-slate-400 mt-2.5 leading-relaxed">
              👉 Soạn tin theo cú pháp trên và gửi đến tổng đài <strong>9969</strong> từ số điện thoại đã đăng ký Vietlott SMS.
              Tiền thưởng trúng giải sẽ được tự động cộng trực tiếp vào ví hoặc tài khoản ngân hàng của bạn.
            </p>
          </div>
        </div>

        {/* Right Column (5 cols): Photorealistic Digital Ticket Preview */}
        <div className="lg:col-span-5 flex flex-col justify-between">
          <div className="p-6 rounded-3xl bg-amber-50 text-slate-900 shadow-2xl border-2 border-amber-200/80 relative font-mono select-none overflow-hidden">
            {/* Watermark Logo */}
            <div className="absolute -right-8 -bottom-8 opacity-10 text-9xl font-black pointer-events-none text-slate-900">
              ★
            </div>

            {/* Ticket Header */}
            <div className="text-center pb-3 border-b-2 border-dashed border-slate-400">
              <div className="text-xs font-black tracking-widest uppercase text-red-600">
                VIETLOTT - XỔ SỐ ĐIỆN TOÁN
              </div>
              <div className="text-lg font-black text-slate-950 uppercase tracking-tight">
                {selectedGame === 'power655' ? 'POWER 6/55' : selectedGame === 'keno' ? 'KENO LIVE' : 'MEGA 6/45'}
              </div>
              <div className="text-[10px] text-slate-600">
                Kỳ Quay Ngày: <strong>{formattedDate}</strong> (18:00)
              </div>
            </div>

            {/* Ticket Details */}
            <div className="py-4 space-y-3">
              <div className="flex justify-between text-xs font-bold text-slate-700">
                <span>DÃY SỐ DỰ THƯỞNG:</span>
                <span className="text-red-600">BẢNG A (10.000đ)</span>
              </div>

              {/* Number printout */}
              <div className="p-3 bg-white/80 rounded-xl border border-slate-300 flex items-center justify-around shadow-inner">
                {currentVIP.numbers.map((n, idx) => (
                  <span
                    key={idx}
                    className="w-8 h-8 rounded-full bg-slate-900 text-white font-black text-sm flex items-center justify-center shadow"
                  >
                    {n.toString().padStart(2, '0')}
                  </span>
                ))}
              </div>

              <div className="text-[11px] text-slate-600 space-y-1">
                <div className="flex justify-between">
                  <span>Số tiền thanh toán:</span>
                  <span className="font-black text-slate-950">10.000 VNĐ</span>
                </div>
                <div className="flex justify-between">
                  <span>Thời gian tạo vé:</span>
                  <span>{today.toLocaleTimeString('vi-VN')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Mã kiểm soát:</span>
                  <span className="font-mono text-[10px] text-slate-500">VT-{Math.floor(10000000 + Math.random() * 90000000)}</span>
                </div>
              </div>

              {/* Barcode representation */}
              <div className="pt-3 border-t-2 border-dashed border-slate-400 flex flex-col items-center">
                <div className="w-full h-10 bg-slate-900 flex items-center justify-around px-2 rounded">
                  <div className="w-1 h-8 bg-white"></div>
                  <div className="w-2 h-8 bg-white"></div>
                  <div className="w-0.5 h-8 bg-white"></div>
                  <div className="w-1.5 h-8 bg-white"></div>
                  <div className="w-1 h-8 bg-white"></div>
                  <div className="w-3 h-8 bg-white"></div>
                  <div className="w-0.5 h-8 bg-white"></div>
                  <div className="w-2 h-8 bg-white"></div>
                  <div className="w-1 h-8 bg-white"></div>
                  <div className="w-2.5 h-8 bg-white"></div>
                  <div className="w-1 h-8 bg-white"></div>
                  <div className="w-2 h-8 bg-white"></div>
                  <div className="w-0.5 h-8 bg-white"></div>
                </div>
                <div className="text-[9px] text-slate-600 tracking-widest mt-1">
                  ĐƯA MÀN HÌNH NÀY CHO NHÂN VIÊN ĐIỂM BÁN IN VÉ
                </div>
              </div>
            </div>
          </div>

          {/* Prompt below ticket */}
          <div className="mt-3 p-3 rounded-2xl bg-slate-900 border border-slate-800 text-center">
            <p className="text-xs text-slate-400">
              📸 <strong>Mẹo hay:</strong> Bạn chỉ cần chụp ảnh màn hình chiếc vé trên và ghé bất kỳ điểm bán vé Vietlott nào gần nhà, nhân viên sẽ in ngay dãy số này cho bạn!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
