import React, { useState, useEffect, useMemo } from 'react';
import { 
  Building2, 
  Plus, 
  Trash2, 
  Key, 
  Mail, 
  Globe, 
  Shield, 
  Terminal,
  Activity,
  ArrowRight,
  ShieldCheck,
  Zap,
  CheckCircle2,
  AlertCircle,
  Search,
  ExternalLink,
  Eye,
  EyeOff,
  LayoutGrid,
  FilePlus2,
  Database,
  ArrowUpRight,
  X
} from 'lucide-react';
import { apiRequest } from '../../api.js';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export default function OrganizationPanel({ profile }) {
  const [activeTab, setActiveTab] = useState('inventory'); // 'inventory' or 'onboarding'
  const [clients, setClients] = useState([]);
  const [apiKeys, setApiKeys] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [clientForm, setClientForm] = useState({ name: '', email: '', adminUsername: '', adminPassword: '' });
  const [keyForm, setKeyForm] = useState({ name: '', environment: 'production' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchingKeys, setFetchingKeys] = useState(false);
  const [revealedKeys, setRevealedKeys] = useState(new Set());
  
  // Search State
  const [searchTerm, setSearchTerm] = useState('');

  const isSuperAdmin = profile?.role === 'super_admin';
  const isSystemAdmin = profile?.role === 'system_admin';
  const hasFullAccess = isSuperAdmin || isSystemAdmin;
  
  const activeClientId = hasFullAccess 
    ? (selectedClient?._id || selectedClient?.id) 
    : profile?.clientId;

  useEffect(() => {
    if (hasFullAccess) {
      fetchClients();
    } else if (profile?.clientId) {
      fetchApiKeys(profile.clientId);
    }
  }, []);

  const fetchClients = async () => {
    try { 
      const response = await apiRequest('/api/admin/clients'); 
      const data = response.data || [];
      setClients(data); 
      if (data.length > 0 && !selectedClient && hasFullAccess) {
        selectClient(data[0]);
      }
    } catch (err) { console.error('Fetch Clients Error:', err); }
  };

  const fetchApiKeys = async (id) => {
    if (!id) return;
    const clientId = String(id);
    if (clientId === 'undefined' || clientId === 'null') return;
    
    setFetchingKeys(true);
    setApiKeys([]); 
    try { 
      const response = await apiRequest(`/api/admin/clients/${clientId}/api/keys`); 
      setApiKeys(response.data || []); 
    } catch (err) { 
      console.error('Key Fetch Error:', err); 
      setApiKeys([]);
    } finally {
      setFetchingKeys(false);
    }
  };

  const handleCreateClient = async (e) => {
    e.preventDefault(); setLoading(true); setMessage(''); setError('');
    try {
      await apiRequest('/api/admin/clients/onboard', { method: 'POST', body: JSON.stringify(clientForm) });
      setMessage('Organization created successfully.');
      setClientForm({ name: '', email: '', adminUsername: '', adminPassword: '' });
      fetchClients();
      setActiveTab('inventory');
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  const handleCreateKey = async (e) => {
    e.preventDefault(); 
    if (!activeClientId) {
      setError('Please select an organization first.');
      return;
    }
    setLoading(true); setMessage(''); setError('');
    try {
      await apiRequest(`/api/admin/clients/${activeClientId}/api/keys`, { method: 'POST', body: JSON.stringify(keyForm) });
      setMessage('API Key generated successfully.');
      setKeyForm({ name: '', environment: 'production' });
      fetchApiKeys(activeClientId);
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  const selectClient = (client) => {
    if (!client) return;
    setSelectedClient(client);
    fetchApiKeys(client._id || client.id);
    setRevealedKeys(new Set());
    setMessage('');
    setError('');
  };

  // Filtered Clients Logic
  const filteredClients = useMemo(() => {
    return clients.filter(client => 
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [clients, searchTerm]);

  const toggleKeyVisibility = (keyId) => {
    setRevealedKeys(prev => {
      const next = new Set(prev);
      if (next.has(keyId)) next.delete(keyId);
      else next.add(keyId);
      return next;
    });
  };

  const maskKey = (key) => {
    if (!key) return '••••••••••••••••';
    if (key.length < 12) return '••••••••';
    const prefix = key.substring(0, 5);
    const suffix = key.substring(key.length - 4);
    return `${prefix}****************${suffix}`;
  };

  const TabButton = ({ id, label, icon: Icon }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={cn(
        "flex items-center gap-2 px-6 h-12 border-r border-[#c5c0b1] text-[11px] font-bold uppercase tracking-widest transition-all",
        activeTab === id 
          ? "bg-[#201515] text-white" 
          : "bg-transparent text-[#939084] hover:bg-[#eceae3] hover:text-[#201515]"
      )}
    >
      <Icon size={14} />
      {label}
    </button>
  );

  return (
    <div className="flex flex-col h-full bg-[#fffefb]">
      {/* Navigation */}
      <div className="flex border-b border-[#c5c0b1] bg-[#fffefb] sticky top-0 z-10">
        <TabButton id="inventory" label="Organization List" icon={Database} />
        {hasFullAccess && <TabButton id="onboarding" label="Add New Organization" icon={FilePlus2} />}
      </div>

      <div className="p-6 space-y-6 overflow-y-auto flex-1 scrollbar-hide">
        {/* Header */}
        <div className="flex flex-col gap-0.5 border-l-2 border-[#ff4f00] pl-4">
          <h1 className="text-2xl font-bold tracking-tighter text-[#201515]">
            {activeTab === 'inventory' ? 'Organization Management' : 'Add New Organization'}
          </h1>
          <p className="text-[12px] font-medium text-[#939084] max-w-2xl">
            {activeTab === 'inventory' 
              ? 'Manage registered organizations and their access credentials.' 
              : 'Add an organization to the system and initialize administration.'}
          </p>
        </div>

        {(message || error) && (
          <div className={cn(
            "px-4 py-2.5 rounded-[4px] border flex items-center gap-3 transition-all",
            message ? "bg-emerald-50 border-emerald-200 text-emerald-800" : "bg-red-50 border-red-200 text-red-800"
          )}>
            {message ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
            <span className="text-[11px] font-bold uppercase tracking-tight">{message || error}</span>
          </div>
        )}

        {activeTab === 'inventory' ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              {hasFullAccess && (
                <>
                  {/* Search Bar */}
                  <div className="relative group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#939084] group-focus-within:text-[#ff4f00] transition-colors" />
                    <Input 
                      placeholder="Search organizations..." 
                      className="pl-9 bg-transparent border-[#c5c0b1] focus-visible:ring-[#ff4f00] h-9 text-xs rounded-[4px]"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    {searchTerm && (
                      <button onClick={() => setSearchTerm('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#939084] hover:text-[#201515]">
                        <X size={12} />
                      </button>
                    )}
                  </div>

                  <div className="bg-[#fffefb] border border-[#c5c0b1] rounded-[5px] overflow-hidden">
                    <div className="p-4 border-b border-[#eceae3] flex items-center justify-between bg-[#fcfcfc]">
                      <h3 className="text-[11px] font-bold uppercase tracking-widest text-[#201515] flex items-center gap-2">
                         <LayoutGrid size={14} className="text-[#939084]" />
                         Organizations
                         {searchTerm && <span className="ml-2 text-[#939084] font-medium lowercase italic"> — found {filteredClients.length}</span>}
                      </h3>
                      <Badge className="bg-[#eceae3] text-[#201515] border-none rounded-[4px] font-bold text-[9px] px-2 py-0.5">{filteredClients.length} Result{filteredClients.length !== 1 ? 's' : ''}</Badge>
                    </div>
                    <div className="px-4 pb-4 overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-[#eceae3]">
                            <th className="h-10 text-left text-[9px] font-bold text-[#939084] uppercase tracking-widest">Name</th>
                            <th className="h-10 text-left text-[9px] font-bold text-[#939084] uppercase tracking-widest px-4 text-center">ID Reference</th>
                            <th className="h-10 text-right text-[9px] font-bold text-[#939084] uppercase tracking-widest">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#eceae3]">
                          {filteredClients.map(client => {
                            const clientId = client._id || client.id;
                            const selectedId = selectedClient?._id || selectedClient?.id;
                            const isSelected = selectedClient && clientId && clientId === selectedId;

                            return (
                              <tr 
                                key={clientId} 
                                onClick={() => selectClient(client)}
                                className={cn(
                                  "group transition-colors cursor-pointer",
                                  isSelected ? "bg-[#fffaf5]" : "hover:bg-[#fffdf9]/50"
                                )}
                              >
                                <td className="py-2.5">
                                  <div className="flex items-center gap-3">
                                    <div className={cn(
                                      "h-7 w-7 rounded-[4px] border flex items-center justify-center font-bold text-[9px] uppercase transition-colors",
                                      isSelected ? "border-[#ff4f00] bg-[#ff4f00] text-white" : "border-[#c5c0b1] bg-[#fffefb] text-[#201515]"
                                    )}>
                                      {client.name.substring(0, 2)}
                                    </div>
                                    <div>
                                       <p className={cn(
                                         "text-[12px] font-bold transition-colors leading-tight",
                                         isSelected ? "text-[#ff4f00]" : "text-[#201515]"
                                       )}>
                                         {client.name}
                                       </p>
                                       <p className="text-[9px] text-[#939084] font-medium">{client.email}</p>
                                    </div>
                                  </div>
                                </td>
                                <td className="py-2.5 px-4 text-center">
                                   <code className="text-[9px] text-[#939084] font-mono tracking-tight bg-[#fcfcfc] px-2 py-0.5 rounded border border-[#eceae3]">
                                      {clientId ? `${clientId.substring(0, 8)}...` : 'N/A'}
                                   </code>
                                </td>
                                <td className="py-2.5 text-right">
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    className={cn(
                                      "h-6 px-2 text-[9px] font-bold uppercase rounded-[4px]",
                                      isSelected ? "text-white bg-[#ff4f00] hover:bg-[#ff4f00]/90" : "text-[#201515] hover:text-[#ff4f00] hover:bg-[#ff4f00]/5"
                                    )}
                                  >
                                     {isSelected ? 'Active' : 'Select'}
                                  </Button>
                                </td>
                              </tr>
                            );
                          })}
                          {filteredClients.length === 0 && (
                            <tr>
                               <td colSpan="3" className="py-20 text-center">
                                  <div className="flex flex-col items-center gap-2 opacity-30">
                                     <Search size={32} />
                                     <p className="text-[10px] font-bold uppercase tracking-widest">No organizations found</p>
                                  </div>
                               </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="lg:col-span-1 space-y-6">
              <div className="bg-[#fffefb] border border-[#c5c0b1] rounded-[5px] overflow-hidden sticky top-24">
                <div className="p-4 border-b border-[#eceae3] flex items-center justify-between bg-[#fcfcfc]">
                  <h3 className="text-[11px] font-bold uppercase tracking-widest text-[#201515] flex items-center gap-2">
                     <Key size={14} className="text-[#939084]" />
                     Security Keys
                  </h3>
                  {fetchingKeys && <Activity size={12} className="animate-pulse text-[#ff4f00]" />}
                </div>
                <div className="p-4 space-y-3">
                   {apiKeys.map(apiKey => {
                     const keyId = apiKey._id || apiKey.id;
                     return (
                       <div key={keyId} className="p-3 border border-[#c5c0b1] rounded-[5px] bg-[#fffefb] group hover:border-[#ff4f00] transition-all">
                          <div className="flex items-start justify-between mb-2">
                             <div>
                                <p className="text-[11px] font-bold text-[#201515] tracking-tight leading-tight">{apiKey.name}</p>
                                <p className="text-[8px] text-[#939084] font-bold uppercase tracking-widest">{apiKey.environment}</p>
                             </div>
                             <div className="flex items-center gap-1">
                                <Button variant="ghost" size="icon" className="h-5 w-5 text-[#939084] hover:text-[#ff4f00]" onClick={(e) => { e.stopPropagation(); toggleKeyVisibility(keyId); }}>
                                   {revealedKeys.has(keyId) ? <EyeOff size={10} /> : <Eye size={10} />}
                                </Button>
                                <Button variant="ghost" size="icon" className="h-5 w-5 text-[#939084] hover:text-[#ff4f00]" onClick={(e) => {
                                   e.stopPropagation();
                                   const val = apiKey.keyValue || apiKey.key;
                                   if (val) {
                                     navigator.clipboard.writeText(val);
                                     setMessage('Credential copied.');
                                   }
                                }}>
                                   <Plus size={10} className="rotate-45" />
                                </Button>
                             </div>
                          </div>
                          <code className="text-[10px] font-mono text-[#201515] break-all font-bold block bg-[#fcfcfc] p-2 rounded border border-[#eceae3]">
                             {revealedKeys.has(keyId) 
                               ? (apiKey.keyValue || apiKey.key || 'SECRET_HIDDEN')
                               : maskKey(apiKey.keyValue || apiKey.key)}
                          </code>
                       </div>
                     );
                   })}
                   {apiKeys.length === 0 && !fetchingKeys && (
                     <div className="py-10 text-center border border-dashed border-[#eceae3] rounded-[5px]">
                        <p className="text-[9px] font-bold text-[#939084] uppercase tracking-widest opacity-40">No keys found</p>
                     </div>
                   )}
                   {fetchingKeys && (
                     <div className="py-10 text-center">
                        <Activity size={20} className="mx-auto text-[#eceae3] animate-spin" />
                     </div>
                   )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-5xl">
            <div className="bg-[#fffefb] border border-[#c5c0b1] rounded-[5px] overflow-hidden shadow-none">
              <div className="p-5 border-b border-[#eceae3] bg-[#fcfcfc]">
                <h3 className="text-[11px] font-bold uppercase tracking-widest text-[#201515]">New Organization</h3>
              </div>
              <div className="p-5">
                <form onSubmit={handleCreateClient} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[8px] font-bold text-[#201515] uppercase tracking-widest">Name</label>
                    <Input placeholder="Acme Corp" required className="bg-transparent border-[#c5c0b1] rounded-[4px] h-8 text-[11px]" value={clientForm.name} onChange={e => setClientForm({...clientForm, name: e.target.value})} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[8px] font-bold text-[#201515] uppercase tracking-widest">Email</label>
                    <Input type="email" placeholder="admin@acme.com" required className="bg-transparent border-[#c5c0b1] rounded-[4px] h-8 text-[11px]" value={clientForm.email} onChange={e => setClientForm({...clientForm, email: e.target.value})} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[8px] font-bold text-[#201515] uppercase tracking-widest">Admin Username</label>
                      <Input placeholder="admin" required className="bg-transparent border-[#c5c0b1] rounded-[4px] h-8 text-[11px]" value={clientForm.adminUsername} onChange={e => setClientForm({...clientForm, adminUsername: e.target.value})} />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[8px] font-bold text-[#201515] uppercase tracking-widest">Admin Password</label>
                      <Input type="password" placeholder="••••••••" required className="bg-transparent border-[#c5c0b1] rounded-[4px] h-8 text-[11px]" value={clientForm.adminPassword} onChange={e => setClientForm({...clientForm, adminPassword: e.target.value})} />
                    </div>
                  </div>
                  <Button type="submit" disabled={loading} variant="zapier" className="w-full h-9 rounded-[4px] font-bold uppercase tracking-tight text-[10px]">
                    {loading ? 'Adding...' : 'Add Organization'}
                  </Button>
                </form>
              </div>
            </div>

            <div className="bg-[#fffefb] border border-[#c5c0b1] rounded-[5px] overflow-hidden shadow-none">
              <div className="p-5 border-b border-[#eceae3] bg-[#fcfcfc]">
                <h3 className="text-[11px] font-bold uppercase tracking-widest text-[#201515]">New Security Key</h3>
                {selectedClient && <p className="text-[9px] text-[#ff4f00] font-bold mt-1 uppercase tracking-wider flex items-center gap-1"><ArrowUpRight size={10}/> Target: {selectedClient.name}</p>}
              </div>
              <div className="p-5">
                <form onSubmit={handleCreateKey} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[8px] font-bold text-[#201515] uppercase tracking-widest">Key Name</label>
                    <Input placeholder="Production Ingest" required className="bg-transparent border-[#c5c0b1] rounded-[4px] h-8 text-[11px]" value={keyForm.name} onChange={e => setKeyForm({...keyForm, name: e.target.value})} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[8px] font-bold text-[#201515] uppercase tracking-widest">Environment</label>
                    <select value={keyForm.environment} onChange={e => setKeyForm({...keyForm, environment: e.target.value})} className="flex h-8 w-full rounded-[4px] border border-[#c5c0b1] bg-transparent px-3 py-1 text-[10px] font-bold focus:border-[#ff4f00] outline-none">
                      <option value="production">Production</option>
                      <option value="development">Development</option>
                      <option value="staging">Staging</option>
                    </select>
                  </div>
                  <Button type="submit" disabled={loading || (!hasFullAccess && !profile?.clientId) || (hasFullAccess && !selectedClient)} variant="zapier" className="w-full h-9 rounded-[4px] font-bold uppercase tracking-tight text-[10px]">
                    {loading ? 'Generating...' : 'Issue Access Key'}
                  </Button>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
