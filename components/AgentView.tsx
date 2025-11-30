
import React, { useState, useEffect } from 'react';
import { Network, Terminal, Settings, Play, Database, Shield, Zap, RefreshCw, Activity, User, Briefcase, ChevronRight, Layout, Server, Code, Lock, Cpu, Globe, MessageSquare, Phone, Monitor, Key } from 'lucide-react';
import { Agent, AgentRole, AgentTask, WorkstationState, AgentIntegration } from '../types';
import { simulateAgentResponse, generateAgentSystemPrompt, executeAgentTask, mcpToolExecution, getAgentAutomationSuggestions, fetchHFModels } from '../services/geminiService';

const INITIAL_AGENTS: Agent[] = [
  { id: '1', name: 'Sales_Lead_Gen_01', role: AgentRole.VP_SALES, department: 'GROWTH', status: 'WORKING', health: 'HEALTHY', logs: [], children: [] },
  { id: '2', name: 'DevOps_Auto_Scaler', role: AgentRole.DEVOPS_ENGINEER, department: 'TECH', status: 'IDLE', health: 'HEALTHY', logs: [], children: [] },
  { id: '3', name: 'Support_Triage_Bot', role: AgentRole.MANAGER_CS, department: 'OPS', status: 'THINKING', health: 'WARNING', logs: [], children: [] },
];

