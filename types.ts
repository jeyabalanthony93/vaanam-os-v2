
export enum AppView {
  DASHBOARD = 'DASHBOARD',
  TERMINAL = 'TERMINAL',
  FILES = 'FILES',
  WORKSPACE = 'WORKSPACE',
  AGENTS = 'AGENTS',
  NETWORK = 'NETWORK',
  VPN = 'VPN',
  INFRASTRUCTURE = 'INFRASTRUCTURE',
  SERVER = 'SERVER',
  MCP_SERVER = 'MCP_SERVER',
  SETTINGS = 'SETTINGS',
  BROWSER = 'BROWSER',
  CALCULATOR = 'CALCULATOR',
  AI_STUDIO = 'AI_STUDIO',
  ETL = 'ETL',
  PACKAGE_CENTER = 'PACKAGE_CENTER',
  SS360 = 'SS360',
  BADAL_AUTH = 'BADAL_AUTH',
  DOCS = 'DOCS',
  BADAL_RAG = 'BADAL_RAG',
  BADAL_RAAG = 'BADAL_RAAG',
  BADAL_PHONE = 'BADAL_PHONE',
  MEGAM_MARKETING = 'MEGAM_MARKETING',
  MEGAM_DC = 'MEGAM_DC',
  MEGAM_SENTINEL = 'MEGAM_SENTINEL',
  MEGAM_QUANTUM = 'MEGAM_QUANTUM',
  MEGAM_AUTOMATE = 'MEGAM_AUTOMATE',
  MEGAM_STUDIO = 'MEGAM_STUDIO',
  MEGAM_CAMPUS = 'MEGAM_CAMPUS',
  BADAL_MAIL = 'BADAL_MAIL',
  MEGAM_ASSISTANT = 'MEGAM_ASSISTANT',
  MEGAM_SCANNER = 'MEGAM_SCANNER',
  MEGAM_TRAVEL = 'MEGAM_TRAVEL',
}

export interface WindowState {
  id: string;
  appId: AppView;
  title: string;
  icon?: any;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  position: { x: number; y: number };
  size: { width: number; height: number };
}

export type BootStep = 'BIOS' | 'BOOT_LOG' | 'LOGIN' | 'DESKTOP';

export interface SystemStats {
  cpuUsage: number;
  memoryUsage: number;
  storageUsed: string;
  networkIn: number;
  networkOut: number;
  activeAgents: number;
}

export interface FileItem {
  id: string;
  name: string;
  type: 'folder' | 'file';
  size: string;
  modified: string;
}

export interface AgentMetrics {
    tokensPerSec: number;
    successRate: number;
    totalCost: number;
    latency: number;
    uptime: number;
    revenueGenerated?: number; // New metric
    leadsGenerated?: number; // New metric
}

export interface AgentContribution {
    id: string;
    timestamp: string;
    output: string;
    type: 'CODE' | 'TEXT' | 'ACTION' | 'BUILD' | 'REVENUE';
}

export interface AgentIntegration {
    id: string;
    name: string;
    type: 'SSH' | 'API_KEY' | 'SIP_VOIP' | 'DATABASE' | 'GIT';
    value: string; // Masked in UI
    status: 'CONNECTED' | 'DISCONNECTED' | 'PENDING';
}

export type AgentCapability = 'OS_KERNEL' | 'SERVER_ADMIN' | 'WEB_DEV' | 'AI_DATA' | 'DEVOPS' | 'APPS' | 'SECURITY' | 'VOIP_COMMS';

export interface AgentConfig {
    model: string;
    temperature: number;
    systemPrompt: string;
    tools: string[];
    isFineTuned: boolean;
    manualIntegrations?: AgentIntegration[];
    capabilities?: AgentCapability[];
}

export interface AgentAsset {
    id: string;
    type: 'EMAIL' | 'VIRTUAL_PC' | 'LICENSE' | 'IP_ADDR';
    name: string;
    detail: string;
    status: 'ACTIVE' | 'REVOKED';
}

export interface SecurityEvent {
    id: string;
    severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    type: 'DATA_EXFIL' | 'POLICY_VIOLATION' | 'ANOMALY' | 'QUALITY_CHECK';
    description: string;
    timestamp: string;
    resolved: boolean;
}

export interface WorkstationState {
    osVersion: string;
    ipAddress: string;
    uptime: string;
    assets: AgentAsset[];
    securityLog: SecurityEvent[];
    webhooks: { url: string, active: boolean, event: string }[];
    installedSoftware: string[];
    remoteSessionId?: string; // For AnyDesk
}

