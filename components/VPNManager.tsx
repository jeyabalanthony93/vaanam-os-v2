import React, { useState } from 'react';
import { Shield, Globe, Lock, Wifi, Power, Settings, Save, ArrowLeft, Loader2, Network, ToggleLeft, ToggleRight, FileText, Activity, EyeOff, Radio, Cpu } from 'lucide-react';

const VPNManager: React.FC = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [ipAddress, setIpAddress] = useState('192.168.0.105');
  const [view, setView] = useState<'STATUS' | 'CONFIG' | 'LOGS'>('STATUS');
  const [isSaving, setIsSaving] = useState(false);
  const [activeConfigTab, setActiveConfigTab] = useState<'GENERAL' | 'SECURITY' | 'SHIELD_CORE' | 'ENTERPRISE'>('GENERAL');

  // Configuration State
  const [config, setConfig] = useState({
      // General
      serverAddress: 'vpn.megamos.com',
      port: '51820',
      protocol: 'WireGuard',
      username: 'superuser',
      password: '',
      privateKey: '******************************************',
      // Security
      killSwitch: true,
      multiHop: false,
      multiHopExit: 'ch-zurich-01',
      obfuscation: false,
      // Shield Core (New)
      adBlock: false,
      torBridge: false,
      postQuantum: false,
      // Enterprise
      customDns: '10.0.0.53',
      splitTunneling: true,
      splitRoutes: '192.168.1.0/24, 10.0.0.0/8',
      dedicatedIp: false
  });

  const toggleConnection = () => {
    if (!isConnected) {
      // Simulate connection delay
      setIpAddress('...');
      setTimeout(() => {
        setIpAddress('10.254.0.42'); // Virtual private IP
      }, 800);
    } else {
      setIpAddress('192.168.0.105');
    }
    setIsConnected(!isConnected);
  };

  const handleSaveConfig = () => {
      setIsSaving(true);
      // Simulate saving configuration
      setTimeout(() => {
          setIsSaving(false);
          setView('STATUS');
      }, 1000);
  };

  return (
    <div className="h-full p-8 flex flex-col items-center justify-center bg-slate-950 text-slate-200 overflow-y-auto">
      <div className="max-w-3xl w-full space-y-8">
        
        <div className="flex items-center justify-between">
            <div className="space-y-2">
                <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-indigo-500">
                    Megam Secure Tunnel
                </h2>
                <p className="text-slate-400">Enterprise Self-Hosted VPN • {config.protocol} • <span className="text-green-400">v4.2.0</span></p>
            </div>
            <div className="flex gap-2">
                 <button 
                    onClick={() => setView('LOGS')}
                    className={`p-3 rounded-xl transition border bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border-slate-700`}
                    title="System Logs"
                >
                    <FileText size={20} />
                </button>
                <button 
                    onClick={() => setView(view === 'STATUS' ? 'CONFIG' : 'STATUS')}
                    disabled={isConnected}
                    className={`p-3 rounded-xl transition border ${
                        isConnected 
                        ? 'bg-slate-900 border-slate-800 text-slate-600 cursor-not-allowed' 
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border-slate-700'
                    }`}
                    title={isConnected ? "Disconnect to configure" : (view === 'STATUS' ? "Configure VPN" : "Back to Status")}
                >
                    {view === 'STATUS' ? <Settings size={20} /> : <ArrowLeft size={20} />}
                </button>
            </div>
        </div>

        {view === 'STATUS' && (
             <div className="animate-in fade-in slide-in-from-left-4 duration-300 space-y-8">
                {/* Main Status Card */}
                <div className={`
                relative rounded-3xl p-1 bg-gradient-to-br transition-all duration-500
                ${isConnected ? 'from-green-400 to-cyan-500 shadow-[0_0_50px_rgba(34,211,238,0.2)]' : 'from-slate-700 to-slate-800'}
                `}>
                <div className="bg-slate-900 rounded-[22px] p-8 flex flex-col items-center gap-8">
                    
                    {/* Connection Circle */}
                    <div className="relative">
                        <button 
                        onClick={toggleConnection}
                        className={`
                            w-40 h-40 rounded-full flex flex-col items-center justify-center gap-2 transition-all duration-500 border-8
                            ${isConnected 
                            ? 'bg-green-500/10 border-green-500 text-green-400 shadow-[0_0_30px_inset_rgba(34,199,89,0.2)]' 
                            : 'bg-slate-800 border-slate-700 text-slate-500 hover:border-slate-600 hover:text-slate-300'}
                        `}
                        >
                        <Power size={48} />
                        <span className="text-sm font-bold uppercase tracking-wider">{isConnected ? 'Connected' : 'Connect'}</span>
                        </button>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-8 w-full">
                        <div className="text-center p-4 rounded-xl bg-slate-800/50 border border-slate-700">
                        <div className="flex justify-center mb-2 text-indigo-400"><Globe size={20} /></div>
                        <div className="text-xs text-slate-500 uppercase tracking-widest mb-1">Server</div>
                        <div className="font-mono text-sm text-slate-200 truncate px-2">{config.serverAddress}</div>
                        </div>

                        <div className="text-center p-4 rounded-xl bg-slate-800/50 border border-slate-700">
                        <div className="flex justify-center mb-2 text-cyan-400"><Wifi size={20} /></div>
                        <div className="text-xs text-slate-500 uppercase tracking-widest mb-1">Public IP</div>
                        <div className="font-mono font-bold text-slate-200">{ipAddress}</div>
                        </div>

                        <div className="text-center p-4 rounded-xl bg-slate-800/50 border border-slate-700">
                        <div className="flex justify-center mb-2 text-emerald-400"><Shield size={20} /></div>
                        <div className="text-xs text-slate-500 uppercase tracking-widest mb-1">Encryption</div>
                        <div className="font-mono font-bold text-slate-200 flex items-center justify-center gap-2">
                             {config.postQuantum ? 'Post-Quantum' : 'AES-256'} <Lock size={12} />
                        </div>
                        </div>
                    </div>
                </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold text-slate-300">Active Shield Protocols</h3>
                            {config.killSwitch && <span className="text-[10px] bg-red-900/30 text-red-400 px-2 py-1 rounded border border-red-900/50 uppercase font-bold">Kill Switch</span>}
                        </div>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-slate-400 flex items-center gap-2"><EyeOff size={14}/> AdGuard DNS</span>
                                <span className={config.adBlock ? 'text-green-400 font-bold' : 'text-slate-600'}>{config.adBlock ? 'Filtering' : 'Disabled'}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-slate-400 flex items-center gap-2"><Globe size={14}/> Tor Bridge</span>
                                <span className={config.torBridge ? 'text-orange-400 font-bold' : 'text-slate-600'}>{config.torBridge ? 'Relaying' : 'Disabled'}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-slate-400 flex items-center gap-2"><Cpu size={14}/> Quantum Crypto</span>
                                <span className={config.postQuantum ? 'text-purple-400 font-bold' : 'text-slate-600'}>{config.postQuantum ? 'Lattice-Based' : 'Disabled'}</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold text-slate-300">Traffic Analysis</h3>
                            <span className="text-xs bg-slate-800 px-2 py-1 rounded text-slate-500">Real-time</span>
                        </div>
                        <div className="relative h-12 bg-slate-800 rounded-lg overflow-hidden flex items-center justify-center mb-2">
                            {isConnected ? (
                                <>
                                    <div className="absolute inset-0 bg-green-900/20"></div>
                                    <Activity size={24} className="text-green-500 animate-pulse relative z-10" />
                                    <div className="absolute bottom-0 left-0 h-1 bg-green-500 animate-[pulse_2s_infinite]" style={{width: '100%'}}></div>
                                </>
                            ) : (
                                <span className="text-slate-600 text-xs">Tunnel Idle</span>
                            )}
                        </div>
                        <div className="flex justify-between mt-2 text-xs text-slate-500 font-mono">
                            <span>Encrypted: {isConnected ? '100%' : '0%'}</span>
                            <span>Leaks: None</span>
                        </div>
                    </div>
                </div>
            </div>
        )}

        {view === 'CONFIG' && (
            <div className="bg-slate-900 border border-slate-800 rounded-[22px] overflow-hidden animate-in slide-in-from-right-4 duration-300">
                <div className="flex border-b border-slate-800 overflow-x-auto">
                    <button onClick={() => setActiveConfigTab('GENERAL')} className={`flex-1 py-4 px-4 text-sm font-bold uppercase tracking-wider whitespace-nowrap ${activeConfigTab === 'GENERAL' ? 'bg-slate-800 text-cyan-400 border-b-2 border-cyan-400' : 'text-slate-500 hover:text-slate-300'}`}>General</button>
                    <button onClick={() => setActiveConfigTab('SECURITY')} className={`flex-1 py-4 px-4 text-sm font-bold uppercase tracking-wider whitespace-nowrap ${activeConfigTab === 'SECURITY' ? 'bg-slate-800 text-cyan-400 border-b-2 border-cyan-400' : 'text-slate-500 hover:text-slate-300'}`}>Security</button>
                    <button onClick={() => setActiveConfigTab('SHIELD_CORE')} className={`flex-1 py-4 px-4 text-sm font-bold uppercase tracking-wider whitespace-nowrap ${activeConfigTab === 'SHIELD_CORE' ? 'bg-slate-800 text-purple-400 border-b-2 border-purple-400' : 'text-slate-500 hover:text-slate-300'}`}>Shield Core</button>
                    <button onClick={() => setActiveConfigTab('ENTERPRISE')} className={`flex-1 py-4 px-4 text-sm font-bold uppercase tracking-wider whitespace-nowrap ${activeConfigTab === 'ENTERPRISE' ? 'bg-slate-800 text-cyan-400 border-b-2 border-cyan-400' : 'text-slate-500 hover:text-slate-300'}`}>Enterprise</button>
                </div>

                <div className="p-8 space-y-6 min-h-[400px]">
                    
                    {activeConfigTab === 'GENERAL' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase">Protocol</label>
                                <select 
                                    value={config.protocol}
                                    onChange={(e) => setConfig({...config, protocol: e.target.value})}
                                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-sm text-white focus:border-cyan-500 outline-none transition"
                                >
                                    <option>WireGuard</option>
                                    <option>OpenVPN (TCP)</option>
                                    <option>OpenVPN (UDP)</option>
                                    <option>IKEv2/IPsec</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase">Port</label>
                                <input 
                                    type="text"
                                    value={config.port}
                                    onChange={(e) => setConfig({...config, port: e.target.value})}
                                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-sm text-white focus:border-cyan-500 outline-none transition"
                                />
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <label className="text-xs font-bold text-slate-500 uppercase">Server Address</label>
                                <input 
                                    type="text"
                                    value={config.serverAddress}
                                    onChange={(e) => setConfig({...config, serverAddress: e.target.value})}
                                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-sm text-white focus:border-cyan-500 outline-none transition"
                                    placeholder="vpn.example.com or 192.168.1.1"
                                />
                            </div>
                            
                            {config.protocol === 'WireGuard' ? (
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase">Private Key</label>
                                    <div className="relative">
                                        <input 
                                            type="password"
                                            value={config.privateKey}
                                            onChange={(e) => setConfig({...config, privateKey: e.target.value})}
                                            className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-sm text-white focus:border-cyan-500 outline-none font-mono"
                                        />
                                        <Lock size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500" />
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-500 uppercase">Username</label>
                                        <input 
                                            type="text"
                                            value={config.username}
                                            onChange={(e) => setConfig({...config, username: e.target.value})}
                                            className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-sm text-white focus:border-cyan-500 outline-none transition"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-500 uppercase">Password</label>
                                        <input 
                                            type="password"
                                            value={config.password}
                                            onChange={(e) => setConfig({...config, password: e.target.value})}
                                            className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-sm text-white focus:border-cyan-500 outline-none transition"
                                        />
                                    </div>
                                </>
                            )}
                        </div>
                    )}

                    {activeConfigTab === 'SECURITY' && (
                        <div className="space-y-6">
                            <div className="flex items-center justify-between p-4 bg-slate-800 rounded-lg border border-slate-700">
                                <div>
                                    <h4 className="font-bold text-white flex items-center gap-2"><Shield size={16} className="text-red-400"/> Kill Switch</h4>
                                    <p className="text-xs text-slate-400">Block all traffic if VPN connection drops.</p>
                                </div>
                                <button onClick={() => setConfig({...config, killSwitch: !config.killSwitch})} className={`transition-colors ${config.killSwitch ? 'text-green-400' : 'text-slate-500'}`}>
                                    {config.killSwitch ? <ToggleRight size={32} /> : <ToggleLeft size={32} />}
                                </button>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-slate-800 rounded-lg border border-slate-700">
                                <div>
                                    <h4 className="font-bold text-white flex items-center gap-2"><Network size={16} className="text-indigo-400"/> Multi-Hop (Double VPN)</h4>
                                    <p className="text-xs text-slate-400">Route traffic through multiple servers.</p>
                                </div>
                                <button onClick={() => setConfig({...config, multiHop: !config.multiHop})} className={`transition-colors ${config.multiHop ? 'text-green-400' : 'text-slate-500'}`}>
                                    {config.multiHop ? <ToggleRight size={32} /> : <ToggleLeft size={32} />}
                                </button>
                            </div>

                             {config.multiHop && (
                                <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase">Exit Node Location</label>
                                    <select 
                                        value={config.multiHopExit}
                                        onChange={(e) => setConfig({...config, multiHopExit: e.target.value})}
                                        className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-sm text-white focus:border-cyan-500 outline-none transition"
                                    >
                                        <option value="ch-zurich-01">Switzerland (Zurich)</option>
                                        <option value="is-reykjavik-02">Iceland (Reykjavik)</option>
                                        <option value="pa-panama-01">Panama (Panama City)</option>
                                    </select>
                                </div>
                            )}

                             <div className="flex items-center justify-between p-4 bg-slate-800 rounded-lg border border-slate-700">
                                <div>
                                    <h4 className="font-bold text-white flex items-center gap-2"><Activity size={16} className="text-orange-400"/> Obfuscation (Stealth Mode)</h4>
                                    <p className="text-xs text-slate-400">Mask VPN traffic as regular HTTPS.</p>
                                </div>
                                <button onClick={() => setConfig({...config, obfuscation: !config.obfuscation})} className={`transition-colors ${config.obfuscation ? 'text-green-400' : 'text-slate-500'}`}>
                                    {config.obfuscation ? <ToggleRight size={32} /> : <ToggleLeft size={32} />}
                                </button>
                            </div>
                        </div>
                    )}

                    {activeConfigTab === 'SHIELD_CORE' && (
                        <div className="space-y-6">
                            <div className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 p-4 rounded-lg border border-purple-500/20 mb-6">
                                <h4 className="text-sm font-bold text-purple-400 mb-2 flex items-center gap-2"><Shield size={16}/> Megam Shield™ Core</h4>
                                <p className="text-xs text-slate-400">Advanced privacy layers built into the Megam OS kernel.</p>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-slate-800 rounded-lg border border-slate-700">
                                <div>
                                    <h4 className="font-bold text-white flex items-center gap-2"><EyeOff size={16} className="text-green-400"/> AdGuard DNS Filter</h4>
                                    <p className="text-xs text-slate-400">Block ads, trackers, and malware domains at the DNS level.</p>
                                </div>
                                <button onClick={() => setConfig({...config, adBlock: !config.adBlock})} className={`transition-colors ${config.adBlock ? 'text-green-400' : 'text-slate-500'}`}>
                                    {config.adBlock ? <ToggleRight size={32} /> : <ToggleLeft size={32} />}
                                </button>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-slate-800 rounded-lg border border-slate-700">
                                <div>
                                    <h4 className="font-bold text-white flex items-center gap-2"><Globe size={16} className="text-orange-400"/> Tor Network Bridge</h4>
                                    <p className="text-xs text-slate-400">Route traffic through the Tor onion network.</p>
                                </div>
                                <button onClick={() => setConfig({...config, torBridge: !config.torBridge})} className={`transition-colors ${config.torBridge ? 'text-green-400' : 'text-slate-500'}`}>
                                    {config.torBridge ? <ToggleRight size={32} /> : <ToggleLeft size={32} />}
                                </button>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-slate-800 rounded-lg border border-slate-700">
                                <div>
                                    <h4 className="font-bold text-white flex items-center gap-2"><Cpu size={16} className="text-purple-400"/> Post-Quantum Cryptography</h4>
                                    <p className="text-xs text-slate-400">Use lattice-based key exchange algorithms (Kyber-1024).</p>
                                </div>
                                <button onClick={() => setConfig({...config, postQuantum: !config.postQuantum})} className={`transition-colors ${config.postQuantum ? 'text-green-400' : 'text-slate-500'}`}>
                                    {config.postQuantum ? <ToggleRight size={32} /> : <ToggleLeft size={32} />}
                                </button>
                            </div>
                        </div>
                    )}

                    {activeConfigTab === 'ENTERPRISE' && (
                         <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase flex items-center justify-between">
                                    <span>Split Tunneling Routes (CIDR)</span>
                                    <span className="text-[10px] bg-slate-800 px-2 rounded text-cyan-400">Enabled</span>
                                </label>
                                <textarea 
                                    value={config.splitRoutes}
                                    onChange={(e) => setConfig({...config, splitRoutes: e.target.value})}
                                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-sm text-white focus:border-cyan-500 outline-none transition h-24 font-mono"
                                    placeholder="10.0.0.0/8, 192.168.1.0/24"
                                />
                                <p className="text-[10px] text-slate-500">Only traffic to these subnets will be routed through the VPN.</p>
                            </div>

                             <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase">Custom DNS Servers</label>
                                <input 
                                    type="text"
                                    value={config.customDns}
                                    onChange={(e) => setConfig({...config, customDns: e.target.value})}
                                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-sm text-white focus:border-cyan-500 outline-none transition font-mono"
                                    placeholder="1.1.1.1, 8.8.8.8"
                                />
                            </div>

                            <div className="flex items-center justify-between p-4 bg-slate-800 rounded-lg border border-slate-700">
                                <div>
                                    <h4 className="font-bold text-white flex items-center gap-2"><Globe size={16} className="text-blue-400"/> Dedicated Static IP</h4>
                                    <p className="text-xs text-slate-400">Reserve a static IP for whitelist access.</p>
                                </div>
                                <button onClick={() => setConfig({...config, dedicatedIp: !config.dedicatedIp})} className={`transition-colors ${config.dedicatedIp ? 'text-green-400' : 'text-slate-500'}`}>
                                    {config.dedicatedIp ? <ToggleRight size={32} /> : <ToggleLeft size={32} />}
                                </button>
                            </div>
                         </div>
                    )}
                </div>

                <div className="p-4 bg-slate-900 border-t border-slate-800 flex justify-end">
                    <button 
                        onClick={handleSaveConfig}
                        disabled={isSaving}
                        className="bg-cyan-600 hover:bg-cyan-500 text-white px-6 py-3 rounded-lg font-bold flex items-center gap-2 transition shadow-lg shadow-cyan-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                        {isSaving ? 'Applying Policies...' : 'Save Configuration'}
                    </button>
                </div>
            </div>
        )}

        {view === 'LOGS' && (
             <div className="bg-slate-900 border border-slate-800 rounded-[22px] overflow-hidden animate-in slide-in-from-bottom-4 duration-300 h-[500px] flex flex-col">
                 <div className="p-4 border-b border-slate-800 flex justify-between items-center">
                    <h3 className="font-bold text-white flex items-center gap-2"><FileText size={18} /> Connection Logs</h3>
                    <button onClick={() => setView('STATUS')} className="text-xs bg-slate-800 px-3 py-1 rounded text-slate-400 hover:text-white">Close</button>
                 </div>
                 <div className="flex-1 p-4 overflow-y-auto font-mono text-xs text-slate-400 space-y-1">
                    <div className="text-slate-500">--- Log started at {new Date().toLocaleDateString()} ---</div>
                    <div><span className="text-blue-400">[INFO]</span> Service 'megam-vpn' started.</div>
                    <div><span className="text-blue-400">[INFO]</span> Loading configuration from /etc/wireguard/wg0.conf</div>
                    <div><span className="text-yellow-400">[WARN]</span> Split tunneling enabled for 10.0.0.0/8</div>
                    {config.adBlock && <div><span className="text-green-400">[SHIELD]</span> AdGuard DNS sinkhole active.</div>}
                    {config.torBridge && <div><span className="text-orange-400">[SHIELD]</span> Tor Onion Bridge established.</div>}
                    {config.postQuantum && <div><span className="text-purple-400">[CRYPTO]</span> Kyber-1024 Key Exchange initialized.</div>}
                    <div><span className="text-blue-400">[INFO]</span> Interface wg0 up</div>
                    <div><span className="text-blue-400">[INFO]</span> Handshake initiator: 192.168.0.105:51820</div>
                    <div><span className="text-green-400">[SUCCESS]</span> Handshake completed with peer (keepalive 25s)</div>
                    <div><span className="text-blue-400">[INFO]</span> Kill Switch active: firewall rules updated.</div>
                 </div>
             </div>
        )}

      </div>
    </div>
  );
};

export default VPNManager;