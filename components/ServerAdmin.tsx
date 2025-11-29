
import React, { useState } from 'react';
import { Server, Settings, Database, Mail, Shield, Download, Play, RefreshCw, Cpu, HardDrive, Globe, DollarSign, BarChart3, Calculator, Award, ToggleRight, Network, Zap, Layout, CheckCircle2, Lock, AlertCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { ServerEnvironment, HostingState } from '../types';
import { provisionDomain } from '../services/geminiService';

const ServerAdmin: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'DASHBOARD' | 'HOSTING' | 'FINOPS' | 'USAGE'>('DASHBOARD');
  const [activeServer, setActiveServer] = useState<ServerEnvironment>('PRIMARY');
  
  // Hosting State
  const [domainInput, setDomainInput] = useState('megam.com');
  const [hostingState, setHostingState] = useState<HostingState | null>(null);
  const [isProvisioning, setIsProvisioning] = useState(false);

  // FinOps Calculator State
  const [calcInputs, setCalcInputs] = useState({
      users: 50,
      storageTB: 5,
      gpuNodes: 2
  });

  // Usage State
  const [usageStats, setUsageStats] = useState({
      attemptsUsed: 3,
      maxAttempts: 10,
      plan: 'Student / Trial',
      daysRemaining: 28
  });

  // Mock Stats based on Environment
  const getServerStats = (env: ServerEnvironment) => {
      switch(env) {
          case 'PRIMARY': return { name: 'Badal-01 (Main)', status: 'Online', uptime: '99.99%', load: '42%', type: 'Production' };
          case 'FAILOVER': return { name: 'Badal-02 (Backup)', status: 'Standby', uptime: '100%', load: '1%', type: 'DR Site' };
          case 'DEV_CLUSTER': return { name: 'Badal-Dev-Lab', status: 'Online', uptime: '98.5%', load: '85%', type: 'Staging' };
          case 'NEURAL_CORE': return { name: 'Badal-Neural-Grid', status: 'Online', uptime: '99.9%', load: '92%', type: 'AI Compute' };
          default: return { name: 'Unknown', status: 'Offline', uptime: '0%', load: '0%', type: 'Unknown' };
      }
  };

  const currentStats = getServerStats(activeServer);

  const calculateCosts = () => {
      // Traditional Stack Costs (Monthly)
      const saasPerUser = 30; // Slack + Jira + GSuite
      const storagePerTB = 23; // AWS S3
      const gpuPerNode = 1200; // Cloud GPU Instance
      const aiApiPerUser = 20; // OpenAI/Claude API

      const tradSaas = calcInputs.users * saasPerUser;
      const tradStorage = calcInputs.storageTB * storagePerTB;
      const tradCompute = calcInputs.gpuNodes * gpuPerNode;
      const tradAI = calcInputs.users * aiApiPerUser;
      const totalTrad = tradSaas + tradStorage + tradCompute + tradAI;

      // Megam Stack Costs (Monthly)
      const megamInfra = calcInputs.storageTB * 5; // Raw disk cost amortized
      const megamCompute = calcInputs.gpuNodes * 150; // Electricity/Cooling for owned hardware or cheaper bare metal
      const megamSoftware = 0; // Open Source
      const totalMegam = megamInfra + megamCompute + megamSoftware;

      return {
          traditional: totalTrad,
          megam: totalMegam,
          savings: totalTrad - totalMegam,
          chartData: [
              { name: 'Software Licenses', Traditional: tradSaas, Megam: 0 },
              { name: 'AI & API Costs', Traditional: tradAI, Megam: 0 },
              { name: 'Storage Infra', Traditional: tradStorage, Megam: megamInfra },
              { name: 'Compute / GPU', Traditional: tradCompute, Megam: megamCompute },
          ]
      };
  };

  const costs = calculateCosts();

  const handleProvisionDomain = async () => {
      setIsProvisioning(true);
      const res = await provisionDomain(domainInput);
      setHostingState(res);
      setIsProvisioning(false);
  };

  return (
    <div className="h-full flex flex-col bg-slate-950 text-slate-200 overflow-y-auto">
      {/* Top Header with Server Toggle */}
      <div className="bg-slate-900 border-b border-slate-800 p-4">
          <div className="flex justify-between items-center mb-4">
              <div>
                  <h1 className="text-xl font-bold text-white flex items-center gap-2">
                      <Server className="text-blue-500"/> Badal Server Admin
                  </h1>
                  <p className="text-xs text-slate-400">Multi-Node Infrastructure Controller</p>
              </div>
              <div className="flex bg-black/40 rounded-lg p-1 border border-slate-700">
                  <button 
                    onClick={() => setActiveServer('PRIMARY')}
                    className={`px-3 py-1.5 rounded text-xs font-bold transition flex items-center gap-2 ${activeServer === 'PRIMARY' ? 'bg-blue-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}
                  >
                      <Globe size={12}/> Primary
                  </button>
                  <button 
                    onClick={() => setActiveServer('FAILOVER')}
                    className={`px-3 py-1.5 rounded text-xs font-bold transition flex items-center gap-2 ${activeServer === 'FAILOVER' ? 'bg-orange-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}
                  >
                      <Shield size={12}/> Failover
                  </button>
                  <button 
                    onClick={() => setActiveServer('DEV_CLUSTER')}
                    className={`px-3 py-1.5 rounded text-xs font-bold transition flex items-center gap-2 ${activeServer === 'DEV_CLUSTER' ? 'bg-purple-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}
                  >
                      <Network size={12}/> Dev Cluster
                  </button>
                  <button 
                    onClick={() => setActiveServer('NEURAL_CORE')}
                    className={`px-3 py-1.5 rounded text-xs font-bold transition flex items-center gap-2 ${activeServer === 'NEURAL_CORE' ? 'bg-green-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}
                  >
                      <Zap size={12}/> Neural Core
                  </button>
              </div>
          </div>

          <div className="grid grid-cols-4 gap-4">
              <div className="bg-slate-800/50 p-3 rounded border border-slate-700 flex justify-between items-center">
                  <span className="text-xs text-slate-400 font-bold uppercase">Node ID</span>
                  <span className="text-sm font-mono text-white">{currentStats.name}</span>
              </div>
              <div className="bg-slate-800/50 p-3 rounded border border-slate-700 flex justify-between items-center">
                  <span className="text-xs text-slate-400 font-bold uppercase">Status</span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded ${currentStats.status === 'Online' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>{currentStats.status}</span>
              </div>
              <div className="bg-slate-800/50 p-3 rounded border border-slate-700 flex justify-between items-center">
                  <span className="text-xs text-slate-400 font-bold uppercase">Load</span>
                  <span className={`text-sm font-mono font-bold ${parseInt(currentStats.load) > 80 ? 'text-red-400' : 'text-blue-400'}`}>{currentStats.load}</span>
              </div>
              <div className="bg-slate-800/50 p-3 rounded border border-slate-700 flex justify-between items-center">
                  <span className="text-xs text-slate-400 font-bold uppercase">Type</span>
                  <span className="text-sm font-bold text-slate-300">{currentStats.type}</span>
              </div>
          </div>
      </div>

      {/* Tabs */}
      <div className="px-8 pt-6 pb-2 border-b border-slate-800 bg-slate-900/50 flex gap-4">
            <button 
                onClick={() => setActiveTab('DASHBOARD')} 
                className={`pb-2 text-sm font-bold flex items-center gap-2 transition border-b-2 ${activeTab === 'DASHBOARD' ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-400 hover:text-white'}`}
            >
                <Server size={14}/> Node Dashboard
            </button>
            <button 
                onClick={() => setActiveTab('HOSTING')} 
                className={`pb-2 text-sm font-bold flex items-center gap-2 transition border-b-2 ${activeTab === 'HOSTING' ? 'border-orange-500 text-orange-400' : 'border-transparent text-slate-400 hover:text-white'}`}
            >
                <Layout size={14}/> Domains & Hosting
            </button>
            <button 
                onClick={() => setActiveTab('FINOPS')} 
                className={`pb-2 text-sm font-bold flex items-center gap-2 transition border-b-2 ${activeTab === 'FINOPS' ? 'border-green-500 text-green-400' : 'border-transparent text-slate-400 hover:text-white'}`}
            >
                <Calculator size={14}/> Budget Calculator
            </button>
            <button 
                onClick={() => setActiveTab('USAGE')} 
                className={`pb-2 text-sm font-bold flex items-center gap-2 transition border-b-2 ${activeTab === 'USAGE' ? 'border-purple-500 text-purple-400' : 'border-transparent text-slate-400 hover:text-white'}`}
            >
                <Award size={14}/> License & Usage
            </button>
      </div>

      <div className="flex-1 overflow-y-auto p-8">
          
          {activeTab === 'DASHBOARD' && (
              <div className="space-y-8 animate-in fade-in duration-300">
                  {/* ... (Existing Dashboard Content) ... */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Quick Actions */}
                      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                          <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                              <Play size={18} className="text-green-400" /> Active Services ({activeServer})
                          </h3>
                          <div className="space-y-4">
                              {[
                                  { name: 'Nginx Web Server', status: 'Running', port: 80, load: activeServer === 'NEURAL_CORE' ? 'Low' : 'High' },
                                  { name: 'Postfix Mail Gateway', status: activeServer === 'DEV_CLUSTER' ? 'Stopped' : 'Running', port: 25, load: 'Idle' },
                                  { name: 'PostgreSQL Database', status: 'Running', port: 5432, load: 'Medium' },
                                  { name: 'Docker Daemon', status: 'Running', port: null, load: activeServer === 'NEURAL_CORE' ? 'Critical' : 'High' },
                              ].map((s) => (
                                  <div key={s.name} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg border border-slate-800">
                                      <div>
                                          <div className="font-medium text-slate-200">{s.name}</div>
                                          {s.port && <div className="text-xs text-slate-500">Port: {s.port}</div>}
                                      </div>
                                      <div className="flex items-center gap-3">
                                          <span className={`text-xs px-2 py-1 rounded-full ${s.status === 'Running' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                                              {s.status}
                                          </span>
                                          <button className="p-1 hover:bg-slate-700 rounded text-slate-400"><RefreshCw size={14} /></button>
                                      </div>
                                  </div>
                              ))}
                          </div>
                      </div>

                      {/* Resource Usage */}
                      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                          <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                              <Cpu size={18} className="text-blue-400" /> Resource Allocation
                          </h3>
                          <div className="space-y-6">
                              <div>
                                  <div className="flex justify-between text-sm mb-2">
                                      <span className="text-slate-400">Unlimited CPU Pool</span>
                                      <span className="text-white">{parseInt(currentStats.load)}% utilized</span>
                                  </div>
                                  <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                                      <div className="h-full bg-blue-500 rounded-full" style={{width: currentStats.load}}></div>
                                  </div>
                              </div>
                              <div>
                                  <div className="flex justify-between text-sm mb-2">
                                      <span className="text-slate-400">RAM (Elastic)</span>
                                      <span className="text-white">42GB / ∞</span>
                                  </div>
                                  <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                                      <div className="h-full w-[4%] bg-purple-500 rounded-full"></div>
                                  </div>
                              </div>
                              <div>
                                  <div className="flex justify-between text-sm mb-2">
                                      <span className="text-slate-400">NVMe Storage Pool</span>
                                      <span className="text-white">2.4 PB Used</span>
                                  </div>
                                  <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                                      <div className="h-full w-[1%] bg-green-500 rounded-full"></div>
                                  </div>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          )}

          {activeTab === 'HOSTING' && (
              <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-8">
                      <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2"><Globe size={24} className="text-blue-400"/> Self-Hosting Control Panel</h2>
                      <p className="text-slate-400 mb-8">Deploy your ecosystem on your own domains with automated SSL and DNS management.</p>

                      <div className="flex gap-4 mb-8">
                          <input 
                            value={domainInput}
                            onChange={(e) => setDomainInput(e.target.value)}
                            className="flex-1 bg-black border border-slate-700 rounded-xl px-4 py-3 text-white text-lg font-mono outline-none focus:border-blue-500"
                            placeholder="example.com"
                          />
                          <button 
                            onClick={handleProvisionDomain}
                            disabled={isProvisioning}
                            className="bg-blue-600 hover:bg-blue-500 text-white px-8 rounded-xl font-bold flex items-center gap-2 disabled:opacity-50"
                          >
                              {isProvisioning ? <RefreshCw className="animate-spin"/> : <Globe/>}
                              Provision
                          </button>
                      </div>

                      {hostingState && (
                          <div className="space-y-6">
                              <div className="flex gap-6">
                                  <div className="flex-1 bg-slate-950 border border-slate-800 p-6 rounded-xl flex items-center justify-between">
                                      <div>
                                          <div className="text-xs font-bold text-slate-500 uppercase mb-1">Domain Status</div>
                                          <div className="text-xl font-bold text-green-400 flex items-center gap-2"><CheckCircle2 size={18}/> {hostingState.status}</div>
                                      </div>
                                      <div className="text-right">
                                          <div className="text-xs font-bold text-slate-500 uppercase mb-1">Expiry</div>
                                          <div className="text-white">{hostingState.expiryDate}</div>
                                      </div>
                                  </div>
                                  <div className="flex-1 bg-slate-950 border border-slate-800 p-6 rounded-xl flex items-center justify-between">
                                      <div>
                                          <div className="text-xs font-bold text-slate-500 uppercase mb-1">SSL Certificate</div>
                                          <div className="text-xl font-bold text-blue-400 flex items-center gap-2"><Lock size={18}/> {hostingState.ssl ? 'Active' : 'Pending'}</div>
                                      </div>
                                      <div className="text-right">
                                          <div className="text-xs font-bold text-slate-500 uppercase mb-1">Issuer</div>
                                          <div className="text-white">Let's Encrypt R3</div>
                                      </div>
                                  </div>
                              </div>

                              <div className="bg-black/30 border border-slate-800 rounded-xl p-6">
                                  <h3 className="font-bold text-white mb-4">DNS Records</h3>
                                  <table className="w-full text-left text-sm font-mono">
                                      <thead className="text-slate-500 border-b border-slate-800">
                                          <tr>
                                              <th className="pb-2">Type</th>
                                              <th className="pb-2">Name</th>
                                              <th className="pb-2">Value</th>
                                              <th className="pb-2">TTL</th>
                                          </tr>
                                      </thead>
                                      <tbody className="text-slate-300">
                                          {hostingState.dnsRecords.map((rec, i) => (
                                              <tr key={i} className="border-b border-slate-800 last:border-0">
                                                  <td className="py-2 text-yellow-400">{rec.type}</td>
                                                  <td className="py-2">{rec.name}</td>
                                                  <td className="py-2 text-blue-300">{rec.value}</td>
                                                  <td className="py-2 text-slate-500">{rec.ttl}</td>
                                              </tr>
                                          ))}
                                      </tbody>
                                  </table>
                              </div>
                          </div>
                      )}
                  </div>
              </div>
          )}

          {activeTab === 'FINOPS' && (
              <div className="h-full flex flex-col lg:flex-row gap-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
                  {/* Inputs */}
                  <div className="lg:w-1/3 bg-slate-900 border border-slate-800 rounded-xl p-6 h-fit">
                      <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2"><Settings size={20}/> Project Scale</h3>
                      <div className="space-y-6">
                          <div>
                              <label className="text-sm font-bold text-slate-400 block mb-2">Active Users</label>
                              <div className="flex items-center gap-4">
                                  <input type="range" min="10" max="1000" step="10" value={calcInputs.users} onChange={e => setCalcInputs({...calcInputs, users: parseInt(e.target.value)})} className="flex-1 accent-green-500"/>
                                  <span className="font-mono text-white bg-slate-800 px-3 py-1 rounded border border-slate-700 w-20 text-center">{calcInputs.users}</span>
                              </div>
                          </div>
                          <div>
                              <label className="text-sm font-bold text-slate-400 block mb-2">Storage Needs (TB)</label>
                              <div className="flex items-center gap-4">
                                  <input type="range" min="1" max="100" value={calcInputs.storageTB} onChange={e => setCalcInputs({...calcInputs, storageTB: parseInt(e.target.value)})} className="flex-1 accent-blue-500"/>
                                  <span className="font-mono text-white bg-slate-800 px-3 py-1 rounded border border-slate-700 w-20 text-center">{calcInputs.storageTB}</span>
                              </div>
                          </div>
                          <div>
                              <label className="text-sm font-bold text-slate-400 block mb-2">GPU Compute Nodes</label>
                              <div className="flex items-center gap-4">
                                  <input type="range" min="0" max="20" value={calcInputs.gpuNodes} onChange={e => setCalcInputs({...calcInputs, gpuNodes: parseInt(e.target.value)})} className="flex-1 accent-purple-500"/>
                                  <span className="font-mono text-white bg-slate-800 px-3 py-1 rounded border border-slate-700 w-20 text-center">{calcInputs.gpuNodes}</span>
                              </div>
                          </div>
                      </div>

                      <div className="mt-8 pt-8 border-t border-slate-800">
                          <h4 className="text-font-bold text-white mb-4">Cost Assumptions</h4>
                          <div className="space-y-2 text-xs text-slate-400">
                              <div className="flex justify-between"><span>SaaS Seat Avg:</span> <span>$30/mo</span></div>
                              <div className="flex justify-between"><span>Cloud Storage:</span> <span>$23/TB</span></div>
                              <div className="flex justify-between"><span>Cloud GPU:</span> <span>$1200/mo</span></div>
                          </div>
                      </div>
                  </div>

                  {/* Results */}
                  <div className="flex-1 flex flex-col gap-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 text-center">
                              <div className="text-xs font-bold text-slate-500 uppercase mb-2">Traditional Cloud Cost</div>
                              <div className="text-3xl font-bold text-red-400">${costs.traditional.toLocaleString()}</div>
                              <div className="text-xs text-slate-500 mt-1">per month</div>
                          </div>
                          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 text-center">
                              <div className="text-xs font-bold text-slate-500 uppercase mb-2">Megam OS Cost</div>
                              <div className="text-3xl font-bold text-green-400">${costs.megam.toLocaleString()}</div>
                              <div className="text-xs text-slate-500 mt-1">per month</div>
                          </div>
                          <div className="bg-gradient-to-br from-green-900/40 to-emerald-900/40 border border-green-500/30 rounded-xl p-6 text-center">
                              <div className="text-xs font-bold text-green-300 uppercase mb-2">Total Savings</div>
                              <div className="text-3xl font-bold text-white">${costs.savings.toLocaleString()}</div>
                              <div className="text-xs text-green-300/70 mt-1">{(costs.savings / costs.traditional * 100).toFixed(1)}% Reduction</div>
                          </div>
                      </div>

                      <div className="flex-1 bg-slate-900 border border-slate-800 rounded-xl p-6">
                          <h3 className="font-bold text-white mb-6 flex items-center gap-2"><BarChart3 size={20}/> Cost Breakdown</h3>
                          <div className="h-80 w-full">
                              <ResponsiveContainer width="100%" height="100%">
                                  <BarChart data={costs.chartData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={true} vertical={true} />
                                      <XAxis type="number" stroke="#94a3b8" />
                                      <YAxis dataKey="name" type="category" stroke="#94a3b8" width={100} tick={{fontSize: 10}} />
                                      <Tooltip cursor={{fill: 'transparent'}} contentStyle={{backgroundColor: '#0f172a', borderColor: '#334155'}} />
                                      <Legend />
                                      <Bar dataKey="Traditional" fill="#ef4444" radius={[0, 4, 4, 0]} barSize={20} />
                                      <Bar dataKey="Megam" fill="#22c55e" radius={[0, 4, 4, 0]} barSize={20} />
                                  </BarChart>
                              </ResponsiveContainer>
                          </div>
                      </div>
                  </div>
              </div>
          )}

          {activeTab === 'USAGE' && (
              <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300">
                  <div className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 border border-purple-500/30 rounded-xl p-8 text-center">
                      <h2 className="text-3xl font-bold text-white mb-2">License Status: {usageStats.plan}</h2>
                      <p className="text-slate-400 mb-6">You are running the free academic/trial license. Unlimited open-source usage on self-hosted infrastructure.</p>
                      
                      <div className="grid grid-cols-2 gap-8 mb-8 max-w-lg mx-auto">
                          <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
                              <div className="text-slate-500 text-xs font-bold uppercase mb-2">Build Attempts</div>
                              <div className="text-4xl font-bold text-white">{usageStats.attemptsUsed} <span className="text-lg text-slate-500">/ {usageStats.maxAttempts}</span></div>
                          </div>
                          <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
                              <div className="text-slate-500 text-xs font-bold uppercase mb-2">Trial Remaining</div>
                              <div className="text-4xl font-bold text-white">{usageStats.daysRemaining} <span className="text-lg text-slate-500">Days</span></div>
                          </div>
                      </div>

                      <div className="w-full bg-slate-800 h-4 rounded-full overflow-hidden mb-2 max-w-lg mx-auto">
                          <div className="h-full bg-purple-500 transition-all duration-500" style={{width: `${(usageStats.attemptsUsed / usageStats.maxAttempts) * 100}%`}}></div>
                      </div>
                      <p className="text-xs text-slate-500">Usage Meter: {(usageStats.attemptsUsed / usageStats.maxAttempts) * 100}%</p>
                  </div>

                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                      <h3 className="font-bold text-white mb-4">Plan Features</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="flex items-center gap-2 p-3 bg-slate-950 rounded border border-slate-800">
                              <Shield size={16} className="text-green-400"/>
                              <span className="text-sm text-slate-300">Self-Hosted DNS & Email</span>
                          </div>
                          <div className="flex items-center gap-2 p-3 bg-slate-950 rounded border border-slate-800">
                              <Shield size={16} className="text-green-400"/>
                              <span className="text-sm text-slate-300">Neural Bridge (No-GPU AI)</span>
                          </div>
                          <div className="flex items-center gap-2 p-3 bg-slate-950 rounded border border-slate-800">
                              <Shield size={16} className="text-green-400"/>
                              <span className="text-sm text-slate-300">BadalChain Studio (Native)</span>
                          </div>
                          <div className="flex items-center gap-2 p-3 bg-slate-950 rounded border border-slate-800">
                              <Shield size={16} className="text-green-400"/>
                              <span className="text-sm text-slate-300">Unlimited Agents (Local)</span>
                          </div>
                      </div>
                  </div>
              </div>
          )}

      </div>
    </div>
  );
};

export default ServerAdmin;
