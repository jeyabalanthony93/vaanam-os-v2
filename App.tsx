// ... existing imports ...
import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Terminal as TerminalIcon, HardDrive, Briefcase, Network, Shield, Cpu, 
  Server, Globe, Workflow, GitMerge, Package, CloudOff, UserCheck, Book, Database, 
  Music, Smartphone, Megaphone, Box, ShieldAlert, Atom, Palette, Building2, Mail,
  Calculator, Mic, Scan, Plane
} from 'lucide-react';

// ... existing component imports ...
import Terminal from './components/Terminal';
import Dashboard from './components/Dashboard';
import ServerAdmin from './components/ServerAdmin';
import Workspace from './components/Workspace';
import StorageExplorer from './components/StorageExplorer';
import Infrastructure from './components/Infrastructure';
import VPNManager from './components/VPNManager';
import AgentView from './components/AgentView';
import MCPServer from './components/MCPServer';
import AIStudio from './components/AIStudio';
import ETLStudio from './components/ETLStudio';
import PackageCenter from './components/PackageCenter';
import SS360 from './components/SS360';
import BadalAuth from './components/BadalAuth';
import DocumentationHub from './components/DocumentationHub';
import BadalRAG from './components/BadalRAG';
import BadalRAAG from './components/BadalRAAG';
import BadalPhone from './components/BadalPhone';
import MegamBrowser from './components/MegamBrowser';
import MegamMarketing from './components/MegamMarketing';
import MegamDataCenter from './components/MegamDataCenter';
import MegamSentinel from './components/MegamSentinel';
import MegamQuantum from './components/MegamQuantum';
import MegamAutomate from './components/MegamAutomate';
import MegamStudio from './components/MegamStudio';
import MegamCampus from './components/MegamCampus';
import BadalMail from './components/BadalMail';
// NEW IMPORTS
import MegamCalculator from './components/MegamCalculator';
import MegamAssistant from './components/MegamAssistant';
import MegamScanner from './components/MegamScanner';
import MegamTravel from './components/MegamTravel';

import BootSequence from './components/os/BootSequence';
import LoginScreen from './components/os/LoginScreen';
import Desktop from './components/os/Desktop';
import Window from './components/os/Window';
import Taskbar from './components/os/Taskbar';
import DevConsole from './components/os/DevConsole';

// ... types import ...
import { AppView, WindowState, BootStep, SystemStats } from './types';

