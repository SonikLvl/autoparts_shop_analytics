import React, { useEffect, useState } from 'react';
import { apiClient } from '../api/client';
import { SupplierShareDto } from '../types/api';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Loader2, Search } from 'lucide-react';

export function SupplierShare() {
  const [data, setData] = useState<SupplierShareDto | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [supplierId, setSupplierId] = useState('1');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const fetchData = () => {
    setLoading(true);
    apiClient.getSupplierShare(parseInt(supplierId) || 1, startDate, endDate)
      .then(res => {
        setData(res);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const pieData = data ? [
    { name: data.supplierName, value: data.sharePercentage },
    { name: 'Інші', value: 100 - data.sharePercentage }
  ] : [];

  const COLORS = ['#8B5CF6', '#E2E8F0'];

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <h2 className="text-sm font-semibold text-slate-800 uppercase tracking-wider mb-4">Параметри</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">ID Постачальника</label>
            <input type="number" value={supplierId} onChange={e => setSupplierId(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="1" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Дата з</label>
            <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Дата по</label>
            <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <button onClick={fetchData} className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">
            <Search size={16} />
            Розрахувати
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center p-12"><Loader2 className="animate-spin text-indigo-500" size={32} /></div>
      ) : data ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-center items-center">
            <h3 className="text-lg font-semibold text-slate-800 mb-2 text-center">Частка у відсотках</h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number) => `${value.toFixed(1)}%`}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <h3 className="text-sm font-medium text-slate-500 mb-1">Грошова частка</h3>
              <p className="text-3xl font-bold text-slate-900 mb-4">{data.shareMoney.toLocaleString()} ₴</p>
              <div className="w-full bg-slate-100 rounded-full h-2.5">
                <div className="bg-violet-500 h-2.5 rounded-full" style={{ width: `${data.sharePercentage}%` }}></div>
              </div>
              <p className="text-xs text-slate-500 mt-2">від загального обороту {data.totalTurnover.toLocaleString()} ₴</p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <h3 className="text-sm font-medium text-slate-500 mb-1">Частка в одиницях</h3>
              <p className="text-3xl font-bold text-slate-900 mb-4">{data.shareUnits.toLocaleString()} шт</p>
              <div className="w-full bg-slate-100 rounded-full h-2.5">
                <div className="bg-emerald-500 h-2.5 rounded-full" style={{ width: `${data.sharePercentage}%` }}></div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 sm:col-span-2">
              <h3 className="text-sm font-medium text-slate-500 mb-1">Загальний прибуток магазину за період</h3>
              <p className="text-3xl font-bold text-emerald-600">{data.totalProfit.toLocaleString()} ₴</p>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
