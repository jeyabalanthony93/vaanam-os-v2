import React, { useState, useEffect } from 'react';
import { Server, Activity, Thermometer, Zap, Wind, Grid, Map, Cpu, HardDrive, Network, Settings, AlertTriangle, CheckCircle2, Box, Layers, RefreshCw, Power } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
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
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [loading, setLoading] = useState(true);

  // Poll for DCIM data
  useEffect(() => {
      const fetchData = async () => {
          const data = await getDCIMData();
          setDcData(data);
          setLoading(false);
      };
      fetchData();
      const interval = setInterval(fetchData, 3000);
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

  if (loading) {
      return (
          <div className="h-full flex items-center justify-center bg-slate-950 text-slate-500 flex-col gap-4">
              <RefreshCw className="animate-spin" size={32}/>
              <p className="font-mono text-sm">Connecting to Physical Infrastructure Layer...</p>
          </div>
      );
  }

  return (
    <div className="h-full flex flex-col bg-slate-950 text-slate-200 font-sans">
      {/* Header */}
      <div className="border-b border-slate-800 bg-slate-900/50 p-6 flex justify-between items-center">
          <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-slate-700 to-slate-800 rounded-xl border border-slate-600 shadow-lg">
                  <Server size={24} className="text-white"/>
              </div>
              <div>
                  <h1 className="text-xl font-bold text-white">Megam Virtual Data Center</h1>
                  <p className="text-slate-400 text-xs">Physical Infrastructure Manager • OCP Compliant</p>
              </div>
          </div>
          <div className="flex bg-slate-800 rounded-lg p-1 border border-slate-700">
              {[
                  { id: 'FLOOR', label: 'Floor Map', icon: Grid },
                  { id: 'RACK', label: 'Rack Inspector', icon: Server },
                  { id: 'POWER', label: 'Power Grid', icon: Zap },
                  { id: 'NOC', label: 'NOC View', icon: Activity },
                  { id: 'OPS', label: 'IT Ops', icon: Settings },
              ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-md text-xs font-bold transition ${activeTab === tab.id ? 'bg-slate-700 text-white shadow' : 'text-slate-400 hover:text-white hover:bg-slate-700'}`}
                  >
                      {/* @ts-ignore */}
                      <tab.icon size={14} /> {tab.label}
                  </button>
              ))}
          </div>
      </div>

      <div className="flex-1 overflow-hidden p-8 bg-slate-950/50 relative">
          
          {activeTab === 'FLOOR' && (
              <div className="h-full flex flex-col">
                  <div className="flex justify-between items-center mb-6">
                      <div className="flex gap-6">
                          <div className="bg-slate-900 border border-slate-800 px-4 py-2 rounded-lg flex items-center gap-3">
                              <Thermometer size={18} className="text-orange-400"/>
                              <div>
                                  <div className="text-[10px] font-bold text-slate-500 uppercase">Avg Temp</div>
                                  <div className="text-lg font-bold text-white">24.5°C</div>
                              </div>
                          </div>
                          <div className="bg-slate-900 border border-slate-800 px-4 py-2 rounded-lg flex items-center gap-3">
                              <Zap size={18} className="text-yellow-400"/>
                              <div>
                                  <div className="text-[10px] font-bold text-slate-500 uppercase">Total Load</div>
                                  <div className="text-lg font-bold text-white">{dcData.totalPower} kW</div>
                              </div>
                          </div>
                          <div className="bg-slate-900 border border-slate-800 px-4 py-2 rounded-lg flex items-center gap-3">
                              <Wind size={18} className="text-blue-400"/>
                              <div>
                                  <div className="text-[10px] font-bold text-slate-500 uppercase">Cooling</div>
                                  <div className="text-lg font-bold text-white">65%</div>
                              </div>
                          </div>
                      </div>
                      
                      <button 
                        onClick={() => setShowHeatmap(!showHeatmap)}
                        className={`px-4 py-2 rounded-lg text-xs font-bold border transition flex items-center gap-2 ${showHeatmap ? 'bg-red-900/20 text-red-400 border-red-500/50' : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'}`}
                      >
                          <Activity size={14}/> {showHeatmap ? 'Hide Thermal Map' : 'Show Thermal Map'}
                      </button>
                  </div>

                  {/* Floor Grid */}
                  <div className="flex-1 bg-slate-900/50 border border-slate-800 rounded-xl p-8 overflow-auto relative">
                      <div className="grid grid-cols-5 gap-8">
                          {dcData.racks.map((rack: Rack) => (
                              <div 
                                key={rack.id}
                                onClick={() => { setSelectedRackId(rack.id); setActiveTab('RACK'); }}
                                className={`
                                    relative aspect-[0.6] bg-slate-950 border-2 rounded-lg p-2 cursor-pointer transition transform hover:scale-105 group
                                    ${showHeatmap && rack.temp > 30 ? 'border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.3)]' : 'border-slate-800 hover:border-blue-500'}
                                `}
                              >
                                  {/* Rack Header */}
                                  <div className="text-center border-b border-slate-800 pb-2 mb-2">
                                      <div className="text-xs font-bold text-slate-400">{rack.id}</div>
                                      <div className={`text-[10px] ${rack.temp > 30 ? 'text-red-400' : 'text-green-400'}`}>{rack.temp}°C</div>
                                  </div>
                                  
                                  {/* Rack Units Preview */}
                                  <div className="flex flex-col gap-0.5 h-full opacity-50 group-hover:opacity-100 transition">
                                      {rack.units.slice(0, 10).map((u, i) => (
                                          <div key={i} className={`h-1 w-full rounded-sm ${getUnitColor(u.status, u.type)}`}></div>
                                      ))}
                                      <div className="flex-1"></div>
                                  </div>

                                  {/* Heatmap Overlay */}
                                  {showHeatmap && (
                                      <div 
                                        className="absolute inset-0 bg-red-500 blur-xl opacity-20 pointer-events-none"
                                        style={{ opacity: (rack.temp - 20) / 20 }}
                                      ></div>
                                  )}
                              </div>
                          ))}
                      </div>
                  </div>
              </div>
          )}

          {activeTab === 'RACK' && (
              <div className="h-full flex gap-8">
                  {/* Rack Selector / List */}
                  <div className="w-64 bg-slate-900 border border-slate-800 rounded-xl overflow-y-auto">
                      <div className="p-4 border-b border-slate-800 text-xs font-bold text-slate-500 uppercase">Select Rack</div>
                      {dcData.racks.map((rack: Rack) => (
                          <button
                            key={rack.id}
                            onClick={() => setSelectedRackId(rack.id)}
                            className={`w-full text-left px-4 py-3 border-b border-slate-800/50 flex justify-between items-center hover:bg-slate-800 transition ${selectedRackId === rack.id ? 'bg-slate-800 text-blue-400' : 'text-slate-400'}`}
                          >
                              <span className="font-mono text-sm">{rack.id}</span>
                              <div className={`w-2 h-2 rounded-full ${rack.temp > 30 ? 'bg-red-500' : 'bg-green-500'}`}></div>
                          </button>
                      ))}
                  </div>

                  {/* Detailed Rack View */}
                  {selectedRackId ? (
                      <div className="flex-1 bg-slate-900 border border-slate-800 rounded-xl p-8 flex gap-12 justify-center overflow-auto">
                          {/* 42U Chassis */}
                          <div className="w-96 bg-[#1a1a1a] border-4 border-slate-700 rounded-lg p-1 relative shadow-2xl">
                              <div className="absolute -top-6 left-0 right-0 text-center text-xs font-bold text-slate-500">{selectedRackId} - 42U OCP Rack</div>
                              <div className="flex flex-col-reverse gap-[1px] h-full bg-black p-1">
                                  {dcData.racks.find((r: Rack) => r.id === selectedRackId)?.units.map((u: RackUnit, i: number) => (
                                      <div 
                                        key={i} 
                                        className={`
                                            w-full flex items-center justify-between px-2 text-[8px] font-mono border-b border-white/5 hover:bg-white/10 transition cursor-help group relative
                                            ${u.type === 'EMPTY' ? 'h-4 bg-transparent' : 'h-8 bg-[#2a2a2a] border-l-4'}
                                            ${u.type === 'GPU_NODE' ? 'border-l-purple-500' : u.type === 'STORAGE_ARRAY' ? 'border-l-blue-500' : u.type === 'SWITCH' ? 'border-l-green-500' : ''}
                                        `}
                                      >
                                          {u.type !== 'EMPTY' && (
                                              <>
                                                  <span className="text-slate-400">{i+1}</span>
                                                  <div className="flex gap-1">
                                                      {u.type === 'GPU_NODE' && <Cpu size={8} className="text-purple-400"/>}
                                                      {u.type === 'STORAGE_ARRAY' && <HardDrive size={8} className="text-blue-400"/>}
                                                      {u.type === 'SWITCH' && <Network size={8} className="text-green-400"/>}
                                                      <span className="text-slate-300">{u.type.replace('_', ' ')}</span>
                                                  </div>
                                                  <div className={`w-1.5 h-1.5 rounded-full ${u.status === 'ACTIVE' ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                                              </>
                                          )}
                                      </div>
                                  ))}
                              </div>
                          </div>

                          {/* Info Panel */}
                          <div className="w-80 flex flex-col gap-6">
                              <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
                                  <h3 className="font-bold text-white mb-4 flex items-center gap-2"><Activity size={18}/> Rack Telemetry</h3>
                                  <div className="space-y-4">
                                      <div>
                                          <div className="flex justify-between text-xs text-slate-400 mb-1">Power Draw</div>
                                          <div className="text-xl font-mono text-yellow-400">4.2 kW</div>
                                          <div className="h-1 bg-slate-700 rounded-full mt-1"><div className="w-3/4 bg-yellow-500 h-full rounded-full"></div></div>
                                      </div>
                                      <div>
                                          <div className="flex justify-between text-xs text-slate-400 mb-1">Intake Temp</div>
                                          <div className="text-xl font-mono text-blue-400">22.0°C</div>
                                      </div>
                                      <div>
                                          <div className="flex justify-between text-xs text-slate-400 mb-1">Exhaust Temp</div>
                                          <div className="text-xl font-mono text-orange-400">38.5°C</div>
                                      </div>
                                  </div>
                              </div>

                              <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
                                  <h3 className="font-bold text-white mb-4 flex items-center gap-2"><Settings size={18}/> Management</h3>
                                  <div className="space-y-2">
                                      <button className="w-full py-2 bg-slate-700 hover:bg-slate-600 rounded text-xs font-bold text-white transition">Remote Console (IPMI)</button>
                                      <button className="w-full py-2 bg-slate-700 hover:bg-slate-600 rounded text-xs font-bold text-white transition">Power Cycle Rack</button>
                                      <button className="w-full py-2 bg-slate-700 hover:bg-slate-600 rounded text-xs font-bold text-white transition">Blink Locator LED</button>
                                  </div>
                              </div>
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
                  <div className="max-w-6xl mx-auto space-y-8">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                              <h3 className="text-xs font-bold text-slate-500 uppercase mb-2">PUE (Efficiency)</h3>
                              <div className="text-4xl font-bold text-green-400 mb-1">{dcData.pue.toFixed(2)}</div>
                              <div className="text-xs text-slate-400">Target: 1.05</div>
                          </div>
                          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                              <h3 className="text-xs font-bold text-slate-500 uppercase mb-2">Renewable Mix</h3>
                              <div className="text-4xl font-bold text-blue-400 mb-1">{dcData.renewables.toFixed(1)}%</div>
                              <div className="text-xs text-slate-400">Solar + Wind Array</div>
                          </div>
                          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                              <h3 className="text-xs font-bold text-slate-500 uppercase mb-2">Grid Load</h3>
                              <div className="text-4xl font-bold text-yellow-400 mb-1">{dcData.totalPower} kW</div>
                              <div className="text-xs text-slate-400">Peak Shaving Active</div>
                          </div>
                      </div>

                      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 h-80">
                          <h3 className="font-bold text-white mb-6 flex items-center gap-2"><Zap size={20} className="text-yellow-400"/> Power Consumption History</h3>
                          <ResponsiveContainer width="100%" height="100%">
                              <AreaChart data={[
                                  {t: '00:00', v: 1200}, {t: '04:00', v: 1100}, {t: '08:00', v: 2400}, {t: '12:00', v: 3200}, {t: '16:00', v: 3100}, {t: '20:00', v: 2800}
                              ]}>
                                  <defs>
                                      <linearGradient id="colorPower" x1="0" y1="0" x2="0" y2="1">
                                          <stop offset="5%" stopColor="#eab308" stopOpacity={0.8}/>
                                          <stop offset="95%" stopColor="#eab308" stopOpacity={0}/>
                                      </linearGradient>
                                  </defs>
                                  <Tooltip contentStyle={{backgroundColor: '#0f172a', borderColor: '#334155'}} />
                                  <Area type="monotone" dataKey="v" stroke="#eab308" fill="url(#colorPower)" />
                              </AreaChart>
                          </ResponsiveContainer>
                      </div>
                  </div>
              </div>
          )}

          {activeTab === 'NOC' && (
              <div className="h-full flex flex-col items-center justify-center bg-slate-900 rounded-xl border border-slate-800 relative overflow-hidden">
                  <div className="absolute inset-0 bg-[url('https://upload.wikimedia.org/wikipedia/commons/e/ec/World_map_blank_without_borders.svg')] bg-cover opacity-10 pointer-events-none"></div>
                  
                  <div className="grid grid-cols-2 gap-20 relative z-10">
                      {[
                          { loc: 'US-East (Virginia)', lat: '32ms' },
                          { loc: 'EU-West (Frankfurt)', lat: '88ms' },
                          { loc: 'AP-South (Mumbai)', lat: '145ms' },
                          { loc: 'SA-East (São Paulo)', lat: '120ms' },
                      ].map((node, i) => (
                          <div key={i} className="bg-slate-950/80 backdrop-blur border border-green-500/30 p-6 rounded-xl flex items-center gap-4 w-64 shadow-[0_0_30px_rgba(34,197,94,0.1)]">
                              <div className="w-3 h-3 bg-green-500 rounded-full animate-ping"></div>
                              <div>
                                  <div className="font-bold text-white text-sm">{node.loc}</div>
                                  <div className="text-xs text-green-400 font-mono">Ping: {node.lat}</div>
                              </div>
                          </div>
                      ))}
                  </div>
                  
                  {/* Central Hub */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                      <div className="w-24 h-24 bg-blue-500/20 rounded-full flex items-center justify-center border border-blue-500/50 mb-4 animate-pulse">
                          <Activity size={48} className="text-blue-400"/>
                      </div>
                      <div className="font-bold text-blue-200">MEGAM CORE</div>
                  </div>
              </div>
          )}

          {activeTab === 'OPS' && (
              <div className="max-w-4xl mx-auto space-y-6 p-8">
                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                      <h3 className="font-bold text-white mb-6 flex items-center gap-2"><Settings size={20}/> Automated Provisioning (MaaS)</h3>
                      <div className="space-y-4">
                          <div className="flex items-center justify-between p-4 bg-slate-800 rounded-lg border border-slate-700">
                              <div>
                                  <div className="font-bold text-white">PXE Boot Policy</div>
                                  <div className="text-xs text-slate-400">Default image for new bare-metal discovery.</div>
                              </div>
                              <select className="bg-slate-900 text-white text-xs p-2 rounded border border-slate-700">
                                  <option>Megam OS 2.0 (HPC Optimized)</option>
                                  <option>Ubuntu 24.04 LTS</option>
                                  <option>Debian 12</option>
                              </select>
                          </div>
                          <div className="flex items-center justify-between p-4 bg-slate-800 rounded-lg border border-slate-700">
                              <div>
                                  <div className="font-bold text-white">Firmware Updates (OpenBMC)</div>
                                  <div className="text-xs text-slate-400">Auto-patch security vulnerabilities on BMC.</div>
                              </div>
                              <button className="text-xs font-bold bg-green-600 text-white px-3 py-1.5 rounded">Enabled</button>
                          </div>
                      </div>
                  </div>

                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                      <h3 className="font-bold text-white mb-6 flex items-center gap-2"><AlertTriangle size={20} className="text-yellow-400"/> Incident Management</h3>
                      <div className="space-y-2">
                          <div className="flex items-center justify-between p-3 bg-red-900/10 border border-red-900/30 rounded">
                              <span className="text-sm text-red-300 flex items-center gap-2"><AlertTriangle size={14}/> RACK-04 PSU Failure detected</span>
                              <span className="text-xs text-slate-500">2m ago</span>
                          </div>
                          <div className="flex items-center justify-between p-3 bg-yellow-900/10 border border-yellow-900/30 rounded">
                              <span className="text-sm text-yellow-300 flex items-center gap-2"><AlertTriangle size={14}/> RACK-08 Temp Warning (28°C)</span>
                              <span className="text-xs text-slate-500">15m ago</span>
                          </div>
                      </div>
                  </div>
              </div>
          )}

      </div>
    </div>
  );
};

export default MegamDataCenter;