export interface WorkflowTrigger {
  id: string;
  type: 'ON_MESSAGE' | 'ON_EMAIL' | 'ON_SCHEDULE' | 'ON_ALERT';
  config: string;
}

export interface WorkflowStep {
  id: string;
  type: 'ACTION' | 'CONDITION' | 'DELAY' | 'AGENT_HANDOFF';
  label: string;
  config: string;
}

export interface AgentWorkflow {
  id: string;
  name: string;
  trigger: WorkflowTrigger;
  steps: WorkflowStep[];
  active: boolean;
}

export interface Agent {
  id: string;
  name: string;
  role: AgentRole | string;
  department: 'BOARD' | 'TECH' | 'GROWTH' | 'OPS' | 'DATA' | 'DESIGN' | 'RESEARCH' | 'COMMS';
  status: 'IDLE' | 'WORKING' | 'LEARNING' | 'COMPLETED' | 'MEETING' | 'THINKING' | 'ON_CALL';
  health: 'HEALTHY' | 'WARNING' | 'CRITICAL';
  task?: string;
  logs: string[];
  children?: Agent[];
  skills?: string[];
  metrics?: AgentMetrics;
  config?: AgentConfig;
  contributions?: AgentContribution[];
  workflows?: AgentWorkflow[];
  workstation?: WorkstationState; // New workstation state
}

export interface TerminalLine {
  type: 'input' | 'output' | 'error';
  content: string;
}

export enum AgentRole {
  FOUNDER = 'Co-Founder',
  VP_SALES = 'VP Sales',
  VP_MARKETING = 'VP Marketing',
  VP_BIZ_DEV = 'VP Business Dev',
  HEAD_IT = 'Head IT & Infra',
  HEAD_HR = 'Head HR',
  HEAD_FINANCE = 'Chartered Accountant',
  HEAD_QUANTUM = 'Quantum Head',
  HEAD_DESIGN = 'Web & Digital Head',
  HEAD_PR = 'PR & Marcom Head',
  ARCHITECT = 'Cloud Architect',
  DATA_SCIENTIST = 'Data Scientist',
  DATA_ANALYST = 'Data Analyst',
  OFFICE_ADMIN = 'Office Admin (Resource)',
  MANAGER_IT = 'IT Admin Manager',
  MANAGER_PROJECT = 'Project Manager',
  MANAGER_CS = 'Customer Success',
  AGENT = 'Agent',
  RECEPTIONIST = 'Content Receptionist',
  // New Roles
  DEVOPS_ENGINEER = 'DevOps Engineer',
  AI_RESEARCHER = 'AI Researcher',
  IT_SALES_ENGINEER = 'IT Sales Engineer',
  KERNEL_ARCHITECT = 'Vaanam Kernel Architect',
  VOIP_ENGINEER = 'VoIP Systems Engineer',
  QUANTUM_ENGINEER = 'Quantum Engineer & QML Ops'
}

export interface Email {
  id: string;
  from: string;
  to?: string;
  cc?: string;
  bcc?: string;
  subject: string;
  preview: string;
  content: string;
  date: string;
  read: boolean;
  folder: 'inbox' | 'sent' | 'spam' | 'drafts' | 'trash';
  tags?: string[];
}

// SuckChain Library Types
export interface ChainNode {
  id: string;
  type: 'TRIGGER' | 'PROMPT' | 'LLM' | 'RETRIEVER' | 'OUTPUT_PARSER' | 'TOOL' | 'MEMORY' | 'ROUTER';
  label: string;
  position?: { x: number, y: number };
  config: {
      template?: string; // For Prompts
      model?: string; // For LLMs
      temperature?: number; // For LLMs
      k?: number; // For Retriever
      source?: string; // For Retriever
      schema?: string; // For Parsers
      variable?: string; // For Inputs
      [key: string]: any;
  };
  status: 'IDLE' | 'RUNNING' | 'COMPLETED' | 'ERROR';
}

export interface ChainArtifact {
    id: string;
    name: string;
    description: string;
    version: string;
    nodes: ChainNode[];
    created: string;
    deployed: boolean;
}

export interface RAGIndex {
  id: string;
  name: string;
  documents: number;
  vectors: number;
  size: string;
  status: 'READY' | 'INDEXING' | 'EMPTY';
}

export interface ModelHubItem {
    id: string;
    name: string;
    description: string;
    tags: string[];
    downloads: string;
    likes: number;
    author: string;
    updated: string;
    contextWindow: string;
}

