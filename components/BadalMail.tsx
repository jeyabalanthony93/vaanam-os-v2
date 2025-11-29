
import React, { useState, useEffect } from 'react';
import { Mail, Send, Users, BarChart3, Settings, Shield, Plus, Edit3, Trash2, CheckCircle2, AlertTriangle, RefreshCw, Zap, Server, Globe, Link, FileText, ArrowRight, X, Play, Pause, AlertCircle, Info } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, CartesianGrid } from 'recharts';
import { analyzeSubjectLine, calculateSpamScore } from '../services/geminiService';

const BadalMail: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'DASHBOARD' | 'CAMPAIGNS' | 'AUDIENCE' | 'TEMPLATES' | 'SETTINGS'>('DASHBOARD');
  
  // Campaign Wizard State
  const [isCreating, setIsCreating] = useState(false);
  const [wizardStep, setWizardStep] = useState(1);
  const [newCampaign, setNewCampaign] = useState({
      name: 'Untitled Campaign',
      subject: '',
      fromName: 'Megam Team',
      fromEmail: 'newsletter@megam.io',
      content: '',
      listId: '',
  });
  
  // AI Analysis State
  const [subjectAnalysis, setSubjectAnalysis] = useState<{score: number, suggestions: string[]} | null>(null);
  const [spamAnalysis, setSpamAnalysis] = useState<{score: number, issues: string[]} | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Sending State
  const [sendingProgress, setSendingProgress] = useState(0);
  const [isSending, setIsSending] = useState(false);

  const [campaigns, setCampaigns] = useState([
      { id: 'c1', name: 'Q3 Product Update', status: 'SENT', sent: 12500, openRate: 45.2, clickRate: 12.8, date: '2 days ago' },
      { id: 'c2', name: 'Welcome Series - Day 1', status: 'ACTIVE', sent: 340, openRate: 68.5, clickRate: 24.1, date: 'Ongoing' },
      { id: 'c3', name: 'Black Friday Teaser', status: 'DRAFT', sent: 0, openRate: 0, clickRate: 0, date: 'Edited 1h ago' },
  ]);

  const [lists, setLists] = useState([
      { id: 'l1', name: 'All Subscribers', count: 14205, growth: '+12%' },
      { id: 'l2', name: 'Premium Users', count: 850, growth: '+5%' },
      { id: 'l3', name: 'Newsletter (Double Opt-in)', count: 5600, growth: '+22%' },
  ]);

  const handleAnalyzeSubject = async () => {
      setIsAnalyzing(true);
      const res = await analyzeSubjectLine(newCampaign.subject);
      setSubjectAnalysis(res);
      setIsAnalyzing(false);
  };

  const handleCheckSpam = async () => {
      setIsAnalyzing(true);
      const res = await calculateSpamScore(newCampaign.content);
      setSpamAnalysis(res);
      setIsAnalyzing(false);
  };

  const handleSendCampaign = () => {
      setIsSending(true);
      let progress = 0;
      const interval = setInterval(() => {
          progress += 5;
          setSendingProgress(progress);
          if (progress >= 100) {
              clearInterval(interval);
              setIsSending(false);
              setIsCreating(false);
              setCampaigns(prev => [{
                  id: Date.now().toString(),
                  name: newCampaign.name,
                  status: 'SENT',
                  sent: 14205, // Mock list count
                  openRate: 0,
                  clickRate: 0,
                  date: 'Just now'
              }, ...prev]);
              setWizardStep(1);
              setSendingProgress(0);
          }
      }, 200);
  };

  const renderDashboard = () => (
      <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-300">
          {/* Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                  <div className="text-xs font-bold text-slate-500 uppercase mb-2">Total Sent (30d)</div>
                  <div className="text-3xl font-bold text-white mb-1">124.5k</div>
                  <div className="text-green-400 text-xs flex items-center gap-1"><ArrowRight size={12} className="-rotate-45"/> +15% vs last month</div>
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                  <div className="text-xs font-bold text-slate-500 uppercase mb-2">Avg Open Rate</div>
                  <div className="text-3xl font-bold text-white mb-1">42.8%</div>
                  <div className="text-blue-400 text-xs">Industry Avg: 21%</div>
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                  <div className="text-xs font-bold text-slate-500 uppercase mb-2">Click Rate</div>
                  <div className="text-3xl font-bold text-white mb-1">12.4%</div>
                  <div className="text-purple-400 text-xs">High Engagement</div>
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                  <div className="text-xs font-bold text-slate-500 uppercase mb-2">Bounce Rate</div>
                  <div className="text-3xl font-bold text-white mb-1">0.8%</div>
                  <div className="text-green-400 text-xs flex items-center gap-1"><CheckCircle2 size={12}/> Excellent Health</div>
              </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-6 h-80">
                  <h3 className="font-bold text-white mb-6 flex items-center gap-2"><BarChart3 size={18} className="text-blue-400"/> Campaign Performance</h3>
                  <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={[
                          {name: 'Mon', sent: 4000, opens: 2400},
                          {name: 'Tue', sent: 3000, opens: 1398},
                          {name: 'Wed', sent: 2000, opens: 9800}, // Spike
                          {name: 'Thu', sent: 2780, opens: 3908},
                          {name: 'Fri', sent: 1890, opens: 4800},
                          {name: 'Sat', sent: 2390, opens: 3800},
                          {name: 'Sun', sent: 3490, opens: 4300},
                      ]}>
                          <defs>
                              <linearGradient id="colorSent" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                              </linearGradient>
                              <linearGradient id="colorOpens" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                              </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                          <XAxis dataKey="name" stroke="#64748b" fontSize={10} />
                          <YAxis stroke="#64748b" fontSize={10} />
                          <Tooltip contentStyle={{backgroundColor: '#0f172a', borderColor: '#334155'}} />
                          <Area type="monotone" dataKey="sent" stroke="#3b82f6" fillOpacity={1} fill="url(#colorSent)" />
                          <Area type="monotone" dataKey="opens" stroke="#10b981" fillOpacity={1} fill="url(#colorOpens)" />
                      </AreaChart>
                  </ResponsiveContainer>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                  <h3 className="font-bold text-white mb-4">Reputation Score</h3>
                  <div className="flex flex-col items-center justify-center py-8">
                      <div className="w-32 h-32 rounded-full border-8 border-slate-800 flex items-center justify-center relative">
                          <div className="absolute inset-0 rounded-full border-8 border-green-500 border-t-transparent -rotate-45"></div>
                          <div className="text-center">
                              <div className="text-3xl font-bold text-white">98</div>
                              <div className="text-[10px] text-slate-500 uppercase">Excellent</div>
                          </div>
                      </div>
                      <div className="mt-6 space-y-2 w-full text-sm">
                          <div className="flex justify-between text-slate-400">
                              <span>DKIM</span>
                              <span className="text-green-400 font-bold">PASS</span>
                          </div>
                          <div className="flex justify-between text-slate-400">
                              <span>SPF</span>
                              <span className="text-green-400 font-bold">PASS</span>
                          </div>
                          <div className="flex justify-between text-slate-400">
                              <span>DMARC</span>
                              <span className="text-green-400 font-bold">PASS</span>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </div>
  );

  const renderWizard = () => (
      <div className="h-full flex flex-col p-8 max-w-5xl mx-auto">
          {/* Stepper */}
          <div className="flex justify-between mb-8 px-10 relative">
              <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-800 -z-10 -translate-y-1/2"></div>
              {[
                  { id: 1, label: 'Setup' },
                  { id: 2, label: 'Design' },
                  { id: 3, label: 'Audience' },
                  { id: 4, label: 'Review' }
              ].map(step => (
                  <div key={step.id} className="flex flex-col items-center gap-2 bg-slate-950 px-2">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border-2 transition ${wizardStep >= step.id ? 'bg-orange-600 border-orange-500 text-white' : 'bg-slate-900 border-slate-700 text-slate-500'}`}>
                          {wizardStep > step.id ? <CheckCircle2 size={20}/> : step.id}
                      </div>
                      <span className={`text-xs font-bold ${wizardStep >= step.id ? 'text-orange-400' : 'text-slate-600'}`}>{step.label}</span>
                  </div>
              ))}
          </div>

          <div className="flex-1 bg-slate-900 border border-slate-800 rounded-xl p-8 flex flex-col">
              {wizardStep === 1 && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-right duration-300">
                      <h2 className="text-2xl font-bold text-white mb-4">Campaign Details</h2>
                      <div className="space-y-4">
                          <div>
                              <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Campaign Name</label>
                              <input 
                                value={newCampaign.name}
                                onChange={e => setNewCampaign({...newCampaign, name: e.target.value})}
                                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-sm text-white focus:border-orange-500 outline-none"
                              />
                          </div>
                          <div>
                              <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Subject Line</label>
                              <div className="flex gap-2">
                                  <input 
                                    value={newCampaign.subject}
                                    onChange={e => setNewCampaign({...newCampaign, subject: e.target.value})}
                                    className="flex-1 bg-slate-950 border border-slate-700 rounded-lg p-3 text-sm text-white focus:border-orange-500 outline-none"
                                    placeholder="e.g. You won't believe this offer..."
                                  />
                                  <button onClick={handleAnalyzeSubject} disabled={isAnalyzing || !newCampaign.subject} className="px-4 bg-purple-600/20 text-purple-400 border border-purple-500/30 rounded-lg text-xs font-bold flex items-center gap-2 hover:bg-purple-600/30">
                                      {isAnalyzing ? <RefreshCw className="animate-spin" size={14}/> : <Zap size={14}/>} AI Analyze
                                  </button>
                              </div>
                              {subjectAnalysis && (
                                  <div className="mt-2 p-3 bg-purple-900/10 border border-purple-500/20 rounded-lg text-xs">
                                      <div className="flex justify-between font-bold mb-1">
                                          <span className="text-purple-300">Score: {subjectAnalysis.score}/100</span>
                                          <span className="text-slate-500">Based on open rates</span>
                                      </div>
                                      <ul className="list-disc pl-4 text-slate-400 space-y-1">
                                          {subjectAnalysis.suggestions.map((s, i) => <li key={i}>{s}</li>)}
                                      </ul>
                                  </div>
                              )}
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                              <div>
                                  <label className="text-xs font-bold text-slate-500 uppercase block mb-2">From Name</label>
                                  <input 
                                    value={newCampaign.fromName}
                                    onChange={e => setNewCampaign({...newCampaign, fromName: e.target.value})}
                                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-sm text-white focus:border-orange-500 outline-none"
                                  />
                              </div>
                              <div>
                                  <label className="text-xs font-bold text-slate-500 uppercase block mb-2">From Email</label>
                                  <input 
                                    value={newCampaign.fromEmail}
                                    onChange={e => setNewCampaign({...newCampaign, fromEmail: e.target.value})}
                                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-sm text-white focus:border-orange-500 outline-none"
                                  />
                              </div>
                          </div>
                      </div>
                  </div>
              )}

              {wizardStep === 2 && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-right duration-300 h-full flex flex-col">
                      <div className="flex justify-between items-center">
                          <h2 className="text-2xl font-bold text-white">Email Content</h2>
                          <div className="flex gap-2">
                              <button className="px-3 py-1.5 bg-slate-800 rounded text-xs text-white">Visual Editor</button>
                              <button className="px-3 py-1.5 bg-slate-950 rounded text-xs text-slate-400 hover:text-white">HTML Code</button>
                          </div>
                      </div>
                      
                      <div className="flex-1 bg-white rounded-lg p-8 text-slate-900 overflow-y-auto">
                          <textarea 
                            value={newCampaign.content}
                            onChange={e => setNewCampaign({...newCampaign, content: e.target.value})}
                            className="w-full h-full resize-none outline-none text-sm font-sans"
                            placeholder="Type your email content here. Use the toolbar above to add images, buttons, and layout elements..."
                          />
                      </div>

                      <div className="flex justify-end">
                          <button onClick={handleCheckSpam} disabled={isAnalyzing || !newCampaign.content} className="px-4 py-2 bg-red-900/20 text-red-400 border border-red-500/30 rounded-lg text-xs font-bold flex items-center gap-2 hover:bg-red-900/30">
                              {isAnalyzing ? <RefreshCw className="animate-spin" size={14}/> : <Shield size={14}/>} Check Spam Score
                          </button>
                      </div>
                      
                      {spamAnalysis && (
                          <div className={`p-4 rounded-lg border ${spamAnalysis.score === 0 ? 'bg-green-900/10 border-green-500/30' : 'bg-red-900/10 border-red-500/30'}`}>
                              <h4 className={`font-bold text-sm mb-2 ${spamAnalysis.score === 0 ? 'text-green-400' : 'text-red-400'}`}>
                                  Spam Score: {spamAnalysis.score} {spamAnalysis.score === 0 ? '(Excellent)' : '(High Risk)'}
                              </h4>
                              <ul className="list-disc pl-4 text-xs text-slate-300 space-y-1">
                                  {spamAnalysis.issues.map((issue, i) => <li key={i}>{issue}</li>)}
                              </ul>
                          </div>
                      )}
                  </div>
              )}

              {wizardStep === 3 && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-right duration-300">
                      <h2 className="text-2xl font-bold text-white mb-4">Select Audience</h2>
                      <div className="space-y-2">
                          {lists.map(list => (
                              <div 
                                key={list.id}
                                onClick={() => setNewCampaign({...newCampaign, listId: list.id})}
                                className={`p-4 rounded-xl border cursor-pointer transition flex justify-between items-center ${newCampaign.listId === list.id ? 'bg-orange-600/10 border-orange-500' : 'bg-slate-950 border-slate-800 hover:border-slate-600'}`}
                              >
                                  <div>
                                      <div className={`font-bold ${newCampaign.listId === list.id ? 'text-orange-400' : 'text-white'}`}>{list.name}</div>
                                      <div className="text-xs text-slate-500">{list.count.toLocaleString()} subscribers</div>
                                  </div>
                                  <div className="text-xs font-bold text-green-400 bg-green-900/20 px-2 py-1 rounded">{list.growth}</div>
                              </div>
                          ))}
                      </div>
                      <div className="pt-4 border-t border-slate-800 flex justify-between items-center">
                          <p className="text-sm text-slate-400">Total Recipients: <span className="text-white font-bold">{lists.find(l => l.id === newCampaign.listId)?.count.toLocaleString() || 0}</span></p>
                          <button className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 font-bold">
                              <Plus size={12}/> Create Segment
                          </button>
                      </div>
                  </div>
              )}

              {wizardStep === 4 && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-right duration-300 h-full flex flex-col">
                      <h2 className="text-2xl font-bold text-white mb-4">Review & Send</h2>
                      
                      <div className="grid grid-cols-2 gap-6 mb-6">
                          <div className="p-4 bg-slate-950 border border-slate-800 rounded-lg">
                              <div className="text-xs font-bold text-slate-500 uppercase mb-1">Subject</div>
                              <div className="text-white">{newCampaign.subject}</div>
                          </div>
                          <div className="p-4 bg-slate-950 border border-slate-800 rounded-lg">
                              <div className="text-xs font-bold text-slate-500 uppercase mb-1">Audience</div>
                              <div className="text-white">{lists.find(l => l.id === newCampaign.listId)?.name}</div>
                          </div>
                      </div>

                      {isSending ? (
                          <div className="flex-1 flex flex-col items-center justify-center">
                              <div className="w-64 h-64 relative flex items-center justify-center mb-8">
                                  <svg className="w-full h-full transform -rotate-90">
                                      <circle cx="128" cy="128" r="120" stroke="#1e293b" strokeWidth="12" fill="none" />
                                      <circle cx="128" cy="128" r="120" stroke="#ea580c" strokeWidth="12" fill="none" strokeDasharray={753} strokeDashoffset={753 - (753 * sendingProgress / 100)} className="transition-all duration-300 ease-out" />
                                  </svg>
                                  <div className="absolute text-center">
                                      <div className="text-4xl font-bold text-white">{sendingProgress}%</div>
                                      <div className="text-sm text-slate-400">Sending...</div>
                                  </div>
                              </div>
                              <div className="text-slate-400 font-mono text-sm">Dispatched batch 42/100 to SMTP Relay...</div>
                          </div>
                      ) : (
                          <div className="p-6 bg-yellow-900/10 border border-yellow-500/30 rounded-xl mb-6">
                              <div className="flex items-start gap-4">
                                  <AlertTriangle size={24} className="text-yellow-500 flex-shrink-0"/>
                                  <div>
                                      <h4 className="font-bold text-yellow-400 text-sm mb-1">Ready to Blast Off?</h4>
                                      <p className="text-xs text-slate-300">
                                          You are about to send to <strong>{lists.find(l => l.id === newCampaign.listId)?.count.toLocaleString()}</strong> recipients. 
                                          Double check your links and personalization tags.
                                      </p>
                                  </div>
                              </div>
                          </div>
                      )}
                  </div>
              )}

              {/* Footer */}
              {!isSending && (
                  <div className="mt-auto pt-6 border-t border-slate-800 flex justify-between">
                      <button 
                        onClick={() => setWizardStep(prev => Math.max(1, prev - 1))}
                        disabled={wizardStep === 1}
                        className="px-6 py-2 rounded-lg font-bold text-slate-400 hover:bg-slate-800 disabled:opacity-50"
                      >
                          Back
                      </button>
                      {wizardStep < 4 ? (
                          <button 
                            onClick={() => setWizardStep(prev => prev + 1)}
                            className="bg-orange-600 hover:bg-orange-500 text-white px-8 py-2 rounded-lg font-bold flex items-center gap-2"
                          >
                              Next <ArrowRight size={16}/>
                          </button>
                      ) : (
                          <button 
                            onClick={handleSendCampaign}
                            className="bg-green-600 hover:bg-green-500 text-white px-8 py-2 rounded-lg font-bold flex items-center gap-2 shadow-lg shadow-green-900/20"
                          >
                              <Send size={16}/> Send Campaign
                          </button>
                      )}
                  </div>
              )}
          </div>
      </div>
  );

  return (
    <div className="h-full flex flex-col bg-slate-950 text-slate-200 font-sans">
      {/* Header */}
      <div className="border-b border-slate-800 bg-slate-900/50 p-6 flex justify-between items-center">
          <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl shadow-lg shadow-orange-900/20">
                  <Mail size={24} className="text-white"/>
              </div>
              <div>
                  <h1 className="text-xl font-bold text-white">Badal Mail</h1>
                  <p className="text-slate-400 text-xs">Self-Hosted Marketing Platform</p>
              </div>
          </div>
          <div className="flex bg-slate-800 rounded-lg p-1 border border-slate-700">
              {[
                  { id: 'DASHBOARD', label: 'Overview', icon: BarChart3 },
                  { id: 'CAMPAIGNS', label: 'Campaigns', icon: Send },
                  { id: 'AUDIENCE', label: 'Audience', icon: Users },
                  { id: 'SETTINGS', label: 'Server Config', icon: Settings }
              ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => { setActiveTab(tab.id as any); setIsCreating(false); }}
                    className={`flex items-center gap-2 px-4 py-2 rounded-md text-xs font-bold transition whitespace-nowrap ${activeTab === tab.id && !isCreating ? 'bg-orange-600 text-white shadow' : 'text-slate-400 hover:text-white hover:bg-slate-700'}`}
                  >
                      {/* @ts-ignore */}
                      <tab.icon size={14} /> {tab.label}
                  </button>
              ))}
          </div>
      </div>

      <div className="flex-1 overflow-hidden p-8 bg-slate-950/50">
          
          {isCreating ? renderWizard() : (
              <>
                  {activeTab === 'DASHBOARD' && renderDashboard()}
                  
                  {activeTab === 'CAMPAIGNS' && (
                      <div className="max-w-6xl mx-auto space-y-6">
                          <div className="flex justify-between items-center">
                              <h2 className="text-2xl font-bold text-white">Email Campaigns</h2>
                              <button 
                                onClick={() => { setIsCreating(true); setWizardStep(1); }}
                                className="bg-orange-600 hover:bg-orange-500 text-white px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 shadow-lg shadow-orange-900/20"
                              >
                                  <Plus size={16}/> Create Campaign
                              </button>
                          </div>

                          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                              <table className="w-full text-left text-sm">
                                  <thead className="bg-slate-950 text-slate-500">
                                      <tr>
                                          <th className="p-4">Name</th>
                                          <th className="p-4">Status</th>
                                          <th className="p-4">Recipients</th>
                                          <th className="p-4">Open Rate</th>
                                          <th className="p-4">Click Rate</th>
                                          <th className="p-4">Date</th>
                                      </tr>
                                  </thead>
                                  <tbody className="divide-y divide-slate-800 text-slate-300">
                                      {campaigns.map(c => (
                                          <tr key={c.id} className="hover:bg-slate-800/30">
                                              <td className="p-4 font-bold text-white">{c.name}</td>
                                              <td className="p-4">
                                                  <span className={`px-2 py-1 rounded text-[10px] font-bold border ${c.status === 'SENT' ? 'bg-green-500/10 text-green-400 border-green-500/20' : c.status === 'ACTIVE' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 'bg-slate-800 text-slate-500 border-slate-700'}`}>
                                                      {c.status}
                                                  </span>
                                              </td>
                                              <td className="p-4">{c.sent.toLocaleString()}</td>
                                              <td className="p-4">{c.openRate > 0 ? `${c.openRate}%` : '-'}</td>
                                              <td className="p-4">{c.clickRate > 0 ? `${c.clickRate}%` : '-'}</td>
                                              <td className="p-4 text-xs text-slate-500">{c.date}</td>
                                          </tr>
                                      ))}
                                  </tbody>
                              </table>
                          </div>
                      </div>
                  )}

                  {activeTab === 'SETTINGS' && (
                      <div className="max-w-4xl mx-auto space-y-8">
                          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                              <h3 className="font-bold text-white mb-6 flex items-center gap-2"><Server size={20} className="text-orange-400"/> SMTP Relay Configuration</h3>
                              <div className="space-y-4">
                                  <div className="grid grid-cols-2 gap-4">
                                      <div>
                                          <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Service Provider</label>
                                          <select className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-sm text-white">
                                              <option>Amazon SES</option>
                                              <option>SendGrid</option>
                                              <option>Mailgun</option>
                                              <option>Custom SMTP</option>
                                          </select>
                                      </div>
                                      <div>
                                          <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Host</label>
                                          <input value="email-smtp.us-east-1.amazonaws.com" className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-sm text-white" readOnly/>
                                      </div>
                                  </div>
                                  <div className="grid grid-cols-2 gap-4">
                                      <div>
                                          <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Username</label>
                                          <input type="password" value="AKIAIOSFODNN7EXAMPLE" className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-sm text-white" readOnly/>
                                      </div>
                                      <div>
                                          <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Password</label>
                                          <input type="password" value="wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY" className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-sm text-white" readOnly/>
                                      </div>
                                  </div>
                                  <div className="flex justify-end pt-4">
                                      <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded text-sm font-bold">Test Connection</button>
                                  </div>
                              </div>
                          </div>

                          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                              <h3 className="font-bold text-white mb-6 flex items-center gap-2"><Shield size={20} className="text-green-400"/> Domain Authentication (DNS)</h3>
                              <div className="space-y-4">
                                  {[
                                      { name: 'SPF', status: 'PASS', val: 'v=spf1 include:amazonses.com ~all' },
                                      { name: 'DKIM', status: 'PASS', val: 'v=DKIM1; k=rsa; p=MIGfMA0GCSqGSIb3DQEBAQUAA4...' },
                                      { name: 'DMARC', status: 'PASS', val: 'v=DMARC1; p=quarantine; rua=mailto:dmarc@megamos.com' },
                                  ].map((rec, i) => (
                                      <div key={i} className="flex items-center justify-between p-3 bg-slate-950 border border-slate-800 rounded-lg">
                                          <div>
                                              <div className="font-bold text-white text-sm">{rec.name}</div>
                                              <div className="text-[10px] font-mono text-slate-500 truncate w-64">{rec.val}</div>
                                          </div>
                                          <span className="text-xs font-bold text-green-400 bg-green-900/20 px-2 py-1 rounded border border-green-500/20 flex items-center gap-1">
                                              <CheckCircle2 size={12}/> {rec.status}
                                          </span>
                                      </div>
                                  ))}
                              </div>
                          </div>
                      </div>
                  )}
              </>
          )}
      </div>
    </div>
  );
};

export default BadalMail;
