
import React, { useState, useEffect } from 'react';
import { Database, ArrowRight, Play, RefreshCw, Server, FileJson, FileSpreadsheet, Download, Activity, CheckCircle2, Settings, Plus, Cable, GitMerge, ListFilter, Grid, Search, X, Layers, Workflow, HardDrive, MoveRight, Wand2 } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ETLPipeline } from '../types';
import { runETLTransformation, generateETLSchemaMapping } from '../services/geminiService';

const ETLStudio: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'PIPELINES' | 'DESIGNER' | 'MAPPER' | 'CONNECTORS' | 'MONITOR'>('PIPELINES');
  
  // Connectors State (Open Source)
  const [connectors, setConnectors] = useState([
      { id: 'postgres', name: 'PostgreSQL', type: 'SOURCE', category: 'Database', status: 'INSTALLED', icon: Database },
      { id: 'mongo', name: 'MongoDB', type: 'SOURCE', category: 'Database', status: 'INSTALLED', icon: Database },
      { id: 'airbyte', name: 'Airbyte (OSS)', type: 'INTEGRATION', category: 'Platform', status: 'INSTALLED', icon: RefreshCw },
      { id: 'dbt', name: 'dbt Core', type: 'TRANSFORM', category: 'Transformation', status: 'INSTALLED', icon: Workflow },
      { id: 'clickhouse', name: 'ClickHouse', type: 'DESTINATION', category: 'Warehouse', status: 'AVAILABLE', icon: Server },
      { id: 'kafka', name: 'Apache Kafka', type: 'STREAM', category: 'Streaming', status: 'AVAILABLE', icon: Activity },
      { id: 'spark', name: 'Apache Spark', type: 'TRANSFORM', category: 'Processing', status: 'AVAILABLE', icon: Settings },
      { id: 'dagster', name: 'Dagster', type: 'ORCHESTRATION', category: 'Orchestrator', status: 'AVAILABLE', icon: Layers },
  ]);

  const [pipelines, setPipelines] = useState<ETLPipeline[]>([
      { id: 'etl-1', name: 'Sales Data Sync', source: 'PostgreSQL', sourceType: 'DB', destination: 'ClickHouse', destinationType: 'WAREHOUSE', schedule: 'Hourly', status: 'IDLE', lastRun: '1h ago', rowsProcessed: 145000, throughput: 1200 },
      { id: 'etl-2', name: 'Web Events Stream', source: 'Kafka', sourceType: 'STREAM', destination: 'S3 Data Lake', destinationType: 'LAKE', schedule: 'Real-time', status: 'RUNNING', lastRun: 'Now', rowsProcessed: 890000, throughput: 5600 },
  ]);
  
  // Designer State
  const [designNodes, setDesignNodes] = useState([
      { id: 'src', type: 'SOURCE', label: 'Postgres DB', icon: Database, x: 50, y: 100 },
      { id: 'tr1', type: 'TRANSFORM', label: 'dbt: Norm', icon: Workflow, x: 250, y: 100 },
      { id: 'tr2', type: 'TRANSFORM', label: 'Spark: Agg', icon: Settings, x: 450, y: 100 },
      { id: 'dst', type: 'DESTINATION', label: 'Badal Warehouse', icon: Server, x: 650, y: 100 },
  ]);
  const [draggingNode, setDraggingNode] = useState<string | null>(null);

  // Mapper State
  const [mapping, setMapping] = useState<{src: string, dest: string, confidence: number}[]>([]);
  const [isAutoMapping, setIsAutoMapping] = useState(false);

  // Monitor State
  const [logs, setLogs] = useState<string[]>([]);
  const [runningPipelineId, setRunningPipelineId] = useState<string | null>(null);
  const [previewData, setPreviewData] = useState<string>('');

  useEffect(() => {
      if (runningPipelineId) {
          const interval = setInterval(() => {
              const newLog = `[${new Date().toLocaleTimeString()}] INFO: Processed batch ${Math.floor(Math.random() * 100)} records via Airbyte...`;
              setLogs(prev => [...prev.slice(-20), newLog]);
          }, 800);
          return () => clearInterval(interval);
      }
  }, [runningPipelineId]);

  const handleRunPipeline = async (id: string) => {
      setRunningPipelineId(id);
      setLogs(['[SYSTEM] Initializing Airbyte Connector...', '[SYSTEM] Starting dbt Transformation model...']);
      setPipelines(prev => prev.map(p => p.id === id ? { ...p, status: 'RUNNING' } : p));
      
      // Simulate Processing
      setTimeout(async () => {
          const transformed = await runETLTransformation('Sales Sync', JSON.stringify({ sales: 1200, region: 'US', timestamp: Date.now() }));
          setPreviewData(transformed);
          setRunningPipelineId(null);
          setPipelines(prev => prev.map(p => p.id === id ? { ...p, status: 'SUCCESS', lastRun: 'Just now', rowsProcessed: p.rowsProcessed + 150 } : p));
          setLogs(prev => [...prev, '[SUCCESS] Job Completed Successfully. Data loaded to Badal Cloud.']);
      }, 4000);
  };

  const handleAutoMap = async () => {
      setIsAutoMapping(true);
      const res = await generateETLSchemaMapping();
      setMapping(res);
      setIsAutoMapping(false);
  };

  const handleDragStart = (id: string) => {
      setDraggingNode(id);
  };

  const handleDragOver = (e: React.DragEvent) => {
      e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
      e.preventDefault();
      if (draggingNode) {
          const rect = e.currentTarget.getBoundingClientRect();
          const x = e.clientX - rect.left - 50; // Center offset
          const y = e.clientY - rect.top - 25;
          setDesignNodes(prev => prev.map(n => n.id === draggingNode ? { ...n, x, y } : n));
          setDraggingNode(null);
      }
  };

  return (
    <div className="h-full flex flex-col bg-slate-950 text-slate-200 font-sans">
      {/* Header */}
      <div className="border-b border-slate-800 bg-slate-900/50 p-6 flex justify-between items-center">
          <div className="flex items-center gap-4">
              <div className="p-2 bg-purple-500/20 rounded-lg text-purple-400">
                  <GitMerge size={24} />
              </div>
              <div>
                  <h1 className="text-xl font-bold text-white">SuckSaas ETL Studio</h1>
                  <p className="text-xs text-slate-400">Powered by Airbyte, dbt & Apache Spark (Open Source)</p>
              </div>
          </div>
          <div className="flex bg-slate-800 rounded-lg p-1">
              {[
                  { id: 'PIPELINES', label: 'Pipelines', icon: ListFilter },
                  { id: 'DESIGNER', label: 'Visual Designer', icon: Cable },
                  { id: 'MAPPER', label: 'Schema Map', icon: MoveRight },
                  { id: 'CONNECTORS', label: 'Connectors', icon: Grid },
                  { id: 'MONITOR', label: 'Monitoring', icon: Activity }
              ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-md text-xs font-bold transition ${activeTab === tab.id ? 'bg-slate-700 text-white shadow' : 'text-slate-400 hover:text-white'}`}
                  >
                      <tab.icon size={14} /> {tab.label}
                  </button>
              ))}
          </div>
      </div>

      <div className="flex-1 overflow-hidden">
          
          {/* 1. PIPELINES LIST */}
          {activeTab === 'PIPELINES' && (
              <div className="p-8 max-w-6xl mx-auto">
                  <div className="flex justify-between items-center mb-6">
                      <h2 className="text-lg font-bold text-white">Active Data Pipelines</h2>
                      <button className="flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-lg font-bold text-xs transition">
                          <Plus size={16} /> Create Pipeline
                      </button>
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                      {pipelines.map(p => (
                          <div key={p.id} className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex items-center justify-between hover:border-purple-500/50 transition">
                              <div className="flex items-center gap-6">
                                  <div className={`p-3 rounded-full ${p.status === 'RUNNING' ? 'bg-blue-500/20 text-blue-400 animate-pulse' : p.status === 'SUCCESS' ? 'bg-green-500/20 text-green-400' : 'bg-slate-800 text-slate-500'}`}>
                                      {p.status === 'RUNNING' ? <RefreshCw size={20} className="animate-spin"/> : <CheckCircle2 size={20} />}
                                  </div>
                                  <div>
                                      <div className="font-bold text-white text-lg">{p.name}</div>
                                      <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                                          <span className="flex items-center gap-1"><Database size={12}/> {p.source}</span>
                                          <ArrowRight size={12}/>
                                          <span className="flex items-center gap-1"><Server size={12}/> {p.destination}</span>
                                          <span className="mx-2">•</span>
                                          <span>{p.schedule}</span>
                                      </div>
                                  </div>
                              </div>
                              
                              <div className="flex items-center gap-8">
                                  <div className="text-right">
                                      <div className="text-xs text-slate-500 uppercase font-bold">Throughput</div>
                                      <div className="text-white font-mono">{p.throughput} r/s</div>
                                  </div>
                                  <div className="text-right">
                                      <div className="text-xs text-slate-500 uppercase font-bold">Last Run</div>
                                      <div className="text-white">{p.lastRun}</div>
                                  </div>
                                  <button 
                                    onClick={() => handleRunPipeline(p.id)}
                                    disabled={p.status === 'RUNNING'}
                                    className="p-3 bg-slate-800 hover:bg-purple-600 hover:text-white rounded-lg text-slate-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                  >
                                      <Play size={20} fill="currentColor" />
                                  </button>
                              </div>
                          </div>
                      ))}
                  </div>
              </div>
          )}

          {/* 2. VISUAL DESIGNER */}
          {activeTab === 'DESIGNER' && (
              <div className="h-full flex relative">
                  {/* Toolbox */}
                  <div className="w-64 bg-slate-900 border-r border-slate-800 p-4 z-10 flex flex-col">
                      <h3 className="text-xs font-bold text-slate-500 uppercase mb-4">Toolbox</h3>
                      <div className="space-y-4 overflow-y-auto flex-1">
                          <div>
                              <h4 className="text-[10px] font-bold text-slate-400 mb-2">CONNECTORS</h4>
                              {connectors.filter(c => c.type === 'SOURCE').map(c => (
                                  <div key={c.id} className="p-2 bg-slate-800 border border-slate-700 rounded mb-2 text-xs text-slate-300 cursor-grab hover:border-purple-500 flex items-center gap-2">
                                      <c.icon size={14}/> {c.name}
                                  </div>
                              ))}
                          </div>
                          <div>
                              <h4 className="text-[10px] font-bold text-slate-400 mb-2">TRANSFORMATIONS</h4>
                              <div className="p-2 bg-slate-800 border border-slate-700 rounded mb-2 text-xs text-slate-300 cursor-grab hover:border-purple-500 flex items-center gap-2">
                                  <Workflow size={14}/> dbt Model
                              </div>
                              <div className="p-2 bg-slate-800 border border-slate-700 rounded mb-2 text-xs text-slate-300 cursor-grab hover:border-purple-500 flex items-center gap-2">
                                  <Settings size={14}/> Python Script
                              </div>
                          </div>
                          <div>
                              <h4 className="text-[10px] font-bold text-slate-400 mb-2">DESTINATIONS</h4>
                              {connectors.filter(c => c.type === 'DESTINATION').map(c => (
                                  <div key={c.id} className="p-2 bg-slate-800 border border-slate-700 rounded mb-2 text-xs text-slate-300 cursor-grab hover:border-purple-500 flex items-center gap-2">
                                      <c.icon size={14}/> {c.name}
                                  </div>
                              ))}
                          </div>
                      </div>
                  </div>

                  {/* Canvas */}
                  <div 
                    className="flex-1 bg-slate-950 relative overflow-hidden" 
                    style={{backgroundImage: 'radial-gradient(#1e293b 1px, transparent 1px)', backgroundSize: '20px 20px'}}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                  >
                      <svg className="absolute inset-0 pointer-events-none w-full h-full">
                          {/* Dynamically draw lines between nodes sorted by X position */}
                          {designNodes.sort((a,b) => a.x - b.x).map((node, i, arr) => {
                              if (i === arr.length - 1) return null;
                              const next = arr[i+1];
                              return (
                                <path 
                                    key={i} 
                                    d={`M ${node.x + 150} ${node.y + 35} C ${node.x + 200} ${node.y + 35}, ${next.x - 50} ${next.y + 35}, ${next.x} ${next.y + 35}`} 
                                    stroke="#475569" 
                                    strokeWidth="2" 
                                    fill="none" 
                                    strokeDasharray="5,5"
                                />
                              )
                          })}
                      </svg>
                      
                      {designNodes.map(node => (
                           <div 
                            key={node.id}
                            className="absolute bg-slate-900 border border-slate-700 p-4 rounded-xl w-40 shadow-xl cursor-grab hover:border-purple-500 group active:cursor-grabbing"
                            style={{ top: node.y, left: node.x }}
                            draggable
                            onDragStart={() => handleDragStart(node.id)}
                           >
                               <div className={`text-[10px] font-bold mb-1 uppercase ${node.type === 'SOURCE' ? 'text-blue-400' : node.type === 'TRANSFORM' ? 'text-orange-400' : 'text-green-400'}`}>
                                   {node.type}
                               </div>
                               <div className="font-bold text-sm text-white flex items-center gap-2">
                                   <node.icon size={14} className="text-slate-400"/> {node.label}
                               </div>
                               {/* Input/Output Ports */}
                               {node.type !== 'SOURCE' && <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-3 h-3 bg-slate-600 rounded-full border-2 border-slate-900"></div>}
                               {node.type !== 'DESTINATION' && <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-3 h-3 bg-slate-600 rounded-full border-2 border-slate-900"></div>}
                           </div>
                       ))}
                       
                       <div className="absolute bottom-8 right-8 bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-lg">
                           <button className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-lg font-bold text-xs flex items-center gap-2">
                               <Play size={14}/> Test Flow
                           </button>
                       </div>
                  </div>
              </div>
          )}

          {/* 3. SCHEMA MAPPER */}
          {activeTab === 'MAPPER' && (
              <div className="h-full p-8 max-w-5xl mx-auto flex flex-col">
                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex-1 flex flex-col">
                      <div className="flex justify-between items-center mb-8">
                          <h3 className="font-bold text-white flex items-center gap-2"><MoveRight className="text-blue-400"/> Schema Mapper</h3>
                          <button 
                            onClick={handleAutoMap}
                            disabled={isAutoMapping}
                            className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-lg font-bold text-xs flex items-center gap-2 disabled:opacity-50"
                          >
                              {isAutoMapping ? <RefreshCw className="animate-spin" size={14}/> : <Wand2 size={14}/>} 
                              AI Auto-Map
                          </button>
                      </div>

                      <div className="flex-1 flex gap-8">
                          {/* Source Schema */}
                          <div className="flex-1 bg-slate-950 border border-slate-800 rounded-lg p-4">
                              <div className="text-xs font-bold text-slate-500 uppercase mb-4 text-center">Source: PostgreSQL</div>
                              <div className="space-y-2">
                                  {['first_name', 'last_name', 'email_addr', 'phone_num', 'created_at'].map(f => (
                                      <div key={f} className="p-2 bg-slate-900 border border-slate-800 rounded text-sm text-slate-300 font-mono">
                                          {f}
                                      </div>
                                  ))}
                              </div>
                          </div>

                          {/* Mappings Visual */}
                          <div className="flex flex-col justify-center items-center w-32 relative">
                              {mapping.map((m, i) => (
                                  <div key={i} className="absolute w-full border-t-2 border-purple-500/50" style={{top: `${20 + i * 15}%`}}>
                                      <div className="absolute left-1/2 -top-3 -translate-x-1/2 bg-purple-900/50 text-purple-200 text-[9px] px-1 rounded">
                                          {(m.confidence * 100).toFixed(0)}%
                                      </div>
                                  </div>
                              ))}
                          </div>

                          {/* Destination Schema */}
                          <div className="flex-1 bg-slate-950 border border-slate-800 rounded-lg p-4">
                              <div className="text-xs font-bold text-slate-500 uppercase mb-4 text-center">Dest: Data Warehouse</div>
                              <div className="space-y-2">
                                  {mapping.length > 0 ? mapping.map(m => (
                                      <div key={m.dest} className="p-2 bg-slate-900 border border-green-500/30 rounded text-sm text-green-300 font-mono flex justify-between">
                                          {m.dest}
                                          <CheckCircle2 size={14} className="text-green-500"/>
                                      </div>
                                  )) : (
                                      ['givenName', 'familyName', 'email', 'mobile', 'timestamp'].map(f => (
                                          <div key={f} className="p-2 bg-slate-900 border border-slate-800 rounded text-sm text-slate-300 font-mono">
                                              {f}
                                          </div>
                                      ))
                                  )}
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          )}

          {/* 4. CONNECTORS MARKETPLACE */}
          {activeTab === 'CONNECTORS' && (
              <div className="p-8 max-w-6xl mx-auto h-full overflow-y-auto">
                  <div className="flex justify-between items-center mb-6">
                      <div className="relative">
                          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/>
                          <input placeholder="Search connectors..." className="bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-sm outline-none text-white focus:border-purple-500 w-64" />
                      </div>
                      <div className="flex gap-2">
                          <button className="px-3 py-1 bg-slate-800 rounded text-xs font-bold text-slate-300 hover:text-white">All</button>
                          <button className="px-3 py-1 bg-slate-900 rounded text-xs font-bold text-slate-500 hover:text-white">Sources</button>
                          <button className="px-3 py-1 bg-slate-900 rounded text-xs font-bold text-slate-500 hover:text-white">Destinations</button>
                      </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      {connectors.map(c => (
                          <div key={c.id} className="bg-slate-900 border border-slate-800 p-5 rounded-xl hover:border-purple-500/50 transition group">
                              <div className="flex justify-between items-start mb-4">
                                  <div className="p-2 bg-slate-800 rounded-lg border border-slate-700 text-slate-300 group-hover:text-purple-400 transition">
                                      <c.icon size={24}/>
                                  </div>
                                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${c.status === 'INSTALLED' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-slate-800 text-slate-500 border-slate-700'}`}>
                                      {c.status}
                                  </span>
                              </div>
                              <h3 className="font-bold text-white">{c.name}</h3>
                              <p className="text-xs text-slate-500 mb-4">{c.category}</p>
                              <button className={`w-full py-2 rounded-lg text-xs font-bold ${c.status === 'INSTALLED' ? 'bg-slate-800 text-slate-400' : 'bg-purple-600 text-white hover:bg-purple-500'}`}>
                                  {c.status === 'INSTALLED' ? 'Configure' : 'Install'}
                              </button>
                          </div>
                      ))}
                  </div>
              </div>
          )}

          {/* 5. MONITOR */}
          {activeTab === 'MONITOR' && (
              <div className="h-full p-8 overflow-y-auto">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                       <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 h-80 flex flex-col">
                           <h3 className="font-bold text-white mb-4 flex items-center gap-2"><Activity size={18} className="text-purple-400"/> Data Throughput (Rows/sec)</h3>
                           <div className="flex-1 min-h-0">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={[
                                        {t: '00:00', v: 400}, {t: '04:00', v: 300}, {t: '08:00', v: 5600}, {t: '12:00', v: 2400}, {t: '16:00', v: 1800}, {t: '20:00', v: 3200}
                                    ]}>
                                        <defs>
                                            <linearGradient id="colorThrough" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#a855f7" stopOpacity={0.8}/>
                                                <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                                        <XAxis dataKey="t" stroke="#475569" fontSize={10} />
                                        <YAxis stroke="#475569" fontSize={10} />
                                        <Tooltip contentStyle={{backgroundColor: '#0f172a', border: '1px solid #334155'}} />
                                        <Area type="monotone" dataKey="v" stroke="#a855f7" fillOpacity={1} fill="url(#colorThrough)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                           </div>
                       </div>

                       <div className="bg-black border border-slate-800 rounded-xl p-6 h-80 flex flex-col font-mono text-xs overflow-hidden">
                           <div className="flex items-center gap-2 text-slate-500 mb-2 pb-2 border-b border-slate-900">
                               <Server size={14} /> Execution Logs
                           </div>
                           <div className="flex-1 overflow-y-auto space-y-1">
                               {logs.length === 0 && <span className="text-slate-600 italic">System idle. Ready for jobs.</span>}
                               {logs.map((l, i) => (
                                   <div key={i} className="text-slate-300 break-all">{l}</div>
                               ))}
                               {runningPipelineId && <div className="animate-pulse text-purple-500">_</div>}
                           </div>
                           {/* Preview Pane */}
                           {previewData && (
                               <div className="mt-2 pt-2 border-t border-slate-800 text-green-400 max-h-20 overflow-auto">
                                   <div className="text-[10px] font-bold text-slate-500 uppercase mb-1">Last Output Payload</div>
                                   {previewData}
                               </div>
                           )}
                       </div>
                  </div>

                  {/* Export Options */}
                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                      <h3 className="font-bold text-white mb-4">Export Recent Results</h3>
                      <div className="flex gap-4">
                          <button className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 px-4 py-2 rounded text-sm text-white transition">
                              <FileJson size={16} className="text-yellow-400"/> Download JSON
                          </button>
                          <button className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 px-4 py-2 rounded text-sm text-white transition">
                              <FileSpreadsheet size={16} className="text-green-400"/> Download CSV
                          </button>
                          <button className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 px-4 py-2 rounded text-sm text-white transition">
                              <Download size={16} className="text-blue-400"/> Download Parquet
                          </button>
                      </div>
                  </div>
              </div>
          )}
      </div>
    </div>
  );
};

export default ETLStudio;
