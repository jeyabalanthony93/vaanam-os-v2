









import React, { useState } from 'react';
import { Package, Download, Search, Server, Database, Code, Shield, Box, CheckCircle2, Zap, Layers, BarChart3, Cpu, CreditCard, BookOpen, Terminal, Play, Wand2, Copy, Loader2, Settings, Layout, Globe, Lock, Video, Image as ImageIcon, Smartphone, Cloud, GitBranch, Key, Activity, Lightbulb, FileCode, ArrowRight, X, Music, Radio, Megaphone, Atom, Network } from 'lucide-react';
import { generatePackageScript } from '../services/geminiService';

interface PackageItem {
  id: string;
  name: string;
  category: 'WEB' | 'DATA' | 'DEVOPS' | 'OS' | 'SERVER' | 'APP' | 'DEV' | 'SECURITY' | 'API' | 'AUDIO' | 'MOBILE' | 'MARKETING' | 'QUANTUM';
  description: string;
  version: string;
  installed: boolean;
  icon: any;
  tags: string[];
  installCmd?: string;
  configSnippet?: string;
}

interface SolutionRecipe {
    id: string;
    title: string;
    description: string;
    useCase: string;
    frameworks: string[];
    complexity: 'Low' | 'Medium' | 'High';
    codeSnippet: string;
}