// App Registry for Icon/Title mapping
const APP_CONFIG: Record<AppView, { title: string, icon: any, defaultSize: { width: number, height: number } }> = {
  [AppView.DASHBOARD]: { title: 'Cloud Dashboard', icon: LayoutDashboard, defaultSize: { width: 1000, height: 700 } },
  [AppView.TERMINAL]: { title: 'Terminal - root@sucksaas', icon: TerminalIcon, defaultSize: { width: 800, height: 500 } },
  [AppView.FILES]: { title: 'Badal Storage', icon: HardDrive, defaultSize: { width: 900, height: 600 } },
  [AppView.WORKSPACE]: { title: 'Cloud Workspace', icon: Briefcase, defaultSize: { width: 1100, height: 750 } },
  [AppView.AGENTS]: { title: 'Agent Development Environment', icon: Network, defaultSize: { width: 1200, height: 850 } },
  [AppView.VPN]: { title: 'VPN Secure Tunnel', icon: Shield, defaultSize: { width: 700, height: 650 } },
  [AppView.INFRASTRUCTURE]: { title: 'Infrastructure Control', icon: Cpu, defaultSize: { width: 1100, height: 800 } },
  [AppView.SERVER]: { title: 'Server Administration', icon: Server, defaultSize: { width: 950, height: 700 } },
  [AppView.MCP_SERVER]: { title: 'SWGI & MCP Server', icon: Globe, defaultSize: { width: 1000, height: 750 } },
  [AppView.SETTINGS]: { title: 'Settings', icon: Server, defaultSize: { width: 600, height: 500 } },
  [AppView.BROWSER]: { title: 'Megam Browser', icon: Globe, defaultSize: { width: 1000, height: 700 } },
  [AppView.CALCULATOR]: { title: 'Calculator', icon: Calculator, defaultSize: { width: 320, height: 480 } },
  [AppView.NETWORK]: { title: 'Network', icon: Network, defaultSize: { width: 800, height: 600 } },
  [AppView.AI_STUDIO]: { title: 'SuckChain Studio', icon: Workflow, defaultSize: { width: 1200, height: 800 } },
  [AppView.ETL]: { title: 'SuckSaas ETL Studio', icon: GitMerge, defaultSize: { width: 1200, height: 800 } },
  [AppView.PACKAGE_CENTER]: { title: 'Package Center', icon: Package, defaultSize: { width: 1000, height: 700 } },
  [AppView.SS360]: { title: 'SS360 Offline Suite', icon: CloudOff, defaultSize: { width: 1000, height: 700 } },
  [AppView.BADAL_AUTH]: { title: 'Badal Auth Framework', icon: UserCheck, defaultSize: { width: 1000, height: 700 } },
  [AppView.DOCS]: { title: 'Megam Documentation', icon: Book, defaultSize: { width: 1100, height: 800 } },
  [AppView.BADAL_RAG]: { title: 'Badal RAG Server', icon: Database, defaultSize: { width: 1100, height: 800 } },
  [AppView.BADAL_RAAG]: { title: 'BadalRAAG Audio Workstation', icon: Music, defaultSize: { width: 1100, height: 800 } },
  [AppView.BADAL_PHONE]: { title: 'BadalPhone (Ephone)', icon: Smartphone, defaultSize: { width: 420, height: 820 } },
  [AppView.MEGAM_MARKETING]: { title: 'Megam Marketing Suite', icon: Megaphone, defaultSize: { width: 1100, height: 800 } },
  [AppView.MEGAM_DC]: { title: 'Megam Virtual Data Center', icon: Box, defaultSize: { width: 1200, height: 850 } },
  [AppView.MEGAM_SENTINEL]: { title: 'Megam Sentinel Security', icon: ShieldAlert, defaultSize: { width: 1150, height: 800 } },
  [AppView.MEGAM_QUANTUM]: { title: 'Megam Quantum Studio', icon: Atom, defaultSize: { width: 1100, height: 800 } },
  [AppView.MEGAM_AUTOMATE]: { title: 'Megam Automate', icon: Workflow, defaultSize: { width: 1200, height: 800 } },
  [AppView.MEGAM_STUDIO]: { title: 'Megam Studio', icon: Palette, defaultSize: { width: 1200, height: 800 } },
  [AppView.MEGAM_CAMPUS]: { title: 'Megam Virtual Campus', icon: Building2, defaultSize: { width: 1200, height: 850 } },
  [AppView.BADAL_MAIL]: { title: 'Badal Mail', icon: Mail, defaultSize: { width: 1100, height: 800 } },
  // NEW APPS CONFIG
  [AppView.MEGAM_ASSISTANT]: { title: 'Aura Assistant', icon: Mic, defaultSize: { width: 400, height: 500 } },
  [AppView.MEGAM_SCANNER]: { title: 'Megam Scanner', icon: Scan, defaultSize: { width: 600, height: 500 } },
  [AppView.MEGAM_TRAVEL]: { title: 'Megam Travel', icon: Plane, defaultSize: { width: 1000, height: 700 } },
};

