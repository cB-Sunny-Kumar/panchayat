"use client";

import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell,
  PieChart,
  Pie
} from 'recharts';

interface AnalyticsChartsProps {
  categoryData: { name: string; value: number }[];
  statusData: { name: string; value: number }[];
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export function AnalyticsCharts({ categoryData, statusData }: AnalyticsChartsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      {/* Category Bar Chart */}
      <div className="bg-neutral-900 p-6 rounded-3xl border border-neutral-800 shadow-xl">
        <h3 className="text-sm font-bold text-neutral-400 uppercase mb-6 tracking-widest">Complaints by Category</h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={categoryData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#262626" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#94a3b8', fontSize: 12 }} 
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#94a3b8', fontSize: 12 }} 
              />
              <Tooltip 
                cursor={{ fill: '#171717' }}
                contentStyle={{ backgroundColor: '#0a0a0a', borderRadius: '12px', border: '1px solid #262626', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.5)', color: '#f3f4f6' }}
              />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Status Pie Chart */}
      <div className="bg-neutral-900 p-6 rounded-3xl border border-neutral-800 shadow-xl">
        <h3 className="text-sm font-bold text-neutral-400 uppercase mb-6 tracking-widest">Complaints by Status</h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="#171717" strokeWidth={2} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: '#0a0a0a', borderRadius: '12px', border: '1px solid #262626', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.5)', color: '#f3f4f6' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