const PACKAGES: PackageItem[] = [
  // --- NEW: REAL-TIME DATA & ALERTS ---
  { id: 'yfinance', name: 'yfinance', category: 'DATA', description: 'Access financial data from Yahoo Finance.', version: '0.2.36', installed: false, icon: BarChart3, tags: ['Finance', 'Stocks'], installCmd: 'pip install yfinance', configSnippet: 'import yfinance as yf' },
  { id: 'alpha-vantage', name: 'Alpha Vantage', category: 'DATA', description: 'Real-time stock APIs (Free Tier).', version: '2.3.1', installed: false, icon: Activity, tags: ['API', 'Forex'], installCmd: 'pip install alpha_vantage', configSnippet: 'from alpha_vantage.timeseries import TimeSeries' },
  { id: 'pathway', name: 'Pathway', category: 'DATA', description: 'Real-time stream processing & analytics.', version: '0.1.0', installed: false, icon: Zap, tags: ['Streaming', 'ETL'], installCmd: 'pip install pathway', configSnippet: 'import pathway as pw' },
  { id: 'news-fetch', name: 'news-fetch', category: 'DATA', description: 'Extract news from any website.', version: '0.4.2', installed: false, icon: Globe, tags: ['Scraping', 'News'], installCmd: 'pip install news-fetch', configSnippet: 'from newsfetch.news import newspaper' },
  { id: 'pandas-ta', name: 'pandas-ta', category: 'DATA', description: 'Technical Analysis library for Pandas.', version: '0.3.14', installed: false, icon: Database, tags: ['TA', 'Finance'], installCmd: 'pip install pandas_ta', configSnippet: 'import pandas_ta as ta' },

  // --- NEW: QUANTUM COMPUTING ---
  { id: 'qiskit', name: 'Qiskit', category: 'QUANTUM', description: 'Open-source SDK for working with quantum computers (IBM).', version: '1.0.0', installed: true, icon: Atom, tags: ['Quantum', 'IBM'], installCmd: 'pip install qiskit', configSnippet: 'from qiskit import QuantumCircuit' },
  { id: 'cirq', name: 'Cirq', category: 'QUANTUM', description: 'Framework for NISQ circuits (Google).', version: '1.3.0', installed: false, icon: Atom, tags: ['Quantum', 'NISQ'], installCmd: 'pip install cirq', configSnippet: 'import cirq' },
  { id: 'pennylane', name: 'PennyLane', category: 'QUANTUM', description: 'Cross-platform Python library for differentiable quantum programming.', version: '0.35.0', installed: false, icon: Zap, tags: ['QML', 'AI'], installCmd: 'pip install pennylane', configSnippet: 'import pennylane as qml' },
  { id: 'blueqat', name: 'blueqat', category: 'QUANTUM', description: 'Quantum computing SDK.', version: '0.4.5', installed: false, icon: Code, tags: ['SDK'], installCmd: 'pip install blueqat', configSnippet: 'from blueqat import Circuit' },
  { id: 'braket', name: 'Amazon Braket SDK', category: 'QUANTUM', description: 'Interact with Amazon Braket quantum services.', version: '1.74.0', installed: false, icon: Cloud, tags: ['AWS', 'Cloud'], installCmd: 'pip install amazon-braket-sdk', configSnippet: 'from braket.circuits import Circuit' },
  { id: 'cuda-q', name: 'CUDA-Q', category: 'QUANTUM', description: 'Platform for accelerated quantum-classical applications on GPUs.', version: '0.6.0', installed: false, icon: Cpu, tags: ['GPU', 'Hybrid'], installCmd: 'apt-get install cuda-quantum', configSnippet: '#include <cudaq.h>' },
  { id: 'forest', name: 'Forest (pyquil)', category: 'QUANTUM', description: 'Rigetti software library for quantum programs.', version: '4.7.0', installed: false, icon: Box, tags: ['Rigetti'], installCmd: 'pip install pyquil', configSnippet: 'from pyquil import Program' },
  { id: 'ocean', name: 'D-Wave Ocean', category: 'QUANTUM', description: 'Tools for solving hard problems with D-Wave quantum computers.', version: '6.4.0', installed: false, icon: Layers, tags: ['Annealing'], installCmd: 'pip install dwave-ocean-sdk', configSnippet: 'from dwave.system import DWaveSampler' },
  { id: 'projectq', name: 'ProjectQ', category: 'QUANTUM', description: 'Hardware-agnostic framework with compiler and simulator.', version: '0.8.0', installed: false, icon: Settings, tags: ['Simulator'], installCmd: 'pip install projectq', configSnippet: 'from projectq import MainEngine' },
  { id: 'strawberryfields', name: 'Strawberry Fields', category: 'QUANTUM', description: 'Library for photonic quantum computing (Xanadu).', version: '0.23.0', installed: false, icon: Zap, tags: ['Photonic'], installCmd: 'pip install strawberryfields', configSnippet: 'import strawberryfields as sf' },
  { id: 'tensorcircuit', name: 'TensorCircuit', category: 'QUANTUM', description: 'Tensor network based quantum software framework.', version: '0.11.0', installed: false, icon: Activity, tags: ['Tensor', 'QML'], installCmd: 'pip install tensorcircuit', configSnippet: 'import tensorcircuit as tc' },
  { id: 'tk', name: 'pytket', category: 'QUANTUM', description: 'Quantum computing toolkit for compiling circuits (Quantinuum).', version: '1.25.0', installed: false, icon: Layers, tags: ['Compiler'], installCmd: 'pip install pytket', configSnippet: 'from pytket import Circuit' },
  { id: 'qibo', name: 'Qibo', category: 'QUANTUM', description: 'Framework for quantum simulation and hardware control.', version: '0.2.3', installed: false, icon: Cpu, tags: ['Simulation'], installCmd: 'pip install qibo', configSnippet: 'from qibo import Circuit' },
  { id: 'tequila', name: 'Tequila', category: 'QUANTUM', description: 'Extensible Quantum Information and Learning Architecture.', version: '1.8.0', installed: false, icon: BookOpen, tags: ['Research'], installCmd: 'pip install tequila-quantum', configSnippet: 'import tequila as tq' },
  { id: 'openql', name: 'OpenQL', category: 'QUANTUM', description: 'Compiler framework for quantum accelerators.', version: '0.9.0', installed: false, icon: Code, tags: ['Compiler'], installCmd: 'pip install openql', configSnippet: 'import openql as ql' },
  { id: 'qadence', name: 'Qadence', category: 'QUANTUM', description: 'Differentiable digital and digital-analog quantum programs.', version: '1.0.0', installed: false, icon: Zap, tags: ['Analog'], installCmd: 'pip install qadence', configSnippet: 'from qadence import *' },
  { id: 'quantumcat', name: 'quantumcat', category: 'QUANTUM', description: 'High-level cross-platform quantum library.', version: '0.1', installed: false, icon: Atom, tags: ['Cross-Platform'], installCmd: 'pip install quantumcat', configSnippet: 'from quantumcat import Circuit' },
  { id: 'qrisp', name: 'Qrisp', category: 'QUANTUM', description: 'High-level programming language for quantum algorithms.', version: '0.4', installed: false, icon: Terminal, tags: ['Language'], installCmd: 'pip install qrisp', configSnippet: 'from qrisp import QuantumVariable' },
  { id: 'qristal', name: 'Qristal', category: 'QUANTUM', description: 'Quantum Brilliance hybrid development platform.', version: '1.0', installed: false, icon: Cpu, tags: ['Hybrid'], installCmd: 'pip install qb-core', configSnippet: 'import qb.core' },
  { id: 'tangelo', name: 'Tangelo', category: 'QUANTUM', description: 'Toolkit for quantum chemistry simulation.', version: '0.4', installed: false, icon: Activity, tags: ['Chemistry'], installCmd: 'pip install tangelo-quantum', configSnippet: 'from tangelo import SecondQuantizedMolecule' },
  { id: 'perceval', name: 'Perceval', category: 'QUANTUM', description: 'Programming realistic photonic quantum computers.', version: '0.10', installed: false, icon: Zap, tags: ['Photonic'], installCmd: 'pip install perceval-quandela', configSnippet: 'import perceval as pcvl' },
  { id: 'bosonic-qiskit', name: 'Bosonic Qiskit', category: 'QUANTUM', description: 'Simulate hybrid boson-qubit systems.', version: '0.1', installed: false, icon: Layers, tags: ['Hybrid'], installCmd: 'pip install bosonic-qiskit', configSnippet: 'import bosonic_qiskit' },
  { id: 'pyqudit', name: 'PyQudit', category: 'QUANTUM', description: 'Universal gates in N-dimensions.', version: '1.0', installed: false, icon: Code, tags: ['Qudit'], installCmd: 'pip install pyqudit', configSnippet: 'import pyqudit' },
  { id: 'quantum-os', name: 'Quantum OS', category: 'QUANTUM', description: 'Linux kernel optimized for quantum control.', version: '1.0', installed: false, icon: Server, tags: ['Kernel'], installCmd: 'apt-get install quantum-os-kernel', configSnippet: 'uname -r # quantum' },
  { id: 'ket', name: 'Ket', category: 'QUANTUM', description: 'Embedded language for quantum programming.', version: '0.5', installed: false, icon: Terminal, tags: ['Language'], installCmd: 'pip install ket-lang', configSnippet: 'from ket import *' },

  // --- EXISTING WEB ---
  { id: 'django', name: 'Django', category: 'WEB', description: 'The web framework for perfectionists with deadlines.', version: '5.0.3', installed: true, icon: Server, tags: ['Framework', 'ORM'], installCmd: 'pip install django', configSnippet: 'django-admin startproject mysite' },
  { id: 'flask', name: 'Flask', category: 'WEB', description: 'A lightweight WSGI web application framework.', version: '3.0.0', installed: true, icon: Code, tags: ['Microframework'], installCmd: 'pip install flask', configSnippet: 'app = Flask(__name__)' },
  { id: 'fastapi', name: 'FastAPI', category: 'WEB', description: 'High performance, easy to learn, fast to code.', version: '0.109.0', installed: false, icon: Zap, tags: ['Async', 'API'], installCmd: 'pip install fastapi uvicorn', configSnippet: 'app = FastAPI()' },
  { id: 'scrapy', name: 'Scrapy', category: 'WEB', description: 'Framework for extracting data from websites.', version: '2.11.0', installed: false, icon: Box, tags: ['Crawling'], installCmd: 'pip install scrapy', configSnippet: 'scrapy startproject myproject' },
  
  // --- EXISTING DATA ---
  { id: 'pandas', name: 'Pandas', category: 'DATA', description: 'Data structures for data analysis.', version: '2.2.0', installed: true, icon: Database, tags: ['Data Analysis'], installCmd: 'pip install pandas', configSnippet: 'import pandas as pd' },
  { id: 'pytorch', name: 'PyTorch', category: 'DATA', description: 'Deep learning with strong GPU acceleration.', version: '2.2.0', installed: true, icon: Database, tags: ['DL', 'GPU'], installCmd: 'pip install torch', configSnippet: 'import torch' },
  { id: 'tensorflow', name: 'TensorFlow', category: 'DATA', description: 'End-to-end platform for machine learning.', version: '2.15.0', installed: false, icon: Box, tags: ['DL', 'Production'], installCmd: 'pip install tensorflow', configSnippet: 'import tensorflow as tf' },
  { id: 'scikit-learn', name: 'Scikit-learn', category: 'DATA', description: 'Traditional ML: Classification, Regression.', version: '1.4.1', installed: false, icon: BarChart3, tags: ['ML', 'CPU'], installCmd: 'pip install scikit-learn', configSnippet: 'from sklearn import datasets' },

  // --- EXISTING DEVOPS ---
  { id: 'ansible', name: 'Ansible', category: 'DEVOPS', description: 'IT automation platform.', version: '9.2.0', installed: true, icon: Shield, tags: ['Automation'], installCmd: 'pip install ansible', configSnippet: 'ansible-playbook site.yml' },
  { id: 'docker-compose', name: 'Docker Compose', category: 'DEVOPS', description: 'Define and run multi-container applications.', version: '2.24.5', installed: true, icon: Box, tags: ['Container'], installCmd: 'apt-get install docker-compose', configSnippet: 'docker-compose up -d' },

  // --- EXISTING AUDIO & MEDIA PACKAGES ---
  { id: 'librosa', name: 'Librosa', category: 'AUDIO', description: 'Python package for music and audio analysis.', version: '0.10.1', installed: false, icon: Music, tags: ['Audio', 'Analysis'], installCmd: 'pip install librosa', configSnippet: 'import librosa\ny, sr = librosa.load("audio.mp3")' },
  { id: 'torchaudio', name: 'PyTorch Audio', category: 'AUDIO', description: 'Data manipulation and transformation for audio.', version: '2.2.0', installed: false, icon: Activity, tags: ['DL', 'Audio'], installCmd: 'pip install torchaudio', configSnippet: 'import torchaudio' },
  { id: 'audiocraft', name: 'AudioCraft (Meta)', category: 'AUDIO', description: 'Generative AI for audio (MusicGen, AudioGen).', version: '1.0.0', installed: false, icon: Wand2, tags: ['Generative', 'AI'], installCmd: 'pip install audiocraft', configSnippet: 'model = MusicGen.get_pretrained("small")' },
  { id: 'juce', name: 'JUCE', category: 'AUDIO', description: 'C++ framework for audio applications and plugins.', version: '7.0.9', installed: false, icon: Radio, tags: ['VST', 'C++'], installCmd: 'git clone https://github.com/juce-framework/JUCE.git', configSnippet: '#include <JuceHeader.h>' },
  { id: 'ffmpeg', name: 'FFmpeg', category: 'AUDIO', description: 'Complete solution to record, convert and stream audio/video.', version: '6.1', installed: true, icon: Terminal, tags: ['CLI', 'Media'], installCmd: 'apt-get install ffmpeg', configSnippet: 'ffmpeg -i input.mp4 output.mp3' },

  // --- EXISTING MARKETING ---
  { id: 'mautic', name: 'Mautic', category: 'MARKETING', description: 'Open Source Marketing Automation Platform.', version: '5.0.0', installed: false, icon: Megaphone, tags: ['Automation', 'Email'], installCmd: 'composer create-project mautic/recommended-project', configSnippet: 'php bin/console mautic:segments:update' },
  { id: 'matomo', name: 'Matomo', category: 'MARKETING', description: 'Google Analytics alternative that protects your data.', version: '5.0.2', installed: false, icon: BarChart3, tags: ['Analytics', 'Privacy'], installCmd: 'apt-get install matomo', configSnippet: './console core:archive' },
  { id: 'ghost', name: 'Ghost', category: 'MARKETING', description: 'Turn your audience into a business. Publishing platform.', version: '5.79.0', installed: false, icon: FileCode, tags: ['CMS', 'Blog'], installCmd: 'npm install ghost-cli -g', configSnippet: 'ghost install' },
  { id: 'listmonk', name: 'Listmonk', category: 'MARKETING', description: 'High performance, self-hosted newsletter and mailing list manager.', version: '3.0.0', installed: false, icon: Megaphone, tags: ['Newsletter', 'Go'], installCmd: 'docker run listmonk/listmonk', configSnippet: './listmonk --config config.toml' },

  // --- EXISTING APIs ---
  { id: 'badal-auth', name: 'Badal Auth API', category: 'API', description: 'Unified Identity Management and SSO provider.', version: 'v2.1', installed: true, icon: Shield, tags: ['Megam OS', 'Auth'], installCmd: 'npm install @badal/auth', configSnippet: 'const auth = new BadalAuth({ key: process.env.BADAL_KEY });' },
  { id: 'badal-billing', name: 'Badal FinOps', category: 'API', description: 'Cost calculation engine.', version: 'v1.4', installed: false, icon: CreditCard, tags: ['Megam OS', 'Finance'], installCmd: 'npm install @badal/billing', configSnippet: 'const billing = new BadalBilling();' },

  // --- EXISTING OS ---
  { id: 'linux-kernel', name: 'Linux Kernel', category: 'OS', description: 'The core component for many operating systems.', version: '6.8.0', installed: true, icon: Cpu, tags: ['Kernel', 'Core'], installCmd: 'apt-get install linux-image-generic', configSnippet: 'uname -r' },
  { id: 'ubuntu', name: 'Ubuntu', category: 'OS', description: 'Popular Linux distribution for both desktop and server.', version: '24.04 LTS', installed: true, icon: Layout, tags: ['Distro', 'Debian'], installCmd: 'do-release-upgrade', configSnippet: 'lsb_release -a' },
  { id: 'android-aosp', name: 'Android (AOSP)', category: 'OS', description: 'Open-source base for mobile operating systems.', version: '14.0', installed: false, icon: Smartphone, tags: ['Mobile', 'ARM'], installCmd: 'repo init -u https://android.googlesource.com/platform/manifest', configSnippet: 'source build/envsetup.sh' },
  { id: 'freebsd', name: 'FreeBSD', category: 'OS', description: 'Unix-like operating system known for stability.', version: '14.0', installed: false, icon: Server, tags: ['BSD', 'Unix'], installCmd: 'pkg install freebsd', configSnippet: 'freebsd-version' },

  // --- EXISTING MOBILE & EDGE ---
  { id: 'react-native', name: 'React Native', category: 'MOBILE', description: 'Build native apps using React.', version: '0.73.0', installed: true, icon: Code, tags: ['Cross-Platform'], installCmd: 'npx react-native init', configSnippet: 'import { View } from "react-native"' },
  { id: 'flutter', name: 'Flutter', category: 'MOBILE', description: 'UI toolkit for building beautiful, natively compiled applications.', version: '3.16.0', installed: false, icon: Layout, tags: ['Dart', 'UI'], installCmd: 'flutter create my_app', configSnippet: 'runApp(MyApp());' },
  { id: 'tensorflow-lite', name: 'TensorFlow Lite', category: 'MOBILE', description: 'Deploy machine learning models on mobile and edge devices.', version: '2.14.0', installed: true, icon: Cpu, tags: ['Edge AI', 'NPU'], installCmd: 'pip install tflite-runtime', configSnippet: 'interpreter = tf.lite.Interpreter(model_path="model.tflite")' },
  { id: 'asterisk', name: 'Asterisk', category: 'MOBILE', description: 'Open source framework for building communications applications.', version: '21.0.0', installed: true, icon: Radio, tags: ['VoIP', 'SIP'], installCmd: 'apt-get install asterisk', configSnippet: 'asterisk -r' },

  // --- EXISTING Server ---
  { id: 'apache', name: 'Apache HTTP Server', category: 'SERVER', description: 'Widely used, high-performance web server.', version: '2.4.58', installed: false, icon: Globe, tags: ['Web Server'], installCmd: 'apt-get install apache2', configSnippet: 'systemctl start apache2' },
  { id: 'nginx', name: 'Nginx', category: 'SERVER', description: 'High-performance HTTP server, reverse proxy, and LB.', version: '1.25.3', installed: true, icon: Globe, tags: ['Web Server', 'Proxy'], installCmd: 'apt-get install nginx', configSnippet: 'nginx -t' },
  { id: 'mysql', name: 'MySQL', category: 'SERVER', description: 'Robust open-source relational database.', version: '8.0.36', installed: false, icon: Database, tags: ['SQL', 'DB'], installCmd: 'apt-get install mysql-server', configSnippet: 'mysql -u root -p' },
  { id: 'postgresql', name: 'PostgreSQL', category: 'SERVER', description: 'Advanced enterprise-class object-relational database.', version: '16.2', installed: true, icon: Database, tags: ['SQL', 'DB'], installCmd: 'apt-get install postgresql', configSnippet: 'psql -U postgres' },
  { id: 'mongodb', name: 'MongoDB', category: 'SERVER', description: 'Cross-platform document-oriented database.', version: '7.0.5', installed: false, icon: Database, tags: ['NoSQL', 'DB'], installCmd: 'apt-get install mongodb-org', configSnippet: 'mongosh' },
  { id: 'docker', name: 'Docker Engine', category: 'SERVER', description: 'OS-level virtualization to deliver software in containers.', version: '25.0.3', installed: true, icon: Box, tags: ['Container'], installCmd: 'apt-get install docker-ce', configSnippet: 'docker run hello-world' },
  { id: 'kubernetes', name: 'Kubernetes', category: 'SERVER', description: 'Automating deployment, scaling, and management.', version: '1.29.2', installed: true, icon: Layers, tags: ['Orchestration'], installCmd: 'snap install microk8s', configSnippet: 'kubectl get nodes' },
  { id: 'nextcloud', name: 'Nextcloud', category: 'SERVER', description: 'Self-hosted productivity platform for file share.', version: '28.0.2', installed: false, icon: Cloud, tags: ['Storage', 'Sync'], installCmd: 'snap install nextcloud', configSnippet: 'nextcloud.enable-https' },
  { id: 'openstack', name: 'OpenStack', category: 'SERVER', description: 'Software for creating private and public clouds.', version: '2023.2', installed: false, icon: Cloud, tags: ['IaaS', 'Cloud'], installCmd: 'apt-get install openstack-dashboard', configSnippet: 'openstack server list' },

  // --- EXISTING Apps ---
  { id: 'libreoffice', name: 'LibreOffice', category: 'APP', description: 'Full office suite: word processing, spreadsheets.', version: '7.6.4', installed: false, icon: Layout, tags: ['Office', 'Productivity'], installCmd: 'apt-get install libreoffice', configSnippet: 'libreoffice --writer' },
  { id: 'gimp', name: 'GIMP', category: 'APP', description: 'Cross-platform raster graphics editor.', version: '2.10.36', installed: false, icon: ImageIcon, tags: ['Graphics', 'Editor'], installCmd: 'apt-get install gimp', configSnippet: 'gimp image.png' },
  { id: 'vlc', name: 'VLC Media Player', category: 'APP', description: 'Portable multimedia player for audio and video.', version: '3.0.20', installed: false, icon: Video, tags: ['Media', 'Player'], installCmd: 'apt-get install vlc', configSnippet: 'vlc video.mp4' },

  // --- EXISTING Dev Tools ---
  { id: 'vscode', name: 'VS Code (OSS)', category: 'DEV', description: 'Popular, open-source code editor.', version: '1.87.0', installed: true, icon: Code, tags: ['Editor', 'IDE'], installCmd: 'snap install code', configSnippet: 'code .' },
  { id: 'git', name: 'Git', category: 'DEV', description: 'Distributed version control system.', version: '2.43.0', installed: true, icon: GitBranch, tags: ['VCS', 'Source'], installCmd: 'apt-get install git', configSnippet: 'git init' },

  // --- EXISTING AI/Data ---
  { id: 'mlflow', name: 'MLflow', category: 'DATA', description: 'Manage the ML lifecycle (experiments, deployment).', version: '2.10.2', installed: false, icon: Activity, tags: ['MLOps'], installCmd: 'pip install mlflow', configSnippet: 'mlflow ui' },
  { id: 'superset', name: 'Apache Superset', category: 'DATA', description: 'Modern data exploration and visualization platform.', version: '3.1.0', installed: false, icon: BarChart3, tags: ['Analytics', 'BI'], installCmd: 'pip install apache-superset', configSnippet: 'superset run' },

  // --- SECURITY (Enhanced) ---
  { id: 'kali-linux', name: 'Kali Linux', category: 'SECURITY', description: 'Advanced Penetration Testing Linux distribution.', version: '2024.1', installed: false, icon: Terminal, tags: ['PenTest', 'OS'], installCmd: 'docker run -t -i kalilinux/kali-rolling /bin/bash', configSnippet: 'apt update && apt install kali-linux-headless' },
  { id: 'keepass', name: 'KeePass', category: 'SECURITY', description: 'Open source password manager.', version: '2.56', installed: false, icon: Key, tags: ['Password', 'Vault'], installCmd: 'apt-get install keepass2', configSnippet: 'keepass2' },
  { id: 'metasploit', name: 'Metasploit', category: 'SECURITY', description: 'Penetration testing framework.', version: '6.3.55', installed: false, icon: Shield, tags: ['Exploit', 'Ruby'], installCmd: 'curl ... | bash', configSnippet: 'msfconsole' },
  { id: 'nikto', name: 'Nikto', category: 'SECURITY', description: 'Web server scanner.', version: '2.5.0', installed: false, icon: Search, tags: ['Scanner', 'Perl'], installCmd: 'apt-get install nikto', configSnippet: 'nikto -h http://localhost' },
  { id: 'nmap', name: 'Nmap', category: 'SECURITY', description: 'Network exploration tool and security scanner.', version: '7.94', installed: true, icon: Network, tags: ['Scanner', 'Discovery'], installCmd: 'apt-get install nmap', configSnippet: 'nmap -A 192.168.1.1' },
  { id: 'openvas', name: 'OpenVAS', category: 'SECURITY', description: 'Full-featured vulnerability scanner.', version: '22.4', installed: false, icon: Activity, tags: ['Scanner', 'Vuln'], installCmd: 'docker run openvas', configSnippet: 'omp -u admin' },
  { id: 'ossec', name: 'OSSEC', category: 'SECURITY', description: 'Host-based Intrusion Detection System (HIDS).', version: '3.7.0', installed: false, icon: Shield, tags: ['HIDS', 'Log'], installCmd: 'yum install ossec-hids-server', configSnippet: '/var/ossec/bin/ossec-control start' },
  { id: 'security-onion', name: 'Security Onion', category: 'SECURITY', description: 'Linux distro for intrusion detection and NSM.', version: '2.4.40', installed: false, icon: Layers, tags: ['SIEM', 'NSM'], installCmd: 'git clone ...', configSnippet: 'sudo so-status' },
  { id: 'veracrypt', name: 'VeraCrypt', category: 'SECURITY', description: 'Disk encryption software.', version: '1.26.7', installed: false, icon: Lock, tags: ['Encryption', 'Disk'], installCmd: 'apt install veracrypt', configSnippet: 'veracrypt -t -c' },
  { id: 'wireshark', name: 'Wireshark', category: 'SECURITY', description: 'Network protocol analyzer.', version: '4.2.3', installed: false, icon: Search, tags: ['Network', 'Audit'], installCmd: 'apt-get install wireshark', configSnippet: 'wireshark' },
  { id: 'openvpn', name: 'OpenVPN', category: 'SECURITY', description: 'Robust and highly flexible VPN daemon.', version: '2.6.9', installed: true, icon: Lock, tags: ['VPN', 'Tunnel'], installCmd: 'apt-get install openvpn', configSnippet: 'openvpn --config client.ovpn' },
  { id: 'pfsense', name: 'pfSense', category: 'SECURITY', description: 'Firewall and router software.', version: '2.7.2', installed: false, icon: Shield, tags: ['Firewall'], installCmd: 'Install via ISO', configSnippet: 'pfctl -s rules' },
];

