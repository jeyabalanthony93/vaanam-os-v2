
import React, { useState, useEffect, useRef } from 'react';
import { Smartphone, Battery, Wifi, Signal, Phone, MessageSquare, Camera, Chrome, Settings, MoreVertical, ChevronLeft, Mic, Video, User, PhoneCall, X, Aperture, Image as ImageIcon, Zap, Cloud, Cpu, HardDrive, Share2, Globe, Search, ArrowLeft, ArrowRight, RotateCw, Lock, Bell, Menu, Grid, Layers, Play, Pause, Music, MapPin, Mail, Calendar, Clock, Plus, Download, PlayCircle, SkipForward, SkipBack, ShoppingBag, Folder } from 'lucide-react';
import { simulateCloudCall, enhancePhotoNPU, getPhoneSystemStats, performSearch } from '../services/geminiService';

const WALLPAPER = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop";

const BadalPhone: React.FC = () => {
  const [systemState, setSystemState] = useState<'BOOT' | 'LOCKED' | 'HOME' | 'APP'>('LOCKED');
  const [activeApp, setActiveApp] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // Phone State
  const [callStatus, setCallStatus] = useState<'IDLE' | 'CALLING' | 'CONNECTED'>('IDLE');
  
  // Chat State
  const [messages, setMessages] = useState([
      { id: 1, sender: 'System', text: 'Welcome to BadalPhone X1. Your NPU is online.', time: '10:00 AM' }
  ]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const openApp = (appName: string) => {
      setActiveApp(appName);
      setSystemState('APP');
  };

  const goHome = () => {
      setSystemState('HOME');
      setActiveApp(null);
  };

  const goBack = () => {
      goHome(); // Simplified back nav
  };

  // --- SUB-APPS ---

  const MobileBrowser = () => {
      const [searchQ, setSearchQ] = useState('');
      const [loading, setLoading] = useState(false);
      const [pageContent, setPageContent] = useState<any>(null);

      const handleSearch = async (e: React.FormEvent) => {
          e.preventDefault();
          setLoading(true);
          const res = await performSearch(searchQ);
          setPageContent(res);
          setLoading(false);
      };

      return (
          <div className="h-full bg-white flex flex-col pt-12 pb-8">
              <div className="px-4 py-2 border-b border-slate-100 flex items-center gap-2 bg-slate-50">
                  <div className="flex-1 bg-white border border-slate-200 rounded-full h-10 flex items-center px-4 shadow-sm">
                      <Lock size={12} className="text-green-500 mr-2"/>
                      <form onSubmit={handleSearch} className="flex-1">
                          <input 
                            className="w-full text-xs outline-none text-slate-700" 
                            placeholder="Search or enter website"
                            value={searchQ}
                            onChange={e => setSearchQ(e.target.value)}
                          />
                      </form>
                  </div>
                  <button className="p-2 rounded-full hover:bg-slate-200"><RotateCw size={16} className="text-slate-500"/></button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 bg-slate-50">
                  {loading ? (
                      <div className="flex flex-col items-center justify-center h-full text-slate-400">
                          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                          <span className="text-xs">Loading via Neural Bridge...</span>
                      </div>
                  ) : pageContent ? (
                      <div className="space-y-4">
                          {pageContent.aiOverview && (
                              <div className="bg-gradient-to-br from-indigo-50 to-white p-4 rounded-xl border border-indigo-100 shadow-sm">
                                  <h3 className="font-bold text-indigo-900 text-sm mb-2 flex items-center gap-2"><Zap size={14}/> AI Summary</h3>
                                  <p className="text-xs text-slate-600 leading-relaxed">{pageContent.aiOverview}</p>
                              </div>
                          )}
                          {pageContent.organicResults?.map((res: any, i: number) => (
                              <div key={i} className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm">
                                  <div className="text-[10px] text-slate-400 mb-1 truncate">{res.url}</div>
                                  <div className="text-blue-600 font-medium text-sm mb-1">{res.title}</div>
                                  <div className="text-xs text-slate-500 line-clamp-2">{res.desc}</div>
                              </div>
                          ))}
                      </div>
                  ) : (
                      <div className="flex flex-col items-center justify-center h-full opacity-30">
                          <Globe size={48} className="mb-4"/>
                          <p className="text-xs">Megam Browser Mobile</p>
                      </div>
                  )}
              </div>
              <div className="h-12 border-t border-slate-200 flex justify-around items-center text-slate-500">
                  <ChevronLeft size={24} onClick={goBack}/>
                  <Plus size={24}/>
                  <Layers size={20}/>
              </div>
          </div>
      );
  };

  const DialerApp = () => {
      const [num, setNum] = useState('');
      const [log, setLog] = useState('');

      const handleCall = async () => {
          if(!num) return;
          setLog('Calling...');
          setCallStatus('CALLING');
          await new Promise(r => setTimeout(r, 1500));
          setLog('Connected (HD Voice)');
          setCallStatus('CONNECTED');
      };

      const handleEnd = () => {
          setLog('');
          setCallStatus('IDLE');
          setNum('');
      }

      return (
          <div className="h-full bg-white flex flex-col pt-12 pb-8">
              <div className="flex-1 flex flex-col justify-end pb-8 px-8">
                  <div className="text-center mb-8 h-16">
                      <div className="text-3xl font-bold text-slate-900">{num}</div>
                      <div className="text-sm text-green-500 mt-2 font-mono">{log}</div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 mb-8">
                      {[1,2,3,4,5,6,7,8,9,'*',0,'#'].map(n => (
                          <button 
                            key={n} 
                            onClick={() => setNum(prev => prev + n)}
                            className="aspect-square rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-2xl font-bold text-slate-800 transition active:bg-slate-300"
                          >
                              {n}
                          </button>
                      ))}
                  </div>

                  <div className="flex justify-center gap-6 items-center">
                      {callStatus === 'IDLE' ? (
                          <button onClick={handleCall} className="w-16 h-16 rounded-full bg-green-500 hover:bg-green-600 flex items-center justify-center text-white shadow-lg shadow-green-500/30 transition transform active:scale-95">
                              <Phone size={28} fill="currentColor"/>
                          </button>
                      ) : (
                          <button onClick={handleEnd} className="w-16 h-16 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center text-white shadow-lg shadow-red-500/30 transition transform active:scale-95">
                              <PhoneCall size={28} />
                          </button>
                      )}
                      {num && <button onClick={() => setNum(prev => prev.slice(0,-1))} className="p-4 text-slate-400"><X size={24}/></button>}
                  </div>
              </div>
              <div className="flex justify-around border-t border-slate-100 pt-4 text-slate-400 text-xs font-bold uppercase">
                  <button className="text-blue-600">Keypad</button>
                  <button>Recents</button>
                  <button>Contacts</button>
              </div>
          </div>
      )
  };

  const MailApp = () => (
      <div className="h-full bg-slate-50 flex flex-col pt-12 pb-8">
          <div className="px-4 py-2 flex justify-between items-center bg-white border-b border-slate-200">
              <div className="font-bold text-lg text-slate-800">Inbox</div>
              <button className="bg-blue-600 text-white p-1.5 rounded-full"><Plus size={16}/></button>
          </div>
          <div className="flex-1 overflow-y-auto">
              {[
                  { from: 'Cloud Admin', sub: 'Server Alert: CPU Load', time: '10:42 AM', read: false },
                  { from: 'Google Cloud', sub: 'Billing Invoice Available', time: 'Yesterday', read: true },
                  { from: 'GitLab', sub: 'Merge Request #402 Merged', time: 'Yesterday', read: true },
                  { from: 'Badal Support', sub: 'Welcome to Enterprise Tier', time: 'Mon', read: true },
                  { from: 'System', sub: 'Neural Bridge Optimized', time: 'Sun', read: true },
              ].map((mail, i) => (
                  <div key={i} className={`p-4 border-b border-slate-200 bg-white flex gap-3 ${!mail.read ? 'border-l-4 border-l-blue-500' : ''}`}>
                      <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 font-bold">
                          {mail.from[0]}
                      </div>
                      <div className="flex-1">
                          <div className="flex justify-between mb-1">
                              <span className={`text-sm ${!mail.read ? 'font-bold text-slate-900' : 'text-slate-700'}`}>{mail.from}</span>
                              <span className="text-xs text-slate-400">{mail.time}</span>
                          </div>
                          <div className="text-xs text-slate-600 truncate">{mail.sub}</div>
                          <div className="text-xs text-slate-400 mt-1 line-clamp-1">
                              This is a simulated email message stored in the local cache...
                          </div>
                      </div>
                  </div>
              ))}
          </div>
          <div className="h-12 bg-white border-t border-slate-200 flex justify-between items-center px-8 text-xs text-slate-500">
              <span className="font-bold text-blue-600">Primary</span>
              <span>Social</span>
              <span>Promotions</span>
          </div>
      </div>
  );

  const CameraApp = () => {
      const [npuActive, setNpuActive] = useState(true);
      return (
          <div className="h-full bg-black flex flex-col pt-12 pb-8 relative">
              <div className="absolute top-14 left-0 right-0 flex justify-between px-6 z-10">
                  <Settings size={20} className="text-white drop-shadow-md"/>
                  <button onClick={() => setNpuActive(!npuActive)} className={`flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold ${npuActive ? 'bg-yellow-500 text-black' : 'bg-white/20 text-white'}`}>
                      <Zap size={10} fill={npuActive ? "black" : "none"}/> NPU {npuActive ? 'ON' : 'OFF'}
                  </button>
              </div>
              <div className="flex-1 bg-slate-800 relative">
                  {/* Viewfinder Mock */}
                  <img src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1000&auto=format&fit=crop" className="w-full h-full object-cover opacity-80" alt="viewfinder"/>
                  {npuActive && (
                      <div className="absolute inset-0 border-2 border-yellow-500/50 m-8 rounded-lg flex items-center justify-center">
                          <div className="text-yellow-500 text-xs font-bold bg-black/50 px-2 rounded">SCENE: CYBERPUNK</div>
                      </div>
                  )}
              </div>
              <div className="h-32 bg-black flex flex-col justify-center items-center gap-4">
                  <div className="flex gap-6 text-xs font-bold text-slate-400 uppercase tracking-widest">
                      <span>Video</span>
                      <span className="text-yellow-500">Photo</span>
                      <span>Portrait</span>
                  </div>
                  <div className="flex items-center gap-8">
                      <div className="w-10 h-10 bg-slate-800 rounded-lg border border-slate-600"></div>
                      <button className="w-16 h-16 rounded-full border-4 border-white bg-white/20 flex items-center justify-center">
                          <div className="w-12 h-12 bg-white rounded-full"></div>
                      </button>
                      <button className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center text-white"><RotateCw size={16}/></button>
                  </div>
              </div>
          </div>
      )
  };

  const MapsApp = () => (
      <div className="h-full bg-slate-100 flex flex-col pt-12 pb-8">
          <div className="absolute top-14 left-4 right-4 z-10 bg-white rounded-lg shadow-md flex items-center px-4 h-10">
              <Search size={16} className="text-slate-400 mr-2"/>
              <input placeholder="Search here" className="flex-1 text-xs outline-none"/>
              <Mic size={16} className="text-slate-400 ml-2"/>
          </div>
          <div className="flex-1 relative bg-slate-200 overflow-hidden">
              <div className="absolute inset-0 bg-[url('https://upload.wikimedia.org/wikipedia/commons/e/ec/World_map_blank_without_borders.svg')] bg-cover opacity-20"></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg animate-pulse"></div>
                  <div className="w-16 h-16 bg-blue-500/20 rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-ping"></div>
              </div>
              <div className="absolute bottom-4 right-4 p-2 bg-white rounded-full shadow-lg">
                  <MapPin size={20} className="text-blue-600"/>
              </div>
          </div>
          <div className="h-16 bg-white border-t border-slate-200 px-4 py-2 flex justify-between items-center">
              <div>
                  <div className="text-xs font-bold text-slate-800">Explore Nearby</div>
                  <div className="text-[10px] text-slate-500">Restaurants, Gas, ATMs</div>
              </div>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-full text-xs font-bold flex items-center gap-1">
                  <ArrowRight size={12}/> Start
              </button>
          </div>
      </div>
  );

  const MusicApp = () => (
      <div className="h-full bg-gradient-to-b from-indigo-900 to-black text-white flex flex-col pt-12 pb-8">
          <div className="flex-1 p-8 flex flex-col items-center justify-center">
              <div className="w-64 h-64 bg-slate-800 rounded-lg shadow-2xl mb-8 relative overflow-hidden group">
                  <img src="https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1000&auto=format&fit=crop" className="w-full h-full object-cover opacity-80" alt="album"/>
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition">
                      <PlayCircle size={48}/>
                  </div>
              </div>
              <div className="text-center mb-2">
                  <h2 className="text-xl font-bold">Neural Beats Vol. 1</h2>
                  <p className="text-slate-400 text-sm">Badal AI Artist</p>
              </div>
          </div>
          <div className="px-8 pb-8">
              <div className="w-full h-1 bg-slate-700 rounded-full mb-2">
                  <div className="w-1/3 h-full bg-white rounded-full"></div>
              </div>
              <div className="flex justify-between text-[10px] text-slate-400 mb-6">
                  <span>1:12</span>
                  <span>3:45</span>
              </div>
              <div className="flex justify-between items-center">
                  <SkipBack size={24}/>
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-black">
                      <Pause size={24} fill="currentColor"/>
                  </div>
                  <SkipForward size={24}/>
              </div>
          </div>
      </div>
  );

  const FilesApp = () => (
      <div className="h-full bg-white flex flex-col pt-12 pb-8">
          <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
              <h2 className="font-bold text-lg text-slate-800">Files</h2>
              <Search size={18} className="text-slate-400"/>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
              <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                      <HardDrive className="text-blue-500 mb-2"/>
                      <div className="font-bold text-slate-700">Internal</div>
                      <div className="text-xs text-slate-500">24 GB Free</div>
                  </div>
                  <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100">
                      <Cloud className="text-indigo-500 mb-2"/>
                      <div className="font-bold text-slate-700">Badal Drive</div>
                      <div className="text-xs text-slate-500">Unlimited</div>
                  </div>
              </div>
              <h3 className="text-xs font-bold text-slate-500 uppercase mb-2">Recent</h3>
              <div className="space-y-2">
                  {['Document.pdf', 'Budget.xlsx', 'Photo.jpg', 'Song.mp3'].map((f, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                          <Folder size={18} className="text-slate-400"/>
                          <span className="text-sm font-medium text-slate-700 flex-1">{f}</span>
                          <MoreVertical size={14} className="text-slate-400"/>
                      </div>
                  ))}
              </div>
          </div>
      </div>
  );

  const StoreApp = () => (
      <div className="h-full bg-white flex flex-col pt-12 pb-8">
          <div className="px-4 py-2 flex gap-4 border-b border-slate-100 overflow-x-auto">
              <span className="text-green-600 font-bold border-b-2 border-green-600 pb-1">For You</span>
              <span className="text-slate-500 font-medium">Top Charts</span>
              <span className="text-slate-500 font-medium">Categories</span>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
              <div>
                  <div className="w-full aspect-video bg-gradient-to-br from-green-400 to-blue-500 rounded-xl mb-2 flex items-end p-4 text-white shadow-lg">
                      <div>
                          <div className="text-xs font-bold uppercase mb-1">Featured</div>
                          <div className="text-xl font-bold">Megam Office</div>
                          <div className="text-xs">Productivity Suite</div>
                      </div>
                  </div>
              </div>
              
              <div>
                  <h3 className="font-bold text-slate-800 mb-3 flex items-center justify-between">
                      Recommended 
                      <ArrowRight size={14} className="text-slate-400"/>
                  </h3>
                  <div className="space-y-4">
                      {['WhatsApp (Sim)', 'Spotify (Sim)', 'Instagram (Sim)'].map((app, i) => (
                          <div key={i} className="flex items-center gap-3">
                              <div className="w-12 h-12 bg-slate-200 rounded-xl"></div>
                              <div className="flex-1">
                                  <div className="font-bold text-sm text-slate-800">{app}</div>
                                  <div className="text-xs text-slate-500">Social • 4.5★</div>
                              </div>
                              <button className="px-4 py-1.5 rounded-full border border-slate-200 text-green-600 text-xs font-bold">Install</button>
                          </div>
                      ))}
                  </div>
              </div>
          </div>
      </div>
  );

  const MessagesApp = () => {
      const [inputText, setInputText] = useState('');
      
      const sendMsg = () => {
          if (!inputText.trim()) return;
          setMessages(prev => [...prev, { id: Date.now(), sender: 'Me', text: inputText, time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) }]);
          setInputText('');
          setTimeout(() => {
              setMessages(prev => [...prev, { id: Date.now(), sender: 'System', text: `Auto-Reply: I received "${inputText}" via Neural Bridge.`, time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) }]);
          }, 1000);
      };

      return (
          <div className="h-full bg-white flex flex-col pt-12 pb-8">
              <div className="px-4 py-3 border-b border-slate-100 flex items-center gap-3">
                  <button onClick={goBack}><ChevronLeft size={24} className="text-blue-500"/></button>
                  <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-500">S</div>
                  <div>
                      <div className="text-sm font-bold text-slate-900">System Agent</div>
                      <div className="text-[10px] text-green-500">Online</div>
                  </div>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
                  {messages.map(msg => (
                      <div key={msg.id} className={`flex flex-col ${msg.sender === 'Me' ? 'items-end' : 'items-start'}`}>
                          <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${msg.sender === 'Me' ? 'bg-blue-500 text-white rounded-tr-none' : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none'}`}>
                              {msg.text}
                          </div>
                          <span className="text-[10px] text-slate-400 mt-1 px-1">{msg.time}</span>
                      </div>
                  ))}
              </div>
              <div className="p-3 bg-white border-t border-slate-100 flex items-center gap-2">
                  <input className="flex-1 bg-slate-100 rounded-full px-4 py-2 text-sm outline-none" placeholder="Message..." value={inputText} onChange={e => setInputText(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendMsg()} />
                  <button onClick={sendMsg} className="p-2 bg-blue-500 rounded-full text-white"><ArrowRight size={16}/></button>
              </div>
          </div>
      );
  };

  const SettingsApp = () => (
      <div className="h-full bg-[#f2f2f7] flex flex-col pt-12 pb-8 text-slate-900 overflow-y-auto">
          <div className="px-4 mb-6"><h1 className="text-3xl font-bold">Settings</h1></div>
          <div className="px-4 mb-6">
              <div className="bg-white rounded-xl p-4 flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xl font-bold">JD</div>
                  <div>
                      <div className="font-bold text-lg">John Doe</div>
                      <div className="text-sm text-slate-500">Badal Cloud ID • Pro</div>
                  </div>
              </div>
          </div>
          <div className="px-4 space-y-6">
              <div className="bg-white rounded-xl overflow-hidden">
                  <div className="p-3 flex items-center gap-3 border-b border-slate-100"><div className="w-7 h-7 rounded bg-blue-500 flex items-center justify-center text-white"><Wifi size={16}/></div><span className="flex-1 text-sm font-medium">Wi-Fi</span><span className="text-xs text-slate-400">Megam-Mesh</span></div>
                  <div className="p-3 flex items-center gap-3 border-b border-slate-100"><div className="w-7 h-7 rounded bg-indigo-500 flex items-center justify-center text-white"><Cpu size={16}/></div><span className="flex-1 text-sm font-medium">Neural Bridge NPU</span><span className="text-xs text-slate-400">Active</span></div>
              </div>
          </div>
      </div>
  );

  const GalleryApp = () => (
      <div className="h-full bg-white flex flex-col pt-12 pb-8">
          <div className="px-4 py-2 flex justify-between items-center"><h2 className="text-xl font-bold">Photos</h2></div>
          <div className="flex-1 overflow-y-auto p-1">
              <div className="grid grid-cols-3 gap-1">
                  {[...Array(12)].map((_, i) => (
                      <div key={i} className="aspect-square bg-slate-200 relative"><img src={`https://source.unsplash.com/random/200x200?sig=${i}`} className="w-full h-full object-cover" alt="img"/></div>
                  ))}
              </div>
          </div>
      </div>
  );

  return (
    <div className="h-full flex items-center justify-center bg-slate-900 overflow-hidden p-8">
        <div className="relative w-[380px] h-[780px] bg-black rounded-[50px] shadow-[0_0_60px_-15px_rgba(0,0,0,0.7)] border-[8px] border-[#2a2a2a] ring-2 ring-slate-700 overflow-hidden">
            {/* Status Bar */}
            <div className="absolute top-0 left-0 w-full h-12 z-50 px-6 flex justify-between items-center text-white pointer-events-none">
                <span className="text-xs font-bold w-12">{currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                <div className="w-28 h-7 bg-black rounded-b-2xl absolute left-1/2 -translate-x-1/2 top-0 flex items-center justify-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-800"></div><div className="w-8 h-1.5 rounded-full bg-slate-800/50"></div>
                </div>
                <div className="flex gap-1.5 w-12 justify-end"><Signal size={12} fill="currentColor"/><Wifi size={12}/><Battery size={14} fill="currentColor"/></div>
            </div>

            <div className="w-full h-full bg-black relative">
                {systemState === 'LOCKED' && (
                    <div className="w-full h-full bg-cover bg-center flex flex-col items-center pt-20 text-white cursor-pointer" style={{ backgroundImage: `url(${WALLPAPER})` }} onClick={() => setSystemState('HOME')}>
                        <Lock size={20} className="mb-4 opacity-80"/>
                        <div className="text-7xl font-thin tracking-tighter mb-2">{currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}</div>
                        <div className="text-lg font-medium opacity-80">{currentTime.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })}</div>
                        <div className="mt-auto mb-8 flex flex-col items-center animate-pulse opacity-60"><div className="w-12 h-1 bg-white rounded-full mb-2"></div><span className="text-xs font-bold uppercase tracking-widest">Swipe up to unlock</span></div>
                    </div>
                )}

                {systemState === 'HOME' && (
                    <div className="w-full h-full bg-cover bg-center pt-14 pb-8 px-4 flex flex-col justify-between" style={{ backgroundImage: `url(${WALLPAPER})` }}>
                        <div className="grid grid-cols-2 gap-4 h-36">
                            <div className="bg-white/20 backdrop-blur-md rounded-2xl p-4 flex flex-col justify-between border border-white/10 text-white"><div className="text-xs font-bold text-blue-200 uppercase">Weather</div><div><div className="text-2xl font-bold">24°</div><div className="text-xs">Sunny • H:26 L:18</div></div></div>
                            <div className="bg-black/40 backdrop-blur-md rounded-2xl p-4 flex flex-col justify-between border border-white/10 text-white"><div className="text-xs font-bold text-green-300 uppercase flex items-center gap-1"><Zap size={10}/> Battery</div><div><div className="text-2xl font-bold">89%</div><div className="text-xs text-green-400">Charging</div></div></div>
                        </div>

                        <div className="grid grid-cols-4 gap-y-6 gap-x-2 mt-auto mb-4">
                            {/* Google Ecosystem */}
                            <AppIcon icon={ShoppingBag} label="Play Store" color="bg-white text-green-600" onClick={() => openApp('STORE')}/>
                            <AppIcon icon={MapPin} label="Maps" color="bg-white text-blue-600" onClick={() => openApp('MAPS')}/>
                            <AppIcon icon={Mail} label="Gmail" color="bg-white text-red-600" onClick={() => openApp('MAIL')}/>
                            <AppIcon icon={Chrome} label="Chrome" color="bg-white text-yellow-600" onClick={() => openApp('BROWSER')}/>
                            
                            {/* Native Apps */}
                            <AppIcon icon={ImageIcon} label="Photos" color="bg-white text-slate-900" onClick={() => openApp('GALLERY')}/>
                            <AppIcon icon={Camera} label="Camera" color="bg-slate-300 text-slate-800" onClick={() => openApp('CAMERA')}/>
                            <AppIcon icon={Clock} label="Clock" color="bg-black border border-white/20" onClick={() => openApp('CLOCK')}/>
                            <AppIcon icon={Settings} label="Settings" color="bg-slate-500" onClick={() => openApp('SETTINGS')}/>
                            <AppIcon icon={HardDrive} label="Files" color="bg-blue-400" onClick={() => openApp('FILES')}/>
                            <AppIcon icon={Calendar} label="Calendar" color="bg-white text-red-500" onClick={() => openApp('CALENDAR')}/>
                        </div>

                        <div className="bg-white/20 backdrop-blur-xl rounded-[35px] p-4 flex justify-between items-center px-6 border border-white/10">
                            <button onClick={() => openApp('DIALER')} className="w-14 h-14 bg-green-500 rounded-2xl flex items-center justify-center text-white shadow-lg active:scale-95 transition"><Phone size={28} fill="currentColor"/></button>
                            <button onClick={() => openApp('BROWSER')} className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-blue-500 shadow-lg active:scale-95 transition"><Chrome size={28}/></button>
                            <button onClick={() => openApp('MESSAGES')} className="w-14 h-14 bg-green-600 rounded-2xl flex items-center justify-center text-white shadow-lg active:scale-95 transition"><MessageSquare size={28} fill="currentColor"/></button>
                            <button onClick={() => openApp('MUSIC')} className="w-14 h-14 bg-red-500 rounded-2xl flex items-center justify-center text-white shadow-lg active:scale-95 transition"><Music size={28}/></button>
                        </div>
                    </div>
                )}

                {systemState === 'APP' && (
                    <div className="w-full h-full bg-white animate-in slide-in-from-bottom duration-300">
                        {activeApp === 'BROWSER' && <MobileBrowser />}
                        {activeApp === 'MESSAGES' && <MessagesApp />}
                        {activeApp === 'GALLERY' && <GalleryApp />}
                        {activeApp === 'SETTINGS' && <SettingsApp />}
                        {activeApp === 'DIALER' && <DialerApp />}
                        {activeApp === 'MAIL' && <MailApp />}
                        {activeApp === 'CAMERA' && <CameraApp />}
                        {activeApp === 'MAPS' && <MapsApp />}
                        {activeApp === 'MUSIC' && <MusicApp />}
                        {activeApp === 'FILES' && <FilesApp />}
                        {activeApp === 'STORE' && <StoreApp />}
                        
                        {/* Fallback */}
                        {!['BROWSER','MESSAGES','GALLERY','SETTINGS','DIALER','MAIL','CAMERA','MAPS','MUSIC','FILES','STORE'].includes(activeApp||'') && (
                            <div className="h-full flex flex-col items-center justify-center bg-slate-50">
                                <div className="w-20 h-20 rounded-3xl bg-slate-200 flex items-center justify-center mb-4 text-slate-400"><Grid size={40}/></div>
                                <h3 className="text-lg font-bold text-slate-700">{activeApp}</h3>
                                <p className="text-sm text-slate-400">Loading open source container...</p>
                                <button onClick={goHome} className="mt-8 px-6 py-2 bg-slate-200 rounded-full text-sm font-bold text-slate-600">Go Home</button>
                            </div>
                        )}
                    </div>
                )}

                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1.5 bg-black/20 rounded-full z-50 cursor-pointer hover:bg-black/40 transition backdrop-blur-sm" onClick={goHome}></div>
            </div>
        </div>
    </div>
  );
};

const AppIcon = ({ icon: Icon, label, color, onClick }: any) => (
    <button onClick={onClick} className="flex flex-col items-center gap-1 group w-full">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg transition-transform group-hover:scale-105 group-active:scale-95 ${color}`}>
            <Icon size={28} className="opacity-90"/>
        </div>
        <span className="text-[10px] font-medium text-white drop-shadow-md truncate w-full text-center px-1">{label}</span>
    </button>
);

export default BadalPhone;
