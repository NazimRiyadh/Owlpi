import React from 'react';
import { 
  Bell, 
  Settings, 
  HelpCircle,
  Cpu,
  Server,
  Terminal,
  Timer
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function DashboardHeader({ profile, range, setRange }) {
  return (
    <header className="h-20 border-b border-[#c5c0b1] bg-[#fffefb]/80 backdrop-blur-md flex items-center justify-between px-10 z-10">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2.5">
           <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
           <span className="text-[10px] font-bold text-[#201515] uppercase tracking-[0.2em]">Live Status</span>
        </div>
        <div className="h-4 w-px bg-[#c5c0b1]" />
        <div className="flex items-center gap-2 text-[#939084]">
           <Server size={14} />
           <span className="text-[10px] font-bold uppercase tracking-widest">Platform Core</span>
        </div>
        
        <div className="h-4 w-px bg-[#c5c0b1]" />
        
        {/* Time Protocol Selector */}
        <div className="flex items-center gap-3">
          <span className="text-[9px] font-black text-[#939084] uppercase tracking-[0.2em]">Window</span>
          <div className="flex gap-1 p-0.5 bg-[#eceae3]/30 rounded-[4px] border border-[#c5c0b1]/50">
            {["1h", "24h", "7d"].map((t) => (
              <button
                key={t}
                onClick={() => setRange(t)}
                className={cn(
                  "px-3 py-1 text-[9px] font-black uppercase transition-all rounded-[2px]",
                  range === t
                    ? "bg-[#fffefb] text-[#ff4f00] shadow-sm border border-[#c5c0b1]"
                    : "text-[#939084] hover:text-[#201515]",
                )}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-8">
        <div className="flex items-center gap-3 border-r pr-8 border-[#c5c0b1]">
          <Button variant="ghost" size="icon" className="h-10 w-10 rounded-[4px] border border-[#c5c0b1] text-[#201515] hover:bg-[#eceae3] transition-colors">
            <HelpCircle size={18} />
          </Button>
          <Button variant="ghost" size="icon" className="h-10 w-10 rounded-[4px] border border-[#c5c0b1] text-[#201515] hover:bg-[#eceae3] transition-colors relative">
            <Bell size={18} />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#ff4f00] rounded-full border-2 border-[#fffefb]" />
          </Button>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-[14px] font-bold text-[#201515] leading-none tracking-tight">{profile?.username || profile?.name || 'User'}</p>
            <p className="text-[9px] font-bold text-[#939084] uppercase tracking-[0.2em] mt-1.5">
              {profile?.role === 'super_admin' ? 'Root Administrator' : 'Authorized Member'}
            </p>
          </div>
          <div className="h-11 w-11 rounded-[4px] bg-[#201515] flex items-center justify-center text-white font-bold text-xs border border-[#201515]">
            {(profile?.username || profile?.name || 'US').substring(0, 2).toUpperCase()}
          </div>
        </div>
      </div>
    </header>
  );
}
