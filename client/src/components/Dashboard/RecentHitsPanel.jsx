import React, { useState } from 'react';
import { 
  Terminal, 
  Clock, 
  Globe, 
  Cpu, 
  ShieldCheck, 
  AlertCircle,
  Activity,
  ArrowRight,
  Search
} from 'lucide-react';
import { formatLatency } from '../../utils.js';
import { cn } from '@/lib/utils';

export default function RecentHitsPanel({ hits = [], loading, filters, setFilters }) {
  const [localFilters, setLocalFilters] = useState(filters);

  if (loading && hits.length === 0) {
    return (
      <div className="p-12 flex flex-col items-center justify-center gap-4 opacity-50">
        <Activity className="h-8 w-8 animate-pulse text-[#ff4f00]" />
        <p className="text-[10px] font-bold uppercase tracking-widest text-[#939084]">Synchronizing Live Feed...</p>
      </div>
    );
  }

  const handleApply = () => {
    setFilters(localFilters);
  };

  return (
    <div className="p-6 space-y-6 max-w-[1400px] mx-auto bg-[#fffefb] min-h-full">
      {/* Header */}
      <div className="flex flex-col gap-0.5 mb-4 border-l-2 border-[#ff4f00] pl-4">
        <h1 className="text-2xl font-bold tracking-tighter text-[#201515]">Live Request Explorer</h1>
        <p className="text-[13px] font-medium text-[#36342e] max-w-2xl opacity-70">
           Real-time inspection of inbound packets across your distributed infrastructure.
        </p>
      </div>

      {/* Search Toolbar (NEW) */}
      <div className="flex flex-wrap gap-4 items-center bg-[#fcfcfc] border border-[#c5c0b1] p-4 rounded-[4px]">
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#939084]" size={14} />
            <input 
              type="text" 
              placeholder="Search Endpoint (e.g. /users)" 
              value={localFilters.endpoint || ''}
              onChange={(e) => setLocalFilters({ ...localFilters, endpoint: e.target.value })}
              className="w-full bg-[#fffefb] border border-[#c5c0b1] rounded-[2px] py-2 pl-9 pr-4 text-[12px] font-bold placeholder:text-[#939084] focus:border-[#ff4f00] outline-none transition-colors"
            />
          </div>
        </div>
        <div className="w-[180px]">
          <div className="relative">
            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-[#939084]" size={14} />
            <input 
              type="text" 
              placeholder="Filter IP" 
              value={localFilters.ip || ''}
              onChange={(e) => setLocalFilters({ ...localFilters, ip: e.target.value })}
              className="w-full bg-[#fffefb] border border-[#c5c0b1] rounded-[2px] py-2 pl-9 pr-4 text-[12px] font-bold placeholder:text-[#939084] focus:border-[#ff4f00] outline-none transition-colors"
            />
          </div>
        </div>
        <button 
          onClick={handleApply}
          className="bg-[#201515] text-[#fffefb] px-6 h-9 rounded-[2px] text-[10px] font-bold uppercase tracking-widest hover:bg-[#ff4f00] transition-colors border border-[#201515] hover:border-[#ff4f00]"
        >
          Execute Filter
        </button>
      </div>

      <div className="bg-[#fffefb] border border-[#c5c0b1] rounded-[4px] overflow-hidden">
        <div className="p-4 border-b border-[#eceae3] bg-[#fcfcfc] flex items-center justify-between">
           <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#201515]">Live Pipeline Active</span>
           </div>
           <span className="text-[9px] font-bold text-[#939084] uppercase tracking-widest">Displaying Last 50 Events</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#fffefb] border-b border-[#eceae3]">
                <th className="py-3 px-4 text-[10px] font-bold uppercase tracking-widest text-[#939084]">Timestamp</th>
                <th className="py-3 px-4 text-[10px] font-bold uppercase tracking-widest text-[#939084]">Method</th>
                <th className="py-3 px-4 text-[10px] font-bold uppercase tracking-widest text-[#939084]">Endpoint</th>
                <th className="py-3 px-4 text-[10px] font-bold uppercase tracking-widest text-[#939084]">Status</th>
                <th className="py-3 px-4 text-[10px] font-bold uppercase tracking-widest text-[#939084]">Latency</th>
                <th className="py-3 px-4 text-[10px] font-bold uppercase tracking-widest text-[#939084]">Origin (IP)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#eceae3]">
              {hits.map((hit, i) => (
                <tr key={hit._id || i} className="group hover:bg-[#fffdf9] transition-colors">
                  <td className="py-4 px-4 font-mono text-[11px] text-[#36342e]">
                    {new Date(hit.timestamp).toLocaleTimeString()}
                  </td>
                  <td className="py-4 px-4">
                    <span className={cn(
                      "px-2 py-0.5 rounded-[2px] text-[10px] font-bold uppercase",
                      hit.method === 'GET' ? "bg-blue-50 text-blue-700 border border-blue-100" :
                      hit.method === 'POST' ? "bg-emerald-50 text-emerald-700 border border-emerald-100" :
                      hit.method === 'DELETE' ? "bg-red-50 text-red-700 border border-red-100" :
                      "bg-amber-50 text-amber-700 border border-amber-100"
                    )}>
                      {hit.method}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                       <Terminal size={12} className="text-[#939084]" />
                       <span className="text-[13px] font-bold text-[#201515] tracking-tight">{hit.endpoint}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className={cn(
                      "font-mono text-[12px] font-bold",
                      hit.statusCode >= 500 ? "text-red-600" :
                      hit.statusCode >= 400 ? "text-amber-600" :
                      "text-emerald-600"
                    )}>
                      {hit.statusCode}
                    </span>
                  </td>
                  <td className="py-4 px-4 font-bold text-[12px] text-[#36342e]">
                    {formatLatency(hit.latencyMs)}
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2 text-[#939084]">
                       <Globe size={12} />
                       <span className="text-[11px] font-mono tracking-tight">{hit.ip || '0.0.0.0'}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {hits.length === 0 && !loading && (
            <div className="p-20 flex flex-col items-center justify-center gap-4 text-center">
               <AlertCircle className="h-12 w-12 text-[#c5c0b1] stroke-[1px]" />
               <div>
                  <p className="text-sm font-bold text-[#201515] uppercase tracking-widest">No Packet History</p>
                  <p className="text-[11px] text-[#939084] mt-1">Start sending traffic to your API to see live telemetry.</p>
               </div>
            </div>
          )}
        </div>
      </div>

      {/* Technical Footnote */}
      <div className="bg-[#201515] rounded-[4px] p-6 text-[#fffefb] flex items-center justify-between">
         <div className="flex items-center gap-4">
            <div className="h-10 w-10 rounded-full border border-white/20 flex items-center justify-center">
               <Cpu size={20} className="text-[#ff4f00]" />
            </div>
            <div>
               <p className="text-xs font-bold uppercase tracking-[0.2em]">Data Source: MongoDB Primary</p>
               <p className="text-[10px] text-[#939084] font-medium">This view pulls high-fidelity raw data from the historical log database.</p>
            </div>
         </div>
         <ShieldCheck size={24} className="opacity-20" />
      </div>
    </div>
  );
}
