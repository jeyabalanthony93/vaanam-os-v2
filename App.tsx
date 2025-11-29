
import React, { useState, useEffect } from 'react';
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
  Music,
  Smartphone,
  Megaphone,
  Box,
  ShieldAlert,
  Atom,
  Palette,
  Building2
} from 'lucide-react';

import BootSequence from './components/os/BootSequence';
import LoginScreen from './components/os/LoginScreen';
import Desktop from './components/os/Desktop';
import Taskbar from './components/os/Taskbar';
import Window from './components/os/Window';
import DevConsole from './components/os/DevConsole'; 

// Import Apps
import Terminal from './components/Terminal';
import Dashboard from './components/Dashboard';
import AgentView from './components/AgentView';
import Workspace from './components/Workspace';
import VPNManager from './components/VPNManager';
import Infrastructure from './components/Infrastructure';
import StorageExplorer from './components/StorageExplorer';
import ServerAdmin from './components/ServerAdmin';
import MCPServer from './components/MCPServer';
import AIStudio from './components/AIStudio';
import ETLStudio from './components/ETLStudio';
import PackageCenter from './components/PackageCenter';
import SS360 from './components/SS360';
import BadalAuth from './components/BadalAuth'; 
import DocumentationHub from './components/DocumentationHub'; 
import BadalRAG from './components/BadalRAG'; 
import MegamBrowser from './components/MegamBrowser'; 
import BadalRAAG from './components/BadalRAAG'; 
import BadalPhone from './components/BadalPhone'; 
import MegamMarketing from './components/MegamMarketing'; 
import MegamDataCenter from './components/MegamDataCenter'; 
import MegamSentinel from './components/MegamSentinel'; 
import MegamQuantum from './components/MegamQuantum'; 
import MegamAutomate from './components/MegamAutomate'; 
import MegamStudio from './components/MegamStudio'; 
import MegamCampus from './components/MegamCampus'; // New import

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
  [AppView.CALCULATOR]: { title: 'Calculator', icon: Server, defaultSize: { width: 300, height: 400 } },
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
};

const App: React.FC = () => {
  const [bootStep, setBootStep] = useState<BootStep>('BIOS');
  const [windows, setWindows] = useState<WindowState[]>([]);
  const [activeWindowId, setActiveWindowId] = useState<string | null>(null);
  const [nextZIndex, setNextZIndex] = useState(10);
  
  // DevConsole State
  const [showDevConsole, setShowDevConsole] = useState(false);
  const [isDevConsoleMinimized, setIsDevConsoleMinimized] = useState(false);

  // Stats state (kept for Dashboard)
  const [stats] = useState<SystemStats>({
    cpuUsage: 12,
    memoryUsage: 34,
    storageUsed: '2.4 PB',
    networkIn: 1024,
    networkOut: 405,
    activeAgents: 3
  });

  // Launch the Terminal automatically on startup
  useEffect(() => {
    if (bootStep === 'DESKTOP') {
       setTimeout(() => launchApp(AppView.TERMINAL), 500);
       setTimeout(() => launchApp(AppView.DASHBOARD), 800);
    }
  }, [bootStep]);

  const launchApp = (appId: AppView) => {
    const config = APP_CONFIG[appId];
    if (!config) return;

    const newWindow: WindowState = {
      id: `${appId}-${Date.now()}`,
      appId,
      title: config.title,
      icon: config.icon,
      isOpen: true,
      isMinimized: false,
      isMaximized: false,
      zIndex: nextZIndex,
      // Random slight offset for realism
      position: { x: 50 + (windows.length * 30), y: 50 + (windows.length * 30) },
      size: config.defaultSize,
    };

    setWindows([...windows, newWindow]);
    setActiveWindowId(newWindow.id);
    setNextZIndex(prev => prev + 1);
  };

  const focusWindow = (id: string) => {
    setActiveWindowId(id);
    setWindows(prev => prev.map(w => 
      w.id === id ? { ...w, zIndex: nextZIndex, isMinimized: false } : w
    ));
    setNextZIndex(prev => prev + 1);
  };

  const closeWindow = (id: string) => {
    setWindows(prev => prev.filter(w => w.id !== id));
    if (activeWindowId === id) setActiveWindowId(null);
  };

  const toggleMaximize = (id: string) => {
    setWindows(prev => prev.map(w => 
      w.id === id ? { ...w, isMaximized: !w.isMaximized } : w
    ));
    focusWindow(id);
  };

  const minimizeWindow = (id: string) => {
    setWindows(prev => prev.map(w => 
      w.id === id ? { ...w, isMinimized: true } : w
    ));
    setActiveWindowId(null);
  };

  const moveWindow = (id: string, x: number, y: number) => {
    setWindows(prev => prev.map(w => 
      w.id === id ? { ...w, position: { x, y } } : w
    ));
  };

  // Render App Content Switcher
  const renderAppContent = (appId: AppView) => {
    switch (appId) {
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
      default: return <div className="p-4 text-white">App not found</div>;
    }
  };

  return (
    <div className="h-screen w-screen bg-black overflow-hidden relative selection:bg-cyan-500 selection:text-white">
      
      {/* 1. Boot Sequence */}
      {bootStep === 'BIOS' && (
        <BootSequence onComplete={() => setBootStep('LOGIN')} />
      )}

      {/* 2. Login Screen */}
      {bootStep === 'LOGIN' && (
        <LoginScreen onLogin={() => setBootStep('DESKTOP')} />
      )}

      {/* 3. Desktop Environment */}
      {bootStep === 'DESKTOP' && (
        <div 
          className="h-full w-full relative bg-cover bg-center"
          style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop")' }}
        >
          {/* Overlay for readability */}
          <div className="absolute inset-0 bg-black/30 backdrop-blur-[1px]" />

          {/* Desktop Icons Layer */}
          <Desktop onLaunchApp={launchApp} />

          {/* Window Layer */}
          {windows.map(win => (
            <Window
              key={win.id}
              window={win}
              isActive={activeWindowId === win.id}
              onFocus={() => focusWindow(win.id)}
              onClose={() => closeWindow(win.id)}
              onMaximize={() => toggleMaximize(win.id)}
              onMinimize={() => minimizeWindow(win.id)}
              onMove={(x, y) => moveWindow(win.id, x, y)}
            >
              {renderAppContent(win.appId)}
            </Window>
          ))}
          
          {/* Global Dev Console */}
          <DevConsole 
             isOpen={showDevConsole} 
             onClose={() => setShowDevConsole(false)} 
             isMinimized={isDevConsoleMinimized}
             onToggleMinimize={() => setIsDevConsoleMinimized(!isDevConsoleMinimized)}
          />

          {/* Taskbar Layer */}
          <Taskbar 
            windows={windows} 
            activeWindowId={activeWindowId} 
            onWindowClick={(id) => {
              const win = windows.find(w => w.id === id);
              if (win?.isMinimized || activeWindowId !== id) {
                focusWindow(id);
              } else {
                minimizeWindow(id);
              }
            }}
            onLaunchApp={launchApp}
            onToggleDevConsole={() => setShowDevConsole(!showDevConsole)} // New Prop
          />
        </div>
      )}
    </div>
  );
};

export default App;
