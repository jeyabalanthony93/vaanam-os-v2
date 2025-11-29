
import React from 'react';
import { Terminal, Globe, Briefcase, Server, HardDrive, Mail, Cpu } from 'lucide-react';
import { AppView } from '../../types';

interface TaskbarProps {
  activeApp: AppView | null;
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
  onLaunchApp: (app: AppView) => void;
}

const MenuButton = ({ label, onClick, icon: Icon }: any) => (
    <button 
        onClick={onClick}
        className="flex items-center gap-3 w-full p-2 hover:bg-slate-800 rounded transition text-left text-sm text-slate-300 hover:text-white"
    >
        {Icon && <Icon size={16} />}
        {label}
    </button>
)

const Taskbar: React.FC<TaskbarProps> = ({ activeApp, menuOpen, setMenuOpen, onLaunchApp }) => {
  return (
    <div className="h-12 bg-slate-900 border-t border-slate-800 flex items-center px-4 justify-between z-50 shrink-0 select-none">
        <div className="flex items-center gap-4">
            {/* Start Button */}
            <div className="relative">
                <button 
                    onClick={() => setMenuOpen(!menuOpen)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-md transition ${menuOpen ? 'bg-slate-800 text-white' : 'hover:bg-slate-800 text-slate-300'}`}
                >
                    <div className="grid grid-cols-2 gap-0.5">
                        <div className="w-2 h-2 bg-orange-500 rounded-sm"></div>
                        <div className="w-2 h-2 bg-green-500 rounded-sm"></div>
                        <div className="w-2 h-2 bg-blue-500 rounded-sm"></div>
                        <div className="w-2 h-2 bg-yellow-500 rounded-sm"></div>
                    </div>
                    <span className="text-sm font-bold">Start</span>
                </button>

                {/* Start Menu */}
                {menuOpen && (
                    <div className="absolute bottom-14 left-0 w-64 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-4 animate-in slide-in-from-bottom-2 fade-in duration-200">
                        <div className="mb-4 pb-4 border-b border-slate-800">
                            <div className="text-xs font-bold text-slate-500 uppercase mb-2">System</div>
                            <MenuButton label="Terminal" icon={Terminal} onClick={() => { onLaunchApp(AppView.TERMINAL); setMenuOpen(false); }} />
                            <MenuButton label="Infrastructure" icon={Cpu} onClick={() => { onLaunchApp(AppView.INFRASTRUCTURE); setMenuOpen(false); }} />
                            <MenuButton label="Server Admin" icon={Server} onClick={() => { onLaunchApp(AppView.SERVER); setMenuOpen(false); }} />
                        </div>
                        <div>
                            <div className="text-xs font-bold text-slate-500 uppercase mb-2">Apps</div>
                            <MenuButton label="Megam Browser" icon={Globe} onClick={() => { onLaunchApp(AppView.BROWSER); setMenuOpen(false); }} />
                            <MenuButton label="Workspace" icon={Briefcase} onClick={() => { onLaunchApp(AppView.WORKSPACE); setMenuOpen(false); }} />
                            <MenuButton label="Files" icon={HardDrive} onClick={() => { onLaunchApp(AppView.FILES); setMenuOpen(false); }} />
                            <MenuButton label="Mail" icon={Mail} onClick={() => { onLaunchApp(AppView.BADAL_MAIL); setMenuOpen(false); }} />
                        </div>
                    </div>
                )}
            </div>

            {/* Pinned Apps */}
            <div className="h-6 w-px bg-slate-800 mx-2"></div>
            <div className="flex gap-2">
                {[
                    { id: AppView.TERMINAL, icon: Terminal },
                    { id: AppView.BROWSER, icon: Globe },
                    { id: AppView.FILES, icon: HardDrive },
                ].map(app => (
                    <button 
                        key={app.id}
                        onClick={() => onLaunchApp(app.id)}
                        className={`p-2 rounded hover:bg-slate-800 transition ${activeApp === app.id ? 'bg-slate-800 text-blue-400' : 'text-slate-400'}`}
                    >
                        <app.icon size={18} />
                    </button>
                ))}
            </div>
        </div>

        {/* System Tray */}
        <div className="flex items-center gap-4 text-xs text-slate-400">
            <span>{new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
        </div>
    </div>
  );
};

export default Taskbar;
