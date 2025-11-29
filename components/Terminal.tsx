import React, { useState, useRef, useEffect } from 'react';
import { Terminal as TerminalIcon, Loader2 } from 'lucide-react';
import { TerminalLine } from '../types';
import { runTerminalCommand } from '../services/geminiService';

const Terminal: React.FC = () => {
  const [lines, setLines] = useState<TerminalLine[]>([
    { type: 'output', content: 'Welcome to Megam OS v2.0.0 (Kernel 6.8.0-megam)' },
    { type: 'output', content: 'Connected to Badal Cloud Infrastructure.' },
    { type: 'output', content: 'Type "help" for available commands.' },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    inputRef.current?.focus();
  }, [lines]);

  const handleCommand = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const cmd = input.trim();
    setLines(prev => [...prev, { type: 'input', content: cmd }]);
    setInput('');
    setIsLoading(true);

    try {
      // Basic client-side commands for instant feedback, else ask AI
      if (cmd === 'clear') {
        setLines([]);
      } else {
        const history = lines.map(l => l.content);
        const output = await runTerminalCommand(cmd, history);
        setLines(prev => [...prev, { type: 'output', content: output }]);
      }
    } catch (err) {
      setLines(prev => [...prev, { type: 'error', content: 'System Error: Command execution failed.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-900/90 rounded-lg border border-slate-700 font-mono text-sm shadow-2xl overflow-hidden backdrop-blur-sm">
      <div className="flex items-center justify-between px-4 py-2 bg-slate-800 border-b border-slate-700">
        <div className="flex items-center gap-2 text-slate-300">
          <TerminalIcon size={16} />
          <span className="font-semibold">root@megam-cloud:~</span>
        </div>
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
          <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
        </div>
      </div>
      
      <div className="flex-1 p-4 overflow-y-auto space-y-2 text-slate-300" onClick={() => inputRef.current?.focus()}>
        {lines.map((line, idx) => (
          <div key={idx} className={`${line.type === 'error' ? 'text-red-400' : line.type === 'input' ? 'text-cyan-400 font-bold' : 'text-slate-300'} whitespace-pre-wrap`}>
            {line.type === 'input' && <span className="text-green-500 mr-2">➜ ~</span>}
            {line.content}
          </div>
        ))}
        {isLoading && (
          <div className="flex items-center gap-2 text-slate-500">
            <Loader2 className="animate-spin" size={14} />
            Processing...
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleCommand} className="p-2 bg-slate-900 border-t border-slate-800 flex items-center gap-2">
        <span className="text-green-500 font-bold">➜</span>
        <span className="text-cyan-500 font-bold">~</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 bg-transparent outline-none text-slate-100 placeholder-slate-600"
          placeholder="Enter command..."
          autoFocus
        />
      </form>
    </div>
  );
};

export default Terminal;