import React, { useState, useEffect } from 'react';
import { Shield, ShieldAlert, Lock, Unlock, Eye, EyeOff, Search, AlertTriangle, CheckCircle2, Terminal, Activity, Wifi, Server, Key, FileCode, Users, XCircle, Zap, Box, Layers, Globe, RefreshCw } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { analyzeApiKey, getThreatFeed, generateSecurityPatch } from '../services/geminiService';

const MegamSentinel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'DASHBOARD' | 'CLOUD_GUARD' | 'CODE_VAULT' | 'AI_DEFENSE'>('DASHBOARD');
  
  // Dashboard State
  const [threats, setThreats] = useState<any[]>([]);
  const [intruders, setIntruders] = useState([
      { id: 'dev1', ip: '192.168.1.105', type: 'WiFi', user: 'Unknown Device', risk: 85, status: 'Active' },
      { id: 'root1', ip: '10.254.0.1', type: 'Root SSH', user: 'superuser', risk: 0, status: 'Authorized' },
  ]);
  const [sysIntegrity, setSysIntegrity] = useState([
      { component: 'Kernel Hash', status: 'MATCH', version: '6.8.0-megam' },
      { component: 'Firmware (UEFI)', status: 'SECURE', version: 'v2.4' },
      { component: 'Bootloader', status: 'SIGNED', version: 'GRUB 2.06' },
  ]);

  // Pre-flight Analyzer State
  const [apiKey, setApiKey] = useState('');
  const [scanResult, setScanResult] = useState<{safe: boolean, risk: string, source: string} | null>(null);
  const [isScanningKey, setIsScanningKey] = useState(false);

  // AI Defense State
  const [aiFilters, setAiFilters] = useState({
      profanity: true,
      clickbait: true,
      phishing: true,
      socialEng: true
  });

  // Solution Bank State
  const [selectedThreat, setSelectedThreat] = useState<string>('DDoS Mitigation');
  const [patchCode, setPatchCode] = useState('');
  const [isGeneratingPatch, setIsGeneratingPatch] = useState(false);

  // Poll for Threat Feed
  useEffect(() => {
      const interval = setInterval(async () => {
          if (activeTab === 'DASHBOARD') {
              const newThreats = await getThreatFeed();
              setThreats(prev => [...newThreats, ...prev].slice(0, 10));
          }
      }, 3000);
      return () => clearInterval(interval);
  }, [activeTab]);

  const handleScanKey = async () => {
      if (!apiKey) return;
      setIsScanningKey(true);
      setScanResult(null);
      const res = await analyzeApiKey(apiKey);
      setScanResult(res);
      setIsScanningKey(false);
  };

  const handleKickUser = (id: string) => {
      setIntruders(prev => prev.filter(u => u.id !== id));
      // Simulate kick action log
      setThreats(prev => [{
          id: Date.now(), type: 'Admin Action', source: 'Sentinel', severity: 'INFO', timestamp: new Date().toLocaleTimeString()
      }, ...prev]);
  };

  const handleGeneratePatch = async () => {
      setIsGeneratingPatch(true);
      const code = await generateSecurityPatch(selectedThreat);
      setPatchCode(code);
      setIsGeneratingPatch(false);
  };

  return (
    <div className="h-full flex flex-col bg-[#050505] text-slate-200 font-sans border-x border-slate-900">
      {/* Header */}
      <div className="border-b border-slate-900 bg-slate-950/80 p-6 flex justify-between items-center">
          <div className="flex items-center gap-4">
              <div className="p-3 bg-red-900/20 rounded-xl border border-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.2)]">
                  <ShieldAlert size={24} className="text-red-500"/>
              </div>
              <div>
                  <h1 className="text-xl font-bold text-white tracking-wide">Megam Sentinel</h1>
                  <p className="text-slate-500 text-xs font-mono">Security Operations Center (SOC)</p>
              </div>
          </div>
          
          <div className="flex bg-slate-900 rounded-lg p-1 border border-slate-800">
              {[
                  { id: 'DASHBOARD', label: 'Threat Intel', icon: Activity },
                  { id: 'CLOUD_GUARD', label: 'Cloud Guard', icon: Server },
                  { id: 'CODE_VAULT', label: 'Solution Bank', icon: FileCode },
                  { id: 'AI_DEFENSE', label: 'Cognitive Firewall', icon: Zap },
              ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-md text-xs font-bold transition ${activeTab === tab.id ? 'bg-red-900/30 text-red-400 border border-red-500/30' : 'text-slate-500 hover:text-white hover:bg-slate-900'}`}
                  >
                      {/* @ts-ignore */}
                      <tab.icon size={14} /> {tab.label}
                  </button>
              ))}
          </div>
      </div>

      <div className="flex-1 overflow-y-auto p-8 bg-[#0a0a0a] relative">
          {/* Matrix Background Effect */}
          <div className="absolute inset-0 pointer-events-none opacity-5" style={{backgroundImage: 'linear-gradient(0deg, transparent 24%, rgba(32, 255, 77, .3) 25%, rgba(32, 255, 77, .3) 26%, transparent 27%, transparent 74%, rgba(32, 255, 77, .3) 75%, rgba(32, 255, 77, .3) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(32, 255, 77, .3) 25%, rgba(32, 255, 77, .3) 26%, transparent 27%, transparent 74%, rgba(32, 255, 77, .3) 75%, rgba(32, 255, 77, .3) 76%, transparent 77%, transparent)', backgroundSize: '50px 50px'}}></div>

          {activeTab === 'DASHBOARD' && (
              <div className="max-w-7xl mx-auto space-y-8 relative z-10">
                  {/* Status KPI */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                      <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-xl relative overflow-hidden group">
                          <div className="absolute -right-4 -top-4 bg-red-500/10 w-24 h-24 rounded-full blur-xl group-hover:bg-red-500/20 transition"></div>
                          <h3 className="text-xs font-bold text-slate-500 uppercase mb-2">Active Threats</h3>
                          <div className="text-3xl font-mono text-red-500 font-bold flex items-center gap-2">
                              {threats.length} <Activity className="animate-pulse"/>
                          </div>
                      </div>
                      <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-xl">
                          <h3 className="text-xs font-bold text-slate-500 uppercase mb-2">Firewall Status</h3>
                          <div className="text-3xl font-mono text-green-500 font-bold flex items-center gap-2">
                              ACTIVE <CheckCircle2/>
                          </div>
                      </div>
                      <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-xl">
                          <h3 className="text-xs font-bold text-slate-500 uppercase mb-2">Intrusion Attempts</h3>
                          <div className="text-3xl font-mono text-orange-500 font-bold">14,023</div>
                      </div>
                      <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-xl">
                          <h3 className="text-xs font-bold text-slate-500 uppercase mb-2">System Health</h3>
                          <div className="text-3xl font-mono text-blue-500 font-bold">99.9%</div>
                      </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {/* Threat Feed */}
                      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 h-96 flex flex-col">
                          <h3 className="font-bold text-white mb-4 flex items-center gap-2"><Globe size={18} className="text-red-500"/> Live Attack Vector Map</h3>
                          <div className="flex-1 overflow-y-auto space-y-2 font-mono text-xs">
                              {threats.length === 0 && <div className="text-slate-600 italic">Scanning network traffic...</div>}
                              {threats.map((t, i) => (
                                  <div key={i} className="flex items-center justify-between p-2 bg-black/40 border border-slate-800 rounded hover:border-red-900/50 transition">
                                      <div className="flex items-center gap-3">
                                          <span className={`w-2 h-2 rounded-full ${t.severity === 'CRITICAL' ? 'bg-red-500 animate-ping' : t.severity === 'HIGH' ? 'bg-orange-500' : 'bg-yellow-500'}`}></span>
                                          <span className="text-red-400 font-bold">{t.type}</span>
                                      </div>
                                      <span className="text-slate-500">{t.source}</span>
                                      <span className="text-slate-600">{t.timestamp}</span>
                                  </div>
                              ))}
                          </div>
                      </div>

                      {/* Intruder Identifier */}
                      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 h-96 flex flex-col">
                          <h3 className="font-bold text-white mb-4 flex items-center gap-2"><Users size={18} className="text-yellow-500"/> Intruder Identifier (Root/WiFi)</h3>
                          <div className="flex-1 space-y-3">
                              {intruders.map(u => (
                                  <div key={u.id} className="flex items-center justify-between p-4 bg-slate-950 border border-slate-800 rounded-lg">
                                      <div className="flex items-center gap-4">
                                          <div className={`p-2 rounded-lg ${u.type === 'WiFi' ? 'bg-blue-900/20 text-blue-400' : 'bg-red-900/20 text-red-400'}`}>
                                              {u.type === 'WiFi' ? <Wifi size={18}/> : <Terminal size={18}/>}
                                          </div>
                                          <div>
                                              <div className="font-bold text-sm text-white">{u.user}</div>
                                              <div className="text-xs text-slate-500 font-mono">{u.ip}</div>
                                          </div>
                                      </div>
                                      <div className="flex items-center gap-4">
                                          <div className="text-right">
                                              <div className="text-[10px] text-slate-500 uppercase">Risk Score</div>
                                              <div className={`text-sm font-bold ${u.risk > 50 ? 'text-red-500' : 'text-green-500'}`}>{u.risk}/100</div>
                                          </div>
                                          {u.risk > 0 && (
                                              <button onClick={() => handleKickUser(u.id)} className="bg-red-600 hover:bg-red-500 text-white p-2 rounded-lg transition">
                                                  <XCircle size={16}/>
                                              </button>
                                          )}
                                      </div>
                                  </div>
                              ))}
                          </div>
                      </div>
                  </div>

                  {/* System Integrity */}
                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                      <h3 className="font-bold text-white mb-6 flex items-center gap-2"><Box size={18} className="text-blue-500"/> Hardware & Firmware Integrity</h3>
                      <div className="grid grid-cols-3 gap-4">
                          {sysIntegrity.map((s, i) => (
                              <div key={i} className="flex items-center justify-between p-4 bg-slate-950 border border-slate-800 rounded-lg">
                                  <div>
                                      <div className="text-xs text-slate-500 uppercase font-bold mb-1">{s.component}</div>
                                      <div className="text-sm text-white font-mono">{s.version}</div>
                                  </div>
                                  <div className="flex items-center gap-2 text-green-400 text-xs font-bold bg-green-900/20 px-3 py-1 rounded-full border border-green-900/50">
                                      <CheckCircle2 size={12}/> {s.status}
                                  </div>
                              </div>
                          ))}
                      </div>
                  </div>
              </div>
          )}

          {activeTab === 'CLOUD_GUARD' && (
              <div className="max-w-4xl mx-auto space-y-8">
                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-8">
                      <div className="text-center mb-8">
                          <h2 className="text-2xl font-bold text-white mb-2 flex items-center justify-center gap-2"><Key size={24} className="text-yellow-500"/> API Pre-Flight Analyzer</h2>
                          <p className="text-slate-400 text-sm">Scan API keys, Webhooks, and Secrets before integrating them into your production environment.</p>
                      </div>

                      <div className="max-w-2xl mx-auto space-y-6">
                          <div className="relative">
                              <input 
                                type="text" 
                                value={apiKey}
                                onChange={(e) => setApiKey(e.target.value)}
                                className="w-full bg-black border border-slate-700 rounded-xl py-4 pl-12 pr-4 text-white font-mono text-sm outline-none focus:border-yellow-500 transition"
                                placeholder="Paste API Key or Token here..."
                              />
                              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20}/>
                          </div>

                          <button 
                            onClick={handleScanKey}
                            disabled={isScanningKey || !apiKey}
                            className="w-full py-3 bg-yellow-600 hover:bg-yellow-500 text-black font-bold rounded-xl flex items-center justify-center gap-2 transition disabled:opacity-50"
                          >
                              {isScanningKey ? <RefreshCw className="animate-spin" size={20}/> : <Shield size={20}/>}
                              {isScanningKey ? 'Analyzing Entropy & Leak DBs...' : 'Scan Credential'}
                          </button>

                          {scanResult && (
                              <div className={`p-6 rounded-xl border animate-in fade-in slide-in-from-top-4 ${scanResult.safe ? 'bg-green-900/10 border-green-500/30' : 'bg-red-900/10 border-red-500/30'}`}>
                                  <div className="flex items-center gap-4 mb-4">
                                      <div className={`p-3 rounded-full ${scanResult.safe ? 'bg-green-500 text-black' : 'bg-red-500 text-white'}`}>
                                          {scanResult.safe ? <CheckCircle2 size={24}/> : <AlertTriangle size={24}/>}
                                      </div>
                                      <div>
                                          <h3 className={`text-lg font-bold ${scanResult.safe ? 'text-green-400' : 'text-red-400'}`}>
                                              {scanResult.safe ? 'Safe to Use' : 'Security Risk Detected'}
                                          </h3>
                                          <p className="text-xs text-slate-400">Analysis Source: {scanResult.source}</p>
                                      </div>
                                  </div>
                                  <div className="bg-black/30 p-4 rounded-lg font-mono text-xs text-slate-300">
                                      Risk Assessment: <span className={scanResult.safe ? 'text-green-400' : 'text-red-400 font-bold'}>{scanResult.risk}</span>
                                  </div>
                              </div>
                          )}
                      </div>
                  </div>

                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                      <h3 className="font-bold text-white mb-4">Cloud Connector Allowlist</h3>
                      <div className="space-y-2">
                          {['AWS S3 (US-East)', 'Google Maps API', 'Stripe Payments', 'SendGrid Mail'].map((c, i) => (
                              <div key={i} className="flex items-center justify-between p-3 bg-slate-950 border border-slate-800 rounded hover:border-blue-500/30 transition">
                                  <div className="flex items-center gap-3">
                                      <Globe size={16} className="text-blue-500"/>
                                      <span className="text-sm text-slate-300">{c}</span>
                                  </div>
                                  <span className="text-[10px] font-bold text-green-500 bg-green-900/20 px-2 py-0.5 rounded">VERIFIED</span>
                              </div>
                          ))}
                      </div>
                  </div>
              </div>
          )}

          {activeTab === 'CODE_VAULT' && (
              <div className="h-full flex gap-8">
                  <div className="w-80 bg-slate-900 border border-slate-800 rounded-xl p-6">
                      <h3 className="font-bold text-white mb-4 flex items-center gap-2"><FileCode size={18} className="text-purple-500"/> Patch Generator</h3>
                      <div className="space-y-2">
                          {['DDoS Mitigation', 'SQL Injection Hardening', 'SSH Key Rotation', 'Apache ModSecurity', 'Nginx Rate Limit'].map(t => (
                              <button 
                                key={t} 
                                onClick={() => setSelectedThreat(t)}
                                className={`w-full text-left px-4 py-3 rounded text-sm transition ${selectedThreat === t ? 'bg-purple-900/20 text-purple-400 border border-purple-500/30' : 'bg-slate-950 text-slate-400 hover:text-white'}`}
                              >
                                  {t}
                              </button>
                          ))}
                      </div>
                      <button 
                        onClick={handleGeneratePatch}
                        disabled={isGeneratingPatch}
                        className="w-full mt-6 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded font-bold text-xs flex items-center justify-center gap-2"
                      >
                          {isGeneratingPatch ? <RefreshCw className="animate-spin" size={14}/> : <Zap size={14}/>} Generate Code
                      </button>
                  </div>

                  <div className="flex-1 bg-[#1e1e1e] border border-slate-800 rounded-xl flex flex-col overflow-hidden">
                      <div className="bg-[#252526] p-3 flex justify-between items-center border-b border-black">
                          <span className="text-xs text-slate-400 font-mono">security_patch.sh</span>
                          <div className="flex gap-2">
                              <span className="w-3 h-3 rounded-full bg-red-500"></span>
                              <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
                              <span className="w-3 h-3 rounded-full bg-green-500"></span>
                          </div>
                      </div>
                      <div className="flex-1 p-6 overflow-auto font-mono text-sm text-green-400">
                          <pre>{patchCode || '# Select a threat and generate a patch...'}</pre>
                      </div>
                  </div>
              </div>
          )}

          {activeTab === 'AI_DEFENSE' && (
              <div className="max-w-4xl mx-auto space-y-8">
                  <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-blue-500/30 p-8 rounded-xl">
                      <h2 className="text-2xl font-bold text-white mb-2">Cognitive Firewall</h2>
                      <p className="text-slate-400 text-sm mb-8">AI-powered filtering for content, tone, and social engineering attacks.</p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 flex justify-between items-center">
                              <div>
                                  <h4 className="font-bold text-white flex items-center gap-2"><EyeOff size={18} className="text-red-400"/> Profanity Filter</h4>
                                  <p className="text-xs text-slate-500 mt-1">Block toxic language in inputs.</p>
                              </div>
                              <button onClick={() => setAiFilters({...aiFilters, profanity: !aiFilters.profanity})} className={`w-12 h-6 rounded-full relative transition-colors ${aiFilters.profanity ? 'bg-green-500' : 'bg-slate-700'}`}>
                                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${aiFilters.profanity ? 'left-7' : 'left-1'}`}></div>
                              </button>
                          </div>

                          <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 flex justify-between items-center">
                              <div>
                                  <h4 className="font-bold text-white flex items-center gap-2"><AlertTriangle size={18} className="text-yellow-400"/> Clickbait Shield</h4>
                                  <p className="text-xs text-slate-500 mt-1">Flag sensationalist headlines.</p>
                              </div>
                              <button onClick={() => setAiFilters({...aiFilters, clickbait: !aiFilters.clickbait})} className={`w-12 h-6 rounded-full relative transition-colors ${aiFilters.clickbait ? 'bg-green-500' : 'bg-slate-700'}`}>
                                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${aiFilters.clickbait ? 'left-7' : 'left-1'}`}></div>
                              </button>
                          </div>

                          <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 flex justify-between items-center">
                              <div>
                                  <h4 className="font-bold text-white flex items-center gap-2"><Lock size={18} className="text-blue-400"/> Phishing Guard</h4>
                                  <p className="text-xs text-slate-500 mt-1">Scan URLs for malicious patterns.</p>
                              </div>
                              <button onClick={() => setAiFilters({...aiFilters, phishing: !aiFilters.phishing})} className={`w-12 h-6 rounded-full relative transition-colors ${aiFilters.phishing ? 'bg-green-500' : 'bg-slate-700'}`}>
                                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${aiFilters.phishing ? 'left-7' : 'left-1'}`}></div>
                              </button>
                          </div>

                          <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 flex justify-between items-center">
                              <div>
                                  <h4 className="font-bold text-white flex items-center gap-2"><Users size={18} className="text-purple-400"/> Social Eng. Detector</h4>
                                  <p className="text-xs text-slate-500 mt-1">Analyze communication for manipulation.</p>
                              </div>
                              <button onClick={() => setAiFilters({...aiFilters, socialEng: !aiFilters.socialEng})} className={`w-12 h-6 rounded-full relative transition-colors ${aiFilters.socialEng ? 'bg-green-500' : 'bg-slate-700'}`}>
                                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${aiFilters.socialEng ? 'left-7' : 'left-1'}`}></div>
                              </button>
                          </div>
                      </div>
                  </div>
              </div>
          )}
      </div>
    </div>
  );
};

export default MegamSentinel;