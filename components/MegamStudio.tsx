
import React, { useState } from 'react';
import { Layout, Type, Image as ImageIcon, Square, Circle, MousePointer2, Layers, Move, Download, Share2, Wand2, RefreshCw, Palette, Grid, Calendar, Clock, CheckCircle2, ArrowRight, X } from 'lucide-react';
import { generateDesignLayout } from '../services/geminiService';
import { DesignLayer } from '../types';

const MegamStudio: React.FC = () => {
  const [layers, setLayers] = useState<DesignLayer[]>([
      { id: 'bg', type: 'RECT', x: 0, y: 0, width: 800, height: 600, fill: '#ffffff', opacity: 1, rotation: 0 },
  ]);
  const [selectedLayerId, setSelectedLayerId] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTool, setActiveTool] = useState<'SELECT' | 'RECT' | 'TEXT' | 'IMAGE'>('SELECT');
  const [showSchedule, setShowSchedule] = useState(false);

  const handleMagicDesign = async () => {
      if (!prompt) return;
      setIsGenerating(true);
      const newLayers = await generateDesignLayout(prompt);
      setLayers(newLayers);
      setIsGenerating(false);
  };

  const addLayer = (type: 'RECT' | 'TEXT' | 'CIRCLE') => {
      const newLayer: DesignLayer = {
          id: Date.now().toString(),
          type,
          x: 100, y: 100,
          width: type === 'TEXT' ? 200 : 100,
          height: type === 'TEXT' ? 50 : 100,
          fill: type === 'TEXT' ? '#000000' : '#3b82f6',
          content: type === 'TEXT' ? 'New Text' : undefined,
          opacity: 1,
          rotation: 0
      };
      setLayers([...layers, newLayer]);
      setSelectedLayerId(newLayer.id);
  };

  const updateLayer = (id: string, updates: Partial<DesignLayer>) => {
      setLayers(prev => prev.map(l => l.id === id ? { ...l, ...updates } : l));
  };

  return (
    <div className="h-full flex flex-col bg-[#1e1e1e] text-slate-200 font-sans">
      
      {/* Header */}
      <div className="h-14 bg-[#2c2c2c] border-b border-[#111] flex justify-between items-center px-4">
          <div className="flex items-center gap-4">
              <div className="bg-gradient-to-r from-pink-500 to-violet-600 p-1.5 rounded-lg">
                  <Palette size={20} className="text-white"/>
              </div>
              <h1 className="font-bold text-white">Megam Studio</h1>
              <div className="h-6 w-px bg-[#444] mx-2"></div>
              <div className="flex gap-1">
                  <button onClick={() => setActiveTool('SELECT')} className={`p-1.5 rounded ${activeTool === 'SELECT' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}><MousePointer2 size={18}/></button>
                  <button onClick={() => addLayer('RECT')} className={`p-1.5 rounded ${activeTool === 'RECT' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}><Square size={18}/></button>
                  <button onClick={() => addLayer('CIRCLE')} className={`p-1.5 rounded ${activeTool === 'RECT' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}><Circle size={18}/></button>
                  <button onClick={() => addLayer('TEXT')} className={`p-1.5 rounded ${activeTool === 'TEXT' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}><Type size={18}/></button>
                  <button className="p-1.5 text-slate-400 hover:text-white"><ImageIcon size={18}/></button>
              </div>
          </div>
          
          <div className="flex items-center gap-3">
              <div className="flex items-center bg-[#111] rounded-lg px-3 py-1.5 border border-[#333]">
                  <Wand2 size={14} className="text-pink-500 mr-2"/>
                  <input 
                    value={prompt}
                    onChange={e => setPrompt(e.target.value)}
                    placeholder="Describe a design..." 
                    className="bg-transparent text-xs outline-none text-white w-48"
                    onKeyDown={e => e.key === 'Enter' && handleMagicDesign()}
                  />
                  <button onClick={handleMagicDesign} disabled={isGenerating} className="ml-2 text-pink-500 hover:text-pink-400">
                      {isGenerating ? <RefreshCw className="animate-spin" size={14}/> : <ArrowRight size={14}/>}
                  </button>
              </div>
              <button onClick={() => setShowSchedule(!showSchedule)} className="bg-white text-black px-4 py-1.5 rounded font-bold text-xs flex items-center gap-2 hover:bg-slate-200">
                  <Share2 size={14}/> Share / Schedule
              </button>
          </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
          {/* Layers Panel */}
          <div className="w-56 bg-[#252526] border-r border-[#111] flex flex-col">
              <div className="p-3 border-b border-[#111] text-xs font-bold text-slate-500 uppercase">Layers</div>
              <div className="flex-1 overflow-y-auto p-2 space-y-1">
                  {layers.slice().reverse().map(layer => (
                      <div 
                        key={layer.id}
                        onClick={() => setSelectedLayerId(layer.id)}
                        className={`p-2 rounded flex items-center gap-2 cursor-pointer text-xs ${selectedLayerId === layer.id ? 'bg-blue-600 text-white' : 'hover:bg-[#333] text-slate-300'}`}
                      >
                          {layer.type === 'RECT' && <Square size={12}/>}
                          {layer.type === 'CIRCLE' && <Circle size={12}/>}
                          {layer.type === 'TEXT' && <Type size={12}/>}
                          {layer.type === 'IMAGE' && <ImageIcon size={12}/>}
                          Layer {layer.id.slice(-4)}
                      </div>
                  ))}
              </div>
          </div>

          {/* Canvas */}
          <div className="flex-1 bg-[#1e1e1e] relative overflow-hidden flex items-center justify-center">
              <div className="w-[800px] h-[600px] bg-white shadow-2xl relative overflow-hidden">
                  {layers.map(layer => (
                      <div
                        key={layer.id}
                        onClick={(e) => { e.stopPropagation(); setSelectedLayerId(layer.id); }}
                        style={{
                            position: 'absolute',
                            left: layer.x,
                            top: layer.y,
                            width: layer.width,
                            height: layer.height,
                            backgroundColor: layer.type === 'IMAGE' ? 'transparent' : layer.fill,
                            backgroundImage: layer.type === 'IMAGE' ? `url(${layer.content})` : 'none',
                            backgroundSize: 'cover',
                            opacity: layer.opacity,
                            transform: `rotate(${layer.rotation}deg)`,
                            border: selectedLayerId === layer.id ? '2px solid #3b82f6' : 'none',
                            borderRadius: layer.type === 'CIRCLE' ? '50%' : '0',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            cursor: 'move'
                        }}
                      >
                          {layer.type === 'TEXT' && (
                              <span style={{color: layer.fill, fontSize: '16px', fontWeight: 'bold'}}>{layer.content}</span>
                          )}
                      </div>
                  ))}
              </div>
          </div>

          {/* Properties Panel */}
          <div className="w-64 bg-[#252526] border-l border-[#111] flex flex-col">
              <div className="p-3 border-b border-[#111] text-xs font-bold text-slate-500 uppercase">Properties</div>
              {selectedLayerId ? (
                  <div className="p-4 space-y-4">
                      {layers.find(l => l.id === selectedLayerId) && (
                          <>
                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <label className="text-[10px] text-slate-500 block mb-1">X</label>
                                    <input className="w-full bg-[#111] border border-[#333] rounded p-1 text-xs text-white" type="number" value={layers.find(l => l.id === selectedLayerId)?.x} onChange={e => updateLayer(selectedLayerId, {x: parseInt(e.target.value)})}/>
                                </div>
                                <div>
                                    <label className="text-[10px] text-slate-500 block mb-1">Y</label>
                                    <input className="w-full bg-[#111] border border-[#333] rounded p-1 text-xs text-white" type="number" value={layers.find(l => l.id === selectedLayerId)?.y} onChange={e => updateLayer(selectedLayerId, {y: parseInt(e.target.value)})}/>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <label className="text-[10px] text-slate-500 block mb-1">W</label>
                                    <input className="w-full bg-[#111] border border-[#333] rounded p-1 text-xs text-white" type="number" value={layers.find(l => l.id === selectedLayerId)?.width} onChange={e => updateLayer(selectedLayerId, {width: parseInt(e.target.value)})}/>
                                </div>
                                <div>
                                    <label className="text-[10px] text-slate-500 block mb-1">H</label>
                                    <input className="w-full bg-[#111] border border-[#333] rounded p-1 text-xs text-white" type="number" value={layers.find(l => l.id === selectedLayerId)?.height} onChange={e => updateLayer(selectedLayerId, {height: parseInt(e.target.value)})}/>
                                </div>
                            </div>
                            <div>
                                <label className="text-[10px] text-slate-500 block mb-1">Fill Color</label>
                                <div className="flex gap-2">
                                    <input type="color" className="bg-transparent border-none h-6 w-6 cursor-pointer" value={layers.find(l => l.id === selectedLayerId)?.fill} onChange={e => updateLayer(selectedLayerId, {fill: e.target.value})}/>
                                    <input className="flex-1 bg-[#111] border border-[#333] rounded p-1 text-xs text-white" value={layers.find(l => l.id === selectedLayerId)?.fill} onChange={e => updateLayer(selectedLayerId, {fill: e.target.value})}/>
                                </div>
                            </div>
                            {layers.find(l => l.id === selectedLayerId)?.type === 'TEXT' && (
                                <div>
                                    <label className="text-[10px] text-slate-500 block mb-1">Content</label>
                                    <input className="w-full bg-[#111] border border-[#333] rounded p-1 text-xs text-white" value={layers.find(l => l.id === selectedLayerId)?.content} onChange={e => updateLayer(selectedLayerId, {content: e.target.value})}/>
                                </div>
                            )}
                          </>
                      )}
                  </div>
              ) : (
                  <div className="p-4 text-xs text-slate-500 text-center">Select a layer</div>
              )}
          </div>
      </div>

      {/* Scheduler Overlay (Buffer Clone) */}
      {showSchedule && (
          <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center animate-in fade-in duration-200">
              <div className="bg-white text-slate-900 rounded-xl w-[500px] shadow-2xl p-6">
                  <div className="flex justify-between items-center mb-6">
                      <h2 className="text-xl font-bold flex items-center gap-2"><Calendar className="text-pink-500"/> Schedule Post</h2>
                      <button onClick={() => setShowSchedule(false)}><X size={20} className="text-slate-400 hover:text-black"/></button>
                  </div>
                  
                  <div className="space-y-4">
                      <div className="flex gap-4">
                          <div className="w-32 h-32 bg-slate-100 rounded-lg flex items-center justify-center border border-slate-200">
                              <ImageIcon className="text-slate-300" size={32}/>
                              <span className="text-[10px] text-slate-400 absolute mt-8">Preview</span>
                          </div>
                          <div className="flex-1">
                              <textarea className="w-full h-32 bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm resize-none outline-none focus:border-blue-500" placeholder="Write a caption for your post..."/>
                          </div>
                      </div>
                      
                      <div className="flex gap-4">
                          <div className="flex-1">
                              <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Date</label>
                              <input type="date" className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-sm"/>
                          </div>
                          <div className="flex-1">
                              <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Time</label>
                              <input type="time" className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-sm"/>
                          </div>
                      </div>

                      <div className="flex gap-2 pt-2">
                          <button className="flex-1 py-2 rounded-lg border border-slate-200 flex items-center justify-center gap-2 text-sm font-bold text-slate-600 hover:bg-slate-50">
                              <span className="w-2 h-2 rounded-full bg-blue-500"></span> Twitter
                          </button>
                          <button className="flex-1 py-2 rounded-lg border border-slate-200 flex items-center justify-center gap-2 text-sm font-bold text-slate-600 hover:bg-slate-50">
                              <span className="w-2 h-2 rounded-full bg-blue-700"></span> LinkedIn
                          </button>
                          <button className="flex-1 py-2 rounded-lg border border-slate-200 flex items-center justify-center gap-2 text-sm font-bold text-slate-600 hover:bg-slate-50">
                              <span className="w-2 h-2 rounded-full bg-pink-500"></span> Instagram
                          </button>
                      </div>

                      <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-500 transition flex items-center justify-center gap-2 mt-4">
                          <Clock size={18}/> Schedule Post
                      </button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default MegamStudio;
