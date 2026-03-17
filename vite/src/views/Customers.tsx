import React, { useEffect, useState } from 'react';
import { apiClient } from '../api/client';
import { CustomerStatDto } from '../types/api';
import { Loader2, Search } from 'lucide-react';

export function Customers() {
  const [data, setData] = useState<CustomerStatDto[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [productName, setProductName] = useState('');
  const [minVolume, setMinVolume] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const fetchData = () => {
    setLoading(true);
    apiClient.getCustomers(productName, minVolume ? parseInt(minVolume) : undefined, startDate, endDate)
      .then(res => {
        setData(res);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <h2 className="text-sm font-semibold text-slate-800 uppercase tracking-wider mb-4">Фільтри</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Вид товару</label>
            <input type="text" value={productName} onChange={e => setProductName(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Напр. Свічки" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Мін. обсяг</label>
            <input type="number" value={minVolume} onChange={e => setMinVolume(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="0" />
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
            Застосувати
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-slate-800">Покупці</h2>
          <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-medium">
            Всього: {data.length}
          </span>
        </div>
        
        {loading ? (
          <div className="flex justify-center p-12"><Loader2 className="animate-spin text-indigo-500" size={32} /></div>
        ) : data.length === 0 ? (
          <div className="p-12 text-center text-slate-500">Немає даних за вибраними критеріями</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="px-6 py-3 font-medium">ID</th>
                  <th className="px-6 py-3 font-medium">Ім'я / Назва</th>
                  <th className="px-6 py-3 font-medium">Обсяг покупок</th>
                  <th className="px-6 py-3 font-medium">Витрачено (₴)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.map(customer => (
                  <tr key={customer.customerId} className="hover:bg-slate-50/50">
                    <td className="px-6 py-4 text-slate-500">{customer.customerId}</td>
                    <td className="px-6 py-4 font-medium text-slate-900">{customer.customerName}</td>
                    <td className="px-6 py-4 text-slate-600">{customer.purchaseVolume} од.</td>
                    <td className="px-6 py-4 text-emerald-600 font-medium">{customer.totalSpent.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
