
import React, { useState } from 'react';
import { Plane, Train, Bus, Hotel, Search, Calendar, MapPin, ArrowRight, CreditCard, Star } from 'lucide-react';
import { searchTravel } from '../services/geminiService';

const MegamTravel: React.FC = () => {
  const [mode, setMode] = useState<'FLIGHT' | 'TRAIN' | 'BUS' | 'HOTEL'>('FLIGHT');
  const [from, setFrom] = useState('New York');
  const [to, setTo] = useState('London');
  const [date, setDate] = useState('2024-12-15');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
      setLoading(true);
      const res = await searchTravel(mode, from, to, date);
      setResults(res);
      setLoading(false);
  };

  return (
    <div className="h-full flex flex-col bg-slate-50 text-slate-900 font-sans">
        {/* Header */}
        <div className="bg-indigo-900 text-white p-6 pb-24">
            <h1 className="text-2xl font-bold mb-4">Megam Travel</h1>
            <div className="flex gap-6 text-sm font-medium opacity-80">
                <button onClick={() => setMode('FLIGHT')} className={`flex items-center gap-2 pb-2 border-b-2 ${mode === 'FLIGHT' ? 'border-white text-white' : 'border-transparent hover:text-white'}`}><Plane size={18}/> Flights</button>
                <button onClick={() => setMode('TRAIN')} className={`flex items-center gap-2 pb-2 border-b-2 ${mode === 'TRAIN' ? 'border-white text-white' : 'border-transparent hover:text-white'}`}><Train size={18}/> Trains</button>
                <button onClick={() => setMode('BUS')} className={`flex items-center gap-2 pb-2 border-b-2 ${mode === 'BUS' ? 'border-white text-white' : 'border-transparent hover:text-white'}`}><Bus size={18}/> Buses</button>
                <button onClick={() => setMode('HOTEL')} className={`flex items-center gap-2 pb-2 border-b-2 ${mode === 'HOTEL' ? 'border-white text-white' : 'border-transparent hover:text-white'}`}><Hotel size={18}/> Hotels</button>
            </div>
        </div>

        {/* Search Box */}
        <div className="px-6 -mt-16">
            <div className="bg-white rounded-xl shadow-xl p-6 flex flex-col gap-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-2 border border-slate-200 rounded-lg">
                        <label className="text-[10px] font-bold text-slate-400 uppercase">From</label>
                        <input value={from} onChange={e => setFrom(e.target.value)} className="w-full font-bold text-slate-800 outline-none"/>
                    </div>
                    <div className="p-2 border border-slate-200 rounded-lg">
                        <label className="text-[10px] font-bold text-slate-400 uppercase">To</label>
                        <input value={to} onChange={e => setTo(e.target.value)} className="w-full font-bold text-slate-800 outline-none"/>
                    </div>
                    <div className="p-2 border border-slate-200 rounded-lg">
                        <label className="text-[10px] font-bold text-slate-400 uppercase">Date</label>
                        <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full font-bold text-slate-800 outline-none"/>
                    </div>
                    <button onClick={handleSearch} className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold text-lg flex items-center justify-center gap-2">
                        {loading ? 'Searching...' : 'Search'}
                    </button>
                </div>
            </div>
        </div>

        {/* Results */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {results.map(res => (
                <div key={res.id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex justify-between items-center hover:border-indigo-500 transition cursor-pointer group">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center text-indigo-600 font-bold">
                            {res.provider[0]}
                        </div>
                        <div>
                            <div className="font-bold text-lg text-slate-800">{res.provider}</div>
                            <div className="text-xs text-slate-500">{res.time} • {res.duration}</div>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-2xl font-bold text-indigo-600">{res.price}</div>
                        <div className="text-xs text-slate-500">{res.stops || res.class}</div>
                    </div>
                </div>
            ))}
            {results.length === 0 && !loading && (
                <div className="text-center text-slate-400 mt-10">
                    Enter details to find the best rates across open-source aggregators.
                </div>
            )}
        </div>
    </div>
  );
};

export default MegamTravel;
