import React, { useState, useEffect } from 'react';
import { History, Search, ChevronLeft, ChevronRight, Filter } from 'lucide-react';
import LotteryBall from './LotteryBall';

export default function HistoryTable({ selectedGame }) {
  const [draws, setDraws] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [limit] = useState(15);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setPage(0);
    fetchDraws(0, search);
  }, [selectedGame]);

  const fetchDraws = async (pageIdx, query = '') => {
    setIsLoading(true);
    try {
      const url = `/api/draws?game_type=${selectedGame}&limit=${limit}&offset=${pageIdx * limit}${
        query ? `&search=${encodeURIComponent(query)}` : ''
      }`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setDraws(data.draws || []);
        setTotal(data.total || 0);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(0);
    fetchDraws(0, search);
  };

  const formatMoney = (val) => {
    if (!val || val === 0) return '-';
    if (val >= 1_000_000_000) {
      return `${(val / 1_000_000_000).toLocaleString('vi-VN', { maximumFractionDigits: 1 })} Tỷ ₫`;
    }
    return `${(val / 1_000_000).toLocaleString('vi-VN')} Tr ₫`;
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="glass-panel p-6 rounded-2xl flex flex-col gap-6">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <History className="w-5 h-5 text-cyan-400" />
            Lịch Sử Các Kỳ Quay Số ({total} kỳ)
          </h3>
          <p className="text-xs text-slate-400">
            Dữ liệu đầy đủ tất cả các kỳ quay chính thức của Vietlott {selectedGame === 'mega645' ? 'Mega 6/45' : 'Power 6/55'}.
          </p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm theo kỳ quay, ngày, số..."
              className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder:text-slate-500 focus:border-cyan-500 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition-all cursor-pointer"
          >
            Tìm
          </button>
        </form>
      </div>

      {/* Table */}
      <div className="overflow-x-auto border border-slate-800 rounded-xl">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-950/90 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-800">
            <tr>
              <th className="p-3.5">Kỳ Quay</th>
              <th className="p-3.5">Ngày Mở Thưởng</th>
              <th className="p-3.5 text-center">Bộ Số Trúng Thưởng</th>
              <th className="p-3.5 text-right">Giá Trị Jackpot</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-mono">
            {isLoading ? (
              <tr>
                <td colSpan={4} className="p-8 text-center text-slate-500">
                  Đang tải dữ liệu lịch sử...
                </td>
              </tr>
            ) : draws.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-8 text-center text-slate-500">
                  Không tìm thấy kỳ quay nào phù hợp.
                </td>
              </tr>
            ) : (
              draws.map((d) => (
                <tr key={d.id} className="hover:bg-slate-900/50 transition-colors">
                  <td className="p-3.5 font-bold text-cyan-400">#{d.draw_id}</td>
                  <td className="p-3.5 text-slate-300 font-sans">{d.draw_date}</td>
                  <td className="p-3.5">
                    <div className="flex items-center justify-center gap-1.5 sm:gap-2">
                      {d.numbers.map((n) => (
                        <LotteryBall key={n} number={n} size="sm" />
                      ))}
                      {d.bonus_number && (
                        <>
                          <span className="text-slate-600 font-bold px-0.5">+</span>
                          <LotteryBall number={d.bonus_number} size="sm" isBonus />
                        </>
                      )}
                    </div>
                  </td>
                  <td className="p-3.5 text-right font-bold text-amber-400">
                    {formatMoney(d.jackpot1_value)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between text-xs text-slate-400">
        <div>
          Trang <strong className="text-white">{page + 1}</strong> / {totalPages || 1}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => {
              if (page > 0) {
                setPage(page - 1);
                fetchDraws(page - 1, search);
              }
            }}
            disabled={page === 0 || isLoading}
            className="px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-slate-300 hover:bg-slate-800 disabled:opacity-40 flex items-center gap-1 cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" /> Trước
          </button>
          <button
            onClick={() => {
              if (page < totalPages - 1) {
                setPage(page + 1);
                fetchDraws(page + 1, search);
              }
            }}
            disabled={page >= totalPages - 1 || isLoading}
            className="px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-slate-300 hover:bg-slate-800 disabled:opacity-40 flex items-center gap-1 cursor-pointer"
          >
            Sau <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
