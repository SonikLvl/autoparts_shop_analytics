import React, { useEffect, useState } from 'react';
import { apiClient } from '../api/client';
import { WarehouseItemDto } from '../types/api';
import { Loader2 } from 'lucide-react';

export function Warehouse() {
  const [data, setData] = useState<WarehouseItemDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.getWarehouseInventory().then(res => {
      setData(res);
      setLoading(false);
    });
  }, []);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-slate-800">Складські запаси</h2>
          <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-medium">
            Всього позицій: {data.length}
          </span>
        </div>
        
        {loading ? (
          <div className="flex justify-center p-12"><Loader2 className="animate-spin text-indigo-500" size={32} /></div>
        ) : data.length === 0 ? (
          <div className="p-12 text-center text-slate-500">Склад порожній</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="px-6 py-3 font-medium">ID</th>
                  <th className="px-6 py-3 font-medium">Назва деталі</th>
                  <th className="px-6 py-3 font-medium">Обсяг (шт)</th>
                  <th className="px-6 py-3 font-medium">Номер комірки</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.map(item => (
                  <tr key={item.id} className="hover:bg-slate-50/50">
                    <td className="px-6 py-4 text-slate-500">{item.id}</td>
                    <td className="px-6 py-4 font-medium text-slate-900">{item.productName}</td>
                    <td className="px-6 py-4 text-slate-600">
                      <span className="inline-flex items-center px-2 py-1 rounded-md bg-indigo-50 text-indigo-700 text-xs font-medium">
                        {item.volume}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-600 font-mono">{item.cellNumber}</td>
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
