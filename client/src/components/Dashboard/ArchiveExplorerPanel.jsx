import React, { useState } from 'react';
import { 
  Database, 
  Clock, 
  Globe, 
  Cpu, 
  ShieldCheck, 
  AlertCircle,
  Search,
  ArrowRight,
  Terminal,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Download,
  Filter
} from 'lucide-react';
import { formatLatency } from '../../utils.js';
import { cn } from '@/lib/utils';

export default function ArchiveExplorerPanel({ 
  hits = [], 
  loading, 
  filters, 
  setFilters, 
  pagination = { total: 0, page: 1, limit: 50, pages: 1 },
  setPage
}) {
  const [localFilters, setLocalFilters] = useState(filters);

  const handleApply = () => {
    setFilters(localFilters);
  };

  return (
    <div className="p-6 space-y-6 max-w-[1400px] mx-auto bg-[#fffefb] min-h-full pb-20">
      {/* Header */}
      <div className="flex flex-col gap-0.5 mb-4 border-l-2 border-[#201515] pl-4">
        <h1 className="text-2xl font-black tracking-tighter text-[#201515] uppercase">Historical Archive Explorer</h1>
        <p className="text-[13px] font-medium text-[#36342e] max-w-2xl opacity-70">
           Perform deep forensics across your entire telemetry history. Access millions of stored packets.
        </p>
      </div>

      {/* Advanced Filter Command Center */}
      <div className="bg-[#fcfcfc] border border-[#c5c0b1] rounded-[4px] p-6 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-[#eceae3] pb-4">
           <div className="flex items-center gap-2">
              <Filter size={14} className="text-[#ff4f00]" />
              <span className="text-[10px] font-black text-[#201515] uppercase tracking-[0.3em]">Advanced Forensics Filter</span>
           </div>
           <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Calendar size={12} className="text-[#939084]" />
                <input 
                  type="datetime-local" 
                  value={localFilters.startTime || ''}
                  onChange={(e) => setLocalFilters({ ...localFilters, startTime: e.target.value })}
                  className="bg-transparent border-none text-[10px] font-bold text-[#201515] outline-none"
                />
              </div>
              <span className="text-[#c5c0b1]">—</span>
              <div className="flex items-center gap-2">
                <input 
                  type="datetime-local" 
                  value={localFilters.endTime || ''}
                  onChange={(e) => setLocalFilters({ ...localFilters, endTime: e.target.value })}
                  className="bg-transparent border-none text-[10px] font-bold text-[#201515] outline-none"
                />
              </div>
           </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-1.5">
            <label className="text-[9px] font-bold text-[#939084] uppercase tracking-widest text-left block">Resource Path</label>
            <div className="relative">
              <Terminal className="absolute left-3 top-1/2 -translate-y-1/2 text-[#c5c0b1]" size={12} />
              <input 
                type="text" 
                placeholder="/api/v1/..." 
                value={localFilters.endpoint || ''}
                onChange={(e) => setLocalFilters({ ...localFilters, endpoint: e.target.value })}
                className="w-full bg-[#fffefb] border border-[#c5c0b1] rounded-[2px] py-2 pl-9 text-[11px] font-bold placeholder:text-[#c5c0b1] focus:border-[#ff4f00] outline-none transition-colors"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[9px] font-bold text-[#939084] uppercase tracking-widest text-left block">Service Identity</label>
            <div className="relative">
              <Cpu className="absolute left-3 top-1/2 -translate-y-1/2 text-[#c5c0b1]" size={12} />
              <input 
                type="text" 
                placeholder="e.g. auth-srv" 
                value={localFilters.serviceName || ''}
                onChange={(e) => setLocalFilters({ ...localFilters, serviceName: e.target.value })}
                className="w-full bg-[#fffefb] border border-[#c5c0b1] rounded-[2px] py-2 pl-9 text-[11px] font-bold placeholder:text-[#c5c0b1] focus:border-[#ff4f00] outline-none transition-colors"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[9px] font-bold text-[#939084] uppercase tracking-widest text-left block">HTTP Method</label>
            <select 
              value={localFilters.method || ''}
              onChange={(e) => setLocalFilters({ ...localFilters, method: e.target.value })}
              className="w-full bg-[#fffefb] border border-[#c5c0b1] rounded-[2px] py-2 px-3 text-[11px] font-bold focus:border-[#ff4f00] outline-none transition-colors appearance-none cursor-pointer"
            >
              <option value="">ANY METHOD</option>
              {['GET', 'POST', 'PUT', 'DELETE', 'PATCH'].map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-[9px] font-bold text-[#939084] uppercase tracking-widest text-left block">Status Code</label>
            <input 
              type="text" 
              placeholder="e.g. 500" 
              value={localFilters.statusCode || ''}
              onChange={(e) => setLocalFilters({ ...localFilters, statusCode: e.target.value })}
              className="w-full bg-[#fffefb] border border-[#c5c0b1] rounded-[2px] py-2 px-3 text-[11px] font-bold placeholder:text-[#c5c0b1] focus:border-[#ff4f00] outline-none transition-colors"
            />
          </div>
        </div>

        <div className="flex justify-between items-center pt-4">
           <button 
             onClick={() => setLocalFilters({})}
             className="text-[9px] font-bold text-[#939084] uppercase tracking-widest hover:text-[#201515] transition-colors"
           >
             Reset Forensics
           </button>
           <button 
             onClick={handleApply}
             className="bg-[#201515] text-white px-10 h-10 rounded-[2px] text-[10px] font-black uppercase tracking-widest hover:bg-[#ff4f00] transition-all flex items-center gap-2 shadow-xl shadow-[#201515]/10"
           >
             Search Archive <Search size={14} />
           </button>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="bg-[#fffefb] border border-[#c5c0b1] rounded-[4px] overflow-hidden">
        <div className="p-4 border-b border-[#eceae3] bg-[#fcfcfc] flex items-center justify-between">
           <div className="flex items-center gap-2">
              <Database size={14} className="text-[#939084]" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#201515]">Archive Results: {pagination.total.toLocaleString()} Records Found</span>
           </div>
           <button className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-widest text-[#939084] hover:text-[#ff4f00] transition-colors">
              <Download size={12} /> Export CSV
           </button>
        </div>

        <div className="overflow-x-auto min-h-[400px]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#fffefb] border-b border-[#eceae3]">
                <th className="py-3 px-4 text-[10px] font-bold uppercase tracking-widest text-[#939084]">Timestamp</th>
                <th className="py-3 px-4 text-[10px] font-bold uppercase tracking-widest text-[#939084]">Service</th>
                <th className="py-3 px-4 text-[10px] font-bold uppercase tracking-widest text-[#939084]">Method</th>
                <th className="py-3 px-4 text-[10px] font-bold uppercase tracking-widest text-[#939084]">Endpoint</th>
                <th className="py-3 px-4 text-[10px] font-bold uppercase tracking-widest text-[#939084]">Status</th>
                <th className="py-3 px-4 text-[10px] font-bold uppercase tracking-widest text-[#939084]">Latency</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#eceae3]">
              {hits.map((hit, i) => (
                <tr key={hit._id || i} className="group hover:bg-[#fffdf9] transition-colors">
                  <td className="py-4 px-4 font-mono text-[11px] text-[#36342e]">
                    {new Date(hit.timestamp).toLocaleString()}
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-[11px] font-bold text-[#201515] bg-[#eceae3] px-1.5 py-0.5 rounded-[2px]">{hit.serviceName}</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className={cn(
                      "px-2 py-0.5 rounded-[2px] text-[10px] font-bold uppercase",
                      hit.method === 'GET' ? "bg-blue-50 text-blue-700" :
                      hit.method === 'POST' ? "bg-emerald-50 text-emerald-700" :
                      hit.method === 'DELETE' ? "bg-red-50 text-red-700" :
                      "bg-amber-50 text-amber-700"
                    )}>
                      {hit.method}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                     <span className="text-[12px] font-bold text-[#201515] tracking-tight">{hit.endpoint}</span>
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
                </tr>
              ))}
            </tbody>
          </table>

          {hits.length === 0 && !loading && (
            <div className="p-20 flex flex-col items-center justify-center gap-4 text-center">
               <AlertCircle className="h-12 w-12 text-[#c5c0b1] stroke-[1px]" />
               <div>
                  <p className="text-sm font-bold text-[#201515] uppercase tracking-widest">No Historical Data</p>
                  <p className="text-[11px] text-[#939084] mt-1">Adjust your filters or date range to find stored telemetry.</p>
               </div>
            </div>
          )}

          {loading && (
             <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] flex items-center justify-center z-10">
                <div className="flex flex-col items-center gap-2">
                   <div className="h-6 w-6 border-2 border-[#ff4f00] border-t-transparent animate-spin rounded-full" />
                   <span className="text-[9px] font-black uppercase tracking-widest text-[#ff4f00]">Querying Archive...</span>
                </div>
             </div>
          )}
        </div>

        {/* Pagination Controls */}
        <div className="p-4 border-t border-[#eceae3] bg-[#fcfcfc] flex items-center justify-between">
           <div className="text-[10px] font-bold text-[#939084]">
              Page <span className="text-[#201515]">{pagination.page}</span> of <span className="text-[#201515]">{pagination.pages}</span>
           </div>
           <div className="flex items-center gap-2">
              <button 
                disabled={pagination.page <= 1 || loading}
                onClick={() => setPage(pagination.page - 1)}
                className="h-8 w-8 flex items-center justify-center border border-[#c5c0b1] rounded-[2px] disabled:opacity-30 hover:border-[#ff4f00] transition-colors"
              >
                <ChevronLeft size={14} />
              </button>
              <div className="flex items-center gap-1">
                 {/* Simple page numbers */}
                 {[...Array(Math.min(5, pagination.pages))].map((_, i) => {
                    const p = i + 1;
                    return (
                      <button 
                        key={p}
                        onClick={() => setPage(p)}
                        className={cn(
                          "h-8 w-8 text-[10px] font-bold border rounded-[2px] transition-all",
                          pagination.page === p ? "bg-[#201515] text-white border-[#201515]" : "border-[#c5c0b1] text-[#939084] hover:border-[#201515]"
                        )}
                      >
                        {p}
                      </button>
                    )
                 })}
                 {pagination.pages > 5 && <span className="text-[#c5c0b1] mx-1 text-[10px]">...</span>}
              </div>
              <button 
                disabled={pagination.page >= pagination.pages || loading}
                onClick={() => setPage(pagination.page + 1)}
                className="h-8 w-8 flex items-center justify-center border border-[#c5c0b1] rounded-[2px] disabled:opacity-30 hover:border-[#ff4f00] transition-colors"
              >
                <ChevronRight size={14} />
              </button>
           </div>
        </div>
      </div>
    </div>
  );
}
