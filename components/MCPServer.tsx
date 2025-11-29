import React, { useState, useEffect } from 'react';
import { Server, Activity, Shield, Terminal, Zap, Database, Lock, Users, Network, Code, Radio, Brain, Workflow, RefreshCw, Eye } from 'lucide-react';
import { MemoryFact } from '../types';

const MCPServer: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'TOOLS' | 'MEMORY' | 'WORKFLOW' | 'ACCESS'>('OVERVIEW');
  const [serverStatus, setServerStatus] = useState<'RUNNING' | 'STOPPED' | 'RESTARTING'>('RUNNING');
  const [requestRate, setRequestRate] = useState(120);
  const [logs, setLogs] = useState<string[]>([]);
  const [userRole, setUserRole] = useState<'OWNER' | 'ADMIN'>('OWNER');
  
  // Dynamic Discovery State
  const [discoveredTools, setDiscoveredTools] = useState<string[]>(['badal_fs_read', 'badal_fs_write', 'web_search_google']);
  const [isDiscovering, setIsDiscovering] = useState(false);

  // Memory State
  const [memories, setMemories] = useState<MemoryFact[]>([
      { id: 'm1', entity: 'User: superuser', fact: 'Prefers dark mode UI', confidence: 0.98, timestamp: '2h ago', source: 'CONVERSATION' },
      { id: 'm2', entity: 'Project: Alpha', fact: 'Deadline is Oct 15th', confidence: 0.85, timestamp: '1d ago', source: 'DOCUMENT' },
      { id: 'm3', entity: 'System', fact: 'AWS migration deprecated', confidence: 0.99, timestamp: '1w ago', source: 'TOOL' },
  ]);

  useEffect(() => {
    if (serverStatus === 'RUNNING') {
        const interval = setInterval(() => {
            setRequestRate(prev => Math.max(80, Math.min(500, prev + (Math.random() * 40 - 20))));
            
            if (Math.random() > 0.7) {
                const newLog = `[${new Date().toLocaleTimeString()}] SWGI_REQ: POST /v1/mcp/tools/call - 200 OK (${Math.floor(Math.random() * 50)}ms)`;
                setLogs(prev => [newLog, ...prev].slice(0, 50));
            }
        }, 1000);
        return () => clearInterval(interval);
    }
  }, [serverStatus]);

  const handleDiscoverTools = () => {
      setIsDiscovering(true);
      setTimeout(() => {
          setDiscoveredTools(prev => [...prev, 'stripe_payment_create', 'slack_message_send']);
          setLogs(prev => ['[MCP] Discovered new tool manifest: stripe_payment_create', '[MCP] Discovered new tool manifest: slack_message_send', ...prev]);
          setIsDiscovering(false);
      }, 2000);
  };

  return (
    <div className="h-full flex flex-col bg-slate-950 text-slate-200 font-sans">
      {/* Header */}
      <div className="border-b border-slate-800 p-6 bg-slate-900/50 flex justify-between items-center">
        <div>
            <h1 className="text-2xl font-bold flex items-center gap-3 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">
            <Network className="text-blue-400" />
            Badal SWGI & MCP Server
            </h1>
            <p className="text-slate-400 mt-1 text-sm">Megam OS Web Gateway Interface • Model Context Protocol v1.2</p>
        </div>
        <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1 bg-slate-800 rounded-lg border border-slate-700">
                 <Users size={14} className="text-slate-400"/>
                 <select 
                    value={userRole} 
                    onChange={(e) => setUserRole(e.target.value as any)}
                    className="bg-transparent text-xs font-bold text-slate-200 outline-none"
                 >
                     <option value="OWNER">View as Owner</option>
                     <option value="ADMIN">View as Admin Head</option>
                 </select>
            </div>
            <div className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-2 ${serverStatus === 'RUNNING' ? 'bg-green-500/10 text-green-400 border border-green-500/30' : 'bg-red-500/10 text-red-400'}`}>
                <div className={`w-2 h-2 rounded-full ${serverStatus === 'RUNNING' ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                {serverStatus}
            </div>
        </div>
      </div>

      <div className="flex border-b border-slate-800 overflow-x-auto">
         {[
             { id: 'OVERVIEW', label: 'Overview', icon: Activity },
             { id: 'TOOLS', label: 'Tool Registry', icon: Code },
             { id: 'MEMORY', label: 'Memory Bank', icon: Brain },
             { id: 'WORKFLOW', label: 'Agent Workflows', icon: Workflow },
             { id: 'ACCESS', label: 'Security', icon: Lock }
         ].map(tab => (
             <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-6 py-4 text-sm font-bold transition flex items-center gap-2 whitespace-nowrap ${activeTab === tab.id ? 'bg-slate-900 text-blue-400 border-b-2 border-blue-400' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-900/50'}`}
             >
                 {/* @ts-ignore */}
                 <tab.icon size={16} /> {tab.label}
             </button>
         ))}
      </div>

      <div className="flex-1 overflow-y-auto p-8 bg-slate-950/50">
        
        {activeTab === 'OVERVIEW' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Stats Cards */}
                <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
                    <h3 className="text-slate-400 text-xs font-bold uppercase mb-2">Request Throughput</h3>
                    <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-mono text-white">{Math.floor(requestRate)}</span>
                        <span className="text-slate-500 text-sm">req/s</span>
                    </div>
                    <div className="h-1 bg-slate-800 mt-4 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 transition-all duration-300" style={{width: `${(requestRate/500)*100}%`}}></div>
                    </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
                    <h3 className="text-slate-400 text-xs font-bold uppercase mb-2">Connected Agents</h3>
                    <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-mono text-white">42</span>
                        <span className="text-green-500 text-sm flex items-center gap-1"><Zap size={12}/> Active</span>
                    </div>
                    <div className="mt-4 flex gap-1">
                        {[1,2,3,4,5,6,7,8].map(i => (
                            <div key={i} className="w-2 h-2 rounded-full bg-green-500/50 animate-pulse" style={{animationDelay: `${i*0.1}s`}}></div>
                        ))}
                    </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
                    <h3 className="text-slate-400 text-xs font-bold uppercase mb-2">SWGI Protocol</h3>
                    <div className="flex items-center justify-between mb-2">
                         <span className="text-sm font-bold text-white">Transport: SSE</span>
                         <span className="text-xs bg-slate-800 px-2 py-0.5 rounded text-slate-400">v1.2</span>
                    </div>
                    <div className="flex items-center justify-between">
                         <span className="text-sm font-bold text-white">Serialization: JSON-RPC 2.0</span>
                    </div>
                </div>

                {/* Server Config */}
                <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-white flex items-center gap-2"><Server size={18}/> SWGI Instance Configuration</h3>
                        <div className="flex gap-2">
                            <button className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded text-xs font-bold transition">Restart SWGI</button>
                            <button className="px-3 py-1.5 bg-red-900/20 hover:bg-red-900/40 text-red-400 border border-red-900/50 rounded text-xs font-bold transition">Flush Cache</button>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg border border-slate-800">
                             <div>
                                 <div className="font-bold text-sm">Neural Request Sharding</div>
                                 <div className="text-xs text-slate-500">Distributes agent inference loads across virtual GPUs.</div>
                             </div>
                             <div className="w-12 h-6 bg-blue-600 rounded-full relative cursor-pointer"><div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"></div></div>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg border border-slate-800">
                             <div>
                                 <div className="font-bold text-sm">Context Caching Layer</div>
                                 <div className="text-xs text-slate-500">Reduces latency by caching MCP prompts in RAM.</div>
                             </div>
                             <div className="w-12 h-6 bg-blue-600 rounded-full relative cursor-pointer"><div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"></div></div>
                        </div>
                    </div>
                </div>

                {/* Live Logs */}
                <div className="bg-black border border-slate-800 rounded-xl p-4 font-mono text-xs flex flex-col overflow-hidden">
                    <div className="flex justify-between items-center mb-2 border-b border-slate-900 pb-2">
                        <span className="text-slate-500 font-bold">Live Stream</span>
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    </div>
                    <div className="flex-1 overflow-y-auto space-y-1">
                        {logs.slice(0, 10).map((l, i) => (
                            <div key={i} className="text-slate-400 truncate">{l}</div>
                        ))}
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'TOOLS' && (
             <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                 <div className="p-4 border-b border-slate-800 flex justify-between items-center">
                     <div>
                         <h3 className="font-bold text-white">Dynamic Tool Registry</h3>
                         <p className="text-xs text-slate-400">Tools automatically discovered via MCP protocol endpoints.</p>
                     </div>
                     <button 
                        onClick={handleDiscoverTools}
                        disabled={isDiscovering}
                        className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded font-bold text-xs flex items-center gap-2"
                     >
                         {isDiscovering ? <RefreshCw className="animate-spin" size={14}/> : <Zap size={14}/>}
                         {isDiscovering ? 'Scanning...' : 'Discover New Tools'}
                     </button>
                 </div>
                 <table className="w-full text-left text-sm">
                     <thead className="bg-slate-800/50 text-slate-400">
                         <tr>
                             <th className="p-4 font-bold">Tool Name</th>
                             <th className="p-4 font-bold">Description</th>
                             <th className="p-4 font-bold">Schema</th>
                             <th className="p-4 font-bold">Status</th>
                             <th className="p-4 font-bold">Access</th>
                         </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-800">
                         {discoveredTools.map(tName => (
                             <tr key={tName} className="hover:bg-slate-800/30">
                                 <td className="p-4 font-mono text-blue-400 font-bold">{tName}</td>
                                 <td className="p-4 text-slate-300">Autodiscovered via RPC</td>
                                 <td className="p-4 font-mono text-xs text-slate-500">JSON Schema v4</td>
                                 <td className="p-4"><span className="px-2 py-0.5 rounded bg-green-500/10 text-green-400 text-xs border border-green-500/20">Active</span></td>
                                 <td className="p-4 text-xs text-slate-400">RBAC: Default</td>
                             </tr>
                         ))}
                         {[
                             {name: 'infrastructure_scale', desc: 'Scale server nodes', schema: '{ count: number }', status: 'Restricted', access: 'Owner Only'},
                         ].map(tool => (
                             <tr key={tool.name} className="hover:bg-slate-800/30">
                                 <td className="p-4 font-mono text-blue-400 font-bold">{tool.name}</td>
                                 <td className="p-4 text-slate-300">{tool.desc}</td>
                                 <td className="p-4 font-mono text-xs text-slate-500">{tool.schema}</td>
                                 <td className="p-4"><span className="px-2 py-0.5 rounded bg-yellow-500/10 text-yellow-400 text-xs border border-yellow-500/20">{tool.status}</span></td>
                                 <td className="p-4 text-xs text-slate-400">{tool.access}</td>
                             </tr>
                         ))}
                     </tbody>
                 </table>
             </div>
        )}

        {activeTab === 'MEMORY' && (
            <div className="max-w-6xl mx-auto space-y-6">
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                    <h3 className="font-bold text-white mb-4 flex items-center gap-2"><Brain size={20} className="text-purple-400"/> Persistent Memory Bank</h3>
                    <p className="text-slate-400 text-sm mb-6">
                        This layer stores facts, preferences, and context across agent sessions. 
                        Powered by a specialized vector store for semantic retrieval during agent execution.
                    </p>

                    <div className="grid grid-cols-1 gap-4">
                        {memories.map(mem => (
                            <div key={mem.id} className="bg-slate-950 border border-slate-800 p-4 rounded-lg flex items-start justify-between hover:border-purple-500/50 transition">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-xs font-bold bg-slate-800 px-2 py-0.5 rounded text-purple-300 uppercase">{mem.source}</span>
                                        <span className="text-sm font-mono text-slate-500">{mem.entity}</span>
                                    </div>
                                    <div className="text-white font-medium">{mem.fact}</div>
                                </div>
                                <div className="text-right">
                                    <div className="text-xs text-slate-500 mb-1">{mem.timestamp}</div>
                                    <div className="text-xs font-bold text-green-400">{(mem.confidence * 100).toFixed(0)}% Conf</div>
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    <button className="mt-6 w-full py-2 border border-dashed border-slate-700 rounded text-slate-500 hover:text-white hover:bg-slate-800 transition text-sm">
                        + Inject Manual Fact
                    </button>
                </div>
            </div>
        )}

        {activeTab === 'WORKFLOW' && (
            <div className="h-full bg-slate-900 border border-slate-800 rounded-xl p-6 overflow-hidden flex flex-col">
                <h3 className="font-bold text-white mb-4 flex items-center gap-2"><Workflow size={20} className="text-orange-400"/> Active Agentic Workflows</h3>
                
                <div className="flex-1 relative bg-slate-950 rounded-xl border border-slate-800 p-8 overflow-y-auto">
                    <div className="absolute left-8 top-8 bottom-8 w-0.5 bg-slate-800"></div>
                    
                    {[
                        { time: '10:42:01', agent: 'Orchestrator', action: 'Received Task: "Analyze Q3 Competitor Pricing"', status: 'DONE' },
                        { time: '10:42:05', agent: 'ResearchBot', action: 'Tool Call: web_search_google("Competitor X pricing Q3")', status: 'DONE' },
                        { time: '10:42:12', agent: 'ResearchBot', action: 'Tool Call: badal_fs_write("/tmp/pricing.csv")', status: 'DONE' },
                        { time: '10:42:15', agent: 'AnalystBot', action: 'Tool Call: python_exec(pandas_analysis)', status: 'RUNNING' },
                    ].map((step, i) => (
                        <div key={i} className="relative pl-12 mb-8 last:mb-0">
                            <div className={`absolute left-[-5px] top-1 w-3 h-3 rounded-full border-2 border-slate-950 ${step.status === 'RUNNING' ? 'bg-orange-500 animate-pulse' : 'bg-green-500'}`}></div>
                            <div className="bg-slate-900 p-4 rounded-lg border border-slate-800">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-xs font-bold text-orange-400">{step.agent}</span>
                                    <span className="text-[10px] text-slate-500 font-mono">{step.time}</span>
                                </div>
                                <div className="text-sm text-slate-200 font-mono">{step.action}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )}

        {activeTab === 'ACCESS' && (
            <div className="max-w-2xl mx-auto space-y-8">
                 <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 relative overflow-hidden">
                     {userRole !== 'OWNER' && (
                         <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm z-10 flex items-center justify-center flex-col gap-2">
                             <Lock size={48} className="text-slate-700"/>
                             <p className="text-slate-500 font-bold">Restricted Access. Owner Only.</p>
                         </div>
                     )}
                     <h3 className="font-bold text-white mb-6 flex items-center gap-2"><Shield size={18} className="text-yellow-400"/> Security & OAuth2</h3>
                     
                     <div className="space-y-4">
                         <div>
                             <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Master Secret Key (SWGI Root)</label>
                             <div className="flex gap-2">
                                 <input type="password" value="sk_swgi_live_892374982374982374" className="flex-1 bg-slate-950 border border-slate-800 rounded px-3 py-2 text-sm text-slate-300 font-mono" readOnly />
                                 <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded text-xs font-bold">Rotate</button>
                             </div>
                         </div>
                         <div className="pt-4 border-t border-slate-800">
                             <h4 className="text-sm font-bold text-white mb-2">RBAC Policies</h4>
                             <div className="space-y-2">
                                 <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded border border-slate-800">
                                     <span className="text-sm text-slate-300">Allow Agents to Write to FS</span>
                                     <div className="w-10 h-5 bg-green-600 rounded-full relative cursor-pointer"><div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full"></div></div>
                                 </div>
                                 <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded border border-slate-800">
                                     <span className="text-sm text-slate-300">Require Approval for Payment Tools</span>
                                     <div className="w-10 h-5 bg-green-600 rounded-full relative cursor-pointer"><div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full"></div></div>
                                 </div>
                             </div>
                         </div>
                     </div>
                 </div>
            </div>
        )}

      </div>
    </div>
  );
};

export default MCPServer;