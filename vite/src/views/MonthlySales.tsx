import React, { useEffect, useState } from 'react';
import { apiClient } from '../api/client';
import { MonthlySaleStatDto } from '../types/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Loader2 } from 'lucide-react';

export function MonthlySales() {
  const [data, setData] = useState<MonthlySaleStatDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.getMonthlySales().then(res => {
      setData(res);
      setLoading(false);
    });
  }, []);

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <h2 className="text-lg font-semibold text-slate-800 mb-6">Середнє число продажів на місяць</h2>
        
        {loading ? (
          <div className="flex justify-center p-12 h-80 items-center"><Loader2 className="animate-spin text-indigo-500" size={32} /></div>
        ) : data.length === 0 ? (
          <div className="p-12 text-center text-slate-500 h-80 flex items-center justify-center">Немає даних</div>
        ) : (
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis 
                  dataKey="productName" 
                  stroke="#64748B" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false}
                  angle={-45}
                  textAnchor="end"
                />
                <YAxis stroke="#64748B" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  cursor={{fill: '#F1F5F9'}}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="averageMonthlySales" name="Середні продажі (шт)" radius={[4, 4, 0, 0]}>
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill="#3B82F6" />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}
