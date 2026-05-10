import React, { useMemo } from 'react';
import {
  ArrowRight,
  Terminal,
  Activity,
  Timer,
  AlertTriangle,
  ArrowUpRight,
  Zap,
  Layers,
  Search,
  CheckCircle2
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import { formatNumber, formatPercent, formatLatency, bucketHitsByTime } from '../../utils.js';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#201515] border border-white/10 shadow-2xl p-4 rounded-[4px] text-xs">
        <p className="font-bold text-white/40 mb-3 uppercase tracking-widest text-[9px] border-b border-white/5 pb-2">{label}</p>
        {payload.map((p, i) => (
           <div key={i} className="flex items-center justify-between gap-6 mb-1 last:mb-0">
             <div className="flex items-center gap-2">
               <div className="w-1.5 h-1.5 rounded-full" style={{ background: p.color }} />
               <span className="text-white font-bold text-[10px] uppercase tracking-wider">{p.name}</span>
             </div>
             <span className="font-bold text-[#ff4f00] font-mono">{formatNumber(p.value)}</span>
           </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function MetricsPanel({ data }) {
  const stats = data?.stats;
  const topEndpoints = data?.topEndpoints || [];
  
  const series = useMemo(
    () => bucketHitsByTime(data?.recentActivity),
    [data?.recentActivity],
  );

  return (
    <div className="p-6 space-y-6 max-w-[1400px] mx-auto bg-[#fffefb] min-h-full">
      {/* Header Row (Technical Title) */}
      <div className="flex flex-col gap-0.5 mb-4 border-l-2 border-[#ff4f00] pl-4">
        <h1 className="text-2xl font-bold tracking-tighter text-[#201515]">Performance Metrics</h1>
        <p className="text-[13px] font-medium text-[#36342e] max-w-2xl opacity-70">Real-time telemetry and ingestion metrics for your production infrastructure.</p>
      </div>

      {/* Top Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#fffefb] border border-[#c5c0b1] rounded-[4px] p-6 flex flex-col justify-between group hover:border-[#ff4f00] transition-colors">
          <div>
            <div className="flex justify-between items-start mb-4">
               <span className="text-[11px] font-bold text-[#939084] uppercase tracking-widest">Total Traffic</span>
               <div className="p-1.5 rounded-full bg-[#ff4f00]/5 text-[#ff4f00]">
                 <Activity size={16} />
               </div>
            </div>
            <div className="flex items-baseline gap-2">
              <h2 className="text-4xl font-bold tracking-tighter text-[#201515] leading-none">{formatNumber(stats?.totalHits)}</h2>
              <span className="text-[9px] font-bold text-[#939084] uppercase tracking-widest">Hits</span>
            </div>
          </div>
          <div className="mt-6 pt-4 border-t border-[#eceae3]">
            <span className="text-[9px] font-bold text-[#36342e] uppercase tracking-widest opacity-40">System-wide Inbound</span>
          </div>
        </div>

        <div className="bg-[#fffefb] border border-[#c5c0b1] rounded-[4px] p-6 flex flex-col justify-between group hover:border-[#ff4f00] transition-colors">
          <div>
            <div className="flex justify-between items-start mb-4">
               <span className="text-[11px] font-bold text-[#939084] uppercase tracking-widest">Response Time</span>
               <div className="p-1.5 rounded-full bg-[#ff4f00]/5 text-[#ff4f00]">
                 <Timer size={16} />
               </div>
            </div>
            <div className="flex items-baseline gap-2">
              <h2 className="text-4xl font-bold tracking-tighter text-[#201515] leading-none">{formatLatency(stats?.avgLatency)}</h2>
              <span className="text-[9px] font-bold text-[#939084] uppercase tracking-widest">ms avg</span>
            </div>
          </div>
          <div className="mt-6 pt-4 border-t border-[#eceae3]">
            <span className="text-[9px] font-bold text-[#36342e] uppercase tracking-widest opacity-40">Mean Processing Latency</span>
          </div>
        </div>

        <div className="bg-[#fffefb] border border-[#c5c0b1] rounded-[4px] p-6 flex flex-col justify-between group hover:border-[#ef4444]/20 transition-colors">
          <div>
            <div className="flex justify-between items-start mb-4">
               <span className="text-[11px] font-bold text-[#ef4444] uppercase tracking-widest">System Errors</span>
               <div className="p-1.5 rounded-full bg-[#ef4444]/5 text-[#ef4444]">
                 <AlertTriangle size={16} />
               </div>
            </div>
            <div className="flex items-baseline gap-2">
              <h2 className="text-4xl font-bold tracking-tighter text-[#ef4444] leading-none">{formatNumber(stats?.errorHits)}</h2>
              <span className="text-[9px] font-bold text-[#ef4444] uppercase tracking-widest opacity-40">Failures</span>
            </div>
          </div>
          <div className="mt-6 pt-4 border-t border-[#eceae3]">
            <span className="text-[9px] font-bold text-[#ef4444] uppercase tracking-widest opacity-40">Active Exception Velocity</span>
          </div>
        </div>
      </div>

      {/* Divided Chart Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Success Throughput */}
        <div className="bg-[#fffefb] border border-[#c5c0b1] rounded-[5px] overflow-hidden">
          <div className="p-6 border-b border-[#eceae3] flex items-center justify-between bg-technical-grid bg-[length:20px_20px]">
            <div>
              <span className="text-[9px] font-bold text-[#ff4f00] uppercase tracking-[0.2em] block mb-1">Telemetry 01</span>
              <h3 className="text-sm font-bold uppercase tracking-tight text-[#201515]">Success Throughput</h3>
            </div>
            <div className="flex items-center gap-2">
               <div className="h-1.5 w-1.5 rounded-full bg-[#ff4f00]" />
               <span className="text-[9px] font-bold text-[#939084] uppercase tracking-widest">Active Hits</span>
            </div>
          </div>
          <div className="p-6 h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={series} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eceae3" />
                <XAxis dataKey="time" hide />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 9, fontWeight: 'bold', fill: '#c5c0b1' }}
                />
                <RechartsTooltip content={<CustomTooltip />} cursor={{ fill: '#ff4f00', opacity: 0.03 }} />
                <Bar dataKey="hits" name="Hits" fill="#ff4f00" radius={[2, 2, 0, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Error Velocity */}
        <div className="bg-[#fffefb] border border-[#c5c0b1] rounded-[5px] overflow-hidden">
          <div className="p-6 border-b border-[#eceae3] flex items-center justify-between bg-technical-grid bg-[length:20px_20px]">
            <div>
              <span className="text-[9px] font-bold text-[#ef4444] uppercase tracking-[0.2em] block mb-1">Telemetry 02</span>
              <h3 className="text-sm font-bold uppercase tracking-tight text-[#201515]">Error Velocity</h3>
            </div>
            <div className="flex items-center gap-2">
               <div className="h-1.5 w-1.5 rounded-full bg-[#ef4444]" />
               <span className="text-[9px] font-bold text-[#939084] uppercase tracking-widest">Exceptions</span>
            </div>
          </div>
          <div className="p-6 h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={series} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eceae3" />
                <XAxis dataKey="time" hide />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 9, fontWeight: 'bold', fill: '#c5c0b1' }}
                />
                <RechartsTooltip content={<CustomTooltip />} cursor={{ fill: '#ef4444', opacity: 0.03 }} />
                <Bar dataKey="errors" name="Errors" fill="#ef4444" radius={[2, 2, 0, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Critical Endpoints (Technical List) */}
      <div className="bg-[#fffefb] border border-[#c5c0b1] rounded-[5px] overflow-hidden">
        <div className="p-6 border-b border-[#eceae3] flex items-center justify-between">
           <div>
             <span className="text-[9px] font-bold text-[#939084] uppercase tracking-[0.2em] block mb-1">Resource Mapping</span>
             <h3 className="text-xl font-bold tracking-tight text-[#201515]">Top Active Endpoints</h3>
           </div>
           <Button variant="ghost" size="sm" className="text-[#ff4f00] font-bold text-[10px] hover:bg-[#ff4f00]/5 h-8">
             Full Resource Map <ArrowUpRight size={12} className="ml-1" />
           </Button>
        </div>
        <div className="px-6 pb-6 overflow-auto">
           <table className="w-full">
              <thead className="text-[#939084]">
                 <tr className="border-b border-[#eceae3]">
                    <th className="h-10 text-left font-bold text-[9px] uppercase tracking-widest">Resource Path</th>
                    <th className="h-10 text-left font-bold text-[9px] uppercase tracking-widest px-4">Throughput</th>
                    <th className="h-10 text-left font-bold text-[9px] uppercase tracking-widest px-4">Latency</th>
                    <th className="h-10 text-left font-bold text-[9px] uppercase tracking-widest px-4">Reliability</th>
                    <th className="h-10 text-right font-bold text-[9px] uppercase tracking-widest">Status</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-[#eceae3]">
                 {topEndpoints.slice(0, 5).map((row, i) => (
                    <tr key={i} className="group hover:bg-[#fffdf9] transition-colors">
                       <td className="py-3">
                          <div className="flex items-center gap-3">
                             <div className="h-8 w-8 rounded-[4px] border border-[#c5c0b1] bg-[#fffefb] flex items-center justify-center text-[#201515] group-hover:border-[#ff4f00] transition-colors">
                                <Terminal size={14} strokeWidth={1.5} />
                             </div>
                             <div>
                                <p className="font-bold text-[13px] text-[#201515] tracking-tight">{row.endpoint}</p>
                                <p className="text-[9px] text-[#939084] font-bold uppercase tracking-widest">{row.serviceName || 'External API'}</p>
                             </div>
                          </div>
                       </td>
                       <td className="py-3 px-4 font-bold text-[12px] text-[#201515]">{formatNumber(row.totalHits)} <span className="text-[9px] text-[#939084] font-medium ml-1">REQ</span></td>
                       <td className="py-3 px-4 font-bold text-[12px] text-[#201515]">{formatLatency(row.avgLatency)}</td>
                       <td className="py-3 px-4">
                          <Badge variant="outline" className="text-[8px] font-bold uppercase border-[#c5c0b1] text-[#939084]">Verified</Badge>
                       </td>
                       <td className="py-3 text-right">
                          <span className="text-[9px] font-bold text-emerald-600 border border-emerald-100 bg-emerald-50 px-2 py-0.5 rounded-[4px] uppercase">Active</span>
                       </td>
                    </tr>
                 ))}
                 {topEndpoints.length === 0 && (
                    <tr>
                       <td colSpan="5" className="py-20 text-center">
                          <div className="flex flex-col items-center gap-3 opacity-20">
                             <Layers size={48} strokeWidth={1} />
                             <p className="text-sm font-bold uppercase tracking-widest">No active traffic detected</p>
                          </div>
                       </td>
                    </tr>
                 )}
              </tbody>
           </table>
        </div>
      </div>
    </div>
  );
}
