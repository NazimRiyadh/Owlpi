import React, { useState } from 'react';
import { 
  Terminal, 
  Copy, 
  Check, 
  Code2, 
  Cpu, 
  Globe, 
  ShieldCheck,
  ArrowUpRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function DocumentationPanel() {
  const [copied, setCopied] = useState(null);

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="p-8 max-w-[1200px] mx-auto bg-[#fffefb] min-h-full">
      {/* Header Area */}
      <div className="flex flex-col gap-0.5 mb-12 border-l-2 border-[#ff4f00] pl-4">
        <h1 className="text-2xl font-bold tracking-tighter text-[#201515]">Technical Reference</h1>
        <p className="text-[13px] font-medium text-[#939084] max-w-2xl opacity-70">
          Core ingestion endpoints and protocol specifications for your infrastructure.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left Column: Endpoints */}
        <div className="space-y-8">
          <div>
            <h3 className="text-[10px] font-bold text-[#ff4f00] uppercase tracking-[0.3em] mb-6">Ingestion Endpoints</h3>
            <div className="space-y-4">
              {[
                { label: 'Production Ingest', url: 'https://owlpi.app/api/hit', method: 'POST' },
                { label: 'Latency Test', url: 'https://owlpi.app/api/ping', method: 'GET' }
              ].map((ep, i) => (
                <div key={i} className="group p-4 border border-[#c5c0b1] rounded-[4px] hover:border-[#ff4f00] transition-colors bg-[#fcfcfc]/50">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[11px] font-bold text-[#201515] uppercase tracking-wider">{ep.label}</span>
                    <span className="text-[9px] font-bold text-[#ff4f00] bg-[#ff4f00]/5 px-2 py-0.5 rounded-[2px]">{ep.method}</span>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <code className="text-[12px] font-mono text-[#939084] truncate">{ep.url}</code>
                    <button onClick={() => copyToClipboard(ep.url, ep.label)} className="text-[#c5c0b1] hover:text-[#ff4f00] transition-colors">
                      {copied === ep.label ? <Check size={14} /> : <Copy size={14} />}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 bg-[#201515] rounded-[4px] text-white">
            <h4 className="text-[10px] font-bold text-[#ff4f00] uppercase tracking-[0.3em] mb-4">Auth Header Specification</h4>
            <div className="font-mono text-[13px] text-white/80 space-y-2">
               <p>x-api-key: <span className="text-emerald-400">YOUR_SECURE_KEY</span></p>
               <p>Content-Type: <span className="text-emerald-400">application/json</span></p>
            </div>
          </div>
        </div>

        {/* Right Column: Schema */}
        <div>
           <h3 className="text-[10px] font-bold text-[#939084] uppercase tracking-[0.3em] mb-6">Payload Schema</h3>
           <div className="bg-[#1a1a1a] rounded-[4px] border border-[#201515] overflow-hidden">
              <div className="px-4 py-2 border-b border-white/5 bg-[#201515] flex justify-between items-center">
                 <span className="text-[9px] font-bold text-white/20 uppercase tracking-widest">application/json</span>
                 <Code2 size={12} className="text-white/20" />
              </div>
              <div className="p-6 font-mono text-[13px] leading-relaxed">
                 <pre className="text-white/40 italic mb-4">{"{"}</pre>
                 <pre className="text-white">  <span className="text-[#939084]">"serviceName":</span> <span className="text-emerald-400">"auth-svc"</span>,</pre>
                 <pre className="text-white">  <span className="text-[#939084]">"endpoint":</span> <span className="text-emerald-400">"/login"</span>,</pre>
                 <pre className="text-white">  <span className="text-[#939084]">"method":</span> <span className="text-emerald-400">"POST"</span>,</pre>
                 <pre className="text-white">  <span className="text-[#939084]">"statusCode":</span> <span className="text-white">200</span>,</pre>
                 <pre className="text-white">  <span className="text-[#939084]">"latencyMs":</span> <span className="text-white">124</span></pre>
                 <pre className="text-white/40 italic">{"}"}</pre>
              </div>
           </div>

           <div className="mt-8 flex flex-col gap-4">
              <div className="flex items-center gap-3 p-4 border border-dashed border-[#c5c0b1] rounded-[4px]">
                 <ShieldCheck size={18} className="text-[#ff4f00]" />
                 <div>
                    <p className="text-[11px] font-bold text-[#201515] uppercase">Security Note</p>
                    <p className="text-[10px] text-[#939084]">Keys are encrypted at rest. Never expose your API key in client-side code.</p>
                 </div>
              </div>
           </div>
        </div>
      </div>

      {/* Footer Meta */}
      <div className="mt-20 pt-8 border-t border-[#eceae3] flex justify-between items-center opacity-40">
        <div className="flex gap-6">
           <span className="text-[9px] font-bold text-[#201515] uppercase tracking-widest">Protocol v1.2.0</span>
           <span className="text-[9px] font-bold text-[#201515] uppercase tracking-widest">Global Ingestion: active</span>
        </div>
        <div className="flex items-center gap-2 text-[9px] font-bold text-[#201515] uppercase tracking-widest">
           Full API Spec <ArrowUpRight size={10} />
        </div>
      </div>
    </div>
  );
}