const AgentView: React.FC = () => {
  const [viewMode, setViewMode] = useState<'DASHBOARD' | 'WORKFLOW' | 'WORKSTATION' | 'SETTINGS'>('DASHBOARD');
  const [selectedAgent, setSelectedAgent] = useState<Agent>(INITIAL_AGENTS[0]);
  const [agents, setAgents] = useState<Agent[]>(INITIAL_AGENTS);
  const [activeTask, setActiveTask] = useState<AgentTask | null>(null);
  
  // Workstation State
  const [terminalLogs, setTerminalLogs] = useState<string[]>(['[SYSTEM] Workstation initialized.', '[AUTH] Secure handshake complete.']);
  const [workstationState, setWorkstationState] = useState<WorkstationState>({
      osVersion: 'Megam OS Agentic Edition v2.1',
      ipAddress: '10.254.0.42',
      uptime: '4d 2h 15m',
      assets: [
          { id: 'a1', type: 'EMAIL', name: 'sales.bot@megam.io', detail: 'SMTP/IMAP', status: 'ACTIVE' },
          { id: 'a2', type: 'LICENSE', name: 'LinkedIn Sales Nav', detail: 'Enterprise', status: 'ACTIVE' }
      ],
      securityLog: [],
      webhooks: [],
      installedSoftware: ['Python 3.11', 'Node.js 20', 'PostgreSQL Client', 'Badal CLI']
  });

  // Settings State
  const [configPrompt, setConfigPrompt] = useState('');
  const [hfModels, setHfModels] = useState<any[]>([]);
  const [integrations, setIntegrations] = useState<AgentIntegration[]>([
      { id: 'i1', name: 'SSH Access', type: 'SSH', value: '****************', status: 'CONNECTED' },
      { id: 'i2', name: 'HuggingFace Token', type: 'API_KEY', value: 'hf_****************', status: 'CONNECTED' }
  ]);

  useEffect(() => {
      const loadModels = async () => {
          const models = await fetchHFModels(selectedAgent.role);
          setHfModels(models);
      };
      loadModels();
  }, [selectedAgent]);

  const handleTaskStart = async () => {
      const taskDesc = selectedAgent.department === 'GROWTH' ? 'Scrape LinkedIn for "CTO" leads in FinTech' : 'Optimize Docker container memory usage';
      
      const newTask: AgentTask = {
          id: Date.now().toString(),
          description: taskDesc,
          status: 'RUNNING',
          logs: ['[Orchestrator] Task received.', '[Agent] Analyzing requirements...'],
          timestamp: new Date().toLocaleTimeString()
      };
      setActiveTask(newTask);

      // Simulate Agent Thinking & Tool Use (MCP Pattern)
      setTimeout(async () => {
          const logs = [...newTask.logs];
          
          // Step 1: Recognition
          logs.push(`[Agent] Identified need for tool: ${selectedAgent.department === 'GROWTH' ? 'web_search_google' : 'ssh_exec'}`);
          setActiveTask(prev => ({ ...prev, logs: [...logs] } as AgentTask));
          await new Promise(r => setTimeout(r, 800));

          // Step 2: Invocation
          const toolName = selectedAgent.department === 'GROWTH' ? 'web_search_google' : 'check_inventory';
          const toolArgs = { query: 'FinTech CTOs', location: 'London' };
          logs.push(`[MCP] Invoking tool: ${toolName} with args: ${JSON.stringify(toolArgs)}`);
          setActiveTask(prev => ({ ...prev, logs: [...logs] } as AgentTask));
          await new Promise(r => setTimeout(r, 800));

          // Step 3: Data Return
          const toolResult: any = await mcpToolExecution(toolName, toolArgs);
          logs.push(`[MCP] Tool Result: Success`);
          setActiveTask(prev => ({ ...prev, logs: [...logs] } as AgentTask));
          await new Promise(r => setTimeout(r, 800));
          
          // Step 4: Completion
          const finalRes = await executeAgentTask(newTask.id, taskDesc, 'user@megam.io');
          
          setActiveTask(prev => ({ 
              ...prev, 
              status: 'COMPLETED', 
              logs: [...logs, ...finalRes.logs, '[Agent] Task completed successfully.'],
              result: finalRes.result
          } as AgentTask));

      }, 1000);
  };

  return (
    <div className="h-full flex flex-col bg-slate-950 text-slate-200 font-sans">
        {/* Header */}
        <div className="border-b border-slate-800 bg-slate-900/50 p-6 flex justify-between items-center">
            <div className="flex items-center gap-4">
                <div className="p-3 bg-teal-900/20 rounded-xl border border-teal-500/30">
                    <Network size={24} className="text-teal-400"/>
                </div>
                <div>
                    <h1 className="text-xl font-bold text-white">Agent Development Environment</h1>
                    <p className="text-slate-400 text-xs">Manage Autonomous Workforce & Neural Employees</p>
                </div>
            </div>
            
            <div className="flex bg-slate-900 rounded-lg p-1 border border-slate-800">
                {[
                    { id: 'DASHBOARD', label: 'Overview', icon: Layout },
                    { id: 'WORKSTATION', label: 'Remote Desktop', icon: Monitor },
                    { id: 'WORKFLOW', label: 'Task Execution', icon: Activity },
                    { id: 'SETTINGS', label: 'Configuration', icon: Settings },
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setViewMode(tab.id as any)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-md text-xs font-bold transition ${viewMode === tab.id ? 'bg-teal-600 text-white shadow' : 'text-slate-500 hover:text-white hover:bg-slate-800'}`}
                    >
                        {/* @ts-ignore */}
                        <tab.icon size={14} /> {tab.label}
                    </button>
                ))}
            </div>
        </div>

        <div className="flex-1 flex overflow-hidden">
            {/* Agent Sidebar */}
            <div className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col">
                <div className="p-4 border-b border-slate-800">
                    <h3 className="text-xs font-bold text-slate-500 uppercase mb-4">Active Agents</h3>
                    <div className="space-y-2">
                        {agents.map(agent => (
                            <button
                                key={agent.id}
                                onClick={() => setSelectedAgent(agent)}
                                className={`w-full text-left p-3 rounded-lg border transition flex items-center justify-between group ${selectedAgent.id === agent.id ? 'bg-teal-900/20 border-teal-500/50' : 'bg-slate-950 border-slate-800 hover:border-slate-600'}`}
                            >
                                <div>
                                    <div className={`font-bold text-sm ${selectedAgent.id === agent.id ? 'text-teal-400' : 'text-slate-300'}`}>{agent.name}</div>
                                    <div className="text-[10px] text-slate-500">{agent.role}</div>
                                </div>
                                <div className={`w-2 h-2 rounded-full ${agent.status === 'WORKING' ? 'bg-green-500 animate-pulse' : 'bg-slate-600'}`}></div>
                            </button>
                        ))}
                    </div>
                    <button className="w-full mt-4 py-2 border border-dashed border-slate-700 rounded text-slate-500 text-xs font-bold hover:text-white hover:border-slate-500">
                        + Deploy New Agent
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 bg-slate-950 relative overflow-y-auto">
                {viewMode === 'DASHBOARD' && (
                    <div className="p-8 max-w-5xl mx-auto space-y-8">
                        <div className="flex items-center gap-6 p-6 bg-slate-900 border border-slate-800 rounded-xl">
                            <div className="w-20 h-20 bg-slate-800 rounded-full border-4 border-teal-500 flex items-center justify-center">
                                <User size={32} className="text-teal-400"/>
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-white">{selectedAgent.name}</h2>
                                <div className="flex gap-4 mt-2 text-sm text-slate-400">
                                    <span className="flex items-center gap-1"><Briefcase size={14}/> {selectedAgent.role}</span>
                                    <span className="flex items-center gap-1"><Shield size={14}/> Level 4 Clearance</span>
                                    <span className="flex items-center gap-1"><Activity size={14}/> {selectedAgent.status}</span>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
                                <h3 className="text-xs font-bold text-slate-500 uppercase mb-2">Success Rate</h3>
                                <div className="text-3xl font-bold text-green-400">98.5%</div>
                            </div>
                            <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
                                <h3 className="text-xs font-bold text-slate-500 uppercase mb-2">Tasks Completed</h3>
                                <div className="text-3xl font-bold text-blue-400">1,402</div>
                            </div>
                            <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
                                <h3 className="text-xs font-bold text-slate-500 uppercase mb-2">Avg Latency</h3>
                                <div className="text-3xl font-bold text-purple-400">240ms</div>
                            </div>
                        </div>
                    </div>
                )}

                {viewMode === 'WORKSTATION' && (
                    <div className="h-full flex flex-col p-6">
                        <div className="bg-slate-900 border border-slate-800 rounded-t-xl p-4 flex justify-between items-center">
                            <div className="flex items-center gap-4">
                                <div className="flex gap-1.5">
                                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                </div>
                                <span className="text-sm font-mono text-slate-400">agent@megam-workstation:~</span>
                            </div>
                            <div className="flex gap-4 text-xs font-mono text-slate-500">
                                <span>IP: {workstationState.ipAddress}</span>
                                <span>UP: {workstationState.uptime}</span>
                            </div>
                        </div>
                        <div className="flex-1 bg-black border border-t-0 border-slate-800 rounded-b-xl p-6 font-mono text-sm overflow-hidden flex flex-col">
                            <div className="flex-1 overflow-y-auto space-y-1 mb-4">
                                {terminalLogs.map((log, i) => (
                                    <div key={i} className="text-green-400">{log}</div>
                                ))}
                                <div className="animate-pulse text-green-500">_</div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-900">
                                <div className="bg-slate-900/50 p-3 rounded">
                                    <h4 className="text-xs font-bold text-slate-500 uppercase mb-2">Installed Software</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {workstationState.installedSoftware.map(sw => (
                                            <span key={sw} className="px-2 py-1 bg-slate-800 rounded text-xs text-slate-300">{sw}</span>
                                        ))}
                                    </div>
                                </div>
                                <div className="bg-slate-900/50 p-3 rounded">
                                    <h4 className="text-xs font-bold text-slate-500 uppercase mb-2">Active Assets</h4>
                                    <div className="space-y-1">
                                        {workstationState.assets.map(asset => (
                                            <div key={asset.id} className="flex justify-between text-xs">
                                                <span className="text-slate-300">{asset.name}</span>
                                                <span className="text-green-500">{asset.status}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {viewMode === 'SETTINGS' && (
                    <div className="p-8 max-w-4xl mx-auto space-y-8">
                        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                            <h3 className="font-bold text-white mb-6 flex items-center gap-2"><Cpu size={18} className="text-purple-400"/> Model Configuration</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Base Model</label>
                                    <select className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-sm text-white">
                                        {hfModels.map((m: any) => (
                                            <option key={m.id} value={m.id}>{m.name} ({m.task})</option>
                                        ))}
                                        <option>Llama-3-70B-Instruct</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase block mb-1">System Prompt</label>
                                    <textarea 
                                        className="w-full h-32 bg-slate-950 border border-slate-800 rounded p-3 text-sm text-slate-300 outline-none focus:border-teal-500"
                                        value={configPrompt || `You are ${selectedAgent.name}, a ${selectedAgent.role}. Act autonomously.`}
                                        onChange={e => setConfigPrompt(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                            <h3 className="font-bold text-white mb-6 flex items-center gap-2"><Lock size={18} className="text-yellow-400"/> Manual Integrations</h3>
                            <div className="space-y-3">
                                {integrations.map(int => (
                                    <div key={int.id} className="flex items-center justify-between p-3 bg-slate-950 border border-slate-800 rounded">
                                        <div className="flex items-center gap-3">
                                            {int.type === 'SSH' ? <Terminal size={16} className="text-slate-400"/> : <Key size={16} className="text-slate-400"/>}
                                            <div>
                                                <div className="text-sm font-bold text-white">{int.name}</div>
                                                <div className="text-xs text-slate-500 font-mono">{int.value}</div>
                                            </div>
                                        </div>
                                        <span className="text-xs font-bold text-green-400 bg-green-900/20 px-2 py-1 rounded">Connected</span>
                                    </div>
                                ))}
                                <button className="w-full py-2 border border-dashed border-slate-700 rounded text-slate-500 text-xs font-bold hover:text-white">
                                    + Add New Credential
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {viewMode === 'WORKFLOW' && (
                    <div className="h-full flex flex-col p-8">
                        <div className="flex-1 bg-black border border-slate-800 rounded-xl p-6 relative overflow-hidden flex flex-col">
                            {activeTask ? (
                                <>
                                    <div className="flex justify-between items-start mb-4 border-b border-slate-900 pb-4">
                                        <div>
                                            <div className="text-xs font-bold text-slate-500 uppercase mb-1">Current Task ID: {activeTask.id}</div>
                                            <div className="text-lg font-bold text-white">{activeTask.description}</div>
                                        </div>
                                        <div className="px-3 py-1 rounded bg-teal-900/20 text-teal-400 text-xs font-bold animate-pulse">
                                            {activeTask.status}
                                        </div>
                                    </div>
                                    <div className="flex-1 overflow-y-auto space-y-2 font-mono text-sm">
                                        {activeTask.logs.map((log, i) => (
                                            <div key={i} className="text-slate-300">
                                                <span className="text-slate-600 mr-2">{new Date().toLocaleTimeString()}</span>
                                                {log}
                                            </div>
                                        ))}
                                    </div>
                                </>
                            ) : (
                                <div className="flex-1 flex flex-col items-center justify-center text-slate-500">
                                    <Activity size={48} className="mb-4 opacity-20"/>
                                    <p>Agent is idle. Assign a task to begin.</p>
                                    <button 
                                        onClick={handleTaskStart}
                                        className="mt-6 px-6 py-3 bg-teal-600 hover:bg-teal-500 text-white rounded-xl font-bold flex items-center gap-2 transition"
                                    >
                                        <Play size={18}/> Start Automated Workflow
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    </div>
  );
};

export default AgentView;