const App: React.FC = () => {
  // ... existing state ...
  const [bootStep, setBootStep] = useState<BootStep>('BIOS');
  const [windows, setWindows] = useState<WindowState[]>([]);
  const [activeWindowId, setActiveWindowId] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isDevConsoleOpen, setIsDevConsoleOpen] = useState(false);
  const [isDevConsoleMinimized, setIsDevConsoleMinimized] = useState(false);
  
  const [stats, setStats] = useState<SystemStats>({
    cpuUsage: 12,
    memoryUsage: 24,
    storageUsed: '2.1 TB',
    networkIn: 45,
    networkOut: 120,
    activeAgents: 4
  });

  // ... existing logic ...

  const launchApp = (appId: AppView) => {
    const config = APP_CONFIG[appId];
    const newWindow: WindowState = {
      id: Date.now().toString(),
      appId,
      title: config.title,
      icon: config.icon,
      isOpen: true,
      isMinimized: false,
      isMaximized: false,
      zIndex: windows.length + 1,
      position: { x: 50 + (windows.length * 30), y: 50 + (windows.length * 30) },
      size: config.defaultSize
    };
    setWindows([...windows, newWindow]);
    setActiveWindowId(newWindow.id);
  };

  const closeWindow = (id: string) => {
    setWindows(windows.filter(w => w.id !== id));
    if (activeWindowId === id) setActiveWindowId(null);
  };

  const focusWindow = (id: string) => {
    setActiveWindowId(id);
    setWindows(windows.map(w => w.id === id ? { ...w, zIndex: Math.max(...windows.map(win => win.zIndex)) + 1 } : w));
  };

  const updateWindow = (id: string, updates: Partial<WindowState>) => {
    setWindows(windows.map(w => w.id === id ? { ...w, ...updates } : w));
  };

  // Render App Content Switcher
  const renderAppContent = (appId: AppView) => {
    switch (appId) {
      // ... existing cases ...
      case AppView.TERMINAL: return <Terminal />;
      case AppView.DASHBOARD: return <Dashboard stats={stats} />;
      case AppView.SERVER: return <ServerAdmin />;
      case AppView.WORKSPACE: return <Workspace />;
      case AppView.FILES: return <StorageExplorer />;
      case AppView.INFRASTRUCTURE: return <Infrastructure />;
      case AppView.VPN: return <VPNManager />;
      case AppView.AGENTS: return <AgentView />;
      case AppView.MCP_SERVER: return <MCPServer />;
      case AppView.AI_STUDIO: return <AIStudio />;
      case AppView.ETL: return <ETLStudio />;
      case AppView.PACKAGE_CENTER: return <PackageCenter />;
      case AppView.SS360: return <SS360 />;
      case AppView.BADAL_AUTH: return <BadalAuth />;
      case AppView.DOCS: return <DocumentationHub />;
      case AppView.BADAL_RAG: return <BadalRAG />;
      case AppView.BADAL_RAAG: return <BadalRAAG />;
      case AppView.BADAL_PHONE: return <BadalPhone />;
      case AppView.BROWSER: return <MegamBrowser />;
      case AppView.MEGAM_MARKETING: return <MegamMarketing />;
      case AppView.MEGAM_DC: return <MegamDataCenter />;
      case AppView.MEGAM_SENTINEL: return <MegamSentinel />;
      case AppView.MEGAM_QUANTUM: return <MegamQuantum />;
      case AppView.MEGAM_AUTOMATE: return <MegamAutomate />;
      case AppView.MEGAM_STUDIO: return <MegamStudio />;
      case AppView.MEGAM_CAMPUS: return <MegamCampus />;
      case AppView.BADAL_MAIL: return <BadalMail />;
      // NEW CASES
      case AppView.CALCULATOR: return <MegamCalculator />;
      case AppView.MEGAM_ASSISTANT: return <MegamAssistant />;
      case AppView.MEGAM_SCANNER: return <MegamScanner />;
      case AppView.MEGAM_TRAVEL: return <MegamTravel />;
      default: return <div className="p-4 text-white">App not found</div>;
    }
  };

  // ... Boot & Login logic ...
  if (bootStep === 'BIOS' || bootStep === 'BOOT_LOG') {
      return <BootSequence onComplete={() => setBootStep('LOGIN')} />;
  }

  if (bootStep === 'LOGIN') {
      return <LoginScreen onLogin={() => setBootStep('DESKTOP')} />;
  }

  return (
    <div className="h-screen w-screen overflow-hidden bg-cover bg-center font-sans text-slate-200 select-none" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop")' }}>
      <Desktop onLaunchApp={launchApp} />
      {windows.map(win => (
        <Window
          key={win.id}
          window={win}
          isActive={activeWindowId === win.id}
          onFocus={() => focusWindow(win.id)}
          onClose={() => closeWindow(win.id)}
          onMinimize={() => updateWindow(win.id, { isMinimized: true })}
          onMaximize={() => updateWindow(win.id, { isMaximized: !win.isMaximized })}
          onMove={(x, y) => updateWindow(win.id, { position: { x, y } })}
        >
          {renderAppContent(win.appId)}
        </Window>
      ))}
      <DevConsole 
        isOpen={isDevConsoleOpen} 
        onClose={() => setIsDevConsoleOpen(false)}
        isMinimized={isDevConsoleMinimized}
        onToggleMinimize={() => setIsDevConsoleMinimized(!isDevConsoleMinimized)}
      />
      <div className="absolute bottom-0 w-full z-50">
          <Taskbar 
            activeApp={activeWindowId ? windows.find(w => w.id === activeWindowId)?.appId || null : null}
            menuOpen={menuOpen}
            setMenuOpen={setMenuOpen}
            onLaunchApp={launchApp}
          />
      </div>
      <div 
        className="fixed top-0 right-0 p-2 opacity-0 hover:opacity-100 transition cursor-pointer z-[100]"
        onClick={() => setIsDevConsoleOpen(true)}
      >
          <TerminalIcon size={16} className="text-white/50"/>
      </div>
    </div>
  );
}

export default App;