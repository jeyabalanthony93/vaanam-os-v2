



import React, { useState } from 'react';
import { Book, Shield, Lock, FileText, Code, Terminal, Key, CheckCircle2, AlertTriangle, Fingerprint, Loader2, ArrowRight, UserCheck, Layout, Server, Database, Globe, Cpu, Library, Download, Search, BarChart, Megaphone, Gauge, Zap, Grid, Layers, DollarSign, Package, Workflow, GitMerge, Share2, Box } from 'lucide-react';

const DocumentationHub: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'PLATFORM' | 'APPS' | 'INFRA' | 'STORAGE' | 'PRICING' | 'FRAMEWORKS' | 'BROWSER' | 'DEV_GUIDE' | 'SECURITY_GUIDE' | 'MARKETING_AUTO'>('PLATFORM');
  
  // Developer Guide Auth State
  const [isAuth, setIsAuth] = useState(false);
  const [authStep, setAuthStep] = useState<'FORM' | '2FA' | 'SUCCESS'>('FORM');
  const [formData, setFormData] = useState({
      email: '',
      phone: '',
      business: '',
      purpose: '',
      consent: false
  });
  const [isVerifying, setIsVerifying] = useState(false);

  const handleFormSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      setIsVerifying(true);
      setTimeout(() => {
          setAuthStep('2FA');
          setIsVerifying(false);
      }, 1500);
  };

  const handle2FA = () => {
      setIsVerifying(true);
      setTimeout(() => {
          setAuthStep('SUCCESS');
          setTimeout(() => {
              setIsAuth(true);
              setIsVerifying(false);
          }, 1000);
      }, 2000);
  };

  // --- Content Renderers ---

  const renderPlatformDoc = () => (
      <div className="space-y-8 max-w-4xl mx-auto animate-in fade-in duration-300">
          <div className="border-b border-slate-800 pb-6">
              <h1 className="text-4xl font-bold text-white mb-4">Megam OS Platform Overview</h1>
              <p className="text-lg text-slate-400">The world's first AI-Native, Browser-based Cloud Operating System.</p>
          </div>
          
          <div className="prose prose-invert max-w-none">
              <div className="bg-gradient-to-r from-blue-900/20 to-cyan-900/20 p-6 rounded-xl border border-blue-500/30 mb-8">
                  <h3 className="text-xl font-bold text-blue-400 mb-2">Philosophy: Zero-Cost Computing</h3>
                  <p className="text-slate-300 text-sm">
                      Megam OS challenges the traditional cloud paradigm (AWS/Azure) by leveraging <strong>Open Source Software</strong> and 
                      <strong>Client-Side Compute</strong>. By running the core OS logic in the browser via WebAssembly and connecting to self-hosted 
                      Badal Servers, we eliminate 90% of operational costs.
                  </p>
              </div>

              <h3 className="text-2xl font-bold text-white mb-4">Core Architecture</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
                      <h4 className="font-bold text-white mb-2 flex items-center gap-2"><Cpu size={18} className="text-purple-400"/> Neural Bridge™ Engine</h4>
                      <p className="text-sm text-slate-400">
                          A proprietary JIT transpiler that converts Python/PyTorch code into optimized WebAssembly and WebGPU instructions, 
                          allowing "Virtual GPU" performance on standard hardware.
                      </p>
                  </div>
                  <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
                      <h4 className="font-bold text-white mb-2 flex items-center gap-2"><Globe size={18} className="text-green-400"/> SWGI Protocol</h4>
                      <p className="text-sm text-slate-400">
                          SuckSaas Web Gateway Interface (SWGI). A persistent, bi-directional WebSocket layer designed for stateful AI Agents 
                          and real-time tool execution, replacing stateless REST APIs.
                      </p>
                  </div>
              </div>
          </div>
      </div>
  );

  const renderAppsDoc = () => (
      <div className="space-y-8 max-w-4xl mx-auto animate-in fade-in duration-300">
          <div>
              <h1 className="text-3xl font-bold text-white mb-2">Badal Applications Suite</h1>
              <p className="text-slate-400">Enterprise-grade productivity tools running locally via Megam360.</p>
          </div>

          <div className="grid grid-cols-1 gap-6">
              {[
                  { name: 'Badal Writer', icon: FileText, desc: 'Rich text editor with AI autocompletion. Supports Markdown, DOCX, and real-time collaboration via P2P WebRTC.' },
                  { name: 'Badal Grid', icon: Grid, desc: 'High-performance spreadsheet engine. capable of handling 1M+ rows using Virtualized DOM rendering. Integrates Python for formulas.' },
                  { name: 'Megam Slides', icon: Layout, desc: 'Generative presentation builder. Describe your topic, and the "Design Agent" builds the deck instantly.' },
                  { name: 'Code Vault', icon: Lock, desc: 'Encrypted code snippet manager. Uses AES-256 in the browser. Keys never leave your device.' },
              ].map((app, i) => (
                  <div key={i} className="flex items-start gap-4 p-6 bg-slate-900 border border-slate-800 rounded-xl hover:border-blue-500/30 transition">
                      <div className="p-3 bg-slate-800 rounded-lg text-blue-400">
                          <app.icon size={24}/>
                      </div>
                      <div>
                          <h3 className="text-lg font-bold text-white mb-1">{app.name}</h3>
                          <p className="text-sm text-slate-400">{app.desc}</p>
                      </div>
                  </div>
              ))}
          </div>
      </div>
  );

  const renderInfraDoc = () => (
      <div className="space-y-8 max-w-4xl mx-auto animate-in fade-in duration-300">
          <div>
              <h1 className="text-3xl font-bold text-white mb-2">Infrastructure & Scalability</h1>
              <p className="text-slate-400">Deep dive into the Badal Cloud Control Plane.</p>
          </div>

          <div className="space-y-6">
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><Server size={20} className="text-indigo-400"/> Load Balancing Strategy</h3>
                  <p className="text-sm text-slate-300 mb-4">
                      The Badal LB uses a <strong>Weighted Round Robin</strong> algorithm distributed across 3 geo-zones. It automatically detects 
                      node latency via active health checks (ICMP/HTTP) and reroutes traffic instantly.
                  </p>
                  <div className="bg-black p-4 rounded text-xs font-mono text-green-400">
                      upstream badal_backend &#123;<br/>
                      &nbsp;&nbsp;server node-us-east weight=5;<br/>
                      &nbsp;&nbsp;server node-eu-west weight=3;<br/>
                      &nbsp;&nbsp;server node-ap-south weight=2;<br/>
                      &#125;
                  </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><Cpu size={20} className="text-pink-400"/> GPU Virtualization</h3>
                  <p className="text-sm text-slate-300">
                      The "Neural Bridge" allows us to shard AI model inference. Instead of loading a 70B parameter model on one H100 GPU, 
                      we split the layers across 50 consumer-grade CPUs using a <strong>Pipeline Parallelism</strong> approach over high-speed interconnects.
                  </p>
              </div>
          </div>
      </div>
  );

  const renderStorageDoc = () => (
      <div className="space-y-8 max-w-4xl mx-auto animate-in fade-in duration-300">
          <div>
              <h1 className="text-3xl font-bold text-white mb-2">Badal Storage Architecture</h1>
              <p className="text-slate-400">Unlimited object storage system built on MinIO and Ceph.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
                  <h3 className="font-bold text-white mb-2 text-lg">Data Sharding</h3>
                  <p className="text-sm text-slate-400">
                      Files are split into 64MB chunks. Each chunk is encrypted with a unique key and replicated 3x across different physical availability zones.
                  </p>
              </div>
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
                  <h3 className="font-bold text-white mb-2 text-lg">Geo-Redundancy</h3>
                  <p className="text-sm text-slate-400">
                      Active-Active replication ensures that if the US-East region goes offline, EU-West nodes serve the data immediately with zero downtime.
                  </p>
              </div>
          </div>

          <div className="bg-gradient-to-r from-blue-900/20 to-indigo-900/20 border border-blue-500/30 p-6 rounded-xl">
              <h3 className="font-bold text-white mb-2 flex items-center gap-2"><Database size={20} className="text-blue-400"/> Unlimited Quota?</h3>
              <p className="text-sm text-slate-300">
                  Yes. By utilizing <span className="text-blue-400">Deduplication</span> (storing only unique data blocks globally) and <span className="text-blue-400">Cold Storage Tiering</span> 
                  (moving rarely accessed data to tape/optical), we can offer virtually infinite storage at a fraction of the cost.
              </p>
          </div>
      </div>
  );

  const renderPricingDoc = () => (
      <div className="space-y-8 max-w-4xl mx-auto animate-in fade-in duration-300">
          <div>
              <h1 className="text-3xl font-bold text-white mb-2">Pricing & FinOps</h1>
              <p className="text-slate-400">Why pay the "Cloud Tax"? Switch to Open Source.</p>
          </div>

          <div className="overflow-hidden rounded-xl border border-slate-800">
              <table className="w-full text-left text-sm">
                  <thead className="bg-slate-900 text-slate-400">
                      <tr>
                          <th className="p-4">Feature</th>
                          <th className="p-4 text-red-400">AWS / GCP / Azure</th>
                          <th className="p-4 text-green-400">Megam OS (Self-Hosted)</th>
                      </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 bg-slate-950 text-slate-300">
                      <tr>
                          <td className="p-4 font-bold">Data Egress</td>
                          <td className="p-4">$0.09 / GB</td>
                          <td className="p-4 font-bold text-white">$0.00</td>
                      </tr>
                      <tr>
                          <td className="p-4 font-bold">AI Tokens (GPT-4 Class)</td>
                          <td className="p-4">$30 / 1M Tokens</td>
                          <td className="p-4 font-bold text-white">$0.00 (Local Models)</td>
                      </tr>
                      <tr>
                          <td className="p-4 font-bold">Storage</td>
                          <td className="p-4">$23 / TB / Month</td>
                          <td className="p-4 font-bold text-white">Hardware Cost Only</td>
                      </tr>
                      <tr>
                          <td className="p-4 font-bold">User Licenses</td>
                          <td className="p-4">$20 - $50 / User / Month</td>
                          <td className="p-4 font-bold text-white">Unlimited Users</td>
                      </tr>
                  </tbody>
              </table>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
              <h3 className="font-bold text-white mb-4 flex items-center gap-2"><DollarSign size={20} className="text-green-400"/> The Build Budget Calculator</h3>
              <p className="text-sm text-slate-400 mb-4">
                  Use the integrated <strong>Server Admin > FinOps</strong> tool to visualize your exact savings based on user count and storage needs. 
                  Most enterprises save <strong>70-90%</strong> by switching to the Megam Stack.
              </p>
          </div>
      </div>
  );

  const renderFrameworksDoc = () => (
      <div className="space-y-8 max-w-4xl mx-auto animate-in fade-in duration-300">
          <div>
              <h1 className="text-3xl font-bold text-white mb-2">Framework Registry</h1>
              <p className="text-slate-400">The open-source giants powering the Megam ecosystem.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                  { name: 'React 19', cat: 'Frontend', role: 'UI Component Architecture' },
                  { name: 'Tailwind CSS', cat: 'Styling', role: 'Utility-first Design System' },
                  { name: 'Apache Kafka', cat: 'Data Streaming', role: 'Real-time Event Bus for Agents' },
                  { name: 'PostgreSQL 16', cat: 'Database', role: 'Primary Relational Store' },
                  { name: 'Qdrant', cat: 'Vector DB', role: 'Semantic Search & RAG Memory' },
                  { name: 'PyTorch', cat: 'AI/ML', role: 'Tensor Computation & Training' },
                  { name: 'WireGuard', cat: 'Networking', role: 'Kernel-space VPN Protocol' },
                  { name: 'Keycloak', cat: 'Security', role: 'Identity & Access Management' },
              ].map((fw, i) => (
                  <div key={i} className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center justify-between">
                      <div>
                          <div className="font-bold text-white">{fw.name}</div>
                          <div className="text-xs text-slate-500">{fw.role}</div>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-1 rounded bg-slate-800 text-slate-400 border border-slate-700 uppercase">{fw.cat}</span>
                  </div>
              ))}
          </div>
      </div>
  );

  const renderBrowserDoc = () => (
      <div className="space-y-8 max-w-4xl mx-auto animate-in fade-in duration-300">
          <div>
              <h1 className="text-3xl font-bold text-white mb-2">Megam Browser Guide</h1>
              <p className="text-slate-400">Navigating the decentralized web and internal tools.</p>
          </div>

          <div className="space-y-6">
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
                  <h3 className="text-xl font-bold text-white mb-2">Internal Protocols</h3>
                  <p className="text-sm text-slate-400 mb-4">
                      The Megam Browser supports standard <code>http://</code> and <code>https://</code>, but also handles the proprietary <code>megam://</code> protocol for internal apps.
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-sm text-slate-300 font-mono">
                      <li>megam://market - Real-time market analysis</li>
                      <li>megam://search - AI Search Engine</li>
                      <li>megam://console - Webmaster Tools</li>
                      <li>megam://ads - Ad Campaign Manager</li>
                  </ul>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
                  <h3 className="text-xl font-bold text-white mb-2">Shield Core™ Integration</h3>
                  <p className="text-sm text-slate-400">
                      The browser is directly linked to the OS-level VPN Manager. Ad-blocking, tracker prevention, and Tor routing are handled at the network socket layer, not just via extensions.
                  </p>
              </div>
          </div>
      </div>
  );

  const renderSecurityGuide = () => (
      <div className="space-y-8 max-w-4xl mx-auto animate-in fade-in duration-300">
          <div>
              <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-2"><Shield size={32} className="text-red-500"/> Security & Compliance</h1>
              <p className="text-slate-400">How Megam OS achieves "Unbreakable" security using Open Source Intelligence (OSINT) and Neural Defense.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
                  <h3 className="font-bold text-white mb-3">Defense-in-Depth</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">
                      We utilize a multi-layered approach involving <strong>Hardware</strong> (TPM 2.0 Check), <strong>Kernel</strong> (SELinux Mandatory Access Control), 
                      and <strong>Application</strong> (Cognitive Firewall) security.
                  </p>
              </div>
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
                  <h3 className="font-bold text-white mb-3">Open Source Stack</h3>
                  <ul className="text-sm text-slate-400 space-y-2">
                      <li className="flex items-center gap-2"><CheckCircle2 size={12} className="text-green-500"/> <strong>Wazuh</strong>: SIEM & Intrusion Detection</li>
                      <li className="flex items-center gap-2"><CheckCircle2 size={12} className="text-green-500"/> <strong>Falco</strong>: Runtime container security</li>
                      <li className="flex items-center gap-2"><CheckCircle2 size={12} className="text-green-500"/> <strong>ClamAV</strong>: Anti-virus engine</li>
                      <li className="flex items-center gap-2"><CheckCircle2 size={12} className="text-green-500"/> <strong>Snort</strong>: Network Intrusion Prevention (NIPS)</li>
                  </ul>
              </div>
          </div>

          <div className="bg-red-900/10 border border-red-500/30 p-6 rounded-xl">
              <h3 className="font-bold text-white mb-2 text-lg">Anti-Phishing & Social Engineering</h3>
              <p className="text-sm text-slate-300">
                  The <strong>Cognitive Firewall</strong> analyzes incoming messages and emails for sentiment anomalies, urgency triggers, and linguistic patterns 
                  typical of social engineering attacks. Links are sandboxed and pre-scanned before you click.
              </p>
          </div>
      </div>
  );

  const renderMarketingAutoDoc = () => (
      <div className="space-y-8 max-w-4xl mx-auto animate-in fade-in duration-300">
          <div>
              <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-2"><Megaphone size={32} className="text-pink-500"/> Open Source Marketing Automation</h1>
              <p className="text-slate-400">Complete Implementation Guide for Zero-Cost Growth Stack.</p>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
              <h3 className="font-bold text-white mb-4 text-xl">Stack Architecture</h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-300">
                  <li className="flex items-center gap-2"><div className="w-2 h-2 bg-blue-500 rounded-full"></div> <strong>Email:</strong> Mautic or Listmonk</li>
                  <li className="flex items-center gap-2"><div className="w-2 h-2 bg-blue-500 rounded-full"></div> <strong>Social:</strong> Buffer (OSS) / SocialHub</li>
                  <li className="flex items-center gap-2"><div className="w-2 h-2 bg-blue-500 rounded-full"></div> <strong>Analytics:</strong> Matomo / PostHog</li>
                  <li className="flex items-center gap-2"><div className="w-2 h-2 bg-blue-500 rounded-full"></div> <strong>CRM:</strong> SuiteCRM / EspoCRM</li>
                  <li className="flex items-center gap-2"><div className="w-2 h-2 bg-purple-500 rounded-full"></div> <strong>Automation:</strong> n8n / Apache Airflow</li>
                  <li className="flex items-center gap-2"><div className="w-2 h-2 bg-green-500 rounded-full"></div> <strong>Landing Pages:</strong> GrapesJS</li>
              </ul>
          </div>

          <div className="space-y-6">
              <h3 className="text-2xl font-bold text-white">Phase 1: Foundation Setup</h3>
              <div className="bg-[#1e1e1e] border border-slate-800 rounded-lg overflow-hidden">
                  <div className="bg-[#252526] px-4 py-2 border-b border-black text-xs font-bold text-slate-400">Server Prep</div>
                  <pre className="p-4 font-mono text-xs text-blue-300 overflow-x-auto">
{`# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Create directory
mkdir ~/marketing-automation
cd ~/marketing-automation`}
                  </pre>
              </div>
              
              <div className="bg-[#1e1e1e] border border-slate-800 rounded-lg overflow-hidden">
                  <div className="bg-[#252526] px-4 py-2 border-b border-black text-xs font-bold text-slate-400">docker-compose.yml (n8n + Postgres)</div>
                  <pre className="p-4 font-mono text-xs text-green-300 overflow-x-auto">
{`version: '3.8'
services:
  n8n:
    image: n8nio/n8n
    ports: ["5678:5678"]
    environment:
      - N8N_BASIC_AUTH_ACTIVE=true
      - N8N_HOST=automation.yourdomain.com
    volumes:
      - ./n8n_data:/home/node/.n8n
  
  postgres:
    image: postgres:14
    environment:
      - POSTGRES_USER=n8n
      - POSTGRES_PASSWORD=secure_password
      - POSTGRES_DB=n8n
    volumes:
      - ./postgres_data:/var/lib/postgresql/data`}
                  </pre>
              </div>
          </div>

          <div className="space-y-6">
              <h3 className="text-2xl font-bold text-white">Phase 2: Email & CRM</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
                      <h4 className="font-bold text-white mb-2">Mautic Setup</h4>
                      <p className="text-sm text-slate-400 mb-2">World's largest open-source marketing automation project.</p>
                      <ul className="text-xs text-slate-500 list-disc pl-4 space-y-1">
                          <li>Campaign Builder</li>
                          <li>Contact Segmentation</li>
                          <li>Asset Management</li>
                      </ul>
                  </div>
                  <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
                      <h4 className="font-bold text-white mb-2">SuiteCRM Integration</h4>
                      <p className="text-sm text-slate-400 mb-2">Salesforce alternative. 360-degree view of customers.</p>
                      <ul className="text-xs text-slate-500 list-disc pl-4 space-y-1">
                          <li>Lead Management</li>
                          <li>Workflow Automation</li>
                          <li>Reporting</li>
                      </ul>
                  </div>
              </div>
          </div>

          <div className="space-y-6">
              <h3 className="text-2xl font-bold text-white">Phase 5: Workflow Automation (n8n)</h3>
              <div className="bg-[#1e1e1e] border border-slate-800 rounded-lg overflow-hidden">
                  <div className="bg-[#252526] px-4 py-2 border-b border-black text-xs font-bold text-slate-400">Lead Capture Workflow JSON</div>
                  <pre className="p-4 font-mono text-xs text-yellow-300 overflow-x-auto">
{`{
  "nodes": [
    {
      "name": "Webhook",
      "type": "n8n-nodes-base.webhook",
      "parameters": { "path": "lead-capture", "httpMethod": "POST" }
    },
    {
      "name": "Mautic",
      "type": "n8n-nodes-base.mautic",
      "parameters": { "operation": "create", "email": "={{$json.email}}" }
    },
    {
      "name": "SuiteCRM",
      "type": "n8n-nodes-base.suitecrm",
      "parameters": { "operation": "create", "module": "Leads" }
    }
  ],
  "connections": {
    "Webhook": { "main": [[{ "node": "Mautic", "type": "main", "index": 0 }]] },
    "Mautic": { "main": [[{ "node": "SuiteCRM", "type": "main", "index": 0 }]] }
  }
}`}
                  </pre>
              </div>
          </div>
          
          <div className="bg-gradient-to-r from-green-900/20 to-emerald-900/20 border border-green-500/30 p-6 rounded-xl">
              <h3 className="font-bold text-white mb-2 text-lg">Cost Comparison</h3>
              <div className="grid grid-cols-2 gap-8 mt-4">
                  <div>
                      <div className="text-xs font-bold text-slate-500 uppercase mb-1">Open Source Stack</div>
                      <div className="text-2xl font-bold text-green-400">$21 - $57 <span className="text-sm font-normal text-slate-400">/mo</span></div>
                      <ul className="text-xs text-slate-400 mt-2 space-y-1">
                          <li>• VPS Hosting (4GB RAM)</li>
                          <li>• Domain & SSL</li>
                          <li>• Transactional Email</li>
                      </ul>
                  </div>
                  <div>
                      <div className="text-xs font-bold text-slate-500 uppercase mb-1">Proprietary (HubSpot etc)</div>
                      <div className="text-2xl font-bold text-red-400">$800+ <span className="text-sm font-normal text-slate-400">/mo</span></div>
                      <ul className="text-xs text-slate-400 mt-2 space-y-1">
                          <li>• Marketing Hub Pro</li>
                          <li>• Seat Licenses</li>
                          <li>• Add-ons</li>
                      </ul>
                  </div>
              </div>
              <div className="mt-4 pt-4 border-t border-green-500/20 text-center text-sm font-bold text-green-300">
                  Annual Savings: ~$9,500
              </div>
          </div>
      </div>
  );

  const renderDevGuide = () => {
      if (!isAuth) {
          return (
              <div className="h-full flex items-center justify-center p-8">
                  <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-8 relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-orange-500"></div>
                      
                      {authStep === 'FORM' && (
                          <div className="animate-in fade-in slide-in-from-right duration-300">
                              <div className="text-center mb-8">
                                  <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-700">
                                      <Lock size={32} className="text-red-500"/>
                                  </div>
                                  <h2 className="text-2xl font-bold text-white">Restricted Access</h2>
                                  <p className="text-slate-400 text-sm mt-2">
                                      The Developer Architecture Guide contains sensitive proprietary framework information. 
                                      Please identify yourself to proceed.
                                  </p>
                              </div>

                              <form onSubmit={handleFormSubmit} className="space-y-4">
                                  <div>
                                      <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Business Email</label>
                                      <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-slate-950 border border-slate-700 rounded p-3 text-sm text-white focus:border-red-500 outline-none transition"/>
                                  </div>
                                  {/* ... Form inputs ... */}
                                  <button type="submit" disabled={isVerifying} className="w-full py-3 bg-red-600 hover:bg-red-500 text-white font-bold rounded-lg shadow-lg shadow-red-900/20 flex items-center justify-center gap-2 transition disabled:opacity-50">
                                      {isVerifying ? <Loader2 className="animate-spin" size={18}/> : <ArrowRight size={18}/>}
                                      Verify Identity
                                  </button>
                              </form>
                          </div>
                      )}

                      {/* ... 2FA and Success states ... */}
                      {authStep === '2FA' && (
                          <div className="text-center animate-in fade-in slide-in-from-right duration-300">
                              <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-700">
                                  <Fingerprint size={32} className="text-orange-500"/>
                              </div>
                              <h2 className="text-2xl font-bold text-white">Two-Factor Auth</h2>
                              <p className="text-slate-400 text-sm mt-2 mb-6">
                                  A verification signal has been sent to your registered device. Please confirm the biometrics.
                              </p>
                              <div className="flex justify-center gap-2 mb-8">
                                  {[1,2,3,4,5,6].map(i => (
                                      <div key={i} className="w-3 h-3 bg-slate-700 rounded-full animate-pulse" style={{animationDelay: `${i*0.2}s`}}></div>
                                  ))}
                              </div>
                              <button onClick={handle2FA} disabled={isVerifying} className="w-full py-3 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-lg shadow-lg shadow-orange-900/20 flex items-center justify-center gap-2 transition disabled:opacity-50">
                                  {isVerifying ? <Loader2 className="animate-spin" size={18}/> : <CheckCircle2 size={18}/>}
                                  Confirm Biometrics
                              </button>
                          </div>
                      )}

                      {authStep === 'SUCCESS' && (
                          <div className="text-center animate-in fade-in zoom-in duration-300 py-10">
                              <CheckCircle2 size={64} className="text-green-500 mx-auto mb-4"/>
                              <h2 className="text-2xl font-bold text-white">Access Granted</h2>
                              <p className="text-green-400 text-sm mt-2">Redirecting to Secure Hub...</p>
                          </div>
                      )}
                  </div>
              </div>
          )
      }

      return (
          <div className="space-y-8 animate-in fade-in duration-500 max-w-5xl mx-auto">
              <div className="bg-gradient-to-r from-red-900/20 to-orange-900/20 border border-red-500/30 p-6 rounded-xl flex items-center justify-between">
                  <div>
                      <h1 className="text-2xl font-bold text-white flex items-center gap-2"><Lock size={24} className="text-red-500"/> Megam Core Developer Hub</h1>
                      <p className="text-slate-400 text-sm mt-1">Confidential • Internal Use Only • Session ID: {Date.now().toString(36).toUpperCase()}</p>
                  </div>
                  <div className="px-3 py-1 bg-green-500/10 border border-green-500/30 text-green-400 rounded-full text-xs font-bold flex items-center gap-2">
                      <UserCheck size={14}/> Verified: {formData.email || 'Admin'}
                  </div>
              </div>

              {/* ... Detailed technical architecture ... */}
              <div className="space-y-6">
                  <h2 className="text-xl font-bold text-white">System Architecture Deep Dive</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
                          <h3 className="font-bold text-white mb-4 flex items-center gap-2"><Cpu size={18} className="text-purple-400"/> Neural Bridge (x86-CUDA)</h3>
                          <p className="text-sm text-slate-300 leading-relaxed">
                              The Neural Bridge uses a Just-In-Time (JIT) transpiler that intercepts PyTorch tensor operations. Instead of dispatching to a physical GPU, it breaks down matrix multiplications into vectorized AVX-512 instructions optimized for CPU caches.
                          </p>
                      </div>
                      <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
                          <h3 className="font-bold text-white mb-4 flex items-center gap-2"><Globe size={18} className="text-blue-400"/> SWGI Protocol</h3>
                          <p className="text-sm text-slate-300 leading-relaxed">
                              SuckSaas Web Gateway Interface (SWGI) replaces traditional WSGI. It maintains persistent WebSocket connections for stateful AI agents.
                          </p>
                      </div>
                  </div>
              </div>
          </div>
      );
  };

  return (
    <div className="h-full flex flex-col bg-slate-950 text-slate-200 font-sans">
      <div className="p-4 bg-slate-900 border-b border-slate-800 flex justify-between items-center">
          <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-600 rounded-lg text-white">
                  <Book size={20}/>
              </div>
              <h1 className="text-lg font-bold text-white">Megam Docs Hub</h1>
          </div>
          <div className="flex gap-2">
              <input placeholder="Search documentation..." className="bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-xs w-64 focus:border-blue-500 outline-none text-white"/>
          </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
          {/* Sidebar */}
          <div className="w-64 bg-slate-900/50 border-r border-slate-800 flex flex-col p-4 gap-2 overflow-y-auto">
              {[
                  { id: 'PLATFORM', label: 'Platform Overview', icon: Layout },
                  { id: 'APPS', label: 'Badal Apps', icon: Grid },
                  { id: 'INFRA', label: 'Infrastructure', icon: Server },
                  { id: 'STORAGE', label: 'Storage & Vault', icon: Database },
                  { id: 'PRICING', label: 'Pricing & FinOps', icon: DollarSign },
                  { id: 'MARKETING_AUTO', label: 'Marketing Auto Guide', icon: Megaphone },
                  { id: 'FRAMEWORKS', label: 'Framework Registry', icon: Package },
                  { id: 'BROWSER', label: 'Browser Guide', icon: Globe },
                  { id: 'SECURITY_GUIDE', label: 'Security & Compliance', icon: Shield },
              ].map(item => (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id as any)}
                    className={`text-left px-4 py-3 rounded-lg text-sm font-medium transition flex items-center gap-3 ${activeSection === item.id ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
                  >
                      <item.icon size={16}/> {item.label}
                  </button>
              ))}
              
              <div className="mt-4 pt-4 border-t border-slate-800">
                  <div className="px-4 text-[10px] font-bold text-slate-500 uppercase mb-2">Restricted Area</div>
                  <button onClick={() => setActiveSection('DEV_GUIDE')} className={`w-full text-left px-4 py-3 rounded-lg text-sm font-bold transition flex items-center gap-3 border ${activeSection === 'DEV_GUIDE' ? 'bg-red-600 text-white border-red-500' : 'text-red-400 border-red-900/30 hover:bg-red-900/10'}`}>
                      <Lock size={16}/> Developer Guide
                  </button>
              </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 overflow-y-auto p-8 bg-slate-950 relative">
              {activeSection === 'PLATFORM' && renderPlatformDoc()}
              {activeSection === 'APPS' && renderAppsDoc()}
              {activeSection === 'INFRA' && renderInfraDoc()}
              {activeSection === 'STORAGE' && renderStorageDoc()}
              {activeSection === 'PRICING' && renderPricingDoc()}
              {activeSection === 'MARKETING_AUTO' && renderMarketingAutoDoc()}
              {activeSection === 'FRAMEWORKS' && renderFrameworksDoc()}
              {activeSection === 'BROWSER' && renderBrowserDoc()}
              {activeSection === 'SECURITY_GUIDE' && renderSecurityGuide()}
              {activeSection === 'DEV_GUIDE' && renderDevGuide()}
          </div>
      </div>
    </div>
  );
};

export default DocumentationHub;
