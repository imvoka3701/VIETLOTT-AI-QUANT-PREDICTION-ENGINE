import React, { useState } from 'react';
import {
  BookOpen,
  TrendingUp,
  Target,
  ShieldCheck,
  Flame,
  Sparkles,
  Smartphone,
  Store,
  DollarSign,
  Layers,
  Award,
  HelpCircle,
  CheckCircle2,
  ChevronRight,
  ArrowRight,
  Calculator,
  Percent,
  AlertTriangle,
  Zap,
  Copy,
  Check
} from 'lucide-react';

export default function PlaybookGuideView() {
  const [activeCategory, setActiveCategory] = useState('all'); // 'all' | 'high_stake' | 'micro_stake' | 'consistent'
  const [budget, setBudget] = useState(500000); // 500k default
  const [playStyle, setPlayStyle] = useState('balanced'); // 'aggressive' | 'multiplier' | 'consistent' | 'balanced'
  const [copiedId, setCopiedId] = useState(null);

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  // Capital simulation calculator
  const calculatePortfolio = (amount, style) => {
    if (style === 'aggressive') {
      // Săn Jackpot khủng - Vietlott Bao số + Keno Bậc cao
      return {
        styleTitle: '🔥 Chiến Lược: Săn Jackpot Khủng (High Roller)',
        description: 'Tập trung tối đa vào giải Jackpot hàng chục đến hàng trăm tỷ VNĐ qua Bao số Vietlott và Keno Bậc 10.',
        allocations: [
          {
            name: 'Vietlott Bao 7 / Bao 8 (Mega 6/45 hoặc Power 6/55)',
            percent: 75,
            amount: Math.round(amount * 0.75),
            tickets: Math.floor((amount * 0.75) / 10000),
            note: 'Tăng xác suất nổ Jackpot gấp 7 - 28 lần so với vé đơn, ăn kèm hàng chục giải phụ nếu trúng 3-5 số.',
            risk: 'Cao',
            targetWin: '40 Tỷ - 150 Tỷ VNĐ'
          },
          {
            name: 'Keno Bậc 9 - Bậc 10 (Săn 2 - 10 Tỷ VNĐ)',
            percent: 25,
            amount: Math.round(amount * 0.25),
            tickets: Math.floor((amount * 0.25) / 10000),
            note: 'Nếu khớp 10/10 quả bóng trúng ngay 2 tỷ (hoặc 10 tỷ với cược 50k). Không trúng bóng nào vẫn được hoàn vốn.',
            risk: 'Cao',
            targetWin: '2 Tỷ - 10 Tỷ VNĐ'
          }
        ]
      };
    } else if (style === 'multiplier') {
      // Đánh bé ăn to - Vốn nhỏ nhân bội số khủng
      return {
        styleTitle: '💎 Chiến Lược: Đánh Bé Ăn To (Massive Multiplier)',
        description: 'Bỏ số vốn siêu nhỏ (từ 10k - 50k) để nhắm tới các cửa cược có tỷ lệ trả thưởng từ 1:960 đến 1:8800.',
        allocations: [
          {
            name: 'Đề 3 Càng & 4 Càng (Tỷ lệ 1 ăn 960 - 1 ăn 8.800)',
            percent: 40,
            amount: Math.round(amount * 0.4),
            tickets: Math.floor((amount * 0.4) / 10000),
            note: 'Lấy số đuôi từ Bạch thủ trong Tool ghép với Càng từ tâm Tam Giác Pascal. Đánh 10k trúng 9.600.000đ hoặc 88.000.000đ.',
            risk: 'Trung bình',
            targetWin: 'x960 đến x8.800 lần vốn'
          },
          {
            name: 'Lô Xiên 3, Lô Xiên 4 (Tỷ lệ 1 ăn 40 - 1 ăn 250)',
            percent: 30,
            amount: Math.round(amount * 0.3),
            tickets: Math.floor((amount * 0.3) / 20000),
            note: 'Ghép các cặp số có tương quan đồng xuất hiện cao trong ma trận Co-occurrence. Đánh 20k ăn 800k - 5.000.000đ.',
            risk: 'Trung bình',
            targetWin: 'x40 đến x250 lần vốn'
          },
          {
            name: 'Vé Đơn Vietlott Mega/Power (Săn 50+ Tỷ)',
            percent: 30,
            amount: Math.round(amount * 0.3),
            tickets: Math.floor((amount * 0.3) / 10000),
            note: 'Lấy vé Top 1 từ bộ lọc Ensemble AI (chỉ chọn bộ số có chỉ số Gaussian & Pareto tối ưu).',
            risk: 'Thấp',
            targetWin: '50 Tỷ - 100+ Tỷ VNĐ'
          }
        ]
      };
    } else if (style === 'consistent') {
      // Ăn chắc mặc bền - Thu nhập đều
      return {
        styleTitle: '🛡️ Chiến Lược: Ăn Chắc Mặc Bền (Consistent Cashflow)',
        description: 'Tối đa hóa xác suất chiến thắng trong ngày qua Dàn Đề 36 số và Song Thủ Lô kẹp tã bảo hiểm.',
        allocations: [
          {
            name: 'Dàn Đề 36 Số (Xác suất thắng 36% / Tỷ lệ 1:99)',
            percent: 50,
            amount: Math.round(amount * 0.5),
            tickets: 36,
            note: 'Sử dụng dàn chạm đầu đuôi từ Tool, đánh trên các đài trả thưởng 1 ăn 99. Lợi nhuận ròng đạt ~63% mỗi lần trúng.',
            risk: 'Rất thấp',
            targetWin: 'Lợi nhuận ròng +63%'
          },
          {
            name: 'Song Thủ Lô Kẹp Tã (Bảo hiểm lộn cầu)',
            percent: 30,
            amount: Math.round(amount * 0.3),
            tickets: 2,
            note: 'Đánh cặp số thuận nghịch (VD: 59 - 95). Nếu về 1 nháy đã có lãi lớn, về cả 2 nháy nhân đôi tiền.',
            risk: 'Thấp',
            targetWin: 'Hoàn vốn + Lãi 50% - 120%'
          },
          {
            name: 'Keno Bậc 2 & Bậc 4 (Tích lũy lãi ngày)',
            percent: 20,
            amount: Math.round(amount * 0.2),
            tickets: Math.floor((amount * 0.2) / 10000),
            note: 'Bậc 2 trúng x9, Bậc 4 trúng x40. Xác suất trúng cực kỳ cao theo nhịp bóng tần suất 4 vùng.',
            risk: 'Rất thấp',
            targetWin: 'Ăn x9 đến x40'
          }
        ]
      };
    } else {
      // Cân bằng tối ưu
      return {
        styleTitle: '⚖️ Chiến Lược: Cân Bằng Toàn Diện (Balanced Quant Portfolio)',
        description: 'Phối hợp danh mục theo chuẩn tài chính: vừa có cơ hội săn Jackpot trăm tỷ, vừa có nguồn thu ổn định mỗi ngày.',
        allocations: [
          {
            name: 'Vietlott Mega 6/45 & Power 6/55 (Săn Jackpot)',
            percent: 30,
            amount: Math.round(amount * 0.3),
            tickets: Math.floor((amount * 0.3) / 10000),
            note: 'Mỗi kỳ quay vào 2-3 vé đơn chọn lọc từ AI Ensemble để duy trì cơ hội nhận Jackpot tiền tỷ.',
            risk: 'Trung bình',
            targetWin: 'Jackpot 40 Tỷ+'
          },
          {
            name: 'Dàn Đề 36 Số hoặc 20 Số (Bảo toàn vốn)',
            percent: 40,
            amount: Math.round(amount * 0.4),
            tickets: 36,
            note: 'Đánh dàn chạm số học xác suất cao để tạo dòng tiền hoàn vốn cho các khoản cược săn giải lớn.',
            risk: 'Thấp',
            targetWin: 'Tỷ lệ 1 ăn 99'
          },
          {
            name: 'Lô Xiên 2 & Xiên 3 (Kích hoạt đòn bẩy)',
            percent: 30,
            amount: Math.round(amount * 0.3),
            tickets: Math.floor((amount * 0.3) / 20000),
            note: 'Ghép cặp số từ ma trận đồng xuất hiện Co-occurrence để đón đòn bẩy x10 đến x40 lần.',
            risk: 'Trung bình',
            targetWin: 'Ăn x10 đến x40'
          }
        ]
      };
    }
  };

  const simulation = calculatePortfolio(budget, playStyle);

  const guideCards = [
    {
      id: 'vietlott_bao',
      category: 'high_stake',
      tag: 'Đánh Lớn Ăn Lớn',
      tagColor: 'from-rose-600 to-red-600',
      title: 'Bao Số Vietlott (Bao 7 đến Bao 18)',
      game: 'Mega 6/45 & Power 6/55',
      stake: '70.000đ - 185.640.000đ',
      multiplier: 'Jackpot 40 Tỷ - 150+ Tỷ + Hàng chục giải phụ',
      summary: 'Thay vì chỉ chọn 6 số, bạn chọn từ 7 đến 18 số. Hệ thống Vietlott sẽ tự động đảo sinh ra toàn bộ các bộ 6 số từ tập số bạn chọn.',
      howToGet: 'Vào tab "Dự Đoán Vietlott AI", chọn thuật toán "Genetic Algorithm (GA)" và chọn số lượng bóng muốn lấy (từ 7 đến 18 bóng). Copy bộ số đã được tối ưu hóa theo ma trận phân tán Pareto.',
      howToBet: 'Mở ứng dụng Vietlott SMS (hoặc ra điểm bán hàng POS), chọn loại cược "Bao số", tích vào các số đã lấy từ Tool.',
      specialAdvantage: 'Ngay cả khi chưa nổ Jackpot, chỉ cần trúng từ 3 đến 5 số, bạn sẽ nhận được hàng chục giải Nhất, Nhì, Ba cộng dồn (Bao 15 trúng 5 số ăn hơn 200 triệu VNĐ!).'
    },
    {
      id: 'keno_10',
      category: 'high_stake',
      tag: 'Đánh Lớn Ăn Lớn',
      tagColor: 'from-amber-500 to-orange-600',
      title: 'Keno Bậc 9 & Bậc 10 (Độc Đắc 2 Tỷ - 10 Tỷ)',
      game: 'Vietlott Keno 10 Phút',
      stake: '10.000đ - 500.000đ / kỳ',
      multiplier: '2.000.000.000đ - 10.000.000.000đ',
      summary: 'Chọn 9 hoặc 10 số trong 80 bóng. Cứ mỗi 10 phút quay một lần từ 06h00 đến 21h50 hàng ngày.',
      howToGet: 'Chuyển sang chế độ "Keno 10\'", chọn Bậc 9 hoặc Bậc 10, bấm "Sinh Vé Keno AI". Tool sẽ dùng thuật toán Cân bằng 4 vùng (Quadrant) để rải đều bóng tối ưu.',
      howToBet: 'Vào Vietlott SMS hoặc cây bán vé Keno, chọn cược Bậc 10, nhập 10 số được gợi ý.',
      specialAdvantage: 'Cơ chế bảo hiểm đặc biệt: Ở Keno Bậc 10, nếu bạn không trúng bất kỳ con số nào (0/10), bạn vẫn được Vietlott trả thưởng 10.000đ hoàn vốn!'
    },
    {
      id: 'vietlott_single',
      category: 'micro_stake',
      tag: 'Đánh Bé Ăn To',
      tagColor: 'from-cyan-500 to-blue-600',
      title: 'Vé Đơn 10k Săn Jackpot Khủng',
      game: 'Mega 6/45 & Power 6/55',
      stake: 'Chỉ 10.000 VNĐ (1 vé)',
      multiplier: 'Ăn x4.000.000 đến x10.000.000 lần',
      summary: 'Bỏ ra số tiền chỉ bằng cốc trà đá hoặc ổ bánh mì (10.000đ) để nắm lấy cơ hội nhận Jackpot từ 40 đến hơn 100 tỷ đồng.',
      howToGet: 'Vào tab "Dự Đoán Vietlott AI", chọn vé Top 1 có chỉ số tin cậy (Confidence Score) cao nhất từ mô hình Ensemble Multi-Model.',
      howToBet: 'Soạn tin hoặc chọn trực tiếp trên Vietlott SMS trước 17h45 ngày quay (Mega quay Thứ 4, 6, CN; Power quay Thứ 3, 5, 7).',
      specialAdvantage: 'Chi phí cực thấp, không gây áp lực tài chính, thích hợp nuôi bền bỉ mỗi kỳ 1-2 vé.'
    },
    {
      id: 'de_3cang_4cang',
      category: 'micro_stake',
      tag: 'Đánh Bé Ăn To',
      tagColor: 'from-purple-500 to-indigo-600',
      title: 'Đề 3 Càng & 4 Càng (Tỷ lệ 1:960 và 1:8800)',
      game: 'Xổ Số 3 Miền (XSMB, XSMN, XSMT)',
      stake: '10.000đ - 20.000đ',
      multiplier: '1 ăn 960 (3 càng) | 1 ăn 8.800 (4 càng)',
      summary: 'Dự đoán 3 hoặc 4 chữ số cuối cùng của Giải Đặc Biệt. Đánh 10k trúng 9.600.000đ hoặc 88.000.000đ.',
      howToGet: 'Vào tab "Soi Cầu 3 Miền VIP", xem mục "Tam Giác Cầu Pascal". Lấy cặp đuôi Pascal làm 2 số cuối, lấy đỉnh và tâm tháp Pascal làm Càng đầu.',
      howToBet: 'Ghi vé tại đại lý hoặc cổng xổ số trực tuyến uy tín (chọn mục 3 Càng hoặc 4 Càng Đặc Biệt).',
      specialAdvantage: 'Bội số sinh lời khổng lồ chỉ với một đồng vốn nhỏ, tỷ lệ trả thưởng vượt trội.'
    },
    {
      id: 'lo_xien',
      category: 'micro_stake',
      tag: 'Đánh Bé Ăn To',
      tagColor: 'from-emerald-500 to-teal-600',
      title: 'Lô Xiên 2, Xiên 3, Xiên 4 (Đòn Bẩy x10 - x250)',
      game: 'Xổ Số Truyền Thống (XSMB)',
      stake: '20.000đ - 50.000đ',
      multiplier: 'Xiên 2 (x10) | Xiên 3 (x40) | Xiên 4 (x100 - x250)',
      summary: 'Ghép 2, 3 hoặc 4 con lô cùng về trong một bảng kết quả mở thưởng 27 giải.',
      howToGet: 'Xem mục "Lô Xiên Tương Quan Đồng Quy" trong tab Soi Cầu 3 Miền. Tool tự động lọc các cặp số có hệ số Jaccard tương quan cao nhất.',
      howToBet: 'Đánh trên bảng cược Lô Xiên (Xiên 2 hoặc Xiên 3 là điểm cân bằng vàng giữa xác suất và lợi nhuận).',
      specialAdvantage: 'Vốn thấp nhưng khi cả 2 hoặc 3 số cùng nổ, số tiền nhận về gấp từ 10 đến 40 lần số tiền đặt.'
    },
    {
      id: 'dan_de_36',
      category: 'consistent',
      tag: 'Đánh Đều Ăn Chắc',
      tagColor: 'from-blue-600 to-cyan-600',
      title: 'Dàn Đề 36 Số / 20 Số (Tỷ lệ thắng 36% - 50%)',
      game: 'Giải Đặc Biệt 3 Miền',
      stake: 'Phân bổ đều 10k/số (Tổng 360k)',
      multiplier: 'Tỷ lệ 1 ăn 99 ➔ Thu về 990k (Lãi ròng 630k)',
      summary: 'Bao phủ 36 số có xác suất xuất hiện cao nhất dựa trên quy luật chạm, tổng và nhịp rơi chu kỳ.',
      howToGet: 'Vào tab "Soi Cầu 3 Miền VIP", mở mục "Dàn Đề Thống Kê Xác Suất", bấm nút "Sao Chép Dàn 36 Số" hoặc "Dàn 20 Số".',
      howToBet: 'Ghi dàn trên nền tảng trả thưởng 1 ăn 99. Đánh đều tay theo khung 2 đến 3 ngày.',
      specialAdvantage: 'Khả năng trúng cực kỳ cao (36/100). Khi trúng 1 ngày đã bù lại chi phí và mang về lợi nhuận ròng 63%.'
    },
    {
      id: 'song_thu_lo',
      category: 'consistent',
      tag: 'Đánh Đều Ăn Chắc',
      tagColor: 'from-emerald-600 to-green-600',
      title: 'Song Thủ Lô Kẹp Tã (Bảo Hiểm Lộn Cầu)',
      game: 'Lô Tô 3 Miền',
      stake: 'Chia đều 50% cho số chính, 50% cho số lộn',
      multiplier: 'Về 1 con: Lãi ~40% | Về cả cặp: Lãi ~180%',
      summary: 'Đánh một cặp số đối xứng (ví dụ 59 và 95). Loại bỏ hoàn toàn nỗi sợ bị "về lộn đầu đuôi".',
      howToGet: 'Lấy trực tiếp từ thẻ "Song Thủ Lô" trong tab Soi Cầu 3 Miền. Tool đã phân tích nhịp rơi và biên độ đối xứng.',
      howToBet: 'Đặt cược 2 con lô với điểm số bằng nhau.',
      specialAdvantage: 'Độ an toàn tối đa. Trong 27 giải mở thưởng của XSMB, chỉ cần nổ 1 con là đã có lãi.'
    },
    {
      id: 'keno_bac_2_4',
      category: 'consistent',
      tag: 'Đánh Đều Ăn Chắc',
      tagColor: 'from-violet-600 to-purple-600',
      title: 'Keno Bậc 2 & Bậc 4 (Tích Lũy Lãi Ngày)',
      game: 'Vietlott Keno 10 Phút',
      stake: '20.000đ - 50.000đ / kỳ',
      multiplier: 'Bậc 2 (Ăn x9) | Bậc 4 (Ăn x40)',
      summary: 'Keno Bậc 2 chỉ cần trúng 2/2 số, Bậc 4 chỉ cần trúng 4/4 số (trúng 3/4 hoặc 2/4 vẫn có giải phụ).',
      howToGet: 'Mở tab Keno 10\', chọn Bậc 2 hoặc Bậc 4, nhấn Sinh vé AI với chiến thuật "Cân bằng 4 vùng".',
      howToBet: 'Đánh vào các khung giờ nổ cầu từ 11h - 13h hoặc 18h - 20h.',
      specialAdvantage: 'Xác suất trúng cao nhất trong tất cả các hình thức Vietlott, cực kỳ phù hợp để thu lãi đều đặn.'
    }
  ];

  const filteredCards =
    activeCategory === 'all'
      ? guideCards
      : guideCards.filter((c) => c.category === activeCategory);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950/80 via-slate-900 to-slate-950 p-6 sm:p-10 border border-indigo-800/40 shadow-2xl">
        <div className="absolute -right-10 -top-10 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -left-10 -bottom-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-bold uppercase tracking-wider mb-4 shadow-sm">
            <BookOpen className="w-4 h-4 text-cyan-400" />
            Cẩm Nang Dự Thưởng & Chiến Thuật Đầu Tư
          </div>

          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight mb-4">
            Hướng Dẫn Lấy Số Từ Tool &{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-300">
              Đặt Cược Thực Tế Sinh Lời
            </span>
          </h2>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6">
            Khám phá quy trình 3 bước chuyển hóa thuật toán xác suất thành giải thưởng thực tế.
            Phân loại toàn diện các trường phái từ{' '}
            <span className="text-rose-400 font-bold">"Đánh Lớn Ăn Lớn"</span> (săn Jackpot hàng chục đến hàng trăm tỷ) đến{' '}
            <span className="text-cyan-400 font-bold">"Đánh Bé Ăn To"</span> (vốn 10k ăn tiền triệu) và{' '}
            <span className="text-emerald-400 font-bold">"Ăn Chắc Mặc Bền"</span> (bảo toàn vốn & thu lãi hàng ngày).
          </p>

          {/* Quick Stats Banner */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="bg-slate-900/80 border border-slate-800 p-3.5 rounded-xl">
              <div className="text-xs text-slate-400 font-semibold mb-1">Cửa Ăn Lớn Nhất</div>
              <div className="text-lg font-black text-rose-400">~150+ TỶ VNĐ</div>
              <div className="text-[10px] text-slate-500">Vietlott Bao 15 - 18</div>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 p-3.5 rounded-xl">
              <div className="text-xs text-slate-400 font-semibold mb-1">Bội Số Đột Biến</div>
              <div className="text-lg font-black text-cyan-400">1 ĂN 8.800</div>
              <div className="text-[10px] text-slate-500">Đề 4 Càng Đặc Biệt</div>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 p-3.5 rounded-xl">
              <div className="text-xs text-slate-400 font-semibold mb-1">Xác Suất Thắng Cao</div>
              <div className="text-lg font-black text-emerald-400">36% - 50%</div>
              <div className="text-[10px] text-slate-500">Dàn Đề 36 Số (1:99)</div>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 p-3.5 rounded-xl">
              <div className="text-xs text-slate-400 font-semibold mb-1">Bảo Hiểm Hoàn Tiền</div>
              <div className="text-lg font-black text-amber-400">100% Hoàn Vốn</div>
              <div className="text-[10px] text-slate-500">Keno Bậc 10 (Trúng 0/10)</div>
            </div>
          </div>
        </div>
      </div>

      {/* 3-Step Practical Workflow */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 font-bold">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-white">
              Quy Trình 3 Bước Chuẩn: "Từ Thuật Toán Ra Tiền Thưởng"
            </h3>
            <p className="text-xs text-slate-400">
              Cách vận hành công cụ và biến các chỉ số xác suất thành vé cược ngoài đời thực
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Step 1 */}
          <div className="relative p-5 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-cyan-500/40 transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="w-8 h-8 rounded-lg bg-cyan-500 text-slate-950 font-black flex items-center justify-center text-sm shadow-md shadow-cyan-500/30">
                  1
                </span>
                <span className="text-[11px] font-bold text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded-full border border-cyan-500/20">
                  Lấy Số Từ Tool
                </span>
              </div>
              <h4 className="text-base font-bold text-white mb-2">Trích Xuất Bộ Số Tối Ưu</h4>
              <ul className="text-xs text-slate-400 space-y-2 mb-4 leading-relaxed">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <span>Chọn đài: <strong>Mega 6/45</strong>, <strong>Power 6/55</strong>, <strong>Keno</strong>, hoặc <strong>Soi Cầu 3 Miền VIP</strong>.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <span>Kiểm tra báo cáo <strong>Explainable AI (XAI)</strong> để chọn số có nhịp nén chu kỳ gan tốt và sóng tần suất dương.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <span>Bấm nút <strong>"Sao Chép Vé"</strong> hoặc <strong>"Lưu Vào Theo Dõi"</strong>.</span>
                </li>
              </ul>
            </div>
            <div className="pt-3 border-t border-slate-800/80 text-[11px] text-cyan-300 font-medium">
              💡 Mẹo: Luôn ưu tiên bộ số có độ tin cậy Confidence &gt; 80%.
            </div>
          </div>

          {/* Step 2 */}
          <div className="relative p-5 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-indigo-500/40 transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="w-8 h-8 rounded-lg bg-indigo-500 text-white font-black flex items-center justify-center text-sm shadow-md shadow-indigo-500/30">
                  2
                </span>
                <span className="text-[11px] font-bold text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-full border border-indigo-500/20">
                  Kênh Đặt Cược
                </span>
              </div>
              <h4 className="text-base font-bold text-white mb-2">Chọn Điểm Đặt Thưởng Uy Tín</h4>
              <ul className="text-xs text-slate-400 space-y-2 mb-4 leading-relaxed">
                <li className="flex items-start gap-2">
                  <Smartphone className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                  <span><strong>Vietlott SMS (App chính hãng)</strong>: Tải trên điện thoại (Viettel/Mobi/Vina), nạp tiền qua MoMo/Ngân hàng, bấm chọn số đã lưu từ Tool, tiền thưởng tự động về tài khoản.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Store className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                  <span><strong>Điểm Bán POS Vietlott</strong>: Mang mã QR hoặc đưa dãy số để nhân viên in vé vật lý chỉ mất vài giây.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Award className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                  <span><strong>Đài Truyền Thống / Nền Tảng Trực Tuyến</strong>: Đánh Lô Đề, 3 Càng, Xiên với tỷ lệ ưu đãi 1 ăn 99 (thay vì 1 ăn 70 truyền thống).</span>
                </li>
              </ul>
            </div>
            <div className="pt-3 border-t border-slate-800/80 text-[11px] text-indigo-300 font-medium">
              💡 Lưu ý: Đặt vé Vietlott trước 17h45 ngày quay để kịp kỳ thưởng.
            </div>
          </div>

          {/* Step 3 */}
          <div className="relative p-5 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-emerald-500/40 transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="w-8 h-8 rounded-lg bg-emerald-500 text-slate-950 font-black flex items-center justify-center text-sm shadow-md shadow-emerald-500/30">
                  3
                </span>
                <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                  Quản Lý Vốn
                </span>
              </div>
              <h4 className="text-base font-bold text-white mb-2">Chiến Thuật Vào Tiền Bền Vững</h4>
              <ul className="text-xs text-slate-400 space-y-2 mb-4 leading-relaxed">
                <li className="flex items-start gap-2">
                  <Percent className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Nguyên tắc Kelly</strong>: Không bao giờ đặt quá 5% - 10% tổng ngân sách nhàn rỗi cho một kỳ quay thưởng đơn lẻ.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Layers className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Chiến thuật Nuôi Khung 1-2-4</strong>: Với Dàn Đề hoặc Lô cặp, nếu ngày 1 chưa về, nhân hệ số vốn ở ngày 2 và 3 để luôn bảo toàn lãi.</span>
                </li>
                <li className="flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Quy tắc Cắt Lỗ (Stop-loss)</strong>: Đặt kỷ luật cắt lỗ ở mức 20% vốn tuần, tuyệt đối không cay cú đánh tất tay.</span>
                </li>
              </ul>
            </div>
            <div className="pt-3 border-t border-slate-800/80 text-[11px] text-emerald-300 font-medium">
              💡 Chìa khóa: Thắng lợi đến từ kỷ luật toán học và xác suất dài hạn.
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Capital Allocation Simulator */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-indigo-900/60 bg-gradient-to-b from-indigo-950/40 to-slate-950">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-white">
                Bộ Mô Phỏng Phân Bổ Ngân Sách Thông Minh (Capital Simulator)
              </h3>
              <p className="text-xs text-slate-400">
                Nhập số tiền bạn muốn chơi - Hệ thống sẽ tự động tối ưu hóa danh mục cược
              </p>
            </div>
          </div>

          {/* Quick preset buttons */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {[100000, 200000, 500000, 2000000, 5000000].map((amt) => (
              <button
                key={amt}
                onClick={() => setBudget(amt)}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  budget === amt
                    ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {(amt / 1000).toLocaleString('vi-VN')}k
              </button>
            ))}
          </div>
        </div>

        {/* Input Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
              <span>Tổng Ngân Sách Đầu Tư (VNĐ):</span>
              <span className="text-cyan-400 font-bold text-sm">
                {budget.toLocaleString('vi-VN')} VNĐ
              </span>
            </label>
            <input
              type="range"
              min="50000"
              max="10000000"
              step="50000"
              value={budget}
              onChange={(e) => setBudget(Number(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer h-2 bg-slate-800 rounded-lg"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>50k (Bé)</span>
              <span>1 Triệu</span>
              <span>5 Triệu</span>
              <span>10 Triệu (Bao số)</span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300">
              Chọn Phong Cách & Khẩu Vị Đầu Tư:
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setPlayStyle('aggressive')}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all text-left flex items-center gap-2 cursor-pointer border ${
                  playStyle === 'aggressive'
                    ? 'bg-rose-500/20 border-rose-500 text-rose-300 shadow-md shadow-rose-500/20'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <Flame className="w-3.5 h-3.5 text-rose-400" />
                Săn Jackpot Khủng
              </button>

              <button
                onClick={() => setPlayStyle('multiplier')}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all text-left flex items-center gap-2 cursor-pointer border ${
                  playStyle === 'multiplier'
                    ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300 shadow-md shadow-cyan-500/20'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                Đánh Bé Ăn To
              </button>

              <button
                onClick={() => setPlayStyle('consistent')}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all text-left flex items-center gap-2 cursor-pointer border ${
                  playStyle === 'consistent'
                    ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 shadow-md shadow-emerald-500/20'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Ăn Chắc Mặc Bền
              </button>

              <button
                onClick={() => setPlayStyle('balanced')}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all text-left flex items-center gap-2 cursor-pointer border ${
                  playStyle === 'balanced'
                    ? 'bg-indigo-500/20 border-indigo-500 text-indigo-300 shadow-md shadow-indigo-500/20'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <Layers className="w-3.5 h-3.5 text-indigo-400" />
                Cân Bằng Toàn Diện
              </button>
            </div>
          </div>
        </div>

        {/* Simulation Output Card */}
        <div className="bg-slate-950/80 p-5 rounded-2xl border border-slate-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-slate-800 gap-2">
            <div>
              <h4 className="text-sm font-black text-white">{simulation.styleTitle}</h4>
              <p className="text-xs text-slate-400">{simulation.description}</p>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Tổng phân bổ</span>
              <span className="text-base font-black text-cyan-400">
                {budget.toLocaleString('vi-VN')} VNĐ
              </span>
            </div>
          </div>

          <div className="space-y-3">
            {simulation.allocations.map((item, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">{item.name}</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      {item.percent}% vốn
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        item.risk === 'Cao'
                          ? 'bg-rose-500/20 text-rose-300'
                          : item.risk === 'Trung bình'
                          ? 'bg-amber-500/20 text-amber-300'
                          : 'bg-emerald-500/20 text-emerald-300'
                      }`}
                    >
                      Rủi ro: {item.risk}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">{item.note}</p>
                </div>

                <div className="flex items-center sm:flex-col items-end justify-between sm:justify-center border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-800/60">
                  <div className="text-sm font-black text-emerald-400">
                    {item.amount.toLocaleString('vi-VN')} đ
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Mục tiêu: <span className="font-bold text-yellow-400">{item.targetWin}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div>
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <div>
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Target className="w-5 h-5 text-cyan-400" />
              Chi Tiết Từng Hạng Mục Cược: Từ Đánh Lớn Đến Đánh Bé
            </h3>
            <p className="text-xs text-slate-400">
              Chọn danh mục để xem hướng dẫn chi tiết cách lấy số và cách thức đặt cược ngoài đời
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 bg-slate-950/80 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeCategory === 'all'
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Tất Cả
            </button>

            <button
              onClick={() => setActiveCategory('high_stake')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeCategory === 'high_stake'
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Flame className="w-3.5 h-3.5" />
              Đánh Lớn Ăn Lớn
            </button>

            <button
              onClick={() => setActiveCategory('micro_stake')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeCategory === 'micro_stake'
                  ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              Đánh Bé Ăn To
            </button>

            <button
              onClick={() => setActiveCategory('consistent')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeCategory === 'consistent'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              Ăn Chắc Mặc Bền
            </button>
          </div>
        </div>

        {/* Strategy Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredCards.map((card) => (
            <div
              key={card.id}
              className="glass-panel p-6 rounded-3xl border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Header Tag */}
                <div className="flex items-center justify-between mb-3">
                  <span
                    className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider text-white bg-gradient-to-r ${card.tagColor} shadow-sm`}
                  >
                    {card.tag}
                  </span>
                  <span className="text-xs font-semibold text-slate-400">{card.game}</span>
                </div>

                <h4 className="text-lg font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors">
                  {card.title}
                </h4>

                {/* Key Metrics */}
                <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 mb-4">
                  <div>
                    <span className="text-[10px] text-slate-500 block">Mức Vốn Khuyên Dùng</span>
                    <span className="text-xs font-bold text-cyan-400">{card.stake}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">Tiềm Năng Tiền Thưởng</span>
                    <span className="text-xs font-bold text-yellow-400">{card.multiplier}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-300 mb-4 leading-relaxed">{card.summary}</p>

                {/* Step Guide Tabs inside Card */}
                <div className="space-y-2.5 pt-2 border-t border-slate-800/80 text-xs">
                  <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                    <div className="text-[11px] font-bold text-cyan-400 mb-1 flex items-center gap-1.5">
                      <Target className="w-3.5 h-3.5" />
                      1. Cách lấy số từ Tool:
                    </div>
                    <p className="text-slate-400 text-[11px] leading-relaxed">{card.howToGet}</p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                    <div className="text-[11px] font-bold text-indigo-400 mb-1 flex items-center gap-1.5">
                      <Smartphone className="w-3.5 h-3.5" />
                      2. Cách đặt cược ngoài thực tế:
                    </div>
                    <p className="text-slate-400 text-[11px] leading-relaxed">{card.howToBet}</p>
                  </div>

                  <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-900/40">
                    <div className="text-[11px] font-bold text-emerald-400 mb-1 flex items-center gap-1.5">
                      <Award className="w-3.5 h-3.5" />
                      Điểm ưu việt của hình thức này:
                    </div>
                    <p className="text-slate-300 text-[11px] leading-relaxed">{card.specialAdvantage}</p>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-[10px] text-slate-500">Mã danh mục: #{card.id}</span>
                <button
                  onClick={() =>
                    handleCopy(
                      `Chiến lược: ${card.title}\nĐài: ${card.game}\nVốn: ${card.stake}\nCách lấy: ${card.howToGet}\nCách đặt: ${card.howToBet}`,
                      card.id
                    )
                  }
                  className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-300 hover:text-white flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  {copiedId === card.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400 font-bold">Đã sao chép!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      Sao chép hướng dẫn
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ & Golden Rules */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800">
        <h3 className="text-lg sm:text-xl font-bold text-white mb-4 flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-amber-400" />
          3 Nguyên Tắc Vàng & Những Sai Lầm Cần Tuyệt Đối Tránh
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-rose-950/20 border border-rose-900/40">
            <div className="flex items-center gap-2 text-rose-400 font-bold text-xs mb-2">
              <AlertTriangle className="w-4 h-4" />
              1. Tuyệt Đối Không Tất Tay (All-in)
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Xổ số là trò chơi xác suất thống kê. Dù thuật toán có độ tin cậy 95%, luôn có 5% độ lệch ngẫu nhiên (Entropy). Đánh tất tay là con đường nhanh nhất dẫn đến cháy tài khoản.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-cyan-950/20 border border-cyan-900/40">
            <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs mb-2">
              <ShieldCheck className="w-4 h-4" />
              2. Kỷ Luật Theo Đúng Khung Nuôi
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Các cầu số như Cầu Pascal hay Dàn Đề được thiết kế để nổ trong biên độ 1 đến 3 ngày. Người chơi kiên định theo đúng tỷ lệ vào tiền 1-2-4 sẽ luôn có lợi nhuận dương.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-900/40">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs mb-2">
              <TrendingUp className="w-4 h-4" />
              3. Tái Đầu Tư Thông Minh
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Khi trúng lớn (như ăn Lô Xiên hoặc Dàn Đề), hãy rút 70% lợi nhuận về tài khoản ngân hàng và chỉ trích 30% để tiếp tục săn vé Jackpot lớn.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
