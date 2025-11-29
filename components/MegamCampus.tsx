
import React, { useState, useEffect } from 'react';
import { Map, GraduationCap, Video, Building2, Server, Globe, Users, ArrowRight, Play, BookOpen, User, CheckCircle2, X, Lock, Mic, Monitor, PenTool, FileText, Send, MessageSquare } from 'lucide-react';
import { generateTourScript, simulateMeetingAction } from '../services/geminiService';
import { Course, MeetingParticipant } from '../types';

const MegamCampus: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'MAP' | 'ACADEMY' | 'COLLAB'>('MAP');
  const [selectedBuilding, setSelectedBuilding] = useState<string | null>(null);
  const [tourScript, setTourScript] = useState('');
  const [isTouring, setIsTouring] = useState(false);
  
  // Academy State
  const [activeTrack, setActiveTrack] = useState<'GENERAL' | 'SALES' | 'DEVOPS' | 'SUPPORT'>('GENERAL');
  const [activeCourse, setActiveCourse] = useState<Course | null>(null);
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);

  // Collaboratory State
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [showBuildingModal, setShowBuildingModal] = useState(false);
  const [meetingActionLog, setMeetingActionLog] = useState<string[]>([]);
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<{sender: string, text: string}[]>([]);
  const [participants, setParticipants] = useState<MeetingParticipant[]>([
      { id: 'you', name: 'You', role: 'HOST', avatarColor: 'bg-green-500', isSpeaking: false },
      { id: 'ag1', name: 'DevBot-Alpha', role: 'PRESENTER', avatarColor: 'bg-blue-500', isSpeaking: true },
      { id: 'ag2', name: 'Sales-AI', role: 'ATTENDEE', avatarColor: 'bg-orange-500', isSpeaking: false },
      { id: 'ag3', name: 'Support-Unit', role: 'ATTENDEE', avatarColor: 'bg-purple-500', isSpeaking: false },
  ]);

  const [courses, setCourses] = useState<Course[]>([
      { 
          id: 1, title: 'Neural Bridge Architecture 101', track: 'GENERAL', progress: 100, status: 'COMPLETED', content: 'Video Lesson: Understanding Tensor Translation Layers.',
          modules: [ {id: 'm1', title: 'Intro to NB', duration: '5m', completed: true}, {id: 'm2', title: 'Tensor Ops', duration: '12m', completed: true} ]
      },
      { 
          id: 2, title: 'Advanced RAG Patterns', track: 'DEVOPS', progress: 45, status: 'IN_PROGRESS', content: 'Module 3: Hybrid Search Implementation.',
          modules: [ {id: 'm1', title: 'Vector DBs', duration: '10m', completed: true}, {id: 'm2', title: 'Hybrid Search', duration: '15m', completed: false} ]
      },
      { 
          id: 3, title: 'Quantum Error Correction', track: 'DEVOPS', progress: 0, status: 'LOCKED', content: 'Prerequisites not met.', modules: []
      },
      { 
          id: 4, title: 'Lead Gen Automation Strategy', track: 'SALES', progress: 10, status: 'IN_PROGRESS', content: 'Mastering the art of automated outreach.',
          modules: [ {id: 'm1', title: 'Targeting', duration: '8m', completed: true}, {id: 'm2', title: 'Cold Email', duration: '20m', completed: false} ]
      },
  ]);

  const handleTour = async (building: string) => {
      setSelectedBuilding(building);
      setShowBuildingModal(true);
      setIsTouring(true);
      setTourScript('Initializing Virtual Guide...');
      const script = await generateTourScript(building);
      setTourScript(script);
  };

  const startCourse = (course: Course) => {
      if(course.status !== 'LOCKED') {
          setActiveCourse(course);
          setIsPlayingVideo(false);
      }
  };

  const handleMeetingAction = async (action: string) => {
      setMeetingActionLog(prev => [...prev, `Initiating ${action}...`]);
      const res = await simulateMeetingAction(action);
      setMeetingActionLog(prev => [...prev, res]);
  };

  const handleChatSubmit = () => {
      if (!chatMessage.trim()) return;
      
      const newMsg = { sender: 'You', text: chatMessage };
      setChatHistory(prev => [...prev, newMsg]);
      
      if (chatMessage.startsWith('/assign')) {
          setTimeout(() => setChatHistory(prev => [...prev, { sender: 'System', text: 'Task assigned to DevBot-Alpha.' }]), 500);
      } else if (chatMessage.startsWith('/summarize')) {
          setTimeout(() => setChatHistory(prev => [...prev, { sender: 'AI Scribe', text: 'Summary: Discussing Neural Bridge deployment timeline.' }]), 1000);
      }

      setChatMessage('');
  };

  return (
    <div className="h-full flex flex-col bg-slate-950 text-slate-200 font-sans">
      {/* Header */}
      <div className="border-b border-slate-800 bg-slate-900/50 p-6 flex justify-between items-center">
          <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl shadow-lg">
                  <Building2 size={24} className="text-white"/>
              </div>
              <div>
                  <h1 className="text-xl font-bold text-white">Megam Virtual Campus</h1>
                  <p className="text-slate-400 text-xs">HQ • Research Lab • Agent Academy</p>
              </div>
          </div>
          <div className="flex bg-slate-800 rounded-lg p-1 border border-slate-700">
              <button onClick={() => setActiveTab('MAP')} className={`px-4 py-2 rounded-md text-xs font-bold flex items-center gap-2 ${activeTab === 'MAP' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}>
                  <Map size={14}/> Campus Map
              </button>
              <button onClick={() => setActiveTab('ACADEMY')} className={`px-4 py-2 rounded-md text-xs font-bold flex items-center gap-2 ${activeTab === 'ACADEMY' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}>
                  <GraduationCap size={14}/> Academy
              </button>
              <button onClick={() => setActiveTab('COLLAB')} className={`px-4 py-2 rounded-md text-xs font-bold flex items-center gap-2 ${activeTab === 'COLLAB' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}>
                  <Video size={14}/> Collaboratory
              </button>
          </div>
      </div>

      <div className="flex-1 overflow-hidden p-8 relative">
          
          {activeTab === 'MAP' && (
              <div className="h-full flex gap-8">
                  {/* Map Visualizer */}
                  <div className="flex-1 bg-[#0f172a] border border-slate-800 rounded-xl relative overflow-hidden group">
                      {/* Grid Background */}
                      <div className="absolute inset-0 opacity-20" style={{backgroundImage: 'radial-gradient(#4f46e5 1px, transparent 1px)', backgroundSize: '40px 40px'}}></div>
                      
                      {/* Buildings */}
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px]">
                          {/* HQ */}
                          <div onClick={() => handleTour('HQ')} className="absolute top-10 left-1/2 -translate-x-1/2 w-32 h-32 bg-slate-800 border-4 border-indigo-500 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:scale-110 transition shadow-[0_0_30px_rgba(99,102,241,0.3)] z-10 group/b">
                              <Building2 size={32} className="text-white mb-2 group-hover/b:text-indigo-400"/>
                              <span className="text-xs font-bold text-white">HQ</span>
                          </div>
                          {/* Data Center */}
                          <div onClick={() => handleTour('DC')} className="absolute bottom-10 left-10 w-40 h-24 bg-slate-800 border-4 border-cyan-500 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:scale-110 transition shadow-[0_0_30px_rgba(6,182,212,0.3)] z-10 group/b">
                              <Server size={24} className="text-white mb-2 group-hover/b:text-cyan-400"/>
                              <span className="text-xs font-bold text-white">Data Center</span>
                          </div>
                          {/* Academy */}
                          <div onClick={() => handleTour('ACADEMY')} className="absolute bottom-10 right-10 w-40 h-24 bg-slate-800 border-4 border-green-500 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:scale-110 transition shadow-[0_0_30px_rgba(34,197,94,0.3)] z-10 group/b">
                              <GraduationCap size={24} className="text-white mb-2 group-hover/b:text-green-400"/>
                              <span className="text-xs font-bold text-white">Academy</span>
                          </div>
                          
                          {/* Connecting Paths */}
                          <svg className="absolute inset-0 w-full h-full pointer-events-none">
                              <path d="M 300 130 L 110 310" stroke="#334155" strokeWidth="4" strokeDasharray="10,10" className="animate-[dash_20s_linear_infinite]"/>
                              <path d="M 300 130 L 490 310" stroke="#334155" strokeWidth="4" strokeDasharray="10,10" className="animate-[dash_20s_linear_infinite]"/>
                          </svg>
                      </div>
                  </div>

                  {/* Tour Guide Panel */}
                  <div className="w-80 bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col">
                      <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                          <Globe size={18} className="text-indigo-400"/> Virtual Tour Guide
                      </h3>
                      {isTouring ? (
                          <div className="flex-1 bg-black/30 rounded-lg p-4 border border-slate-800">
                              <div className="flex items-center gap-3 mb-4">
                                  <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center border-2 border-white">
                                      <User size={20} className="text-white"/>
                                  </div>
                                  <div>
                                      <div className="text-sm font-bold text-white">TourBot</div>
                                      <div className="text-[10px] text-green-400">Live Audio Feed</div>
                                  </div>
                              </div>
                              <p className="text-sm text-slate-300 leading-relaxed font-serif italic">
                                  "{tourScript}"
                              </p>
                              <div className="mt-4 flex justify-center">
                                  <div className="flex gap-1 h-4 items-end">
                                      {[1,2,3,4,5].map(i => (
                                          <div key={i} className="w-1 bg-indigo-500 rounded-full animate-pulse" style={{height: `${Math.random() * 100}%`, animationDelay: `${i*0.1}s`}}></div>
                                      ))}
                                  </div>
                              </div>
                          </div>
                      ) : (
                          <div className="flex-1 flex items-center justify-center text-center text-slate-500 text-sm">
                              Select a building on the map to start a guided tour.
                          </div>
                      )}
                  </div>
              </div>
          )}

          {activeTab === 'ACADEMY' && (
              <div className="max-w-6xl mx-auto h-full flex flex-col gap-6">
                  <div className="flex justify-between items-end">
                      <div>
                          <h2 className="text-2xl font-bold text-white mb-2">Agent Knowledge Base</h2>
                          <p className="text-slate-400">Continuous learning pipeline for autonomous agents.</p>
                      </div>
                      <div className="flex bg-slate-900 rounded-lg p-1 border border-slate-800">
                          {['GENERAL', 'SALES', 'DEVOPS', 'SUPPORT'].map(track => (
                              <button 
                                key={track}
                                onClick={() => setActiveTrack(track as any)}
                                className={`px-4 py-2 rounded text-xs font-bold transition ${activeTrack === track ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
                              >
                                  {track}
                              </button>
                          ))}
                      </div>
                  </div>
                  
                  {activeCourse ? (
                      <div className="flex-1 bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col animate-in fade-in slide-in-from-right duration-300">
                          <div className="flex justify-between items-start mb-6">
                              <div>
                                  <div className="flex items-center gap-2 mb-2">
                                      <button onClick={() => setActiveCourse(null)} className="text-slate-400 hover:text-white flex items-center gap-1 text-xs font-bold"><ArrowRight className="rotate-180" size={12}/> Back</button>
                                      <span className="text-slate-600">/</span>
                                      <span className="text-xs font-bold text-indigo-400">{activeCourse.track}</span>
                                  </div>
                                  <h3 className="text-xl font-bold text-white">{activeCourse.title}</h3>
                              </div>
                              <button onClick={() => setActiveCourse(null)} className="text-slate-400 hover:text-white"><X size={24}/></button>
                          </div>
                          
                          <div className="flex gap-8 flex-1">
                              <div className="flex-1 flex flex-col gap-4">
                                  <div className="aspect-video bg-black rounded-lg relative overflow-hidden group shadow-2xl border border-slate-800">
                                      {isPlayingVideo ? (
                                          <div className="absolute inset-0 flex items-center justify-center bg-slate-900">
                                              <div className="text-center">
                                                  <Video size={48} className="mx-auto mb-4 text-indigo-500 animate-pulse"/>
                                                  <p className="text-slate-400 text-sm">Simulating Video Stream...</p>
                                                  <div className="w-64 h-1 bg-slate-800 rounded-full mt-4 mx-auto overflow-hidden">
                                                      <div className="h-full bg-indigo-500 animate-[width_3s_ease-in-out_infinite]"></div>
                                                  </div>
                                              </div>
                                          </div>
                                      ) : (
                                          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-indigo-900/20 to-purple-900/20">
                                              <button onClick={() => setIsPlayingVideo(true)} className="w-16 h-16 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center backdrop-blur transition transform hover:scale-110">
                                                  <Play size={32} className="text-white fill-white ml-1"/>
                                              </button>
                                          </div>
                                      )}
                                  </div>
                                  <div className="prose prose-invert max-w-none bg-slate-950 p-6 rounded-xl border border-slate-800">
                                      <h4 className="text-white font-bold mb-2">Lesson Overview</h4>
                                      <p className="text-slate-400 text-sm">{activeCourse.content}</p>
                                  </div>
                              </div>

                              <div className="w-80 bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col">
                                  <h4 className="text-xs font-bold text-slate-500 uppercase mb-4">Course Modules</h4>
                                  <div className="space-y-2 flex-1 overflow-y-auto">
                                      {activeCourse.modules.map((mod, i) => (
                                          <div key={mod.id} className="p-3 rounded border border-slate-800 hover:bg-slate-900 transition cursor-pointer flex justify-between items-center group">
                                              <div className="flex items-center gap-3">
                                                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${mod.completed ? 'bg-green-500 text-black' : 'bg-slate-800 text-slate-500'}`}>
                                                      {mod.completed ? <CheckCircle2 size={14}/> : i + 1}
                                                  </div>
                                                  <div>
                                                      <div className="text-sm font-medium text-slate-300 group-hover:text-white">{mod.title}</div>
                                                      <div className="text-[10px] text-slate-500">{mod.duration}</div>
                                                  </div>
                                              </div>
                                              {mod.completed || i === 0 ? <Play size={12} className="text-indigo-400"/> : <Lock size={12} className="text-slate-600"/>}
                                          </div>
                                      ))}
                                  </div>
                              </div>
                          </div>
                      </div>
                  ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {courses.filter(c => activeTrack === 'GENERAL' || c.track === activeTrack).map(course => (
                              <div key={course.id} className="bg-slate-900 border border-slate-800 p-6 rounded-xl flex flex-col justify-between hover:border-indigo-500/50 transition cursor-pointer group h-64" onClick={() => startCourse(course)}>
                                  <div>
                                      <div className="flex justify-between items-start mb-4">
                                          <div className={`p-3 rounded-full ${course.status === 'COMPLETED' ? 'bg-green-500/20 text-green-400' : course.status === 'LOCKED' ? 'bg-slate-800 text-slate-500' : 'bg-blue-500/20 text-blue-400'}`}>
                                              <BookOpen size={20}/>
                                          </div>
                                          <span className="text-[10px] bg-slate-950 px-2 py-1 rounded text-slate-500 font-bold border border-slate-800">{course.track}</span>
                                      </div>
                                      <h3 className="font-bold text-white mb-2 group-hover:text-indigo-400 transition">{course.title}</h3>
                                      <p className="text-xs text-slate-500 line-clamp-2">{course.content}</p>
                                  </div>
                                  <div>
                                      <div className="w-full h-1.5 bg-slate-800 rounded-full mb-3 overflow-hidden">
                                          <div className={`h-full rounded-full ${course.status === 'COMPLETED' ? 'bg-green-500' : 'bg-blue-500'}`} style={{width: `${course.progress}%`}}></div>
                                      </div>
                                      <button className={`w-full py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-2 ${course.status === 'LOCKED' ? 'bg-slate-800 text-slate-500 cursor-not-allowed' : 'bg-white text-slate-900 hover:bg-slate-200'}`}>
                                          {course.status === 'COMPLETED' ? <CheckCircle2 size={14}/> : <Play size={14}/>}
                                          {course.status === 'COMPLETED' ? 'Review Course' : course.status === 'LOCKED' ? 'Locked' : 'Start Learning'}
                                      </button>
                                  </div>
                              </div>
                          ))}
                      </div>
                  )}
              </div>
          )}

          {activeTab === 'COLLAB' && (
              <div className="h-full flex items-center justify-center">
                  {!isSessionActive ? (
                      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 max-w-2xl text-center shadow-2xl">
                          <Video size={64} className="text-indigo-500 mx-auto mb-6"/>
                          <h2 className="text-3xl font-bold text-white mb-2">Megam Collaboratory</h2>
                          <p className="text-slate-400 mb-8 text-lg">Real-time meeting space with AI transcription, whiteboarding, and screen sharing.</p>
                          <div className="flex justify-center gap-4">
                              <button onClick={() => setIsSessionActive(true)} className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-indigo-900/30 transition transform hover:scale-105">
                                  <Play size={20}/> Start New Session
                              </button>
                              <button className="px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold border border-slate-700">
                                  Join Room
                              </button>
                          </div>
                      </div>
                  ) : (
                      <div className="w-full h-full flex gap-4 animate-in fade-in zoom-in duration-300">
                          {/* Main Stage */}
                          <div className="flex-1 bg-black rounded-xl border border-slate-800 relative overflow-hidden flex flex-col">
                              {/* Meeting Content */}
                              <div className="flex-1 relative">
                                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                                      <div className="text-slate-500 flex flex-col items-center mb-8">
                                          <Monitor size={64} className="mb-4 opacity-50"/>
                                          <p className="text-sm font-mono">DevBot-Alpha is sharing screen...</p>
                                      </div>
                                      <div className="bg-slate-900 p-4 rounded-lg border border-slate-800 max-w-md w-full">
                                          <div className="h-2 bg-slate-800 rounded w-3/4 mb-2 animate-pulse"></div>
                                          <div className="h-2 bg-slate-800 rounded w-1/2 mb-2 animate-pulse"></div>
                                          <div className="h-2 bg-slate-800 rounded w-full animate-pulse"></div>
                                      </div>
                                  </div>
                                  
                                  {/* Participants Overlay */}
                                  <div className="absolute top-4 right-4 flex gap-2">
                                      {participants.map(p => (
                                          <div key={p.id} className={`w-10 h-10 rounded-full border-2 ${p.isSpeaking ? 'border-green-500' : 'border-transparent'} ${p.avatarColor} flex items-center justify-center text-white text-xs font-bold shadow-lg`} title={p.name}>
                                              {p.name[0]}
                                          </div>
                                      ))}
                                  </div>
                              </div>

                              {/* Control Bar */}
                              <div className="h-16 bg-slate-900 border-t border-slate-800 flex items-center justify-center gap-4 px-6">
                                  <button onClick={() => handleMeetingAction('MUTE')} className="p-3 bg-slate-800 rounded-full hover:bg-slate-700 text-white"><Mic size={20}/></button>
                                  <button onClick={() => handleMeetingAction('VIDEO')} className="p-3 bg-slate-800 rounded-full hover:bg-slate-700 text-white"><Video size={20}/></button>
                                  <button onClick={() => handleMeetingAction('SCREEN')} className="p-3 bg-slate-800 rounded-full hover:bg-slate-700 text-white"><Monitor size={20}/></button>
                                  <button onClick={() => handleMeetingAction('BOARD')} className="p-3 bg-slate-800 rounded-full hover:bg-slate-700 text-white"><PenTool size={20}/></button>
                                  <button onClick={() => handleMeetingAction('RECORD')} className="p-3 bg-slate-800 rounded-full hover:bg-slate-700 text-red-500"><div className="w-4 h-4 bg-red-500 rounded-full"></div></button>
                                  <div className="h-8 w-px bg-slate-700 mx-2"></div>
                                  <button onClick={() => handleMeetingAction('TRANSCRIPT')} className="p-3 bg-indigo-600/20 text-indigo-400 rounded-full hover:bg-indigo-600/30 font-bold text-xs px-4">AI Scribe</button>
                                  <button className="p-3 bg-red-600 rounded-full text-white hover:bg-red-500 ml-auto" onClick={() => setIsSessionActive(false)}><X size={20}/></button>
                              </div>
                          </div>

                          {/* Sidebar */}
                          <div className="w-80 bg-slate-900 border border-slate-800 rounded-xl flex flex-col overflow-hidden">
                              <div className="p-4 border-b border-slate-800">
                                  <h3 className="font-bold text-white text-sm">Chat</h3>
                              </div>
                              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-950/30">
                                  {chatHistory.length === 0 && <div className="text-center text-slate-600 text-xs mt-10">Use /assign or /summarize</div>}
                                  {chatHistory.map((msg, i) => (
                                      <div key={i} className={`flex flex-col ${msg.sender === 'You' ? 'items-end' : 'items-start'}`}>
                                          <div className={`text-[10px] text-slate-500 mb-1`}>{msg.sender}</div>
                                          <div className={`px-3 py-2 rounded-lg text-sm max-w-[90%] ${msg.sender === 'You' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-300'}`}>
                                              {msg.text}
                                          </div>
                                      </div>
                                  ))}
                                  {meetingActionLog.map((log, i) => (
                                      <div key={`log-${i}`} className="text-center text-[10px] text-slate-500 italic my-2">
                                          {log}
                                      </div>
                                  ))}
                              </div>
                              <div className="p-3 bg-slate-900 border-t border-slate-800">
                                  <div className="relative">
                                      <input 
                                        className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-3 pr-10 py-2 text-sm text-white focus:border-indigo-500 outline-none" 
                                        placeholder="Type / for commands..."
                                        value={chatMessage}
                                        onChange={(e) => setChatMessage(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleChatSubmit()}
                                      />
                                      <button onClick={handleChatSubmit} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white">
                                          <Send size={16}/>
                                      </button>
                                  </div>
                              </div>
                          </div>
                      </div>
                  )}
              </div>
          )}

          {/* Building Deep Dive Modal */}
          {showBuildingModal && selectedBuilding && (
              <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-8">
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl p-8 relative animate-in fade-in zoom-in duration-300 shadow-2xl">
                      <button onClick={() => setShowBuildingModal(false)} className="absolute top-4 right-4 text-slate-500 hover:text-white"><X size={24}/></button>
                      <h2 className="text-3xl font-bold text-white mb-2">{selectedBuilding === 'HQ' ? 'Global Headquarters' : selectedBuilding === 'DC' ? 'Data Center Node' : 'Agent Academy'}</h2>
                      <p className="text-slate-400 mb-6">{selectedBuilding === 'HQ' ? 'Central Command & Strategy' : selectedBuilding === 'DC' ? 'Compute & Storage Facility' : 'Model Training Grounds'}</p>
                      
                      <div className="grid grid-cols-3 gap-4 mb-6">
                          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                              <div className="text-xs text-slate-500 uppercase font-bold">Occupancy</div>
                              <div className="text-2xl font-bold text-white">{selectedBuilding === 'HQ' ? '12 Humans' : selectedBuilding === 'DC' ? '0 Humans' : '1.4k Agents'}</div>
                          </div>
                          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                              <div className="text-xs text-slate-500 uppercase font-bold">Power Usage</div>
                              <div className="text-2xl font-bold text-green-400">{selectedBuilding === 'DC' ? '4.2 MW' : '120 kW'}</div>
                          </div>
                          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                              <div className="text-xs text-slate-500 uppercase font-bold">Security</div>
                              <div className="text-2xl font-bold text-blue-400">Level 5</div>
                          </div>
                      </div>
                      
                      <div className="bg-slate-800 rounded-lg p-4 font-mono text-sm text-green-400 max-h-32 overflow-y-auto">
                          {tourScript}
                      </div>
                  </div>
              </div>
          )}

      </div>
    </div>
  );
};

export default MegamCampus;
