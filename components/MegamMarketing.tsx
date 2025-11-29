
import React, { useState, useEffect } from 'react';
import { 
    LayoutDashboard, Globe, Search, PenTool, Share2, 
    Palette, BarChart3, TrendingUp, Newspaper, 
    MessageCircle, AlertCircle, RefreshCw, Zap,
    Type, Check, Calendar, Image as ImageIcon,
    Target, Mic, Hash, Megaphone, Video, Plug,
    Key, Lock, CheckCircle2, X, Loader2, ArrowRight,
    Workflow, Layers, Filter, Link, Eye, Mail, Server,
    Activity, DollarSign, Radio, Play, Plus, Shield
} from 'lucide-react';
import { 
    AreaChart, Area, XAxis, YAxis, CartesianGrid, 
    Tooltip, ResponsiveContainer, BarChart, Bar,
    PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import { performSEOAudit, monitorMediaMentions, paraphraseContent } from '../services/geminiService';

interface ToolConnector {
    id: string;
    name: string;
    category: 'ANALYTICS' | 'SEO' | 'CONTENT' | 'SOCIAL' | 'DESIGN';
    icon: any; 
    status: 'CONNECTED' | 'DISCONNECTED';
    method: 'OAUTH' | 'API_KEY';
    description: string;
    color: string;
    verified: boolean;
}

const MegamMarketing: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'DASHBOARD' | 'CAMPAIGNS' | 'SEO_LAB' | 'CONTENT_AI' | 'SOCIAL_GRID' | 'INTEGRATIONS'>('DASHBOARD');
  
  // Advanced State
  const [campaignFlow, setCampaignFlow] = useState([
      { id: '1', step: 'Trigger', label: 'New Blog Post', status: 'Active' },
      { id: '2', step: 'Action', label: 'Auto-Tweet', status: 'Pending' },
      { id: '3', step: 'Delay', label: 'Wait 2 Hours', status: 'Pending' },
      { id: '4', step: 'Action', label: 'Email Newsletter', status: 'Pending' }
  ]);

  const [topicClusters, setTopicClusters] = useState([
      { topic: 'Neural Networks', vol: '45K', kd: 'High', potential: 'High' },
      { topic: 'Open Source AI', vol: '12K', kd: 'Med', potential: 'Very High' },
      { topic: 'Self-Hosted Cloud', vol: '8.5K', kd: 'Low', potential: 'High' },
  ]);

  // Connectors State (Populated from Free Public APIs lists)
  const [connectors, setConnectors] = useState<ToolConnector[]>([
      { id: 'google_search', name: 'Google Search Console', category: 'SEO', icon: Search, status: 'CONNECTED', method: 'OAUTH', description: 'Performance data & indexing.', color: 'text-blue-500', verified: true },
      { id: 'twitter_api', name: 'Twitter / X API', category: 'SOCIAL', icon: MessageCircle, status: 'CONNECTED', method: 'OAUTH', description: 'Post tweets & read timeline.', color: 'text-sky-500', verified: true },
      { id: 'mailchimp', name: 'Mailchimp (Open)', category: 'SOCIAL', icon: Mail, status: 'DISCONNECTED', method: 'API_KEY', description: 'Email marketing automation.', color: 'text-yellow-500', verified: false },
      { id: 'unsplash', name: 'Unsplash API', category: 'DESIGN', icon: ImageIcon, status: 'CONNECTED', method: 'API_KEY', description: 'High-quality royalty free photos.', color: 'text-white', verified: true },
      { id: 'pagespeed', name: 'PageSpeed Insights', category: 'SEO', icon: Zap, status: 'DISCONNECTED', method: 'API_KEY', description: 'Analyze site performance.', color: 'text-green-500', verified: false },
      { id: 'reddit', name: 'Reddit API', category: 'SOCIAL', icon: MessageCircle, status: 'DISCONNECTED', method: 'OAUTH', description: 'Social listening & community.', color: 'text-orange-500', verified: false },
  ]);

  const [isVerifying, setIsVerifying] = useState(false);
  const [verifyingId, setVerifyingId] = useState<string | null>(null);

  const handleConnect = (id: string) => {
      setVerifyingId(id);
      setIsVerifying(true);
      // Simulate Security Scan
      setTimeout(() => {
          setConnectors(prev => prev.map(c => c.id === id ? { ...c, status: 'CONNECTED', verified: true } : c));
          setIsVerifying(false);
          setVerifyingId(null);
      }, 1500);
  };

  return (
    <div className="h-full flex flex-col bg-[#0b0f19] text-slate-200 font-sans relative overflow-hidden">
      
      {/* Professional Header */}
      <div className="border-b border-slate-800 bg-[#0f172a] p-4 flex justify-between items-center shadow-md z-20">
          <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-600 to-rose-600 flex items-center justify-center shadow-lg shadow-pink-900/30">
                  <Megaphone size={20} className="text-white"/>
              </div>
              <div>
                  <h1 className="text-lg font-bold text-white tracking-tight">Megam Marketing OS</h1>
                  <p className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                      <Server size={10} className="text-green-500"/> Secure Gateway Active
                  </p>
              </div>
          </div>
          
          <div className="flex bg-slate-900/50 p-1 rounded-lg border border-slate-800 backdrop-blur-sm">
              {[
                  { id: 'DASHBOARD', label: 'Command Ctr', icon: LayoutDashboard },
                  { id: 'CAMPAIGNS', label: 'Orchestrator', icon: Workflow },
                  { id: 'SEO_LAB', label: 'SEO Lab', icon: Globe },
                  { id: 'CONTENT_AI', label: 'Content AI', icon: PenTool },
                  { id: 'SOCIAL_GRID', label: 'Social Grid', icon: Share2 },
                  { id: 'INTEGRATIONS', label: 'API Vault', icon: Plug }
              ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-bold transition-all ${activeTab === tab.id ? 'bg-pink-600 text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                  >
                      {/* @ts-ignore */}
                      <tab.icon size={14} /> {tab.label}
                  </button>
              ))}
          </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 bg-[#0b0f19] relative">
          
          {/* Background Ambient */}
          <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-pink-900/10 to-transparent pointer-events-none"></div>

          {activeTab === 'DASHBOARD' && (
              <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-300">
                  {/* KPI Row */}
                  <div className="grid grid-cols-4 gap-4">
                      {[
                          { label: 'Total Reach', val: '4.2M', sub: '+12%', icon: Globe, col: 'text-blue-400' },
                          { label: 'Engagement', val: '8.5%', sub: '+2.1%', icon: Activity, col: 'text-green-400' },
                          { label: 'Leads Generated', val: '1,402', sub: 'This Week', icon: Target, col: 'text-purple-400' },
                          { label: 'Ad Spend', val: '$0.00', sub: 'Zero-Cost Organic', icon: DollarSign, col: 'text-white' },
                      ].map((k, i) => (
                          <div key={i} className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl flex items-center justify-between hover:border-slate-700 transition">
                              <div>
                                  <p className="text-[10px] uppercase font-bold text-slate-500 mb-1">{k.label}</p>
                                  <h3 className="text-2xl font-bold text-white">{k.val}</h3>
                                  <span className={`text-xs ${k.col} font-medium`}>{k.sub}</span>
                              </div>
                              <div className={`p-3 rounded-lg bg-slate-800 ${k.col} bg-opacity-10`}>
                                  <k.icon size={20}/>
                              </div>
                          </div>
                      ))}
                  </div>

                  <div className="grid grid-cols-3 gap-6">
                      {/* Main Chart */}
                      <div className="col-span-2 bg-slate-900/80 border border-slate-800 rounded-xl p-6 h-80">
                          <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2"><BarChart3 size={16}/> Traffic Acquisition</h3>
                          <ResponsiveContainer width="100%" height="100%">
                              <AreaChart data={[
                                  {d: 'Mon', org: 4000, soc: 2400}, {d: 'Tue', org: 3000, soc: 1398}, {d: 'Wed', org: 2000, soc: 9800},
                                  {d: 'Thu', org: 2780, soc: 3908}, {d: 'Fri', org: 1890, soc: 4800}, {d: 'Sat', org: 2390, soc: 3800},
                                  {d: 'Sun', org: 3490, soc: 4300}
                              ]}>
                                  <defs>
                                      <linearGradient id="colOrg" x1="0" y1="0" x2="0" y2="1">
                                          <stop offset="5%" stopColor="#ec4899" stopOpacity={0.8}/>
                                          <stop offset="95%" stopColor="#ec4899" stopOpacity={0}/>
                                      </linearGradient>
                                  </defs>
                                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                                  <XAxis dataKey="d" stroke="#64748b" fontSize={10} />
                                  <YAxis stroke="#64748b" fontSize={10} />
                                  <Tooltip contentStyle={{backgroundColor: '#0f172a', borderColor: '#334155'}} />
                                  <Area type="monotone" dataKey="org" stroke="#ec4899" strokeWidth={2} fill="url(#colOrg)" />
                                  <Area type="monotone" dataKey="soc" stroke="#3b82f6" strokeWidth={2} fillOpacity={0.1} />
                              </AreaChart>
                          </ResponsiveContainer>
                      </div>

                      {/* Live Feed */}
                      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6 flex flex-col">
                          <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2"><Radio size={16} className="text-red-500 animate-pulse"/> Live Social Signals</h3>
                          <div className="flex-1 overflow-y-auto space-y-3">
                              {[
                                  { plat: 'Twitter', user: '@tech_guru', msg: 'Megam OS is changing the game!', sentiment: 'POS' },
                                  { plat: 'Reddit', user: 'u/cloud_dev', msg: 'How does Neural Bridge actually work?', sentiment: 'NEU' },
                                  { plat: 'LinkedIn', user: 'Sarah J.', msg: 'Just deployed my first agent swarm.', sentiment: 'POS' },
                              ].map((m, i) => (
                                  <div key={i} className="p-3 bg-slate-950 rounded border border-slate-800 text-xs">
                                      <div className="flex justify-between mb-1">
                                          <span className="font-bold text-blue-400">{m.plat}</span>
                                          <span className={`px-1.5 rounded text-[9px] font-bold ${m.sentiment === 'POS' ? 'bg-green-500/20 text-green-400' : 'bg-slate-800 text-slate-400'}`}>{m.sentiment}</span>
                                      </div>
                                      <p className="text-slate-300">{m.msg}</p>
                                  </div>
                              ))}
                          </div>
                      </div>
                  </div>
              </div>
          )}

          {activeTab === 'CAMPAIGNS' && (
              <div className="h-full flex gap-6">
                  {/* Orchestrator Canvas */}
                  <div className="flex-1 bg-slate-900/50 border border-slate-800 rounded-xl relative overflow-hidden flex flex-col">
                      <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900">
                          <div className="flex items-center gap-2">
                              <Workflow size={18} className="text-pink-500"/>
                              <span className="font-bold text-white text-sm">Campaign Flow: Q4 Product Launch</span>
                          </div>
                          <button className="bg-pink-600 hover:bg-pink-500 text-white px-4 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-2">
                              <Play size={12}/> Activate Flow
                          </button>
                      </div>
                      
                      <div className="flex-1 relative p-8 flex items-center justify-center">
                          {/* Background Grid */}
                          <div className="absolute inset-0 opacity-10" style={{backgroundImage: 'radial-gradient(#475569 1px, transparent 1px)', backgroundSize: '20px 20px'}}></div>
                          
                          <div className="flex items-center gap-4 relative z-10">
                              {campaignFlow.map((node, i) => (
                                  <div key={node.id} className="flex items-center">
                                      <div className={`w-40 p-4 rounded-xl border-2 flex flex-col gap-2 relative group hover:scale-105 transition cursor-pointer bg-slate-900 ${i===0 ? 'border-green-500' : 'border-slate-700 hover:border-pink-500'}`}>
                                          <div className="text-[10px] font-bold text-slate-500 uppercase">{node.step}</div>
                                          <div className="font-bold text-white text-sm">{node.label}</div>
                                          <div className={`absolute -bottom-3 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full text-[9px] font-bold border bg-slate-950 ${node.status === 'Active' ? 'text-green-400 border-green-500' : 'text-slate-500 border-slate-700'}`}>
                                              {node.status}
                                          </div>
                                      </div>
                                      {i < campaignFlow.length - 1 && (
                                          <div className="w-12 h-0.5 bg-slate-700 relative">
                                              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 border-t-2 border-r-2 border-slate-700 rotate-45"></div>
                                          </div>
                                      )}
                                  </div>
                              ))}
                              <button className="w-10 h-10 rounded-full border-2 border-dashed border-slate-700 flex items-center justify-center text-slate-500 hover:text-white hover:border-slate-500 transition">
                                  <Plus size={20}/>
                              </button>
                          </div>
                      </div>
                  </div>
              </div>
          )}

          {activeTab === 'SEO_LAB' && (
              <div className="h-full flex flex-col gap-6">
                  <div className="grid grid-cols-2 gap-6">
                      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                          <h3 className="font-bold text-white mb-4 flex items-center gap-2"><Search size={18} className="text-blue-400"/> Topic Cluster Discovery</h3>
                          <div className="space-y-3">
                              {topicClusters.map((t, i) => (
                                  <div key={i} className="flex items-center justify-between p-3 bg-slate-950 rounded border border-slate-800">
                                      <div className="flex items-center gap-3">
                                          <div className="w-8 h-8 rounded bg-blue-900/20 text-blue-400 flex items-center justify-center font-bold text-xs">{i+1}</div>
                                          <div>
                                              <div className="font-bold text-white text-sm">{t.topic}</div>
                                              <div className="text-[10px] text-slate-500">{t.vol} Vol • KD: {t.kd}</div>
                                          </div>
                                      </div>
                                      <span className="text-[10px] bg-green-900/20 text-green-400 px-2 py-1 rounded border border-green-900/30">
                                          {t.potential} Potential
                                      </span>
                                  </div>
                              ))}
                          </div>
                          <button className="w-full mt-4 py-2 border border-slate-700 text-slate-400 text-xs font-bold rounded hover:bg-slate-800 hover:text-white transition">
                              Generate More Clusters
                          </button>
                      </div>

                      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                          <h3 className="font-bold text-white mb-4 flex items-center gap-2"><Link size={18} className="text-orange-400"/> Backlink Explorer</h3>
                          <div className="space-y-4">
                              <div className="flex gap-4">
                                  <input className="flex-1 bg-slate-950 border border-slate-700 rounded p-2 text-sm text-white" placeholder="Enter competitor URL..."/>
                                  <button className="bg-orange-600 text-white px-4 rounded text-xs font-bold">Analyze</button>
                              </div>
                              <div className="bg-black/30 rounded p-4 h-40 flex flex-col items-center justify-center text-slate-500 text-sm border border-slate-800 border-dashed">
                                  Enter a URL to discover backlink opportunities.
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          )}

          {activeTab === 'INTEGRATIONS' && (
              <div className="max-w-6xl mx-auto space-y-6">
                  <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 p-6 rounded-xl border border-blue-500/30 flex justify-between items-center">
                      <div>
                          <h2 className="text-xl font-bold text-white mb-1">Secure API Gateway</h2>
                          <p className="text-sm text-slate-400">Manage connections to external marketing tools. All tokens are encrypted.</p>
                      </div>
                      <div className="flex items-center gap-2 text-green-400 text-xs font-bold bg-green-900/20 px-3 py-1.5 rounded-full border border-green-500/30">
                          <Shield size={12}/> Verified Secure
                      </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {connectors.map(tool => (
                          <div key={tool.id} className="bg-slate-900 border border-slate-800 p-5 rounded-xl flex flex-col justify-between group hover:border-slate-600 transition relative overflow-hidden">
                              {tool.status === 'CONNECTED' && <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-green-500/10 to-transparent pointer-events-none"></div>}
                              
                              <div>
                                  <div className="flex justify-between items-start mb-4">
                                      <div className={`p-2 rounded-lg bg-slate-950 border border-slate-800 ${tool.color}`}>
                                          <tool.icon size={24}/>
                                      </div>
                                      <span className={`text-[9px] uppercase font-bold px-2 py-0.5 rounded border ${tool.status === 'CONNECTED' ? 'bg-green-900/20 text-green-400 border-green-500/20' : 'bg-slate-800 text-slate-500 border-slate-700'}`}>
                                          {tool.status}
                                      </span>
                                  </div>
                                  <h3 className="font-bold text-white mb-1">{tool.name}</h3>
                                  <p className="text-xs text-slate-400 line-clamp-2">{tool.description}</p>
                              </div>

                              <button 
                                onClick={() => handleConnect(tool.id)}
                                disabled={verifyingId === tool.id || tool.status === 'CONNECTED'}
                                className={`w-full mt-4 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition ${tool.status === 'CONNECTED' ? 'bg-slate-800 text-slate-500 cursor-default' : 'bg-pink-600 hover:bg-pink-500 text-white'}`}
                              >
                                  {verifyingId === tool.id ? <Loader2 className="animate-spin" size={14}/> : tool.status === 'CONNECTED' ? <Check size={14}/> : <Plug size={14}/>}
                                  {verifyingId === tool.id ? 'Scanning API...' : tool.status === 'CONNECTED' ? 'Active' : 'Connect'}
                              </button>
                          </div>
                      ))}
                  </div>
              </div>
          )}

      </div>
    </div>
  );
};

export default MegamMarketing;