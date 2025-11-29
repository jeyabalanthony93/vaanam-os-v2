
import React, { useState, useEffect } from 'react';
import { Terminal, Activity, DollarSign, X, ChevronUp, ChevronDown, Wifi, Cpu, Database, Server, Wand2, CheckCircle2 } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { autoFixError } from '../../services/geminiService';

interface DevConsoleProps {
  isOpen: boolean;
  onClose: () => void;
  onToggleMinimize: () => void;
  isMinimized: boolean;
}

const DevConsole: React.FC<DevConsoleProps> = ({ isOpen, onClose, onToggleMinimize, isMinimized }) => {
  const [activeTab, setActiveTab] = useState<'CONSOLE' | 'NETWORK' | 'NEURAL' | 'FINOPS'>('CONSOLE');
  const [logs, setLogs] = useState<{id: string, time: string, msg: string, type: 'INFO' | 'ERROR' | 'SUCCESS'}[]>([]);
  const [networkReqs, setNetworkReqs] = useState<{id: string, method: string, url: string, status: number, time: number}[]>([]);
  const [costRate, setCostRate] = useState(0.0004); // Dollars per second
  const [totalCost, setTotalCost] = useState(12.45);
  const [gpuLoad, setGpuLoad] = useState<{time: string, load: number}[]>([]);
  
  // Auto Fix State
  const [fixingLogId, setFixingLogId] = useState<string | null>(null);

  // Simulation Loop
  useEffect(() => {
      if (!isOpen) return;

      const interval = setInterval(() => {
          // Update Cost
          setTotalCost(prev => prev + costRate);
          setCostRate(prev => Math.max(0.0001, prev + (Math.random() * 0.0001 - 0.00005)));

          // Mock Network Requests
          if (Math.random() > 0.8) {
              const methods = ['GET', 'POST', 'PUT'];
              const urls = ['/api/v1/auth/session', '/api/v1/neural-bridge/infer', '/api/v1/fs/sync', '/api/v1/agent/heartbeat'];
              const status = [200, 200, 200, 201, 204, 401, 500];
              const newReq = {
                  id: Date.now().toString(),
                  method: methods[Math.floor(Math.random() * methods.length)],
                  url: urls[Math.floor(Math.random() * urls.length)],
                  status: status[Math.floor(Math.random() * status.length)],
                  time: Math.floor(Math.random() * 200) + 20
              };
              setNetworkReqs(prev => [newReq, ...prev].slice(0, 20));
          }

          // Mock Logs
          if (Math.random() > 0.85) {
              const logTypes: ('INFO' | 'ERROR')[] = Math.random() > 0.8 ? ['ERROR'] : ['INFO'];
              const type = logTypes[0];
              const logMsgs = type === 'ERROR' 
                ? ['[Kernel] Exception in PID 4402: Null Reference', '[Neural] Tensor mismatch in Layer 4', '[Auth] Token validation failed: Expired', '[FS] Write buffer overflow'] 
                : ['[Kernel] Context switch to PID 4402', '[Neural] Tensor core activation: 98%', '[Auth] Token validated for user: root', '[FS] Write buffer flushed'];
              
              const newLog = {
                  id: Date.now().toString() + Math.random(),
                  time: new Date().toLocaleTimeString(),
                  msg: logMsgs[Math.floor(Math.random() * logMsgs.length)],
                  type: type
              };
              setLogs(prev => [newLog, ...prev].slice(0, 50));
          }

          // GPU Load
          setGpuLoad(prev => [...prev, { time: '', load: Math.random() * 100 }].slice(-20));

      }, 1000);

      return () => clearInterval(interval);
  }, [isOpen, costRate]);

  const handleAutoFix = async (logId: string, errorMsg: string) => {
      setFixingLogId(logId);
      const fixMsg = await autoFixError(errorMsg);
      
      const fixLog = {
          id: Date.now().toString(),
          time: new Date().toLocaleTimeString(),
          msg: fixMsg,
          type: 'SUCCESS' as const
      };
      
      setLogs(prev => [fixLog, ...prev]);
      setFixingLogId(null);
  };

  if (!isOpen) return null;

  return (
    <div 
        className={`fixed bottom-0 left-0 right-0 bg-slate-950 border-t border-slate-700 shadow-2xl transition-all duration-300 z-[100] flex flex-col ${isMinimized ? 'h-10' : 'h-80'}`}
    >
        {/* Header Bar */}
        <div className="h-10 bg-slate-900 flex items-center justify-between px-4 border-b border-slate-800 select-none">
            <div className="flex items-center gap-4">
                <span className="text-xs font-bold text-slate-300 flex items-center gap-2"><Terminal size={14}/> Megam DevConsole</span>
                <div className="h-4 w-px bg-slate-700"></div>
                <div className="flex gap-1">
                    {[
                        { id: 'CONSOLE', label: 'Console' },
                        { id: 'NETWORK', label: 'Network' },
                        { id: 'NEURAL', label: 'Neural Bridge' },
                        { id: 'FINOPS', label: 'FinOps Cost' },
                    ].map(tab => (
                        <button 
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`px-3 py-1 rounded text-[10px] font-bold uppercase transition ${activeTab === tab.id ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>
            <div className="flex items-center gap-2">
                <button onClick={onToggleMinimize} className="p-1 hover:bg-slate-800 rounded text-slate-400">
                    {isMinimized ? <ChevronUp size={14}/> : <ChevronDown size={14}/>}
                </button>
                <button onClick={onClose} className="p-1 hover:bg-red-900/50 hover:text-red-400 rounded text-slate-400">
                    <X size={14}/>
                </button>
            </div>
        </div>

        {/* Content */}
        {!isMinimized && (
            <div className="flex-1 overflow-hidden flex bg-[#0f0f0f] font-mono text-xs">
                
                {activeTab === 'CONSOLE' && (
                    <div className="flex-1 p-2 overflow-y-auto space-y-1">
                        {logs.map((log) => (
                            <div key={log.id} className={`flex items-center justify-between px-2 py-1 border-b border-white/5 border-dashed hover:bg-white/5 ${log.type === 'ERROR' ? 'text-red-400' : log.type === 'SUCCESS' ? 'text-green-400' : 'text-slate-400'}`}>
                                <div className="flex items-center gap-2">
                                    <span className="text-slate-600">[{log.time}]</span>
                                    <span>{log.type === 'SUCCESS' ? '✨ ' : log.type === 'ERROR' ? '✖ ' : '➜ '} {log.msg}</span>
                                </div>
                                {log.type === 'ERROR' && (
                                    <button 
                                        onClick={() => handleAutoFix(log.id, log.msg)}
                                        disabled={fixingLogId === log.id}
                                        className="flex items-center gap-1 px-2 py-0.5 bg-indigo-900/50 border border-indigo-500/50 rounded text-[10px] text-indigo-300 hover:bg-indigo-900 transition disabled:opacity-50"
                                    >
                                        {fixingLogId === log.id ? <div className="w-3 h-3 border-2 border-indigo-300 border-t-transparent rounded-full animate-spin"></div> : <Wand2 size={12}/>}
                                        Auto-Fix
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === 'NETWORK' && (
                    <div className="flex-1 flex flex-col">
                        <div className="flex bg-slate-900 text-slate-500 font-bold px-2 py-1 border-b border-slate-800">
                            <div className="w-20">Method</div>
                            <div className="w-16">Status</div>
                            <div className="w-20">Time</div>
                            <div className="flex-1">Endpoint</div>
                        </div>
                        <div className="flex-1 overflow-y-auto">
                            {networkReqs.map((req) => (
                                <div key={req.id} className="flex px-2 py-1 border-b border-slate-800/50 hover:bg-white/5 text-slate-300">
                                    <div className={`w-20 font-bold ${req.method === 'GET' ? 'text-blue-400' : req.method === 'POST' ? 'text-green-400' : 'text-orange-400'}`}>{req.method}</div>
                                    <div className={`w-16 ${req.status >= 500 ? 'text-red-500' : req.status >= 400 ? 'text-yellow-500' : 'text-green-500'}`}>{req.status}</div>
                                    <div className="w-20 text-slate-500">{req.time}ms</div>
                                    <div className="flex-1 truncate text-slate-400">{req.url}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'FINOPS' && (
                    <div className="flex-1 p-6 flex gap-8">
                        <div className="w-64 bg-slate-900 border border-slate-800 p-4 rounded-xl">
                            <div className="text-slate-500 text-[10px] font-bold uppercase mb-1">Current Session Cost</div>
                            <div className="text-3xl font-bold text-white mb-2">${totalCost.toFixed(4)}</div>
                            <div className="flex items-center gap-2 text-green-400 text-xs bg-green-900/20 px-2 py-1 rounded w-fit">
                                <Activity size={12} className="animate-pulse"/> Running Efficiently
                            </div>
                            <div className="mt-4 pt-4 border-t border-slate-800 space-y-2">
                                <div className="flex justify-between text-slate-400">
                                    <span>Compute</span>
                                    <span>${(totalCost * 0.6).toFixed(4)}</span>
                                </div>
                                <div className="flex justify-between text-slate-400">
                                    <span>Storage</span>
                                    <span>${(totalCost * 0.1).toFixed(4)}</span>
                                </div>
                                <div className="flex justify-between text-slate-400">
                                    <span>Network</span>
                                    <span>${(totalCost * 0.3).toFixed(4)}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex-1 bg-slate-900 border border-slate-800 p-4 rounded-xl">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-bold text-white flex items-center gap-2"><DollarSign size={16}/> Real-time Cost Analysis</h3>
                                <button className="px-3 py-1 bg-indigo-600 text-white rounded text-xs font-bold hover:bg-indigo-500">Optimize Frameworks</button>
                            </div>
                            <div className="space-y-4">
                                 {/* Cost Saving Settings */}
                                 <div className="flex items-center justify-between p-3 bg-slate-950 rounded border border-slate-800">
                                     <div>
                                         <div className="text-sm font-bold text-white">Spot Instance Bidding</div>
                                         <div className="text-slate-500">Use spare capacity for 90% savings.</div>
                                     </div>
                                     <div className="w-10 h-5 bg-green-600 rounded-full relative"><div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full"></div></div>
                                 </div>
                                 <div className="flex items-center justify-between p-3 bg-slate-950 rounded border border-slate-800">
                                     <div>
                                         <div className="text-sm font-bold text-white">Auto-Sleep Idle Agents</div>
                                         <div className="text-slate-500">Suspend containers after 5m inactivity.</div>
                                     </div>
                                     <div className="w-10 h-5 bg-green-600 rounded-full relative"><div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full"></div></div>
                                 </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'NEURAL' && (
                    <div className="flex-1 p-4 flex gap-4">
                        <div className="flex-1 bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col">
                            <h3 className="font-bold text-white mb-2 flex items-center gap-2"><Cpu size={16}/> Neural Bridge Load</h3>
                            <div className="flex-1">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={gpuLoad}>
                                        <defs>
                                            <linearGradient id="colorGpu" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                                                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <Tooltip contentStyle={{backgroundColor: '#0f172a', border: '1px solid #334155'}} />
                                        <Area type="monotone" dataKey="load" stroke="#10b981" fillOpacity={1} fill="url(#colorGpu)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                        <div className="w-64 bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-4">
                            <div className="p-3 bg-slate-950 border border-slate-800 rounded">
                                <div className="text-[10px] text-slate-500 uppercase font-bold">Latency</div>
                                <div className="text-xl font-bold text-green-400">4.2ms</div>
                            </div>
                            <div className="p-3 bg-slate-950 border border-slate-800 rounded">
                                <div className="text-[10px] text-slate-500 uppercase font-bold">Throughput</div>
                                <div className="text-xl font-bold text-blue-400">89 GB/s</div>
                            </div>
                            <div className="p-3 bg-slate-950 border border-slate-800 rounded">
                                <div className="text-[10px] text-slate-500 uppercase font-bold">Translation Efficiency</div>
                                <div className="text-xl font-bold text-purple-400">99.8%</div>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        )}
    </div>
  );
};

export default DevConsole;
