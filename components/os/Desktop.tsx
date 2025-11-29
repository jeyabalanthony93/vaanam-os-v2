
import React, { useState } from 'react';
import { AppView } from '../../types';
import { 
  LayoutDashboard, 
  Terminal as TerminalIcon, 
  HardDrive, 
  Briefcase, 
  Network, 
  Shield, 
  Server, 
  Cpu, 
  Globe,
  Workflow,
  GitMerge,
  Package,
  CloudOff,
  UserCheck,
  Book,
  Database,
  Cloud,
  Sun,
  Activity,
  MoreVertical,
  Edit2,
  RefreshCw,
  Image as ImageIcon,
  Music,
  Smartphone,
  Megaphone,
  Box,
  ShieldAlert,
  Atom,
  Palette,
  Building2
} from 'lucide-react';

interface DesktopProps {
  onLaunchApp: (appId: AppView) => void;
}

const DesktopIcon: React.FC<{ 
  label: string; 
  icon: any; 
  onClick: () => void; 
  color?: string;
}> = ({ label, icon: Icon, onClick, color = "text-cyan-400" }) => (
  <button 
    onDoubleClick={onClick}
    className="flex flex-col items-center gap-1 w-20 p-2 rounded-lg hover:bg-white/10 group focus:bg-white/20 transition-all focus:outline-none focus:ring-1 focus:ring-white/30"
  >
    <div className={`p-2.5 rounded-xl shadow-lg bg-slate-900/80 group-hover:scale-110 transition-transform duration-200 border border-slate-700/50 backdrop-blur-sm ${color}`}>
       <Icon size={28} />
    </div>
    <span className="text-[10px] font-medium text-white drop-shadow-md text-center line-clamp-2 leading-tight opacity-90 group-hover:opacity-100">
      {label}
    </span>
  </button>
);

const AppContainer: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="bg-slate-950/30 backdrop-blur-md border border-white/5 rounded-2xl p-4 flex flex-col gap-2 min-w-[200px] h-fit hover:bg-slate-950/40 transition">
        <div className="text-[10px] font-bold text-slate-400 uppercase px-2 mb-1 tracking-wider flex justify-between items-center">
            {title}
            <MoreVertical size={12} className="cursor-pointer hover:text-white"/>
        </div>
        <div className="flex flex-wrap gap-2">
            {children}
        </div>
    </div>
);

