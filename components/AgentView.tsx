
import React, { useState, useEffect, useRef } from 'react';
import { Bot, Network, Play, CircleDashed, Users, Briefcase, Cpu, LineChart, Palette, Globe, Shield, Database, Sparkles, BrainCircuit, Code, Settings, MessageSquare, BarChart, Save, RefreshCw, Layers, Upload, Zap, Activity, AlertTriangle, CheckCircle2, XCircle, Bell, Workflow, Wand2, Info, ArrowRight, DollarSign, TrendingUp, UserPlus, Phone, Video, Mic, Key, Terminal, Server, Lock, Monitor, Box, Mail, Fingerprint, ShieldAlert, Plug, Wifi, Clock, CheckSquare, Search, GitMerge, MousePointer2, FileText, User, Download, Send, Power, RefreshCcw, Lightbulb, File, Sliders, UserCheck, GitBranch, Edit3, Trash2, Plus } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart as RechartsBarChart, Bar } from 'recharts';
import { Agent, AgentRole, AgentMetrics, AgentConfig, AgentWorkflow, AgentIntegration, AgentCapability, WorkstationState, HFModel, AgentTask, AgentHierarchyNode, AgentAsset } from '../types';
import { simulateAgentResponse, generateAgentSystemPrompt, fetchHFModels, executeAgentTask, getAgentAutomationSuggestions, generateAgentReport, mcpToolExecution } from '../services/geminiService';
import MegamStudio from './MegamStudio';
import MegamAutomate from './MegamAutomate';
import MegamMarketing from './MegamMarketing';

const INITIAL_AGENTS: Agent[] = [
    {
        id: 'founder-1', name: 'Co-Founder (Strategy)', role: AgentRole.FOUNDER, department: 'BOARD', status: 'WORKING', health: 'HEALTHY', logs: [],
        config: { 
            model: 'gemini-1.5-pro', temperature: 0.7, systemPrompt: 'You are the strategic founder...', tools: ['infrastructure_scale'], isFineTuned: true,
            capabilities: ['SERVER_ADMIN', 'AI_DATA'],
            manualIntegrations: [{id: 'int1', name: 'Badal Root Key', type: 'API_KEY', value: 'sk_live_...', status: 'CONNECTED'}]
        },
        metrics: { tokensPerSec: 145, successRate: 99.9, totalCost: 450.20, latency: 120, uptime: 100 },
        children: [], workflows: [], workstation: { osVersion: 'Megam OS 2.0 (Executive)', ipAddress: '10.254.0.1', uptime: '42d 12h', assets: [], securityLog: [], webhooks: [], installedSoftware: ['Python 3.11', 'Terraform', 'Kubectl'], remoteSessionId: '982-123-456' }
    },
    {
        id: 'head-design', name: 'Web & Digital Head', role: AgentRole.HEAD_DESIGN, department: 'DESIGN', status: 'WORKING', health: 'HEALTHY', logs: [],
        config: { model: 'gemini-1.5-pro-vision', temperature: 0.8, systemPrompt: 'Design expert...', tools: ['figma_api', 'image_gen'], isFineTuned: true },
        metrics: { tokensPerSec: 90, successRate: 99.0, totalCost: 300.00, latency: 200, uptime: 100 },
        workstation: { osVersion: 'Megam OS 2.0 (Creative)', ipAddress: '10.254.0.12', uptime: '5d 4h', assets: [], securityLog: [], webhooks: [], installedSoftware: ['Figma CLI', 'Node.js', 'Blender'], remoteSessionId: '445-678-901' }
    },
    {
        id: 'vp-sales', name: 'VP Sales', role: AgentRole.VP_SALES, department: 'GROWTH', status: 'WORKING', health: 'WARNING', logs: [],
        config: { model: 'gemini-1.5-flash', temperature: 0.9, systemPrompt: 'Sell...', tools: ['email', 'mcp_linkedin', 'rag_crm'], isFineTuned: false },
        metrics: { tokensPerSec: 200, successRate: 92.0, totalCost: 150.00, latency: 45, uptime: 99.5, revenueGenerated: 125000, leadsGenerated: 420 },
        workstation: { osVersion: 'Megam OS 2.0 (Sales)', ipAddress: '10.254.0.23', uptime: '12d 1h', assets: [], securityLog: [], webhooks: [], installedSoftware: ['CRM Tools', 'Email Relay'], remoteSessionId: '112-334-556' }
    },
    {
        id: 'devops-eng', name: 'Lead DevOps Engineer', role: AgentRole.DEVOPS_ENGINEER, department: 'TECH', status: 'WORKING', health: 'HEALTHY', logs: [],
        config: { model: 'gemini-1.5-pro', temperature: 0.1, systemPrompt: 'Automate everything...', tools: ['k8s', 'terraform'], isFineTuned: true },
        metrics: { tokensPerSec: 300, successRate: 99.9, totalCost: 200.00, latency: 20, uptime: 100 },
        workstation: { osVersion: 'Megam OS 2.0 (Server)', ipAddress: '10.254.0.99', uptime: '90d 0h', assets: [], securityLog: [], webhooks: [], installedSoftware: ['Docker', 'K9s', 'Ansible', 'Prometheus'], remoteSessionId: '778-990-112' }
    }
];

