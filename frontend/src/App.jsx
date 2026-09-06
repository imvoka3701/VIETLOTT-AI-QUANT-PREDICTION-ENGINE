import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import CountdownBanner from './components/CountdownBanner';
import PredictionStudio from './components/PredictionStudio';
import AnalyticsView from './components/AnalyticsView';
import LiveTracker from './components/LiveTracker';
import HistoryTable from './components/HistoryTable';
import BacktestView from './components/BacktestView';
import KenoLiveBoard from './components/KenoLiveBoard';
import TraditionalLotteryView from './components/TraditionalLotteryView';
import PlaybookGuideView from './components/PlaybookGuideView';
import DailyVIPActionCenter from './components/DailyVIPActionCenter';
import DreamBookLookup from './components/DreamBookLookup';
import SmartTicketChecker from './components/SmartTicketChecker';
import StreakLiveBoard from './components/StreakLiveBoard';
import { Sparkles, ShieldAlert, Cpu } from 'lucide-react';

export default function App() {
  const [selectedGame, setSelectedGame] = useState('mega645'); // 'mega645' | 'power655' | 'keno'
  const [activeTab, setActiveTab] = useState('vip'); // 'vip' (default practical view) | 'traditional' | 'checker' | 'dreambook' | 'streaks' | 'playbook' | 'predict' | 'analytics'
  const [isProMode, setIsProMode] = useState(false); // false = Practical Player Mode, true = Quant Pro Mode
  
  const [countdownData, setCountdownData] = useState(null);
  const [latestDraw, setLatestDraw] = useState(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncToast, setSyncToast] = useState(null);

  useEffect(() => {
    fetchLatestDrawAndCountdown();
  }, [selectedGame]);

  const fetchLatestDrawAndCountdown = async () => {
    try {
      const [cRes, lRes] = await Promise.all([
        fetch(`/api/draws/countdown?game_type=${selectedGame}`),
        fetch(`/api/draws/latest?game_type=${selectedGame}`)
      ]);

      if (cRes.ok) setCountdownData(await cRes.json());
      if (lRes.ok) setLatestDraw(await lRes.json());
    } catch (e) {
      console.error('Error loading draw data:', e);
    }
  };

  const handleTriggerSync = async () => {
    setIsSyncing(true);
    try {
      const res = await fetch(`/api/sync?game_type=${selectedGame}`, { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setSyncToast(data.message || 'Đồng bộ kết quả thành công!');
        fetchLatestDrawAndCountdown();
        setTimeout(() => setSyncToast(null), 4000);
      }
    } catch (e) {
      console.error(e);
      setSyncToast('Lỗi khi đồng bộ kết quả.');
      setTimeout(() => setSyncToast(null), 4000);
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070a12] text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-slate-950">
      {/* Toast Notification */}
      {syncToast && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 bg-indigo-600 text-white rounded-xl shadow-2xl flex items-center gap-2 text-xs font-bold border border-indigo-400 animate-bounce">
          <Sparkles className="w-4 h-4 text-yellow-300" />
          {syncToast}
        </div>
      )}

      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedGame={selectedGame}
        setSelectedGame={setSelectedGame}
        isProMode={isProMode}
        setIsProMode={setIsProMode}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {/* Real-time Countdown Banner */}
        <CountdownBanner
          countdownData={countdownData}
          onSync={handleTriggerSync}
          isSyncing={isSyncing}
        />

        {/* Dynamic Views: Practical Everyday Views or Deep Quant Pro Views */}
        {activeTab === 'vip' ? (
          <DailyVIPActionCenter
            selectedGame={selectedGame}
            setSelectedGame={setSelectedGame}
            onNavigateToTab={(tab) => setActiveTab(tab)}
          />
        ) : activeTab === 'checker' ? (
          <SmartTicketChecker selectedGame={selectedGame} />
        ) : activeTab === 'dreambook' ? (
          <DreamBookLookup />
        ) : activeTab === 'streaks' ? (
          <StreakLiveBoard />
        ) : activeTab === 'playbook' ? (
          <PlaybookGuideView />
        ) : activeTab === 'traditional' ? (
          <TraditionalLotteryView />
        ) : selectedGame === 'keno' ? (
          <KenoLiveBoard />
        ) : (
          <>
            {activeTab === 'predict' && (
              <PredictionStudio
                selectedGame={selectedGame}
                onSaveTickets={() => fetchLatestDrawAndCountdown()}
              />
            )}

            {activeTab === 'analytics' && <AnalyticsView selectedGame={selectedGame} />}

            {activeTab === 'tracker' && (
              <LiveTracker
                selectedGame={selectedGame}
                latestDraw={latestDraw}
                onRefreshDraws={fetchLatestDrawAndCountdown}
              />
            )}

            {activeTab === 'history' && <HistoryTable selectedGame={selectedGame} />}

            {activeTab === 'backtest' && <BacktestView selectedGame={selectedGame} />}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-cyan-400" />
            <span className="font-semibold text-slate-400">Vietlott AI Quant Engine</span>
            <span>-</span>
            <span>Markov Transition • Bayesian Hazard • ML Classifier • Monte Carlo • GA Optimizer</span>
          </div>

          <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-500" />
            Công cụ hỗ trợ nghiên cứu toán học xác suất thống kê.
          </div>
        </div>
      </footer>
    </div>
  );
}
