
import React, { useState } from 'react';
import { Shield, Users, Key, Lock, Globe, Smartphone, Activity, CheckCircle2, AlertTriangle, Fingerprint, RefreshCw, UserPlus, ToggleLeft, ToggleRight, Info, Plus, Check, Settings, LogOut, Mail, Link } from 'lucide-react';

interface Role {
    id: string;
    name: string;
    description: string;
    permissions: string[];
    isSystem?: boolean;
}

interface SSOProvider {
    id: string;
    name: string;
    icon: any; // visual placeholder text or component
    protocol: string;
    enabled: boolean;
    color: string;
    textColor: string;
    instructions: string;
    clientId?: string;
    clientSecret?: string;
}

const ALL_PERMISSIONS = [
    { id: 'users:read', label: 'View Users' },
    { id: 'users:write', label: 'Manage Users' },
    { id: 'billing:read', label: 'View Billing' },
    { id: 'billing:write', label: 'Manage Billing' },
    { id: 'api:manage', label: 'Manage API Keys' },
    { id: 'system:config', label: 'System Configuration' },
    { id: 'audit:read', label: 'View Audit Logs' },
];

const BadalAuth: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'USERS' | 'ROLES' | 'SSO' | 'TOKENS' | 'SETTINGS'>('USERS');
  
  // Users State
  const [users, setUsers] = useState([
      { id: 'u1', name: 'Super Admin', email: 'root@sucksaas.com', role: 'Owner', mfa: true, status: 'Active' },
      { id: 'u2', name: 'AI Agent Fleet', email: 'fleet@sucksaas.com', role: 'Service Account', mfa: false, status: 'Active' },
      { id: 'u3', name: 'John Doe', email: 'john@client.com', role: 'Viewer', mfa: true, status: 'Suspended' },
  ]);

  // Roles State
  const [roles, setRoles] = useState<Role[]>([
      { id: 'r1', name: 'Owner', description: 'Full system access with no restrictions.', permissions: ALL_PERMISSIONS.map(p => p.id), isSystem: true },
      { id: 'r2', name: 'Admin', description: 'Can manage users and settings but cannot delete the workspace.', permissions: ['users:read', 'users:write', 'billing:read', 'billing:write', 'api:manage', 'audit:read'], isSystem: false },
      { id: 'r3', name: 'Developer', description: 'Access to API keys and configuration.', permissions: ['api:manage', 'audit:read', 'users:read'], isSystem: false },
      { id: 'r4', name: 'Viewer', description: 'Read-only access to basic dashboards.', permissions: ['users:read', 'billing:read'], isSystem: false },
  ]);
  const [selectedRole, setSelectedRole] = useState<Role>(roles[0]);

  // SSO State
  const [ssoProviders, setSsoProviders] = useState<SSOProvider[]>([
      { 
          id: 'google', name: 'Google Workspace', icon: 'G', protocol: 'OIDC / SAML 2.0', enabled: true, color: 'bg-white', textColor: 'text-slate-900',
          instructions: '1. Go to Google Cloud Console > APIs & Services.\n2. Create OAuth 2.0 Credentials.\n3. Add Authorized Redirect URI: https://id.badal.io/callback/google'
      },
      { 
          id: 'microsoft', name: 'Microsoft Entra ID', icon: 'M', protocol: 'OIDC Connect', enabled: false, color: 'bg-[#0078d4]', textColor: 'text-white',
          instructions: '1. Azure Portal > App Registrations.\n2. New Registration.\n3. Copy Application (client) ID and Directory (tenant) ID.'
      },
      { 
          id: 'github', name: 'GitHub Enterprise', icon: 'GH', protocol: 'OAuth 2.0', enabled: false, color: 'bg-black', textColor: 'text-white',
          instructions: '1. GitHub Settings > Developer Settings > OAuth Apps.\n2. Register new application.\n3. Generate Client Secret.'
      }
  ]);

  // Account Settings State
  const [profile, setProfile] = useState({
      name: 'Super User',
      email: 'superuser@megamos.com',
      phone: '+1 (555) 0199-2834',
      twoFactor: true
  });
  const [linkedAccounts, setLinkedAccounts] = useState([
      { id: 'google', name: 'Google', connected: true, email: 'admin@company.com' },
      { id: 'github', name: 'GitHub', connected: false, email: '' },
      { id: 'badal', name: 'Badal Cloud ID', connected: true, email: 'root@badal.io' }
  ]);

  const togglePermission = (permId: string) => {
      if (selectedRole.isSystem && selectedRole.name === 'Owner') return; // Prevent locking owner out
      
      const hasPerm = selectedRole.permissions.includes(permId);
      const newPerms = hasPerm 
        ? selectedRole.permissions.filter(p => p !== permId)
        : [...selectedRole.permissions, permId];
      
      const updatedRole = { ...selectedRole, permissions: newPerms };
      setSelectedRole(updatedRole);
      setRoles(roles.map(r => r.id === updatedRole.id ? updatedRole : r));
  };

  const toggleSSO = (id: string) => {
      setSsoProviders(prev => prev.map(p => p.id === id ? { ...p, enabled: !p.enabled } : p));
  };

  const toggleLinkedAccount = (id: string) => {
      setLinkedAccounts(prev => prev.map(acc => acc.id === id ? { ...acc, connected: !acc.connected } : acc));
  };

  return (
    <div className="h-full flex flex-col bg-slate-950 text-slate-200 font-sans">
      {/* Header */}
      <div className="border-b border-slate-800 bg-slate-900/50 p-6 flex justify-between items-center">
        <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-indigo-500 to-cyan-500 rounded-xl shadow-lg shadow-indigo-500/20">
                <Shield size={24} className="text-white"/>
            </div>
            <div>
                <h1 className="text-xl font-bold text-white">Badal Auth</h1>
                <p className="text-slate-400 text-xs">Open Source Identity & Access Management (IAM)</p>
            </div>
        </div>
        <div className="flex bg-slate-800 rounded-lg p-1">
            {[
                { id: 'USERS', icon: Users, label: 'Users' },
                { id: 'ROLES', icon: Lock, label: 'Roles' },
                { id: 'SSO', icon: Globe, label: 'SSO & Fed' },
                { id: 'TOKENS', icon: Key, label: 'API Keys' },
                { id: 'SETTINGS', icon: Settings, label: 'Settings' }
            ].map(tab => (
                <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-md text-xs font-bold transition ${activeTab === tab.id ? 'bg-slate-700 text-white shadow' : 'text-slate-400 hover:text-white'}`}
                >
                    <tab.icon size={14} /> {tab.label}
                </button>
            ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-8 bg-slate-950/50">
          
          {activeTab === 'USERS' && (
              <div className="max-w-6xl mx-auto">
                  <div className="flex justify-between items-center mb-6">
                      <div className="flex gap-4">
                          <div className="bg-slate-900 border border-slate-800 rounded-lg px-4 py-2 text-center min-w-[120px]">
                              <div className="text-[10px] text-slate-500 uppercase font-bold">Total Users</div>
                              <div className="text-xl font-bold text-white">1,402</div>
                          </div>
                          <div className="bg-slate-900 border border-slate-800 rounded-lg px-4 py-2 text-center min-w-[120px]">
                              <div className="text-[10px] text-slate-500 uppercase font-bold">Active Sessions</div>
                              <div className="text-xl font-bold text-green-400">890</div>
                          </div>
                      </div>
                      <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg font-bold text-sm transition">
                          <UserPlus size={16}/> Add User
                      </button>
                  </div>

                  <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                      <table className="w-full text-left text-sm">
                          <thead className="bg-slate-800/50 text-slate-400">
                              <tr>
                                  <th className="p-4">User</th>
                                  <th className="p-4">Role</th>
                                  <th className="p-4">Security</th>
                                  <th className="p-4">Status</th>
                                  <th className="p-4">Actions</th>
                              </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-800">
                              {users.map(u => (
                                  <tr key={u.id} className="hover:bg-slate-800/30">
                                      <td className="p-4">
                                          <div className="font-bold text-white">{u.name}</div>
                                          <div className="text-xs text-slate-500">{u.email}</div>
                                      </td>
                                      <td className="p-4"><span className="bg-slate-800 px-2 py-1 rounded text-xs border border-slate-700">{u.role}</span></td>
                                      <td className="p-4">
                                          {u.mfa ? 
                                            <span className="text-green-400 flex items-center gap-1 text-xs"><Fingerprint size={12}/> MFA Enabled</span> : 
                                            <span className="text-yellow-400 flex items-center gap-1 text-xs"><AlertTriangle size={12}/> Weak</span>
                                          }
                                      </td>
                                      <td className="p-4">
                                          <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${u.status === 'Active' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                                              {u.status}
                                          </span>
                                      </td>
                                      <td className="p-4 text-slate-400 hover:text-white cursor-pointer">Manage</td>
                                  </tr>
                              ))}
                          </tbody>
                      </table>
                  </div>
              </div>
          )}

          {activeTab === 'ROLES' && (
              <div className="h-full flex gap-6 max-w-6xl mx-auto">
                  {/* Roles List */}
                  <div className="w-1/3 flex flex-col gap-4">
                      <div className="flex justify-between items-center">
                          <h3 className="text-lg font-bold text-white">System Roles</h3>
                          <button className="p-2 bg-slate-900 border border-slate-700 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition">
                              <Plus size={16}/>
                          </button>
                      </div>
                      <div className="space-y-2">
                          {roles.map(role => (
                              <button
                                key={role.id}
                                onClick={() => setSelectedRole(role)}
                                className={`w-full text-left p-4 rounded-xl border transition group ${selectedRole.id === role.id ? 'bg-indigo-600/10 border-indigo-500' : 'bg-slate-900 border-slate-800 hover:border-slate-600'}`}
                              >
                                  <div className="flex justify-between items-center mb-1">
                                      <span className={`font-bold ${selectedRole.id === role.id ? 'text-indigo-400' : 'text-white'}`}>{role.name}</span>
                                      {role.isSystem && <span className="text-[10px] uppercase bg-slate-800 px-2 py-0.5 rounded text-slate-500 border border-slate-700">System</span>}
                                  </div>
                                  <p className="text-xs text-slate-500 line-clamp-2">{role.description}</p>
                              </button>
                          ))}
                      </div>
                  </div>

                  {/* Permissions Matrix */}
                  <div className="flex-1 bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col">
                      <div className="mb-6 border-b border-slate-800 pb-4">
                          <h2 className="text-2xl font-bold text-white mb-2">{selectedRole.name}</h2>
                          <p className="text-slate-400">{selectedRole.description}</p>
                      </div>
                      
                      <div className="flex-1 overflow-y-auto">
                          <h4 className="text-xs font-bold text-slate-500 uppercase mb-4">Access Levels & Permissions</h4>
                          <div className="grid grid-cols-1 gap-3">
                              {ALL_PERMISSIONS.map(perm => {
                                  const isEnabled = selectedRole.permissions.includes(perm.id);
                                  return (
                                      <div 
                                        key={perm.id} 
                                        className={`flex items-center justify-between p-3 rounded-lg border transition ${isEnabled ? 'bg-indigo-900/20 border-indigo-500/50' : 'bg-slate-950 border-slate-800'}`}
                                      >
                                          <div className="flex items-center gap-3">
                                              <div className={`w-5 h-5 rounded flex items-center justify-center border ${isEnabled ? 'bg-indigo-600 border-indigo-500 text-white' : 'border-slate-600 bg-slate-900'}`}>
                                                  {isEnabled && <Check size={12}/>}
                                              </div>
                                              <span className={`text-sm font-medium ${isEnabled ? 'text-indigo-200' : 'text-slate-400'}`}>{perm.label}</span>
                                          </div>
                                          <button 
                                            onClick={() => togglePermission(perm.id)}
                                            className={`text-xs font-bold px-3 py-1.5 rounded transition ${isEnabled ? 'bg-indigo-600 text-white hover:bg-indigo-500' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
                                          >
                                              {isEnabled ? 'Enabled' : 'Disabled'}
                                          </button>
                                      </div>
                                  )
                              })}
                          </div>
                      </div>
                      <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end gap-3">
                          <button className="px-4 py-2 text-sm text-slate-400 hover:text-white transition">Reset Defaults</button>
                          <button className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold rounded-lg transition shadow-lg shadow-indigo-900/20">Save Changes</button>
                      </div>
                  </div>
              </div>
          )}

          {activeTab === 'SSO' && (
              <div className="max-w-4xl mx-auto space-y-6">
                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                      <div className="mb-6">
                          <h3 className="font-bold text-white text-lg flex items-center gap-2"><Globe size={20} className="text-blue-400"/> Federated Identity Providers</h3>
                          <p className="text-slate-400 text-sm mt-1">Allow users to sign in with their existing enterprise accounts.</p>
                      </div>
                      
                      <div className="space-y-4">
                          {ssoProviders.map(provider => (
                              <div key={provider.id} className={`flex flex-col p-4 rounded-xl border transition-all ${provider.enabled ? 'bg-slate-800/50 border-indigo-500/30' : 'bg-slate-950 border-slate-800'}`}>
                                  <div className="flex items-center justify-between mb-4">
                                      <div className="flex items-center gap-4">
                                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm shadow-sm ${provider.color} ${provider.textColor}`}>
                                              {provider.icon}
                                          </div>
                                          <div>
                                              <div className="font-bold text-white">{provider.name}</div>
                                              <div className="text-xs text-slate-500">{provider.protocol}</div>
                                          </div>
                                      </div>
                                      
                                      <div className="flex items-center gap-4">
                                          <div className="group relative">
                                              <Info size={18} className="text-slate-500 hover:text-blue-400 cursor-help transition"/>
                                              {/* Tooltip */}
                                              <div className="absolute right-0 top-8 w-64 bg-black border border-slate-700 p-3 rounded-lg shadow-xl z-20 hidden group-hover:block animate-in fade-in slide-in-from-top-1">
                                                  <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">Setup Instructions</div>
                                                  <p className="text-xs text-slate-300 whitespace-pre-line leading-relaxed">{provider.instructions}</p>
                                                  <div className="mt-2 text-[10px] text-blue-400 cursor-pointer hover:underline">Read full guide →</div>
                                              </div>
                                          </div>
                                          
                                          <button 
                                            onClick={() => toggleSSO(provider.id)}
                                            className={`transition-colors duration-300 ${provider.enabled ? 'text-green-400' : 'text-slate-600'}`}
                                          >
                                              {provider.enabled ? <ToggleRight size={36} /> : <ToggleLeft size={36} />}
                                          </button>
                                      </div>
                                  </div>

                                  {/* Config Fields (Visible when enabled) */}
                                  {provider.enabled && (
                                      <div className="mt-2 pt-4 border-t border-slate-700/50 grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2">
                                          <div>
                                              <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Client ID</label>
                                              <input className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-xs text-white outline-none focus:border-indigo-500" placeholder={`Enter ${provider.name} Client ID`} />
                                          </div>
                                          <div>
                                              <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Client Secret</label>
                                              <input type="password" className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-xs text-white outline-none focus:border-indigo-500" placeholder="••••••••••••••••" />
                                          </div>
                                      </div>
                                  )}
                              </div>
                          ))}
                      </div>
                  </div>
              </div>
          )}

          {activeTab === 'TOKENS' && (
              <div className="max-w-4xl mx-auto space-y-6">
                   <div className="bg-gradient-to-r from-slate-900 to-slate-950 border border-slate-800 rounded-xl p-6">
                       <h3 className="font-bold text-white mb-2">Machine-to-Machine (M2M) Tokens</h3>
                       <p className="text-sm text-slate-400 mb-6">Manage OAuth2 client credentials for your SuckSaas Framework applications.</p>
                       
                       <div className="space-y-4">
                           <div className="bg-black/30 p-4 rounded-lg border border-slate-800">
                               <div className="flex justify-between items-start mb-2">
                                   <div>
                                       <div className="font-bold text-indigo-400 text-sm">service-payment-gateway</div>
                                       <div className="text-xs text-slate-500">Last used: 2 mins ago</div>
                                   </div>
                                   <button className="text-xs bg-red-900/20 text-red-400 px-2 py-1 rounded border border-red-900/30">Revoke</button>
                               </div>
                               <div className="font-mono text-xs text-slate-400 bg-black p-2 rounded truncate">
                                   badal_sk_live_83927489237489237489...
                               </div>
                           </div>
                           
                           <button className="w-full py-2 border border-dashed border-slate-700 rounded-lg text-slate-500 hover:text-white hover:border-indigo-500 transition text-sm font-bold">
                               + Generate New Client Secret
                           </button>
                       </div>
                   </div>
              </div>
          )}

          {activeTab === 'SETTINGS' && (
              <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300">
                  
                  {/* Profile Settings */}
                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                      <div className="flex justify-between items-start mb-6">
                          <div>
                              <h3 className="text-lg font-bold text-white">Profile Information</h3>
                              <p className="text-sm text-slate-400">Update your account details and contact info.</p>
                          </div>
                          <button className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-xs font-bold transition">
                              Save Changes
                          </button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                              <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Full Name</label>
                              <input 
                                value={profile.name} 
                                onChange={e => setProfile({...profile, name: e.target.value})}
                                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-sm text-white focus:border-indigo-500 outline-none"
                              />
                          </div>
                          <div>
                              <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Email Address</label>
                              <input 
                                value={profile.email} 
                                onChange={e => setProfile({...profile, email: e.target.value})}
                                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-sm text-white focus:border-indigo-500 outline-none"
                              />
                          </div>
                          <div>
                              <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Phone</label>
                              <input 
                                value={profile.phone} 
                                onChange={e => setProfile({...profile, phone: e.target.value})}
                                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-sm text-white focus:border-indigo-500 outline-none"
                              />
                          </div>
                      </div>
                  </div>

                  {/* Connected Accounts */}
                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                      <h3 className="text-lg font-bold text-white mb-6">Connected Accounts</h3>
                      <div className="space-y-4">
                          {linkedAccounts.map(acc => (
                              <div key={acc.id} className="flex items-center justify-between p-4 bg-slate-950 rounded-lg border border-slate-800">
                                  <div className="flex items-center gap-4">
                                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${acc.id === 'google' ? 'bg-white text-black' : acc.id === 'github' ? 'bg-black text-white' : 'bg-gradient-to-br from-indigo-500 to-cyan-500 text-white'}`}>
                                          {acc.name[0]}
                                      </div>
                                      <div>
                                          <div className="font-bold text-white">{acc.name}</div>
                                          <div className="text-xs text-slate-500">{acc.connected ? `Connected as ${acc.email}` : 'Not connected'}</div>
                                      </div>
                                  </div>
                                  <button 
                                    onClick={() => toggleLinkedAccount(acc.id)}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition ${acc.connected ? 'border-red-900/50 text-red-400 hover:bg-red-900/20' : 'border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800'}`}
                                  >
                                      {acc.connected ? 'Unlink' : 'Connect'}
                                  </button>
                              </div>
                          ))}
                      </div>
                  </div>

                  {/* Security Center */}
                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                      <h3 className="text-lg font-bold text-white mb-6">Security Center</h3>
                      <div className="space-y-6">
                          <div className="flex items-center justify-between pb-6 border-b border-slate-800">
                              <div>
                                  <h4 className="font-bold text-white text-sm">Two-Factor Authentication</h4>
                                  <p className="text-xs text-slate-500">Add an extra layer of security to your account.</p>
                              </div>
                              <button onClick={() => setProfile({...profile, twoFactor: !profile.twoFactor})} className={`relative w-12 h-6 rounded-full transition-colors ${profile.twoFactor ? 'bg-green-500' : 'bg-slate-700'}`}>
                                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${profile.twoFactor ? 'left-7' : 'left-1'}`}></div>
                              </button>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                              <div className="col-span-1">
                                  <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Current Password</label>
                                  <input type="password" placeholder="••••••••" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-sm text-white"/>
                              </div>
                              <div className="col-span-1">
                                  <label className="text-xs font-bold text-slate-500 uppercase block mb-2">New Password</label>
                                  <input type="password" placeholder="••••••••" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-sm text-white"/>
                              </div>
                              <div className="col-span-1 flex items-end">
                                  <button className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-2 rounded-lg text-sm transition">Update Password</button>
                              </div>
                          </div>

                          <div className="pt-4">
                              <h4 className="font-bold text-white text-sm mb-4">Active Sessions</h4>
                              <div className="flex items-center justify-between p-3 bg-slate-950 rounded border border-slate-800">
                                  <div className="flex items-center gap-3">
                                      <Globe size={16} className="text-slate-500"/>
                                      <div>
                                          <div className="text-sm font-bold text-white">San Francisco, US</div>
                                          <div className="text-xs text-slate-500">Chrome on macOS • Current Session</div>
                                      </div>
                                  </div>
                                  <div className="text-xs text-green-400 font-bold">Active Now</div>
                              </div>
                          </div>
                      </div>
                  </div>

                  <div className="pt-6 border-t border-slate-800 flex justify-end">
                      <button className="flex items-center gap-2 text-red-400 hover:text-red-300 text-sm font-bold transition">
                          <LogOut size={16}/> Sign Out All Devices
                      </button>
                  </div>
              </div>
          )}
      </div>
    </div>
  );
};

export default BadalAuth;
