
import React, { useState, useEffect } from 'react';
import { CloudOff, Cloud, Lock, FileText, Table, StickyNote, Code, MonitorPlay, FileInput, User, Save, RefreshCw, ShieldCheck, WifiOff, Wifi, Fingerprint, ChevronRight, Layout, AlertTriangle, CheckCircle2, Settings, Download, Database, HardDrive, Server, Activity, Menu, X, ArrowDownCircle, Plus, ArrowRight, Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, Type, Image as ImageIcon, Video, Grid as GridIcon, List, CheckSquare, Trash2, Copy, Printer, Share2, MoreHorizontal, Eye, PlayCircle } from 'lucide-react';
import { simulateOfflineSync, runSecurityScan } from '../services/geminiService';

type ViewMode = 'DASHBOARD' | 'APPS' | 'SETTINGS' | 'APP_VIEW';
type Tool = 'WRITER' | 'GRID' | 'NOTES' | 'VAULT' | 'SLIDES' | 'FORMS' | 'RESUME';

const SS360: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('DASHBOARD');
  const [activeTool, setActiveTool] = useState<Tool | null>(null);
  const [offlineMode, setOfflineMode] = useState(true);
  
  // Sync & Connection State
  const [syncStatus, setSyncStatus] = useState<'IDLE' | 'SYNCING' | 'SYNCED' | 'STUCK' | 'ERROR'>('STUCK');
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isHandshaking, setIsHandshaking] = useState(true);

  // Data State (Persistent)
  const [unsavedChanges, setUnsavedChanges] = useState(0);
  const [lastSyncTime, setLastSyncTime] = useState('Never');
  const [localCacheSize, setLocalCacheSize] = useState('145 MB');
  
  // --- App Specific State ---
  // Writer
  const [writerContent, setWriterContent] = useState(`<h1>Q3 Cloud Strategy</h1><p>Executive Summary of the new <strong>SuckSaas</strong> deployment architecture.</p><p>We aim to leverage the new <em>Neural Bridge</em> technology to reduce latency by 40%.</p>`);
  // Grid
  const [gridData, setGridData] = useState<string[][]>([
      ['Metrics', 'Jan', 'Feb', 'Mar', 'Total'],
      ['Revenue', '12000', '15000', '11000', '=SUM(B2:D2)'],
      ['Cost', '5000', '6000', '5500', '=SUM(B3:D3)'],
      ['Profit', '7000', '9000', '5500', '=B2-B3']
  ]);
  // Notes
  const [notes, setNotes] = useState<{id: string, text: string, color: string}[]>([
      { id: '1', text: 'Meeting with DevTeam at 10 AM', color: 'bg-yellow-200' },
      { id: '2', text: 'Review Security Protocols', color: 'bg-blue-200' },
      { id: '3', text: 'Buy Milk', color: 'bg-green-200' }
  ]);
  // Slides
  const [slides, setSlides] = useState([{id: 1, title: 'Introduction', content: 'SuckSaas OS Overview'}, {id: 2, title: 'Architecture', content: 'Neural Bridge Deep Dive'}, {id: 3, title: 'Q&A', content: 'Any questions?'}]);
  const [currentSlide, setCurrentSlide] = useState(0);
  // Forms
  const [formFields, setFormFields] = useState<{id: string, type: string, label: string}[]>([
      { id: 'f1', type: 'text', label: 'Full Name' },
      { id: 'f2', type: 'email', label: 'Email Address' },
      { id: 'f3', type: 'textarea', label: 'Feedback' }
  ]);
  // Resume
  const [resumeData, setResumeData] = useState({ name: 'John Doe', role: 'Cloud Architect', exp: '10 Years' });
  // Vault
  const [codeContent, setCodeContent] = useState('# SS360 Local Build v1.0\nimport sucksaas_offline as ss\n\ndef main():\n    print("Running in Neural Bridge Mode")');

  // Security State
  const [securityLocked, setSecurityLocked] = useState(true);
  const [scanning, setScanning] = useState(false);
  const [pin, setPin] = useState('');
  const [authError, setAuthError] = useState('');

  // Settings State
  const [settings, setSettings] = useState({
      autoSync: true,
      syncInterval: '15m',
      encryption: 'AES-256 (Military Grade)',
      conflictResolution: 'Local Wins',
      cacheLimit: '2 GB'
  });

  // Simulate Initial Handshake / Stuck Load
  useEffect(() => {
      const timer = setInterval(() => {
          setLoadingProgress(prev => {
              if (prev >= 65 && prev < 70) return prev; // Get stuck at 65%
              if (prev >= 100) {
                  setIsHandshaking(false);
                  return 100;
              }
              return prev + 5;
          });
      }, 100);
      return () => clearInterval(timer);
  }, []);

  const handleForcePull = () => {
      setSyncStatus('SYNCING');
      setIsHandshaking(true);
      setLoadingProgress(65);
      
      // Simulate Force Pull
      setTimeout(() => {
          setLoadingProgress(100);
          setSyncStatus('SYNCED');
          setIsHandshaking(false);
          setLastSyncTime(new Date().toLocaleTimeString());
      }, 1500);
  };

  const handleSync = async () => {
     if (syncStatus === 'SYNCING') return;
     setSyncStatus('SYNCING');
     const result = await simulateOfflineSync(unsavedChanges);
     if (result.includes('Success')) {
         setSyncStatus('SYNCED');
         setUnsavedChanges(0);
         setLastSyncTime(new Date().toLocaleTimeString());
     } else {
         setSyncStatus('ERROR');
     }
  };

  const handleUnlock = async () => {
      setScanning(true);
      setAuthError('');
      
      if (pin !== '1234') { 
          setTimeout(() => {
            setScanning(false);
            setAuthError('Invalid PIN');
          }, 800);
          return;
      }

      const scan = await runSecurityScan('code_vault');
      setScanning(false);
      
      if (scan.safe) {
          setSecurityLocked(false);
      } else {
          setAuthError('Security Scan Failed: Malware Detected');
      }
  };

  const openApp = (tool: Tool) => {
      setActiveTool(tool);
      setViewMode('APP_VIEW');
  };

  if (isHandshaking && loadingProgress < 70) {
      return (
          <div className="h-full flex flex-col items-center justify-center bg-slate-950 text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
              <div className="z-10 text-center max-w-md w-full p-8 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl">
                  <CloudOff size={64} className="mx-auto mb-6 text-slate-500 animate-pulse" />
                  <h2 className="text-2xl font-bold mb-2">Establishing Secure Link</h2>
                  <p className="text-slate-400 mb-8 text-sm">Handshaking with SuckSaas Neural Bridge...</p>
                  
                  <div className="w-full bg-slate-800 rounded-full h-2 mb-4 overflow-hidden">
                      <div className="bg-orange-500 h-2 rounded-full transition-all duration-300" style={{ width: `${loadingProgress}%` }}></div>
                  </div>
                  
                  {loadingProgress >= 65 && (
                      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                           <div className="flex items-center gap-2 text-orange-400 justify-center mb-4 text-xs font-bold uppercase tracking-widest border border-orange-500/20 bg-orange-500/10 py-2 rounded">
                                <AlertTriangle size={14} /> Connection Unstable
                           </div>
                           <button 
                                onClick={handleForcePull}
                                className="w-full py-3 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-orange-900/20 transition transform hover:scale-105"
                           >
                                <ArrowDownCircle size={20} /> Force Pull Offline Data
                           </button>
                           <p className="text-[10px] text-slate-500 mt-3">
                               This will download the latest cached build (145MB) to your local storage.
                           </p>
                      </div>
                  )}
              </div>
          </div>
      );
  }

  // --- APP RENDERERS ---

  const renderWriterApp = () => (
      <div className="flex flex-col h-full bg-[#f8f9fa] text-slate-900 rounded-lg overflow-hidden">
          {/* Ribbon */}
          <div className="bg-white border-b border-slate-300 px-4 py-2 flex items-center justify-between shadow-sm">
              <div className="flex gap-4">
                  <div className="flex gap-1 border-r border-slate-300 pr-4">
                      <button className="p-1.5 hover:bg-slate-100 rounded text-slate-600" title="Bold"><Bold size={16}/></button>
                      <button className="p-1.5 hover:bg-slate-100 rounded text-slate-600" title="Italic"><Italic size={16}/></button>
                      <button className="p-1.5 hover:bg-slate-100 rounded text-slate-600" title="Underline"><Underline size={16}/></button>
                  </div>
                  <div className="flex gap-1 border-r border-slate-300 pr-4">
                      <button className="p-1.5 hover:bg-slate-100 rounded text-slate-600" title="Align Left"><AlignLeft size={16}/></button>
                      <button className="p-1.5 hover:bg-slate-100 rounded text-slate-600" title="Align Center"><AlignCenter size={16}/></button>
                      <button className="p-1.5 hover:bg-slate-100 rounded text-slate-600" title="Align Right"><AlignRight size={16}/></button>
                  </div>
                  <div className="flex gap-1">
                      <button className="p-1.5 hover:bg-slate-100 rounded text-slate-600 flex items-center gap-1 text-xs font-bold"><Type size={16}/> Arial</button>
                      <button className="p-1.5 hover:bg-slate-100 rounded text-slate-600 flex items-center gap-1 text-xs font-bold">12</button>
                  </div>
              </div>
              <div className="flex gap-2">
                  <button onClick={() => setUnsavedChanges(c => c+1)} className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded font-medium transition">
                      <Save size={14}/> Save
                  </button>
                   <button className="p-1.5 hover:bg-slate-100 rounded text-slate-600"><Settings size={16}/></button>
              </div>
          </div>
          {/* Editor */}
          <div className="flex-1 overflow-y-auto p-8 flex justify-center bg-slate-200">
              <div className="w-[21cm] min-h-[29.7cm] bg-white shadow-xl p-[2.5cm] outline-none">
                  <textarea 
                    className="w-full h-full resize-none outline-none font-serif text-lg leading-relaxed text-slate-800"
                    value={writerContent.replace(/<[^>]*>/g, '')} // Simple strip for textarea
                    onChange={(e) => { setWriterContent(e.target.value); setUnsavedChanges(c => c+1); }}
                    placeholder="Start typing..."
                  />
              </div>
          </div>
          {/* Footer */}
          <div className="bg-slate-100 border-t border-slate-300 px-4 py-1 text-[10px] text-slate-500 flex justify-between">
              <span>Page 1 of 1</span>
              <span>{writerContent.length} words</span>
          </div>
      </div>
  );

  const renderGridApp = () => (
      <div className="flex flex-col h-full bg-white text-slate-900 rounded-lg overflow-hidden">
          {/* Ribbon */}
          <div className="bg-white border-b border-slate-200 px-4 py-2 flex items-center justify-between shadow-sm">
               <div className="flex gap-2 text-xs font-medium text-slate-600">
                   <button className="hover:bg-slate-100 px-2 py-1 rounded">File</button>
                   <button className="hover:bg-slate-100 px-2 py-1 rounded">Edit</button>
                   <button className="hover:bg-slate-100 px-2 py-1 rounded">View</button>
                   <button className="hover:bg-slate-100 px-2 py-1 rounded">Insert</button>
                   <button className="hover:bg-slate-100 px-2 py-1 rounded">Format</button>
                   <button className="hover:bg-slate-100 px-2 py-1 rounded">Data</button>
               </div>
               <div className="flex gap-2">
                    <button className="p-1.5 hover:bg-slate-100 rounded text-slate-600"><Printer size={16}/></button>
                    <button className="p-1.5 hover:bg-slate-100 rounded text-slate-600"><Share2 size={16}/></button>
               </div>
          </div>
          {/* Formula Bar */}
          <div className="flex items-center border-b border-slate-200 px-2 py-1 gap-2 bg-slate-50">
              <div className="text-xs font-bold text-slate-500 w-8 text-center border-r border-slate-300">fx</div>
              <input className="flex-1 bg-transparent outline-none text-sm text-slate-700 font-mono" placeholder="Select a cell..." />
          </div>
          {/* Grid */}
          <div className="flex-1 overflow-auto">
              <div className="inline-block min-w-full">
                  <table className="w-full border-collapse">
                      <thead>
                          <tr>
                              <th className="w-10 bg-slate-100 border border-slate-300"></th>
                              {['A','B','C','D','E','F','G'].map(h => (
                                  <th key={h} className="bg-slate-100 border border-slate-300 px-4 py-1 text-xs font-bold text-slate-500 w-32">{h}</th>
                              ))}
                          </tr>
                      </thead>
                      <tbody>
                          {gridData.map((row, rI) => (
                              <tr key={rI}>
                                  <td className="bg-slate-50 border border-slate-300 text-center text-xs text-slate-400 font-mono">{rI + 1}</td>
                                  {row.map((cell, cI) => (
                                      <td key={cI} className="border border-slate-300 p-0">
                                          <input 
                                              className="w-full h-full px-2 py-1.5 outline-none focus:bg-blue-50 focus:ring-2 focus:ring-blue-500 focus:z-10 text-sm border-none bg-transparent"
                                              value={cell}
                                              onChange={(e) => {
                                                  const newData = [...gridData];
                                                  newData[rI][cI] = e.target.value;
                                                  setGridData(newData);
                                                  setUnsavedChanges(c => c+1);
                                              }}
                                          />
                                      </td>
                                  ))}
                                  {[1,2,3].map(i => <td key={i} className="border border-slate-300"></td>)}
                              </tr>
                          ))}
                           {[1,2,3,4,5].map(r => (
                              <tr key={`empty-${r}`}>
                                  <td className="bg-slate-50 border border-slate-300 text-center text-xs text-slate-400 font-mono">{gridData.length + r}</td>
                                  {[1,2,3,4,5,6,7].map(c => <td key={c} className="border border-slate-300"></td>)}
                              </tr>
                          ))}
                      </tbody>
                  </table>
              </div>
          </div>
          <div className="bg-slate-50 border-t border-slate-200 px-4 py-1 text-[10px] text-slate-500 flex gap-4">
              <button className="font-bold text-green-600 bg-white border border-slate-300 px-3 rounded-t shadow-sm translate-y-1">Sheet1</button>
              <button className="hover:text-slate-800 transition">+ Add Sheet</button>
          </div>
      </div>
  );

  const renderNotesApp = () => (
      <div className="flex flex-col h-full bg-[#202124] text-slate-200 rounded-lg overflow-hidden">
          <div className="p-4 border-b border-white/10 flex justify-between items-center bg-[#2d2e30]">
              <div className="flex items-center gap-2 text-yellow-500 font-bold">
                  <StickyNote size={20}/>
                  <span>Notes Board</span>
              </div>
              <button 
                onClick={() => {
                    setNotes([...notes, { id: Date.now().toString(), text: 'New Note', color: 'bg-slate-200' }]);
                    setUnsavedChanges(c => c+1);
                }}
                className="bg-yellow-600 hover:bg-yellow-500 text-white px-3 py-1.5 rounded-lg text-sm font-bold flex items-center gap-2 transition"
              >
                  <Plus size={16}/> Create Note
              </button>
          </div>
          <div className="flex-1 p-6 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {notes.map(note => (
                      <div key={note.id} className={`p-4 rounded-lg shadow-lg text-slate-900 ${note.color} min-h-[160px] flex flex-col relative group`}>
                          <textarea 
                             className="bg-transparent w-full h-full resize-none outline-none text-sm font-medium placeholder-slate-500/50"
                             value={note.text}
                             onChange={(e) => {
                                 setNotes(notes.map(n => n.id === note.id ? {...n, text: e.target.value} : n));
                                 setUnsavedChanges(c => c+1);
                             }}
                          />
                          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition flex gap-1">
                               <button 
                                onClick={() => {
                                    setNotes(notes.filter(n => n.id !== note.id));
                                    setUnsavedChanges(c => c+1);
                                }}
                                className="p-1 bg-black/10 hover:bg-red-500 hover:text-white rounded text-slate-700"
                               >
                                   <Trash2 size={12}/>
                               </button>
                          </div>
                          <div className="absolute bottom-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition">
                              {['bg-yellow-200', 'bg-blue-200', 'bg-green-200', 'bg-pink-200'].map(c => (
                                  <button 
                                    key={c} 
                                    onClick={() => {
                                        setNotes(notes.map(n => n.id === note.id ? {...n, color: c} : n));
                                        setUnsavedChanges(c => c+1);
                                    }}
                                    className={`w-4 h-4 rounded-full border border-black/10 ${c}`}
                                  />
                              ))}
                          </div>
                      </div>
                  ))}
              </div>
          </div>
      </div>
  );

  const renderSlidesApp = () => (
      <div className="flex flex-col h-full bg-slate-100 text-slate-900 rounded-lg overflow-hidden">
          <div className="bg-white border-b border-slate-300 px-4 py-2 flex justify-between items-center shadow-sm z-10">
              <div className="flex gap-2">
                   <button className="flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded text-sm font-medium transition">
                       <Plus size={16}/> New Slide
                   </button>
                   <button className="flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded text-sm font-medium transition">
                       <ImageIcon size={16}/> Image
                   </button>
                    <button className="flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded text-sm font-medium transition">
                       <Type size={16}/> Text Box
                   </button>
              </div>
              <button className="flex items-center gap-2 bg-slate-800 text-white px-4 py-1.5 rounded text-sm font-bold hover:bg-slate-700 transition">
                  <PlayCircle size={16}/> Present
              </button>
          </div>
          <div className="flex-1 flex overflow-hidden">
              {/* Thumbnails */}
              <div className="w-48 bg-slate-50 border-r border-slate-300 p-4 space-y-4 overflow-y-auto">
                  {slides.map((slide, i) => (
                      <div 
                        key={slide.id} 
                        onClick={() => setCurrentSlide(i)}
                        className={`aspect-video bg-white shadow-sm border rounded cursor-pointer p-2 relative ${currentSlide === i ? 'ring-2 ring-orange-500' : 'hover:border-slate-400'}`}
                      >
                          <div className="text-[6px] font-bold truncate mb-1">{slide.title}</div>
                          <div className="text-[4px] text-slate-500 line-clamp-3">{slide.content}</div>
                          <div className="absolute bottom-1 left-2 text-[8px] font-mono text-slate-400">{i + 1}</div>
                      </div>
                  ))}
              </div>
              {/* Main Stage */}
              <div className="flex-1 bg-slate-200 flex items-center justify-center p-8 overflow-auto">
                  <div className="aspect-video w-full max-w-4xl bg-white shadow-2xl rounded-sm p-12 flex flex-col justify-center items-center relative">
                       <input 
                         className="text-4xl font-bold text-center w-full mb-4 outline-none hover:bg-slate-50 focus:bg-slate-50 rounded px-2"
                         value={slides[currentSlide].title}
                         onChange={(e) => {
                             const newSlides = [...slides];
                             newSlides[currentSlide].title = e.target.value;
                             setSlides(newSlides);
                             setUnsavedChanges(c => c+1);
                         }}
                       />
                       <textarea 
                         className="text-xl text-slate-600 text-center w-full resize-none outline-none hover:bg-slate-50 focus:bg-slate-50 rounded px-2"
                         value={slides[currentSlide].content}
                         onChange={(e) => {
                             const newSlides = [...slides];
                             newSlides[currentSlide].content = e.target.value;
                             setSlides(newSlides);
                             setUnsavedChanges(c => c+1);
                         }}
                       />
                       <div className="absolute bottom-4 right-4 text-xs text-slate-300 font-mono">SuckSaas Presentation</div>
                  </div>
              </div>
          </div>
      </div>
  );

  const renderFormsApp = () => (
      <div className="flex flex-col h-full bg-purple-50 text-slate-900 rounded-lg overflow-hidden">
          <div className="bg-white border-b border-purple-100 p-4 flex justify-between items-center shadow-sm z-10">
              <div>
                  <h2 className="text-xl font-bold text-slate-800">Untitled Form</h2>
                  <p className="text-xs text-slate-500">All changes saved offline</p>
              </div>
              <div className="flex gap-2">
                  <button className="p-2 hover:bg-purple-50 rounded-full text-purple-600"><Eye size={20}/></button>
                  <button className="p-2 hover:bg-purple-50 rounded-full text-purple-600"><Settings size={20}/></button>
                  <button className="px-6 py-2 bg-purple-600 text-white rounded font-bold hover:bg-purple-700 transition">Send</button>
              </div>
          </div>
          <div className="flex-1 overflow-y-auto p-8 flex justify-center">
              <div className="w-full max-w-2xl space-y-4">
                  <div className="bg-white rounded-lg border-t-8 border-t-purple-600 shadow-sm p-6">
                      <input className="text-3xl font-bold w-full outline-none mb-2 border-b border-transparent focus:border-purple-200 transition" defaultValue="Customer Feedback" />
                      <input className="text-sm text-slate-500 w-full outline-none" defaultValue="Please fill out this survey." />
                  </div>
                  
                  {formFields.map(field => (
                      <div key={field.id} className="bg-white rounded-lg shadow-sm p-6 border border-slate-200 hover:border-purple-300 transition group relative">
                          <div className="mb-4">
                              <input 
                                className="w-full bg-slate-50 p-3 border-b border-slate-300 outline-none focus:border-purple-500 transition font-medium" 
                                value={field.label}
                                onChange={(e) => {
                                    setFormFields(formFields.map(f => f.id === field.id ? {...f, label: e.target.value} : f));
                                    setUnsavedChanges(c => c+1);
                                }}
                              />
                          </div>
                          {field.type === 'textarea' ? (
                               <div className="h-20 bg-slate-50 border-b border-dotted border-slate-300"></div>
                          ) : (
                               <div className="h-10 bg-slate-50 border-b border-dotted border-slate-300"></div>
                          )}
                          <div className="pt-4 mt-4 border-t border-slate-100 flex justify-end opacity-0 group-hover:opacity-100 transition">
                               <button 
                                onClick={() => {
                                    setFormFields(formFields.filter(f => f.id !== field.id));
                                    setUnsavedChanges(c => c+1);
                                }}
                                className="p-2 hover:bg-slate-100 rounded-full text-slate-500 hover:text-red-500"
                               >
                                   <Trash2 size={18}/>
                               </button>
                               <div className="w-px h-6 bg-slate-200 mx-2"></div>
                               <div className="flex items-center gap-2 text-sm text-slate-600">
                                   <span>Required</span>
                                   <div className="w-8 h-4 bg-slate-300 rounded-full relative"><div className="w-4 h-4 bg-white rounded-full shadow-sm absolute left-0"></div></div>
                               </div>
                          </div>
                      </div>
                  ))}
                  
                  <div className="flex justify-center py-4">
                       <button 
                        onClick={() => {
                            setFormFields([...formFields, {id: Date.now().toString(), type: 'text', label: 'New Question'}]);
                            setUnsavedChanges(c => c+1);
                        }}
                        className="p-2 rounded-full bg-white shadow-md border border-slate-200 hover:bg-purple-50 text-purple-600 transition"
                       >
                           <Plus size={24}/>
                       </button>
                  </div>
              </div>
          </div>
      </div>
  );

  const renderSidebar = () => (
      <div className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col">
          <div className="p-6 border-b border-slate-800 flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center text-white font-bold">
                  S
              </div>
              <div>
                  <h1 className="font-bold text-white leading-none">SS360</h1>
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider">Offline Suite</span>
              </div>
          </div>
          
          <div className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
              <SidebarItem icon={Layout} label="Dashboard" active={viewMode === 'DASHBOARD'} onClick={() => setViewMode('DASHBOARD')} />
              <SidebarItem icon={Table} label="Applications" active={viewMode === 'APPS'} onClick={() => setViewMode('APPS')} />
              <SidebarItem icon={Lock} label="Secure Vault" active={activeTool === 'VAULT'} onClick={() => openApp('VAULT')} />
              
              <div className="pt-4 mt-4 border-t border-slate-800">
                  <div className="px-3 mb-2 text-[10px] font-bold text-slate-500 uppercase">Recent</div>
                  <button onClick={() => openApp('RESUME')} className="w-full text-left px-3 py-2 text-xs text-slate-400 hover:text-white hover:bg-slate-800 rounded flex items-center gap-2">
                      <User size={12}/> My Resume.pdf
                  </button>
                  <button onClick={() => openApp('WRITER')} className="w-full text-left px-3 py-2 text-xs text-slate-400 hover:text-white hover:bg-slate-800 rounded flex items-center gap-2">
                      <FileText size={12}/> Q3_Strategy.docx
                  </button>
              </div>
          </div>

          <div className="p-4 border-t border-slate-800">
               <button 
                onClick={() => setViewMode('SETTINGS')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition ${viewMode === 'SETTINGS' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
               >
                   <Settings size={18} /> Control Panel
               </button>
          </div>
      </div>
  );

  return (
    <div className="h-full flex bg-slate-950 text-slate-200 font-sans">
        {renderSidebar()}
        
        <div className="flex-1 flex flex-col min-w-0 bg-slate-950 relative">
            {/* Top Bar */}
            <div className="h-16 border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm flex items-center justify-between px-6 z-10 shrink-0">
                 <div className="flex items-center gap-4">
                     {viewMode === 'APP_VIEW' && (
                         <button onClick={() => setViewMode('APPS')} className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white">
                             <ChevronRight size={20} className="rotate-180"/>
                         </button>
                     )}
                     <h2 className="text-lg font-bold text-white">
                         {viewMode === 'DASHBOARD' && 'Overview'}
                         {viewMode === 'APPS' && 'Application Launcher'}
                         {viewMode === 'SETTINGS' && 'System Configuration'}
                         {viewMode === 'APP_VIEW' && activeTool}
                     </h2>
                 </div>

                 <div className="flex items-center gap-4">
                     <div className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-2 ${offlineMode ? 'bg-slate-800 border-slate-700 text-slate-400' : 'bg-green-900/20 border-green-500/30 text-green-400'}`}>
                         {offlineMode ? <WifiOff size={12}/> : <Wifi size={12}/>}
                         {offlineMode ? 'OFFLINE' : 'ONLINE'}
                     </div>
                     <div className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-2 ${syncStatus === 'SYNCED' ? 'bg-green-900/20 border-green-500/30 text-green-400' : syncStatus === 'STUCK' ? 'bg-red-900/20 border-red-500/30 text-red-400' : 'bg-blue-900/20 border-blue-500/30 text-blue-400'}`}>
                         <RefreshCw size={12} className={syncStatus === 'SYNCING' ? 'animate-spin' : ''}/>
                         {syncStatus}
                     </div>
                     {unsavedChanges > 0 && (
                         <button onClick={handleSync} className="bg-orange-600 hover:bg-orange-500 text-white text-xs px-3 py-1 rounded font-bold animate-pulse">
                             Save {unsavedChanges} Changes
                         </button>
                     )}
                 </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-hidden relative">
                
                {viewMode === 'DASHBOARD' && (
                    <div className="h-full overflow-y-auto p-8">
                    <div className="max-w-5xl mx-auto space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <DashboardCard icon={HardDrive} label="Local Storage" value={localCacheSize} sub="Cached Encrypted" color="text-blue-400" />
                            <DashboardCard icon={Activity} label="Last Sync" value={lastSyncTime} sub="Backend Transmittor" color="text-green-400" />
                            <DashboardCard icon={ShieldCheck} label="Security Status" value={securityLocked ? "Locked" : "Verified"} sub="Neural Sentinel" color="text-purple-400" />
                        </div>

                        <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-8 border border-slate-800 relative overflow-hidden">
                             <div className="relative z-10 flex justify-between items-center">
                                 <div>
                                     <h3 className="text-xl font-bold text-white mb-2">Sync Status: {syncStatus}</h3>
                                     <p className="text-slate-400 max-w-lg">
                                         Your offline workspace is {syncStatus === 'SYNCED' ? 'fully synchronized' : 'pending updates'}. 
                                         Local changes are automatically pushed when connectivity is restored via the Neural Bridge.
                                     </p>
                                 </div>
                                 <button onClick={handleForcePull} className="px-6 py-3 bg-white text-slate-900 rounded-xl font-bold hover:bg-slate-200 transition flex items-center gap-2">
                                     <Download size={18}/> Force Pull Data
                                 </button>
                             </div>
                             <Cloud className="absolute -right-10 -bottom-10 text-white/5" size={200} />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                                <h3 className="font-bold text-white mb-4">Quick Access</h3>
                                <div className="space-y-3">
                                    <button onClick={() => openApp('WRITER')} className="w-full flex items-center justify-between p-3 bg-slate-800 hover:bg-slate-700 rounded-lg transition group">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-blue-500/20 text-blue-400 rounded group-hover:bg-blue-500 group-hover:text-white transition"><FileText size={18}/></div>
                                            <span className="font-medium text-slate-300 group-hover:text-white">New Document</span>
                                        </div>
                                        <Plus size={16} className="text-slate-500"/>
                                    </button>
                                     <button onClick={() => openApp('GRID')} className="w-full flex items-center justify-between p-3 bg-slate-800 hover:bg-slate-700 rounded-lg transition group">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-green-500/20 text-green-400 rounded group-hover:bg-green-500 group-hover:text-white transition"><Table size={18}/></div>
                                            <span className="font-medium text-slate-300 group-hover:text-white">New Spreadsheet</span>
                                        </div>
                                        <Plus size={16} className="text-slate-500"/>
                                    </button>
                                </div>
                            </div>
                            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                                <h3 className="font-bold text-white mb-4">Storage Breakdown</h3>
                                <div className="space-y-4">
                                    <StorageBar label="Documents" percent={45} color="bg-blue-500" />
                                    <StorageBar label="Code Vault" percent={20} color="bg-purple-500" />
                                    <StorageBar label="System Cache" percent={15} color="bg-slate-500" />
                                </div>
                            </div>
                        </div>
                    </div>
                    </div>
                )}

                {viewMode === 'APPS' && (
                    <div className="h-full overflow-y-auto p-8">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                         <AppCard icon={FileText} label="Writer" sub="Docs" color="text-blue-400" onClick={() => openApp('WRITER')} />
                        <AppCard icon={Table} label="Grid" sub="Sheets" color="text-green-400" onClick={() => openApp('GRID')} />
                        <AppCard icon={StickyNote} label="Notes" sub="Memo" color="text-yellow-400" onClick={() => openApp('NOTES')} />
                        <AppCard icon={MonitorPlay} label="Slides" sub="Preso" color="text-orange-400" onClick={() => openApp('SLIDES')} />
                        <AppCard icon={FileInput} label="Forms" sub="Survey" color="text-purple-400" onClick={() => openApp('FORMS')} />
                        <AppCard icon={User} label="Resume" sub="Maker" color="text-pink-400" onClick={() => openApp('RESUME')} />
                        <AppCard icon={Code} label="Code Vault" sub="Secure" color="text-cyan-400" onClick={() => openApp('VAULT')} />
                    </div>
                    </div>
                )}

                {viewMode === 'SETTINGS' && (
                    <div className="h-full overflow-y-auto p-8">
                    <div className="max-w-2xl mx-auto bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                        <div className="p-6 border-b border-slate-800 bg-slate-800/50">
                            <h2 className="text-xl font-bold text-white flex items-center gap-2"><Settings size={20}/> Control Panel</h2>
                            <p className="text-slate-400 text-sm mt-1">Configure offline behavior and security policies.</p>
                        </div>
                        <div className="p-6 space-y-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <label className="font-bold text-white block">Auto-Sync</label>
                                    <p className="text-xs text-slate-500">Automatically push changes when connection is available.</p>
                                </div>
                                <button onClick={() => setSettings({...settings, autoSync: !settings.autoSync})} className={`w-12 h-6 rounded-full transition-colors relative ${settings.autoSync ? 'bg-green-500' : 'bg-slate-700'}`}>
                                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${settings.autoSync ? 'left-7' : 'left-1'}`}></div>
                                </button>
                            </div>
                             <div className="space-y-2">
                                <label className="font-bold text-white block text-sm">Encryption Standard</label>
                                <select className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-sm text-slate-300 outline-none">
                                    <option>AES-256 (Military Grade)</option>
                                    <option>ChaCha20-Poly1305</option>
                                    <option>RSA-4096</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="font-bold text-white block text-sm">Local Cache Limit</label>
                                <select className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-sm text-slate-300 outline-none">
                                    <option>2 GB</option>
                                    <option>5 GB</option>
                                    <option>Unlimited</option>
                                </select>
                            </div>
                             <div className="space-y-2">
                                <label className="font-bold text-white block text-sm">Conflict Resolution</label>
                                <div className="flex gap-2">
                                    {['Local Wins', 'Server Wins', 'Manual Merge'].map(opt => (
                                        <button 
                                            key={opt}
                                            onClick={() => setSettings({...settings, conflictResolution: opt})}
                                            className={`px-3 py-1.5 rounded text-xs font-bold border transition ${settings.conflictResolution === opt ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-400'}`}
                                        >
                                            {opt}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="pt-6 border-t border-slate-800">
                                <button className="w-full py-2 bg-red-900/20 text-red-400 border border-red-900/50 rounded-lg text-sm font-bold hover:bg-red-900/40 transition">
                                    Reset Local Database
                                </button>
                            </div>
                        </div>
                    </div>
                    </div>
                )}

                {viewMode === 'APP_VIEW' && (
                    <div className="h-full flex flex-col p-6 overflow-hidden">
                        {/* Tool Render Logic */}
                        {activeTool === 'VAULT' ? (
                            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden group flex-1">
                                <div className="absolute top-0 right-0 p-32 bg-red-500/5 blur-3xl rounded-full pointer-events-none"></div>
                                <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                    <Lock size={20} className={securityLocked ? 'text-red-400' : 'text-green-400'}/> 
                                    Secured Code Vault
                                </h2>
                                
                                {securityLocked ? (
                                    <div className="max-w-md mx-auto mt-20 text-center">
                                        <div className="bg-slate-950 p-8 rounded-2xl border border-slate-800 shadow-2xl">
                                            <Fingerprint size={48} className="mx-auto text-slate-600 mb-4"/>
                                            <h3 className="text-xl font-bold text-white mb-2">Authentication Required</h3>
                                            <p className="text-sm text-slate-400 mb-6">Enter your security PIN to decrypt the vault.</p>
                                            
                                            <div className="flex gap-2 mb-4">
                                                <input 
                                                    type="password" 
                                                    value={pin}
                                                    onChange={(e) => setPin(e.target.value)}
                                                    maxLength={4}
                                                    className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-center tracking-[1em] text-white font-mono outline-none focus:border-red-500 transition text-lg"
                                                    placeholder="••••"
                                                    autoFocus
                                                />
                                                <button 
                                                    onClick={handleUnlock}
                                                    disabled={scanning}
                                                    className="bg-red-600 hover:bg-red-500 text-white px-6 py-2 rounded-lg font-bold transition flex items-center gap-2"
                                                >
                                                    {scanning ? <RefreshCw className="animate-spin" size={20}/> : <ArrowRight size={20}/>}
                                                </button>
                                            </div>
                                            {authError && <p className="text-red-400 text-xs font-bold flex items-center justify-center gap-1 animate-pulse"><AlertTriangle size={12}/> {authError}</p>}
                                            <div className="mt-4 text-[10px] text-slate-600 uppercase font-bold tracking-widest">
                                                Secured by Neural Sentinel
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="h-full flex flex-col bg-[#1e1e1e] rounded-xl overflow-hidden border border-slate-700">
                                         <div className="h-10 bg-[#252526] flex items-center justify-between px-4 border-b border-black">
                                            <span className="text-xs text-slate-400 flex items-center gap-2"><Lock size={10} className="text-green-400"/> Secured / main.py</span>
                                            <div className="flex gap-2">
                                                <button onClick={() => { setUnsavedChanges(c => c+1); setViewMode('DASHBOARD'); }} className="text-xs hover:text-white flex items-center gap-1"><Save size={12}/> Save</button>
                                                <button onClick={() => { setSecurityLocked(true); setPin(''); }} className="text-xs hover:text-red-400 flex items-center gap-1"><Lock size={12}/> Lock</button>
                                            </div>
                                        </div>
                                        <textarea 
                                            className="flex-1 bg-transparent p-4 outline-none resize-none font-mono text-sm text-blue-300"
                                            value={codeContent}
                                            onChange={e => { setCodeContent(e.target.value); setUnsavedChanges(c => c+1); }}
                                        />
                                    </div>
                                )}
                            </div>
                        ) : activeTool === 'RESUME' ? (
                            <div className="bg-white text-slate-900 rounded-xl shadow-2xl overflow-hidden flex-1 flex">
                                <div className="w-1/3 bg-slate-100 p-8 border-r border-slate-200 space-y-6">
                                    <h3 className="font-bold text-slate-400 text-xs uppercase">Personal Info</h3>
                                    <div>
                                        <label className="text-xs font-bold text-slate-500 block mb-1">Full Name</label>
                                        <input value={resumeData.name} onChange={e => { setResumeData({...resumeData, name: e.target.value}); setUnsavedChanges(c => c+1); }} className="w-full p-2 rounded border border-slate-300 text-sm" />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-slate-500 block mb-1">Role Title</label>
                                        <input value={resumeData.role} onChange={e => { setResumeData({...resumeData, role: e.target.value}); setUnsavedChanges(c => c+1); }} className="w-full p-2 rounded border border-slate-300 text-sm" />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-slate-500 block mb-1">Experience</label>
                                        <input value={resumeData.exp} onChange={e => { setResumeData({...resumeData, exp: e.target.value}); setUnsavedChanges(c => c+1); }} className="w-full p-2 rounded border border-slate-300 text-sm" />
                                    </div>
                                    <button onClick={() => { setUnsavedChanges(prev => prev + 1); setViewMode('DASHBOARD'); }} className="w-full py-2 bg-slate-800 text-white rounded text-sm font-bold mt-4">Save & Exit</button>
                                </div>
                                <div className="flex-1 p-16">
                                    <h1 className="text-5xl font-bold text-slate-900 mb-2">{resumeData.name}</h1>
                                    <p className="text-2xl text-indigo-600 font-medium mb-12">{resumeData.role}</p>
                                    
                                    <div className="space-y-8">
                                        <div className="pb-6 border-b border-slate-200">
                                            <h3 className="font-bold text-slate-400 text-sm uppercase mb-3 tracking-widest">Experience</h3>
                                            <p className="text-slate-800 leading-relaxed">{resumeData.exp} of professional experience in high-load cloud environments, specifically architecting neural bridge solutions and offline-first PWA architectures.</p>
                                        </div>
                                            <div className="pb-6 border-b border-slate-200">
                                            <h3 className="font-bold text-slate-400 text-sm uppercase mb-3 tracking-widest">Education</h3>
                                            <p className="text-slate-800 font-bold">Masters in Cloud Computing</p>
                                            <p className="text-slate-600 text-sm">SuckSaas University • 2020</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : activeTool === 'WRITER' ? renderWriterApp() : 
                            activeTool === 'GRID' ? renderGridApp() :
                            activeTool === 'NOTES' ? renderNotesApp() :
                            activeTool === 'SLIDES' ? renderSlidesApp() :
                            activeTool === 'FORMS' ? renderFormsApp() : null
                        }
                    </div>
                )}

            </div>
        </div>
    </div>
  );
};

const SidebarItem: React.FC<{ icon: any, label: string, active: boolean, onClick: () => void }> = ({ icon: Icon, label, active, onClick }) => (
    <button 
        onClick={onClick}
        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition ${active ? 'bg-slate-800 text-white shadow' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
    >
        <Icon size={18} /> {label}
    </button>
)

const DashboardCard: React.FC<{ icon: any, label: string, value: string, sub: string, color: string }> = ({ icon: Icon, label, value, sub, color }) => (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex items-start justify-between">
        <div>
            <p className="text-xs font-bold text-slate-500 uppercase mb-1">{label}</p>
            <h3 className="text-2xl font-bold text-white mb-1">{value}</h3>
            <p className={`text-xs ${color}`}>{sub}</p>
        </div>
        <div className={`p-3 rounded-xl bg-slate-950 border border-slate-800 ${color}`}>
            <Icon size={24} />
        </div>
    </div>
)

const AppCard: React.FC<{ icon: any, label: string, sub: string, color: string, onClick: () => void }> = ({ icon: Icon, label, sub, color, onClick }) => (
    <button onClick={onClick} className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:bg-slate-800 transition group text-left hover:border-slate-600 hover:shadow-lg">
        <div className={`w-12 h-12 rounded-lg bg-slate-950 flex items-center justify-center mb-4 ${color} border border-slate-800 group-hover:scale-110 transition`}>
            <Icon size={24} />
        </div>
        <div className="font-bold text-white group-hover:text-cyan-400 transition mb-1">{label}</div>
        <div className="text-xs text-slate-500">{sub}</div>
    </button>
)

const StorageBar: React.FC<{ label: string, percent: number, color: string }> = ({ label, percent, color }) => (
    <div>
        <div className="flex justify-between text-xs text-slate-400 mb-1">
            <span>{label}</span>
            <span>{percent}%</span>
        </div>
        <div className="h-2 bg-slate-950 rounded-full overflow-hidden">
            <div className={`h-full ${color} rounded-full`} style={{width: `${percent}%`}}></div>
        </div>
    </div>
)

export default SS360;
