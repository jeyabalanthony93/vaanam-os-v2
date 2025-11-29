


import React, { useState, useEffect } from 'react';
import { Globe, Search, ArrowLeft, ArrowRight, RotateCw, Lock, Star, TrendingUp, BarChart, Server, CreditCard, Shield, Plus, X, Layout, Zap, Megaphone, Gauge, Layers, Info, BookOpen, Calendar, Users, Newspaper, Video, Mic, DollarSign, Activity, GitBranch } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, AreaChart, Area, LineChart, Line, Legend } from 'recharts';
import { simulateMarketTrends, performSearch, getAnalyticsData, getAdCampaigns, getSearchConsoleData, getResourcesData, getStockData } from '../services/geminiService';

interface Bookmark {
    id: string;
    title: string;
    url: string;
}

const MegamBrowser: React.FC = () => {
  const [url, setUrl] = useState('megam://market');
  const [inputValue, setInputValue] = useState('megam://market');
  const [tabs, setTabs] = useState([{ id: 't1', title: 'Market Pulse', url: 'megam://market' }]);
  const [activeTabId, setActiveTabId] = useState('t1');
  const [loading, setLoading] = useState(false);
  
  // Bookmarks State
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([
      { id: 'bm1', title: 'Market Pulse', url: 'megam://market' },
      { id: 'bm2', title: 'Megam Search', url: 'megam://search' },
      { id: 'bm3', title: 'Resources', url: 'megam://resources' },
  ]);
  
  // App Data States
  const [marketData, setMarketData] = useState<any>(null);
  const [searchResults, setSearchResults] = useState<any>(null);
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [adsData, setAdsData] = useState<any>(null);
  const [consoleData, setConsoleData] = useState<any>(null);
  const [resourcesData, setResourcesData] = useState<any>(null);
  const [financeData, setFinanceData] = useState<any>(null);
  const [stockSymbol, setStockSymbol] = useState('NVDA');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
      loadPage(url);
  }, [url]);

  const loadPage = async (pageUrl: string) => {
      setLoading(true);
      
      // Routing Logic
      if (pageUrl === 'megam://market' && !marketData) {
          const data = await simulateMarketTrends();
          setMarketData(data);
      } else if (pageUrl.startsWith('megam://search')) {
          const query = pageUrl.split('?q=')[1];
          if (query) {
              setSearchQuery(decodeURIComponent(query));
              const res = await performSearch(decodeURIComponent(query));
              setSearchResults(res);
          }
      } else if (pageUrl === 'megam://analytics' && !analyticsData) {
          const data = await getAnalyticsData();
          setAnalyticsData(data);
      } else if (pageUrl === 'megam://ads' && !adsData) {
          const data = await getAdCampaigns();
          setAdsData(data);
      } else if (pageUrl === 'megam://console' && !consoleData) {
          const data = await getSearchConsoleData();
          setConsoleData(data);
      } else if (pageUrl === 'megam://resources' && !resourcesData) {
          const data = await getResourcesData();
          setResourcesData(data);
      } else if (pageUrl === 'megam://finance') {
          // Default load or specific ticker if passed
          const data = await getStockData(stockSymbol);
          setFinanceData(data);
      }

      setTimeout(() => setLoading(false), 800);
  };

  const getTitle = (u: string) => {
      if (u.includes('market')) return 'Market Pulse';
      if (u.includes('hosting')) return 'Badal Hosting';
      if (u.includes('search')) return 'Megam Search';
      if (u.includes('ads')) return 'Megam Ads';
      if (u.includes('analytics')) return 'Analytics';
      if (u.includes('console')) return 'Webmaster';
      if (u.includes('resources')) return 'Resources & Events';
      if (u.includes('finance')) return 'Megam Finance';
      return 'New Tab';
  };

  const handleNavigate = (e: React.FormEvent) => {
      e.preventDefault();
      setUrl(inputValue);
      setTabs(prev => prev.map(t => t.id === activeTabId ? { ...t, url: inputValue, title: getTitle(inputValue) } : t));
  };

  const loadBookmark = (bmUrl: string) => {
      setUrl(bmUrl);
      setInputValue(bmUrl);
      setTabs(prev => prev.map(t => t.id === activeTabId ? { ...t, url: bmUrl, title: getTitle(bmUrl) } : t));
  };

  const openTab = (initialUrl = 'megam://search') => {
      const newId = Date.now().toString();
      const newTab = { id: newId, title: getTitle(initialUrl), url: initialUrl };
      setTabs([...tabs, newTab]);
      setActiveTabId(newId);
      setUrl(initialUrl);
      setInputValue(initialUrl);
  };

  const closeTab = (id: string, e: React.MouseEvent) => {
      e.stopPropagation();
      const newTabs = tabs.filter(t => t.id !== id);
      if (newTabs.length === 0) return; // Don't close last tab
      setTabs(newTabs);
      if (activeTabId === id) {
          setActiveTabId(newTabs[newTabs.length - 1].id);
          setUrl(newTabs[newTabs.length - 1].url);
          setInputValue(newTabs[newTabs.length - 1].url);
      }
  };

  const triggerSearch = () => {
      if (!searchQuery.trim()) return;
      const newUrl = `megam://search?q=${encodeURIComponent(searchQuery)}`;
      setInputValue(newUrl);
      setUrl(newUrl);
      setTabs(prev => prev.map(t => t.id === activeTabId ? { ...t, url: newUrl, title: `${searchQuery} - Search` } : t));
  };

  const handleStockSearch = async () => {
      setLoading(true);
      const data = await getStockData(stockSymbol);
      setFinanceData(data);
      setLoading(false);
  }

  const isBookmarked = bookmarks.some(b => b.url === url);

  const toggleBookmark = () => {
      if (isBookmarked) {
          setBookmarks(prev => prev.filter(b => b.url !== url));
      } else {
          setBookmarks(prev => [...prev, {
              id: Date.now().toString(),
              title: getTitle(url) || url,
              url: url
          }]);
      }
  };

  const renderContent = () => {
      if (loading) {
          return (
              <div className="h-full flex flex-col items-center justify-center bg-white text-slate-400">
                  <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
                  <p className="font-mono text-xs">Neural Rendering Engine Active...</p>
              </div>
          );
      }

      // --- 1. MARKET PULSE ---
      if (url === 'megam://market') {
          return (
              <div className="h-full overflow-y-auto bg-slate-50 p-8">
                  <div className="max-w-6xl mx-auto">
                      <div className="mb-8">
                          <h1 className="text-3xl font-bold text-slate-900 mb-2 flex items-center gap-2"><TrendingUp className="text-indigo-600"/> Search Market Analysis</h1>
                          <p className="text-slate-500">Real-time competitive intelligence dashboard powered by Badal AI.</p>
                      </div>

                      {marketData && (
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                                  <h3 className="font-bold text-slate-800 mb-4">Global Search Market Share</h3>
                                  <div className="h-64">
                                      <ResponsiveContainer width="100%" height="100%">
                                          <PieChart>
                                              <Pie 
                                                data={marketData.marketShare} 
                                                dataKey="share" 
                                                nameKey="name" 
                                                cx="50%" 
                                                cy="50%" 
                                                outerRadius={80} 
                                                label 
                                              >
                                                  {marketData.marketShare.map((entry: any, index: number) => (
                                                      <Cell key={`cell-${index}`} fill={['#4285F4', '#00A4EF', '#6366f1', '#de5833'][index % 4]} />
                                                  ))}
                                              </Pie>
                                              <Tooltip />
                                          </PieChart>
                                      </ResponsiveContainer>
                                  </div>
                                  <div className="flex justify-center gap-4 text-xs mt-4">
                                      {marketData.marketShare.map((entry: any, index: number) => (
                                          <div key={index} className="flex items-center gap-1">
                                              <div className="w-3 h-3 rounded-full" style={{backgroundColor: ['#4285F4', '#00A4EF', '#6366f1', '#de5833'][index % 4]}}></div>
                                              <span className="text-slate-600">{entry.name}</span>
                                          </div>
                                      ))}
                                  </div>
                              </div>

                              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                                  <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><Zap size={18} className="text-yellow-500"/> AI Predicted Trends</h3>
                                  <div className="space-y-3">
                                      {marketData.upcomingTrends.map((trend: string, i: number) => (
                                          <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100 hover:border-indigo-200 transition">
                                              <span className="text-sm font-medium text-slate-700">{trend}</span>
                                              <span className="text-xs font-bold text-green-600 flex items-center gap-1">
                                                  <TrendingUp size={12}/> +{Math.floor(Math.random() * 50 + 10)}%
                                              </span>
                                          </div>
                                      ))}
                                  </div>
                              </div>
                          </div>
                      )}
                      
                      <div className="bg-indigo-900 rounded-xl p-8 text-white flex justify-between items-center relative overflow-hidden">
                          <div className="relative z-10">
                              <h2 className="text-2xl font-bold mb-2">Megam Search API</h2>
                              <p className="text-indigo-200 mb-4 max-w-lg">Integrate our privacy-first, AI-powered search index into your applications. Free for open-source projects.</p>
                              <button className="bg-white text-indigo-900 px-6 py-2 rounded-lg font-bold hover:bg-indigo-50 transition">Get API Key</button>
                          </div>
                          <Globe size={200} className="absolute -right-10 -bottom-20 text-indigo-800 opacity-50"/>
                      </div>
                  </div>
              </div>
          );
      }

      // --- 2. HOSTING ---
      if (url === 'megam://hosting') {
          return (
              <div className="h-full overflow-y-auto bg-slate-900 text-white p-8">
                  <div className="max-w-5xl mx-auto text-center mb-12">
                      <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">Badal Domains & Hosting</h1>
                      <p className="text-slate-400 text-lg">Deploy your AI Agents and Apps on our Sovereign Cloud.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                      {[
                          { name: 'Developer', price: '$0', features: ['1 Domain', '10GB Badal Storage', 'Shared CPU', 'Community Support'], color: 'border-slate-700' },
                          { name: 'Pro Agent', price: '$29', features: ['5 Domains', '1TB Badal Storage', 'Virtual GPU Access', 'Priority Support'], color: 'border-indigo-500 bg-indigo-900/10' },
                          { name: 'Enterprise', price: 'Custom', features: ['Unlimited Domains', 'Petabyte Storage', 'Dedicated H100 Cluster', '24/7 SLA'], color: 'border-cyan-500' }
                      ].map((plan, i) => (
                          <div key={i} className={`p-8 rounded-2xl border-2 ${plan.color} flex flex-col items-center hover:scale-105 transition duration-300 bg-slate-950`}>
                              <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                              <div className="text-4xl font-bold mb-6">{plan.price}<span className="text-sm font-normal text-slate-500">/mo</span></div>
                              <ul className="space-y-4 mb-8 w-full">
                                  {plan.features.map((f, j) => (
                                      <li key={j} className="flex items-center gap-3 text-sm text-slate-300">
                                          <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center text-green-400"><Layout size={12}/></div>
                                          {f}
                                      </li>
                                  ))}
                              </ul>
                              <button className="w-full py-3 rounded-xl font-bold bg-white text-slate-900 hover:bg-slate-200 transition">Select Plan</button>
                          </div>
                      ))}
                  </div>
              </div>
          );
      }

      // --- 3. MEGAM ADS ---
      if (url === 'megam://ads') {
          return (
              <div className="h-full overflow-y-auto bg-slate-50 p-8">
                  <div className="max-w-6xl mx-auto">
                      <div className="flex justify-between items-center mb-8">
                          <div>
                              <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-2"><Megaphone className="text-orange-600"/> Megam Ads Studio</h1>
                              <p className="text-slate-500">Manage campaigns across the Megam Network.</p>
                          </div>
                          <button className="bg-orange-600 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-orange-700">
                              <Plus size={18}/> Create Campaign
                          </button>
                      </div>

                      {adsData && (
                          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                              <table className="w-full text-left">
                                  <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-bold">
                                      <tr>
                                          <th className="p-4">Campaign Name</th>
                                          <th className="p-4">Status</th>
                                          <th className="p-4">Budget</th>
                                          <th className="p-4">Spend</th>
                                          <th className="p-4">Clicks</th>
                                          <th className="p-4">ROI (Simulated)</th>
                                      </tr>
                                  </thead>
                                  <tbody className="divide-y divide-slate-100 text-sm">
                                      {adsData.map((c: any) => (
                                          <tr key={c.id} className="hover:bg-slate-50">
                                              <td className="p-4 font-bold text-slate-800">{c.name}</td>
                                              <td className="p-4">
                                                  <span className={`px-2 py-1 rounded text-xs font-bold ${c.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-slate-200 text-slate-600'}`}>
                                                      {c.status}
                                                  </span>
                                              </td>
                                              <td className="p-4">${c.budget}</td>
                                              <td className="p-4">${c.spend}</td>
                                              <td className="p-4">{c.clicks}</td>
                                              <td className="p-4 font-bold text-green-600">{c.roi}x</td>
                                          </tr>
                                      ))}
                                  </tbody>
                              </table>
                          </div>
                      )}
                  </div>
              </div>
          );
      }

      // --- 4. ANALYTICS ---
      if (url === 'megam://analytics') {
          return (
              <div className="h-full overflow-y-auto bg-slate-50 p-8">
                  <div className="max-w-6xl mx-auto">
                      <div className="mb-8">
                          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-2"><BarChart className="text-blue-600"/> Megam Analytics (MA4)</h1>
                          <p className="text-slate-500">Privacy-focused web traffic analysis.</p>
                      </div>

                      {analyticsData && (
                          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-96 mb-8">
                              <h3 className="font-bold text-slate-700 mb-4">Traffic Overview (7 Days)</h3>
                              <ResponsiveContainer width="100%" height="100%">
                                  <AreaChart data={analyticsData}>
                                      <defs>
                                          <linearGradient id="colorVis" x1="0" y1="0" x2="0" y2="1">
                                              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                                              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                          </linearGradient>
                                      </defs>
                                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                      <XAxis dataKey="name" stroke="#94a3b8" />
                                      <YAxis stroke="#94a3b8" />
                                      <Tooltip />
                                      <Area type="monotone" dataKey="visitors" stroke="#3b82f6" fillOpacity={1} fill="url(#colorVis)" />
                                  </AreaChart>
                              </ResponsiveContainer>
                          </div>
                      )}
                  </div>
              </div>
          );
      }

      // --- 5. SEARCH CONSOLE ---
      if (url === 'megam://console') {
          return (
              <div className="h-full overflow-y-auto bg-slate-50 p-8">
                  <div className="max-w-6xl mx-auto">
                      <div className="mb-8">
                          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-2"><Gauge className="text-green-600"/> Webmaster Console</h1>
                          <p className="text-slate-500">Manage indexing and search performance.</p>
                      </div>

                      {consoleData && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                                  <h3 className="font-bold text-slate-700 mb-4">Index Coverage</h3>
                                  <div className="space-y-4">
                                      <div className="flex justify-between items-center p-3 bg-green-50 rounded border border-green-100">
                                          <span className="text-green-700 font-bold">Valid Pages</span>
                                          <span className="text-2xl font-bold text-green-800">{consoleData.indexing.valid}</span>
                                      </div>
                                      <div className="flex justify-between items-center p-3 bg-yellow-50 rounded border border-yellow-100">
                                          <span className="text-yellow-700 font-bold">Excluded</span>
                                          <span className="text-2xl font-bold text-yellow-800">{consoleData.indexing.excluded}</span>
                                      </div>
                                      <div className="flex justify-between items-center p-3 bg-red-50 rounded border border-red-100">
                                          <span className="text-red-700 font-bold">Errors</span>
                                          <span className="text-2xl font-bold text-red-800">{consoleData.indexing.error}</span>
                                      </div>
                                  </div>
                              </div>

                              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                                  <h3 className="font-bold text-slate-700 mb-4">Top Performance Queries</h3>
                                  <table className="w-full text-sm">
                                      <thead className="text-slate-500 border-b border-slate-100">
                                          <tr>
                                              <th className="text-left pb-2">Query</th>
                                              <th className="text-right pb-2">Clicks</th>
                                              <th className="text-right pb-2">Impressions</th>
                                          </tr>
                                      </thead>
                                      <tbody>
                                          {consoleData.queries.map((q: any, i: number) => (
                                              <tr key={i} className="border-b border-slate-50 last:border-0">
                                                  <td className="py-2 text-slate-700">{q.query}</td>
                                                  <td className="py-2 text-right font-mono">{q.clicks}</td>
                                                  <td className="py-2 text-right font-mono text-slate-500">{q.imp}</td>
                                              </tr>
                                          ))}
                                      </tbody>
                                  </table>
                              </div>
                          </div>
                      )}
                  </div>
              </div>
          );
      }

      // --- 6. RESOURCES & CONTENT ---
      if (url === 'megam://resources') {
          return (
              <div className="h-full overflow-y-auto bg-slate-50 p-8">
                  <div className="max-w-6xl mx-auto">
                      <div className="mb-12 text-center">
                          <h1 className="text-4xl font-bold text-slate-900 mb-4 flex items-center justify-center gap-3">
                              <BookOpen className="text-pink-600" size={40}/> Megam Resources
                          </h1>
                          <p className="text-xl text-slate-500">Blogs, Bootcamps, and Events to supercharge your build.</p>
                      </div>

                      {resourcesData ? (
                          <div className="space-y-12">
                              {/* Blogs & Newsletters */}
                              <section>
                                  <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2"><Newspaper size={24}/> Latest Updates</h2>
                                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                      {resourcesData.blogs.map((b: any) => (
                                          <div key={b.id} className="bg-white p-6 rounded-xl border border-slate-200 hover:border-pink-500/50 transition shadow-sm cursor-pointer group">
                                              <span className="text-xs font-bold text-pink-600 uppercase tracking-wider">Blog</span>
                                              <h3 className="font-bold text-lg mt-2 mb-2 group-hover:text-pink-600 transition">{b.title}</h3>
                                              <p className="text-sm text-slate-500 mb-4 line-clamp-2">{b.snippet}</p>
                                              <div className="flex justify-between items-center text-xs text-slate-400">
                                                  <span>{b.author}</span>
                                                  <span>{b.date}</span>
                                              </div>
                                          </div>
                                      ))}
                                      {resourcesData.newsletters.map((n: any) => (
                                          <div key={n.id} className="bg-gradient-to-br from-indigo-50 to-white p-6 rounded-xl border border-indigo-100 hover:border-indigo-300 transition shadow-sm cursor-pointer">
                                              <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Newsletter</span>
                                              <h3 className="font-bold text-lg mt-2 mb-2">{n.title}</h3>
                                              <p className="text-sm text-slate-600 mb-4">{n.desc}</p>
                                              <button className="text-xs font-bold bg-indigo-600 text-white px-3 py-1.5 rounded-full">Subscribe ({n.subs})</button>
                                          </div>
                                      ))}
                                  </div>
                              </section>

                              {/* Bootcamps & Webinars */}
                              <section>
                                  <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2"><Video size={24}/> Education & Events</h2>
                                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                      <div className="bg-slate-900 text-white p-8 rounded-xl relative overflow-hidden">
                                          <div className="relative z-10">
                                              <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><Zap size={20} className="text-yellow-400"/> Live Bootcamps</h3>
                                              <div className="space-y-4">
                                                  {resourcesData.bootcamps.map((b: any) => (
                                                      <div key={b.id} className="bg-white/10 p-4 rounded-lg backdrop-blur-sm border border-white/10 flex justify-between items-center">
                                                          <div>
                                                              <div className="font-bold">{b.title}</div>
                                                              <div className="text-xs text-slate-300">{b.duration} • {b.level}</div>
                                                          </div>
                                                          <button className="px-3 py-1 bg-white text-slate-900 text-xs font-bold rounded">{b.status}</button>
                                                      </div>
                                                  ))}
                                              </div>
                                          </div>
                                      </div>
                                      
                                      <div className="bg-white border border-slate-200 p-8 rounded-xl">
                                          <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><Mic size={20} className="text-purple-600"/> Upcoming Webinars</h3>
                                          <div className="space-y-4">
                                              {resourcesData.webinars.map((w: any) => (
                                                  <div key={w.id} className="flex gap-4 items-start pb-4 border-b border-slate-100 last:border-0 last:pb-0">
                                                      <div className="bg-purple-100 text-purple-700 p-2 rounded-lg">
                                                          <Calendar size={20}/>
                                                      </div>
                                                      <div>
                                                          <div className="font-bold text-slate-800">{w.title}</div>
                                                          <div className="text-sm text-slate-500">{w.time} • Speaker: {w.speaker}</div>
                                                      </div>
                                                  </div>
                                              ))}
                                          </div>
                                      </div>
                                  </div>
                              </section>

                              {/* Community & Meetups */}
                              <section>
                                  <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2"><Users size={24}/> Community Meetups</h2>
                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                      {resourcesData.meetups.map((m: any) => (
                                          <div key={m.id} className="bg-white border border-slate-200 p-6 rounded-xl text-center hover:shadow-md transition cursor-pointer">
                                              <div className="text-lg font-bold text-slate-900 mb-1">{m.city}</div>
                                              <div className="text-sm text-slate-500 mb-4">{m.venue} • {m.date}</div>
                                              <div className="text-xs font-bold text-blue-600 bg-blue-50 py-1 px-3 rounded-full inline-block">{m.members} Attending</div>
                                          </div>
                                      ))}
                                  </div>
                              </section>

                              {/* Press */}
                              <section className="bg-slate-100 rounded-xl p-8 border border-slate-200">
                                  <h2 className="text-xl font-bold text-slate-800 mb-4">Press Releases</h2>
                                  <div className="space-y-2">
                                      {resourcesData.press.map((p: any) => (
                                          <div key={p.id} className="flex justify-between items-center text-sm">
                                              <span className="font-medium text-slate-700 hover:text-indigo-600 cursor-pointer">{p.title}</span>
                                              <span className="text-slate-400 text-xs">{p.source} • {p.date}</span>
                                          </div>
                                      ))}
                                  </div>
                              </section>
                          </div>
                      ) : (
                          <div className="text-center py-20">
                              <div className="animate-spin w-8 h-8 border-4 border-pink-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                              <p className="text-slate-400">Loading resources...</p>
                          </div>
                      )}
                  </div>
              </div>
          );
      }

      // --- 7. FINANCE & STOCKS (Alpha Vantage Sim) ---
      if (url === 'megam://finance') {
          return (
              <div className="h-full overflow-hidden bg-[#0f172a] text-slate-200 flex flex-col">
                  {/* Header */}
                  <div className="p-4 border-b border-slate-800 bg-slate-900 flex justify-between items-center shrink-0">
                      <div className="flex items-center gap-4">
                          <h1 className="text-xl font-bold text-white flex items-center gap-2">
                              <Activity className="text-emerald-500"/> Megam Finance
                          </h1>
                          <div className="flex items-center bg-black border border-slate-700 rounded-md px-3 py-1.5">
                              <Search size={14} className="text-slate-500 mr-2"/>
                              <input 
                                value={stockSymbol}
                                onChange={(e) => setStockSymbol(e.target.value.toUpperCase())}
                                onKeyDown={(e) => e.key === 'Enter' && handleStockSearch()}
                                className="bg-transparent border-none outline-none text-white font-mono text-sm w-24"
                                placeholder="TICKER"
                              />
                          </div>
                          <button onClick={handleStockSearch} className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded font-bold text-xs">GO</button>
                      </div>
                      <div className="flex items-center gap-4 text-xs font-mono text-emerald-400">
                          <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div> MARKET OPEN</span>
                          <span>NAS: 14,203.50</span>
                          <span>SPX: 4,560.20</span>
                      </div>
                  </div>

                  {financeData ? (
                      <div className="flex-1 flex overflow-hidden">
                          {/* Left: Charts & Analysis */}
                          <div className="flex-1 flex flex-col p-4 gap-4 overflow-y-auto">
                              {/* Ticker Header */}
                              <div className="flex justify-between items-end pb-4 border-b border-slate-800">
                                  <div>
                                      <h2 className="text-4xl font-bold text-white">{financeData.symbol}</h2>
                                      <div className="flex items-center gap-4 mt-1">
                                          <span className="text-2xl font-mono">${financeData.price}</span>
                                          <span className={`text-sm font-bold px-2 py-0.5 rounded ${parseFloat(financeData.change) >= 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                                              {parseFloat(financeData.change) >= 0 ? '+' : ''}{financeData.change}%
                                          </span>
                                      </div>
                                  </div>
                                  <div className="text-right text-xs text-slate-400 space-y-1 font-mono">
                                      <div>Mkt Cap: {financeData.marketCap}</div>
                                      <div>P/E Ratio: {financeData.peRatio}</div>
                                  </div>
                              </div>

                              {/* Chart */}
                              <div className="h-80 bg-slate-900 border border-slate-800 rounded-xl p-4 relative">
                                  <h3 className="text-xs font-bold text-slate-500 absolute top-4 left-4">PRICE & SMA TRENDS</h3>
                                  <ResponsiveContainer width="100%" height="100%">
                                      <LineChart data={financeData.history}>
                                          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                                          <XAxis dataKey="date" stroke="#475569" fontSize={10} minTickGap={30} />
                                          <YAxis stroke="#475569" domain={['auto', 'auto']} fontSize={10} />
                                          <Tooltip contentStyle={{backgroundColor: '#0f172a', borderColor: '#334155'}} />
                                          <Legend />
                                          <Line type="monotone" dataKey="price" stroke="#10b981" strokeWidth={2} dot={false} />
                                          <Line type="monotone" dataKey="sma50" stroke="#3b82f6" strokeWidth={1} dot={false} strokeDasharray="5 5" />
                                          <Line type="monotone" dataKey="sma200" stroke="#f59e0b" strokeWidth={1} dot={false} strokeDasharray="3 3" />
                                      </LineChart>
                                  </ResponsiveContainer>
                              </div>

                              {/* AI Forecast */}
                              <div className="bg-gradient-to-r from-indigo-900/40 to-purple-900/40 border border-indigo-500/30 rounded-xl p-6">
                                  <div className="flex justify-between items-start mb-4">
                                      <h3 className="text-lg font-bold text-white flex items-center gap-2"><Zap size={20} className="text-yellow-400"/> AI Predictive Forecast</h3>
                                      <div className={`px-3 py-1 rounded-full text-xs font-bold border ${financeData.aiForecast.direction === 'UP' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50' : 'bg-red-500/20 text-red-400 border-red-500/50'}`}>
                                          {financeData.aiForecast.direction} Trend ({financeData.aiForecast.probability}%)
                                      </div>
                                  </div>
                                  <p className="text-slate-300 text-sm leading-relaxed">{financeData.aiForecast.reasoning}</p>
                              </div>

                              {/* News Feed */}
                              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                                  <h3 className="text-sm font-bold text-slate-400 mb-4 uppercase">AI & IT News Sentiment</h3>
                                  <div className="space-y-3">
                                      {financeData.news.map((item: any, i: number) => (
                                          <div key={i} className="flex justify-between items-start p-3 bg-black/20 rounded border border-slate-800/50 hover:border-slate-700 transition">
                                              <div>
                                                  <div className="font-bold text-sm text-slate-200 mb-1">{item.title}</div>
                                                  <div className="text-xs text-slate-500">{item.source}</div>
                                              </div>
                                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${item.sentiment === 'Positive' ? 'text-emerald-400 bg-emerald-900/20' : item.sentiment === 'Negative' ? 'text-red-400 bg-red-900/20' : 'text-blue-400 bg-blue-900/20'}`}>
                                                  {item.sentiment}
                                              </span>
                                          </div>
                                      ))}
                                  </div>
                              </div>
                          </div>

                          {/* Right: Technical Panel */}
                          <div className="w-80 bg-slate-900 border-l border-slate-800 p-6 flex flex-col gap-6 overflow-y-auto">
                              <div>
                                  <h3 className="text-xs font-bold text-slate-500 uppercase mb-4">Technical Indicators</h3>
                                  <div className="space-y-4">
                                      <div className="flex justify-between items-center p-3 bg-black/30 rounded">
                                          <span className="text-sm font-bold text-slate-300">RSI (14)</span>
                                          <span className={`font-mono font-bold ${parseFloat(financeData.indicators.rsi) > 70 ? 'text-red-400' : parseFloat(financeData.indicators.rsi) < 30 ? 'text-emerald-400' : 'text-slate-200'}`}>
                                              {financeData.indicators.rsi}
                                          </span>
                                      </div>
                                      <div className="flex justify-between items-center p-3 bg-black/30 rounded">
                                          <span className="text-sm font-bold text-slate-300">MACD</span>
                                          <span className={`font-mono font-bold ${parseFloat(financeData.indicators.macd) > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                                              {financeData.indicators.macd}
                                          </span>
                                      </div>
                                      <div className="flex justify-between items-center p-3 bg-black/30 rounded">
                                          <span className="text-sm font-bold text-slate-300">SMA (50)</span>
                                          <span className="font-mono text-blue-400">{financeData.indicators.sma50}</span>
                                      </div>
                                      <div className="flex justify-between items-center p-3 bg-black/30 rounded">
                                          <span className="text-sm font-bold text-slate-300">SMA (200)</span>
                                          <span className="font-mono text-yellow-400">{financeData.indicators.sma200}</span>
                                      </div>
                                  </div>
                              </div>

                              <div>
                                  <h3 className="text-xs font-bold text-slate-500 uppercase mb-4">Pattern Recognition</h3>
                                  {financeData.patterns.length > 0 ? (
                                      <div className="space-y-2">
                                          {financeData.patterns.map((pat: any, i: number) => (
                                              <div key={i} className={`p-3 rounded border text-center ${pat.sentiment === 'BULLISH' ? 'bg-emerald-900/10 border-emerald-500/30 text-emerald-400' : 'bg-red-900/10 border-red-500/30 text-red-400'}`}>
                                                  <div className="font-bold text-sm">{pat.name}</div>
                                                  <div className="text-[10px] opacity-70">Confidence: {(pat.confidence * 100).toFixed(0)}%</div>
                                              </div>
                                          ))}
                                      </div>
                                  ) : (
                                      <div className="text-center text-slate-600 text-xs italic py-4 border border-dashed border-slate-800 rounded">
                                          No clear patterns detected
                                      </div>
                                  )}
                              </div>
                          </div>
                      </div>
                  ) : (
                      <div className="flex-1 flex flex-col items-center justify-center text-slate-500">
                          <Activity size={48} className="mb-4 opacity-20"/>
                          <p>Enter a stock symbol to view analysis.</p>
                      </div>
                  )}
              </div>
          );
      }

      // --- 8. SEARCH ENGINE (SERP) ---
      if (url.startsWith('megam://search')) {
          return (
              <div className="h-full flex flex-col bg-white">
                  {/* Search Header */}
                  <div className="flex items-center gap-6 p-4 border-b border-slate-200">
                      <div className="text-2xl font-bold text-indigo-600 flex items-center gap-1 cursor-pointer" onClick={() => { setUrl('megam://search'); setSearchQuery(''); setSearchResults(null); }}>
                          <Globe size={24}/> Megam
                      </div>
                      <div className="flex-1 max-w-2xl relative">
                          <input 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && triggerSearch()}
                            className="w-full pl-4 pr-12 py-2 rounded-full border border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition"
                            placeholder="Search..."
                          />
                          <button onClick={triggerSearch} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600">
                              <Search size={20}/>
                          </button>
                      </div>
                  </div>

                  <div className="flex-1 overflow-y-auto p-8">
                      {searchResults ? (
                          <div className="max-w-4xl mx-auto space-y-8">
                              {/* AI Overview */}
                              <div className="bg-gradient-to-br from-indigo-50 to-white border border-indigo-100 p-6 rounded-2xl shadow-sm">
                                  <div className="flex items-center gap-2 mb-3">
                                      <Zap size={20} className="text-indigo-600 fill-indigo-100"/>
                                      <h3 className="font-bold text-slate-800">Generative Overview</h3>
                                  </div>
                                  <p className="text-slate-700 leading-relaxed text-sm">
                                      {searchResults.aiOverview}
                                  </p>
                              </div>

                              <div className="flex gap-12">
                                  {/* Organic Results */}
                                  <div className="flex-1 space-y-8">
                                      {/* Resources Snippets (New) */}
                                      {searchResults.resources && searchResults.resources.length > 0 && (
                                          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                                              <h4 className="text-xs font-bold text-slate-500 uppercase mb-3 flex items-center gap-2">
                                                  <BookOpen size={14}/> From Megam Resources
                                              </h4>
                                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                  {searchResults.resources.map((res: any, i: number) => (
                                                      <div key={i} className="bg-white p-3 rounded border border-slate-100 hover:border-pink-300 transition cursor-pointer" onClick={() => openTab(res.url)}>
                                                          <div className="text-[10px] font-bold text-pink-600 mb-1">{res.type}</div>
                                                          <div className="font-medium text-slate-800 text-sm mb-1">{res.title}</div>
                                                          <div className="text-xs text-slate-400">{res.date}</div>
                                                      </div>
                                                  ))}
                                              </div>
                                          </div>
                                      )}

                                      {/* Ads */}
                                      {searchResults.ads && searchResults.ads.length > 0 && (
                                          <div className="space-y-4">
                                              {searchResults.ads.map((ad: any, i: number) => (
                                                  <div key={i} className="group">
                                                      <div className="flex items-center gap-2 mb-1">
                                                          <span className="font-bold text-slate-900 text-xs">Sponsored</span>
                                                          <span className="text-[10px] text-slate-500">· {ad.url}</span>
                                                      </div>
                                                      <div className="text-indigo-600 font-medium text-lg hover:underline cursor-pointer">{ad.title}</div>
                                                      <div className="text-slate-600 text-sm mt-1">{ad.desc}</div>
                                                  </div>
                                              ))}
                                          </div>
                                      )}

                                      {/* Organic */}
                                      {searchResults.organicResults.map((res: any, i: number) => (
                                          <div key={i} className="group">
                                              <div className="flex items-center gap-2 mb-1">
                                                  <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500">W</div>
                                                  <div className="text-xs text-slate-700">{res.url}</div>
                                              </div>
                                              <div className="text-blue-700 font-medium text-xl hover:underline cursor-pointer">{res.title}</div>
                                              <div className="text-slate-600 text-sm mt-1 leading-relaxed">{res.desc}</div>
                                          </div>
                                      ))}
                                  </div>

                                  {/* Knowledge Panel */}
                                  <div className="w-80 hidden lg:block">
                                      <div className="border border-slate-200 rounded-xl p-4 shadow-sm bg-white">
                                          <h3 className="font-bold text-slate-900 mb-2">Megam OS</h3>
                                          <div className="text-xs text-slate-500 mb-4">Operating System</div>
                                          <div className="text-sm text-slate-700 mb-4">
                                              Megam OS is an open-source, AI-native cloud operating system designed for infinite scalability and zero-cost LLM training via the Neural Bridge.
                                          </div>
                                          <div className="space-y-2 text-xs">
                                              <div className="flex justify-between border-b border-slate-100 pb-2">
                                                  <span className="font-bold text-slate-900">Developer</span>
                                                  <span className="text-slate-600">Badal Cloud Foundation</span>
                                              </div>
                                              <div className="flex justify-between border-b border-slate-100 pb-2">
                                                  <span className="font-bold text-slate-900">License</span>
                                                  <span className="text-slate-600">MIT / Apache 2.0</span>
                                              </div>
                                              <div className="flex justify-between">
                                                  <span className="font-bold text-slate-900">Written in</span>
                                                  <span className="text-slate-600">TypeScript, Rust, Python</span>
                                              </div>
                                          </div>
                                      </div>
                                  </div>
                              </div>
                          </div>
                      ) : (
                          // Empty State
                          <div className="h-full flex flex-col items-center justify-center opacity-50">
                              <Search size={64} className="mb-4 text-slate-300"/>
                              <p>Enter a search term to begin discovery.</p>
                          </div>
                      )}
                  </div>
              </div>
          );
      }

      // Default Home
      return (
          <div className="h-full flex flex-col items-center justify-center bg-white relative">
              {/* Digital Suite Links */}
              <div className="absolute top-4 right-4 flex gap-4">
                  <button onClick={() => openTab('megam://resources')} className="text-sm text-slate-600 hover:text-indigo-600 font-medium">Resources</button>
                  <button onClick={() => openTab('megam://finance')} className="text-sm text-slate-600 hover:text-indigo-600 font-medium">Finance</button>
                  <button onClick={() => openTab('megam://ads')} className="text-sm text-slate-600 hover:text-indigo-600 font-medium">Advertising</button>
                  <button onClick={() => openTab('megam://analytics')} className="text-sm text-slate-600 hover:text-indigo-600 font-medium">Analytics</button>
                  <button onClick={() => openTab('megam://console')} className="text-sm text-slate-600 hover:text-indigo-600 font-medium">Console</button>
                  <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">M</div>
              </div>

              <div className="flex flex-col items-center gap-6">
                  <div className="text-6xl font-bold text-slate-800 flex items-center gap-4">
                      <span className="text-indigo-600">Megam</span> Search
                  </div>
                  <div className="relative w-[600px]">
                      <input 
                        className="w-full p-4 pl-12 rounded-full border border-slate-300 shadow-sm focus:shadow-md focus:border-indigo-500 outline-none text-lg transition"
                        placeholder="Search the open web or enter URL..."
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && triggerSearch()}
                      />
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={24}/>
                  </div>
                  <div className="flex gap-4 mt-4">
                      <button onClick={() => openTab('megam://market')} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded text-slate-700 text-sm font-medium transition">Market Analysis</button>
                      <button onClick={() => openTab('megam://finance')} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded text-slate-700 text-sm font-medium transition">Stocks & AI News</button>
                  </div>
              </div>
          </div>
      );
  };

  return (
    <div className="h-full flex flex-col bg-slate-200 overflow-hidden rounded-lg shadow-2xl border border-slate-400">
        {/* Tab Bar */}
        <div className="bg-slate-200 px-2 pt-2 flex items-end gap-1 overflow-x-auto">
            {tabs.map(tab => (
                <div 
                    key={tab.id}
                    onClick={() => { setActiveTabId(tab.id); setUrl(tab.url); setInputValue(tab.url); }}
                    className={`group relative px-4 py-2 rounded-t-lg text-xs font-medium flex items-center gap-2 min-w-[120px] max-w-[200px] cursor-pointer transition-colors ${activeTabId === tab.id ? 'bg-white text-slate-800 shadow-sm' : 'bg-slate-300 text-slate-600 hover:bg-slate-100'}`}
                >
                    <Globe size={12} className={activeTabId === tab.id ? 'text-indigo-600' : 'text-slate-500'}/>
                    <span className="truncate flex-1">{tab.title}</span>
                    <button onClick={(e) => closeTab(tab.id, e)} className="opacity-0 group-hover:opacity-100 hover:bg-slate-200 rounded p-0.5"><X size={10}/></button>
                </div>
            ))}
            <button onClick={() => openTab()} className="p-2 hover:bg-slate-300 rounded-lg text-slate-600"><Plus size={16}/></button>
        </div>

        {/* Address Bar */}
        <div className="bg-white border-b border-slate-200 p-2 flex items-center gap-3">
            <div className="flex gap-1 text-slate-400">
                <button className="p-1.5 hover:bg-slate-100 rounded transition"><ArrowLeft size={16}/></button>
                <button className="p-1.5 hover:bg-slate-100 rounded transition"><ArrowRight size={16}/></button>
                <button onClick={() => loadPage(url)} className="p-1.5 hover:bg-slate-100 rounded transition"><RotateCw size={16}/></button>
            </div>
            
            <form onSubmit={handleNavigate} className="flex-1 relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-green-600">
                    <Lock size={12} />
                </div>
                <input 
                    className="w-full bg-slate-100 hover:bg-slate-50 focus:bg-white border border-transparent focus:border-indigo-500 rounded-full py-1.5 pl-8 pr-12 text-sm text-slate-700 outline-none transition"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-2">
                    <Star 
                        size={14} 
                        className={`transition cursor-pointer ${isBookmarked ? 'text-yellow-400 fill-yellow-400' : 'text-slate-400 hover:text-yellow-400'}`}
                        onClick={toggleBookmark}
                    />
                </div>
            </form>

            <div className="flex gap-2">
                 <button className="p-1.5 hover:bg-slate-100 rounded text-slate-600" title="Shield Core: Active"><Shield size={18} className="text-green-600"/></button>
                 <button onClick={() => openTab('megam://console')} className="p-1.5 hover:bg-slate-100 rounded text-slate-600"><Layout size={18}/></button>
                 <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs border border-indigo-200">
                     S
                 </div>
            </div>
        </div>

        {/* Bookmarks Bar */}
        <div className="bg-slate-50 border-b border-slate-200 px-3 py-1.5 flex items-center gap-2 overflow-x-auto min-h-[32px]">
            {bookmarks.map(bm => (
                <button
                    key={bm.id}
                    onClick={() => loadBookmark(bm.url)}
                    onContextMenu={(e) => {
                        e.preventDefault();
                        if(confirm(`Remove bookmark "${bm.title}"?`)) {
                            setBookmarks(prev => prev.filter(b => b.id !== bm.id));
                        }
                    }}
                    className="flex items-center gap-1.5 px-2 py-1 rounded-md hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition text-[10px] font-medium whitespace-nowrap group"
                    title={bm.url}
                >
                    <Globe size={10} className={bm.url.includes('megam') ? 'text-indigo-500' : 'text-slate-400'}/>
                    <span className="max-w-[120px] truncate">{bm.title}</span>
                </button>
            ))}
            {bookmarks.length === 0 && (
                <span className="text-[10px] text-slate-400 italic px-2">No bookmarks yet. Click the star to add one.</span>
            )}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden relative">
            {renderContent()}
        </div>
    </div>
  );
};

export default MegamBrowser;
