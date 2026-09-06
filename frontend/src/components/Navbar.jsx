import React from 'react';
import { Cpu, BarChart3, Ticket, History, Activity, Sparkles, Flame, BookOpen } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, selectedGame, setSelectedGame }) {
  const tabs = [
    { id: 'predict', label: 'Dự Đoán Vietlott AI', icon: Cpu },
    { id: 'traditional', label: 'Soi Cầu 3 Miền VIP', icon: Flame },
    { id: 'playbook', label: 'Cẩm Nang & Đặt Cược', icon: BookOpen },
    { id: 'analytics', label: 'Phân Tích Ma Trận', icon: BarChart3 },
    { id: 'tracker', label: 'Theo Dõi & So Vé', icon: Ticket },
    { id: 'history', label: 'Lịch Sử Quay Số', icon: History },
    { id: 'backtest', label: 'Kiểm Thử (Backtest)', icon: Activity },
  ];

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-slate-800/80 mb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-purple-600 p-0.5 shadow-lg shadow-indigo-500/30 flex items-center justify-center">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-cyan-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-black tracking-tight text-white">
                  VIETLOTT <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">QUANT AI</span>
                </h1>
                <span className="px-1.5 py-0.5 text-[9px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded uppercase tracking-wider">
                  v2.0 PRO
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Hệ thống Định lượng Xác suất & Tối ưu hóa Thuật toán Xổ số
              </p>
            </div>
          </div>

          {/* Game Selector Switcher & Realtime Badge */}
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[11px] font-semibold text-emerald-400 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              vietlott.vn Live
            </div>

            <div className="flex items-center bg-slate-950/80 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => setSelectedGame('mega645')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  selectedGame === 'mega645'
                    ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-md shadow-red-600/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Mega 6/45
              </button>
              <button
                onClick={() => setSelectedGame('power655')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  selectedGame === 'power655'
                    ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-md shadow-amber-600/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Power 6/55
              </button>
              <button
                onClick={() => setSelectedGame('keno')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                  selectedGame === 'keno'
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-600/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                Keno 10'
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 overflow-x-auto pb-2 sm:pb-0 scrollbar-none border-t border-slate-800/40">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-semibold border-b-2 whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'border-cyan-400 text-cyan-300 bg-cyan-500/10'
                    : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}
