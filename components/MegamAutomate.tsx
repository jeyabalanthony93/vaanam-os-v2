
import React, { useState, useRef } from 'react';
import { Workflow, Play, Zap, Box, Code, Globe, Database, ArrowRight, Save, Plus, MoreHorizontal, Settings, RefreshCw, Layers, Cpu, Terminal, Sparkles, MessageSquare, Sliders, CheckCircle2, FileJson, X, Download, Trash2, MousePointer2, Radio, Search, FileUp, AlertTriangle } from 'lucide-react';
import { AutomationNode, AutomationConnection } from '../types';
import { generateWorkflowFromPrompt, runAutomationNode, autoHealWorkflow } from '../services/geminiService';

const MegamAutomate: React.FC = () => {
  const [nodes, setNodes] = useState<AutomationNode[]>([
      { id: 'start', type: 'TRIGGER', label: 'Webhook (Start)', x: 100, y: 300, config: { method: 'POST', path: '/webhook/leads' }, status: 'IDLE', icon: Zap },
      { id: 'action1', type: 'ACTION', label: 'Google Search Extraction', x: 350, y: 300, config: { query: 'site:linkedin.com "CEO"', limit: 10 }, status: 'IDLE', icon: Globe },
      { id: 'action2', type: 'CODE', label: 'Filter & Score', x: 600, y: 300, config: { lang: 'Python', script: 'if lead.score > 50: return True' }, status: 'IDLE', icon: Code },
      { id: 'end', type: 'ACTION', label: 'Slack Alert', x: 850, y: 300, config: { channel: '#sales-leads' }, status: 'IDLE', icon: MessageSquare }
  ]);
  const [connections, setConnections] = useState<AutomationConnection[]>([
      { id: 'c1', from: 'start', to: 'action1' },
      { id: 'c2', from: 'action1', to: 'action2' },
      { id: 'c3', from: 'action2', to: 'end' }
  ]);
  
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedNode, setSelectedNode] = useState<AutomationNode | null>(null);
  const [liveMode, setLiveMode] = useState(false);
  
  // Execution Data State
  const [executionData, setExecutionData] = useState<Record<string, any>>({});
  const [activeExecutionId, setActiveExecutionId] = useState<string | null>(null);
  
  // Healing State
  const [isHealing, setIsHealing] = useState(false);
  const [healLog, setHealLog] = useState('');

  // File Upload State
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleGenerate = async () => {
      if (!prompt) return;
      setIsGenerating(true);
      const { nodes: newNodes, connections: newConns } = await generateWorkflowFromPrompt(prompt);
      setNodes(newNodes.map(n => ({...n, icon: getNodeIcon(n.type)}))); 
      setConnections(newConns);
      setIsGenerating(false);
  };

  const handleRun = async () => {
      if (isRunning) return;
      setIsRunning(true);
      setExecutionData({});
      setActiveExecutionId(Date.now().toString());
      setHealLog('');
      
      // Reset statuses
      setNodes(prev => prev.map(n => ({ ...n, status: 'IDLE' })));

      // Sequential Execution Simulation with clear delays to prevent glitches
      for (let i = 0; i < nodes.length; i++) {
          const node = nodes[i];
          
          // Set Node Status Running
          setNodes(prev => prev.map(n => n.id === node.id ? { ...n, status: 'RUNNING' } : n));
          await new Promise(r => setTimeout(r, 600)); // Visual delay
          
          // Simulate Execution
          const inputData = i > 0 ? executionData[nodes[i-1].id] : { initial: true };
          const result = await runAutomationNode(node.type, node.config, inputData);
          
          // Store Result
          setExecutionData(prev => ({ ...prev, [node.id]: result }));
          
          // Set Node Status Success
          setNodes(prev => prev.map(n => n.id === node.id ? { ...n, status: 'SUCCESS' } : n));
      }
      
      setIsRunning(false);
  };

  const handleSimulateEvent = () => {
      handleRun();
  };

  const downloadResults = () => {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(executionData, null, 2));
      const downloadAnchorNode = document.createElement('a');
      downloadAnchorNode.setAttribute("href", dataStr);
      downloadAnchorNode.setAttribute("download", `execution_${activeExecutionId || 'log'}.json`);
      document.body.appendChild(downloadAnchorNode);
      downloadAnchorNode.click();
      downloadAnchorNode.remove();
  };

  const handleAutoFix = async () => {
      setIsHealing(true);
      const res = await autoHealWorkflow(activeExecutionId || 'wf-1');
      setHealLog(res.fixLog);
      setIsHealing(false);
      // Visually "fix" nodes
      setNodes(prev => prev.map(n => ({...n, status: 'IDLE'})));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      
      // Simulate file parsing
      setExecutionData(prev => ({ ...prev, 'upload-input': { 
          filename: file.name, 
          size: file.size, 
          parsed: true, 
          rows: 1402 
      }}));
      
      // Add a virtual trigger node if not present
      if (!nodes.find(n => n.id === 'file-trigger')) {
          const fileNode: AutomationNode = { 
              id: 'file-trigger', type: 'TRIGGER', label: `File: ${file.name}`, x: 50, y: 150, 
              config: { file: file.name }, status: 'SUCCESS', icon: FileUp 
          };
          setNodes(prev => [fileNode, ...prev]);
          // Connect to first node
          if (nodes.length > 0) {
              setConnections(prev => [{id: `f-${nodes[0].id}`, from: 'file-trigger', to: nodes[0].id}, ...prev]);
          }
      }
  };

  const updateNodeConfig = (key: string, value: string) => {
      if (!selectedNode) return;
      const updatedNode = { ...selectedNode, config: { ...selectedNode.config, [key]: value } };
      setNodes(prev => prev.map(n => n.id === selectedNode.id ? updatedNode : n));
      setSelectedNode(updatedNode);
  };

  const getNodeIcon = (type: string) => {
      switch(type) {
          case 'TRIGGER': return Zap;
          case 'ACTION': return Box;
          case 'CONDITION': return Sliders;
          case 'CODE': return Code;
          case 'LOOP': return RefreshCw;
          default: return Box;
      }
  };

  return (
    <div className="h-full flex flex-col bg-[#0f172a] text-slate-200 font-sans relative">
      
      {/* Hidden File Input */}
      <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileUpload} accept=".csv,.json,.xlsx" />

      {/* Header */}
      <div className="h-16 border-b border-slate-800 bg-slate-900/80 backdrop-blur-sm flex justify-between items-center px-6 z-10">
          <div className="flex items-center gap-4">
              <div className="p-2 bg-indigo-600 rounded-lg shadow-lg shadow-indigo-500/30 text-white">
                  <Workflow size={24}/>
              </div>
              <div>
                  <h1 className="text-xl font-bold text-white">Megam Automate</h1>
                  <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider flex items-center gap-1">
                      <Cpu size={10}/> Neural Orchestrator
                  </p>
              </div>
          </div>
          <div className="flex items-center gap-4">
              <button 
                onClick={() => setLiveMode(!liveMode)} 
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold border transition ${liveMode ? 'bg-red-500/20 text-red-400 border-red-500/50' : 'bg-slate-800 text-slate-400 border-slate-700'}`}
                title="Toggle Real-time Webhook Listening"
              >
                  <Radio size={14} className={liveMode ? 'animate-pulse' : ''}/>
                  {liveMode ? 'Live Listening' : 'Offline Mode'}
              </button>

              <button 
                onClick={() => fileInputRef.current?.click()}
                className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-full font-bold text-xs border border-slate-700 flex items-center gap-2"
                title="Upload CSV/JSON Data Source"
              >
                  <FileUp size={14}/> Upload Data
              </button>

              <button 
                onClick={handleAutoFix}
                disabled={isHealing}
                className="bg-yellow-900/20 hover:bg-yellow-900/40 text-yellow-500 border border-yellow-700/50 px-4 py-2 rounded-full font-bold text-xs flex items-center gap-2"
                title="AI Self-Healing for Broken Workflows"
              >
                  {isHealing ? <RefreshCw className="animate-spin" size={14}/> : <AlertTriangle size={14}/>} Auto-Fix
              </button>

              <button 
                onClick={handleRun}
                disabled={isRunning}
                className="bg-green-600 hover:bg-green-500 text-white px-6 py-2 rounded-full font-bold text-sm shadow-lg shadow-green-900/20 flex items-center gap-2 transition disabled:opacity-50"
                title="Execute Workflow Now"
              >
                  {isRunning ? <RefreshCw className="animate-spin" size={16}/> : <Play size={16} fill="currentColor"/>}
                  {isRunning ? 'Executing...' : 'Run Workflow'}
              </button>
              
              {Object.keys(executionData).length > 0 && (
                  <button onClick={downloadResults} className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-full font-bold text-xs shadow-lg flex items-center gap-2" title="Download Execution JSON">
                      <Download size={14}/> Export Data
                  </button>
              )}
          </div>
      </div>

      <div className="flex-1 relative overflow-hidden flex">
          
          {/* Node Library Sidebar */}
          <div className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col z-10">
              <div className="p-4 border-b border-slate-800">
                  <h3 className="text-xs font-bold text-slate-500 uppercase mb-4">Node Library</h3>
                  <div className="space-y-2">
                      {[
                          { type: 'TRIGGER', label: 'Webhook', icon: Globe },
                          { type: 'TRIGGER', label: 'Search Scanner', icon: Search },
                          { type: 'ACTION', label: 'Google Extract', icon: Globe },
                          { type: 'ACTION', label: 'RAG Query', icon: Database },
                          { type: 'ACTION', label: 'MCP Tool', icon: Box },
                          { type: 'CODE', label: 'Python Script', icon: Code },
                          { type: 'CONDITION', label: 'If / Else', icon: Sliders },
                      ].map((item, i) => (
                          <div key={i} className="p-3 bg-slate-800 border border-slate-700 rounded-lg cursor-grab hover:border-indigo-500 hover:text-white text-slate-400 text-sm font-bold flex items-center gap-3 transition">
                              <item.icon size={16}/> {item.label}
                          </div>
                      ))}
                  </div>
              </div>
              <div className="flex-1 p-4 bg-slate-900/50">
                  <h3 className="text-xs font-bold text-slate-500 uppercase mb-4">Integrations</h3>
                  <div className="grid grid-cols-3 gap-2">
                      {['Slack', 'Gmail', 'Stripe', 'HubSpot', 'Discord', 'Notion'].map(app => (
                          <div key={app} className="aspect-square bg-slate-800 rounded-lg flex items-center justify-center hover:bg-slate-700 cursor-pointer border border-slate-700 text-[10px] text-slate-500 hover:text-white transition" title={app}>
                              {app[0]}
                          </div>
                      ))}
                  </div>
              </div>
          </div>

          {/* Canvas */}
          <div 
            className="flex-1 bg-[#0b0f19] relative overflow-hidden cursor-crosshair"
            onClick={() => setSelectedNode(null)}
          >
              {/* Grid Background */}
              <div className="absolute inset-0 opacity-20 pointer-events-none" style={{backgroundImage: 'linear-gradient(#334155 1px, transparent 1px), linear-gradient(90deg, #334155 1px, transparent 1px)', backgroundSize: '40px 40px'}}></div>
              
              {/* Connections */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                  {connections.map(conn => {
                      const fromNode = nodes.find(n => n.id === conn.from);
                      const toNode = nodes.find(n => n.id === conn.to);
                      if (!fromNode || !toNode) return null;
                      
                      const isExecuted = fromNode.status === 'SUCCESS' && (toNode.status === 'RUNNING' || toNode.status === 'SUCCESS');

                      return (
                          <path 
                            key={conn.id}
                            d={`M ${fromNode.x + 200} ${fromNode.y + 40} C ${fromNode.x + 250} ${fromNode.y + 40}, ${toNode.x - 50} ${toNode.y + 40}, ${toNode.x} ${toNode.y + 40}`}
                            stroke={isExecuted ? '#4ade80' : '#64748b'} 
                            strokeWidth="3" 
                            fill="none" 
                            className={`drop-shadow-md transition-all duration-500 ${isExecuted ? 'animate-pulse' : ''}`}
                          />
                      )
                  })}
              </svg>

              {/* Nodes */}
              {nodes.map(node => (
                  <div 
                    key={node.id}
                    onClick={(e) => { e.stopPropagation(); setSelectedNode(node); }}
                    className={`
                        absolute w-52 bg-slate-800 rounded-xl border-2 shadow-2xl p-4 cursor-pointer transition transform hover:scale-105 group 
                        ${node.status === 'RUNNING' ? 'border-yellow-500 ring-4 ring-yellow-500/20' : node.status === 'SUCCESS' ? 'border-green-500' : selectedNode?.id === node.id ? 'border-indigo-500' : 'border-slate-700'}
                    `}
                    style={{ left: node.x, top: node.y }}
                  >
                      <div className="flex justify-between items-center mb-3">
                          <div className={`p-2 rounded-lg ${node.type === 'TRIGGER' ? 'bg-indigo-500/20 text-indigo-400' : 'bg-slate-700 text-slate-300'}`}>
                              {node.icon && <node.icon size={18}/>}
                          </div>
                          {node.status === 'SUCCESS' && <CheckCircle2 size={16} className="text-green-500"/>}
                          {node.status === 'RUNNING' && <RefreshCw size={16} className="text-yellow-500 animate-spin"/>}
                      </div>
                      <div className="font-bold text-white text-sm mb-1">{node.label}</div>
                      <div className="text-[10px] text-slate-500 font-mono uppercase">{node.type}</div>
                      
                      {/* Ports */}
                      <div className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-3 h-3 bg-slate-400 rounded-full border-2 border-slate-900"></div>
                      <div className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 bg-slate-400 rounded-full border-2 border-slate-900 group-hover:bg-indigo-500 transition"></div>
                  </div>
              ))}

              {/* AI Prompt Bar */}
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-[600px] z-20">
                  <div className="bg-slate-900/90 backdrop-blur-xl border border-indigo-500/50 p-2 rounded-2xl shadow-2xl flex items-center gap-3">
                      <div className="p-3 bg-indigo-600 rounded-xl text-white animate-pulse">
                          <Sparkles size={20}/>
                      </div>
                      <input 
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                        placeholder="Describe workflow (e.g. 'Scrape ProductHunt -> Summarize with LLM -> Email')..." 
                        className="flex-1 bg-transparent text-white placeholder-slate-400 outline-none text-sm"
                      />
                      <button 
                        onClick={handleGenerate}
                        disabled={isGenerating || !prompt}
                        className="p-2 hover:bg-slate-800 rounded-lg text-indigo-400 transition disabled:opacity-50"
                        title="Generate Workflow from Prompt"
                      >
                          {isGenerating ? <RefreshCw className="animate-spin"/> : <ArrowRight/>}
                      </button>
                  </div>
              </div>
          </div>

          {/* Right Sidebar: Config & Data */}
          <div className="w-96 bg-slate-900 border-l border-slate-800 flex flex-col z-10 shadow-2xl">
              {selectedNode ? (
                  <div className="flex-1 flex flex-col h-full">
                      <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-800/50">
                          <div>
                              <h3 className="font-bold text-white flex items-center gap-2">
                                  {selectedNode.icon && <selectedNode.icon size={16} className="text-indigo-400"/>}
                                  {selectedNode.label}
                              </h3>
                              <p className="text-[10px] text-slate-400 uppercase font-bold mt-1">ID: {selectedNode.id}</p>
                          </div>
                          <button onClick={() => setSelectedNode(null)}><X size={16} className="text-slate-500 hover:text-white"/></button>
                      </div>

                      <div className="flex-1 overflow-y-auto p-6 space-y-6">
                          {/* Configuration Section */}
                          <div className="space-y-4">
                              <h4 className="text-xs font-bold text-slate-500 uppercase border-b border-slate-800 pb-2">Configuration</h4>
                              {Object.entries(selectedNode.config).map(([key, val]) => (
                                  <div key={key}>
                                      <label className="text-xs text-slate-400 block mb-1 capitalize">{key}</label>
                                      <input 
                                        className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-sm text-white font-mono focus:border-indigo-500 outline-none"
                                        value={val as string}
                                        onChange={(e) => updateNodeConfig(key, e.target.value)}
                                      />
                                  </div>
                              ))}
                              <button className="text-xs text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-1">
                                  <Plus size={12}/> Add Parameter
                              </button>
                          </div>

                          {/* Data Output Section */}
                          <div className="space-y-2">
                              <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                                  <h4 className="text-xs font-bold text-slate-500 uppercase">Execution Output</h4>
                                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${executionData[selectedNode.id] ? 'bg-green-900/20 text-green-400' : 'bg-slate-800 text-slate-500'}`}>
                                      {executionData[selectedNode.id] ? 'JSON' : 'NO DATA'}
                                  </span>
                              </div>
                              <div className="bg-[#0b0f19] rounded-lg border border-slate-800 p-4 font-mono text-xs text-green-400 h-64 overflow-auto relative group">
                                  {executionData[selectedNode.id] ? (
                                      <pre>{JSON.stringify(executionData[selectedNode.id], null, 2)}</pre>
                                  ) : (
                                      <div className="text-slate-600 italic text-center mt-10">
                                          Run the workflow to see data output for this node.
                                      </div>
                                  )}
                                  {executionData[selectedNode.id] && (
                                      <button 
                                        onClick={() => { navigator.clipboard.writeText(JSON.stringify(executionData[selectedNode.id], null, 2)); }}
                                        className="absolute top-2 right-2 p-1 bg-slate-800 text-slate-400 rounded hover:text-white opacity-0 group-hover:opacity-100 transition"
                                        title="Copy JSON"
                                      >
                                          <FileJson size={14}/>
                                      </button>
                                  )}
                              </div>
                          </div>
                      </div>
                  </div>
              ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-slate-500 p-8 text-center space-y-4">
                      {healLog && (
                          <div className="bg-yellow-900/20 border border-yellow-700/50 p-4 rounded-lg text-xs text-yellow-200 text-left w-full mb-6">
                              <div className="font-bold flex items-center gap-2 mb-1"><AlertTriangle size={12}/> Auto-Heal Report</div>
                              {healLog}
                          </div>
                      )}
                      <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center mb-2">
                          <MousePointer2 size={32} className="opacity-50"/>
                      </div>
                      <p className="text-sm">Select a node on the canvas to configure settings and inspect data flow.</p>
                  </div>
              )}
          </div>
      </div>
    </div>
  );
};

export default MegamAutomate;
