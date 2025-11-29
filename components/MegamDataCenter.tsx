
import React, { useState, useEffect } from 'react';
import { Server, Activity, Thermometer, Zap, Wind, Grid, Map, Cpu, HardDrive, Network, Settings, AlertTriangle, CheckCircle2, Box, Layers, RefreshCw, Power, Monitor, Fan, RotateCw, AlertOctagon } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid, BarChart, Bar, Legend } from 'recharts';
import { getDCIMData } from '../services/geminiService';

interface RackUnit {
    id: string;
    status: 'ACTIVE' | 'IDLE' | 'ERROR';
    type: 'GPU_NODE' | 'STORAGE_ARRAY' | 'SWITCH' | 'EMPTY';
}

interface Rack {
    id: string;
    temp: number;
    power: number;
    units: RackUnit[];
}

const MegamDataCenter: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'FLOOR' | 'RACK' | 'POWER' | 'NOC' | 'OPS'>('FLOOR');
  const [dcData, setDcData] = useState<any>(null);
  const [selectedRackId, setSelectedRackId] = useState<string | null>(null);
  const [selectedUnit, setSelectedUnit] = useState<RackUnit | null>(null);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Telemetry History State
  const [telemetryHistory, setTelemetryHistory] = useState<{time: string, power: number, temp: number, airflow: number}[]>([]);

  // AI Prediction State
  const [prediction, setPrediction] = useState<{target: string, issue: string, probability: number, eta: string} | null>(null);

  // Poll for DCIM data & Simulate Telemetry
  useEffect(() => {
      const fetchData = async () => {
          const data = await getDCIMData();
          setDcData(data);
          setLoading(false);
          
          // Simulate History
          setTelemetryHistory(prev => {
              const now = new Date().toLocaleTimeString();
              const newPoint = {
                  time: now,
                  power: data.totalPower + (Math.random() * 50 - 25),
                  temp: 24 + (Math.random() * 2 - 1),
                  airflow: 12000 + (Math.random() * 500 - 250)
              };
              return [...prev.slice(-20), newPoint];
          });

          // Simulate Prediction randomly
          if (Math.random() > 0.9 && !prediction) {
              setPrediction({
                  target: `RACK-0${Math.ceil(Math.random()*9)}-U${Math.ceil(Math.random()*42)}`,
                  issue: 'DIMM ECC Error Rate Spike',
                  probability: 89,
                  eta: '4h 20m'
              });
          }
      };
      
      fetchData();
      const interval = setInterval(fetchData, 2000);
      return () => clearInterval(interval);
  }, []);

  const getUnitColor = (status: string, type: string) => {
      if (status === 'ERROR') return 'bg-red-500 animate-pulse';
      if (status === 'IDLE') return 'bg-slate-700';
      if (type === 'GPU_NODE') return 'bg-purple-500';
      if (type === 'STORAGE_ARRAY') return 'bg-blue-500';
      if (type === 'SWITCH') return 'bg-green-500';
      return 'bg-slate-800';
  };

  const renderIsometricRack = (rack: Rack) => (
      <div 
        key={rack.id}
        onClick={() => { setSelectedRackId(rack.id); setActiveTab('RACK'); }}
        className={`
            relative w-20 h-32 transition-all duration-300 cursor-pointer group hover:-translate-y-4
            ${selectedRackId === rack.id ? 'z-20' : 'z-10'}
        `}
        style={{
            transformStyle: 'preserve-3d',
        }}
      >
          {/* Front Face */}
          <div className={`absolute inset-0 border border-slate-600 flex flex-col gap-[1px] p-[1px] ${rack.temp > 30 ? 'bg-red-900/40 border-red-500' : 'bg-slate-800/80'}`}>
              {rack.units.filter((_, i) => i % 4 === 0).slice(0, 10).map((u, i) => (
                  <div key={i} className={`h-full w-full rounded-[1px] ${getUnitColor(u.status, u.type)} opacity-80`}></div>
              ))}
          </div>
          {/* Side Face (Fake 3D) */}
          <div className="absolute top-0 right-0 w-4 h-full bg-slate-900 origin-right transform rotateY(-90deg) translate-x-full brightness-50 border-r border-slate-700"></div>
          {/* Top Face (Fake 3D) */}
          <div className="absolute top-0 left-0 w-full h-4 bg-slate-700 origin-bottom transform rotateX(90deg) -translate-y-full brightness-125 border-t border-slate-500"></div>
          
          {/* Status LED */}
          <div className={`absolute -top-8 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full shadow-[0_0_10px_currentColor] ${rack.temp > 30 ? 'bg-red-500 text-red-500 animate-ping' : 'bg-green-500 text-green-500'}`}></div>
          
          {/* Hover Label */}
          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[8px] font-mono text-slate-400 opacity-0 group-hover:opacity-100 whitespace-nowrap bg-black/80 px-2 py-1 rounded border border-slate-700">
              {rack.id} | {rack.power}kW
          </div>

          {/* Heatmap Overlay */}
          {showHeatmap && (
              <div 
                className="absolute inset-0 bg-red-500 blur-2xl pointer-events-none mix-blend-screen"
                style={{ opacity: (rack.temp - 20) / 40 }}
              ></div>
          )}
      </div>
  );

  if (loading) {
      return (
          <div className="h-full flex items-center justify-center bg-slate-950 text-slate-500 flex-col gap-4">
              <RefreshCw className="animate-spin" size={32}/>
              <p className="font-mono text-sm">Initializing Neural Bridge Infrastructure Layer...</p>
          </div>
      );
  }

  return (
    <div className="h-full flex flex-col bg-[#050505] text-slate-200 font-sans selection:bg-cyan-500 selection:text-black">
      {/* Header */}
      <div className="border-b border-slate-900 bg-slate-950/80 p-4 flex justify-between items-center backdrop-blur z-20">
          <div className="flex items-center gap-4">
              <div className="p-2 bg-cyan-900/20 rounded-lg border border-cyan-500/30">
                  <Box size={24} className="text-cyan-400"/>
              </div>
              <div>
                  <h1 className="text-xl font-bold text-white tracking-tight">Megam VDC</h1>
                  <p className="text-slate-500 text-xs font-mono">Virtual Data Center • Zone: US-East-1</p>
              </div>
          </div>
          
          {/* AI Alert Banner */}
          {prediction && (
              <div className="flex items-center gap-3 px-4 py-2 bg-yellow-900/20 border border-yellow-500/30 rounded-lg animate-in slide-in-from-top-4">
                  <AlertOctagon size={16} className="text-yellow-500 animate-pulse"/>
                  <div>
                      <div className="text-xs font-bold text-yellow-400">PREDICTIVE MAINTENACE ALERT</div>
                      <div className="text-[10px] text-yellow-200/70">{prediction.target}: {prediction.issue} ({prediction.probability}% prob)</div>
                  </div>
                  <button onClick={() => setPrediction(null)} className="text-yellow-500 hover:text-white"><CheckCircle2 size={14}/></button>
              </div>
          )}

          <div className="flex bg-slate-900 rounded-lg p-1 border border-slate-800">
              {[
                  { id: 'FLOOR', label: '3D Floor', icon: Grid },
                  { id: 'RACK', label: 'Rack Inspector', icon: Server },
                  { id: 'POWER', label: 'Telemetry', icon: Activity },
                  { id: 'NOC', label: 'NOC View', icon: Map },
                  { id: 'OPS', label: 'IT Ops', icon: Settings },
              ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-bold transition ${activeTab === tab.id ? 'bg-cyan-900/30 text-cyan-400 border border-cyan-500/30 shadow-[0_0_10px_rgba(6,182,212,0.1)]' : 'text-slate-500 hover:text-white hover:bg-slate-900'}`}
                  >
                      {/* @ts-ignore */}
                      <tab.icon size={14} /> {tab.label}
                  </button>
              ))}
          </div>
      </div>

      <div className="flex-1 overflow-hidden relative bg-[#0a0a0a]">
          {/* Background Grid */}
          <div className="absolute inset-0 opacity-10 pointer-events-none" style={{backgroundImage: 'linear-gradient(#334155 1px, transparent 1px), linear-gradient(90deg, #334155 1px, transparent 1px)', backgroundSize: '40px 40px'}}></div>

          {activeTab === 'FLOOR' && (
              <div className="h-full flex flex-col p-8">
                  <div className="flex justify-between items-start mb-4 relative z-10">
                      <div className="flex gap-4">
                          <div className="bg-slate-900/80 backdrop-blur border border-slate-800 p-3 rounded-xl min-w-[120px]">
                              <div className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-2"><Thermometer size={12}/> Avg Temp</div>
                              <div className="text-xl font-bold text-white font-mono">24.5°C</div>
                          </div>
                          <div className="bg-slate-900/80 backdrop-blur border border-slate-800 p-3 rounded-xl min-w-[120px]">
                              <div className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-2"><Zap size={12}/> Load</div>
                              <div className="text-xl font-bold text-cyan-400 font-mono">{dcData.totalPower} kW</div>
                          </div>
                          <div className="bg-slate-900/80 backdrop-blur border border-slate-800 p-3 rounded-xl min-w-[120px]">
                              <div className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-2"><Wind size={12}/> Airflow</div>
                              <div className="text-xl font-bold text-blue-400 font-mono">14k CFM</div>
                          </div>
                      </div>
                      
                      <button 
                        onClick={() => setShowHeatmap(!showHeatmap)}
                        className={`px-4 py-2 rounded-lg text-xs font-bold border transition flex items-center gap-2 ${showHeatmap ? 'bg-red-900/20 text-red-400 border-red-500/50' : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'}`}
                      >
                          <Activity size={14}/> {showHeatmap ? 'Heatmap Active' : 'Thermal View'}
                      </button>
                  </div>

                  {/* Isometric Viewport */}
                  <div className="flex-1 flex items-center justify-center overflow-hidden perspective-[2000px]">
                      <div 
                        className="grid grid-cols-5 gap-16 transform-style-3d transition-transform duration-700 ease-out"
                        style={{ transform: 'rotateX(60deg) rotateZ(-45deg) scale(0.8)' }}
                      >
                          {dcData.racks.map((rack: Rack) => renderIsometricRack(rack))}
                      </div>
                  </div>
              </div>
          )}

          {activeTab === 'RACK' && (
              <div className="h-full flex gap-8 p-8">
                  {/* Rack List */}
                  <div className="w-64 bg-slate-900 border border-slate-800 rounded-xl flex flex-col overflow-hidden">
                      <div className="p-4 border-b border-slate-800 bg-slate-900/50">
                          <h3 className="text-xs font-bold text-slate-500 uppercase">Rack Alley A</h3>
                      </div>
                      <div className="flex-1 overflow-y-auto">
                          {dcData.racks.map((rack: Rack) => (
                              <button
                                key={rack.id}
                                onClick={() => { setSelectedRackId(rack.id); setSelectedUnit(null); }}
                                className={`w-full text-left px-4 py-3 border-b border-slate-800/50 flex justify-between items-center transition ${selectedRackId === rack.id ? 'bg-cyan-900/20 text-cyan-400 border-l-2 border-l-cyan-400' : 'text-slate-400 hover:bg-slate-800'}`}
                              >
                                  <span className="font-mono text-sm font-bold">{rack.id}</span>
                                  <div className="flex gap-2 items-center">
                                      <span className="text-[10px]">{rack.power}kW</span>
                                      <div className={`w-1.5 h-1.5 rounded-full ${rack.temp > 30 ? 'bg-red-500' : 'bg-green-500'}`}></div>
                                  </div>
                              </button>
                          ))}
                      </div>
                  </div>

                  {/* Detailed Rack View */}
                  {selectedRackId ? (
                      <div className="flex-1 flex gap-8 animate-in fade-in slide-in-from-right duration-300">
                          {/* 42U Chassis */}
                          <div className="w-80 bg-[#151515] border-x-4 border-y-[1px] border-slate-700 rounded-lg p-1 relative shadow-2xl flex flex-col">
                              <div className="absolute -top-8 left-0 right-0 text-center">
                                  <span className="text-xs font-bold text-slate-500 bg-black/50 px-2 py-1 rounded border border-slate-800">{selectedRackId}</span>
                              </div>
                              <div className="flex-1 flex flex-col-reverse gap-[2px] bg-black p-[2px] overflow-hidden">
                                  {dcData.racks.find((r: Rack) => r.id === selectedRackId)?.units.map((u: RackUnit, i: number) => (
                                      <div 
                                        key={i}
                                        onClick={() => setSelectedUnit(u)}
                                        className={`
                                            w-full flex items-center justify-between px-2 text-[9px] font-mono border-b border-white/5 cursor-pointer transition relative group
                                            ${u.type === 'EMPTY' ? 'h-4 bg-[#1a1a1a]' : 'h-8 bg-[#222] border-l-2 hover:bg-[#333]'}
                                            ${u.type === 'GPU_NODE' ? 'border-l-purple-500' : u.type === 'STORAGE_ARRAY' ? 'border-l-blue-500' : u.type === 'SWITCH' ? 'border-l-green-500' : ''}
                                            ${selectedUnit?.id === u.id ? 'ring-1 ring-white z-10' : ''}
                                        `}
                                      >
                                          {u.type !== 'EMPTY' && (
                                              <>
                                                  <span className="text-slate-500 w-4">{i+1}</span>
                                                  <div className="flex-1 flex items-center gap-2">
                                                      {u.type === 'GPU_NODE' && <Cpu size={10} className="text-purple-400"/>}
                                                      {u.type === 'STORAGE_ARRAY' && <HardDrive size={10} className="text-blue-400"/>}
                                                      {u.type === 'SWITCH' && <Network size={10} className="text-green-400"/>}
                                                      <span className="text-slate-300 tracking-tighter truncate">{u.id}</span>
                                                  </div>
                                                  <div className="flex gap-1">
                                                      <div className={`w-1 h-1 rounded-full ${u.status === 'ACTIVE' ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                                                      <div className="w-1 h-1 rounded-full bg-blue-500 animate-[pulse_2s_infinite]"></div>
                                                  </div>
                                              </>
                                          )}
                                          <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition pointer-events-none"></div>
                                      </div>
                                  ))}
                              </div>
                          </div>

                          {/* Hardware Specs Panel */}
                          <div className="w-80 flex flex-col gap-6">
                              {selectedUnit ? (
                                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 h-fit animate-in fade-in zoom-in duration-200">
                                      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-800">
                                          <div className={`p-3 rounded-lg ${selectedUnit.type === 'GPU_NODE' ? 'bg-purple-500/20 text-purple-400' : 'bg-blue-500/20 text-blue-400'}`}>
                                              {selectedUnit.type === 'GPU_NODE' ? <Cpu size={24}/> : selectedUnit.type === 'STORAGE_ARRAY' ? <HardDrive size={24}/> : <Network size={24}/>}
                                          </div>
                                          <div>
                                              <h3 className="font-bold text-white text-lg">{selectedUnit.id}</h3>
                                              <p className="text-xs text-slate-400">{selectedUnit.type.replace('_', ' ')}</p>
                                          </div>
                                      </div>

                                      <div className="space-y-4">
                                          <div>
                                              <div className="text-xs text-slate-500 font-bold uppercase mb-1">CPU / Processor</div>
                                              <div className="text-sm text-white font-mono">AMD EPYC 9654 (96C)</div>
                                          </div>
                                          <div>
                                              <div className="text-xs text-slate-500 font-bold uppercase mb-1">Memory</div>
                                              <div className="text-sm text-white font-mono">1.5 TB DDR5 ECC</div>
                                              <div className="w-full bg-slate-800 h-1 mt-1 rounded"><div className="w-3/4 bg-blue-500 h-1 rounded"></div></div>
                                          </div>
                                          <div>
                                              <div className="text-xs text-slate-500 font-bold uppercase mb-1">Storage</div>
                                              <div className="text-sm text-white font-mono">2x 3.84TB NVMe Gen5</div>
                                          </div>
                                          <div>
                                              <div className="text-xs text-slate-500 font-bold uppercase mb-1">Network</div>
                                              <div className="text-sm text-white font-mono">Mellanox 400GbE OSFP</div>
                                          </div>
                                      </div>

                                      <div className="mt-6 pt-6 border-t border-slate-800">
                                          <div className="grid grid-cols-2 gap-4">
                                              <div className="text-center p-2 bg-slate-950 rounded border border-slate-800">
                                                  <div className="text-xs text-slate-500">Power</div>
                                                  <div className="text-green-400 font-mono font-bold">450W</div>
                                              </div>
                                              <div className="text-center p-2 bg-slate-950 rounded border border-slate-800">
                                                  <div className="text-xs text-slate-500">Temp</div>
                                                  <div className="text-orange-400 font-mono font-bold">62°C</div>
                                              </div>
                                          </div>
                                      </div>
                                  </div>
                              ) : (
                                  <div className="bg-slate-900/50 border border-slate-800 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center h-64">
                                      <Server size={48} className="text-slate-700 mb-4"/>
                                      <p className="text-slate-500 text-sm">Select a unit from the rack diagram to view hardware telemetry.</p>
                                  </div>
                              )}
                          </div>
                      </div>
                  ) : (
                      <div className="flex-1 flex items-center justify-center text-slate-500 text-sm italic">
                          Select a rack from the list to inspect hardware.
                      </div>
                  )}
              </div>
          )}

          {activeTab === 'POWER' && (
              <div className="h-full p-8 overflow-y-auto">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                          <h3 className="font-bold text-white mb-6 flex items-center gap-2"><Thermometer size={20} className="text-red-400"/> Thermal & Power Telemetry</h3>
                          <div className="h-64">
                              <ResponsiveContainer width="100%" height="100%">
                                  <AreaChart data={telemetryHistory}>
                                      <defs>
                                          <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                                              <stop offset="5%" stopColor="#f87171" stopOpacity={0.3}/>
                                              <stop offset="95%" stopColor="#f87171" stopOpacity={0}/>
                                          </linearGradient>
                                          <linearGradient id="colorPower" x1="0" y1="0" x2="0" y2="1">
                                              <stop offset="5%" stopColor="#fbbf24" stopOpacity={0.3}/>
                                              <stop offset="95%" stopColor="#fbbf24" stopOpacity={0}/>
                                          </linearGradient>
                                      </defs>
                                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                                      <XAxis dataKey="time" stroke="#475569" fontSize={10} minTickGap={30}/>
                                      <YAxis yAxisId="left" stroke="#f87171" fontSize={10} domain={[20, 30]} />
                                      <YAxis yAxisId="right" orientation="right" stroke="#fbbf24" fontSize={10} domain={[4000, 5000]} />
                                      <Tooltip contentStyle={{backgroundColor: '#0f172a', borderColor: '#334155'}} />
                                      <Legend />
                                      <Area yAxisId="left" type="monotone" dataKey="temp" name="Avg Temp (°C)" stroke="#f87171" fill="url(#colorTemp)" />
                                      <Area yAxisId="right" type="monotone" dataKey="power" name="Total Load (kW)" stroke="#fbbf24" fill="url(#colorPower)" />
                                  </AreaChart>
                              </ResponsiveContainer>
                          </div>
                      </div>

                      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                          <h3 className="font-bold text-white mb-6 flex items-center gap-2"><Wind size={20} className="text-blue-400"/> Airflow (CFM)</h3>
                          <div className="h-64">
                              <ResponsiveContainer width="100%" height="100%">
                                  <LineChart data={telemetryHistory}>
                                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                                      <XAxis dataKey="time" stroke="#475569" fontSize={10} />
                                      <YAxis stroke="#60a5fa" fontSize={10} domain={[11000, 13000]} />
                                      <Tooltip contentStyle={{backgroundColor: '#0f172a', borderColor: '#334155'}} />
                                      <Line type="step" dataKey="airflow" stroke="#60a5fa" strokeWidth={2} dot={false} />
                                  </LineChart>
                              </ResponsiveContainer>
                          </div>
                      </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                      <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl flex items-center justify-between">
                          <div>
                              <div className="text-xs font-bold text-slate-500 uppercase">PUE Metric</div>
                              <div className="text-2xl font-bold text-green-400">{dcData.pue.toFixed(3)}</div>
                          </div>
                          <Activity size={24} className="text-slate-700"/>
                      </div>
                      <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl flex items-center justify-between">
                          <div>
                              <div className="text-xs font-bold text-slate-500 uppercase">Renewable Mix</div>
                              <div className="text-2xl font-bold text-blue-400">{dcData.renewables.toFixed(1)}%</div>
                          </div>
                          <LeafIcon className="text-green-600"/>
                      </div>
                      <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl flex items-center justify-between">
                          <div>
                              <div className="text-xs font-bold text-slate-500 uppercase">Fan Speed</div>
                              <div className="text-2xl font-bold text-slate-200">7,200 <span className="text-sm font-normal text-slate-500">RPM</span></div>
                          </div>
                          <Fan size={24} className="text-slate-700 animate-[spin_2s_linear_infinite]"/>
                      </div>
                      <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl flex items-center justify-between">
                          <div>
                              <div className="text-xs font-bold text-slate-500 uppercase">Est. Cost/Hr</div>
                              <div className="text-2xl font-bold text-yellow-400">$84.20</div>
                          </div>
                          <div className="text-xs text-green-500 bg-green-900/20 px-2 py-1 rounded">Optimized</div>
                      </div>
                  </div>
              </div>
          )}

          {activeTab === 'NOC' && (
              <div className="h-full flex flex-col items-center justify-center relative">
                  {/* Global Map Placeholder */}
                  <div className="absolute inset-0 bg-[url('https://upload.wikimedia.org/wikipedia/commons/e/ec/World_map_blank_without_borders.svg')] bg-cover opacity-10 pointer-events-none"></div>
                  
                  <div className="grid grid-cols-2 gap-20 relative z-10">
                      {[
                          { loc: 'US-East (Virginia)', lat: '32ms', status: 'OK' },
                          { loc: 'EU-West (Frankfurt)', lat: '88ms', status: 'OK' },
                          { loc: 'AP-South (Mumbai)', lat: '145ms', status: 'WARN' },
                          { loc: 'SA-East (São Paulo)', lat: '120ms', status: 'OK' },
                      ].map((node, i) => (
                          <div key={i} className="bg-slate-950/80 backdrop-blur border border-slate-700 p-6 rounded-xl flex items-center gap-4 w-72 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
                              <div className={`w-3 h-3 rounded-full ${node.status === 'OK' ? 'bg-green-500 animate-pulse' : 'bg-yellow-500 animate-ping'}`}></div>
                              <div className="flex-1">
                                  <div className="font-bold text-white text-sm">{node.loc}</div>
                                  <div className="flex justify-between items-center mt-1">
                                      <div className="text-xs text-slate-400 font-mono">Ping: {node.lat}</div>
                                      <div className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${node.status === 'OK' ? 'bg-green-900/30 text-green-400' : 'bg-yellow-900/30 text-yellow-400'}`}>{node.status}</div>
                                  </div>
                              </div>
                          </div>
                      ))}
                  </div>
                  
                  <div className="absolute bottom-8 w-full max-w-4xl bg-slate-900/90 border border-slate-800 rounded-xl p-4 backdrop-blur">
                      <h3 className="text-xs font-bold text-slate-500 uppercase mb-2">Live Incident Feed</h3>
                      <div className="space-y-2 text-xs font-mono">
                          <div className="text-red-400">[CRITICAL] Packet loss detected on Link-42 (Mumbai -> Singapore)</div>
                          <div className="text-green-400">[INFO] Automated re-routing active via Neural Bridge Path Optimization.</div>
                          <div className="text-slate-400">[LOG] Routine health check passed for US-East Cluster.</div>
                      </div>
                  </div>
              </div>
          )}

      </div>
    </div>
  );
};

// Helper
const LeafIcon = ({className}: {className?: string}) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>
);

export default MegamDataCenter;