export interface IQScore {
    mmlu: number;
    reasoning: number;
    coding: number;
    safety: number;
    overall: number;
}

export interface FineTuneJob {
    id: string;
    model: string;
    dataset: string;
    status: 'RUNNING' | 'COMPLETED' | 'FAILED' | 'QUEUED' | 'EVALUATING';
    epoch: number;
    totalEpochs: number;
    loss: number;
    accuracy: number;
    startTime: string;
    iqScore?: IQScore;
}

export interface LLMArchitecture {
    name: string;
    params: string;
    layers: number;
    embeddingDim: number;
    type: 'TRANSFORMER' | 'RNN' | 'SSM' | 'MoE';
    baseModel?: string; // e.g. Llama-3, Mistral
}

// ETL Types
export interface ETLPipeline {
    id: string;
    name: string;
    source: string;
    sourceType: 'DB' | 'API' | 'FILE' | 'STREAM';
    destination: string;
    destinationType: 'WAREHOUSE' | 'LAKE' | 'SHEET';
    schedule: string;
    status: 'IDLE' | 'RUNNING' | 'FAILED' | 'SUCCESS';
    lastRun: string;
    rowsProcessed: number;
    throughput: number;
}

// Workspace Kanban Types
export interface KanbanTask {
    id: string;
    title: string;
    tag: string;
    assignee?: string;
    status: 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'DONE';
}

// RAG Server Types
export interface RAGSearchResult {
    content: string;
    score: number; // 0-1
    source: string;
    page?: number;
    type: 'VECTOR' | 'KEYWORD' | 'HYBRID';
}

export interface KnowledgeBase {
    id: string;
    name: string;
    status: 'ACTIVE' | 'SYNCING' | 'ERROR';
    docCount: number;
    vectorCount: number;
    lastUpdated: string;
    accessLevel: 'PUBLIC' | 'PRIVATE' | 'RESTRICTED';
}

// MCP Memory Types
export interface MemoryFact {
    id: string;
    entity: string;
    fact: string;
    confidence: number;
    timestamp: string;
    source: 'CONVERSATION' | 'DOCUMENT' | 'TOOL';
}

// Server Management
export type ServerEnvironment = 'PRIMARY' | 'FAILOVER' | 'DEV_CLUSTER' | 'NEURAL_CORE';

// Automation Types
export interface AutomationNode {
    id: string;
    type: 'TRIGGER' | 'ACTION' | 'CONDITION' | 'LOOP' | 'CODE';
    label: string;
    icon?: any;
    x: number;
    y: number;
    config: any;
    status: 'IDLE' | 'RUNNING' | 'SUCCESS' | 'ERROR';
}

export interface AutomationConnection {
    id: string;
    from: string;
    to: string;
}

// Studio Types
export interface DesignLayer {
    id: string;
    type: 'RECT' | 'TEXT' | 'IMAGE' | 'CIRCLE';
    x: number;
    y: number;
    width: number;
    height: number;
    fill: string;
    content?: string; // For text/image url
    opacity: number;
    rotation: number;
}

// Hugging Face Types
export interface HFModel {
    id: string;
    name: string;
    downloads: number;
    likes: number;
    task: string;
}

export interface AgentTask {
    id: string;
    description: string;
    status: 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED';
    logs: string[];
    result?: string;
    timestamp: string;
}

// Hosting Types
export interface HostingState {
    domain: string;
    status: 'AVAILABLE' | 'REGISTERED' | 'PROPAGATING' | 'LIVE';
    ssl: boolean;
    dnsRecords: { type: string; name: string; value: string; ttl: string }[];
    expiryDate?: string;
}

// Campus & Academy Types
export interface CourseModule {
    id: string;
    title: string;
    duration: string;
    completed: boolean;
}

export interface Course {
    id: number;
    title: string;
    track: 'SALES' | 'DEVOPS' | 'SUPPORT' | 'GENERAL';
    progress: number;
    status: 'COMPLETED' | 'IN_PROGRESS' | 'LOCKED';
    content: string;
    modules: CourseModule[];
}

export interface MeetingParticipant {
    id: string;
    name: string;
    role: 'HOST' | 'PRESENTER' | 'ATTENDEE';
    avatarColor: string;
    isSpeaking: boolean;
}

export interface AgentHierarchyNode {
    id: string;
    name: string;
    role: string;
    children: AgentHierarchyNode[];
}
