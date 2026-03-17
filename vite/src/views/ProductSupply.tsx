import React, { useEffect, useState } from 'react';
import { apiClient } from '../api/client';
import { SupplyInfoDto } from '../types/api';
import { Loader2, Search } from 'lucide-react';

export function ProductSupply() {
  const [data, setData] = useState<SupplyInfoDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [productName, setProductName] = useState('Фільтр');

  const fetchData = () => {
    setLoading(true);
    apiClient.getProductSupplyInfo(productName).then(res => {
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
        <h2 className="text-sm font-semibold text-slate-800 uppercase tracking-wider mb-4">Пошук деталі</h2>
        <div className="flex gap-4">
          <div className="flex-1">
            <input 
              type="text" 
              value={productName} 
              onChange={e => setProductName(e.target.value)} 
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" 
              placeholder="Введіть назву деталі..." 
            />
          </div>
          <button onClick={fetchData} className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">
            <Search size={16} />
            Знайти
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100">
          <h2 className="text-lg font-semibold text-slate-800">Інформація про постачання: {productName}</h2>
        </div>
        
        {loading ? (
          <div className="flex justify-center p-12"><Loader2 className="animate-spin text-indigo-500" size={32} /></div>
        ) : data.length === 0 ? (
          <div className="p-12 text-center text-slate-500">Немає даних для цієї деталі</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="px-6 py-3 font-medium">Постачальник</th>
                  <th className="px-6 py-3 font-medium">Ціна (₴)</th>
                  <th className="px-6 py-3 font-medium">Час поставки (дні)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50">
                    <td className="px-6 py-4 font-medium text-slate-900">{item.supplierName}</td>
                    <td className="px-6 py-4 text-emerald-600 font-medium">{item.price.toFixed(2)}</td>
                    <td className="px-6 py-4 text-slate-600">{item.deliveryTimeDays}</td>
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
