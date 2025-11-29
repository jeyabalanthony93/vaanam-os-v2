
import React, { useState, useEffect } from 'react';
import { AppView, WindowState } from '../../types';
import { Wifi, Battery, Volume2, Search, Power, ChevronUp, Terminal } from 'lucide-react';

interface TaskbarProps {
  windows: WindowState[];
  activeWindowId: string | null;
  onWindowClick: (id: string) => void;
  onLaunchApp: (appId: AppView) => void;
  onToggleDevConsole?: () => void; // Optional prop
}

const Taskbar: React.FC<TaskbarProps> = ({ windows, activeWindowId, onWindowClick, onLaunchApp, onToggleDevConsole }) => {
  const [time, setTime] = useState(new Date());
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
       setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      {/* Start Menu Overlay */}
      {menuOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)}></div>
          <div className="fixed bottom-14 left-2 w-80 bg-slate-900/90 backdrop-blur-xl border border-slate-700 rounded-xl shadow-2xl z-50 p-4 flex flex-col gap-4 animate-in slide-in-from-bottom-2 duration-200">
             <div className="p-2 border-b border-slate-700 flex items-center gap-3 mb-2">
                 <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center font-bold text-white">M</div>
                 <div>
                    <div className="font-bold text-white">Megam OS</div>
                    <div className="text-xs text-slate-400">Administrator</div>
                 </div>
             </div>
             
             <div className="grid grid-cols-2 gap-2 max-h-[400px] overflow-y-auto">
                <MenuButton label="Terminal" onClick={() => { onLaunchApp(AppView.TERMINAL); setMenuOpen(false); }} />
                <MenuButton label="Megam Browser" onClick={() => { onLaunchApp(AppView.BROWSER); setMenuOpen(false); }} />
                <MenuButton label="Badal Apps" onClick={() => { onLaunchApp(AppView.WORKSPACE); setMenuOpen(false); }} />
                <MenuButton label="Server Admin" onClick={() => { onLaunchApp(AppView.SERVER); setMenuOpen(false); }} />
                <MenuButton label="Badal Storage" onClick={() => { onLaunchApp(AppView.FILES); setMenuOpen(false); }} />
                <MenuButton label="Infrastructure" onClick={() => { onLaunchApp(AppView.INFRASTRUCTURE); setMenuOpen(false); }} />
                <MenuButton label="VPN Manager" onClick={() => { onLaunchApp(AppView.VPN); setMenuOpen(false); }} />
                <MenuButton label="AI Agents" onClick={() => { onLaunchApp(AppView.AGENTS); setMenuOpen(false); }} />
                <MenuButton label="ETL Studio" onClick={() => { onLaunchApp(AppView.ETL); setMenuOpen(false); }} />
                <MenuButton label="Badal Auth" onClick={() => { onLaunchApp(AppView.BADAL_AUTH); setMenuOpen(false); }} />
                <MenuButton label="Megam Automate" onClick={() => { onLaunchApp(AppView.MEGAM_AUTOMATE); setMenuOpen(false); }} />
                <MenuButton label="Megam Studio" onClick={() => { onLaunchApp(AppView.MEGAM_STUDIO); setMenuOpen(false); }} />
                <MenuButton label="BadalRAAG" onClick={() => { onLaunchApp(AppView.BADAL_RAAG); setMenuOpen(false); }} />
                <MenuButton label="BadalPhone" onClick={() => { onLaunchApp(AppView.BADAL_PHONE); setMenuOpen(false); }} />
                <MenuButton label="Megam Marketing" onClick={() => { onLaunchApp(AppView.MEGAM_MARKETING); setMenuOpen(false); }} />
                <MenuButton label="Megam Data Center" onClick={() => { onLaunchApp(AppView.MEGAM_DC); setMenuOpen(false); }} />
                <MenuButton label="Megam Sentinel" onClick={() => { onLaunchApp(AppView.MEGAM_SENTINEL); setMenuOpen(false); }} />
                <MenuButton label="Megam Quantum" onClick={() => { onLaunchApp(AppView.MEGAM_QUANTUM); setMenuOpen(false); }} />
                <MenuButton label="Megam Campus" onClick={() => { onLaunchApp(AppView.MEGAM_CAMPUS); setMenuOpen(false); }} />
             </div>

             <div className="mt-2 pt-3 border-t border-slate-700 flex justify-between items-center text-slate-400">
                <button className="hover:text-white transition flex items-center gap-2 text-sm"><Power size={14} /> Shut Down</button>
             </div>
          </div>
        </>
      )}

      {/* Taskbar Bar */}
      <div className="h-12 bg-slate-900/90 backdrop-blur-md border-t border-slate-700 flex items-center justify-between px-2 fixed bottom-0 left-0 right-0 z-50 select-none">
        <div className="flex items-center gap-2 h-full">
           {/* Start Button */}
           <button 
             onClick={() => setMenuOpen(!menuOpen)}
             className={`h-9 w-9 rounded-lg flex items-center justify-center transition-all ${menuOpen ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-500/50' : 'bg-slate-800 text-cyan-400 hover:bg-slate-700'}`}
           >
              <div className="grid grid-cols-2 gap-0.5">
                  <div className="w-1.5 h-1.5 bg-current rounded-sm"></div>
                  <div className="w-1.5 h-1.5 bg-current rounded-sm"></div>
                  <div className="w-1.5 h-1.5 bg-current rounded-sm"></div>
                  <div className="w-1.5 h-1.5 bg-current rounded-sm"></div>
              </div>
           </button>
           
           {/* Search */}
           <div className="hidden md:flex items-center bg-black/20 rounded-md px-3 h-8 border border-white/5 text-slate-400 hover:bg-black/40 transition w-48 mx-2">
               <Search size={14} className="mr-2" />
               <span className="text-xs">Search...</span>
           </div>

           {/* Running Windows */}
           <div className="flex items-center gap-1 h-full pl-2 border-l border-slate-700/50">
              {windows.map(win => (
                <button 
                   key={win.id}
                   onClick={() => onWindowClick(win.id)}
                   className={`
                      group relative h-9 px-3 rounded-md flex items-center gap-2 transition-all min-w-[120px] max-w-[200px]
                      ${activeWindowId === win.id 
                        ? 'bg-slate-700 text-white shadow-inner border-b-2 border-cyan-500' 
                        : 'hover:bg-slate-800 text-slate-400 hover:text-slate-200'}
                   `}
                >
                   {win.icon && <win.icon size={16} className={activeWindowId === win.id ? 'text-cyan-400' : 'text-slate-500 group-hover:text-slate-300'} />}
                   <span className="text-xs font-medium truncate">{win.title}</span>
                </button>
              ))}
           </div>
        </div>

        {/* System Tray */}
        <div className="flex items-center gap-4 px-2">
           <div className="hidden md:flex items-center gap-3 text-slate-400">
               {onToggleDevConsole && (
                   <button onClick={onToggleDevConsole} className="hover:text-green-400 cursor-pointer" title="Developer Inspection Console">
                       <Terminal size={16}/>
                   </button>
               )}
               <ChevronUp size={16} className="hover:text-white cursor-pointer" />
               <Wifi size={16} className="hover:text-white cursor-pointer" />
               <Volume2 size={16} className="hover:text-white cursor-pointer" />
               <Battery size={16} className="hover:text-white cursor-pointer" />
           </div>
           <div className="flex flex-col items-end justify-center leading-none px-2 hover:bg-slate-800 rounded py-1 cursor-default transition">
              <span className="text-xs font-bold text-slate-200">
                  {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
              <span className="text-[10px] text-slate-500">
                  {time.toLocaleDateString()}
              </span>
           </div>
           <div className="w-1 h-12 border-l border-slate-700 ml-1"></div>
        </div>
      </div>
    </>
  );
};

const MenuButton = ({ label, onClick }: { label: string, onClick: () => void }) => (
    <button 
        onClick={onClick}
        className="w-full text-left px-3 py-2 rounded hover:bg-slate-800 text-slate-300 hover:text-white text-sm font-medium transition"
    >
        {label}
    </button>
)

export default Taskbar;
