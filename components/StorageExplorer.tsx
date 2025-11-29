import React, { useState } from 'react';
import { HardDrive, Settings, Users, Shield, File, Folder, Plus, Upload, MoreVertical, RefreshCw, Lock, MapPin, Globe, CheckCircle2 } from 'lucide-react';

const FileIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
);

const StorageExplorer: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'BROWSER' | 'SETTINGS'>('BROWSER');
  const [encryptionEnabled, setEncryptionEnabled] = useState(true);
  const [showGeoConfig, setShowGeoConfig] = useState(false);
  const [regions, setRegions] = useState([
      { id: 'us-east', name: 'US East (Virginia)', status: 'Active', latency: '2ms' },
      { id: 'eu-west', name: 'EU West (Frankfurt)', status: 'Synced', latency: '85ms' },
      { id: 'ap-south', name: 'Asia Pacific (Mumbai)', status: 'Replicating...', latency: '140ms' },
  ]);

  return (
    <div className="h-full flex flex-col bg-slate-950 text-slate-200">
      <div className="px-6 py-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/80 backdrop-blur">
         <div className="flex items-center gap-4">
             <div className="p-2 bg-blue-600/20 rounded-lg text-blue-400">
                <HardDrive size={24} />
             </div>
             <div>
                <h2 className="text-lg font-bold text-white">Badal Storage</h2>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                   <span>Used: 2.1 TB</span>
                   <span className="w-1 h-1 rounded-full bg-slate-600"></span>
                   <span className="text-cyan-400 font-bold">Total: ∞ (Badal Cloud)</span>
                </div>
             </div>
         </div>
         <div className="flex bg-slate-800 rounded-lg p-1">
            <button 
              onClick={() => setActiveTab('BROWSER')}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition ${activeTab === 'BROWSER' ? 'bg-slate-700 text-white shadow' : 'text-slate-400 hover:text-white'}`}
            >
              Files
            </button>
            <button 
              onClick={() => setActiveTab('SETTINGS')}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition ${activeTab === 'SETTINGS' ? 'bg-slate-700 text-white shadow' : 'text-slate-400 hover:text-white'}`}
            >
              Control Panel
            </button>
         </div>
      </div>

      <div className="flex-1 overflow-y-auto bg-slate-950">
        {activeTab === 'BROWSER' ? (
           <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                 <div className="flex items-center gap-2 text-sm text-slate-400">
                    <span className="hover:text-white cursor-pointer">Home</span>
                    <span>/</span>
                    <span className="hover:text-white cursor-pointer">Badal Vault</span>
                    <span>/</span>
                    <span className="text-white font-medium">Projects</span>
                 </div>
                 <div className="flex gap-2">
                    <button className="flex items-center gap-2 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm transition">
                       <Plus size={16} /> New Folder
                    </button>
                    <button className="flex items-center gap-2 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-sm transition border border-slate-700">
                       <Upload size={16} /> Upload
                    </button>
                 </div>
              </div>

              {/* Special Unlimited Folders */}
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 mb-8">
                 {['Documents', 'Images', 'System', 'Backups', 'Shared'].map(f => (
                   <div key={f} className="group bg-gradient-to-br from-slate-900 to-slate-800 p-4 rounded-xl border border-slate-800 hover:border-blue-500/50 hover:from-slate-800 hover:to-slate-700 cursor-pointer transition flex flex-col items-center gap-3 relative shadow-lg">
                      <div className="w-16 h-12 bg-blue-500/10 group-hover:bg-blue-500/20 rounded-lg flex items-center justify-center text-blue-400 transition">
                         <Folder size={28} fill="currentColor" fillOpacity={0.2} />
                      </div>
                      <div className="text-center">
                          <span className="text-sm font-medium text-slate-300 group-hover:text-white truncate w-full text-center block">{f}</span>
                          <span className="text-[10px] text-cyan-500/70 font-mono">UNLIMITED</span>
                      </div>
                      <button className="absolute top-2 right-2 text-slate-600 opacity-0 group-hover:opacity-100 hover:text-white transition">
                         <MoreVertical size={16} />
                      </button>
                   </div>
                 ))}
              </div>
                
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Recent Files</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                 {[1,2,3,4,5,6,7,8].map(i => (
                   <div key={i} className="group bg-slate-900/50 p-4 rounded-xl border border-slate-800 hover:border-cyan-500/50 hover:bg-slate-800/80 cursor-pointer transition flex flex-col items-center gap-3 relative">
                      <div className="w-16 h-12 bg-slate-700/30 group-hover:bg-cyan-500/10 rounded-lg flex items-center justify-center text-slate-400 group-hover:text-cyan-400 transition">
                         <FileIcon />
                      </div>
                      <div className="text-center w-full">
                         <div className="text-sm font-medium text-slate-300 group-hover:text-white truncate">data_shard_{i}.enc</div>
                         <div className="text-[10px] text-slate-500 mt-1">24 MB • Today</div>
                      </div>
                   </div>
                 ))}
              </div>
           </div>
        ) : (
           <div className="p-8 max-w-4xl mx-auto space-y-8">
              <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                 <div className="p-4 bg-slate-800/50 border-b border-slate-800 font-semibold text-white flex items-center gap-2">
                    <Shield size={18} className="text-emerald-400" />
                    Security & Encryption
                 </div>
                 <div className="p-6 space-y-6">
                    <div className="flex items-center justify-between">
                       <div>
                          <h4 className="text-white font-medium">Zero-Knowledge Encryption</h4>
                          <p className="text-sm text-slate-500">Encrypt files before they leave your device.</p>
                       </div>
                       <button 
                         onClick={() => setEncryptionEnabled(!encryptionEnabled)}
                         className={`w-12 h-6 rounded-full p-1 transition-colors ${encryptionEnabled ? 'bg-emerald-500' : 'bg-slate-700'}`}
                       >
                          <div className={`w-4 h-4 rounded-full bg-white transition-transform ${encryptionEnabled ? 'translate-x-6' : 'translate-x-0'}`} />
                       </button>
                    </div>
                    <div className="flex items-center justify-between">
                       <div>
                          <h4 className="text-white font-medium">Two-Factor Authentication</h4>
                          <p className="text-sm text-slate-500">Require 2FA for all admin actions.</p>
                       </div>
                       <div className="text-emerald-400 text-sm font-mono flex items-center gap-1"><Lock size={12}/> Active</div>
                    </div>
                 </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                 <div className="p-4 bg-slate-800/50 border-b border-slate-800 font-semibold text-white flex items-center gap-2">
                    <Users size={18} className="text-blue-400" />
                    User Management & Quotas
                 </div>
                 <div className="p-6">
                    <table className="w-full text-sm">
                       <thead className="text-slate-500 text-left">
                          <tr>
                             <th className="pb-3">User</th>
                             <th className="pb-3">Role</th>
                             <th className="pb-3">Storage Used</th>
                             <th className="pb-3">Status</th>
                          </tr>
                       </thead>
                       <tbody className="text-slate-300">
                          <tr className="border-t border-slate-800">
                             <td className="py-3 font-medium text-white">superuser</td>
                             <td className="py-3"><span className="bg-purple-500/10 text-purple-400 px-2 py-0.5 rounded text-xs">Admin</span></td>
                             <td className="py-3">1.8 TB</td>
                             <td className="py-3 text-emerald-400">Active</td>
                          </tr>
                          <tr className="border-t border-slate-800">
                             <td className="py-3 font-medium text-white">backup_bot</td>
                             <td className="py-3"><span className="bg-slate-700 text-slate-300 px-2 py-0.5 rounded text-xs">Service</span></td>
                             <td className="py-3">300 GB</td>
                             <td className="py-3 text-emerald-400">Active</td>
                          </tr>
                       </tbody>
                    </table>
                 </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden transition-all duration-300">
                 <div className="p-4 bg-slate-800/50 border-b border-slate-800 font-semibold text-white flex items-center gap-2">
                    <RefreshCw size={18} className="text-orange-400" />
                    Replication & Backup
                 </div>
                 <div className="p-6 space-y-4">
                     <div className="flex flex-col gap-4 p-4 bg-slate-800/50 rounded-lg border border-slate-800">
                         <div className="flex items-center gap-4">
                             <div className="bg-orange-500/10 p-3 rounded-lg text-orange-400"><Globe size={24} /></div>
                             <div className="flex-1">
                                 <h4 className="font-medium text-white">Geo-Redundancy</h4>
                                 <p className="text-sm text-slate-500">Data is replicated across {regions.length} physical regions for disaster recovery.</p>
                             </div>
                             <button 
                                onClick={() => setShowGeoConfig(!showGeoConfig)}
                                className={`text-sm border border-slate-600 hover:bg-slate-700 px-3 py-1.5 rounded transition ${showGeoConfig ? 'bg-slate-700 text-white' : 'text-slate-300'}`}
                             >
                                {showGeoConfig ? 'Hide Config' : 'Configure'}
                             </button>
                         </div>

                         {/* Expanded Geo-Redundancy Config */}
                         {showGeoConfig && (
                             <div className="mt-2 pt-4 border-t border-slate-700 animate-in fade-in slide-in-from-top-2">
                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                                     {regions.map(r => (
                                         <div key={r.id} className="flex items-center justify-between p-3 bg-slate-900 rounded border border-slate-700">
                                             <div className="flex items-center gap-2">
                                                 <MapPin size={16} className={r.status === 'Active' ? 'text-green-500' : 'text-slate-500'} />
                                                 <div>
                                                     <div className="text-sm font-medium text-slate-200">{r.name}</div>
                                                     <div className="text-xs text-slate-500 flex items-center gap-2">
                                                         {r.status === 'Replicating...' && <RefreshCw size={10} className="animate-spin" />}
                                                         {r.status} • {r.latency}
                                                     </div>
                                                 </div>
                                             </div>
                                             <button className="text-slate-500 hover:text-red-400 text-xs">Remove</button>
                                         </div>
                                     ))}
                                     <button className="flex items-center justify-center p-3 bg-slate-900/50 rounded border border-dashed border-slate-700 hover:border-slate-500 text-slate-400 hover:text-slate-200 transition text-sm">
                                         + Add Region
                                     </button>
                                 </div>
                                 <div className="flex items-center gap-2 text-xs text-green-400 bg-green-500/10 p-2 rounded">
                                     <CheckCircle2 size={12} />
                                     Global synchronization active. No data loss detected.
                                 </div>
                             </div>
                         )}
                     </div>
                 </div>
              </div>
           </div>
        )}
      </div>
    </div>
  );
};

export default StorageExplorer;