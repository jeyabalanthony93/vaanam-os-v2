import React, { useState, useEffect, useRef } from 'react';
import { Server, Activity, Globe, Key, Settings, Sliders, Database, Cpu, Zap, Microchip, Play, Pause, Terminal as TerminalIcon, BarChart3, Layers, Code, CheckCircle2, Shield, Network, Map, Lock, RefreshCw, Box } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Infrastructure: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'LB' | 'DNS' | 'API' | 'GPU'>('LB');
  const [isApplying, setIsApplying] = useState(false);
  
  // Load Balancer State
  const [lbAlgo, setLbAlgo] = useState('ROUND_ROBIN');
  const [sslEnabled, setSslEnabled] = useState(true);
  const [healthCheckInterval, setHealthCheckInterval] = useState(30);

  // DNS State
  const [wafEnabled, setWafEnabled] = useState(true);
  const [dnssec, setDnssec] = useState(true);

  // API State
  const [rateLimit, setRateLimit] = useState(1000);
  const [apiGatewayStatus, setApiGatewayStatus] = useState('ONLINE');

  // GPU State
  const [gpuMode, setGpuMode] = useState(false);
  const [trainingActive, setTrainingActive] = useState(false);
  const [selectedModel, setSelectedModel] = useState('Llama-3-70B-Instruct');
  const [selectedFramework, setSelectedFramework] = useState('PyTorch');
  const [logs, setLogs] = useState<string[]>([]);
  const [metrics, setMetrics] = useState({
      vram: 0,
      utilization: 0,
      temp: 45,
      power: 120,
      loss: 2.5
  });
  const [chartData, setChartData] = useState<{time: number, loss: number, accuracy: number}[]>([]);
  const logContainerRef = useRef<HTMLDivElement>(null);

  // Simulation Loop
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (trainingActive && gpuMode) {
        let step = 0;
        interval = setInterval(() => {
            step++;
            // Update Metrics with some noise
            setMetrics(prev => ({
                vram: Math.min(320, prev.vram + (Math.random() * 5)),
                utilization: Math.min(100, 95 + (Math.random() * 5)),
                temp: Math.min(90, 75 + (Math.random() * 10)),
                power: Math.min(700, 650 + (Math.random() * 50)),
                loss: Math.max(0.1, prev.loss * 0.98) // Decaying loss
            }));

            // Update Chart
            setChartData(prev => {
                const newData = [...prev, {
                    time: step,
                    loss: Math.max(0.1, 2.5 * Math.pow(0.98, step)) + (Math.random() * 0.1),
                    accuracy: Math.min(0.99, 0.1 + (step * 0.01))
                }];
                return newData.slice(-20); // Keep last 20 points
            });

            // Generate Logs
            const timestamp = new Date().toISOString().split('T')[1].slice(0,8);
            const newLog = `[${timestamp}] [GPU-0] Epoch ${Math.floor(step/10)+1} Batch ${step%100}/1000 | Loss: ${metrics.loss.toFixed(4)} | Acc: ${(0.1 + (step * 0.01)).toFixed(2)} | ${selectedFramework}::DistributedDataParallel`;
            
            setLogs(prev => [...prev.slice(-15), newLog]);
            
            // Auto scroll
            if (logContainerRef.current) {
                logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
            }

        }, 800);
    } else {
        // Cooldown
        setMetrics(prev => ({
            vram: Math.max(0, prev.vram - 10),
            utilization: 0,
            temp: Math.max(45, prev.temp - 1),
            power: Math.max(120, prev.power - 10),
            loss: 2.5
        }));
    }
    return () => clearInterval(interval);
  }, [trainingActive, gpuMode, metrics.loss, selectedFramework]);

  const toggleGpu = () => {
      setGpuMode(!gpuMode);
      if (gpuMode) {
          setTrainingActive(false);
          setLogs([]);
          setChartData([]);
      } else {
          setLogs(['[SYSTEM] Initializing Neural Bridge Adapter v4.0...', '[SYSTEM] Handshaking with Virtual H100 Cluster... Connected.']);
      }
  };

  const handleApplyConfig = () => {
      setIsApplying(true);
      setTimeout(() => setIsApplying(false), 1500);
  };

  return (
    <div className="h-full flex flex-col bg-slate-950 text-slate-200">
      <div className="border-b border-slate-800 p-6 bg-slate-900/50">
        <h1 className="text-2xl font-bold flex items-center gap-3">
           <Server className="text-indigo-400" />
           Badal Cloud Infrastructure
        </h1>
        <p className="text-slate-400 mt-1">High-performance Open Source Control Plane. Powered by SS360.</p>
      </div>

      <div className="flex border-b border-slate-800 overflow-x-auto">
         <button 
           onClick={() => setActiveTab('LB')}
           className={`px-6 py-4 font-medium flex items-center gap-2 transition whitespace-nowrap ${activeTab === 'LB' ? 'text-cyan-400 border-b-2 border-cyan-400 bg-slate-900' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'}`}
         >
            <Activity size={18} /> Load Balancer
         </button>
         <button 
           onClick={() => setActiveTab('DNS')}
           className={`px-6 py-4 font-medium flex items-center gap-2 transition whitespace-nowrap ${activeTab === 'DNS' ? 'text-cyan-400 border-b-2 border-cyan-400 bg-slate-900' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'}`}
         >
            <Globe size={18} /> DNS Manager
         </button>
         <button 
           onClick={() => setActiveTab('API')}
           className={`px-6 py-4 font-medium flex items-center gap-2 transition whitespace-nowrap ${activeTab === 'API' ? 'text-cyan-400 border-b-2 border-cyan-400 bg-slate-900' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'}`}
         >
            <Key size={18} /> API & Secrets
         </button>
         <button 
           onClick={() => setActiveTab('GPU')}
           className={`px-6 py-4 font-medium flex items-center gap-2 transition whitespace-nowrap ${activeTab === 'GPU' ? 'text-cyan-400 border-b-2 border-cyan-400 bg-slate-900' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'}`}
         >
            <Cpu size={18} /> GPU AI Compute
         </button>
      </div>

      <div className="flex-1 overflow-y-auto p-8 bg-slate-950/50">
         
         {activeTab === 'LB' && (
            <div className="max-w-6xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Visual Topology */}
                    <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-6 relative overflow-hidden">
                        <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2"><Network size={20} className="text-cyan-400"/> Traffic Topology</h3>
                        <div className="flex justify-between items-center h-64 relative z-10 px-8">
                            {/* Client */}
                            <div className="flex flex-col items-center gap-2">
                                <div className="p-4 bg-slate-800 rounded-full border border-slate-700 shadow-lg">
                                    <Globe size={32} className="text-blue-400"/>
                                </div>
                                <span className="text-xs font-bold text-slate-500">Internet</span>
                            </div>
                            
                            {/* Animated Line */}
                            <div className="flex-1 h-1 bg-slate-800 mx-4 relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent w-1/2 animate-[shimmer_2s_infinite]"></div>
                            </div>

                            {/* LB Node */}
                            <div className="flex flex-col items-center gap-2">
                                <div className="p-6 bg-cyan-900/20 rounded-xl border border-cyan-500/50 shadow-[0_0_20px_rgba(6,182,212,0.2)]">
                                    <Activity size={40} className="text-cyan-400"/>
                                </div>
                                <span className="text-xs font-bold text-cyan-400">Badal LB</span>
                            </div>

                            {/* Branching Lines */}
                            <div className="flex flex-col h-full justify-center mx-4 gap-8">
                                <div className="w-16 h-px bg-slate-700 relative overflow-hidden rotate-[-20deg] origin-left top-4">
                                     <div className="absolute inset-0 bg-cyan-500 animate-[shimmer_2s_infinite] delay-75"></div>
                                </div>
                                <div className="w-16 h-px bg-slate-700 relative overflow-hidden rotate-[20deg] origin-left bottom-4">
                                     <div className="absolute inset-0 bg-cyan-500 animate-[shimmer_2s_infinite] delay-150"></div>
                                </div>
                            </div>

                            {/* Server Nodes */}
                            <div className="flex flex-col gap-6">
                                <div className="flex items-center gap-3 p-3 bg-slate-800 rounded-lg border border-slate-700 border-l-4 border-l-green-500">
                                    <Server size={20} className="text-slate-300"/>
                                    <div>
                                        <div className="text-xs font-bold text-white">US-East</div>
                                        <div className="text-[10px] text-green-400">Healthy (24ms)</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-3 bg-slate-800 rounded-lg border border-slate-700 border-l-4 border-l-green-500">
                                    <Server size={20} className="text-slate-300"/>
                                    <div>
                                        <div className="text-xs font-bold text-white">EU-West</div>
                                        <div className="text-[10px] text-green-400">Healthy (88ms)</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Configuration Panel */}
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col justify-between">
                        <div>
                            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2"><Sliders size={20} className="text-purple-400"/> Balancing Strategy</h3>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase">Algorithm</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {['ROUND_ROBIN', 'LEAST_CONN', 'IP_HASH', 'WEIGHTED'].map(algo => (
                                            <button 
                                                key={algo}
                                                onClick={() => setLbAlgo(algo)}
                                                className={`text-[10px] font-bold py-2 rounded border transition ${lbAlgo === algo ? 'bg-cyan-600 border-cyan-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'}`}
                                            >
                                                {algo.replace('_', ' ')}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase">Health Check Interval</label>
                                    <input 
                                        type="range" 
                                        min="5" max="300" 
                                        value={healthCheckInterval} 
                                        onChange={(e) => setHealthCheckInterval(parseInt(e.target.value))}
                                        className="w-full accent-cyan-500"
                                    />
                                    <div className="text-right text-xs text-cyan-400 font-mono">{healthCheckInterval}s</div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="pt-6 border-t border-slate-800">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-sm font-bold text-white flex items-center gap-2"><Lock size={14}/> SSL Offloading</span>
                                <button onClick={() => setSslEnabled(!sslEnabled)} className={`w-10 h-5 rounded-full relative transition-colors ${sslEnabled ? 'bg-green-500' : 'bg-slate-700'}`}>
                                    <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-transform ${sslEnabled ? 'translate-x-6' : 'translate-x-1'}`}></div>
                                </button>
                            </div>
                            <button 
                                onClick={handleApplyConfig}
                                className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg font-bold shadow-lg shadow-cyan-900/20 flex items-center justify-center gap-2"
                            >
                                {isApplying ? <RefreshCw className="animate-spin" size={18}/> : <CheckCircle2 size={18}/>}
                                {isApplying ? 'Propagating...' : 'Apply Configuration'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
         )}

         {activeTab === 'DNS' && (
            <div className="max-w-6xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Global Map Visualizer */}
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 relative overflow-hidden h-80">
                        <div className="absolute inset-0 opacity-20 bg-[url('https://upload.wikimedia.org/wikipedia/commons/e/ec/World_map_blank_without_borders.svg')] bg-cover bg-center grayscale pointer-events-none"></div>
                        <h3 className="text-lg font-bold text-white mb-2 relative z-10 flex items-center gap-2"><Map size={20} className="text-green-400"/> Global Propagation</h3>
                        
                        {/* Ping Points */}
                        {[
                            { top: '30%', left: '20%', label: 'NA' },
                            { top: '25%', left: '50%', label: 'EU' },
                            { top: '40%', left: '70%', label: 'AS' },
                            { top: '70%', left: '80%', label: 'AU' },
                        ].map((pin, i) => (
                            <div key={i} className="absolute flex flex-col items-center" style={{top: pin.top, left: pin.left}}>
                                <div className="w-3 h-3 bg-green-500 rounded-full animate-ping absolute"></div>
                                <div className="w-3 h-3 bg-green-500 rounded-full relative border border-black"></div>
                                <span className="text-[10px] font-bold text-green-400 bg-black/50 px-1 rounded mt-1">{pin.label}</span>
                            </div>
                        ))}
                    </div>

                    <div className="space-y-6">
                        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                            <h3 className="font-bold text-white mb-4 flex items-center gap-2"><Shield size={18} className="text-orange-400"/> WAF & Security</h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-3 bg-slate-950 rounded border border-slate-800">
                                    <div>
                                        <div className="text-sm font-bold text-white">Web Application Firewall</div>
                                        <div className="text-xs text-slate-500">Block SQLi, XSS, and bot traffic.</div>
                                    </div>
                                    <button onClick={() => setWafEnabled(!wafEnabled)} className={`w-10 h-5 rounded-full relative transition-colors ${wafEnabled ? 'bg-orange-500' : 'bg-slate-700'}`}>
                                        <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-transform ${wafEnabled ? 'translate-x-6' : 'translate-x-1'}`}></div>
                                    </button>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-slate-950 rounded border border-slate-800">
                                    <div>
                                        <div className="text-sm font-bold text-white">DNSSEC Signing</div>
                                        <div className="text-xs text-slate-500">Cryptographic authentication of DNS records.</div>
                                    </div>
                                    <button onClick={() => setDnssec(!dnssec)} className={`w-10 h-5 rounded-full relative transition-colors ${dnssec ? 'bg-blue-500' : 'bg-slate-700'}`}>
                                        <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-transform ${dnssec ? 'translate-x-6' : 'translate-x-1'}`}></div>
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                             <div className="flex justify-between items-center mb-4">
                                 <h3 className="font-bold text-white">DNS Records</h3>
                                 <button className="text-xs bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded font-bold transition">+ Add Record</button>
                             </div>
                             <div className="space-y-2">
                                 {[
                                     { type: 'A', name: '@', val: '192.0.2.1', ttl: 'Auto' },
                                     { type: 'CNAME', name: 'www', val: 'megamos.com', ttl: 'Auto' },
                                     { type: 'TXT', name: '_dmarc', val: 'v=DMARC1; p=reject;', ttl: '1h' },
                                 ].map((rec, i) => (
                                     <div key={i} className="flex items-center justify-between p-2 bg-slate-950/50 rounded border border-slate-800 text-xs">
                                         <span className="font-bold text-indigo-400 w-12">{rec.type}</span>
                                         <span className="text-white w-20">{rec.name}</span>
                                         <span className="text-slate-400 flex-1 font-mono truncate px-2">{rec.val}</span>
                                         <span className="text-slate-600">{rec.ttl}</span>
                                     </div>
                                 ))}
                             </div>
                        </div>
                    </div>
                </div>
            </div>
         )}

         {activeTab === 'API' && (
             <div className="max-w-6xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                     <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                         <h3 className="font-bold text-white mb-6 flex items-center gap-2"><Key size={20} className="text-yellow-400"/> API Secrets Vault</h3>
                         <div className="space-y-4">
                             <div className="p-4 bg-black/40 rounded-lg border border-slate-800 relative group">
                                 <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Production Key</label>
                                 <div className="font-mono text-sm text-green-400 truncate">sk_live_badal_892374...</div>
                                 <button className="absolute top-2 right-2 p-1 hover:bg-slate-800 rounded text-slate-500 hover:text-white opacity-0 group-hover:opacity-100 transition"><Settings size={12}/></button>
                             </div>
                             <div className="p-4 bg-black/40 rounded-lg border border-slate-800 relative group">
                                 <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Test Key</label>
                                 <div className="font-mono text-sm text-yellow-400 truncate">sk_test_badal_110293...</div>
                                 <button className="absolute top-2 right-2 p-1 hover:bg-slate-800 rounded text-slate-500 hover:text-white opacity-0 group-hover:opacity-100 transition"><Settings size={12}/></button>
                             </div>
                             <button className="w-full py-2 border border-dashed border-slate-700 text-slate-500 hover:text-white hover:border-slate-500 rounded text-xs font-bold transition">
                                 Rotate Secrets
                             </button>
                         </div>
                     </div>

                     <div className="lg:col-span-2 space-y-6">
                         <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                             <h3 className="font-bold text-white mb-6 flex items-center gap-2"><Layers size={20} className="text-blue-400"/> Service Mesh & Rate Limiting</h3>
                             <div className="space-y-6">
                                 <div>
                                     <div className="flex justify-between text-sm mb-2">
                                         <span className="text-slate-400">Global Rate Limit</span>
                                         <span className="text-white font-mono">{rateLimit} req/s</span>
                                     </div>
                                     <input 
                                        type="range" 
                                        min="100" max="5000" step="100"
                                        value={rateLimit}
                                        onChange={(e) => setRateLimit(parseInt(e.target.value))}
                                        className="w-full accent-blue-500"
                                     />
                                 </div>
                                 
                                 <div className="flex gap-4">
                                     <div className="flex-1 p-4 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-between">
                                         <div>
                                             <div className="font-bold text-white text-sm">OIDC Auth</div>
                                             <div className="text-xs text-slate-500">Badal Auth Integration</div>
                                         </div>
                                         <div className="w-3 h-3 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
                                     </div>
                                     <div className="flex-1 p-4 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-between">
                                         <div>
                                             <div className="font-bold text-white text-sm">Telemetry</div>
                                             <div className="text-xs text-slate-500">Prometheus / Grafana</div>
                                         </div>
                                         <div className="w-3 h-3 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
                                     </div>
                                 </div>
                             </div>
                         </div>

                         <div className="bg-gradient-to-r from-indigo-900/40 to-blue-900/40 border border-indigo-500/30 rounded-xl p-6 flex items-center justify-between">
                             <div>
                                 <h3 className="font-bold text-white text-lg">Generate Client SDK</h3>
                                 <p className="text-sm text-slate-400">Auto-generate typed SDKs for TypeScript, Python, and Go based on your API schema.</p>
                             </div>
                             <button className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-lg font-bold flex items-center gap-2 shadow-lg shadow-indigo-900/20 transition transform hover:scale-105">
                                 <Code size={18}/> Generate
                             </button>
                         </div>
                     </div>
                 </div>
             </div>
         )}

         {activeTab === 'GPU' && (
             <div className="max-w-7xl space-y-6">
                 {/* Header & Main Toggle */}
                 <div className="bg-gradient-to-r from-indigo-950 to-slate-900 rounded-2xl p-8 border border-indigo-500/30 relative overflow-hidden shadow-2xl">
                    <div className="absolute top-0 right-0 p-8 opacity-10 animate-pulse">
                        <Zap size={300} />
                    </div>
                    <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
                        <div>
                            <div className="inline-flex items-center gap-2 bg-indigo-500/20 text-indigo-200 px-3 py-1 rounded-full text-xs font-bold uppercase mb-4 border border-indigo-400/20 shadow-[0_0_15px_rgba(99,102,241,0.3)]">
                                <Microchip size={14} className="fill-current" /> Neural Bridge™ Engine v3.0
                            </div>
                            <h2 className="text-4xl font-bold text-white mb-2">Virtual GPU Acceleration</h2>
                            <p className="text-indigo-200 max-w-xl text-lg">
                                Real-time x86 to CUDA PTX translation layer. Transform standard CPU clusters into high-performance Tensor Cores for AI training.
                            </p>
                        </div>
                        
                        <div className="flex flex-col items-end gap-4">
                             <button 
                                onClick={toggleGpu}
                                className={`group px-8 py-6 rounded-2xl font-bold text-lg flex items-center gap-4 transition-all border-2 ${
                                    gpuMode 
                                    ? 'bg-green-500/10 border-green-500 text-green-400 shadow-[0_0_50px_rgba(34,197,94,0.3)]' 
                                    : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:bg-slate-800 hover:border-slate-500'
                                }`}
                            >
                                <div className={`p-3 rounded-full transition-all ${gpuMode ? 'bg-green-500 text-slate-900' : 'bg-slate-700 text-slate-500'}`}>
                                   <Zap size={24} className={gpuMode ? 'fill-current animate-pulse' : ''} />
                                </div>
                                <div className="text-left">
                                    <div className="text-xs uppercase tracking-wider font-semibold opacity-70">Status</div>
                                    <div className="text-xl">{gpuMode ? 'NEURAL BRIDGE ACTIVE' : 'ENABLE BRIDGE'}</div>
                                </div>
                            </button>
                        </div>
                    </div>
                 </div>

                 {/* GPU Dashboard Content */}
                 {gpuMode && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        
                        {/* Left Column: Configuration & Status */}
                        <div className="space-y-6">
                            {/* Model Selection */}
                            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 backdrop-blur-sm">
                                <h3 className="text-sm font-bold text-slate-400 uppercase mb-4 flex items-center gap-2">
                                    <Settings size={14} /> Workload Configuration
                                </h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-xs text-slate-500 block mb-1">AI Framework</label>
                                        <div className="grid grid-cols-3 gap-2">
                                            {['PyTorch', 'TensorFlow', 'JAX'].map(fw => (
                                                <button 
                                                    key={fw}
                                                    onClick={() => setSelectedFramework(fw)}
                                                    disabled={trainingActive}
                                                    className={`text-xs py-2 px-1 rounded border transition ${selectedFramework === fw ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'}`}
                                                >
                                                    {fw}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-xs text-slate-500 block mb-1">Model Architecture</label>
                                        <select 
                                            value={selectedModel}
                                            onChange={(e) => setSelectedModel(e.target.value)}
                                            disabled={trainingActive}
                                            className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-sm text-white outline-none focus:border-indigo-500"
                                        >
                                            <option>Llama-3-70B-Instruct</option>
                                            <option>Stable-Diffusion-XL-v1.0</option>
                                            <option>Mistral-Large-Latest</option>
                                            <option>Whisper-v3-Large</option>
                                        </select>
                                    </div>
                                    
                                    <button 
                                        onClick={() => setTrainingActive(!trainingActive)}
                                        className={`w-full py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition ${
                                            trainingActive 
                                            ? 'bg-red-500/20 text-red-400 border border-red-500/50 hover:bg-red-500/30' 
                                            : 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg shadow-indigo-500/20'
                                        }`}
                                    >
                                        {trainingActive ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />}
                                        {trainingActive ? 'Stop Training' : 'Start Training Simulation'}
                                    </button>
                                </div>
                            </div>

                            {/* Live Metrics */}
                            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5">
                                <h3 className="text-sm font-bold text-slate-400 uppercase mb-4 flex items-center gap-2">
                                    <Activity size={14} /> Telemetry
                                </h3>
                                <div className="space-y-4">
                                    <div>
                                        <div className="flex justify-between text-xs mb-1">
                                            <span className="text-slate-400">VRAM Allocation (Virtual)</span>
                                            <span className="text-cyan-400 font-mono">{metrics.vram.toFixed(1)} GB / 320 GB</span>
                                        </div>
                                        <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                                            <div 
                                                className="h-full bg-cyan-500 transition-all duration-300 ease-out" 
                                                style={{ width: `${(metrics.vram / 320) * 100}%` }}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex justify-between text-xs mb-1">
                                            <span className="text-slate-400">Compute Utilization</span>
                                            <span className="text-purple-400 font-mono">{metrics.utilization.toFixed(1)}%</span>
                                        </div>
                                        <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                                            <div 
                                                className="h-full bg-purple-500 transition-all duration-300 ease-out" 
                                                style={{ width: `${metrics.utilization}%` }}
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 pt-2">
                                        <div className="bg-slate-800/50 p-2 rounded text-center">
                                            <div className="text-[10px] text-slate-500 uppercase">Power Draw</div>
                                            <div className="text-lg font-mono text-white">{metrics.power.toFixed(0)}W</div>
                                        </div>
                                        <div className="bg-slate-800/50 p-2 rounded text-center">
                                            <div className="text-[10px] text-slate-500 uppercase">Temp</div>
                                            <div className={`text-lg font-mono ${metrics.temp > 80 ? 'text-red-400' : 'text-green-400'}`}>
                                                {metrics.temp.toFixed(1)}°C
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Middle Column: Visual Cluster & Graphs */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* H100 Grid Visualizer */}
                            <div className="bg-black/40 border border-slate-800 rounded-xl p-6 relative overflow-hidden">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-sm font-bold text-slate-300 flex items-center gap-2">
                                        <Layers size={14} /> Virtual Cluster Topology
                                    </h3>
                                    <div className="flex gap-2 text-[10px] font-mono">
                                        <span className="flex items-center gap-1 text-slate-500"><div className="w-2 h-2 rounded-full bg-slate-700"></div> IDLE</span>
                                        <span className="flex items-center gap-1 text-green-400"><div className="w-2 h-2 rounded-full bg-green-500"></div> ACTIVE</span>
                                        <span className="flex items-center gap-1 text-orange-400"><div className="w-2 h-2 rounded-full bg-orange-500"></div> WARN</span>
                                    </div>
                                </div>
                                
                                <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
                                    {Array.from({ length: 32 }).map((_, i) => (
                                        <div 
                                            key={i}
                                            className={`
                                                aspect-square rounded border transition-all duration-500 flex items-center justify-center relative group
                                                ${trainingActive 
                                                    ? `bg-green-500/${Math.floor(Math.random() * 40 + 10)} border-green-500/30 shadow-[0_0_10px_inset_rgba(34,197,94,0.1)]` 
                                                    : 'bg-slate-900 border-slate-800'}
                                            `}
                                        >
                                            <div className={`w-1.5 h-1.5 rounded-full ${trainingActive ? 'bg-green-400 animate-pulse' : 'bg-slate-800'}`}></div>
                                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-slate-900/90 flex items-center justify-center text-[10px] font-mono text-white pointer-events-none transition-opacity">
                                                GPU-{i}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-4 flex items-center justify-between text-xs font-mono text-slate-500 border-t border-slate-800/50 pt-2">
                                    <span>Architecture: NVIDIA Hopper H100 (Virtual)</span>
                                    <span>Interconnect: 900 GB/s NVLink</span>
                                </div>
                            </div>

                            {/* Charts & Terminal Row */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-64">
                                {/* Training Chart */}
                                <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col">
                                    <h4 className="text-xs font-bold text-slate-400 mb-2 flex items-center gap-2">
                                        <BarChart3 size={14} /> Training Loss / Accuracy
                                    </h4>
                                    <div className="flex-1 min-h-0">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <AreaChart data={chartData}>
                                                <defs>
                                                    <linearGradient id="colorLoss" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                                                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                                                    </linearGradient>
                                                    <linearGradient id="colorAcc" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8}/>
                                                        <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                                                    </linearGradient>
                                                </defs>
                                                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                                                <XAxis hide />
                                                <YAxis hide domain={[0, 3]} />
                                                <Tooltip 
                                                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', fontSize: '12px' }}
                                                    itemStyle={{ padding: 0 }}
                                                />
                                                <Area type="monotone" dataKey="loss" stroke="#ef4444" strokeWidth={2} fillOpacity={1} fill="url(#colorLoss)" />
                                                <Area type="monotone" dataKey="accuracy" stroke="#22c55e" strokeWidth={2} fillOpacity={1} fill="url(#colorAcc)" />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>

                                {/* Live Terminal */}
                                <div className="bg-black border border-slate-800 rounded-xl p-4 font-mono text-xs overflow-hidden flex flex-col">
                                    <h4 className="text-slate-500 mb-2 flex items-center gap-2 border-b border-slate-900 pb-2">
                                        <TerminalIcon size={14} /> /var/log/gpu-cluster.log
                                    </h4>
                                    <div ref={logContainerRef} className="flex-1 overflow-y-auto space-y-1 text-slate-300">
                                        {logs.length === 0 && <span className="text-slate-600 italic">Waiting for job submission...</span>}
                                        {logs.map((log, i) => (
                                            <div key={i} className="break-all">
                                                <span className="text-blue-500 mr-2">➜</span>
                                                {log}
                                            </div>
                                        ))}
                                        {trainingActive && (
                                            <div className="animate-pulse text-green-500">_</div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                 )}

                 {/* Instruction Bridge Visual (Only when active) */}
                 {gpuMode && trainingActive && (
                     <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-3 flex items-center justify-center gap-8 overflow-hidden">
                         <div className="font-mono text-xs text-slate-500">x86_64 Instruction Stream</div>
                         <div className="flex-1 flex gap-1 justify-center opacity-50">
                             {Array.from({length: 12}).map((_, i) => (
                                 <div key={i} className="w-1 h-3 bg-cyan-500/50 rounded-full animate-pulse" style={{ animationDelay: `${i * 0.1}s` }}></div>
                             ))}
                         </div>
                         <div className="bg-indigo-600 text-white text-[10px] font-bold px-2 py-1 rounded">NEURAL BRIDGE</div>
                         <div className="flex-1 flex gap-1 justify-center opacity-50">
                             {Array.from({length: 12}).map((_, i) => (
                                 <div key={i} className="w-1 h-3 bg-green-500/50 rounded-full animate-pulse" style={{ animationDelay: `${i * 0.1}s` }}></div>
                             ))}
                         </div>
                         <div className="font-mono text-xs text-slate-500">CUDA Kernel Execution</div>
                     </div>
                 )}
             </div>
         )}
      </div>
    </div>
  );
};

export default Infrastructure;