const SOLUTIONS: SolutionRecipe[] = [
    {
        id: 'sol-1',
        title: 'Async Invoice Processing Pipeline',
        description: 'Offload heavy image processing tasks to background workers to keep your web app responsive.',
        useCase: 'A SaaS platform where users upload thousands of scanned invoices daily. The system needs to resize images, extract metadata, and store results without blocking the upload interface.',
        frameworks: ['Celery', 'Pillow', 'Redis', 'SQLAlchemy'],
        complexity: 'Medium',
        codeSnippet: `
# 1. task_queue.py
from celery import Celery
from PIL import Image
from sqlalchemy.orm import Session
from database import Invoice, engine

# Initialize Celery with Redis broker
app = Celery('invoices', broker='redis://localhost:6379/0')

@app.task
def process_invoice_image(invoice_id, image_path):
    """Background task to resize image and update DB"""
    
    # 1. Image Processing with Pillow
    with Image.open(image_path) as img:
        # Convert to grayscale and resize for archival
        img = img.convert('L') 
        img.thumbnail((1024, 1024))
        optimized_path = image_path.replace('.jpg', '_opt.jpg')
        img.save(optimized_path, "JPEG", quality=85)

    # 2. Database Update with SQLAlchemy
    with Session(engine) as session:
        invoice = session.query(Invoice).get(invoice_id)
        if invoice:
            invoice.status = 'PROCESSED'
            invoice.file_path = optimized_path
            session.commit()
            
    return f"Invoice {invoice_id} processed successfully."
`
    },
    {
        id: 'sol-siem',
        title: 'Open Source SIEM Stack',
        description: 'Build a comprehensive Security Information and Event Management system using Security Onion, OSSEC, and Wazuh.',
        useCase: 'Enterprise security monitoring requiring low cost but high fidelity intrusion detection, log analysis, and file integrity monitoring across a hybrid cloud environment.',
        frameworks: ['Security Onion', 'OSSEC', 'Wazuh', 'Elasticsearch'],
        complexity: 'High',
        codeSnippet: `
# 1. Wazuh Manager Installation (Docker)
docker run -d -p 443:443 -p 1514:1514/udp -p 55000:55000 \\
  -v /var/ossec/data:/var/ossec/data \\
  --name wazuh-manager wazuh/wazuh:4.7.2

# 2. OSSEC Agent Configuration
<agent_config>
  <syscheck>
    <!-- File Integrity Monitoring -->
    <directories check_all="yes" realtime="yes">/etc,/usr/bin</directories>
  </syscheck>
  <active-response>
    <command>firewall-drop</command>
    <location>local</location>
  </active-response>
</agent_config>

# 3. Security Onion Setup
sudo so-setup # Sensor mode`
    },
];

