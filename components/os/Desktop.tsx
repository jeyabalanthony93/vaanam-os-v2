
import React from 'react';
import { Briefcase, Globe, HardDrive, CloudOff, Mail, Terminal, Server, Shield, Network, Cpu, Database, Music, Smartphone, Megaphone, Box, ShieldAlert, Atom, Workflow, Palette, Building2, Calculator, Mic, Scan, Plane } from 'lucide-react';
import { AppView } from '../../types';

interface DesktopProps {
  onLaunchApp: (app: AppView) => void;
}

const DesktopIcon = ({ label, icon: Icon, onClick, color }: any) => (
    <div 
        onClick={onClick}
        className="flex flex-col items-center gap-2 p-4 rounded-xl hover:bg-white/10 cursor-pointer transition w-24 group"
    >
        <div className={`p-3 rounded-xl bg-slate-900/50 backdrop-blur-md border border-white/10 shadow-lg group-hover:scale-110 transition ${color}`}>
            <Icon size={32} />
        </div>
        <span className="text-xs font-medium text-white text-center drop-shadow-md">{label}</span>
    </div>
)

const AppContainer = ({ title, children }: { title: string, children?: React.ReactNode }) => (
    <div className="mb-8">
        <h3 className="text-xs font-bold text-slate-400 uppercase mb-4 pl-4">{title}</h3>
        <div className="flex flex-wrap gap-2">
            {children}
        </div>
    </div>
)

const Desktop: React.FC<DesktopProps> = ({ onLaunchApp }) => {
  return (
    <div className="absolute inset-0 p-8 flex flex-col flex-wrap content-start gap-4 z-0 overflow-auto">
       <AppContainer title="Core System">
           <DesktopIcon label="Terminal" icon={Terminal} onClick={() => onLaunchApp(AppView.TERMINAL)} color="text-slate-300"/>
           <DesktopIcon label="Dashboard" icon={Network} onClick={() => onLaunchApp(AppView.DASHBOARD)} color="text-blue-400"/>
           <DesktopIcon label="Server Admin" icon={Server} onClick={() => onLaunchApp(AppView.SERVER)} color="text-green-400"/>
           <DesktopIcon label="Infrastructure" icon={Cpu} onClick={() => onLaunchApp(AppView.INFRASTRUCTURE)} color="text-purple-400"/>
           <DesktopIcon label="Shield VPN" icon={Shield} onClick={() => onLaunchApp(AppView.VPN)} color="text-red-400"/>
       </AppContainer>

       <AppContainer title="Productivity">
           <DesktopIcon label="Workspace" icon={Briefcase} onClick={() => onLaunchApp(AppView.WORKSPACE)} color="text-emerald-400"/>
           <DesktopIcon label="Browser" icon={Globe} onClick={() => onLaunchApp(AppView.BROWSER)} color="text-indigo-300"/>
           <DesktopIcon label="Storage" icon={HardDrive} onClick={() => onLaunchApp(AppView.FILES)} color="text-blue-400"/>
           <DesktopIcon label="Badal Mail" icon={Mail} onClick={() => onLaunchApp(AppView.BADAL_MAIL)} color="text-orange-600"/>
           <DesktopIcon label="Calculator" icon={Calculator} onClick={() => onLaunchApp(AppView.CALCULATOR)} color="text-gray-300"/>
           <DesktopIcon label="Travel" icon={Plane} onClick={() => onLaunchApp(AppView.MEGAM_TRAVEL)} color="text-sky-500"/>
       </AppContainer>

       <AppContainer title="AI & Development">
           <DesktopIcon label="Agent Lab" icon={Network} onClick={() => onLaunchApp(AppView.AGENTS)} color="text-teal-400"/>
           <DesktopIcon label="AI Studio" icon={Workflow} onClick={() => onLaunchApp(AppView.AI_STUDIO)} color="text-pink-500"/>
           <DesktopIcon label="ETL Studio" icon={Database} onClick={() => onLaunchApp(AppView.ETL)} color="text-yellow-400"/>
           <DesktopIcon label="Quantum Lab" icon={Atom} onClick={() => onLaunchApp(AppView.MEGAM_QUANTUM)} color="text-violet-400"/>
           <DesktopIcon label="Automate" icon={Cpu} onClick={() => onLaunchApp(AppView.MEGAM_AUTOMATE)} color="text-cyan-400"/>
           <DesktopIcon label="Aura Voice" icon={Mic} onClick={() => onLaunchApp(AppView.MEGAM_ASSISTANT)} color="text-rose-500"/>
       </AppContainer>

       <AppContainer title="Creative & Tools">
           <DesktopIcon label="Studio" icon={Palette} onClick={() => onLaunchApp(AppView.MEGAM_STUDIO)} color="text-fuchsia-400"/>
           <DesktopIcon label="BadalRAAG" icon={Music} onClick={() => onLaunchApp(AppView.BADAL_RAAG)} color="text-rose-400"/>
           <DesktopIcon label="Marketing" icon={Megaphone} onClick={() => onLaunchApp(AppView.MEGAM_MARKETING)} color="text-red-500"/>
           <DesktopIcon label="Scanner" icon={Scan} onClick={() => onLaunchApp(AppView.MEGAM_SCANNER)} color="text-white"/>
       </AppContainer>

       <AppContainer title="Enterprise">
           <DesktopIcon label="Campus" icon={Building2} onClick={() => onLaunchApp(AppView.MEGAM_CAMPUS)} color="text-sky-400"/>
           <DesktopIcon label="Data Center" icon={Box} onClick={() => onLaunchApp(AppView.MEGAM_DC)} color="text-slate-200"/>
           <DesktopIcon label="Sentinel" icon={ShieldAlert} onClick={() => onLaunchApp(AppView.MEGAM_SENTINEL)} color="text-red-600"/>
           <DesktopIcon label="BadalPhone" icon={Smartphone} onClick={() => onLaunchApp(AppView.BADAL_PHONE)} color="text-green-300"/>
       </AppContainer>
    </div>
  );
};

export default Desktop;
