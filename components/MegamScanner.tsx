
import React, { useState } from 'react';
import { Scan, QrCode, Download, Copy, RefreshCw, Box, Layers } from 'lucide-react';
import { generateBarcode } from '../services/geminiService';

const MegamScanner: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'GENERATE' | 'SCAN'>('GENERATE');
  const [inputData, setInputData] = useState('https://megamos.com');
  const [generatedImg, setGeneratedImg] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [type, setType] = useState<'QR' | 'BARCODE'>('QR');

  const handleGenerate = async () => {
      setIsGenerating(true);
      const url = await generateBarcode(inputData, type);
      setGeneratedImg(url);
      setIsGenerating(false);
  };

  return (
    <div className="h-full flex flex-col bg-slate-950 text-white font-sans">
        <div className="flex bg-slate-900 p-1 m-4 rounded-lg border border-slate-800">
            <button onClick={() => setActiveTab('GENERATE')} className={`flex-1 py-2 rounded text-sm font-bold ${activeTab === 'GENERATE' ? 'bg-cyan-600 text-white' : 'text-slate-400'}`}>Generate</button>
            <button onClick={() => setActiveTab('SCAN')} className={`flex-1 py-2 rounded text-sm font-bold ${activeTab === 'SCAN' ? 'bg-cyan-600 text-white' : 'text-slate-400'}`}>Scan</button>
        </div>

        {activeTab === 'GENERATE' ? (
            <div className="p-6 flex flex-col gap-6 items-center">
                <div className="w-full space-y-4">
                    <div className="flex gap-4 justify-center">
                        <button onClick={() => setType('QR')} className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 ${type === 'QR' ? 'border-cyan-500 bg-cyan-900/20' : 'border-slate-700 bg-slate-900'}`}>
                            <QrCode size={32}/> <span className="text-xs font-bold">QR Code</span>
                        </button>
                        <button onClick={() => setType('BARCODE')} className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 ${type === 'BARCODE' ? 'border-cyan-500 bg-cyan-900/20' : 'border-slate-700 bg-slate-900'}`}>
                            <Scan size={32}/> <span className="text-xs font-bold">Barcode</span>
                        </button>
                    </div>
                    
                    <input 
                        value={inputData}
                        onChange={e => setInputData(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white outline-none focus:border-cyan-500 transition"
                        placeholder="Enter URL, Text, or ID..."
                    />
                    
                    <button onClick={handleGenerate} disabled={isGenerating} className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 rounded-lg font-bold flex items-center justify-center gap-2">
                        {isGenerating ? <RefreshCw className="animate-spin"/> : <Layers/>} Generate
                    </button>
                </div>

                {generatedImg && (
                    <div className="bg-white p-4 rounded-xl animate-in zoom-in duration-300">
                        <img src={generatedImg} alt="Code" className="w-48 h-48 object-contain"/>
                    </div>
                )}
            </div>
        ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-500">
                <div className="w-64 h-64 border-2 border-dashed border-slate-700 rounded-xl flex items-center justify-center mb-4 relative overflow-hidden">
                    <div className="w-full h-1 bg-red-500 absolute top-0 animate-[scan_2s_linear_infinite]"></div>
                    <Scan size={64} className="opacity-50"/>
                </div>
                <p>Camera feed active. Point at a code.</p>
            </div>
        )}
    </div>
  );
};

export default MegamScanner;