const PackageCenter: React.FC = () => {
  const [activeView, setActiveView] = useState<'STORE' | 'GUIDE' | 'MAGIC_BOX' | 'SOLUTIONS'>('STORE');
  const [activeCategory, setActiveCategory] = useState<'ALL' | 'WEB' | 'DATA' | 'DEVOPS' | 'OS' | 'SERVER' | 'APP' | 'DEV' | 'SECURITY' | 'API' | 'AUDIO' | 'MOBILE' | 'MARKETING' | 'QUANTUM'>('ALL');
  const [search, setSearch] = useState('');
  const [items, setItems] = useState(PACKAGES);
  const [installingId, setInstallingId] = useState<string | null>(null);
  
  // Magic Box State
  const [magicPackage, setMagicPackage] = useState(PACKAGES[0].id);
  const [magicPrompt, setMagicPrompt] = useState('');
  const [magicCode, setMagicCode] = useState('');
  const [magicOutput, setMagicOutput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isRunning, setIsRunning] = useState(false);

  // Guide State
  const [selectedGuidePkg, setSelectedGuidePkg] = useState(PACKAGES[0]);

  // Solutions State
  const [selectedSolution, setSelectedSolution] = useState<SolutionRecipe | null>(null);

  const toggleInstall = (id: string) => {
      // Find package
      const pkg = items.find(p => p.id === id);
      if (!pkg) return;

      if (pkg.installed) {
          // Instant uninstall
          setItems(prev => prev.map(p => p.id === id ? { ...p, installed: false } : p));
      } else {
          // Simulate Installation Process
          setInstallingId(id);
          setTimeout(() => {
              setItems(prev => prev.map(p => p.id === id ? { ...p, installed: true } : p));
              setInstallingId(null);
          }, 2000);
      }
  };

  const handleGenerateMagic = async () => {
      if (!magicPrompt) return;
      setIsGenerating(true);
      const pkgName = items.find(p => p.id === magicPackage)?.name || '';
      const code = await generatePackageScript(pkgName, magicPrompt);
      setMagicCode(code);
      setIsGenerating(false);
  };

  const handleRunMagic = () => {
      setIsRunning(true);
      setMagicOutput('Initializing Megam Sandbox environment...\nLoading Neural Bridge context...\n');
      setTimeout(() => {
          setMagicOutput(prev => prev + `\n> Executing script for ${items.find(p => p.id === magicPackage)?.name}...\n`);
          setTimeout(() => {
              setMagicOutput(prev => prev + `[SUCCESS] Script executed successfully.\nOutput: { status: 200, message: "Operation completed on Badal Cloud" }`);
              setIsRunning(false);
          }, 1500);
      }, 800);
  };

  const filteredPackages = items.filter(p => 
      (activeCategory === 'ALL' || p.category === activeCategory) &&
      p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col bg-slate-950 text-slate-200 font-sans">
        {/* Header */}
        <div className="p-4 bg-slate-900 border-b border-slate-800 flex justify-between items-center">
            <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-br from-pink-500 to-rose-600 rounded-xl shadow-lg shadow-pink-900/20">
                    <Package size={24} className="text-white"/>
                </div>
                <div>
                    <h1 className="text-xl font-bold text-white">Megam Package Center</h1>
                    <p className="text-slate-400 text-xs">Manage Open Source Libraries & APIs</p>
                </div>
            </div>
            
            {/* Main Nav */}
            <div className="flex bg-slate-950 rounded-lg p-1 border border-slate-800">
                <button onClick={() => setActiveView('STORE')} className={`px-4 py-2 rounded-md text-xs font-bold flex items-center gap-2 transition ${activeView === 'STORE' ? 'bg-pink-600 text-white' : 'text-slate-400 hover:text-white'}`}>
                    <Box size={14}/> Store
                </button>
                <button onClick={() => setActiveView('GUIDE')} className={`px-4 py-2 rounded-md text-xs font-bold flex items-center gap-2 transition ${activeView === 'GUIDE' ? 'bg-pink-600 text-white' : 'text-slate-400 hover:text-white'}`}>
                    <BookOpen size={14}/> Installation Guide
                </button>
                <button onClick={() => setActiveView('MAGIC_BOX')} className={`px-4 py-2 rounded-md text-xs font-bold flex items-center gap-2 transition ${activeView === 'MAGIC_BOX' ? 'bg-pink-600 text-white' : 'text-slate-400 hover:text-white'}`}>
                    <Wand2 size={14}/> Magic Box
                </button>
                <button onClick={() => setActiveView('SOLUTIONS')} className={`px-4 py-2 rounded-md text-xs font-bold flex items-center gap-2 transition ${activeView === 'SOLUTIONS' ? 'bg-pink-600 text-white' : 'text-slate-400 hover:text-white'}`}>
                    <Lightbulb size={14}/> Solution Bank
                </button>
            </div>

            <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search packages..."
                    className="bg-slate-800 border border-slate-700 rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:ring-2 focus:ring-pink-500 outline-none w-64"
                />
            </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden">
            
            {/* 1. STORE VIEW */}
            {activeView === 'STORE' && (
                <div className="h-full flex flex-col">
                    <div className="flex border-b border-slate-800 bg-slate-900/50 px-6 overflow-x-auto">
                        {[
                            { id: 'ALL', label: 'All', icon: Box },
                            { id: 'QUANTUM', label: 'Quantum', icon: Atom },
                            { id: 'DATA', label: 'Data & AI', icon: Database },
                            { id: 'OS', label: 'OS & Kernel', icon: Cpu },
                            { id: 'SERVER', label: 'Servers', icon: Server },
                            { id: 'WEB', label: 'Web Dev', icon: Code },
                            { id: 'MOBILE', label: 'Mobile & Edge', icon: Smartphone },
                            { id: 'MARKETING', label: 'Marketing', icon: Megaphone },
                            { id: 'DEVOPS', label: 'DevOps', icon: Layers },
                            { id: 'APP', label: 'Apps', icon: Layout },
                            { id: 'DEV', label: 'Dev Tools', icon: Terminal },
                            { id: 'SECURITY', label: 'Security', icon: Shield },
                            { id: 'AUDIO', label: 'Audio & Media', icon: Music },
                            { id: 'API', label: 'Badal APIs', icon: Zap },
                        ].map(cat => (
                            <button
                                key={cat.id}
                                onClick={() => setActiveCategory(cat.id as any)}
                                className={`flex items-center gap-2 px-4 py-3 text-sm font-bold border-b-2 transition whitespace-nowrap ${activeCategory === cat.id ? 'border-pink-500 text-pink-400 bg-slate-800' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
                            >
                                <cat.icon size={16} /> {cat.label}
                            </button>
                        ))}
                    </div>
                    <div className="flex-1 overflow-y-auto p-6 bg-slate-950">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filteredPackages.map(pkg => (
                                <div key={pkg.id} className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-pink-500/50 transition flex flex-col justify-between group">
                                    <div>
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="p-2 bg-slate-800 rounded-lg border border-slate-700 text-slate-300 group-hover:text-pink-400 transition">
                                                <pkg.icon size={24} />
                                            </div>
                                            <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-500 border border-slate-700">{pkg.version}</span>
                                        </div>
                                        <h3 className="font-bold text-white mb-1">{pkg.name}</h3>
                                        <p className="text-xs text-slate-400 mb-4 line-clamp-2">{pkg.description}</p>
                                        <div className="flex flex-wrap gap-1 mb-4">
                                            {pkg.tags.map(t => (
                                                <span key={t} className="px-2 py-0.5 bg-slate-950 border border-slate-800 rounded text-[10px] text-slate-500 font-bold">{t}</span>
                                            ))}
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => toggleInstall(pkg.id)}
                                        disabled={installingId === pkg.id}
                                        className={`w-full py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition ${
                                            installingId === pkg.id 
                                            ? 'bg-slate-800 text-pink-400 border border-pink-500/50'
                                            : pkg.installed 
                                            ? 'bg-slate-800 text-green-400 border border-slate-700 hover:bg-slate-700' 
                                            : 'bg-pink-600 hover:bg-pink-500 text-white shadow-lg shadow-pink-900/20'
                                        }`}
                                    >
                                        {installingId === pkg.id ? (
                                            <><Loader2 size={14} className="animate-spin" /> Installing...</>
                                        ) : pkg.installed ? (
                                            <><CheckCircle2 size={14} /> Installed</>
                                        ) : (
                                            <><Download size={14} /> Install</>
                                        )}
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* ... Other Views ... */}
            {activeView === 'GUIDE' && (
                <div className="h-full flex">
                     {/* Sidebar */}
                     <div className="w-64 bg-slate-900 border-r border-slate-800 overflow-y-auto">
                         <div className="p-4 text-xs font-bold text-slate-500 uppercase">Select Package</div>
                         {items.map(pkg => (
                             <button
                                key={pkg.id}
                                onClick={() => setSelectedGuidePkg(pkg)}
                                className={`w-full text-left px-4 py-3 border-l-2 transition hover:bg-slate-800 flex items-center gap-3 ${selectedGuidePkg.id === pkg.id ? 'border-pink-500 bg-slate-800 text-white' : 'border-transparent text-slate-400'}`}
                             >
                                 <pkg.icon size={16}/>
                                 <span className="text-sm font-medium">{pkg.name}</span>
                             </button>
                         ))}
                     </div>

                     {/* Content */}
                     <div className="flex-1 bg-slate-950 p-8 overflow-y-auto">
                         <div className="max-w-3xl mx-auto space-y-8">
                             <div className="flex items-start gap-6 pb-6 border-b border-slate-800">
                                 <div className="p-4 bg-slate-900 rounded-xl border border-slate-800">
                                     <selectedGuidePkg.icon size={48} className="text-pink-500"/>
                                 </div>
                                 <div>
                                     <h2 className="text-3xl font-bold text-white mb-2">{selectedGuidePkg.name}</h2>
                                     <p className="text-slate-400 text-lg mb-4">{selectedGuidePkg.description}</p>
                                     <div className="flex gap-2">
                                         <span className={`px-2 py-1 rounded text-xs font-bold ${selectedGuidePkg.installed ? 'bg-green-500/20 text-green-400' : 'bg-slate-800 text-slate-500'}`}>
                                             {selectedGuidePkg.installed ? 'Installed' : 'Not Installed'}
                                         </span>
                                         <span className="px-2 py-1 rounded text-xs font-bold bg-slate-800 text-slate-400">{selectedGuidePkg.version}</span>
                                     </div>
                                 </div>
                             </div>

                             {/* Installation */}
                             <div className="space-y-4">
                                 <h3 className="text-xl font-bold text-white flex items-center gap-2"><Terminal size={20}/> Installation</h3>
                                 <div className="bg-black border border-slate-800 rounded-lg p-4 font-mono text-sm text-slate-300 flex justify-between items-center group">
                                     <span>{selectedGuidePkg.installCmd || 'No install command'}</span>
                                     <button className="text-slate-500 hover:text-white opacity-0 group-hover:opacity-100 transition"><Copy size={16}/></button>
                                 </div>
                                 {!selectedGuidePkg.installed && (
                                     <button 
                                        onClick={() => toggleInstall(selectedGuidePkg.id)}
                                        disabled={installingId === selectedGuidePkg.id}
                                        className="bg-pink-600 hover:bg-pink-500 text-white px-6 py-2 rounded-lg font-bold text-sm transition flex items-center gap-2"
                                    >
                                         {installingId === selectedGuidePkg.id ? <Loader2 className="animate-spin" size={16}/> : <Download size={16}/>}
                                         {installingId === selectedGuidePkg.id ? 'Processing...' : 'Install Now'}
                                     </button>
                                 )}
                             </div>

                             {/* Configuration */}
                             <div className="space-y-4">
                                 <h3 className="text-xl font-bold text-white flex items-center gap-2"><Settings size={20}/> Configuration</h3>
                                 <div className="bg-[#1e1e1e] border border-slate-800 rounded-lg p-4 font-mono text-sm text-blue-300">
                                     {selectedGuidePkg.configSnippet || '# No configuration snippet available'}
                                 </div>
                             </div>
                         </div>
                     </div>
                </div>
            )}

            {/* 3. MAGIC BOX VIEW */}
            {activeView === 'MAGIC_BOX' && (
                <div className="h-full flex flex-col lg:flex-row">
                    {/* Left: Input */}
                    <div className="lg:w-1/3 bg-slate-900 border-r border-slate-800 p-6 flex flex-col gap-6 overflow-y-auto">
                        <div>
                             <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2"><Wand2 className="text-pink-500"/> Magic Box</h2>
                             <p className="text-sm text-slate-400">Describe what you want to build, and we'll generate the solution script using your installed packages.</p>
                        </div>

                        <div className="space-y-4">
                             <div>
                                 <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Select Package Context</label>
                                 <select 
                                    value={magicPackage}
                                    onChange={(e) => setMagicPackage(e.target.value)}
                                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-sm text-white outline-none focus:border-pink-500"
                                 >
                                     {items.filter(p => p.installed).map(p => (
                                         <option key={p.id} value={p.id}>{p.name}</option>
                                     ))}
                                 </select>
                             </div>

                             <div>
                                 <label className="text-xs font-bold text-slate-500 uppercase block mb-2">What do you want to build?</label>
                                 <textarea 
                                    value={magicPrompt}
                                    onChange={(e) => setMagicPrompt(e.target.value)}
                                    className="w-full h-32 bg-slate-950 border border-slate-700 rounded-lg p-3 text-sm text-white outline-none focus:border-pink-500 resize-none"
                                    placeholder="e.g., Create a simple REST API with 2 endpoints..."
                                 />
                             </div>

                             <button 
                                onClick={handleGenerateMagic}
                                disabled={isGenerating || !magicPrompt}
                                className="w-full py-3 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white rounded-xl font-bold shadow-lg shadow-pink-900/20 flex items-center justify-center gap-2 disabled:opacity-50"
                             >
                                 {isGenerating ? <Loader2 className="animate-spin" size={18}/> : <Wand2 size={18}/>}
                                 Generate Solution
                             </button>
                        </div>
                    </div>

                    {/* Right: Output */}
                    <div className="flex-1 bg-[#1e1e1e] flex flex-col">
                        <div className="flex-1 p-6 overflow-y-auto border-b border-black">
                             <div className="flex justify-between items-center mb-2">
                                 <span className="text-xs font-bold text-slate-400 uppercase">Generated Code</span>
                                 <button className="text-xs text-slate-500 hover:text-white flex items-center gap-1"><Copy size={12}/> Copy</button>
                             </div>
                             {magicCode ? (
                                 <pre className="font-mono text-sm text-blue-300 whitespace-pre-wrap">{magicCode}</pre>
                             ) : (
                                 <div className="h-full flex items-center justify-center text-slate-600 italic text-sm">
                                     Generated code will appear here...
                                 </div>
                             )}
                        </div>
                        <div className="h-1/3 bg-black p-4 font-mono text-xs flex flex-col">
                             <div className="flex justify-between items-center mb-2">
                                 <span className="text-slate-500 font-bold uppercase flex items-center gap-2"><Terminal size={12}/> Terminal Output</span>
                                 <button 
                                    onClick={handleRunMagic}
                                    disabled={!magicCode || isRunning}
                                    className="px-4 py-1 bg-green-700 hover:bg-green-600 text-white rounded font-bold flex items-center gap-2 disabled:opacity-50"
                                 >
                                     <Play size={12}/> Run Test
                                 </button>
                             </div>
                             <div className="flex-1 overflow-y-auto text-slate-300 space-y-1">
                                 {isRunning && <div className="text-yellow-500">Running...</div>}
                                 <pre className="whitespace-pre-wrap">{magicOutput}</pre>
                             </div>
                        </div>
                    </div>
                </div>
            )}

            {/* 4. SOLUTION BANK VIEW */}
            {activeView === 'SOLUTIONS' && (
                <div className="h-full flex bg-slate-950">
                    {selectedSolution ? (
                        // Detailed View
                        <div className="flex-1 flex flex-col animate-in fade-in slide-in-from-right duration-300">
                            <div className="border-b border-slate-800 bg-slate-900/50 p-6 flex justify-between items-center">
                                <button onClick={() => setSelectedSolution(null)} className="flex items-center gap-2 text-slate-400 hover:text-white transition text-sm font-bold">
                                    <ArrowRight size={16} className="rotate-180"/> Back to Solutions
                                </button>
                                <button className="flex items-center gap-2 bg-pink-600 hover:bg-pink-500 text-white px-4 py-2 rounded-lg font-bold text-xs transition">
                                    <Copy size={16}/> Copy to IDE
                                </button>
                            </div>
                            <div className="flex-1 overflow-y-auto p-8">
                                <div className="max-w-4xl mx-auto space-y-8">
                                    <div>
                                        <div className="flex items-center gap-3 mb-4">
                                            <span className="px-3 py-1 rounded-full text-xs font-bold bg-pink-900/30 text-pink-400 border border-pink-500/30 uppercase">{selectedSolution.complexity} Complexity</span>
                                            <div className="flex gap-2">
                                                {selectedSolution.frameworks.map(fw => (
                                                    <span key={fw} className="px-2 py-1 rounded bg-slate-800 text-slate-400 text-xs font-mono">{fw}</span>
                                                ))}
                                            </div>
                                        </div>
                                        <h1 className="text-3xl font-bold text-white mb-2">{selectedSolution.title}</h1>
                                        <p className="text-lg text-slate-400">{selectedSolution.description}</p>
                                    </div>

                                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                                        <h3 className="font-bold text-white mb-2 flex items-center gap-2"><Lightbulb size={20} className="text-yellow-400"/> Real-Life Use Case</h3>
                                        <p className="text-slate-300 leading-relaxed text-sm">{selectedSolution.useCase}</p>
                                    </div>

                                    <div>
                                        <h3 className="font-bold text-white mb-4 flex items-center gap-2"><FileCode size={20} className="text-blue-400"/> Implementation Recipe</h3>
                                        <div className="bg-[#1e1e1e] border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
                                            <div className="flex items-center justify-between px-4 py-2 bg-[#252526] border-b border-black">
                                                <div className="flex gap-1.5">
                                                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                                </div>
                                                <span className="text-xs font-mono text-slate-500">solution.py</span>
                                            </div>
                                            <pre className="p-6 font-mono text-sm text-blue-300 overflow-x-auto">
                                                {selectedSolution.codeSnippet}
                                            </pre>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        // List View
                        <div className="flex-1 p-8 overflow-y-auto">
                            <div className="max-w-6xl mx-auto">
                                <div className="mb-8">
                                    <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2"><Lightbulb size={28} className="text-pink-500"/> Solution Bank</h2>
                                    <p className="text-slate-400">Discover production-ready architectures and code patterns using our powerful open-source library.</p>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {SOLUTIONS.map(sol => (
                                        <div 
                                            key={sol.id} 
                                            onClick={() => setSelectedSolution(sol)}
                                            className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-pink-500/50 transition cursor-pointer group hover:bg-slate-800 relative overflow-hidden"
                                        >
                                            <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition">
                                                <ArrowRight size={20} className="text-pink-500 -rotate-45"/>
                                            </div>
                                            <div className="mb-4">
                                                <div className="flex gap-2 mb-2">
                                                    {sol.frameworks.slice(0, 3).map(fw => (
                                                        <span key={fw} className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800">{fw}</span>
                                                    ))}
                                                    {sol.frameworks.length > 3 && <span className="text-[10px] text-slate-500 px-1">+{sol.frameworks.length - 3}</span>}
                                                </div>
                                                <h3 className="text-xl font-bold text-white group-hover:text-pink-400 transition">{sol.title}</h3>
                                            </div>
                                            <p className="text-sm text-slate-400 line-clamp-2 mb-4">{sol.description}</p>
                                            <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
                                                <Activity size={12}/> {sol.complexity} Complexity
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

        </div>
    </div>
  );
};

export default PackageCenter;