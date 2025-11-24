import React, { useMemo } from 'react';
import { Dream } from '../types';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, TooltipProps } from 'recharts';
import { format } from 'date-fns';
import { Sparkles, Brain } from 'lucide-react';

interface StatsProps {
  dreams: Dream[];
}

const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-800 border border-slate-700 p-3 rounded-lg shadow-xl">
          <p className="text-slate-300 text-xs mb-1">{label}</p>
          <p className="text-mystic-400 font-bold text-sm">
            Sentiment: {payload[0].value}
          </p>
        </div>
      );
    }
    return null;
  };

export const Stats: React.FC<StatsProps> = ({ dreams }) => {
  const chartData = useMemo(() => {
    return dreams
      .filter(d => d.analysis)
      .map(d => ({
        date: format(new Date(d.date), 'MMM d'),
        fullDate: d.date,
        score: d.analysis!.sentimentScore,
        mood: d.analysis!.mood
      }))
      .sort((a, b) => new Date(a.fullDate).getTime() - new Date(b.fullDate).getTime());
  }, [dreams]);

  const moodCounts = useMemo(() => {
      const counts: Record<string, number> = {};
      dreams.forEach(d => {
          const m = d.analysis?.mood || 'Unknown';
          counts[m] = (counts[m] || 0) + 1;
      });
      return Object.entries(counts).sort((a,b) => b[1] - a[1]);
  }, [dreams]);

  const lucidCount = dreams.filter(d => d.isLucid).length;
  const lucidPercentage = dreams.length > 0 ? Math.round((lucidCount / dreams.length) * 100) : 0;

  if (dreams.length < 2) {
      return (
          <div className="flex flex-col items-center justify-center h-[50vh] text-slate-500">
              <p className="text-xl font-serif mb-2">Not enough stardust yet.</p>
              <p>Record more dreams to unlock insights.</p>
          </div>
      )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn pb-12">
      <div className="bg-slate-800/40 backdrop-blur p-6 rounded-2xl border border-slate-700">
        <h2 className="text-xl font-serif text-slate-200 mb-6">Dream Sentiment Flow</h2>
        <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
                <defs>
                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                    </linearGradient>
                </defs>
                <XAxis 
                    dataKey="date" 
                    stroke="#475569" 
                    fontSize={12} 
                    tickLine={false}
                    axisLine={false}
                />
                <YAxis 
                    stroke="#475569" 
                    fontSize={12} 
                    tickLine={false}
                    axisLine={false}
                    domain={[0, 100]}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#64748b', strokeWidth: 1, strokeDasharray: '4 4' }} />
                <Area 
                    type="monotone" 
                    dataKey="score" 
                    stroke="#8b5cf6" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorScore)" 
                />
            </AreaChart>
            </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-800/40 backdrop-blur p-6 rounded-2xl border border-slate-700 col-span-1 md:col-span-2">
              <h3 className="text-lg font-bold text-slate-300 mb-4">Dominant Moods</h3>
              <div className="space-y-3">
                  {moodCounts.slice(0, 5).map(([mood, count], idx) => (
                      <div key={mood} className="flex items-center justify-between">
                          <span className="text-slate-400 capitalize">{mood}</span>
                          <div className="flex items-center gap-3">
                            <div className="w-32 h-2 bg-slate-700 rounded-full overflow-hidden">
                                <div 
                                    className="h-full bg-indigo-500 rounded-full" 
                                    style={{ width: `${(count / dreams.length) * 100}%` }}
                                />
                            </div>
                            <span className="text-slate-200 text-sm font-mono">{count}</span>
                          </div>
                      </div>
                  ))}
              </div>
          </div>

          <div className="space-y-6">
              <div className="bg-slate-800/40 backdrop-blur p-6 rounded-2xl border border-slate-700 flex flex-col justify-center items-center text-center">
                  <div className="p-3 bg-slate-700 rounded-full mb-3">
                    <Brain className="text-slate-400" size={24}/>
                  </div>
                  <h3 className="text-sm font-bold text-slate-400 mb-1 uppercase tracking-wider">Total Dreams</h3>
                  <div className="text-4xl font-serif font-bold text-white">{dreams.length}</div>
              </div>

              <div className="lucid-gradient animate-shimmer p-6 rounded-2xl shadow-lg flex flex-col justify-center items-center text-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-black/10"></div>
                  <div className="relative z-10">
                    <div className="flex items-center justify-center gap-2 mb-2">
                        <Sparkles className="text-white" size={20}/>
                        <h3 className="text-sm font-bold text-white uppercase tracking-wider">Lucidity</h3>
                    </div>
                    <div className="text-4xl font-serif font-bold text-white mb-1">{lucidPercentage}%</div>
                    <p className="text-white/80 text-xs">{lucidCount} Lucid Dreams</p>
                  </div>
              </div>
          </div>
      </div>
    </div>
  );
};