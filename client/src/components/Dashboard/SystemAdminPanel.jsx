import React, { useState } from 'react';
import { Shield, Zap, Terminal, AlertTriangle, CheckCircle2, AlertCircle } from 'lucide-react';
import { apiRequest } from '../../api.js';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

export default function SystemAdminPanel({ profile }) {
  const [systemAdminForm, setSystemAdminForm] = useState({ username: '', email: '', password: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreateSystemAdmin = async (e) => {
    e.preventDefault();
    setLoading(true); setError(''); setMessage('');
    try {
      await apiRequest('/api/auth/create-system-admin', { method: 'POST', body: JSON.stringify(systemAdminForm) });
      setMessage('System Admin created successfully!');
      setSystemAdminForm({ username: '', email: '', password: '' });
    } catch(err) { 
      const detailedError = err.payload?.errors?.[0] || err.message;
      setError(detailedError); 
    }
    finally { setLoading(false); }
  };

  return (
    <div className="p-6 space-y-6 bg-[#fffefb] min-h-full">
      {/* Header Row */}
      <div className="flex flex-col gap-0.5 mb-4 border-l-2 border-[#ff4f00] pl-4">
        <h1 className="text-2xl font-bold tracking-tighter text-[#201515]">System Administration</h1>
        <p className="text-[13px] font-medium text-[#36342e] max-w-2xl opacity-70">Manage root-level administrators for the entire platform.</p>
      </div>

      {/* Status Messages */}
      {(message || error) && (
        <div className={cn(
          "px-4 py-3 rounded-[4px] border flex items-center gap-3 transition-all",
          message ? "bg-emerald-50 border-emerald-200 text-emerald-800" : "bg-red-50 border-red-200 text-red-800"
        )}>
          {message ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
          <span className="text-xs font-bold uppercase tracking-tight">{message || error}</span>
        </div>
      )}

      <div className="max-w-[800px] mx-auto">
        <div className="bg-[#fffefb] border border-[#c5c0b1] rounded-[5px] overflow-hidden shadow-none">
          <div className="p-6 border-b border-[#eceae3] bg-technical-grid bg-[length:20px_20px]">
            <h3 className="text-xl font-bold tracking-tight text-[#201515]">Root Access Provisioning</h3>
          </div>
          <div className="p-6">
            <form onSubmit={handleCreateSystemAdmin} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                   <label className="text-[9px] font-bold text-[#201515] uppercase tracking-widest">Username</label>
                   <Input 
                    placeholder="Admin_Handle" 
                    required 
                    className="bg-transparent border-[#c5c0b1] rounded-[4px] focus:border-[#ff4f00] h-9 text-xs"
                    value={systemAdminForm.username} 
                    onChange={e => setSystemAdminForm({...systemAdminForm, username: e.target.value})} 
                  />
                </div>
                <div className="space-y-1.5">
                   <label className="text-[9px] font-bold text-[#201515] uppercase tracking-widest">Email Address</label>
                   <Input 
                    type="email" 
                    placeholder="sys@owlpi.app" 
                    required 
                    className="bg-transparent border-[#c5c0b1] rounded-[4px] focus:border-[#ff4f00] h-9 text-xs"
                    value={systemAdminForm.email} 
                    onChange={e => setSystemAdminForm({...systemAdminForm, email: e.target.value})} 
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                 <label className="text-[9px] font-bold text-[#201515] uppercase tracking-widest">Password</label>
                 <Input 
                  type="password" 
                  placeholder="••••••••" 
                  required 
                  className="bg-transparent border-[#c5c0b1] rounded-[4px] focus:border-[#ff4f00] h-9 text-xs"
                  value={systemAdminForm.password} 
                  onChange={e => setSystemAdminForm({...systemAdminForm, password: e.target.value})} 
                />
              </div>
              <div className="p-3 rounded-[4px] bg-amber-50 border border-amber-200 flex gap-3">
                 <AlertTriangle size={14} className="text-amber-700 flex-shrink-0 mt-0.5" />
                 <p className="text-[11px] text-amber-900 font-medium leading-relaxed">
                    <strong>Critical:</strong> System administrators have full read/write access to all platform clusters. Authorization should only be granted to internal infrastructure engineers.
                 </p>
              </div>
              <Button type="submit" disabled={loading} variant="zapier" className="w-full h-10 text-xs rounded-[4px] font-bold uppercase tracking-tight">
                {loading ? 'Initializing Admin...' : 'Create System Administrator'}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
