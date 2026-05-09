import React from 'react';
import { 
  Bell, 
  Settings, 
  HelpCircle,
  Cpu,
  Server
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function DashboardHeader({ profile }) {
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
