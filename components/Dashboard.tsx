
import React, { useState, useEffect } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend, LineChart, Line
} from 'recharts';
import { Server, ShieldCheck, Database, Cpu, Globe, Wifi, Activity, Zap, Layers, Command, Radio } from 'lucide-react';
import { SystemStats } from '../types';

interface DashboardProps {
  stats: SystemStats;
}

const Dashboard: React.FC<DashboardProps> = ({ stats }) => {
  const [hexNodes, setHexNodes] = useState(Array.from({ length: 48 }).map(() => ({ active: Math.random() > 0.5, load: Math.random() })));
  const [tickerItems, setTickerItems] = useState<string[]>([]);
  
  // "Loop to fill tasks" - Simulating alive infrastructure
  useEffect(() => {
    const interval = setInterval(() => {
        // Update Hex Nodes
        setHexNodes(prev => prev.map(n => ({
            active: Math.random() > 0.1, // Mostly active
            load: Math.random()
        })));

        // Update Ticker
        const events = [
            `[NET] Packet intercepted: 10.0.0.${Math.floor(Math.random()*255)}`,
            `[AI] Neural Bridge optimizing tensor path...`,
            `[STR] Shard re-balancing on Node-${Math.floor(Math.random()*50)}`,
            `[SEC] Intrusion check: Clean`,
            `[SYS] Kernel heartbeat: Stable`
        ];
        setTickerItems(prev => [events[Math.floor(Math.random() * events.length)], ...prev].slice(0, 5));

    }, 1200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-full flex flex-col bg-[#0b0f19] text-slate-200 overflow-hidden relative">
      {/* Background Grid FX */}
      <div className="absolute inset-0 pointer-events-none opacity-20" style={{
          backgroundImage: 'linear-gradient(rgba(56, 189, 248, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(56, 189, 248, 0.1) 1px, transparent 1px)',
          backgroundSize: '40px 40px'
      }}></div>

      {/* Header Ticker */}
      <div className="h-8 bg-slate-900/80 border-b border-slate-800 flex items-center px-4 gap-4 text-[10px] font-mono overflow-hidden shrink-0 z-10 backdrop-blur">
          <div className="flex items-center gap-2 text-cyan-400 font-bold uppercase tracking-wider shrink-0">
              <Radio size={12} className="animate-pulse"/> System Feed
          </div>
          <div className="flex-1 flex gap-8 animate-marquee whitespace-nowrap text-slate-400">
              {tickerItems.map((item, i) => (
                  <span key={i}>{item}</span>
              ))}
          </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6 relative z-10">
        {/* Top KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <KpiCard 
                label="Virtual CPU Core" 
                value="∞ Scalable" 
                sub="Neural Bridge Active" 
                icon={Cpu} 
                color="text-pink-400" 
                bg="bg-pink-500/10" 
                border="border-pink-500/30"
            />
            <KpiCard 
                label="Badal Vault" 
                value="99.9 PB" 
                sub="Geo-Redundant" 
                icon={Database} 
                color="text-cyan-400" 
                bg="bg-cyan-500/10" 
                border="border-cyan-500/30"
            />
            <KpiCard 
                label="Active Agents" 
                value="1,402" 
                sub="Autonomous Workforce" 
                icon={Command} 
                color="text-emerald-400" 
                bg="bg-emerald-500/10" 
                border="border-emerald-500/30"
            />
            <KpiCard 
                label="Security" 
                value="Shield Active" 
                sub="0 Threats Detected" 
                icon={ShieldCheck} 
                color="text-purple-400" 
                bg="bg-purple-500/10" 
                border="border-purple-500/30"
            />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[400px]">
            {/* Live Node Map */}
            <div className="lg:col-span-2 bg-slate-900/50 backdrop-blur border border-slate-700/50 rounded-2xl p-6 flex flex-col relative overflow-hidden group">
                <div className="flex justify-between items-center mb-6 relative z-10">
                    <div>
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                            <Layers size={18} className="text-cyan-400"/> Badal Cloud Topology
                        </h3>
                        <p className="text-xs text-slate-400">Live visualization of distributed compute nodes</p>
                    </div>
                    <div className="flex gap-2">
                        <span className="flex items-center gap-1 text-[10px] text-green-400"><div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div> ONLINE</span>
                        <span className="flex items-center gap-1 text-[10px] text-slate-500"><div className="w-1.5 h-1.5 bg-slate-600 rounded-full"></div> IDLE</span>
                    </div>
                </div>
                
                {/* The "Loop" Grid */}
                <div className="flex-1 grid grid-cols-12 gap-2 content-center opacity-80 group-hover:opacity-100 transition-opacity">
                    {hexNodes.map((node, i) => (
                        <div 
                            key={i} 
                            className={`
                                aspect-square rounded-sm transition-all duration-700
                                ${node.active 
                                    ? `bg-cyan-500/${Math.floor(node.load * 40 + 10)} shadow-[0_0_8px_rgba(34,211,238,0.2)] scale-95` 
                                    : 'bg-slate-800/30 scale-90'}
                            `}
                            style={{ 
                                borderRadius: '20%', 
                                transform: node.active ? `scale(${0.8 + (node.load * 0.2)})` : 'scale(0.8)'
                            }}
                        ></div>
                    ))}
                </div>
                
                {/* Overlay Scanline */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent h-full w-full pointer-events-none animate-[scan_3s_linear_infinite]"></div>
            </div>

            {/* Live Traffic */}
            <div className="bg-slate-900/50 backdrop-blur border border-slate-700/50 rounded-2xl p-6 flex flex-col">
                <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
                    <Activity size={18} className="text-pink-400"/> Global Traffic
                </h3>
                <div className="flex-1 w-full min-h-0">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={[
                            {t: 1, v: 400}, {t: 2, v: 300}, {t: 3, v: 500}, {t: 4, v: 200}, {t: 5, v: 800}, {t: 6, v: 450}, {t: 7, v: 600}
                        ]}>
                            <defs>
                                <linearGradient id="colorTraffic" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#ec4899" stopOpacity={0.8}/>
                                    <stop offset="95%" stopColor="#ec4899" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false}/>
                            <XAxis hide />
                            <YAxis hide />
                            <Tooltip contentStyle={{backgroundColor: '#0f172a', borderColor: '#334155'}} />
                            <Area type="monotone" dataKey="v" stroke="#ec4899" strokeWidth={2} fill="url(#colorTraffic)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-4">
                    <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-700">
                        <div className="text-[10px] text-slate-500 uppercase font-bold">Inbound</div>
                        <div className="text-lg font-mono text-white">45 GB/s</div>
                    </div>
                    <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-700">
                        <div className="text-[10px] text-slate-500 uppercase font-bold">Outbound</div>
                        <div className="text-lg font-mono text-white">21 GB/s</div>
                    </div>
                </div>
            </div>
        </div>

        {/* Bottom Modules */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ModuleCard icon={Wifi} label="Wireless Connector" status="Connected" color="text-indigo-400" />
            <ModuleCard icon={Globe} label="Mesh VPN" status="Secure (WireGuard)" color="text-orange-400" />
            <ModuleCard icon={Server} label="Badal SWGI" status="High Tokenized" color="text-green-400" />
        </div>
      </div>
    </div>
  );
};

const KpiCard = ({ label, value, sub, icon: Icon, color, bg, border }: any) => (
    <div className={`p-5 rounded-2xl border backdrop-blur-sm transition hover:-translate-y-1 ${bg} ${border} relative overflow-hidden group`}>
        <div className="relative z-10">
            <div className="flex justify-between items-start mb-2">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{label}</p>
                <div className={`p-2 rounded-lg bg-black/20 ${color}`}>
                    <Icon size={18} />
                </div>
            </div>
            <h3 className="text-3xl font-bold text-white mb-1">{value}</h3>
            <p className={`text-xs ${color} font-medium flex items-center gap-1`}>
                <Zap size={10} className="fill-current"/> {sub}
            </p>
        </div>
        {/* Glow Effect */}
        <div className={`absolute -right-4 -bottom-4 w-24 h-24 rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition ${color.replace('text-', 'bg-')}`}></div>
    </div>
)

const ModuleCard = ({ icon: Icon, label, status, color }: any) => (
    <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-4 flex items-center justify-between group hover:bg-slate-800/60 transition cursor-pointer">
        <div className="flex items-center gap-4">
            <div className={`p-3 rounded-lg bg-slate-950 border border-slate-800 ${color} group-hover:scale-110 transition`}>
                <Icon size={20} />
            </div>
            <div>
                <div className="font-bold text-slate-200 text-sm">{label}</div>
                <div className="text-xs text-slate-500">{status}</div>
            </div>
        </div>
        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
    </div>
)

export default Dashboard;
    