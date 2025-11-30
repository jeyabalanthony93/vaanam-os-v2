
import React, { useState, useEffect } from 'react';
import { Mic, Activity, Command, X, Bot, Play } from 'lucide-react';
import { processVoiceCommand } from '../services/geminiService';

const MegamAssistant: React.FC = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState("Hi, I'm Aura. How can I help you?");
  const [wave, setWave] = useState(Array(20).fill(10));

  useEffect(() => {
      let interval: any;
      if (isListening) {
          interval = setInterval(() => {
              setWave(prev => prev.map(() => Math.random() * 40 + 10));
          }, 100);
      } else {
          setWave(Array(20).fill(5));
      }
      return () => clearInterval(interval);
  }, [isListening]);

  const toggleListen = () => {
      if (isListening) {
          setIsListening(false);
          handleCommand(transcript);
      } else {
          setIsListening(true);
          setTranscript('');
          setResponse("Listening...");
          // Simulate speech input
          setTimeout(() => {
              const commands = ["Check server status", "Schedule a meeting", "Play some music", "What's the weather?"];
              setTranscript(commands[Math.floor(Math.random() * commands.length)]);
          }, 2000);
      }
  };

  const handleCommand = async (cmd: string) => {
      setResponse("Processing...");
      const res = await processVoiceCommand(cmd);
      setResponse(res.text);
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-slate-900 to-black text-white p-8 items-center justify-center relative overflow-hidden">
        {/* Visualizer */}
        <div className="flex items-center justify-center gap-1 h-24 mb-12">
            {wave.map((h, i) => (
                <div key={i} className="w-2 bg-cyan-500 rounded-full transition-all duration-100 shadow-[0_0_10px_#06b6d4]" style={{height: `${h}px`}}></div>
            ))}
        </div>

        <div className="text-center mb-12 z-10">
            <h2 className="text-2xl font-light text-slate-300 mb-4">{transcript || "..."}</h2>
            <p className="text-xl font-bold text-white bg-slate-800/50 px-6 py-4 rounded-2xl backdrop-blur-md border border-white/10 shadow-2xl max-w-md mx-auto">
                {response}
            </p>
        </div>

        <button 
            onClick={toggleListen}
            className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 shadow-2xl border-4 ${isListening ? 'bg-red-600 border-red-400 scale-110 shadow-[0_0_50px_#dc2626]' : 'bg-cyan-600 border-cyan-400 hover:scale-105'}`}
        >
            <Mic size={32} className="text-white"/>
        </button>
        
        <p className="mt-8 text-slate-500 text-xs font-mono">Powered by Neural Bridge NLP</p>
    </div>
  );
};

export default MegamAssistant;
