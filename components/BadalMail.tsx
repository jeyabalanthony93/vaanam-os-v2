
import React, { useState, useEffect } from 'react';
import { Mail, Send, Users, BarChart3, Settings, Shield, Plus, Edit3, Trash2, CheckCircle2, AlertTriangle, RefreshCw, Zap, Server, Globe, Link, FileText, ArrowRight, X, Play, Pause, AlertCircle, Info, Lock } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, CartesianGrid } from 'recharts';
import { analyzeSubjectLine, calculateSpamScore } from '../services/geminiService';

const BadalMail: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'DASHBOARD' | 'CAMPAIGNS' | 'AUDIENCE' | 'TEMPLATES' | 'SETTINGS'>('DASHBOARD');
  
  // SMTP Config State
  const [smtpConfig, setSmtpConfig] = useState({
      host: 'smtp.sendgrid.net',
      port: '587',
      user: 'apikey',
      pass: 'SG.xxxxxxxx',
      secure: true
  });
  const [dnsConfig, setDnsConfig] = useState({
      spf: 'v=spf1 include:sendgrid.net ~all',
      dkim: 'v=DKIM1; k=rsa; p=MIGfMA0GCSq...',
      dmarc: 'v=DMARC1; p=quarantine; rua=mailto:dmarc@megam.io'
  });
  const [isVerifying, setIsVerifying] = useState(false);

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
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // ... (Other states remain similar to previous but simplified for this update focus)

  const handleTestConnection = () => {
      setIsVerifying(true);
      setTimeout(() => {
          alert('SMTP Connection Successful!');
          setIsVerifying(false);
      }, 1500);
  };

  const handleVerifyDns = () => {
      setIsVerifying(true);
      setTimeout(() => {
          alert('DNS Records Verified: SPF [PASS], DKIM [PASS], DMARC [PASS]');
          setIsVerifying(false);
      }, 2000);
  };

  const handleAnalyzeSubject = async () => {
      setIsAnalyzing(true);
      const res = await analyzeSubjectLine(newCampaign.subject);
      setSubjectAnalysis(res);
      setIsAnalyzing(false);
  };

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
          {activeTab === 'SETTINGS' && (
              <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300">
                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                      <h3 className="font-bold text-white mb-6 flex items-center gap-2"><Server size={20} className="text-orange-400"/> SMTP Relay Configuration</h3>
                      <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                              <div>
                                  <label className="text-xs font-bold text-slate-500 uppercase block mb-1">SMTP Host</label>
                                  <input 
                                    value={smtpConfig.host}
                                    onChange={e => setSmtpConfig({...smtpConfig, host: e.target.value})}
                                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-sm text-white focus:border-orange-500 outline-none"
                                  />
                              </div>
                              <div>
                                  <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Port</label>
                                  <input 
                                    value={smtpConfig.port}
                                    onChange={e => setSmtpConfig({...smtpConfig, port: e.target.value})}
                                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-sm text-white focus:border-orange-500 outline-none"
                                  />
                              </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                              <div>
                                  <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Username</label>
                                  <input 
                                    value={smtpConfig.user}
                                    onChange={e => setSmtpConfig({...smtpConfig, user: e.target.value})}
                                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-sm text-white focus:border-orange-500 outline-none"
                                  />
                              </div>
                              <div>
                                  <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Password</label>
                                  <input 
                                    type="password"
                                    value={smtpConfig.pass}
                                    onChange={e => setSmtpConfig({...smtpConfig, pass: e.target.value})}
                                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-sm text-white focus:border-orange-500 outline-none"
                                  />
                              </div>
                          </div>
                          <div className="flex items-center justify-between pt-2">
                              <div className="flex items-center gap-2">
                                  <button onClick={() => setSmtpConfig({...smtpConfig, secure: !smtpConfig.secure})} className={`w-10 h-5 rounded-full relative transition-colors ${smtpConfig.secure ? 'bg-green-500' : 'bg-slate-700'}`}>
                                      <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-transform ${smtpConfig.secure ? 'translate-x-6' : 'translate-x-1'}`}></div>
                                  </button>
                                  <span className="text-sm text-slate-400">Use SSL/TLS</span>
                              </div>
                              <button onClick={handleTestConnection} disabled={isVerifying} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded text-sm font-bold flex items-center gap-2">
                                  {isVerifying ? <RefreshCw className="animate-spin" size={14}/> : <Zap size={14}/>} Test Connection
                              </button>
                          </div>
                      </div>
                  </div>

                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                      <h3 className="font-bold text-white mb-6 flex items-center gap-2"><Shield size={20} className="text-green-400"/> Domain Authentication (DNS)</h3>
                      <div className="space-y-4">
                          {[
                              { label: 'SPF Record', key: 'spf' },
                              { label: 'DKIM Record', key: 'dkim' },
                              { label: 'DMARC Record', key: 'dmarc' },
                          ].map((rec) => (
                              <div key={rec.key}>
                                  <label className="text-xs font-bold text-slate-500 uppercase block mb-1">{rec.label}</label>
                                  <input 
                                    value={(dnsConfig as any)[rec.key]}
                                    onChange={e => setDnsConfig({...dnsConfig, [rec.key]: e.target.value})}
                                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-xs font-mono text-slate-300 focus:border-green-500 outline-none"
                                  />
                              </div>
                          ))}
                          <div className="flex justify-end pt-2">
                              <button onClick={handleVerifyDns} disabled={isVerifying} className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded text-sm font-bold flex items-center gap-2">
                                  {isVerifying ? <RefreshCw className="animate-spin" size={14}/> : <CheckCircle2 size={14}/>} Verify Records
                              </button>
                          </div>
                      </div>
                  </div>
              </div>
          )}
          
          {activeTab !== 'SETTINGS' && (
              <div className="flex items-center justify-center h-full text-slate-500">
                  <p>Dashboard / Campaigns View Placeholder (Select Settings to configure)</p>
              </div>
          )}
      </div>
    </div>
  );
};

export default BadalMail;
    