// Org Chart Mock Data
const HIERARCHY_DATA: AgentHierarchyNode = {
    id: 'root', name: 'Co-Founders', role: AgentRole.FOUNDER,
    children: [
        {
            id: 'growth', name: 'Growth Dept', role: AgentRole.VP_SALES,
            children: [
                { id: 'sales1', name: 'Sales Agent A', role: AgentRole.IT_SALES_ENGINEER, children: [] },
                { id: 'sales2', name: 'Sales Agent B', role: AgentRole.IT_SALES_ENGINEER, children: [] },
            ]
        },
        {
            id: 'tech', name: 'Tech Dept', role: AgentRole.HEAD_IT,
            children: [
                { id: 'devops', name: 'DevOps Lead', role: AgentRole.DEVOPS_ENGINEER, children: [] },
                { id: 'ai', name: 'AI Researcher', role: AgentRole.AI_RESEARCHER, children: [] },
            ]
        }
    ]
};

const AgentView: React.FC = () => {
  const [agents, setAgents] = useState<Agent[]>(INITIAL_AGENTS);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentAgentId, setCurrentAgentId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'DASHBOARD' | 'WORKSTATION' | 'TASKS' | 'ORG_CHART' | 'SETTINGS'>('DASHBOARD');
  
  // Model Bank State
  const [availableModels, setAvailableModels] = useState<HFModel[]>([]);
  const [selectedModel, setSelectedModel] = useState<string>('');
  
  // Task Execution State
  const [taskInput, setTaskInput] = useState('');
  const [activeTask, setActiveTask] = useState<any | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);

  // Automation Suggestions
  const [suggestions, setSuggestions] = useState<{title: string, desc: string}[]>([]);

  // Fine-tuning Modal
  const [showFineTune, setShowFineTune] = useState(false);

  // Identity State
  const [identity, setIdentity] = useState({ email: '', keyId: '', dns: 'Secure (DNSSEC)' });

  // Workstation Simulation State
  const [terminalLogs, setTerminalLogs] = useState<string[]>(['System initialized.', 'Connected to Badal Cloud.', 'Agent runtime active.']);

  const currentAgent = agents.find(a => a.id === currentAgentId);

  // Load Models on Login
  useEffect(() => {
      const loadData = async () => {
          if (currentAgent) {
              const models = await fetchHFModels(currentAgent.role as string);
              setAvailableModels(models);
              if (models.length > 0) setSelectedModel(models[0].id);

              const suggs = await getAgentAutomationSuggestions(currentAgent.role as string);
              setSuggestions(suggs);

              // Simulate Identity
              setIdentity({
                  email: `${currentAgent.name.split(' ')[0].toLowerCase().replace('&','')}@megam.com`,
                  keyId: `key_${Math.random().toString(36).substr(2, 8)}`,
                  dns: 'Secure (DNSSEC)'
              });
          }
      };
      if (isLoggedIn) loadData();
  }, [isLoggedIn, currentAgent]);

  // Simulate Terminal Logs in Workstation
  useEffect(() => {
      if (viewMode === 'WORKSTATION') {
          const interval = setInterval(() => {
              const logs = [
                  `[INFO] Checking tasks queue... 0 pending`,
                  `[NET] Keep-alive packet sent to 10.0.0.1`,
                  `[MEM] Garbage collection run (45ms)`,
                  `[AI] Neural Bridge heartbeat: OK`
              ];
              setTerminalLogs(prev => [...prev.slice(-10), logs[Math.floor(Math.random() * logs.length)]]);
          }, 2000);
          return () => clearInterval(interval);
      }
  }, [viewMode]);

  const handleLogin = (agentId: string) => {
      setCurrentAgentId(agentId);
      setIsLoggedIn(true);
  };

  const handleLogout = () => {
      setIsLoggedIn(false);
      setCurrentAgentId(null);
      setViewMode('DASHBOARD');
  };

  const updateAgentWorkstation = (updates: Partial<WorkstationState>) => {
      setAgents(prev => prev.map(a => {
          if (a.id === currentAgentId && a.workstation) {
              return {
                  ...a,
                  workstation: { ...a.workstation, ...updates }
              };
          }
          return a;
      }));
  };

  const handleExecuteTask = async () => {
      if (!taskInput || !currentAgent) return;
      
      const newTaskId = Date.now().toString();
      const newTask = {
          id: newTaskId,
          description: taskInput,
          status: 'RUNNING',
          logs: [`Initializing task: ${taskInput}...`, `[Hierarchy] Reporting execution to ${currentAgent.role.includes('Head') || currentAgent.role.includes('VP') ? 'Founder' : 'Department Head'}`],
          timestamp: new Date().toLocaleTimeString()
      };
      setActiveTask(newTask);
      setIsExecuting(true);
      setTaskInput('');

      // Enhanced MCP Workflow Simulation
      const logs = newTask.logs;
      
      // Step 1: Recognition
      logs.push(`[Neural Bridge] Reasoning about request...`);
      await new Promise(r => setTimeout(r, 800));
      setActiveTask(prev => ({ ...prev, logs: [...logs] }));

      // Step 2: Tool Invocation (Simulation)
      let needsTool = false;
      let toolName = '';
      let toolArgs: any = {};

      if (newTask.description.toLowerCase().includes('inventory')) {
          needsTool = true;
          toolName = 'check_inventory';
          toolArgs = { item_id: 'A100' };
      } else if (newTask.description.toLowerCase().includes('meeting') || newTask.description.toLowerCase().includes('schedule')) {
          needsTool = true;
          toolName = 'schedule_meeting';
          toolArgs = { time: 'Tomorrow 2 PM', attendee_email: 'bob@example.com', topic: 'Q3 Report' };
      } else if (newTask.description.toLowerCase().includes('database') || newTask.description.toLowerCase().includes('query')) {
          needsTool = true;
          toolName = 'query_database';
          toolArgs = { sql: 'SELECT * FROM users LIMIT 5' };
      }

      if (needsTool) {
          // MCP: Tool Call JSON
          const toolCall = {
              action: toolName,
              arguments: toolArgs
          };
          logs.push(`[MCP] Tool Invocation Required:\n${JSON.stringify(toolCall, null, 2)}`);
          setActiveTask(prev => ({ ...prev, logs: [...logs] }));
          await new Promise(r => setTimeout(r, 1200));

          // Step 3: Data Return
          logs.push(`[MCP] Waiting for tool result...`);
          setActiveTask(prev => ({ ...prev, logs: [...logs] }));
          
          const toolResult = await mcpToolExecution(toolName, toolArgs);
          
          logs.push(`[MCP] Tool Result:\n${JSON.stringify(toolResult.result || toolResult, null, 2)}`);
          setActiveTask(prev => ({ ...prev, logs: [...logs] }));
          await new Promise(r => setTimeout(r, 800));
          
          // Step 4: Continued Generation
          logs.push(`[Agent] Generating final response based on tool data...`);
      } else {
          // Standard RAG or Text Gen
          logs.push(`[RAG] Checking vector knowledge base...`);
          await new Promise(r => setTimeout(r, 1000));
      }

      // Simulate execution end
      const result = await executeAgentTask(newTaskId, newTask.description, identity.email);
      
      setActiveTask(prev => prev ? ({
          ...prev,
          status: result.status,
          logs: [...prev.logs, ...result.logs],
          result: result.result,
          file: result.file
      }) : null);
      setIsExecuting(false);
  };

  const handleDownloadArtifact = (url: string, name: string) => {
      alert(`Downloading ${name} from Badal Storage...`);
  }

  const renderHierarchyNode = (node: AgentHierarchyNode) => (
      <div className="flex flex-col items-center">
          <div className="bg-slate-900 border border-slate-700 p-4 rounded-xl text-center shadow-lg w-48 relative z-10">
              <div className="font-bold text-white text-sm">{node.name}</div>
              <div className="text-xs text-slate-500 mt-1">{node.role}</div>
              <div className="mt-2 text-[10px] text-green-400 flex items-center justify-center gap-1"><CircleDashed size={8} className="animate-spin"/> Active</div>
          </div>
          {node.children.length > 0 && (
              <div className="relative pt-8">
                  {/* Lines */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 h-8 w-px bg-slate-700"></div>
                  <div className="absolute top-8 left-0 right-0 h-px bg-slate-700" style={{left: '25%', right: '25%'}}></div>
                  
                  <div className="flex gap-8 items-start">
                      {node.children.map(child => (
                          <div key={child.id} className="relative pt-4">
                              <div className="absolute top-0 left-1/2 -translate-x-1/2 h-4 w-px bg-slate-700"></div>
                              {renderHierarchyNode(child)}
                          </div>
                      ))}
                  </div>
              </div>
          )}
      </div>
  );

  if (!isLoggedIn) {
      return (
          <div className="h-full flex items-center justify-center bg-slate-950 p-8 relative overflow-hidden">
              {/* Background Effect */}
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop')] bg-cover opacity-10"></div>
              
              <div className="z-10 w-full max-w-4xl">
                  <div className="text-center mb-12">
                      <h1 className="text-4xl font-bold text-white mb-2">Agent Access Portal</h1>
                      <p className="text-slate-400">Select your Digital Identity to proceed.</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      {agents.map(agent => (
                          <button
                            key={agent.id}
                            onClick={() => handleLogin(agent.id)}
                            className="bg-slate-900/80 backdrop-blur-md border border-slate-700 hover:border-teal-500 p-6 rounded-xl flex flex-col items-center gap-4 transition group shadow-lg hover:shadow-teal-900/20 hover:-translate-y-1"
                          >
                              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center border border-slate-600 group-hover:border-teal-500/50 group-hover:from-teal-900/20 group-hover:to-slate-900 transition">
                                  <User size={32} className="text-slate-400 group-hover:text-teal-400"/>
                              </div>
                              <div className="text-center">
                                  <div className="font-bold text-white text-sm">{agent.name}</div>
                                  <div className="text-xs text-slate-500 mt-1">{agent.role}</div>
                              </div>
                              <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden mt-2">
                                  <div className="h-full bg-green-500 w-full animate-pulse"></div>
                              </div>
                              <div className="text-[10px] text-green-400 font-mono">ONLINE</div>
                          </button>
                      ))}
                  </div>
              </div>
          </div>
      );
  }

  return (
    <div className="h-full flex flex-col bg-[#0b0f19] text-slate-200 overflow-hidden font-sans relative">
        
        {/* Fine Tuning Overlay */}
        {showFineTune && (
            <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-8">
                <div className="bg-slate-900 border border-teal-500/30 rounded-2xl p-8 max-w-lg w-full shadow-2xl animate-in fade-in zoom-in duration-200">
                    <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><Sliders size={20} className="text-teal-400"/> Agent Fine-Tuning</h2>
                    <p className="text-slate-400 text-sm mb-6">Adjust behavioral weights and learning parameters for {currentAgent?.name}.</p>
                    
                    <div className="space-y-4">
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Temperature (Creativity)</label>
                            <input type="range" min="0" max="1" step="0.1" className="w-full accent-teal-500"/>
                        </div>
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Reasoning Steps</label>
                            <input type="range" min="1" max="10" step="1" className="w-full accent-teal-500"/>
                        </div>
                        <div className="p-4 bg-black/30 rounded border border-slate-700">
                            <label className="flex items-center gap-2 text-sm text-slate-300">
                                <input type="checkbox" className="accent-teal-500" defaultChecked/> Enable Neural Bridge Acceleration
                            </label>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 mt-8">
                        <button onClick={() => setShowFineTune(false)} className="px-4 py-2 text-slate-400 hover:text-white">Cancel</button>
                        <button onClick={() => setShowFineTune(false)} className="px-6 py-2 bg-teal-600 text-white rounded font-bold hover:bg-teal-500">Apply Weights</button>
                    </div>
                </div>
            </div>
        )}

        {/* Agent Header */}
        <div className="h-16 border-b border-slate-800 bg-slate-900/80 backdrop-blur-sm flex justify-between items-center px-6 shrink-0 z-20">
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-teal-600 flex items-center justify-center text-white font-bold shadow-lg shadow-teal-500/20">
                    {currentAgent?.name[0]}
                </div>
                <div>
                    <h1 className="text-sm font-bold text-white">{currentAgent?.name}</h1>
                    <div className="flex items-center gap-2 text-xs text-teal-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                        {currentAgent?.role} • Active
                    </div>
                </div>
            </div>

            <div className="flex bg-slate-800 rounded-lg p-1 border border-slate-700">
                {[
                    { id: 'DASHBOARD', icon: Activity, label: 'Dashboard' },
                    { id: 'WORKSTATION', icon: Monitor, label: 'Workstation' },
                    { id: 'TASKS', icon: CheckSquare, label: 'Task Execution' },
                    { id: 'ORG_CHART', icon: Network, label: 'Hierarchy' },
                    { id: 'SETTINGS', icon: Settings, label: 'Config' },
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setViewMode(tab.id as any)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-md text-xs font-bold transition ${viewMode === tab.id ? 'bg-teal-600 text-white shadow' : 'text-slate-400 hover:text-white hover:bg-slate-700'}`}
                    >
                        {/* @ts-ignore */}
                        <tab.icon size={14} /> {tab.label}
                    </button>
                ))}
            </div>

            <button onClick={handleLogout} className="text-red-400 hover:text-red-300 p-2 rounded-full hover:bg-red-900/20 transition" title="Logout">
                <Power size={20}/>
            </button>
        </div>

        <div className="flex-1 overflow-hidden relative">
            
            {/* 1. DASHBOARD View (Role Specific) */}
            {viewMode === 'DASHBOARD' && (
                <div className="h-full p-8 overflow-y-auto">
                    {/* Identity Card */}
                    <div className="bg-gradient-to-r from-teal-900/20 to-blue-900/20 border border-teal-500/30 rounded-xl p-6 mb-8 flex justify-between items-center">
                        <div className="flex items-center gap-6">
                            <div className="w-20 h-20 bg-slate-800 rounded-full border-4 border-slate-900 shadow-xl flex items-center justify-center">
                                <UserCheck size={32} className="text-teal-400"/>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white mb-1">Corporate Identity</h3>
                                <div className="flex items-center gap-4 text-sm text-slate-300">
                                    <span className="flex items-center gap-2"><Mail size={14} className="text-slate-500"/> {identity.email}</span>
                                    <span className="flex items-center gap-2"><Key size={14} className="text-slate-500"/> {identity.keyId}</span>
                                    <span className="flex items-center gap-2 text-green-400"><Shield size={14}/> {identity.dns}</span>
                                </div>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-xs font-bold text-slate-500 uppercase mb-1">Reporting To</div>
                            <div className="text-white font-bold">{currentAgent?.role.includes('Head') || currentAgent?.role.includes('VP') ? 'Founders Board' : 'Department Lead'}</div>
                        </div>
                    </div>

                    {currentAgent?.role === AgentRole.VP_SALES ? (
                        // SALES DASHBOARD (Existing)
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-6 h-[500px]">
                                <MegamMarketing /> {/* Reuse Marketing Component */}
                            </div>
                            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                                <h3 className="font-bold text-white mb-4 flex items-center gap-2"><Lightbulb size={18}/> Automation Suggestions</h3>
                                <div className="space-y-3">
                                    {suggestions.map((s, i) => (
                                        <div key={i} className="p-3 bg-slate-800 border border-slate-700 rounded-lg">
                                            <div className="font-bold text-sm text-white mb-1">{s.title}</div>
                                            <p className="text-xs text-slate-400 mb-3">{s.desc}</p>
                                            <button className="w-full py-1.5 bg-teal-600/20 text-teal-400 text-xs font-bold rounded border border-teal-500/30 hover:bg-teal-600/30 transition">Enable</button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ) : (
                        // DEFAULT DASHBOARD
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
                            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 overflow-hidden">
                                <h3 className="font-bold text-white mb-4 flex items-center gap-2"><Terminal size={18}/> Active Terminal</h3>
                                <div className="h-full bg-black rounded-lg p-4 font-mono text-xs text-green-400 border border-slate-800">
                                    <div>root@megam-agent:~# ./run_diagnostics.sh</div>
                                    <div>Checking Neural Bridge latency... 12ms [OK]</div>
                                    <div>Verifying RAG index integrity... 100% [OK]</div>
                                    <div>Syncing codebase from git... Up to date.</div>
                                    <div className="animate-pulse">_</div>
                                </div>
                            </div>
                            <div className="flex flex-col gap-6">
                                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex-1">
                                    <h3 className="font-bold text-white mb-4 flex items-center gap-2"><GitBranch size={18}/> Code Contributions</h3>
                                    {/* ... */}
                                    <button onClick={() => setShowFineTune(true)} className="w-full mt-4 border border-teal-500/50 text-teal-400 hover:bg-teal-500/10 py-2 rounded text-xs font-bold transition">
                                        Fine-Tune Agent Model
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* 2. TASKS View (Execution Console) */}
            {viewMode === 'TASKS' && (
                <div className="h-full flex p-8 gap-8">
                    {/* Left: Input & Config */}
                    <div className="w-96 bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col">
                        <h3 className="font-bold text-white mb-6 flex items-center gap-2"><Bot size={20} className="text-teal-400"/> Agent Controls</h3>
                        
                        <div className="flex-1 flex flex-col">
                            <label className="text-xs font-bold text-slate-500 uppercase block mb-2">New Task Instruction</label>
                            <textarea 
                                value={taskInput}
                                onChange={(e) => setTaskInput(e.target.value)}
                                className="flex-1 bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm text-white outline-none focus:border-teal-500 resize-none mb-4"
                                placeholder="Try 'Check inventory for A100' or 'Schedule meeting with Bob'..."
                            />
                            <button 
                                onClick={handleExecuteTask}
                                disabled={isExecuting || !taskInput}
                                className="w-full py-3 bg-teal-600 hover:bg-teal-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition disabled:opacity-50"
                            >
                                {isExecuting ? <RefreshCw className="animate-spin"/> : <Play/>}
                                Execute Task
                            </button>
                        </div>
                    </div>

                    {/* Right: Live Execution Log */}
                    <div className="flex-1 bg-black border border-slate-800 rounded-xl p-6 flex flex-col relative overflow-hidden">
                        <div className="flex justify-between items-center mb-4 border-b border-slate-800 pb-2">
                            <h3 className="font-bold text-slate-400 text-xs uppercase flex items-center gap-2"><Activity size={14}/> Execution Log</h3>
                            <div className="text-xs text-slate-500">Report Email: {identity.email}</div>
                        </div>
                        
                        <div className="flex-1 overflow-y-auto space-y-2 font-mono text-sm">
                            {/* ... Logs ... */}
                            {activeTask?.logs.map((log: string, i: number) => (
                                <div key={i} className="text-slate-300 break-words animate-in fade-in slide-in-from-left-2 whitespace-pre-wrap">
                                    <span className="text-teal-500 mr-2">{`>`}</span>
                                    {log}
                                </div>
                            ))}
                            {isExecuting && <div className="animate-pulse text-teal-500">_</div>}
                        </div>

                        {activeTask?.file && (
                            <div className="mt-4 p-4 bg-teal-900/20 border border-teal-500/30 rounded-lg flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <FileText className="text-teal-400" size={20}/>
                                    <div>
                                        <div className="text-sm font-bold text-white">{activeTask.file.name}</div>
                                        <div className="text-xs text-teal-400">Generated Artifact</div>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => handleDownloadArtifact(activeTask.file.url, activeTask.file.name)}
                                    className="bg-teal-600 hover:bg-teal-500 text-white px-4 py-2 rounded text-xs font-bold flex items-center gap-2"
                                >
                                    <Download size={14}/> Download
                                </button>
                            </div>
                        )}
                        {/* ... */}
                    </div>
                </div>
            )}

            {/* 3. WORKSTATION View */}
            {viewMode === 'WORKSTATION' && (
                <div className="h-full p-8 flex flex-col items-center justify-center bg-slate-950">
                    <div className="w-full max-w-6xl h-full bg-[#1e1e1e] border-4 border-slate-800 rounded-xl relative overflow-hidden shadow-2xl flex flex-col">
                        {/* Remote Desktop Header */}
                        <div className="h-10 bg-slate-900 border-b border-slate-800 flex items-center px-4 justify-between select-none">
                            <div className="flex gap-2">
                                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                            </div>
                            <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                                <Lock size={12} className="text-green-500"/>
                                <span>{currentAgent?.workstation?.ipAddress}</span>
                                <span className="text-slate-600">|</span>
                                <span>Session: {currentAgent?.workstation?.remoteSessionId}</span>
                            </div>
                            <div className="w-16"></div>
                        </div>

                        {/* Desktop Content */}
                        <div className="flex-1 bg-slate-900 relative p-8 font-sans">
                            {/* Background Watermark */}
                            <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
                                <Bot size={200}/>
                            </div>

                            <div className="grid grid-cols-2 gap-8 h-full">
                                {/* Left: System Info & Tools */}
                                <div className="space-y-6">
                                    <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
                                        <h3 className="font-bold text-white mb-4 flex items-center gap-2"><Cpu size={18} className="text-teal-400"/> System Status</h3>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <div className="text-xs text-slate-500 uppercase font-bold">OS Version</div>
                                                <div className="text-white">{currentAgent?.workstation?.osVersion}</div>
                                            </div>
                                            <div>
                                                <div className="text-xs text-slate-500 uppercase font-bold">Uptime</div>
                                                <div className="text-white">{currentAgent?.workstation?.uptime}</div>
                                            </div>
                                            <div>
                                                <div className="text-xs text-slate-500 uppercase font-bold">Memory</div>
                                                <div className="text-white">14.2 GB / 64 GB</div>
                                            </div>
                                            <div>
                                                <div className="text-xs text-slate-500 uppercase font-bold">Disk</div>
                                                <div className="text-white">2.1 TB (Badal Mount)</div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
                                        <h3 className="font-bold text-white mb-4 flex items-center gap-2"><Box size={18} className="text-blue-400"/> Installed Toolchain</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {currentAgent?.workstation?.installedSoftware.map(tool => (
                                                <span key={tool} className="px-3 py-1 bg-slate-900 border border-slate-700 rounded text-xs text-slate-300 font-mono">
                                                    {tool}
                                                </span>
                                            ))}
                                            <span className="px-3 py-1 bg-slate-900 border border-slate-700 rounded text-xs text-slate-500 font-mono italic">+42 dependencies</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Right: Terminal */}
                                <div className="bg-black border border-slate-700 rounded-xl p-4 font-mono text-sm overflow-hidden flex flex-col shadow-inner">
                                    <div className="flex justify-between items-center mb-2 pb-2 border-b border-slate-800">
                                        <span className="text-slate-500 text-xs">/var/log/syslog</span>
                                        <div className="flex gap-1"><div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div></div>
                                    </div>
                                    <div className="flex-1 overflow-y-auto space-y-1 text-green-400">
                                        {terminalLogs.map((log, i) => (
                                            <div key={i} className="break-all">
                                                <span className="text-slate-600 mr-2">{new Date().toLocaleTimeString()}</span>
                                                {log}
                                            </div>
                                        ))}
                                        <div className="animate-pulse">_</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* 4. ORG CHART View */}
            {viewMode === 'ORG_CHART' && (
                <div className="h-full flex flex-col items-center justify-center p-8 bg-slate-950 overflow-auto">
                    <div className="mb-12 text-center">
                        <h2 className="text-3xl font-bold text-white mb-2">Company Structure</h2>
                        <p className="text-slate-400">Visualizing the hierarchical agent network.</p>
                    </div>
                    
                    <div className="flex-1 flex items-center justify-center min-w-max pb-20">
                        {renderHierarchyNode(HIERARCHY_DATA)}
                    </div>
                </div>
            )}

            {/* 5. SETTINGS View */}
            {viewMode === 'SETTINGS' && (
                <div className="h-full p-8 overflow-y-auto max-w-4xl mx-auto">
                    <div className="space-y-8">
                        {/* Model Config */}
                        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                            <h3 className="font-bold text-white mb-6 flex items-center gap-2"><BrainCircuit size={20} className="text-teal-400"/> AI Model Configuration</h3>
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Base Model</label>
                                    <select className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-sm text-white outline-none">
                                        <option>Gemini 1.5 Pro</option>
                                        <option>Gemini 1.5 Flash</option>
                                        <option>Llama-3-70B (Open Source)</option>
                                        <option>Mistral Large</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Temperature</label>
                                    <div className="flex items-center gap-4">
                                        <input type="range" min="0" max="1" step="0.1" className="flex-1 accent-teal-500"/>
                                        <span className="text-white font-mono bg-slate-950 px-2 py-1 rounded border border-slate-700 text-xs">0.7</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Workstation Configuration */}
                        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                            <h3 className="font-bold text-white mb-6 flex items-center gap-2">
                                <Monitor size={20} className="text-blue-400"/> Workstation Configuration
                            </h3>
                            
                            {/* Basic Info */}
                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase block mb-2">OS Version</label>
                                    <input 
                                        value={currentAgent?.workstation?.osVersion || ''}
                                        onChange={e => updateAgentWorkstation({ osVersion: e.target.value })}
                                        className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-sm text-white outline-none focus:border-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase block mb-2">IP Address</label>
                                    <input 
                                        value={currentAgent?.workstation?.ipAddress || ''}
                                        onChange={e => updateAgentWorkstation({ ipAddress: e.target.value })}
                                        className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-sm text-white font-mono outline-none focus:border-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Uptime</label>
                                    <input 
                                        value={currentAgent?.workstation?.uptime || ''}
                                        onChange={e => updateAgentWorkstation({ uptime: e.target.value })}
                                        className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-sm text-white outline-none focus:border-blue-500"
                                    />
                                </div>
                            </div>

                            {/* Installed Software */}
                            <div className="mb-6">
                                <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Installed Software</label>
                                <div className="space-y-2">
                                    {currentAgent?.workstation?.installedSoftware.map((sw, i) => (
                                        <div key={i} className="flex justify-between items-center bg-slate-950 p-2 rounded border border-slate-800">
                                            <span className="text-sm text-slate-300">{sw}</span>
                                            <button onClick={() => {
                                                const newSw = currentAgent?.workstation?.installedSoftware.filter((_, idx) => idx !== i);
                                                updateAgentWorkstation({ installedSoftware: newSw });
                                            }} className="text-slate-500 hover:text-red-400"><Trash2 size={14}/></button>
                                        </div>
                                    ))}
                                    <div className="flex gap-2">
                                        <input 
                                            className="flex-1 bg-slate-950 border border-slate-700 rounded-lg p-2 text-sm text-white outline-none focus:border-blue-500"
                                            placeholder="Add package..."
                                            onKeyDown={e => {
                                                if(e.key === 'Enter') {
                                                    const val = e.currentTarget.value;
                                                    if(val) {
                                                        const newSw = [...(currentAgent?.workstation?.installedSoftware || []), val];
                                                        updateAgentWorkstation({ installedSoftware: newSw });
                                                        e.currentTarget.value = '';
                                                    }
                                                }
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Agent Assets */}
                            <div className="mb-6">
                                <div className="flex justify-between items-center mb-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase">Agent Assets</label>
                                    <button 
                                        onClick={() => {
                                            const name = prompt("Asset Name");
                                            if (name) {
                                                const newAsset: AgentAsset = {
                                                    id: Date.now().toString(),
                                                    type: 'LICENSE', // Default type
                                                    name: name,
                                                    detail: 'New Asset',
                                                    status: 'ACTIVE'
                                                };
                                                const newAssets = [...(currentAgent?.workstation?.assets || []), newAsset];
                                                updateAgentWorkstation({ assets: newAssets });
                                            }
                                        }}
                                        className="text-xs text-blue-400 hover:text-blue-300 font-bold flex items-center gap-1"
                                    >
                                        <Plus size={12}/> Add Asset
                                    </button>
                                </div>
                                <div className="space-y-2">
                                    {currentAgent?.workstation?.assets?.map((asset, i) => (
                                        <div key={i} className="flex justify-between items-center bg-slate-950 p-2 rounded border border-slate-800">
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs font-bold text-slate-400 bg-slate-900 px-2 rounded border border-slate-700">{asset.type}</span>
                                                <span className="text-sm text-slate-300">{asset.name}</span>
                                            </div>
                                            <button onClick={() => {
                                                const newAssets = currentAgent?.workstation?.assets.filter(a => a.id !== asset.id);
                                                updateAgentWorkstation({ assets: newAssets });
                                            }} className="text-slate-500 hover:text-red-400"><Trash2 size={14}/></button>
                                        </div>
                                    ))}
                                    {(!currentAgent?.workstation?.assets || currentAgent.workstation.assets.length === 0) && (
                                        <div className="text-xs text-slate-600 italic p-2">No assets assigned.</div>
                                    )}
                                </div>
                            </div>

                            {/* Webhooks */}
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase">Webhooks</label>
                                    <button 
                                        onClick={() => {
                                            const url = prompt("Webhook URL");
                                            if (url) {
                                                const newWebhook = { url, active: true, event: 'all' };
                                                const newWebhooks = [...(currentAgent?.workstation?.webhooks || []), newWebhook];
                                                updateAgentWorkstation({ webhooks: newWebhooks });
                                            }
                                        }}
                                        className="text-xs text-blue-400 hover:text-blue-300 font-bold flex items-center gap-1"
                                    >
                                        <Plus size={12}/> Add Hook
                                    </button>
                                </div>
                                <div className="space-y-2">
                                    {currentAgent?.workstation?.webhooks?.map((hook, i) => (
                                        <div key={i} className="flex justify-between items-center bg-slate-950 p-2 rounded border border-slate-800">
                                            <div className="flex items-center gap-2 truncate flex-1 mr-2">
                                                <div className={`w-2 h-2 rounded-full ${hook.active ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                                <span className="text-xs text-slate-400 font-mono truncate">{hook.url}</span>
                                            </div>
                                            <button onClick={() => {
                                                const newWebhooks = currentAgent?.workstation?.webhooks.filter((_, idx) => idx !== i);
                                                updateAgentWorkstation({ webhooks: newWebhooks });
                                            }} className="text-slate-500 hover:text-red-400"><Trash2 size={14}/></button>
                                        </div>
                                    ))}
                                    {(!currentAgent?.workstation?.webhooks || currentAgent.workstation.webhooks.length === 0) && (
                                        <div className="text-xs text-slate-600 italic p-2">No webhooks configured.</div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* System Prompt */}
                        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-bold text-white flex items-center gap-2"><Edit3 size={18} className="text-orange-400"/> System Instruction</h3>
                                <button className="text-xs text-teal-400 hover:text-teal-300 font-bold flex items-center gap-1">
                                    <Sparkles size={12}/> Refine with AI
                                </button>
                            </div>
                            <textarea 
                                className="w-full h-48 bg-slate-950 border border-slate-700 rounded-lg p-4 text-sm text-slate-300 font-mono outline-none resize-none leading-relaxed"
                                defaultValue={currentAgent?.config?.systemPrompt}
                            />
                        </div>

                        {/* Integrations */}
                        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                            <h3 className="font-bold text-white mb-6 flex items-center gap-2"><Plug size={20} className="text-purple-400"/> Active Integrations</h3>
                            <div className="space-y-3">
                                {currentAgent?.config?.manualIntegrations?.map((int, i) => (
                                    <div key={i} className="flex items-center justify-between p-3 bg-slate-950 border border-slate-800 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-slate-900 rounded border border-slate-800 text-slate-400">
                                                {int.type === 'API_KEY' ? <Key size={16}/> : <Terminal size={16}/>}
                                            </div>
                                            <div>
                                                <div className="font-bold text-sm text-white">{int.name}</div>
                                                <div className="text-xs text-slate-500 font-mono">••••••••••••••••</div>
                                            </div>
                                        </div>
                                        <span className="text-[10px] font-bold bg-green-900/20 text-green-400 px-2 py-1 rounded border border-green-500/20">CONNECTED</span>
                                    </div>
                                ))}
                                <button className="w-full py-2 border border-dashed border-slate-700 rounded-lg text-slate-500 hover:text-white hover:border-slate-500 text-sm font-bold transition">
                                    + Add New Credential
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

export default AgentView;
