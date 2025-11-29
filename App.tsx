// ... (Existing imports)
import MegamCampus from './components/MegamCampus'; 
import BadalMail from './components/BadalMail'; // New Import

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
  [AppView.BADAL_MAIL]: { title: 'Badal Mail', icon: Megaphone, defaultSize: { width: 1100, height: 800 } },
};

// ... (Rest of component)

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
      case AppView.BADAL_MAIL: return <BadalMail />;
      default: return <div className="p-4 text-white">App not found</div>;
    }
  };
// ...
