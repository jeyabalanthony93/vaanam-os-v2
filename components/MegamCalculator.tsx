
import React, { useState } from 'react';
import { Calculator, Delete, History, RotateCcw, Equal, Divide, X, Minus, Plus, Percent } from 'lucide-react';

const MegamCalculator: React.FC = () => {
  const [display, setDisplay] = useState('0');
  const [history, setHistory] = useState<string[]>([]);
  const [mode, setMode] = useState<'STANDARD' | 'SCIENTIFIC'>('STANDARD');

  const handlePress = (val: string) => {
      setDisplay(prev => prev === '0' ? val : prev + val);
  };

  const handleOp = (op: string) => {
      setDisplay(prev => prev + ' ' + op + ' ');
  };

  const calculate = () => {
      try {
          // eslint-disable-next-line no-eval
          const res = eval(display.replace('x', '*').replace('÷', '/'));
          setHistory(prev => [`${display} = ${res}`, ...prev].slice(0, 5));
          setDisplay(String(res));
      } catch (e) {
          setDisplay('Error');
      }
  };

  const clear = () => setDisplay('0');

  return (
    <div className="h-full flex flex-col bg-slate-950 text-white font-mono p-4">
        <div className="flex justify-between items-center mb-4 p-2 bg-slate-900 rounded-lg">
            <h2 className="text-sm font-bold flex items-center gap-2"><Calculator size={16}/> Megam Calc</h2>
            <div className="flex gap-2 text-xs">
                <button onClick={() => setMode('STANDARD')} className={`px-2 py-1 rounded ${mode === 'STANDARD' ? 'bg-cyan-600' : 'bg-slate-800'}`}>Std</button>
                <button onClick={() => setMode('SCIENTIFIC')} className={`px-2 py-1 rounded ${mode === 'SCIENTIFIC' ? 'bg-cyan-600' : 'bg-slate-800'}`}>Sci</button>
            </div>
        </div>

        <div className="bg-black/50 p-4 rounded-xl mb-4 text-right">
            <div className="text-xs text-slate-500 h-4 mb-1">{history[0]}</div>
            <div className="text-3xl font-bold tracking-wider">{display}</div>
        </div>

        <div className="flex-1 grid grid-cols-4 gap-3">
            <button onClick={clear} className="col-span-1 bg-red-900/50 text-red-400 rounded-lg font-bold hover:bg-red-900/80">AC</button>
            <button onClick={() => setDisplay(prev => prev.slice(0, -1) || '0')} className="bg-slate-800 rounded-lg hover:bg-slate-700"><Delete size={20} className="mx-auto"/></button>
            <button onClick={() => handleOp('%')} className="bg-slate-800 rounded-lg hover:bg-slate-700"><Percent size={20} className="mx-auto"/></button>
            <button onClick={() => handleOp('/')} className="bg-indigo-600 rounded-lg hover:bg-indigo-500"><Divide size={20} className="mx-auto"/></button>

            {['7','8','9'].map(n => <button key={n} onClick={() => handlePress(n)} className="bg-slate-900 rounded-lg text-xl font-bold hover:bg-slate-800">{n}</button>)}
            <button onClick={() => handleOp('*')} className="bg-indigo-600 rounded-lg hover:bg-indigo-500"><X size={20} className="mx-auto"/></button>

            {['4','5','6'].map(n => <button key={n} onClick={() => handlePress(n)} className="bg-slate-900 rounded-lg text-xl font-bold hover:bg-slate-800">{n}</button>)}
            <button onClick={() => handleOp('-')} className="bg-indigo-600 rounded-lg hover:bg-indigo-500"><Minus size={20} className="mx-auto"/></button>

            {['1','2','3'].map(n => <button key={n} onClick={() => handlePress(n)} className="bg-slate-900 rounded-lg text-xl font-bold hover:bg-slate-800">{n}</button>)}
            <button onClick={() => handleOp('+')} className="bg-indigo-600 rounded-lg hover:bg-indigo-500"><Plus size={20} className="mx-auto"/></button>

            <button onClick={() => handlePress('0')} className="col-span-2 bg-slate-900 rounded-lg text-xl font-bold hover:bg-slate-800">0</button>
            <button onClick={() => handlePress('.')} className="bg-slate-900 rounded-lg text-xl font-bold hover:bg-slate-800">.</button>
            <button onClick={calculate} className="bg-green-600 rounded-lg hover:bg-green-500"><Equal size={20} className="mx-auto"/></button>
        </div>
    </div>
  );
};

export default MegamCalculator;
