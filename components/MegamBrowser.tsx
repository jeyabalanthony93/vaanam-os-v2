




import React, { useState, useEffect } from 'react';
import { Globe, Search, ArrowLeft, ArrowRight, RotateCw, Lock, Star, TrendingUp, BarChart, Server, CreditCard, Shield, Plus, X, Layout, Zap, Megaphone, Gauge, Layers, Info, BookOpen, Calendar, Users, Newspaper, Video, Mic, DollarSign, Activity, GitBranch, Bell } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, AreaChart, Area, LineChart, Line, Legend } from 'recharts';
import { simulateMarketTrends, performSearch, getAnalyticsData, getAdCampaigns, getSearchConsoleData, getResourcesData, getStockData, getLiveAlerts } from '../services/geminiService';

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

  // Alerts State
  const [alerts, setAlerts] = useState<any[]>([]);
  const [showAlerts, setShowAlerts] = useState(false);

  useEffect(() => {
      loadPage(url);
  }, [url]);

  // Alert Polling
  useEffect(() => {
      const interval = setInterval(async () => {
          const newAlerts = await getLiveAlerts();
          setAlerts(newAlerts);
      }, 5000);
      return () => clearInterval(interval);
  }, []);

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

      // ... other if/else blocks for pages (HOSTING, ADS, etc) remain same as previous file ...
      // Keeping Finance Logic for example
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

      // Default Home (if not any specific url)
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
        <div className="bg-white border-b border-slate-200 p-2 flex items-center gap-3 relative">
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

            <div className="flex gap-2 relative">
                 <button 
                    className="p-1.5 hover:bg-slate-100 rounded text-slate-600 relative" 
                    title="Live Alerts"
                    onClick={() => setShowAlerts(!showAlerts)}
                 >
                     <Bell size={18} className={alerts.length > 0 ? "text-red-500" : ""}/>
                     {alerts.length > 0 && <div className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>}
                 </button>
                 
                 {showAlerts && (
                     <div className="absolute top-10 right-0 w-80 bg-white shadow-2xl rounded-xl border border-slate-200 z-50 animate-in fade-in slide-in-from-top-2">
                         <div className="p-3 border-b border-slate-100 font-bold text-slate-700 flex justify-between items-center">
                             <span>Live Data Feeds</span>
                             <button onClick={() => setShowAlerts(false)}><X size={14} className="text-slate-400"/></button>
                         </div>
                         <div className="max-h-64 overflow-y-auto">
                             {alerts.map(alert => (
                                 <div key={alert.id} className="p-3 border-b border-slate-50 hover:bg-slate-50 transition">
                                     <div className="flex justify-between mb-1">
                                         <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded uppercase">{alert.type}</span>
                                         <span className="text-[10px] text-slate-400">{alert.time}</span>
                                     </div>
                                     <div className="text-sm text-slate-800 font-medium">{alert.msg}</div>
                                     <div className="text-[10px] text-slate-500 mt-1">Source: {alert.source}</div>
                                 </div>
                             ))}
                             {alerts.length === 0 && <div className="p-4 text-center text-slate-400 text-xs">No active alerts.</div>}
                         </div>
                     </div>
                 )}

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
