import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Zap,
  CheckCircle2,
  Copy,
  Layers,
  Flame,
  ShieldCheck,
  TrendingUp,
  Info,
  ChevronRight,
  Calculator,
  X
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function TraditionalLotteryView() {
  const [region, setRegion] = useState('xsmb'); // 'xsmb' | 'xsmn' | 'xsmt'
  const [predictionData, setPredictionData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [danTab, setDanTab] = useState('dan_20'); // 'dan_10' | 'dan_20' | 'dan_36'
  const [copiedText, setCopiedText] = useState('');

  // Custom Pascal state
  const [customSpecial, setCustomSpecial] = useState('74189');
  const [customFirst, setCustomFirst] = useState('32954');
  const [pascalResult, setPascalResult] = useState(null);

  // XAI Modal state
  const [selectedXAINum, setSelectedXAINum] = useState(null);
  const [xaiData, setXaiData] = useState(null);
  const [isXAILoading, setIsXAILoading] = useState(false);

  useEffect(() => {
    fetchPrediction();
  }, [region]);

  const fetchPrediction = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/traditional/predict?region=${region}`);
      if (res.ok) {
        const data = await res.json();
        setPredictionData(data);
        setPascalResult(data.pascal);
      }
    } catch (e) {
      console.error('Error loading traditional prediction:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleComputeCustomPascal = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/traditional/pascal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          special_prize: customSpecial,
          first_prize: customFirst
        })
      });
      if (res.ok) {
        const data = await res.json();
        setPascalResult(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleOpenXAI = async (num) => {
    const numInt = parseInt(num, 10);
    if (isNaN(numInt)) return;
    setSelectedXAINum(numInt);
    setIsXAILoading(true);
    try {
      const res = await fetch(`/api/traditional/explain?number=${numInt}&game_type=mega645`);
      if (res.ok) {
        setXaiData(await res.json());
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsXAILoading(false);
    }
  };

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(''), 2500);
  };

  const regionNames = {
    xsmb: 'Xổ Số Miền Bắc (XSMB)',
    xsmn: 'Xổ Số Miền Nam (XSMN)',
    xsmt: 'Xổ Số Miền Trung (XSMT)'
  };

  return (
    <div className="flex flex-col gap-6 animate-fadeIn">
      {/* Top Region Switcher Header */}
      <div className="glass-panel p-5 rounded-2xl border border-indigo-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-black text-white tracking-tight">
              SOI CẦU ĐỊNH LƯỢNG <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-red-500">3 MIỀN BẮC - TRUNG - NAM</span>
            </h2>
            <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-bold border border-indigo-500/30">
              Thuật Toán Bạch Thủ & Cầu Pascal
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Ứng dụng mô hình Co-occurrence, Ma trận nhịp rơi 2 số cuối và phân tích tam giác Pascal chuẩn toán học.
          </p>
        </div>

        {/* Region Buttons */}
        <div className="flex items-center bg-slate-950/80 p-1 rounded-xl border border-slate-800">
          {['xsmb', 'xsmn', 'xsmt'].map((reg) => (
            <button
              key={reg}
              onClick={() => setRegion(reg)}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                region === reg
                  ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-md shadow-orange-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {reg === 'xsmb' ? 'Miền Bắc' : reg === 'xsmn' ? 'Miền Nam' : 'Miền Trung'}
            </button>
          ))}
        </div>
      </div>

      {predictionData && (
        <>
          {/* Main 3 Prediction Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* 1. Bạch Thủ Lô */}
            <div className="glass-panel p-6 rounded-2xl border border-amber-500/30 flex flex-col justify-between relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Flame className="w-4 h-4 text-amber-400" />
                    Bạch Thủ Lô Hôm Nay
                  </span>
                  <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-mono font-bold">
                    Tin cậy: {predictionData.bach_thu_lo.confidence}%
                  </span>
                </div>

                <div className="flex items-center gap-4 my-2">
                  <div
                    onClick={() => handleOpenXAI(predictionData.bach_thu_lo.number)}
                    className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 via-orange-500 to-red-500 text-white font-mono text-3xl font-black flex items-center justify-center shadow-lg shadow-amber-500/30 cursor-pointer hover:scale-105 transition-all ring-2 ring-amber-300/40"
                    title="Bấm để xem luận điểm toán học giải thích tại sao chọn số này"
                  >
                    {predictionData.bach_thu_lo.number}
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 block">Lót nhẹ (Lộn):</span>
                    <span
                      onClick={() => handleOpenXAI(predictionData.bach_thu_lo.inverted)}
                      className="text-lg font-mono font-bold text-amber-200 cursor-pointer hover:underline"
                    >
                      {predictionData.bach_thu_lo.inverted}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-400 mt-2 line-clamp-2">
                  {predictionData.bach_thu_lo.reason}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <button
                  onClick={() => handleOpenXAI(predictionData.bach_thu_lo.number)}
                  className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <Info className="w-3.5 h-3.5" /> Xem luận điểm AI (XAI)
                </button>
                <button
                  onClick={() => copyToClipboard(predictionData.bach_thu_lo.number, 'btl')}
                  className="text-xs text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
                >
                  {copiedText === 'btl' ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedText === 'btl' ? 'Đã copy!' : 'Copy'}
                </button>
              </div>
            </div>

            {/* 2. Song Thủ Lô */}
            <div className="glass-panel p-6 rounded-2xl border border-cyan-500/30 flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Zap className="w-4 h-4 text-cyan-400" />
                    Song Thủ Lô Tương Hỗ
                  </span>
                  <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 text-[10px] font-mono font-bold">
                    Tin cậy: {predictionData.song_thu_lo.confidence}%
                  </span>
                </div>

                <div className="flex items-center gap-3 my-2">
                  {predictionData.song_thu_lo.pair.map((num) => (
                    <div
                      key={num}
                      onClick={() => handleOpenXAI(num)}
                      className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-white font-mono text-2xl font-black flex items-center justify-center shadow-lg shadow-cyan-500/30 cursor-pointer hover:scale-105 transition-all"
                      title="Bấm để xem luận điểm toán học"
                    >
                      {num}
                    </div>
                  ))}
                </div>

                <p className="text-xs text-slate-400 mt-2">
                  Chiến thuật cặp số lộn song hành: Tối đa hóa xác suất nổ ít nhất 1 nháy, bù trừ rủi ro gãy cầu.
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <button
                  onClick={() => handleOpenXAI(predictionData.song_thu_lo.pair[0])}
                  className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <Info className="w-3.5 h-3.5" /> Xem luận điểm AI
                </button>
                <button
                  onClick={() => copyToClipboard(predictionData.song_thu_lo.pair.join(' - '), 'stl')}
                  className="text-xs text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
                >
                  {copiedText === 'stl' ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedText === 'stl' ? 'Đã copy!' : 'Copy'}
                </button>
              </div>
            </div>

            {/* 3. Lô Xiên 2 & Xiên 3 */}
            <div className="glass-panel p-6 rounded-2xl border border-purple-500/30 flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-purple-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-purple-400" />
                    Lô Xiên 2 & Xiên 3 Co-occurrence
                  </span>
                  <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 text-[10px] font-bold">
                    Xác suất cặp
                  </span>
                </div>

                <div className="space-y-2 mt-2">
                  <div className="p-2.5 bg-slate-950/80 border border-slate-800/80 rounded-xl flex items-center justify-between">
                    <span className="text-[11px] text-slate-400 font-semibold">Xiên 2 A:</span>
                    <span className="font-mono text-xs font-bold text-purple-300">{predictionData.lo_xien.xien_2[0]}</span>
                  </div>
                  <div className="p-2.5 bg-slate-950/80 border border-slate-800/80 rounded-xl flex items-center justify-between">
                    <span className="text-[11px] text-slate-400 font-semibold">Xiên 2 B:</span>
                    <span className="font-mono text-xs font-bold text-purple-300">{predictionData.lo_xien.xien_2[1]}</span>
                  </div>
                  <div className="p-2.5 bg-slate-950/80 border border-slate-800/80 rounded-xl flex items-center justify-between">
                    <span className="text-[11px] text-slate-400 font-semibold">Xiên 3 VIP:</span>
                    <span className="font-mono text-xs font-bold text-amber-300">{predictionData.lo_xien.xien_3[0]}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-end">
                <button
                  onClick={() => copyToClipboard(predictionData.lo_xien.xien_2.join(' | '), 'xien')}
                  className="text-xs text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
                >
                  {copiedText === 'xien' ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedText === 'xien' ? 'Đã copy!' : 'Copy các cặp xiên'}
                </button>
              </div>
            </div>
          </div>

          {/* Dàn Đề Đặc Biệt & Cầu Pascal Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Dàn Đề Đặc Biệt (7 Cols) */}
            <div className="lg:col-span-7 glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-amber-400" />
                      Dàn Đề Giải Đặc Biệt (Chạm & Tổng)
                    </h3>
                    <p className="text-xs text-slate-400">
                      Chạm kết hôm nay: <strong className="text-amber-400 font-mono">Chạm {predictionData.dan_de.cham_ket[0]} & Chạm {predictionData.dan_de.cham_ket[1]}</strong>
                    </p>
                  </div>

                  <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
                    <button
                      onClick={() => setDanTab('dan_10')}
                      className={`px-3 py-1 text-xs font-bold rounded-lg cursor-pointer ${
                        danTab === 'dan_10' ? 'bg-amber-500 text-slate-950' : 'text-slate-400'
                      }`}
                    >
                      Dàn 10
                    </button>
                    <button
                      onClick={() => setDanTab('dan_20')}
                      className={`px-3 py-1 text-xs font-bold rounded-lg cursor-pointer ${
                        danTab === 'dan_20' ? 'bg-amber-500 text-slate-950' : 'text-slate-400'
                      }`}
                    >
                      Dàn 20
                    </button>
                    <button
                      onClick={() => setDanTab('dan_36')}
                      className={`px-3 py-1 text-xs font-bold rounded-lg cursor-pointer ${
                        danTab === 'dan_36' ? 'bg-amber-500 text-slate-950' : 'text-slate-400'
                      }`}
                    >
                      Dàn 36
                    </button>
                  </div>
                </div>

                {/* Number Grid */}
                <div className="flex flex-wrap gap-2 p-3 bg-slate-950/80 rounded-xl border border-slate-800/80 min-h-[140px] items-center">
                  {predictionData.dan_de[danTab]?.map((num) => (
                    <span
                      key={num}
                      onClick={() => handleOpenXAI(num)}
                      className="w-10 h-10 rounded-xl bg-slate-900/90 hover:bg-amber-500 hover:text-slate-950 text-slate-200 border border-slate-800 font-mono text-sm font-bold flex items-center justify-center cursor-pointer transition-all shadow-sm"
                      title="Bấm để xem luận điểm AI"
                    >
                      {num}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                <span>Số lượng: <strong className="text-white">{predictionData.dan_de[danTab]?.length} con</strong></span>
                <button
                  onClick={() => copyToClipboard(predictionData.dan_de[danTab]?.join(', '), 'dan_de')}
                  className="text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
                >
                  {copiedText === 'dan_de' ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedText === 'dan_de' ? 'Đã copy dàn số!' : 'Copy dàn đề'}
                </button>
              </div>
            </div>

            {/* Cầu Pascal Visualizer & Calculator (5 Cols) */}
            <div className="lg:col-span-5 glass-panel p-6 rounded-2xl border border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2 mb-1">
                <Calculator className="w-5 h-5 text-cyan-400" />
                Cầu Pascal Giải Đặc Biệt & Giải Nhất
              </h3>
              <p className="text-xs text-slate-400 mb-4">
                Cộng dồn liên tiếp 2 chữ số kề nhau (mod 10) để rút gọn về cặp số bạch thủ.
              </p>

              {/* Pascal Triangle Render */}
              {pascalResult && (
                <div className="p-3 bg-slate-950/90 border border-slate-800/80 rounded-xl flex flex-col items-center gap-1 font-mono text-xs overflow-x-auto">
                  {pascalResult.triangle_rows.map((row, rIdx) => (
                    <div
                      key={rIdx}
                      className={`tracking-widest ${
                        rIdx === pascalResult.triangle_rows.length - 1
                          ? 'text-base font-black text-amber-400 bg-amber-500/20 px-3 py-1 rounded-lg border border-amber-500/40 animate-bounce mt-1'
                          : rIdx === 0
                          ? 'text-cyan-400 font-bold'
                          : 'text-slate-400 text-[11px]'
                      }`}
                    >
                      {row.split('').join(' ')}
                    </div>
                  ))}
                </div>
              )}

              {/* Custom Input Form */}
              <form onSubmit={handleComputeCustomPascal} className="mt-4 pt-3 border-t border-slate-800/80 flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Giải ĐB (VD: 74189)"
                  value={customSpecial}
                  onChange={(e) => setCustomSpecial(e.target.value)}
                  className="w-1/2 p-2 bg-slate-900 border border-slate-800 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-cyan-500"
                />
                <input
                  type="text"
                  placeholder="Giải Nhất (VD: 32954)"
                  value={customFirst}
                  onChange={(e) => setCustomFirst(e.target.value)}
                  className="w-1/2 p-2 bg-slate-900 border border-slate-800 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-cyan-500"
                />
                <button
                  type="submit"
                  className="px-3 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-bold cursor-pointer whitespace-nowrap"
                >
                  Tính
                </button>
              </form>
            </div>
          </div>
        </>
      )}

      {/* EXPLAINABLE AI (XAI) MODAL POPUP */}
      {selectedXAINum !== null && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-cyan-500/40 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative animate-scaleUp">
            <button
              onClick={() => setSelectedXAINum(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-white font-mono text-2xl font-black flex items-center justify-center shadow-lg shadow-cyan-500/30">
                {String(selectedXAINum).padStart(2, '0')}
              </div>
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Báo Cáo Luận Điểm Toán Học AI (XAI)
                </h3>
                <p className="text-xs text-slate-400">
                  Dẫn chứng định lượng giải thích tại sao hệ thống đề xuất con số này.
                </p>
              </div>
            </div>

            {isXAILoading ? (
              <div className="py-8 text-center text-xs text-cyan-400 animate-pulse">
                Đang trích xuất ma trận Markov & tham số Bayesian Hazard...
              </div>
            ) : xaiData ? (
              <div className="space-y-3">
                {/* Confidence Bar */}
                <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-400">Chỉ số tự tin tổng hợp:</span>
                    <span className="font-mono font-bold text-cyan-400">{xaiData.overall_confidence}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-cyan-400 to-emerald-400 rounded-full" style={{ width: `${xaiData.overall_confidence}%` }} />
                  </div>
                </div>

                {/* 3 Reasoning Pillars */}
                <div className="space-y-2 max-h-[260px] overflow-y-auto pr-1">
                  {xaiData.reasons.map((r, idx) => (
                    <div key={idx} className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 text-xs">
                      <span className="font-bold text-amber-300 block mb-1">
                        {idx + 1}. {r.title}
                      </span>
                      <p className="text-slate-300 leading-relaxed">
                        {r.detail}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Final Verdict */}
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-300">
                  <strong className="block mb-0.5">Kết luận thuật toán:</strong>
                  {xaiData.recommendation}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}
