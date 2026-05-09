import React, { useState, useEffect, useMemo } from 'react';
import { 
  Users, 
  UserPlus, 
  ShieldCheck, 
  ShieldAlert, 
  Trash2, 
  Mail, 
  Key,
  Shield,
  RefreshCw,
  MoreVertical,
  Activity,
  CheckCircle2,
  AlertCircle,
  Building2,
  UserCheck,
  UserPlus2,
  Search,
  Filter,
  X
} from 'lucide-react';
import { apiRequest } from '../../api.js';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export default function TeamPanel({ profile }) {
  const [activeTab, setActiveTab] = useState('roster'); // 'roster' or 'provisioning'
  const [users, setUsers] = useState([]);
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [newUser, setNewUser] = useState({ username: '', email: '', password: '', role: 'client_viewer' });
  const [loading, setLoading] = useState(false);
  const [fetchingUsers, setFetchingUsers] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  
  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all'); // 'all', 'client_admin', 'client_viewer'

  const isSuperAdmin = profile?.role === 'super_admin';
  const isSystemAdmin = profile?.role === 'system_admin';
  const hasFullAccess = isSuperAdmin || isSystemAdmin;

  const activeClientId = hasFullAccess ? (selectedClient?._id || selectedClient?.id) : profile?.clientId;

  useEffect(() => {
    if (hasFullAccess) {
      fetchClients();
    } else if (profile?.clientId) {
      fetchUsers(profile.clientId);
    }
  }, []);

  const fetchClients = async () => {
    try {
      const response = await apiRequest('/api/admin/clients');
      const clientList = response.data || [];
      setClients(clientList);
      if (clientList.length > 0 && !selectedClient && hasFullAccess) {
        selectClient(clientList[0]);
      }
    } catch (err) {
      console.error('Failed to fetch organizations:', err);
    }
  };

  const fetchUsers = async (id) => {
    if (!id) return;
    setFetchingUsers(true);
    setUsers([]);
    try {
      const response = await apiRequest(`/api/admin/clients/${id}/users`);
      setUsers(response.data || []);
    } catch (err) {
      console.error('Failed to fetch team roster:', err);
    } finally {
      setFetchingUsers(false);
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    if (!activeClientId) {
      setError('Select an organization first.');
      return;
    }
    setLoading(true); setMessage(''); setError('');
    try {
      await apiRequest(`/api/admin/clients/${activeClientId}/users`, {
        method: 'POST',
        body: JSON.stringify(newUser)
      });
      setMessage('Member added successfully.');
      setNewUser({ username: '', email: '', password: '', role: 'client_viewer' });
      fetchUsers(activeClientId);
      setActiveTab('roster');
    } catch (err) {
      // Extract detailed validation errors if available
      const detailedError = err.payload?.errors?.[0] || err.message;
      setError(detailedError);
    } finally {
      setLoading(false);
    }
  };

  const selectClient = (client) => {
    setSelectedClient(client);
    fetchUsers(client._id || client.id);
    setMessage('');
    setError('');
  };

  // Filtered Roster Logic
  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesSearch = 
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesRole = roleFilter === 'all' || user.role === roleFilter;
      
      return matchesSearch && matchesRole;
    });
  }, [users, searchTerm, roleFilter]);

  const getRoleBadge = (role) => {
    const isAdmin = role === 'client_admin';
    return (
      <Badge className={cn(
        "rounded-[4px] px-1.5 py-0.5 font-bold uppercase text-[8px] border shadow-none",
        isAdmin ? "bg-[#ff4f00]/5 text-[#ff4f00] border-[#ff4f00]/20" : "bg-emerald-50 text-emerald-700 border-emerald-100"
      )}>
        {isAdmin ? 'Admin' : 'Viewer'}
      </Badge>
    );
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
      <div className="flex border-b border-[#c5c0b1] bg-[#fffefb] sticky top-0 z-10">
        <TabButton id="roster" label="Member List" icon={UserCheck} />
        <TabButton id="provisioning" label="Add New Member" icon={UserPlus2} />
      </div>

      <div className="p-6 space-y-6 overflow-y-auto flex-1 scrollbar-hide">
        <div className="flex flex-col gap-0.5 border-l-2 border-[#ff4f00] pl-4">
          <h1 className="text-2xl font-bold tracking-tighter text-[#201515]">
             {activeTab === 'roster' ? 'Team Management' : 'Add New Member'}
          </h1>
          <p className="text-[12px] font-medium text-[#939084] max-w-2xl">
            {activeTab === 'roster'
              ? 'Search and manage existing team members and their roles.'
              : 'Add a new member to the organization and set their access level.'}
          </p>
        </div>

        {(message || error) && (
          <div className={cn(
            "px-4 py-2 rounded-[4px] border flex items-center gap-3 transition-all",
            message ? "bg-emerald-50 border-emerald-200 text-emerald-800" : "bg-red-50 border-red-200 text-red-800"
          )}>
            {message ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
            <span className="text-[10px] font-bold uppercase tracking-tight">{message || error}</span>
          </div>
        )}

        {hasFullAccess && (
          <div className="bg-[#fffefb] border border-[#c5c0b1] rounded-[5px] p-3 flex items-center gap-4 overflow-x-auto">
             <span className="text-[8px] font-bold text-[#939084] uppercase tracking-widest whitespace-nowrap">Selected Organization:</span>
             <div className="flex items-center gap-2">
                {clients.map(client => {
                  const isSelected = (selectedClient?._id === client._id || selectedClient?.id === client.id);
                  return (
                    <button 
                      key={client._id || client.id}
                      onClick={() => selectClient(client)}
                      className={cn(
                        "px-2.5 py-1 rounded-[4px] border text-[10px] font-bold uppercase transition-all whitespace-nowrap",
                        isSelected 
                          ? "bg-[#201515] text-white border-[#201515]" 
                          : "bg-white text-[#201515] border-[#c5c0b1] hover:text-[#ff4f00] hover:border-[#ff4f00]"
                      )}
                    >
                       {client.name}
                    </button>
                  );
                })}
             </div>
          </div>
        )}

        {activeTab === 'roster' ? (
          <div className="space-y-4">
            {/* Search & Filter Command Bar */}
            <div className="flex flex-col md:flex-row gap-3">
              <div className="relative flex-1 group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#939084] group-focus-within:text-[#ff4f00] transition-colors" />
                <Input 
                  placeholder="Search by name or email..." 
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
              <div className="flex items-center gap-2 bg-[#fffefb] border border-[#c5c0b1] rounded-[4px] p-1 h-9">
                 <button 
                  onClick={() => setRoleFilter('all')}
                  className={cn(
                    "px-3 h-full rounded-[2px] text-[9px] font-bold uppercase transition-all",
                    roleFilter === 'all' ? "bg-[#201515] text-white" : "text-[#939084] hover:text-[#201515]"
                  )}
                 >All</button>
                 <button 
                  onClick={() => setRoleFilter('client_admin')}
                  className={cn(
                    "px-3 h-full rounded-[2px] text-[9px] font-bold uppercase transition-all",
                    roleFilter === 'client_admin' ? "bg-[#ff4f00] text-white" : "text-[#939084] hover:text-[#201515]"
                  )}
                 >Admins</button>
                 <button 
                  onClick={() => setRoleFilter('client_viewer')}
                  className={cn(
                    "px-3 h-full rounded-[2px] text-[9px] font-bold uppercase transition-all",
                    roleFilter === 'client_viewer' ? "bg-emerald-600 text-white" : "text-[#939084] hover:text-[#201515]"
                  )}
                 >Viewers</button>
              </div>
            </div>

            <div className="bg-[#fffefb] border border-[#c5c0b1] rounded-[5px] overflow-hidden">
              <div className="p-4 border-b border-[#eceae3] flex items-center justify-between bg-[#fcfcfc]">
                <h3 className="text-[11px] font-bold uppercase tracking-widest text-[#201515]">
                   Member Roster
                   {searchTerm && <span className="ml-2 text-[#939084] font-medium lowercase italic"> — found {filteredUsers.length} matches</span>}
                </h3>
                <div className="flex items-center gap-2">
                   <Badge className="bg-[#eceae3] text-[#201515] border-none rounded-[4px] font-bold text-[9px] px-2 py-0.5">{filteredUsers.length} Result{filteredUsers.length !== 1 ? 's' : ''}</Badge>
                   <Button variant="ghost" size="icon" className={cn("h-6 w-6 text-[#939084] hover:text-[#ff4f00]", fetchingUsers && "animate-spin")} onClick={() => fetchUsers(activeClientId)}>
                      <RefreshCw size={12} />
                   </Button>
                </div>
              </div>
              <div className="px-4 pb-4 overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#eceae3]">
                      <th className="h-8 text-left font-bold text-[8px] uppercase tracking-widest text-[#939084]">Member</th>
                      <th className="h-8 text-left font-bold text-[8px] uppercase tracking-widest text-[#939084] px-4">ID</th>
                      <th className="h-8 text-left font-bold text-[8px] uppercase tracking-widest text-[#939084] px-4">Role</th>
                      <th className="h-8 text-right font-bold text-[8px] uppercase tracking-widest text-[#939084]">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#eceae3]">
                    {filteredUsers.map(user => (
                      <tr key={user._id || user.id} className="group hover:bg-[#fffdf9] transition-colors">
                        <td className="py-2">
                          <div className="flex items-center gap-3">
                            <div className="h-7 w-7 rounded-[4px] border border-[#c5c0b1] bg-[#fffefb] flex items-center justify-center text-[#201515] font-bold text-[9px] uppercase group-hover:border-[#ff4f00] transition-colors">
                              {user.username.substring(0, 2)}
                            </div>
                            <div>
                               <p className="font-bold text-[12px] text-[#201515] tracking-tight leading-tight group-hover:text-[#ff4f00] transition-colors">{user.username}</p>
                               <p className="text-[9px] text-[#939084] font-medium">{user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-2 px-4">
                          <code className="text-[9px] text-[#939084] font-mono">{user._id || user.id}</code>
                        </td>
                        <td className="py-2 px-4">
                          {getRoleBadge(user.role)}
                        </td>
                        <td className="py-2 text-right">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-6 w-6 text-[#939084] hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                             <Trash2 size={10} />
                          </Button>
                        </td>
                      </tr>
                    ))}
                    {filteredUsers.length === 0 && !fetchingUsers && (
                      <tr>
                         <td colSpan="4" className="py-20 text-center">
                            <div className="flex flex-col items-center gap-2 opacity-30">
                               <Search size={32} />
                               <p className="text-[10px] font-bold uppercase tracking-widest">No members match your criteria</p>
                               {searchTerm && <Button variant="ghost" size="sm" onClick={() => setSearchTerm('')} className="text-[9px] font-bold uppercase mt-2 h-7 underline decoration-[#ff4f00] underline-offset-4">Clear Search</Button>}
                            </div>
                         </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-lg">
            <div className="bg-[#fffefb] border border-[#c5c0b1] rounded-[5px] overflow-hidden">
              <div className="p-5 border-b border-[#eceae3] bg-[#fcfcfc]">
                <h3 className="text-[11px] font-bold uppercase tracking-widest text-[#201515]">Add New Member</h3>
                {selectedClient && <p className="text-[9px] text-[#ff4f00] font-bold mt-1 uppercase tracking-wider">Target: {selectedClient.name}</p>}
              </div>
              <div className="p-5">
                <form onSubmit={handleAddUser} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[8px] font-bold text-[#201515] uppercase tracking-widest">Username</label>
                    <Input 
                      placeholder="username" 
                      required 
                      className="bg-transparent border-[#c5c0b1] rounded-[4px] focus:border-[#ff4f00] h-8 text-[11px]"
                      value={newUser.username} 
                      onChange={e => setNewUser({...newUser, username: e.target.value})} 
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[8px] font-bold text-[#201515] uppercase tracking-widest">Email</label>
                    <Input 
                      type="email" 
                      placeholder="user@owlpi.app" 
                      required 
                      className="bg-transparent border-[#c5c0b1] rounded-[4px] focus:border-[#ff4f00] h-8 text-[11px]"
                      value={newUser.email} 
                      onChange={e => setNewUser({...newUser, email: e.target.value})} 
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[8px] font-bold text-[#201515] uppercase tracking-widest">Initial Password</label>
                    <Input 
                      type="password" 
                      placeholder="••••••••" 
                      required 
                      className="bg-transparent border-[#c5c0b1] rounded-[4px] focus:border-[#ff4f00] h-8 text-[11px]"
                      value={newUser.password} 
                      onChange={e => setNewUser({...newUser, password: e.target.value})} 
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[8px] font-bold text-[#201515] uppercase tracking-widest">Role</label>
                    <select 
                      value={newUser.role} 
                      onChange={e => setNewUser({...newUser, role: e.target.value})}
                      className="flex h-8 w-full rounded-[4px] border border-[#c5c0b1] bg-transparent px-3 py-1 text-[11px] font-bold transition-colors focus:border-[#ff4f00] outline-none"
                    >
                      <option value="client_viewer">Viewer</option>
                      <option value="client_admin">Administrator</option>
                    </select>
                  </div>
                  <Button type="submit" disabled={loading || !activeClientId} variant="zapier" className="w-full h-9 rounded-[4px] font-bold uppercase tracking-tight text-[10px]">
                    {loading ? 'Adding...' : 'Add Member'}
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
