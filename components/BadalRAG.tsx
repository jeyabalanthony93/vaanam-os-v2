
import React, { useState, useEffect, useRef } from 'react';
import { Database, Search, Layers, Settings, FileText, UploadCloud, RefreshCw, Shield, Play, Plus, Trash2, Cpu, Activity, Zap, Server, Lock, ExternalLink, ArrowRight, MessageSquare, Bot, User, ChevronRight } from 'lucide-react';
import { KnowledgeBase, RAGSearchResult } from '../types';
import { simulateHybridSearch, simulateRAGIngestion, ragAutomatedResponse } from '../services/geminiService';

const BadalRAG: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'PIPELINES' | 'VECTOR_DB' | 'PLAYGROUND' | 'GOVERNANCE' | 'ASSISTANT'>('OVERVIEW');
  
  // Knowledge Bases
  const [kbs, setKbs] = useState<KnowledgeBase[]>([
      { id: 'kb1', name: 'Technical Docs', status: 'ACTIVE', docCount: 1450, vectorCount: 45000, lastUpdated: '2m ago', accessLevel: 'PUBLIC' },
      { id: 'kb2', name: 'Legal Contracts', status: 'ACTIVE', docCount: 300, vectorCount: 12000, lastUpdated: '1d ago', accessLevel: 'RESTRICTED' },
      { id: 'kb3', name: 'HR Policies', status: 'SYNCING', docCount: 50, vectorCount: 1500, lastUpdated: 'Just now', accessLevel: 'PRIVATE' },
  ]);

  // Search State
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<RAGSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Ingestion State
  const [ingestFile, setIngestFile] = useState<string | null>(null);
  const [ingestProgress, setIngestProgress] = useState(0);
  const [ingestLog, setIngestLog] = useState<string[]>([]);

  // Assistant State
  const [chatHistory, setChatHistory] = useState<{role: 'user' | 'assistant', content: string, steps?: any[]}[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isAssistantThinking, setIsAssistantThinking] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
      if (chatEndRef.current) {
          chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
      }
  }, [chatHistory, isAssistantThinking]);

  const handleSearch = async () => {
      if (!query.trim()) return;
      setIsSearching(true);
      const res = await simulateHybridSearch(query);
      setResults(res);
      setIsSearching(false);
  };

  const startIngestion = async () => {
      setIngestProgress(10);
      setIngestLog(['[Unstructured] Extracting text from PDF...', '[Unstructured] OCR processing images...']);
      await new Promise(r => setTimeout(r, 1000));
      
      setIngestProgress(40);
      setIngestLog(prev => [...prev, '[BadalChain] Native Recursive Chunking (512 tokens)...']);
      await new Promise(r => setTimeout(r, 1000));

      setIngestProgress(70);
      setIngestLog(prev => [...prev, '[Neural Bridge] Generating Embeddings (Badal-Embed-v3) on Virtual Tensor Cores...']);
      await new Promise(r => setTimeout(r, 1000));

      setIngestProgress(100);
      setIngestLog(prev => [...prev, '[Badal VectorDB] Upserting 128 vectors to collection "Technical Docs".', '[SUCCESS] Pipeline completed using Zero-Cost Open Source Stack.']);
      setIngestFile(null);
  };

  const handleChatSubmit = async () => {
      if (!chatInput.trim()) return;
      
      const userMsg = chatInput;
      setChatHistory(prev => [...prev, { role: 'user', content: userMsg }]);
      setChatInput('');
      setIsAssistantThinking(true);

      // Perform Automated RAG Workflow
      const response = await ragAutomatedResponse(userMsg);
      
      setChatHistory(prev => [...prev, {
          role: 'assistant',
          content: response.finalAnswer,
          steps: response.steps
      }]);
      setIsAssistantThinking(false);
  };

  return (
    <div className="h-full flex flex-col bg-slate-950 text-slate-200 font-sans">
      {/* Header */}
      <div className="border-b border-slate-800 bg-slate-900/50 p-6 flex justify-between items-center">
          <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg shadow-green-900/20">
                  <Database size={24} className="text-white"/>
              </div>
              <div>
                  <h1 className="text-xl font-bold text-white">Badal RAG Server</h1>
                  <p className="text-slate-400 text-xs">Vector Database & Knowledge Retrieval Engine</p>
              </div>
          </div>
          <div className="flex bg-slate-800 rounded-lg p-1 border border-slate-700 overflow-x-auto">
              {[
                  { id: 'OVERVIEW', label: 'Overview', icon: Activity },
                  { id: 'ASSISTANT', label: 'AI Assistant', icon: Bot },
                  { id: 'PIPELINES', label: 'Ingestion Pipelines', icon: Layers },
                  { id: 'VECTOR_DB', label: 'Vector Store', icon: Server },
                  { id: 'PLAYGROUND', label: 'Search Playground', icon: Search },
                  { id: 'GOVERNANCE', label: 'Access Control', icon: Shield }
              ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-md text-xs font-bold transition whitespace-nowrap ${activeTab === tab.id ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-white hover:bg-slate-700'}`}
                  >
                      {/* @ts-ignore */}
                      <tab.icon size={14} /> {tab.label}
                  </button>
              ))}
          </div>
      </div>

      <div className="flex-1 overflow-y-auto p-8 bg-slate-950/50">
          
          {activeTab === 'OVERVIEW' && (
              <div className="max-w-6xl mx-auto space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                          <h3 className="text-slate-500 text-xs font-bold uppercase mb-2">Total Vectors</h3>
                          <div className="text-3xl font-bold text-white mb-2">1.2M</div>
                          <div className="flex items-center gap-2 text-emerald-400 text-xs bg-emerald-900/20 px-2 py-1 rounded w-fit">
                              <Activity size={12}/> High Availability
                          </div>
                      </div>
                      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                          <h3 className="text-slate-500 text-xs font-bold uppercase mb-2">Avg Retrieval Latency</h3>
                          <div className="text-3xl font-bold text-white mb-2">12ms</div>
                          <div className="text-xs text-slate-500">P99: 45ms (Hybrid Search)</div>
                      </div>
                      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                          <h3 className="text-slate-500 text-xs font-bold uppercase mb-2">Storage Usage</h3>
                          <div className="text-3xl font-bold text-white mb-2">4.2 GB</div>
                          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2">
                              <div className="bg-blue-500 h-1.5 rounded-full" style={{width: '15%'}}></div>
                          </div>
                      </div>
                  </div>

                  <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                      <div className="p-6 border-b border-slate-800 flex justify-between items-center">
                          <h3 className="font-bold text-white">Active Knowledge Bases</h3>
                          <button className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2">
                              <Plus size={14}/> New Collection
                          </button>
                      </div>
                      <table className="w-full text-left text-sm">
                          <thead className="bg-slate-800/50 text-slate-400">
                              <tr>
                                  <th className="p-4">Name</th>
                                  <th className="p-4">Status</th>
                                  <th className="p-4">Documents</th>
                                  <th className="p-4">Vectors</th>
                                  <th className="p-4">Last Sync</th>
                                  <th className="p-4">Access</th>
                              </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-800 text-slate-300">
                              {kbs.map(kb => (
                                  <tr key={kb.id} className="hover:bg-slate-800/30">
                                      <td className="p-4 font-bold text-white">{kb.name}</td>
                                      <td className="p-4">
                                          <span className={`px-2 py-1 rounded text-[10px] font-bold border ${kb.status === 'ACTIVE' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'}`}>
                                              {kb.status}
                                          </span>
                                      </td>
                                      <td className="p-4">{kb.docCount.toLocaleString()}</td>
                                      <td className="p-4 font-mono text-xs">{kb.vectorCount.toLocaleString()}</td>
                                      <td className="p-4 text-xs text-slate-500">{kb.lastUpdated}</td>
                                      <td className="p-4">
                                          <span className="flex items-center gap-1 text-xs">
                                              {kb.accessLevel === 'PUBLIC' ? <ExternalLink size={12}/> : <Lock size={12}/>}
                                              {kb.accessLevel}
                                          </span>
                                      </td>
                                  </tr>
                              ))}
                          </tbody>
                      </table>
                  </div>
              </div>
          )}

          {activeTab === 'ASSISTANT' && (
              <div className="h-full flex flex-col max-w-4xl mx-auto">
                  <div className="flex-1 bg-slate-900 border border-slate-800 rounded-xl p-6 overflow-y-auto mb-4 relative">
                      {chatHistory.length === 0 ? (
                          <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500 opacity-50">
                              <Bot size={64} className="mb-4"/>
                              <p>Ask me anything. I'll use the RAG pipeline to retrieve facts.</p>
                          </div>
                      ) : (
                          <div className="space-y-6">
                              {chatHistory.map((msg, i) => (
                                  <div key={i} className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                      {msg.role === 'assistant' && (
                                          <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-white flex-shrink-0">
                                              <Bot size={16}/>
                                          </div>
                                      )}
                                      <div className={`max-w-[80%] space-y-2`}>
                                          {msg.role === 'user' ? (
                                              <div className="bg-slate-800 text-white p-3 rounded-xl rounded-tr-none text-sm">
                                                  {msg.content}
                                              </div>
                                          ) : (
                                              <>
                                                  {/* RAG Steps Visualization */}
                                                  {msg.steps && (
                                                      <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 space-y-2 text-xs font-mono mb-2">
                                                          {msg.steps.map((step: any, idx: number) => (
                                                              <div key={idx} className="flex gap-2">
                                                                  <div className={`mt-0.5 w-2 h-2 rounded-full ${step.type === 'RETRIEVAL' ? 'bg-blue-500' : step.type === 'AUGMENTATION' ? 'bg-yellow-500' : 'bg-green-500'}`}></div>
                                                                  <div className="text-slate-400">
                                                                      <span className="font-bold text-slate-300">{step.type}:</span> {step.content}
                                                                  </div>
                                                              </div>
                                                          ))}
                                                      </div>
                                                  )}
                                                  <div className="bg-slate-900 text-slate-200 p-4 rounded-xl rounded-tl-none text-sm leading-relaxed border border-slate-800">
                                                      {msg.content}
                                                  </div>
                                              </>
                                          )}
                                      </div>
                                      {msg.role === 'user' && (
                                          <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-white flex-shrink-0">
                                              <User size={16}/>
                                          </div>
                                      )}
                                  </div>
                              ))}
                              {isAssistantThinking && (
                                  <div className="flex gap-4">
                                      <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-white flex-shrink-0">
                                          <Bot size={16}/>
                                      </div>
                                      <div className="bg-slate-900 p-4 rounded-xl rounded-tl-none border border-slate-800 flex items-center gap-2">
                                          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce"></div>
                                          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                                          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
                                      </div>
                                  </div>
                              )}
                              <div ref={chatEndRef} />
                          </div>
                      )}
                  </div>

                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-2 flex items-center gap-2">
                      <input 
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleChatSubmit()}
                        placeholder="Ask a question..."
                        className="flex-1 bg-transparent text-white px-4 py-3 outline-none text-sm"
                        disabled={isAssistantThinking}
                      />
                      <button 
                        onClick={handleChatSubmit}
                        disabled={isAssistantThinking || !chatInput.trim()}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white p-2 rounded-lg transition disabled:opacity-50"
                      >
                          <ChevronRight size={20}/>
                      </button>
                  </div>
              </div>
          )}

          {activeTab === 'PIPELINES' && (
              <div className="h-full flex gap-8">
                  <div className="w-1/3 bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col">
                      <h3 className="font-bold text-white mb-6 flex items-center gap-2"><UploadCloud size={20} className="text-blue-400"/> Data Ingestion</h3>
                      
                      <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-slate-700 rounded-xl bg-slate-950/50 mb-6 p-8 text-center hover:border-emerald-500 transition cursor-pointer">
                          <FileText size={48} className="text-slate-600 mb-4"/>
                          <p className="text-sm font-bold text-white">Drag & Drop Documents</p>
                          <p className="text-xs text-slate-500 mt-2">Supports PDF, DOCX, MD, CSV, HTML</p>
                          <button onClick={() => setIngestFile('quarterly_report_q3.pdf')} className="mt-4 bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded text-xs font-bold">Select Files</button>
                      </div>

                      {ingestFile && (
                          <div className="bg-slate-800/50 rounded-lg p-4 mb-4">
                              <div className="flex justify-between items-center mb-2">
                                  <span className="text-sm font-bold text-white">{ingestFile}</span>
                                  <span className="text-xs text-slate-400">2.4 MB</span>
                              </div>
                              <button onClick={startIngestion} className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded font-bold text-xs">Start Processing</button>
                          </div>
                      )}

                      <div className="bg-black rounded-lg p-4 font-mono text-xs text-green-400 h-48 overflow-y-auto border border-slate-800">
                          {ingestLog.length === 0 && <span className="text-slate-600">Waiting for job...</span>}
                          {ingestLog.map((l, i) => <div key={i}>{l}</div>)}
                      </div>
                  </div>

                  <div className="flex-1 bg-slate-900 border border-slate-800 rounded-xl p-6">
                      <h3 className="font-bold text-white mb-6">Processing Pipeline Visualization</h3>
                      <div className="relative flex flex-col gap-8 items-center justify-center h-full pb-20">
                          {/* Steps */}
                          <div className="flex w-full justify-between items-center relative z-10 px-10">
                              <div className="flex flex-col items-center gap-2">
                                  <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 ${ingestProgress > 0 ? 'bg-emerald-500 border-emerald-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-500'}`}>1</div>
                                  <span className="text-xs font-bold text-slate-400">Extraction (Unstructured)</span>
                              </div>
                              <div className="h-1 flex-1 bg-slate-800 mx-4 relative overflow-hidden"><div className="h-full bg-emerald-500 transition-all duration-500" style={{width: ingestProgress > 25 ? '100%' : '0%'}}></div></div>
                              
                              <div className="flex flex-col items-center gap-2">
                                  <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 ${ingestProgress > 30 ? 'bg-emerald-500 border-emerald-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-500'}`}>2</div>
                                  <span className="text-xs font-bold text-slate-400">Chunking (BadalChain)</span>
                              </div>
                              <div className="h-1 flex-1 bg-slate-800 mx-4 relative overflow-hidden"><div className="h-full bg-emerald-500 transition-all duration-500" style={{width: ingestProgress > 60 ? '100%' : '0%'}}></div></div>

                              <div className="flex flex-col items-center gap-2">
                                  <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 ${ingestProgress > 60 ? 'bg-emerald-500 border-emerald-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-500'}`}>3</div>
                                  <span className="text-xs font-bold text-slate-400">Embedding (Neural Bridge)</span>
                              </div>
                              <div className="h-1 flex-1 bg-slate-800 mx-4 relative overflow-hidden"><div className="h-full bg-emerald-500 transition-all duration-500" style={{width: ingestProgress === 100 ? '100%' : '0%'}}></div></div>

                              <div className="flex flex-col items-center gap-2">
                                  <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 ${ingestProgress === 100 ? 'bg-emerald-500 border-emerald-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-500'}`}>4</div>
                                  <span className="text-xs font-bold text-slate-400">Storage (Qdrant)</span>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          )}

          {activeTab === 'PLAYGROUND' && (
              <div className="h-full flex flex-col max-w-4xl mx-auto">
                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 flex flex-col gap-6">
                      <div className="text-center mb-4">
                          <h2 className="text-2xl font-bold text-white mb-2">Hybrid Search Simulator</h2>
                          <p className="text-slate-400 text-sm">Testing BM25 (Keyword) + Cosine Similarity (Vector) Retrieval</p>
                      </div>

                      <div className="flex gap-2">
                          <div className="relative flex-1">
                              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20}/>
                              <input 
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                placeholder="Ask a question about your documents..."
                                className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-12 pr-4 py-4 text-white text-lg focus:border-emerald-500 outline-none shadow-inner"
                              />
                          </div>
                          <button 
                            onClick={handleSearch}
                            disabled={isSearching}
                            className="bg-emerald-600 hover:bg-emerald-500 text-white px-8 rounded-xl font-bold transition flex items-center gap-2 disabled:opacity-50"
                          >
                              {isSearching ? <RefreshCw className="animate-spin"/> : <ArrowRight/>}
                          </button>
                      </div>

                      <div className="space-y-4">
                          {results.map((res, i) => (
                              <div key={i} className="bg-slate-950 border border-slate-800 p-4 rounded-lg hover:border-emerald-500/30 transition group">
                                  <div className="flex justify-between items-start mb-2">
                                      <div className="flex items-center gap-2">
                                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase ${res.type === 'VECTOR' ? 'bg-purple-900/30 text-purple-400 border-purple-500/30' : res.type === 'KEYWORD' ? 'bg-blue-900/30 text-blue-400 border-blue-500/30' : 'bg-emerald-900/30 text-emerald-400 border-emerald-500/30'}`}>
                                              {res.type} Match
                                          </span>
                                          <span className="text-slate-500 text-xs font-mono">Score: {res.score}</span>
                                      </div>
                                      <div className="text-slate-500 text-xs flex items-center gap-1">
                                          <FileText size={12}/> {res.source} {res.page && `p.${res.page}`}
                                      </div>
                                  </div>
                                  <p className="text-slate-300 text-sm leading-relaxed">
                                      "...{res.content}..."
                                  </p>
                              </div>
                          ))}
                          {results.length === 0 && !isSearching && (
                              <div className="text-center text-slate-600 py-10">
                                  <Zap size={48} className="mx-auto mb-4 opacity-20"/>
                                  <p>Enter a query to see Context Augmentation in action.</p>
                              </div>
                          )}
                      </div>
                  </div>
              </div>
          )}

          {activeTab === 'GOVERNANCE' && (
              <div className="max-w-4xl mx-auto bg-slate-900 border border-slate-800 rounded-xl p-8">
                  <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2"><Shield size={20} className="text-emerald-400"/> Security & Access Policies</h2>
                  
                  <div className="space-y-6">
                      <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg border border-slate-800">
                          <div>
                              <div className="font-bold text-white text-sm">Row-Level Security (RLS)</div>
                              <p className="text-xs text-slate-400">Ensure users only retrieve vectors associated with their Tenant ID.</p>
                          </div>
                          <div className="w-12 h-6 bg-emerald-600 rounded-full relative cursor-pointer"><div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div></div>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg border border-slate-800">
                          <div>
                              <div className="font-bold text-white text-sm">PII Redaction Pipeline</div>
                              <p className="text-xs text-slate-400">Automatically mask emails, phone numbers, and names during ingestion.</p>
                          </div>
                          <div className="w-12 h-6 bg-emerald-600 rounded-full relative cursor-pointer"><div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div></div>
                      </div>

                      <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-800">
                          <div className="font-bold text-white text-sm mb-3">API Access Scopes</div>
                          <div className="space-y-2">
                              {['rag:search', 'rag:ingest', 'rag:admin'].map(scope => (
                                  <div key={scope} className="flex items-center gap-2 text-sm text-slate-300">
                                      <div className="w-4 h-4 rounded bg-emerald-600 flex items-center justify-center"><div className="w-2 h-2 bg-white rounded-sm"></div></div>
                                      <span className="font-mono text-emerald-400">{scope}</span>
                                  </div>
                              ))}
                          </div>
                      </div>
                  </div>
              </div>
          )}

      </div>
    </div>
  );
};

export default BadalRAG;
