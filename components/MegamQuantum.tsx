import React, { useState, useEffect, useRef } from 'react';
import { Atom, Cpu, Shield, Zap, RefreshCw, Layers, Code, Play, Terminal, Lock, Activity, Binary, BrainCircuit, Box, FlaskConical, TrendingUp, Truck, Database, Mic, Speaker, Search, Key, Bug, Wand2, Sparkles, User, MessageSquare, CheckCircle2 } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { simulateQuantumJob, getQuantumStats, trainQuantumModel, runQuantumSolver, getQuantumProgramTrace, optimizeCodeQuantum } from '../services/geminiService';

const MegamQuantum: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'COMPOSER' | 'QML' | 'APPS' | 'DEBUGGER' | 'SECURITY'>('OVERVIEW');
  const [qStats, setQStats] = useState<any>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  
  // Composer State
  const [circuit, setCircuit] = useState<string[][]>([
      ['H', 'CNOT', 'M', '', ''],
      ['', 'TARGET', '', '', ''], // Target for CNOT
      ['', '', '', '', ''] 
  ]);
  const [execResult, setExecResult] = useState<any>(null);

  // QML State
  const [qmlConfig, setQmlConfig] = useState({
      dataset: 'Quantum MNIST',
      model: 'Variational Quantum Classifier (VQC)',
      ansatz: 'RealAmplitudes',
      qubits: 4,
      optimizer: 'SPSA',
      shots: 1024
  });
  const [qmlTraining, setQmlTraining] = useState(false);
  const [qmlMetrics, setQmlMetrics] = useState<{epoch: number, loss: number, accuracy: number}[]>([]);

  // Apps State
  const [appResult, setAppResult] = useState<any>(null);
  const [appRunning, setAppRunning] = useState(false);

  // Dictator State
  const [dictatorLogs, setDictatorLogs] = useState<string[]>([]);
  const [dictatorActive, setDictatorActive] = useState(false);
  const dictatorEndRef = useRef<HTMLDivElement>(null);

  // Debugger State
  const [errorLog, setErrorLog] = useState('');
  const [debugResult, setDebugResult] = useState<any>(null);
  const [isDebugging, setIsDebugging] = useState(false);

  // Agent State
  const [agentMessage, setAgentMessage] = useState("Hello! I'm Dr. Q. Ready to optimize your code with quantum algorithms?");

  useEffect(() => {
      const fetchStats = async () => {
          const stats = await getQuantumStats();
          setQStats(stats);
      };
      fetchStats();
      const interval = setInterval(fetchStats, 3000);
      return () => clearInterval(interval);
  }, []);

  // QML Training Loop
  useEffect(() => {
      let interval: ReturnType<typeof setInterval>;
      if (qmlTraining) {
          let step = 0;
          setQmlMetrics([]);
          interval = setInterval(async () => {
              step++;
              const metric = await trainQuantumModel(step);
              setQmlMetrics(prev => [...prev, metric]);
              if (step >= 20) setQmlTraining(false);
          }, 800);
      }
      return () => clearInterval(interval);
  }, [qmlTraining]);

  useEffect(() => {
      if (dictatorEndRef.current) {
          dictatorEndRef.current.scrollIntoView({ behavior: 'smooth' });
      }
  }, [dictatorLogs]);

  const handleExecuteCircuit = async () => {
      setIsSimulating(true);
      const res = await simulateQuantumJob('custom-circuit');
      setExecResult(res);
      setIsSimulating(false);
  };

  const runApplication = async (type: 'CHEMISTRY' | 'FINANCE' | 'GROVER' | 'SHOR') => {
      setAppRunning(true);
      setAppResult(null);
      setDictatorActive(true);
      setDictatorLogs([]);

      // Start narration logs
      const trace = await getQuantumProgramTrace(type);
      let logIndex = 0;
      const logInterval = setInterval(() => {
          if (logIndex < trace.length) {
              setDictatorLogs(prev => [...prev, trace[logIndex]]);
              logIndex++;
          } else {
              clearInterval(logInterval);
          }
      }, 800);

      const res = await runQuantumSolver(type);
      
      // Wait for logs to finish mostly
      setTimeout(() => {
          setAppResult(res);
          setAppRunning(false);
          setDictatorActive(false);
          clearInterval(logInterval);
      }, trace.length * 800 + 500);
  };

  const updateCircuit = (row: number, col: number, gate: string) => {
      const newCircuit = [...circuit];
      newCircuit[row][col] = gate;
      setCircuit(newCircuit);
  };

  const handleQuantumDebug = async () => {
      if (!errorLog) return;
      setIsDebugging(true);
      setDebugResult(null);
      setAgentMessage("Analyzing search space... Converting logic gates to Quantum Circuit... Applying Grover's Algorithm.");
      
      const res = await optimizeCodeQuantum(errorLog);
      
      setTimeout(() => {
          setDebugResult(res);
          setIsDebugging(false);
          setAgentMessage("Optimization complete! I've found a quantum speedup for your issue.");
      }, 2500);
  };

  return (
    <div className="h-full flex flex-col bg-[#050507] text-slate-200 font-sans selection:bg-indigo-500 selection:text-white">
      {/* Header */}
      <div className="border-b border-indigo-900/30 bg-[#0a0a0f] p-4 flex justify-between items-center relative overflow-hidden">
          {/* Ambient Glow */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 animate-[shimmer_2s_infinite]"></div>
          
          <div className="flex items-center gap-4 relative z-10">
              <div className="p-3 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-xl shadow-[0_0_20px_rgba(99,102,241,0.4)] animate-pulse">
                  <Atom size={24} className="text-white"/>
              </div>
              <div>
                  <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-indigo-200">Megam Quantum Studio</h1>
                  <p className="text-indigo-400 text-xs font-mono flex items-center gap-2">
                      <Zap size={10} className="fill-current"/> Neural Bridge QPU Online
                  </p>
              </div>
          </div>
          <div className="flex bg-[#12121a] rounded-lg p-1 border border-indigo-900/50 overflow-x-auto">
              {[
                  { id: 'OVERVIEW', label: 'Status', icon: Activity },
                  { id: 'COMPOSER', label: 'Composer', icon: Layers },
                  { id: 'DEBUGGER', label: 'Debugger', icon: Bug },
                  { id: 'QML', label: 'QML Lab', icon: BrainCircuit },
                  { id: 'APPS', label: 'Apps', icon: Box },
                  { id: 'SECURITY', label: 'Security', icon: Shield }
              ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-md text-xs font-bold transition whitespace-nowrap ${activeTab === tab.id ? 'bg-indigo-600 text-white shadow-[0_0_10px_rgba(79,70,229,0.3)]' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                  >
                      {/* @ts-ignore */}
                      <tab.icon size={14} /> {tab.label}
                  </button>
              ))}
          </div>
      </div>

      <div className="flex-1 overflow-hidden flex relative">
          
          {/* Main Content Area */}
          <div className="flex-1 overflow-y-auto p-8 relative z-10">
              
              {activeTab === 'OVERVIEW' && qStats && (
                  <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                          <div className="bg-[#12121a] border border-indigo-900/30 p-6 rounded-xl relative overflow-hidden group">
                              <div className="absolute inset-0 bg-indigo-600/5 group-hover:bg-indigo-600/10 transition"></div>
                              <h3 className="text-xs font-bold text-indigo-400 uppercase mb-2">Virtual Qubits</h3>
                              <div className="text-4xl font-mono text-white mb-2">{qStats.qubits}</div>
                              <div className="text-slate-400 text-xs flex items-center gap-1"><Zap size={12} className="text-yellow-400 fill-current"/> Coherence Stable</div>
                          </div>
                          <div className="bg-[#12121a] border border-indigo-900/30 p-6 rounded-xl">
                              <h3 className="text-xs font-bold text-slate-500 uppercase mb-2">Quantum Volume</h3>
                              <div className="text-3xl font-mono text-white mb-2">{qStats.quantumVolume}</div>
                              <div className="text-purple-400 text-xs">High Fidelity</div>
                          </div>
                          <div className="bg-[#12121a] border border-indigo-900/30 p-6 rounded-xl">
                              <h3 className="text-xs font-bold text-slate-500 uppercase mb-2">Coherence Time</h3>
                              <div className="text-3xl font-mono text-white mb-2">{qStats.coherenceTime}</div>
                              <div className="text-green-400 text-xs">T1 Relaxation</div>
                          </div>
                          <div className="bg-[#12121a] border border-indigo-900/30 p-6 rounded-xl">
                              <h3 className="text-xs font-bold text-slate-500 uppercase mb-2">Gate Error Rate</h3>
                              <div className="text-3xl font-mono text-white mb-2">{qStats.errorRate}</div>
                              <div className="text-blue-400 text-xs">Error Correction Active</div>
                          </div>
                      </div>

                      <div className="bg-[#0f0f13] border border-indigo-900/50 rounded-2xl p-12 relative overflow-hidden flex flex-col items-center justify-center text-center">
                          {/* Background Grid */}
                          <div className="absolute inset-0 opacity-20" style={{backgroundImage: 'radial-gradient(#4f46e5 1px, transparent 1px)', backgroundSize: '30px 30px'}}></div>
                          
                          <div className="relative z-10">
                              <div className="w-24 h-24 bg-indigo-900/30 rounded-full flex items-center justify-center mx-auto mb-6 border border-indigo-500/30 shadow-[0_0_50px_rgba(99,102,241,0.2)]">
                                  <Cpu size={48} className="text-indigo-400"/>
                              </div>
                              <h2 className="text-3xl font-bold text-white mb-4">Neural Bridge QPU Architecture</h2>
                              <p className="text-indigo-200 max-w-2xl mx-auto text-lg leading-relaxed">
                                  Experience the power of <span className="text-white font-bold">128 noise-free qubits</span> simulated on standard hardware via our proprietary tensor network engine. 
                                  No cryogenics required.
                              </p>
                          </div>
                          
                          {/* Qubit Visualization */}
                          <div className="mt-12 grid grid-cols-8 gap-4 opacity-60">
                              {Array.from({length: 16}).map((_, i) => (
                                  <div key={i} className="w-3 h-3 bg-indigo-500 rounded-full animate-pulse" style={{animationDelay: `${i*0.1}s`}}></div>
                              ))}
                          </div>
                      </div>
                  </div>
              )}

              {activeTab === 'DEBUGGER' && (
                  <div className="h-full flex flex-col max-w-4xl mx-auto animate-in slide-in-from-bottom-8 duration-500">
                      <div className="text-center mb-8">
                          <h2 className="text-3xl font-bold text-white mb-2 flex items-center justify-center gap-3">
                              <Sparkles className="text-yellow-400"/> Quantum Code Solver
                          </h2>
                          <p className="text-slate-400">Use Grover's Algorithm to search for bugs in O(√N) time.</p>
                      </div>

                      <div className="bg-[#12121a] border border-indigo-900/50 rounded-2xl p-8 relative overflow-hidden shadow-2xl">
                          {isDebugging && (
                              <div className="absolute inset-0 bg-indigo-900/10 z-0 flex items-center justify-center">
                                  <div className="w-full h-1 bg-indigo-500 absolute top-0 animate-[scan_2s_linear_infinite]"></div>
                              </div>
                          )}
                          
                          <div className="relative z-10 space-y-6">
                              <div>
                                  <label className="text-xs font-bold text-indigo-400 uppercase mb-2 block">Paste Application Error / Log</label>
                                  <textarea 
                                    value={errorLog}
                                    onChange={(e) => setErrorLog(e.target.value)}
                                    className="w-full h-32 bg-black/50 border border-indigo-900/50 rounded-xl p-4 text-sm font-mono text-slate-300 outline-none focus:border-indigo-500 transition resize-none"
                                    placeholder="e.g. Memory leak detected in data_ingestion.py at line 405..."
                                  />
                              </div>

                              <button 
                                onClick={handleQuantumDebug}
                                disabled={isDebugging || !errorLog}
                                className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition overflow-hidden relative group ${isDebugging ? 'bg-indigo-900/50 text-indigo-300' : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-[0_0_20px_rgba(79,70,229,0.4)]'}`}
                              >
                                  {isDebugging ? <RefreshCw className="animate-spin"/> : <Wand2/>}
                                  {isDebugging ? 'Superposition Collapse in Progress...' : 'Quantum Fix'}
                                  
                                  {/* Button Shine Effect */}
                                  {!isDebugging && <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"></div>}
                              </button>

                              {debugResult && (
                                  <div className="bg-green-900/10 border border-green-500/30 rounded-xl p-6 animate-in fade-in zoom-in duration-300">
                                      <div className="flex items-start gap-4">
                                          <div className="p-3 bg-green-500/20 rounded-full text-green-400">
                                              <CheckCircle2 size={24}/>
                                          </div>
                                          <div>
                                              <h3 className="text-lg font-bold text-white mb-1">Solution Found</h3>
                                              <p className="text-sm text-slate-300 mb-4">{debugResult.solution}</p>
                                              
                                              <div className="flex gap-4 text-xs font-mono">
                                                  <div className="bg-black/30 px-3 py-1.5 rounded text-indigo-300 border border-indigo-900/50">
                                                      Speedup: {debugResult.quantumSpeedup}
                                                  </div>
                                                  <div className="bg-black/30 px-3 py-1.5 rounded text-purple-300 border border-purple-900/50">
                                                      Logic: {debugResult.logic}
                                                  </div>
                                              </div>
                                          </div>
                                      </div>
                                  </div>
                              )}
                          </div>
                      </div>
                  </div>
              )}

              {activeTab === 'COMPOSER' && (
              <div className="h-full flex gap-8 animate-in fade-in slide-in-from-right duration-300">
                  {/* Gate Library */}
                  <div className="w-48 bg-slate-900 border border-slate-800 rounded-xl p-4">
                      <h3 className="text-xs font-bold text-slate-500 uppercase mb-4">Gate Library</h3>
                      <div className="grid grid-cols-2 gap-2">
                          {['H', 'X', 'Y', 'Z', 'S', 'T', 'Rx', 'Ry', 'Rz', 'CNOT', 'SWAP', 'CCX', 'M'].map(gate => (
                              <div key={gate} className="p-2 bg-slate-800 border border-slate-700 rounded text-center font-bold text-xs text-white hover:bg-indigo-600 hover:border-indigo-500 cursor-grab transition">
                                  {gate}
                              </div>
                          ))}
                      </div>
                  </div>

                  {/* Circuit Board */}
                  <div className="flex-1 flex flex-col gap-6">
                      <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 flex-1 relative overflow-hidden flex flex-col justify-center gap-8">
                          {/* Grid Lines */}
                          <div className="absolute inset-0 opacity-5" style={{backgroundImage: 'linear-gradient(90deg, #6366f1 1px, transparent 1px)', backgroundSize: '60px 100%'}}></div>
                          
                          {/* 3 Wires */}
                          {[0, 1, 2].map((wireIdx) => (
                              <div key={wireIdx} className="relative z-10 flex items-center gap-4 h-12">
                                  <div className="text-slate-500 font-mono text-xs w-8">|q{wireIdx}⟩</div>
                                  <div className="h-px bg-slate-700 flex-1 relative"></div>
                                  <div className="absolute left-12 right-0 flex justify-between items-center px-4">
                                      {circuit[wireIdx].map((gate, colIdx) => (
                                          <div 
                                            key={`${wireIdx}-${colIdx}`} 
                                            className={`w-10 h-10 rounded flex items-center justify-center font-bold text-xs shadow-lg border cursor-pointer hover:scale-110 transition
                                                ${gate ? 'bg-indigo-600 border-indigo-400 text-white' : 'border-dashed border-slate-700 text-slate-600 hover:border-slate-500'}
                                            `}
                                            onClick={() => updateCircuit(wireIdx, colIdx, gate ? '' : 'H')} // Toggle H for demo
                                          >
                                              {gate || '+'}
                                          </div>
                                      ))}
                                  </div>
                              </div>
                          ))}
                      </div>

                      <div className="h-48 bg-black border border-slate-800 rounded-xl p-4 font-mono text-xs flex gap-6">
                          <div className="w-1/2 border-r border-slate-900 pr-4">
                              <h4 className="text-slate-500 font-bold mb-2 flex items-center gap-2"><Code size={12}/> Qiskit Code</h4>
                              <pre className="text-blue-300 overflow-y-auto h-full">
{`from qiskit import QuantumCircuit
qc = QuantumCircuit(3)
${circuit.flatMap((wire, r) => wire.map((g, c) => g ? (g === 'CNOT' || g === 'TARGET' ? `# ${g} @ ${r}` : `qc.${g.toLowerCase()}(${r})`) : null)).filter(Boolean).join('\n')}
qc.measure_all()
`}
                              </pre>
                          </div>
                          <div className="w-1/2 pl-4">
                              <div className="flex justify-between items-center mb-2">
                                  <h4 className="text-slate-500 font-bold flex items-center gap-2"><Terminal size={12}/> Output</h4>
                                  <button 
                                    onClick={handleExecuteCircuit}
                                    disabled={isSimulating}
                                    className="px-3 py-1 bg-green-600 hover:bg-green-500 text-white rounded text-[10px] font-bold flex items-center gap-1 disabled:opacity-50"
                                  >
                                      {isSimulating ? <RefreshCw size={10} className="animate-spin"/> : <Play size={10}/>} Run
                                  </button>
                              </div>
                              {execResult ? (
                                  <div className="text-green-400 space-y-1">
                                      <div>Status: {execResult.status} ({execResult.executionTime})</div>
                                      <div>Counts: {JSON.stringify(execResult.probabilities).replace(/"/g, '')}</div>
                                  </div>
                              ) : (
                                  <div className="text-slate-600 italic">Ready to execute on Neural Bridge simulator...</div>
                              )}
                          </div>
                      </div>
                  </div>
              </div>
          )}

          {activeTab === 'QML' && (
              <div className="h-full flex gap-8 animate-in fade-in slide-in-from-right duration-300">
                  <div className="w-80 bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col gap-6">
                      <h3 className="font-bold text-white flex items-center gap-2"><BrainCircuit size={18} className="text-purple-400"/> Training Config</h3>
                      
                      <div className="space-y-4">
                          <div>
                              <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Dataset</label>
                              <select className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-sm text-white" value={qmlConfig.dataset} onChange={e => setQmlConfig({...qmlConfig, dataset: e.target.value})}>
                                  <option>Quantum MNIST</option>
                                  <option>Iris (Quantum Kernel)</option>
                                  <option>Financial Time-Series</option>
                              </select>
                          </div>
                          <div>
                              <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Model Arch</label>
                              <select className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-sm text-white" value={qmlConfig.model} onChange={e => setQmlConfig({...qmlConfig, model: e.target.value})}>
                                  <option>Variational Quantum Classifier (VQC)</option>
                                  <option>Quantum GAN</option>
                                  <option>QSVM</option>
                              </select>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                              <div>
                                  <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Qubits</label>
                                  <input type="number" className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-sm text-white" value={qmlConfig.qubits} onChange={e => setQmlConfig({...qmlConfig, qubits: parseInt(e.target.value)})}/>
                              </div>
                              <div>
                                  <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Optimizer</label>
                                  <select className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-sm text-white" value={qmlConfig.optimizer} onChange={e => setQmlConfig({...qmlConfig, optimizer: e.target.value})}>
                                      <option>SPSA</option>
                                      <option>COBYLA</option>
                                      <option>Adam</option>
                                  </select>
                              </div>
                          </div>
                      </div>

                      <button 
                        onClick={() => setQmlTraining(!qmlTraining)}
                        className={`w-full py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition ${qmlTraining ? 'bg-red-600 text-white animate-pulse' : 'bg-purple-600 text-white hover:bg-purple-500'}`}
                      >
                          {qmlTraining ? 'Stop Training' : 'Start Hybrid Training'}
                      </button>
                  </div>

                  <div className="flex-1 bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col">
                      <div className="flex justify-between items-center mb-6">
                          <h3 className="font-bold text-white">Loss Landscape</h3>
                          <div className="flex items-center gap-4 text-xs font-mono">
                              <span className="text-slate-400">Epoch: {qmlMetrics.length}</span>
                              <span className="text-green-400">Acc: {qmlMetrics.length > 0 ? qmlMetrics[qmlMetrics.length-1].accuracy.toFixed(3) : '0.000'}</span>
                          </div>
                      </div>
                      
                      <div className="flex-1 min-h-[300px]">
                          <ResponsiveContainer width="100%" height="100%">
                              <AreaChart data={qmlMetrics}>
                                  <defs>
                                      <linearGradient id="colorLoss" x1="0" y1="0" x2="0" y2="1">
                                          <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                                          <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                                      </linearGradient>
                                  </defs>
                                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                                  <XAxis hide />
                                  <YAxis stroke="#64748b" fontSize={10} domain={[0, 1.5]}/>
                                  <Tooltip contentStyle={{backgroundColor: '#0f172a', border: '1px solid #334155'}} />
                                  <Area type="monotone" dataKey="loss" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorLoss)" />
                              </AreaChart>
                          </ResponsiveContainer>
                      </div>
                  </div>
              </div>
          )}

          {activeTab === 'APPS' && (
              <div className="h-full flex gap-8 animate-in fade-in duration-300">
                  <div className="w-1/3 flex flex-col gap-6">
                      <h2 className="text-lg font-bold text-white flex items-center gap-2"><Box size={20}/> Quantum Applications</h2>
                      
                      <div className="space-y-4">
                          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 hover:border-pink-500/50 transition cursor-pointer" onClick={() => runApplication('CHEMISTRY')}>
                              <h3 className="font-bold text-white flex items-center gap-2 text-sm"><FlaskConical size={16} className="text-pink-500"/> Molecular Discovery</h3>
                              <p className="text-xs text-slate-400 mt-1">Ground state energy of LiH via VQE.</p>
                          </div>
                          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 hover:border-green-500/50 transition cursor-pointer" onClick={() => runApplication('FINANCE')}>
                              <h3 className="font-bold text-white flex items-center gap-2 text-sm"><TrendingUp size={16} className="text-green-500"/> Portfolio Opt.</h3>
                              <p className="text-xs text-slate-400 mt-1">QAOA for asset allocation.</p>
                          </div>
                          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 hover:border-blue-500/50 transition cursor-pointer" onClick={() => runApplication('GROVER')}>
                              <h3 className="font-bold text-white flex items-center gap-2 text-sm"><Search size={16} className="text-blue-500"/> Grover's Search</h3>
                              <p className="text-xs text-slate-400 mt-1">Unstructured database search.</p>
                          </div>
                          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 hover:border-red-500/50 transition cursor-pointer" onClick={() => runApplication('SHOR')}>
                              <h3 className="font-bold text-white flex items-center gap-2 text-sm"><Key size={16} className="text-red-500"/> Shor's Algo</h3>
                              <p className="text-xs text-slate-400 mt-1">Integer factorization & cryptography.</p>
                          </div>
                      </div>
                  </div>

                  <div className="flex-1 flex flex-col gap-6">
                      {/* Program Dictator */}
                      <div className="flex-1 bg-black border border-slate-800 rounded-xl p-6 flex flex-col font-mono relative overflow-hidden">
                          <div className="flex justify-between items-center mb-4 border-b border-slate-800 pb-2">
                              <h3 className="font-bold text-slate-400 text-xs uppercase flex items-center gap-2"><Mic size={14}/> Virtual Program Dictator</h3>
                              {dictatorActive && <div className="text-green-500 text-xs animate-pulse flex items-center gap-1"><Speaker size={12}/> LIVE</div>}
                          </div>
                          
                          <div className="flex-1 overflow-y-auto space-y-2">
                              {dictatorLogs.map((log, i) => (
                                  <div key={i} className="text-sm text-green-400 animate-in fade-in slide-in-from-left-2">
                                      <span className="text-slate-600 mr-2">{`>`}</span>
                                      {log}
                                  </div>
                              ))}
                              <div ref={dictatorEndRef} />
                          </div>
                      </div>

                      {/* Results Panel */}
                      {appResult && (
                          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 h-48 animate-in slide-in-from-bottom duration-500">
                              <h3 className="font-bold text-white mb-4 text-sm uppercase text-slate-500">Computation Result</h3>
                              <div className="grid grid-cols-2 gap-4">
                                  {Object.entries(appResult).map(([key, val]: any) => (
                                      <div key={key} className="bg-slate-950 p-3 rounded border border-slate-800 flex justify-between items-center">
                                          <span className="text-xs text-slate-400 uppercase">{key}</span>
                                          <span className="text-sm font-mono text-white font-bold">{typeof val === 'object' ? JSON.stringify(val) : val}</span>
                                      </div>
                                  ))}
                              </div>
                          </div>
                      )}
                  </div>
              </div>
          )}

          {activeTab === 'SECURITY' && (
              <div className="max-w-4xl mx-auto space-y-8">
                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-8">
                      <div className="flex justify-between items-center mb-8">
                          <h2 className="text-2xl font-bold text-white flex items-center gap-2"><Lock size={24} className="text-red-500"/> Quantum Key Distribution (QKD)</h2>
                          <div className="px-3 py-1 rounded-full bg-green-500/10 border border-green-500/30 text-green-400 text-xs font-bold">
                              BB84 Protocol Active
                          </div>
                      </div>

                      <div className="flex justify-between items-center relative py-12">
                          <div className="text-center relative z-10">
                              <div className="w-20 h-20 bg-slate-800 rounded-full border-4 border-blue-500 flex items-center justify-center mx-auto mb-4">
                                  <UserIcon className="text-blue-200" />
                              </div>
                              <h3 className="font-bold text-white">Alice</h3>
                              <p className="text-xs text-slate-500">Sender</p>
                          </div>

                          <div className="flex-1 px-8 relative">
                              <div className="h-1 bg-slate-800 w-full absolute top-1/2 -translate-y-1/2"></div>
                              <div className="relative flex justify-center gap-4">
                                  {Array.from({length: 5}).map((_, i) => (
                                      <div key={i} className="w-3 h-3 bg-red-500 rounded-full animate-pulse" style={{animationDelay: `${i*0.2}s`}}></div>
                                  ))}
                              </div>
                              <div className="text-center mt-8 text-xs font-mono text-purple-400">
                                  Quantum Channel (Photons)
                              </div>
                          </div>

                          <div className="text-center relative z-10">
                              <div className="w-20 h-20 bg-slate-800 rounded-full border-4 border-green-500 flex items-center justify-center mx-auto mb-4">
                                  <UserIcon className="text-green-200" />
                              </div>
                              <h3 className="font-bold text-white">Bob</h3>
                              <p className="text-xs text-slate-500">Receiver</p>
                          </div>
                      </div>

                      <div className="bg-black/30 p-4 rounded-lg border border-slate-800 font-mono text-xs text-slate-300">
                          <div>[Alice] Generating random bit sequence...</div>
                          <div>[Alice] Encoding bits into photon polarization states (|↔⟩, |↕⟩)...</div>
                          <div>[Bob] Measuring photons with random basis choice...</div>
                          <div className="text-green-400">[Success] Sifted Key established. Entropy: 99.9%</div>
                      </div>
                  </div>
                  
                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                      <h3 className="font-bold text-white mb-4 flex items-center gap-2"><Shield size={18} className="text-orange-400"/> Post-Quantum Cryptography (PQC)</h3>
                      <div className="space-y-2">
                          {['Kyber-1024 (Key Encapsulation)', 'Dilithium (Digital Signatures)', 'Falcon (Signatures)'].map((algo, i) => (
                              <div key={i} className="flex justify-between items-center p-3 bg-slate-950 border border-slate-800 rounded">
                                  <span className="text-sm text-slate-300">{algo}</span>
                                  <span className="text-[10px] font-bold bg-green-900/20 text-green-400 px-2 py-0.5 rounded">NIST Approved</span>
                              </div>
                          ))}
                      </div>
                  </div>
              </div>
          )}

          </div>

          {/* Right Panel: Quantum Agent (Dr. Q) */}
          <div className="w-80 bg-[#0a0a0f] border-l border-indigo-900/30 flex flex-col relative z-20 shadow-2xl">
              <div className="p-4 border-b border-indigo-900/30 flex items-center gap-3">
                  <div className="relative">
                      <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center border-2 border-white/20">
                          <User size={20} className="text-white"/>
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-[#0a0a0f]"></div>
                  </div>
                  <div>
                      <h3 className="font-bold text-white text-sm">Dr. Q</h3>
                      <p className="text-xs text-indigo-400">Quantum Engineer</p>
                  </div>
              </div>
              
              <div className="flex-1 p-4 overflow-y-auto space-y-4">
                  <div className="flex gap-3">
                      <div className="w-8 h-8 bg-indigo-600 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold">Q</div>
                      <div className="bg-indigo-900/20 p-3 rounded-2xl rounded-tl-none border border-indigo-500/20 text-sm text-slate-300">
                          {agentMessage}
                      </div>
                  </div>
                  {isDebugging && (
                      <div className="flex gap-3 animate-pulse">
                          <div className="w-8 h-8 bg-indigo-600 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold">Q</div>
                          <div className="bg-indigo-900/20 p-3 rounded-2xl rounded-tl-none border border-indigo-500/20 text-sm text-slate-300">
                              Running Grover's Search... Exploring 2^50 states...
                          </div>
                      </div>
                  )}
              </div>

              <div className="p-4 border-t border-indigo-900/30">
                  <div className="relative">
                      <input className="w-full bg-black/50 border border-indigo-900/50 rounded-full pl-4 pr-10 py-2 text-sm text-white outline-none focus:border-indigo-500 transition" placeholder="Ask about Qiskit..."/>
                      <button className="absolute right-2 top-1/2 -translate-y-1/2 text-indigo-400 hover:text-white"><MessageSquare size={16}/></button>
                  </div>
              </div>
          </div>
      </div>
    </div>
  );
};

// Helper Icons
const PlusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>;
const UserIcon = ({className}: {className?: string}) => <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;

export default MegamQuantum;