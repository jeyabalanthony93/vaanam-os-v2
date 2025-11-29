
import React, { useState } from 'react';
import { 
    LayoutDashboard, Globe, Search, PenTool, Share2, 
    Palette, BarChart3, TrendingUp, Newspaper, 
    MessageCircle, AlertCircle, RefreshCw, Zap,
    Type, Check, Calendar, Image as ImageIcon,
    Target, Mic, Hash, Megaphone, Video, Plug,
    Key, Lock, CheckCircle2, X, Loader2, ArrowRight
} from 'lucide-react';
import { 
    AreaChart, Area, XAxis, YAxis, CartesianGrid, 
    Tooltip, ResponsiveContainer, BarChart, Bar 
} from 'recharts';
import { performSEOAudit, monitorMediaMentions, paraphraseContent, generateDocumentContent } from '../services/geminiService';

interface ToolConnector {
    id: string;
    name: string;
    category: 'ANALYTICS' | 'SEO' | 'CONTENT' | 'SOCIAL' | 'DESIGN';
    icon: any; // visual placeholder
    status: 'CONNECTED' | 'DISCONNECTED';
    method: 'OAUTH' | 'API_KEY';
    description: string;
    color: string;
}

const MegamMarketing: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'DASHBOARD' | 'PR_MEDIA' | 'SEO' | 'CONTENT' | 'SOCIAL' | 'INTEGRATIONS'>('DASHBOARD');

  // --- PR & Media State ---
  const [monitorKeyword, setMonitorKeyword] = useState('Megam OS');
  const [mentions, setMentions] = useState<any[]>([]);
  const [isMonitoring, setIsMonitoring] = useState(false);

  // --- SEO State ---
  const [auditUrl, setAuditUrl] = useState('megamos.com');
  const [seoData, setSeoData] = useState<any>(null);
  const [isAuditing, setIsAuditing] = useState(false);

  // --- Content State ---
  const [textContent, setTextContent] = useState('');
  const [rewriteMode, setRewriteMode] = useState('Professional');
  const [isRewriting, setIsRewriting] = useState(false);

  // --- Social State ---
  const [posts, setPosts] = useState([
      { id: 1, platform: 'Twitter', content: 'Launching Neural Bridge v2 today! 🚀 #OpenSource', time: '10:00 AM', status: 'Scheduled' },
      { id: 2, platform: 'LinkedIn', content: 'Excited to announce our Series A funding simulation.', time: '2:00 PM', status: 'Draft' }
  ]);

  // --- Integrations State ---
  const [connectors, setConnectors] = useState<ToolConnector[]>([
      { id: 'ga4', name: 'Google Analytics 4', category: 'ANALYTICS', icon: BarChart3, status: 'CONNECTED', method: 'OAUTH', description: 'Track website traffic and user behavior.', color: 'text-orange-500' },
      { id: 'alerts', name: 'Google Alerts', category: 'ANALYTICS', icon: AlertCircle, status: 'DISCONNECTED', method: 'API_KEY', description: 'Monitor web for new content.', color: 'text-blue-500' },
      { id: 'buzzsumo', name: 'BuzzSumo', category: 'CONTENT', icon: Search, status: 'DISCONNECTED', method: 'API_KEY', description: 'Analyze what content performs best.', color: 'text-indigo-500' },
      { id: 'grammarly', name: 'Grammarly', category: 'CONTENT', icon: CheckCircle2, status: 'CONNECTED', method: 'OAUTH', description: 'AI writing assistance.', color: 'text-green-500' },
      { id: 'ahrefs', name: 'Ahrefs', category: 'SEO', icon: Globe, status: 'DISCONNECTED', method: 'API_KEY', description: 'SEO tools & resources.', color: 'text-blue-400' },
      { id: 'semrush', name: 'Semrush', category: 'SEO', icon: Target, status: 'DISCONNECTED', method: 'API_KEY', description: 'Online visibility management platform.', color: 'text-orange-400' },
      { id: 'canva', name: 'Canva', category: 'DESIGN', icon: Palette, status: 'DISCONNECTED', method: 'OAUTH', description: 'Design graphics for social media.', color: 'text-cyan-500' },
      { id: 'hootsuite', name: 'Hootsuite', category: 'SOCIAL', icon: Share2, status: 'CONNECTED', method: 'OAUTH', description: 'Social media management dashboard.', color: 'text-blue-600' },
      { id: 'jasper', name: 'Jasper AI', category: 'CONTENT', icon: Zap, status: 'DISCONNECTED', method: 'API_KEY', description: 'Generative AI content creation.', color: 'text-purple-500' },
  ]);

  const [connectingTool, setConnectingTool] = useState<ToolConnector | null>(null);
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const handleMonitor = async () => {
      setIsMonitoring(true);
      const data = await monitorMediaMentions(monitorKeyword);
      setMentions(data);
      setIsMonitoring(false);
  };

  const handleAudit = async () => {
      setIsAuditing(true);
      const data = await performSEOAudit(auditUrl);
      setSeoData(data);
      setIsAuditing(false);
  };

  const handleRewrite = async () => {
      if (!textContent) return;
      setIsRewriting(true);
      const res = await paraphraseContent(textContent, rewriteMode);
      setTextContent(res);
      setIsRewriting(false);
  };

  const initiateConnection = (tool: ToolConnector) => {
      if (tool.status === 'CONNECTED') {
          // Disconnect logic
          if (confirm(`Disconnect ${tool.name}?`)) {
              setConnectors(prev => prev.map(c => c.id === tool.id ? { ...c, status: 'DISCONNECTED' } : c));
          }
          return;
      }
      setConnectingTool(tool);
      setApiKeyInput('');
  };

  const confirmConnection = () => {
      if (!connectingTool) return;
      setIsAuthenticating(true);
      
      // Simulate API handshake
      setTimeout(() => {
          setConnectors(prev => prev.map(c => c.id === connectingTool.id ? { ...c, status: 'CONNECTED' } : c));
          setIsAuthenticating(false);
          setConnectingTool(null);
      }, 1500);
  };

  return (
    <div className="h-full flex flex-col bg-[#0f172a] text-slate-200 font-sans selection:bg-pink-500 selection:text-white relative">
      
      {/* Auth Modal */}
      {connectingTool && (
          <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center animate-in fade-in duration-200">
              <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 w-full max-w-md shadow-2xl relative">
                  <button onClick={() => setConnectingTool(null)} className="absolute top-4 right-4 text-slate-500 hover:text-white"><X size={20}/></button>
                  
                  <div className="flex flex-col items-center mb-6">
                      <div className={`p-4 rounded-full bg-slate-800 mb-4 ${connectingTool.color}`}>
                          <connectingTool.icon size={32}/>
                      </div>
                      <h3 className="text-xl font-bold text-white">Connect {connectingTool.name}</h3>
                      <p className="text-sm text-slate-400 mt-1">
                          {connectingTool.method === 'OAUTH' ? 'Authenticate via Secure OAuth 2.0' : 'Enter API Credentials'}
                      </p>
                  </div>

                  <div className="space-y-4">
                      {connectingTool.method === 'API_KEY' ? (
                          <div>
                              <label className="text-xs font-bold text-slate-500 uppercase block mb-2">API Key / Token</label>
                              <div className="relative">
                                  <Key size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"/>
                                  <input 
                                    type="password" 
                                    className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-10 pr-4 py-3 text-sm text-white focus:border-pink-500 outline-none"
                                    placeholder={`Enter ${connectingTool.name} API Key`}
                                    value={apiKeyInput}
                                    onChange={e => setApiKeyInput(e.target.value)}
                                  />
                              </div>
                              <p className="text-[10px] text-slate-500 mt-2 flex items-center gap-1"><Lock size={10}/> Credentials are encrypted using Neural Shield.</p>
                          </div>
                      ) : (
                          <div className="bg-slate-800 p-4 rounded-lg text-center border border-slate-700">
                              <p className="text-sm text-slate-300 mb-4">You will be redirected to {connectingTool.name} to authorize access.</p>
                              <div className="flex justify-center gap-2 mb-2">
                                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                                  <span className="text-xs font-bold text-green-400">Gateway Ready</span>
                              </div>
                          </div>
                      )}

                      <button 
                        onClick={confirmConnection}
                        disabled={isAuthenticating || (connectingTool.method === 'API_KEY' && !apiKeyInput)}
                        className="w-full py-3 bg-pink-600 hover:bg-pink-500 text-white rounded-lg font-bold flex items-center justify-center gap-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                          {isAuthenticating ? <Loader2 className="animate-spin" size={18}/> : <Plug size={18}/>}
                          {isAuthenticating ? 'Verifying...' : connectingTool.method === 'OAUTH' ? 'Authorize Access' : 'Connect API'}
                      </button>
                  </div>
              </div>
          </div>
      )}

      {/* Header */}
      <div className="border-b border-slate-800 bg-slate-900/50 p-6 flex justify-between items-center">
          <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-pink-500 to-rose-600 rounded-xl shadow-lg shadow-pink-900/20">
                  <Megaphone size={24} className="text-white"/>
              </div>
              <div>
                  <h1 className="text-xl font-bold text-white">Megam Marketing Suite</h1>
                  <p className="text-slate-400 text-xs">All-in-One Automation: PR, SEO, Content & Social</p>
              </div>
          </div>
          <div className="flex bg-slate-800 rounded-lg p-1 border border-slate-700">
              {[
                  { id: 'DASHBOARD', label: 'Overview', icon: LayoutDashboard },
                  { id: 'INTEGRATIONS', label: 'Integrations', icon: Plug },
                  { id: 'PR_MEDIA', label: 'PR & Media', icon: Newspaper },
                  { id: 'SEO', label: 'SEO Tools', icon: Search },
                  { id: 'CONTENT', label: 'Content Studio', icon: PenTool },
                  { id: 'SOCIAL', label: 'Social Grid', icon: Share2 }
              ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-md text-xs font-bold transition ${activeTab === tab.id ? 'bg-pink-600 text-white shadow' : 'text-slate-400 hover:text-white hover:bg-slate-700'}`}
                  >
                      <tab.icon size={14} /> {tab.label}
                  </button>
              ))}
          </div>
      </div>

      <div className="flex-1 overflow-y-auto p-8 bg-slate-950/50">
          
          {activeTab === 'DASHBOARD' && (
              <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-300">
                  {/* KPI Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                          <div className="text-xs font-bold text-slate-500 uppercase mb-2">Total Impressions</div>
                          <div className="text-3xl font-bold text-white mb-1">2.4M</div>
                          <div className="text-green-400 text-xs flex items-center gap-1"><TrendingUp size={12}/> +12% vs last week</div>
                      </div>
                      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                          <div className="text-xs font-bold text-slate-500 uppercase mb-2">Brand Mentions</div>
                          <div className="text-3xl font-bold text-white mb-1">843</div>
                          <div className="text-green-400 text-xs flex items-center gap-1"><TrendingUp size={12}/> High Sentiment</div>
                      </div>
                      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                          <div className="text-xs font-bold text-slate-500 uppercase mb-2">SEO Health</div>
                          <div className="text-3xl font-bold text-white mb-1">92/100</div>
                          <div className="text-blue-400 text-xs">0 Critical Errors</div>
                      </div>
                      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                          <div className="text-xs font-bold text-slate-500 uppercase mb-2">Content Output</div>
                          <div className="text-3xl font-bold text-white mb-1">45</div>
                          <div className="text-purple-400 text-xs">Posts this month</div>
                      </div>
                  </div>

                  {/* Main Analytics Chart */}
                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 h-96">
                      <h3 className="font-bold text-white mb-6 flex items-center gap-2"><BarChart3 size={18} className="text-blue-400"/> Multi-Channel Performance</h3>
                      <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={[
                              {name: 'Mon', organic: 4000, social: 2400, direct: 2400},
                              {name: 'Tue', organic: 3000, social: 1398, direct: 2210},
                              {name: 'Wed', organic: 2000, social: 9800, direct: 2290},
                              {name: 'Thu', organic: 2780, social: 3908, direct: 2000},
                              {name: 'Fri', organic: 1890, social: 4800, direct: 2181},
                              {name: 'Sat', organic: 2390, social: 3800, direct: 2500},
                              {name: 'Sun', organic: 3490, social: 4300, direct: 2100},
                          ]}>
                              <defs>
                                  <linearGradient id="colorOrg" x1="0" y1="0" x2="0" y2="1">
                                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                  </linearGradient>
                                  <linearGradient id="colorSoc" x1="0" y1="0" x2="0" y2="1">
                                      <stop offset="5%" stopColor="#ec4899" stopOpacity={0.8}/>
                                      <stop offset="95%" stopColor="#ec4899" stopOpacity={0}/>
                                  </linearGradient>
                              </defs>
                              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                              <XAxis dataKey="name" stroke="#64748b" fontSize={10} />
                              <YAxis stroke="#64748b" fontSize={10} />
                              <Tooltip contentStyle={{backgroundColor: '#0f172a', borderColor: '#334155'}} />
                              <Area type="monotone" dataKey="organic" stroke="#3b82f6" fillOpacity={1} fill="url(#colorOrg)" />
                              <Area type="monotone" dataKey="social" stroke="#ec4899" fillOpacity={1} fill="url(#colorSoc)" />
                          </AreaChart>
                      </ResponsiveContainer>
                  </div>
              </div>
          )}

          {activeTab === 'INTEGRATIONS' && (
              <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-300">
                  <div className="flex justify-between items-center">
                      <div>
                          <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2"><Plug size={24} className="text-pink-500"/> Integration Hub</h2>
                          <p className="text-slate-400">Connect third-party tools via API or OAuth to supercharge your marketing stack.</p>
                      </div>
                      <div className="flex gap-2">
                          <span className="px-3 py-1 bg-slate-900 border border-slate-700 rounded-full text-xs text-slate-400 flex items-center gap-2">
                              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div> Secure Gateway Active
                          </span>
                      </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {connectors.map(tool => (
                          <div key={tool.id} className={`bg-slate-900 border ${tool.status === 'CONNECTED' ? 'border-green-500/30' : 'border-slate-800'} rounded-xl p-6 hover:border-slate-600 transition group relative overflow-hidden`}>
                              {tool.status === 'CONNECTED' && <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-green-500/10 to-transparent pointer-events-none"></div>}
                              
                              <div className="flex justify-between items-start mb-4">
                                  <div className={`p-3 rounded-xl bg-slate-950 border border-slate-800 ${tool.color}`}>
                                      <tool.icon size={24}/>
                                  </div>
                                  <span className={`text-[10px] font-bold px-2 py-1 rounded border uppercase ${tool.status === 'CONNECTED' ? 'bg-green-900/20 text-green-400 border-green-500/30' : 'bg-slate-800 text-slate-500 border-slate-700'}`}>
                                      {tool.status}
                                  </span>
                              </div>
                              
                              <h3 className="font-bold text-white text-lg mb-1">{tool.name}</h3>
                              <p className="text-xs text-slate-400 mb-4 h-8">{tool.description}</p>
                              
                              <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                                  <div className="flex flex-col">
                                      <span className="text-[10px] font-bold text-slate-500 uppercase">Method</span>
                                      <span className="text-xs text-slate-300 font-mono">{tool.method.replace('_', ' ')}</span>
                                  </div>
                                  <button 
                                    onClick={() => initiateConnection(tool)}
                                    className={`px-4 py-2 rounded-lg text-xs font-bold transition border ${tool.status === 'CONNECTED' ? 'bg-slate-800 border-slate-700 text-slate-400 hover:text-red-400 hover:border-red-500/30' : 'bg-pink-600 border-pink-500 text-white hover:bg-pink-500'}`}
                                  >
                                      {tool.status === 'CONNECTED' ? 'Manage' : 'Connect'}
                                  </button>
                              </div>
                          </div>
                      ))}
                  </div>
              </div>
          )}

          {activeTab === 'PR_MEDIA' && (
              <div className="h-full flex gap-8">
                  <div className="w-80 bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col h-full">
                      <h3 className="font-bold text-white mb-4 flex items-center gap-2"><Globe size={18} className="text-green-400"/> Media Monitor</h3>
                      <div className="space-y-4 mb-6">
                          <div>
                              <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Track Keyword</label>
                              <input 
                                value={monitorKeyword}
                                onChange={(e) => setMonitorKeyword(e.target.value)}
                                className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-sm text-white"
                              />
                          </div>
                          <button 
                            onClick={handleMonitor}
                            disabled={isMonitoring}
                            className="w-full py-2 bg-green-600 hover:bg-green-500 text-white rounded font-bold text-xs flex items-center justify-center gap-2"
                          >
                              {isMonitoring ? <RefreshCw className="animate-spin" size={14}/> : <Zap size={14}/>}
                              Start Listening
                          </button>
                      </div>
                      
                      <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-800">
                          <h4 className="text-xs font-bold text-slate-400 mb-2">Sentiment Analysis</h4>
                          <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs w-12">Pos</span>
                              <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden"><div className="h-full bg-green-500 w-[65%]"></div></div>
                          </div>
                          <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs w-12">Neu</span>
                              <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden"><div className="h-full bg-blue-500 w-[20%]"></div></div>
                          </div>
                          <div className="flex items-center gap-2">
                              <span className="text-xs w-12">Neg</span>
                              <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden"><div className="h-full bg-red-500 w-[15%]"></div></div>
                          </div>
                      </div>
                  </div>

                  <div className="flex-1 bg-slate-900 border border-slate-800 rounded-xl p-6 overflow-y-auto">
                      <h3 className="font-bold text-white mb-6">Live Mention Feed</h3>
                      <div className="space-y-4">
                          {mentions.length > 0 ? mentions.map((m, i) => (
                              <div key={i} className="p-4 bg-slate-950 border border-slate-800 rounded-lg hover:border-green-500/30 transition group">
                                  <div className="flex justify-between items-start mb-2">
                                      <span className="text-xs font-bold text-slate-500 uppercase bg-slate-900 px-2 py-1 rounded border border-slate-800">{m.source}</span>
                                      <span className="text-xs text-slate-500">{m.time}</span>
                                  </div>
                                  <h4 className="font-bold text-white text-lg mb-2 group-hover:text-green-400 transition">{m.title}</h4>
                                  <div className="flex gap-2">
                                      <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${m.sentiment === 'Positive' ? 'bg-green-900/20 text-green-400' : 'bg-slate-800 text-slate-400'}`}>
                                          {m.sentiment}
                                      </span>
                                  </div>
                              </div>
                          )) : (
                              <div className="text-center text-slate-600 py-10">
                                  <Newspaper size={48} className="mx-auto mb-4 opacity-20"/>
                                  <p>No mentions found. Start listening to simulate feed.</p>
                              </div>
                          )}
                      </div>
                  </div>
              </div>
          )}

          {activeTab === 'SEO' && (
              <div className="h-full p-8 max-w-5xl mx-auto">
                  <div className="flex gap-4 mb-8">
                      <div className="flex-1 relative">
                          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20}/>
                          <input 
                            value={auditUrl}
                            onChange={(e) => setAuditUrl(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-12 pr-4 py-4 text-white text-lg outline-none focus:border-blue-500"
                            placeholder="Enter domain to audit..."
                          />
                      </div>
                      <button 
                        onClick={handleAudit}
                        disabled={isAuditing}
                        className="bg-blue-600 hover:bg-blue-500 text-white px-8 rounded-xl font-bold transition flex items-center gap-2 disabled:opacity-50"
                      >
                          {isAuditing ? <RefreshCw className="animate-spin"/> : <Search/>} Audit
                      </button>
                  </div>

                  {seoData && (
                      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 text-center">
                                  <div className="text-slate-500 text-xs font-bold uppercase mb-2">Authority Score</div>
                                  <div className="text-4xl font-bold text-white">{seoData.domainAuthority}</div>
                              </div>
                              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 text-center">
                                  <div className="text-slate-500 text-xs font-bold uppercase mb-2">Backlinks</div>
                                  <div className="text-4xl font-bold text-blue-400">{seoData.backlinks.toLocaleString()}</div>
                              </div>
                              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 text-center">
                                  <div className="text-slate-500 text-xs font-bold uppercase mb-2">Organic Traffic</div>
                                  <div className="text-4xl font-bold text-green-400">{seoData.organicTraffic.toLocaleString()}</div>
                              </div>
                              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 text-center">
                                  <div className="text-slate-500 text-xs font-bold uppercase mb-2">Health</div>
                                  <div className="text-4xl font-bold text-purple-400">{seoData.healthScore}%</div>
                              </div>
                          </div>

                          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                              <h3 className="font-bold text-white mb-6">Top Keywords</h3>
                              <table className="w-full text-left text-sm">
                                  <thead className="bg-slate-950 text-slate-500 uppercase text-xs">
                                      <tr>
                                          <th className="p-3">Keyword</th>
                                          <th className="p-3">Position</th>
                                          <th className="p-3">Volume</th>
                                          <th className="p-3">KD %</th>
                                      </tr>
                                  </thead>
                                  <tbody className="divide-y divide-slate-800 text-slate-300">
                                      {seoData.keywords.map((k: any, i: number) => (
                                          <tr key={i} className="hover:bg-slate-800/30">
                                              <td className="p-3 font-bold text-white">{k.term}</td>
                                              <td className="p-3">{k.pos}</td>
                                              <td className="p-3">{k.vol}</td>
                                              <td className="p-3">
                                                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                                                      <div className="h-full bg-orange-500" style={{width: `${Math.random()*80 + 10}%`}}></div>
                                                  </div>
                                              </td>
                                          </tr>
                                      ))}
                                  </tbody>
                              </table>
                          </div>
                      </div>
                  )}
              </div>
          )}

          {activeTab === 'CONTENT' && (
              <div className="h-full flex gap-8">
                  <div className="flex-1 flex flex-col gap-6">
                      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
                          <div className="flex gap-2">
                              {['Standard', 'Professional', 'Creative', 'Academic', 'Simple'].map(mode => (
                                  <button 
                                    key={mode}
                                    onClick={() => setRewriteMode(mode)}
                                    className={`px-3 py-1.5 rounded text-xs font-bold transition ${rewriteMode === mode ? 'bg-purple-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
                                  >
                                      {mode}
                                  </button>
                              ))}
                          </div>
                          <button onClick={handleRewrite} disabled={isRewriting} className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded text-xs font-bold flex items-center gap-2">
                              {isRewriting ? <RefreshCw className="animate-spin" size={14}/> : <Zap size={14}/>} Rewrite
                          </button>
                      </div>
                      
                      <div className="flex-1 flex gap-4">
                          <div className="flex-1 bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col">
                              <div className="text-xs font-bold text-slate-500 uppercase mb-2">Input</div>
                              <textarea 
                                value={textContent}
                                onChange={e => setTextContent(e.target.value)}
                                className="flex-1 bg-transparent resize-none outline-none text-slate-300 text-sm leading-relaxed"
                                placeholder="Paste text here to rewrite, summarize, or check grammar..."
                              />
                          </div>
                      </div>
                  </div>
                  
                  <div className="w-72 bg-slate-900 border border-slate-800 rounded-xl p-6">
                      <h3 className="font-bold text-white mb-4 flex items-center gap-2"><Target size={18} className="text-yellow-400"/> Content Goals</h3>
                      <div className="space-y-4">
                          <div className="p-3 bg-slate-950 rounded border border-slate-800">
                              <div className="text-xs text-slate-500 mb-1">Readability</div>
                              <div className="text-lg font-bold text-green-400">High</div>
                          </div>
                          <div className="p-3 bg-slate-950 rounded border border-slate-800">
                              <div className="text-xs text-slate-500 mb-1">Tone</div>
                              <div className="text-lg font-bold text-purple-400">{rewriteMode}</div>
                          </div>
                          <div className="p-3 bg-slate-950 rounded border border-slate-800">
                              <div className="text-xs text-slate-500 mb-1">SEO Keywords</div>
                              <div className="flex flex-wrap gap-1 mt-1">
                                  <span className="px-2 py-0.5 bg-slate-800 rounded text-[10px] text-slate-300">cloud</span>
                                  <span className="px-2 py-0.5 bg-slate-800 rounded text-[10px] text-slate-300">ai</span>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          )}

          {activeTab === 'SOCIAL' && (
              <div className="h-full flex gap-8">
                  <div className="w-80 bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col">
                      <h3 className="font-bold text-white mb-6">Create Post</h3>
                      <div className="space-y-4 flex-1">
                          <textarea className="w-full h-32 bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm text-white resize-none outline-none" placeholder="What's happening?"/>
                          <div className="grid grid-cols-2 gap-2">
                              <button className="p-2 bg-slate-800 rounded hover:bg-slate-700 flex justify-center"><ImageIcon size={16} className="text-slate-400"/></button>
                              <button className="p-2 bg-slate-800 rounded hover:bg-slate-700 flex justify-center"><Video size={16} className="text-slate-400"/></button>
                              <button className="p-2 bg-slate-800 rounded hover:bg-slate-700 flex justify-center"><Mic size={16} className="text-slate-400"/></button>
                              <button className="p-2 bg-slate-800 rounded hover:bg-slate-700 flex justify-center"><Hash size={16} className="text-slate-400"/></button>
                          </div>
                          <button className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white rounded font-bold text-sm">Schedule</button>
                      </div>
                  </div>

                  <div className="flex-1 bg-slate-900 border border-slate-800 rounded-xl p-6">
                      <h3 className="font-bold text-white mb-6 flex items-center gap-2"><Calendar size={18} className="text-orange-400"/> Content Calendar</h3>
                      <div className="space-y-4">
                          {posts.map(post => (
                              <div key={post.id} className="flex gap-4 p-4 bg-slate-950 border border-slate-800 rounded-xl hover:border-slate-600 transition">
                                  <div className="flex flex-col items-center gap-2 min-w-[60px]">
                                      <span className="text-xs font-bold text-slate-500">{post.time}</span>
                                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold ${post.platform === 'Twitter' ? 'bg-blue-400' : 'bg-blue-700'}`}>
                                          {post.platform[0]}
                                      </div>
                                  </div>
                                  <div className="flex-1">
                                      <p className="text-sm text-slate-300 mb-2">{post.content}</p>
                                      <div className="flex gap-2">
                                          <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${post.status === 'Scheduled' ? 'bg-green-900/20 text-green-400' : 'bg-yellow-900/20 text-yellow-400'}`}>
                                              {post.status}
                                          </span>
                                      </div>
                                  </div>
                              </div>
                          ))}
                      </div>
                  </div>
              </div>
          )}

      </div>
    </div>
  );
};

export default MegamMarketing;
