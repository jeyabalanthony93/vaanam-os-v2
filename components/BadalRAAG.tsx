
import React, { useState, useEffect, useRef } from 'react';
import { Music, Mic, Radio, Layers, Zap, Play, Pause, Download, Sliders, Wand2, UploadCloud, Activity, Speaker, FileAudio, CheckCircle2, RefreshCw, Settings, Video, Mic2, ScrollText, Repeat, Monitor, Box, Volume2, Square, Save, HardDrive } from 'lucide-react';
import { generateMusicTrack, separateAudioStems, connectCloudSpeaker } from '../services/geminiService';

// --- Audio Engine Types ---
interface AudioTrack {
    id: number;
    name: string;
    type: 'OSC' | 'NOISE';
    freq: number; // Base frequency for oscillator
    wave: OscillatorType;
    gainNode?: GainNode;
    panNode?: StereoPannerNode;
    oscNode?: OscillatorNode;
    vol: number;
    pan: number;
    mute: boolean;
    solo: boolean;
    color: string;
}

const BadalRAAG: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'STUDIO' | 'CONSOLE' | 'DUBBING' | 'GENERATIVE' | 'RESTORATION'>('STUDIO');
  const [isPlaying, setIsPlaying] = useState(false);
  const [spectrum, setSpectrum] = useState<number[]>(Array(32).fill(5));
  const [showSettings, setShowSettings] = useState(false);
  
  // Audio Context Refs
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const animationRef = useRef<number>(0);

  // Speaker State
  const [speakerStatus, setSpeakerStatus] = useState<'DISCONNECTED' | 'CONNECTING' | 'CONNECTED'>('DISCONNECTED');
  
  // Generative State
  const [genPrompt, setGenPrompt] = useState('');
  const [genDuration, setGenDuration] = useState(30);
  const [isGenerating, setIsGenerating] = useState(false);
  const [genLog, setGenLog] = useState('');
  const [generatedFileUrl, setGeneratedFileUrl] = useState<string | null>(null);

  // Restoration State
  const [uploadFile, setUploadFile] = useState<string | null>(null);
  const [isSplitting, setIsSplitting] = useState(false);
  const [stems, setStems] = useState<string[]>([]);

  // Console State (Tracks)
  const [tracks, setTracks] = useState<AudioTrack[]>([
      { id: 1, name: 'Kick', type: 'OSC', freq: 60, wave: 'sine', vol: 80, pan: 0, mute: false, solo: false, color: 'bg-blue-500' },
      { id: 2, name: 'Snare', type: 'OSC', freq: 200, wave: 'square', vol: 75, pan: 0, mute: false, solo: false, color: 'bg-yellow-500' },
      { id: 3, name: 'HiHat', type: 'OSC', freq: 800, wave: 'sawtooth', vol: 60, pan: 15, mute: false, solo: false, color: 'bg-gray-400' },
      { id: 4, name: 'Bass', type: 'OSC', freq: 100, wave: 'triangle', vol: 85, pan: 0, mute: false, solo: false, color: 'bg-purple-500' },
      { id: 5, name: 'Gtr L', type: 'OSC', freq: 330, wave: 'sawtooth', vol: 70, pan: -45, mute: false, solo: false, color: 'bg-orange-500' },
      { id: 6, name: 'Gtr R', type: 'OSC', freq: 332, wave: 'sawtooth', vol: 70, pan: 45, mute: false, solo: false, color: 'bg-orange-500' },
      { id: 7, name: 'Vox Main', type: 'OSC', freq: 440, wave: 'sine', vol: 90, pan: 0, mute: false, solo: false, color: 'bg-green-500' },
      { id: 8, name: 'Vox Back', type: 'OSC', freq: 550, wave: 'sine', vol: 65, pan: 20, mute: false, solo: false, color: 'bg-green-700' },
  ]);

  // Dubbing State
  const [dubScript, setDubScript] = useState("Narrator: In a world driven by AI, one OS stands alone...\n[Pause for effect]\nNarrator: Megam OS. The future of cloud computing is here.");
  const [isRecording, setIsRecording] = useState(false);
  const [takes, setTakes] = useState(['Take 1 (0:12)', 'Take 2 (0:14)']);

  // Settings State
  const [audioConfig, setAudioConfig] = useState({
      sampleRate: '48000',
      bufferSize: '128',
      driver: 'Neural Bridge ASIO',
      input: 'Cloud Mic (Virtual)',
      output: 'Main Out (1-2)'
  });

  // --- Audio Engine Logic ---

  useEffect(() => {
      // Initialize Audio Context on Mount
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      audioCtxRef.current = new AudioContext();
      
      // Master Bus
      masterGainRef.current = audioCtxRef.current.createGain();
      masterGainRef.current.gain.value = 0.8;
      
      // Analyser
      analyserRef.current = audioCtxRef.current.createAnalyser();
      analyserRef.current.fftSize = 64; // 32 bins
      
      masterGainRef.current.connect(analyserRef.current);
      analyserRef.current.connect(audioCtxRef.current.destination);

      return () => {
          audioCtxRef.current?.close();
      };
  }, []);

  // Playback Control
  useEffect(() => {
      if (isPlaying) {
          startPlayback();
          drawVisualizer();
      } else {
          stopPlayback();
          cancelAnimationFrame(animationRef.current);
          setSpectrum(Array(32).fill(5));
      }
  }, [isPlaying]);

  // Real-time Mixer Updates (Vol/Pan/Mute)
  useEffect(() => {
      tracks.forEach(track => {
          if (track.gainNode) {
              const targetVol = track.mute ? 0 : (track.solo ? 1 : (tracks.some(t => t.solo) ? 0 : track.vol / 100));
              track.gainNode.gain.setTargetAtTime(targetVol, audioCtxRef.current?.currentTime || 0, 0.1);
          }
          if (track.panNode) {
              track.panNode.pan.setTargetAtTime(track.pan / 100, audioCtxRef.current?.currentTime || 0, 0.1);
          }
      });
  }, [tracks]);

  const startPlayback = () => {
      if (!audioCtxRef.current || !masterGainRef.current) return;
      if (audioCtxRef.current.state === 'suspended') audioCtxRef.current.resume();

      // Create Oscillators for each track
      const newTracks = tracks.map(track => {
          const osc = audioCtxRef.current!.createOscillator();
          const gain = audioCtxRef.current!.createGain();
          const pan = audioCtxRef.current!.createStereoPanner();

          osc.type = track.wave;
          // Simple arithmetic to make them sound distinct but harmonious
          osc.frequency.setValueAtTime(track.freq * (1 + Math.random() * 0.01), audioCtxRef.current!.currentTime); 
          
          // Connect graph: Osc -> Gain -> Pan -> Master
          osc.connect(gain);
          gain.connect(pan);
          pan.connect(masterGainRef.current!);

          // Initial Values
          gain.gain.value = track.mute ? 0 : track.vol / 100;
          pan.pan.value = track.pan / 100;

          osc.start();

          // Modulate sound slightly to simulated music
          if (track.name.includes('Kick')) {
              // Pulse effect for kick
              setInterval(() => {
                  try {
                    gain.gain.setValueAtTime(1, audioCtxRef.current!.currentTime);
                    gain.gain.exponentialRampToValueAtTime(0.001, audioCtxRef.current!.currentTime + 0.5);
                  } catch (e) {}
              }, 500);
          }

          return { ...track, oscNode: osc, gainNode: gain, panNode: pan };
      });

      setTracks(newTracks);
  };

  const stopPlayback = () => {
      tracks.forEach(track => {
          if (track.oscNode) {
              try { track.oscNode.stop(); } catch(e) {}
              track.oscNode.disconnect();
          }
      });
      // Reset nodes in state
      setTracks(prev => prev.map(t => ({ ...t, oscNode: undefined, gainNode: undefined, panNode: undefined })));
  };

  const drawVisualizer = () => {
      if (!analyserRef.current) return;
      const bufferLength = analyserRef.current.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const update = () => {
          if (!isPlaying) return;
          analyserRef.current!.getByteFrequencyData(dataArray);
          
          // Convert to percentage for CSS height
          const normalized = Array.from(dataArray).map(val => (val / 255) * 100);
          setSpectrum(normalized);
          
          animationRef.current = requestAnimationFrame(update);
      };
      update();
  };

  const updateTrack = (id: number, key: keyof AudioTrack, value: any) => {
      setTracks(prev => prev.map(t => {
          if (t.id !== id) return t;
          return { ...t, [key]: value };
      }));
  };

  const handleGenerate = async () => {
      if (!genPrompt) return;
      setIsGenerating(true);
      setGenLog('Initializing AudioCraft Model on Neural Bridge...');
      
      // Simulate real delay
      await new Promise(r => setTimeout(r, 2000));
      const res = await generateMusicTrack(genPrompt, genDuration);
      
      setGenLog(res.log + ' [SUCCESS] Audio tensor compiled.');
      setGeneratedFileUrl('blob:simulated_audio_file.wav'); // Fake blob for now
      setIsGenerating(false);
  };

  const handleSaveToDrive = (filename: string) => {
      // Simulate saving to "Badal Storage"
      const link = document.createElement('a');
      link.href = 'data:text/plain;charset=utf-8,Simulated Audio File Content';
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      alert(`Saved "${filename}" to Badal Storage/Music/Projects`);
  };

  const handleSplitStems = async () => {
      if (!uploadFile) return;
      setIsSplitting(true);
      const res = await separateAudioStems(uploadFile);
      setStems(res);
      setIsSplitting(false);
  };

  const handleConnectSpeaker = async () => {
      setSpeakerStatus('CONNECTING');
      const res = await connectCloudSpeaker('Badal_Monitor_X1');
      setSpeakerStatus('CONNECTED');
  };

  return (
    <div className="h-full flex flex-col bg-[#0f0f13] text-slate-200 font-sans selection:bg-pink-500 selection:text-white relative">
      
      {/* Settings Modal */}
      {showSettings && (
          <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center animate-in fade-in duration-200">
              <div className="bg-[#18181b] border border-white/10 rounded-xl w-full max-w-lg shadow-2xl p-6">
                  <div className="flex justify-between items-center mb-6">
                      <h2 className="text-xl font-bold text-white flex items-center gap-2"><Settings size={20}/> Audio Engine Configuration</h2>
                      <button onClick={() => setShowSettings(false)}><Square size={20} className="text-slate-500 hover:text-white"/></button>
                  </div>
                  <div className="space-y-4">
                      <div>
                          <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Driver Type</label>
                          <select className="w-full bg-black border border-white/10 rounded p-2 text-sm text-white" value={audioConfig.driver} onChange={e => setAudioConfig({...audioConfig, driver: e.target.value})}>
                              <option>Neural Bridge ASIO</option>
                              <option>CoreAudio (Virtual)</option>
                              <option>WebAudio API</option>
                          </select>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                          <div>
                              <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Sample Rate</label>
                              <select className="w-full bg-black border border-white/10 rounded p-2 text-sm text-white" value={audioConfig.sampleRate} onChange={e => setAudioConfig({...audioConfig, sampleRate: e.target.value})}>
                                  <option value="44100">44.1 kHz</option>
                                  <option value="48000">48 kHz (Video)</option>
                                  <option value="96000">96 kHz (High-Res)</option>
                                  <option value="192000">192 kHz (Mastering)</option>
                              </select>
                          </div>
                          <div>
                              <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Buffer Size</label>
                              <select className="w-full bg-black border border-white/10 rounded p-2 text-sm text-white" value={audioConfig.bufferSize} onChange={e => setAudioConfig({...audioConfig, bufferSize: e.target.value})}>
                                  <option value="32">32 samples (0.7ms)</option>
                                  <option value="64">64 samples (1.3ms)</option>
                                  <option value="128">128 samples (2.7ms)</option>
                                  <option value="512">512 samples (10ms)</option>
                              </select>
                          </div>
                      </div>
                      <div className="p-3 bg-pink-900/20 border border-pink-500/30 rounded text-xs text-pink-300">
                          <strong>Note:</strong> Neural Bridge hardware acceleration is enabled. Latency is virtually zero.
                      </div>
                  </div>
                  <div className="mt-6 flex justify-end">
                      <button onClick={() => setShowSettings(false)} className="px-4 py-2 bg-pink-600 text-white rounded font-bold text-sm hover:bg-pink-500">Apply Settings</button>
                  </div>
              </div>
          </div>
      )}

      {/* Header */}
      <div className="h-16 border-b border-white/10 bg-[#18181b] flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center gap-4">
              <div className="p-2 bg-pink-600 rounded-lg text-white shadow-[0_0_15px_rgba(219,39,119,0.4)]">
                  <Music size={24} />
              </div>
              <div>
                  <h1 className="text-xl font-bold text-white tracking-tight">BadalRAAG</h1>
                  <p className="text-[10px] text-pink-400 font-mono flex items-center gap-2">
                      <Zap size={10} className="fill-current"/> AI Audio Workstation
                  </p>
              </div>
          </div>
          
          <div className="flex items-center gap-4">
              <button 
                onClick={handleConnectSpeaker}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-bold transition ${speakerStatus === 'CONNECTED' ? 'bg-green-500/10 border-green-500/50 text-green-400' : 'bg-black/40 border-white/10 text-slate-400 hover:text-white'}`}
              >
                  <Speaker size={14} className={speakerStatus === 'CONNECTING' ? 'animate-pulse' : ''}/>
                  {speakerStatus === 'CONNECTED' ? 'Badal Monitors Active' : speakerStatus === 'CONNECTING' ? 'Pairing...' : 'Connect Cloud Speaker'}
              </button>

              <button onClick={() => setShowSettings(true)} className="p-2 hover:bg-white/10 rounded-full text-slate-400 hover:text-white transition">
                  <Settings size={18}/>
              </button>
          </div>

          <div className="flex bg-[#09090b] rounded-lg p-1 border border-white/10">
              {[
                  { id: 'STUDIO', icon: Layers, label: 'Timeline' },
                  { id: 'CONSOLE', icon: Sliders, label: 'Console' },
                  { id: 'DUBBING', icon: Mic2, label: 'Dubbing' },
                  { id: 'GENERATIVE', icon: Wand2, label: 'Gen Lab' },
                  { id: 'RESTORATION', icon: Activity, label: 'Restore' },
              ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-md text-xs font-bold transition ${activeTab === tab.id ? 'bg-pink-600 text-white shadow' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                  >
                      {/* @ts-ignore */}
                      <tab.icon size={14} /> {tab.label}
                  </button>
              ))}
          </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
          {/* Main Workspace */}
          <div className="flex-1 flex flex-col min-w-0 bg-[#09090b]">
              
              {/* Top Visualizer Bar (Global) */}
              <div className="h-24 bg-gradient-to-b from-black to-[#09090b] flex items-end justify-center gap-1 px-8 pb-4 relative overflow-hidden border-b border-white/5 shrink-0">
                  <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:20px_20px]"></div>
                  {spectrum.map((val, i) => (
                      <div 
                        key={i} 
                        className="w-full bg-gradient-to-t from-pink-600 to-cyan-400 rounded-t-sm transition-all duration-75 ease-out opacity-80 shadow-[0_0_10px_rgba(236,72,153,0.5)]"
                        style={{ height: `${val}%`, width: `${100 / 32}%` }}
                      ></div>
                  ))}
                  <div className="absolute bottom-2 left-4 text-[10px] font-mono text-slate-500">SPECTRUM ANALYZER // L-R 20Hz-20kHz // ACTIVE</div>
              </div>

              {/* Content Area */}
              <div className="flex-1 overflow-y-auto p-8 relative">
                  
                  {activeTab === 'STUDIO' && (
                      <div className="h-full flex flex-col gap-4">
                          <div className="flex justify-between items-center mb-4">
                              <h2 className="text-white font-bold">Multitrack Timeline</h2>
                              <button onClick={() => handleSaveToDrive('project_mixdown.wav')} className="text-xs bg-slate-800 hover:bg-slate-700 text-white px-3 py-1.5 rounded border border-white/10 flex items-center gap-2">
                                  <Save size={14}/> Save Project
                              </button>
                          </div>
                          {/* Tracks */}
                          {tracks.slice(0, 4).map((track, i) => (
                              <div key={i} className="h-24 bg-[#18181b] rounded-lg border border-white/5 flex overflow-hidden group hover:border-white/20 transition">
                                  <div className="w-48 bg-[#1f1f23] border-r border-white/5 p-3 flex flex-col justify-between">
                                      <div className="flex justify-between items-center">
                                          <span className="font-bold text-sm text-white">{track.name}</span>
                                          <Sliders size={14} className="text-slate-500 hover:text-white cursor-pointer" onClick={() => setActiveTab('CONSOLE')}/>
                                      </div>
                                      <div className="flex gap-2">
                                          <button 
                                            onClick={() => updateTrack(track.id, 'mute', !track.mute)}
                                            className={`w-6 h-6 rounded text-[10px] font-bold border ${track.mute ? 'bg-red-600 text-white border-red-500' : 'bg-black/50 text-red-400 border-red-900/30'}`}
                                          >M</button>
                                          <button 
                                            onClick={() => updateTrack(track.id, 'solo', !track.solo)}
                                            className={`w-6 h-6 rounded text-[10px] font-bold border ${track.solo ? 'bg-yellow-600 text-white border-yellow-500' : 'bg-black/50 text-yellow-400 border-yellow-900/30'}`}
                                          >S</button>
                                      </div>
                                  </div>
                                  <div className="flex-1 relative bg-[#121214]">
                                      {/* Waveform Mockup */}
                                      <div className="absolute inset-y-2 left-0 right-0 flex items-center opacity-50 px-2">
                                          {Array.from({length: 50}).map((_, j) => (
                                              <div key={j} className={`w-1 mx-px rounded-full ${track.color}`} style={{height: `${Math.random() * 80 + 10}%`}}></div>
                                          ))}
                                      </div>
                                      {/* Playhead */}
                                      {isPlaying && <div className="absolute top-0 bottom-0 w-px bg-white animate-[scan_4s_linear_infinite]"></div>}
                                  </div>
                              </div>
                          ))}
                      </div>
                  )}

                  {activeTab === 'CONSOLE' && (
                      <div className="h-full overflow-x-auto">
                          <div className="flex gap-4 min-w-max h-full pb-4">
                              {tracks.map(ch => (
                                  <div key={ch.id} className="w-24 bg-[#18181b] border border-white/10 rounded-lg flex flex-col p-2 relative group hover:border-white/20 transition">
                                      {/* Input/Gain */}
                                      <div className="h-16 flex flex-col items-center justify-center border-b border-white/5 mb-2">
                                          <div className="w-10 h-10 rounded-full border-2 border-slate-600 relative rotate-45 transform cursor-pointer">
                                              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-3 bg-white"></div>
                                          </div>
                                          <span className="text-[10px] text-slate-500 mt-1">GAIN</span>
                                      </div>
                                      
                                      {/* EQ Mini */}
                                      <div className="h-16 bg-black/30 rounded mb-2 border border-white/5 flex items-end justify-center px-1 pb-1 gap-0.5">
                                          {[1,2,3,4,5].map(i => <div key={i} className="w-3 bg-green-500/50 rounded-t-sm" style={{height: `${Math.random()*100}%`}}></div>)}
                                      </div>

                                      {/* Pan */}
                                      <div className="flex flex-col items-center mb-4">
                                          <input 
                                            type="range" min="-100" max="100" value={ch.pan} 
                                            onChange={(e) => updateTrack(ch.id, 'pan', parseInt(e.target.value))}
                                            className="w-16 accent-pink-500 h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                                          />
                                          <span className="text-[9px] text-slate-500 mt-1">{ch.pan === 0 ? 'C' : ch.pan > 0 ? `R${ch.pan}` : `L${Math.abs(ch.pan)}`}</span>
                                      </div>

                                      {/* Mute/Solo */}
                                      <div className="flex gap-1 mb-4 justify-center">
                                          <button 
                                            onClick={() => updateTrack(ch.id, 'mute', !ch.mute)}
                                            className={`w-8 h-6 rounded text-[10px] font-bold border transition ${ch.mute ? 'bg-red-600 text-white border-red-500' : 'bg-[#27272a] text-slate-400 border-transparent hover:bg-[#3f3f46]'}`}
                                          >M</button>
                                          <button 
                                            onClick={() => updateTrack(ch.id, 'solo', !ch.solo)}
                                            className={`w-8 h-6 rounded text-[10px] font-bold border transition ${ch.solo ? 'bg-yellow-600 text-white border-yellow-500' : 'bg-[#27272a] text-slate-400 border-transparent hover:bg-[#3f3f46]'}`}
                                          >S</button>
                                      </div>

                                      {/* Fader Track */}
                                      <div className="flex-1 bg-[#09090b] rounded relative mx-auto w-10 border border-white/5 flex justify-center mb-2">
                                          {/* Fader Cap */}
                                          <input 
                                            type="range" orient="vertical" min="0" max="100" value={ch.vol}
                                            onChange={(e) => updateTrack(ch.id, 'vol', parseInt(e.target.value))}
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-ns-resize z-20"
                                            style={{appearance: 'slider-vertical'}}
                                          />
                                          <div className="absolute w-8 h-12 bg-gradient-to-b from-[#3f3f46] to-[#18181b] border border-slate-500 rounded shadow-lg z-10 pointer-events-none" style={{bottom: `${ch.vol}%`, transform: 'translateY(50%)'}}>
                                              <div className="w-full h-px bg-white/50 mt-6"></div>
                                          </div>
                                          {/* Tick marks */}
                                          <div className="h-full flex flex-col justify-between py-2 w-full px-2 opacity-30">
                                              {[...Array(10)].map((_, i) => <div key={i} className="w-full h-px bg-slate-500"></div>)}
                                          </div>
                                      </div>

                                      <div className="text-center bg-black/40 py-2 rounded border border-white/5">
                                          <div className="text-xs font-bold text-white truncate px-1">{ch.name}</div>
                                          <div className="text-[10px] text-green-400 font-mono">-{(100 - ch.vol)/2} dB</div>
                                      </div>
                                  </div>
                              ))}
                              
                              {/* Master Bus */}
                              <div className="w-28 bg-[#18181b] border border-pink-500/30 rounded-lg flex flex-col p-2 relative ml-4 shadow-[0_0_20px_rgba(219,39,119,0.1)]">
                                  <div className="text-center mb-4 pt-2">
                                      <span className="text-xs font-bold text-pink-500 uppercase tracking-widest">Master</span>
                                  </div>
                                  <div className="flex-1 flex gap-2 justify-center px-2">
                                      {/* L/R Meters */}
                                      <div className="w-4 bg-black/50 rounded-full relative overflow-hidden">
                                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-green-500 via-yellow-500 to-red-500 transition-all duration-75" style={{height: isPlaying ? '85%' : '0%'}}></div>
                                      </div>
                                      <div className="w-4 bg-black/50 rounded-full relative overflow-hidden">
                                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-green-500 via-yellow-500 to-red-500 transition-all duration-75" style={{height: isPlaying ? '82%' : '0%'}}></div>
                                      </div>
                                  </div>
                                  <div className="mt-2 text-center">
                                      <div className="w-12 h-12 rounded-full border-2 border-slate-500 mx-auto mb-2 flex items-center justify-center">
                                          <span className="text-[10px] font-bold">MAIN</span>
                                      </div>
                                  </div>
                              </div>
                          </div>
                      </div>
                  )}

                  {activeTab === 'DUBBING' && (
                      <div className="h-full flex gap-6">
                          {/* Video Preview */}
                          <div className="flex-1 flex flex-col gap-6">
                              <div className="aspect-video bg-black rounded-xl border border-white/10 flex items-center justify-center relative overflow-hidden shadow-2xl">
                                  <Video size={48} className="text-slate-600 mb-2"/>
                                  <p className="text-slate-500 text-xs font-mono absolute bottom-4">NO SIGNAL / SYNC MODE</p>
                                  {/* Timecode Overlay */}
                                  <div className="absolute top-4 right-4 font-mono text-xl text-red-500 font-bold bg-black/50 px-2 rounded">
                                      00:00:12:04
                                  </div>
                              </div>
                              
                              {/* Waveform Recorder */}
                              <div className="h-48 bg-[#18181b] rounded-xl border border-white/10 p-4 relative overflow-hidden flex items-center justify-center">
                                  {isRecording ? (
                                      <div className="flex gap-1 items-center h-full w-full justify-center">
                                          {Array.from({length: 60}).map((_, i) => (
                                              <div key={i} className="w-1 bg-red-500 rounded-full animate-pulse" style={{height: `${Math.random() * 100}%`}}></div>
                                          ))}
                                      </div>
                                  ) : (
                                      <span className="text-slate-500 text-sm">Ready to Record</span>
                                  )}
                              </div>
                          </div>

                          {/* Script & Controls */}
                          <div className="w-96 flex flex-col gap-6">
                              <div className="flex-1 bg-[#18181b] rounded-xl border border-white/10 flex flex-col overflow-hidden">
                                  <div className="p-3 bg-black/20 border-b border-white/5 flex justify-between items-center">
                                      <h3 className="font-bold text-white text-sm flex items-center gap-2"><ScrollText size={16}/> Teleprompter</h3>
                                      <button className="text-[10px] bg-slate-800 px-2 py-1 rounded text-slate-300">Edit</button>
                                  </div>
                                  <div className="flex-1 p-6 overflow-y-auto">
                                      <p className="text-xl font-medium text-white leading-relaxed whitespace-pre-wrap font-serif">
                                          {dubScript}
                                      </p>
                                  </div>
                              </div>

                              <div className="bg-[#18181b] rounded-xl border border-white/10 p-4">
                                  <div className="flex justify-between items-center mb-4">
                                      <h3 className="font-bold text-white text-sm">Takes</h3>
                                      <span className="text-xs text-slate-500">Session: VO_Final</span>
                                  </div>
                                  <div className="space-y-2 mb-4">
                                      {takes.map((take, i) => (
                                          <div key={i} className="flex justify-between items-center p-2 bg-black/30 rounded border border-white/5 hover:border-pink-500/30 cursor-pointer group">
                                              <span className="text-xs text-slate-300 flex items-center gap-2">
                                                  <Play size={10} className="group-hover:text-pink-500"/> {take}
                                              </span>
                                              <button className="text-[10px] text-slate-500 hover:text-white">Delete</button>
                                          </div>
                                      ))}
                                  </div>
                                  <button 
                                    onClick={() => setIsRecording(!isRecording)}
                                    className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition ${isRecording ? 'bg-red-600 animate-pulse text-white' : 'bg-white text-black hover:bg-slate-200'}`}
                                  >
                                      <div className={`w-3 h-3 rounded-full ${isRecording ? 'bg-white' : 'bg-red-600'}`}></div>
                                      {isRecording ? 'RECORDING...' : 'REC'}
                                  </button>
                              </div>
                          </div>
                      </div>
                  )}

                  {activeTab === 'GENERATIVE' && (
                      <div className="max-w-3xl mx-auto space-y-8">
                          <div className="text-center mb-8">
                              <h2 className="text-3xl font-bold text-white mb-2">AI Music Generator</h2>
                              <p className="text-slate-400">Powered by AudioCraft & MusicGen on Badal Cloud.</p>
                          </div>

                          <div className="bg-[#18181b] p-6 rounded-2xl border border-white/10 space-y-6">
                              <div>
                                  <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Prompt Description</label>
                                  <textarea 
                                    value={genPrompt}
                                    onChange={(e) => setGenPrompt(e.target.value)}
                                    className="w-full bg-black/30 border border-white/10 rounded-xl p-4 text-sm text-white outline-none focus:border-pink-500 transition resize-none h-32"
                                    placeholder="e.g., A lo-fi chill hop beat with jazzy piano chords and rain ambient noise..."
                                  />
                              </div>
                              
                              <div className="flex items-center gap-4">
                                  <div className="flex-1">
                                      <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Duration: {genDuration}s</label>
                                      <input type="range" min="5" max="60" value={genDuration} onChange={e => setGenDuration(parseInt(e.target.value))} className="w-full accent-pink-500"/>
                                  </div>
                                  <button 
                                    onClick={handleGenerate}
                                    disabled={isGenerating || !genPrompt}
                                    className="px-8 py-3 bg-pink-600 hover:bg-pink-500 text-white rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-pink-900/20 disabled:opacity-50"
                                  >
                                      {isGenerating ? <RefreshCw className="animate-spin"/> : <Wand2/>}
                                      {isGenerating ? 'Synthesizing...' : 'Generate'}
                                  </button>
                              </div>

                              {genLog && (
                                  <div className="p-4 bg-black/50 rounded-lg font-mono text-xs text-green-400 border border-white/5">
                                      {genLog}
                                  </div>
                              )}

                              {generatedFileUrl && (
                                  <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-xl flex items-center justify-between">
                                      <div className="flex items-center gap-3">
                                          <div className="p-2 bg-green-500 rounded-full text-black"><CheckCircle2 size={16}/></div>
                                          <div>
                                              <div className="font-bold text-sm text-white">Generation Complete</div>
                                              <div className="text-xs text-green-400">Ready to download</div>
                                          </div>
                                      </div>
                                      <button 
                                        onClick={() => handleSaveToDrive('generated_track.wav')}
                                        className="px-4 py-2 bg-white text-black rounded-lg font-bold text-xs hover:bg-slate-200 flex items-center gap-2"
                                      >
                                          <HardDrive size={14}/> Save to Badal Storage
                                      </button>
                                  </div>
                              )}
                          </div>
                      </div>
                  )}

                  {activeTab === 'RESTORATION' && (
                      <div className="max-w-3xl mx-auto space-y-8">
                          <div className="text-center mb-8">
                              <h2 className="text-3xl font-bold text-white mb-2">Stem Separation & Cleanup</h2>
                              <p className="text-slate-400">Isolate vocals and instruments using UVR (Ultimate Vocal Remover) algorithms.</p>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                              <div 
                                className="border-2 border-dashed border-white/10 rounded-2xl p-8 flex flex-col items-center justify-center text-center hover:border-pink-500/50 hover:bg-white/5 transition cursor-pointer h-64"
                                onClick={() => setUploadFile('demo_song.mp3')}
                              >
                                  {uploadFile ? (
                                      <>
                                        <FileAudio size={48} className="text-pink-500 mb-4"/>
                                        <p className="font-bold text-white">{uploadFile}</p>
                                        <p className="text-xs text-slate-500">Ready to process</p>
                                      </>
                                  ) : (
                                      <>
                                        <UploadCloud size={48} className="text-slate-600 mb-4"/>
                                        <p className="font-bold text-white">Upload Audio File</p>
                                        <p className="text-xs text-slate-500">MP3, WAV, FLAC supported</p>
                                      </>
                                  )}
                              </div>

                              <div className="flex flex-col justify-center space-y-4">
                                  <div className="p-4 bg-[#18181b] rounded-xl border border-white/10">
                                      <h3 className="font-bold text-white mb-4">Output Stems</h3>
                                      {stems.length > 0 ? (
                                          <div className="space-y-2">
                                              {stems.map(stem => (
                                                  <div key={stem} className="flex justify-between items-center p-2 bg-black/30 rounded border border-white/5">
                                                      <span className="text-sm text-slate-300">{stem}</span>
                                                      <button onClick={() => handleSaveToDrive(stem)} className="p-1 hover:text-white text-slate-500"><Download size={14}/></button>
                                                  </div>
                                              ))}
                                          </div>
                                      ) : (
                                          <p className="text-xs text-slate-500 italic">No stems generated yet.</p>
                                      )}
                                  </div>
                                  <button 
                                    onClick={handleSplitStems}
                                    disabled={!uploadFile || isSplitting}
                                    className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 disabled:opacity-50"
                                  >
                                      {isSplitting ? <RefreshCw className="animate-spin"/> : <Layers/>}
                                      {isSplitting ? 'Separating...' : 'Separate Stems'}
                                  </button>
                              </div>
                          </div>
                      </div>
                  )}

              </div>
          </div>

          {/* Transport Bar */}
          <div className="h-20 bg-[#121214] border-t border-white/10 flex items-center justify-between px-8 shrink-0 relative z-20">
              <div className="flex items-center gap-4">
                  <button className={`p-2 rounded-full transition ${isPlaying ? 'bg-pink-600 text-white' : 'hover:bg-white/10 text-slate-400 hover:text-white'}`}>
                      <Play size={20} fill="currentColor" onClick={() => setIsPlaying(!isPlaying)}/>
                  </button>
                  <button onClick={() => setIsPlaying(false)} className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition">
                      <Square size={18} fill="currentColor"/>
                  </button>
                  <button className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition"><Repeat size={18}/></button>
                  
                  <div className="flex flex-col ml-4">
                      <span className="text-xs font-bold text-white">Master Output</span>
                      <span className="text-[10px] font-mono text-green-400">{isPlaying ? '-6.2 dB' : '-inf dB'}</span>
                  </div>
              </div>

              <div className="flex-1 max-w-xl px-8">
                  <div className="w-full h-1 bg-white/10 rounded-full relative overflow-hidden group cursor-pointer">
                      <div className={`h-full bg-pink-500 w-1/3 relative ${isPlaying ? 'animate-[scan_10s_linear_infinite]' : ''}`}>
                          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow opacity-0 group-hover:opacity-100 transition"></div>
                      </div>
                  </div>
                  <div className="flex justify-between text-[10px] font-mono text-slate-600 mt-1">
                      <span>00:00:00</span>
                      <span>03:45:00</span>
                  </div>
              </div>

              <div className="flex items-center gap-4">
                  <Monitor size={18} className={speakerStatus === 'CONNECTED' ? 'text-green-400' : 'text-slate-500'} />
                  <Speaker size={18} className="text-slate-400"/>
                  <div className="w-24 h-1 bg-white/10 rounded-full">
                      <div className="h-full bg-slate-400 w-3/4"></div>
                  </div>
              </div>
          </div>
      </div>
    </div>
  );
};

export default BadalRAAG;