const Desktop: React.FC<DesktopProps> = ({ onLaunchApp }) => {
  const [contextMenu, setContextMenu] = useState<{x: number, y: number} | null>(null);
  const [editMode, setEditMode] = useState(false);

  const handleContextMenu = (e: React.MouseEvent) => {
      e.preventDefault();
      setContextMenu({ x: e.clientX, y: e.clientY });
  };

  const closeMenu = () => setContextMenu(null);

  return (
    <div 
        className="absolute inset-0 p-6 flex items-start gap-6 overflow-auto" 
        onContextMenu={handleContextMenu}
        onClick={closeMenu}
    >
       {/* Column 1: Core System & Infrastructure */}
       <div className="flex flex-col gap-6">
           <AppContainer title="Cloud Ops">
               <DesktopIcon label="Server Admin" icon={Server} onClick={() => onLaunchApp(AppView.SERVER)} color="text-indigo-400"/>
               <DesktopIcon label="Infrastructure" icon={Cpu} onClick={() => onLaunchApp(AppView.INFRASTRUCTURE)} color="text-purple-400"/>
               <DesktopIcon label="VPN Manager" icon={Shield} onClick={() => onLaunchApp(AppView.VPN)} color="text-orange-400"/>
               <DesktopIcon label="Megam VDC" icon={Box} onClick={() => onLaunchApp(AppView.MEGAM_DC)} color="text-slate-200"/>
               <DesktopIcon label="Badal Auth" icon={UserCheck} onClick={() => onLaunchApp(AppView.BADAL_AUTH)} color="text-cyan-300"/>
           </AppContainer>

           <AppContainer title="Development">
               <DesktopIcon label="Terminal" icon={TerminalIcon} onClick={() => onLaunchApp(AppView.TERMINAL)} color="text-slate-200"/>
               <DesktopIcon label="Megam Automate" icon={Workflow} onClick={() => onLaunchApp(AppView.MEGAM_AUTOMATE)} color="text-green-400"/>
               <DesktopIcon label="ETL Studio" icon={GitMerge} onClick={() => onLaunchApp(AppView.ETL)} color="text-purple-400"/>
               <DesktopIcon label="Pkg Center" icon={Package} onClick={() => onLaunchApp(AppView.PACKAGE_CENTER)} color="text-rose-400"/>
           </AppContainer>
       </div>

       {/* Column 2: Productivity & Apps */}
       <div className="flex flex-col gap-6">
           <AppContainer title="Productivity">
               <DesktopIcon label="Workspace" icon={Briefcase} onClick={() => onLaunchApp(AppView.WORKSPACE)} color="text-emerald-400"/>
               <DesktopIcon label="Browser" icon={Globe} onClick={() => onLaunchApp(AppView.BROWSER)} color="text-indigo-300"/>
               <DesktopIcon label="Storage" icon={HardDrive} onClick={() => onLaunchApp(AppView.FILES)} color="text-blue-400"/>
               <DesktopIcon label="Offline 360" icon={CloudOff} onClick={() => onLaunchApp(AppView.SS360)} color="text-orange-500"/>
           </AppContainer>

           <AppContainer title="AI Services">
               <DesktopIcon label="Agents" icon={Network} onClick={() => onLaunchApp(AppView.AGENTS)} color="text-teal-400"/>
               <DesktopIcon label="SuckChain" icon={Workflow} onClick={() => onLaunchApp(AppView.AI_STUDIO)} color="text-red-400"/>
               <DesktopIcon label="MCP Server" icon={Globe} onClick={() => onLaunchApp(AppView.MCP_SERVER)} color="text-yellow-400"/>
               <DesktopIcon label="RAG Server" icon={Database} onClick={() => onLaunchApp(AppView.BADAL_RAG)} color="text-emerald-500"/>
           </AppContainer>
       </div>

       {/* Column 3: Misc */}
       <div className="flex flex-col gap-6">
           <AppContainer title="Security">
                <DesktopIcon label="Sentinel" icon={ShieldAlert} onClick={() => onLaunchApp(AppView.MEGAM_SENTINEL)} color="text-red-500"/>
           </AppContainer>

           <AppContainer title="System">
               <DesktopIcon label="Dashboard" icon={LayoutDashboard} onClick={() => onLaunchApp(AppView.DASHBOARD)} color="text-pink-400"/>
               <DesktopIcon label="Docs" icon={Book} onClick={() => onLaunchApp(AppView.DOCS)} color="text-blue-500"/>
               <DesktopIcon label="Megam Campus" icon={Building2} onClick={() => onLaunchApp(AppView.MEGAM_CAMPUS)} color="text-indigo-500"/>
           </AppContainer>

           <AppContainer title="Creative Suite">
               <DesktopIcon label="Megam Studio" icon={Palette} onClick={() => onLaunchApp(AppView.MEGAM_STUDIO)} color="text-violet-400"/>
               <DesktopIcon label="BadalRAAG" icon={Music} onClick={() => onLaunchApp(AppView.BADAL_RAAG)} color="text-pink-600"/>
               <DesktopIcon label="BadalPhone" icon={Smartphone} onClick={() => onLaunchApp(AppView.BADAL_PHONE)} color="text-green-500"/>
           </AppContainer>

           <AppContainer title="Future Tech">
               <DesktopIcon label="Quantum" icon={Atom} onClick={() => onLaunchApp(AppView.MEGAM_QUANTUM)} color="text-violet-500"/>
               <DesktopIcon label="Megam Mktg" icon={Megaphone} onClick={() => onLaunchApp(AppView.MEGAM_MARKETING)} color="text-rose-500"/>
           </AppContainer>
       </div>

       {/* Desktop Widgets (Right Side) */}
       <div className="absolute right-6 top-6 flex flex-col gap-4 w-64 pointer-events-none">
           {/* Clock / Weather Widget */}
           <div className="bg-black/40 backdrop-blur-md rounded-2xl p-6 border border-white/10 text-white pointer-events-auto hover:bg-black/50 transition">
               <div className="flex justify-between items-start mb-4">
                   <div className="flex flex-col">
                       <span className="text-4xl font-bold">{new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                       <span className="text-xs text-slate-400 font-medium">{new Date().toLocaleDateString(undefined, {weekday: 'long', month: 'long', day: 'numeric'})}</span>
                   </div>
                   <Sun className="text-yellow-400" size={32}/>
               </div>
               <div className="flex justify-between items-center text-sm">
                   <span className="flex items-center gap-1"><Cloud size={14} className="text-slate-400"/> 24°C Sunny</span>
                   <span className="text-slate-500">San Francisco</span>
               </div>
           </div>

           {/* System Resource Widget */}
           <div className="bg-black/40 backdrop-blur-md rounded-2xl p-4 border border-white/10 text-white pointer-events-auto hover:bg-black/50 transition">
               <div className="flex items-center gap-2 mb-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
                   <Activity size={14} className="text-green-400"/> System Health
               </div>
               <div className="space-y-3">
                   <div>
                       <div className="flex justify-between text-xs mb-1">
                           <span className="text-slate-300">CPU (Neural)</span>
                           <span className="text-green-400">12%</span>
                       </div>
                       <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                           <div className="h-full bg-green-500 w-[12%] rounded-full"></div>
                       </div>
                   </div>
                   <div>
                       <div className="flex justify-between text-xs mb-1">
                           <span className="text-slate-300">RAM</span>
                           <span className="text-blue-400">34%</span>
                       </div>
                       <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                           <div className="h-full bg-blue-500 w-[34%] rounded-full"></div>
                       </div>
                   </div>
                   <div>
                       <div className="flex justify-between text-xs mb-1">
                           <span className="text-slate-300">Network</span>
                           <span className="text-purple-400">1.2 Gbps</span>
                       </div>
                       <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                           <div className="h-full bg-purple-500 w-[60%] rounded-full"></div>
                       </div>
                   </div>
               </div>
           </div>
       </div>

       {/* Context Menu */}
       {contextMenu && (
           <div 
             className="absolute bg-slate-900 border border-slate-700 rounded-lg shadow-2xl py-1 w-48 z-50 animate-in fade-in zoom-in duration-100"
             style={{ top: contextMenu.y, left: contextMenu.x }}
           >
               <button onClick={() => window.location.reload()} className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white flex items-center gap-2">
                   <RefreshCw size={14}/> Refresh Desktop
               </button>
               <button className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white flex items-center gap-2">
                   <ImageIcon size={14}/> Change Wallpaper
               </button>
               <div className="h-px bg-slate-700 my-1"></div>
               <button onClick={() => setEditMode(!editMode)} className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white flex items-center gap-2">
                   <Edit2 size={14}/> {editMode ? 'Finish Editing' : 'Edit Layout'}
               </button>
               <button className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white flex items-center gap-2">
                   <Server size={14}/> System Info
               </button>
           </div>
       )}
    </div>
  );
};

export default Desktop;
