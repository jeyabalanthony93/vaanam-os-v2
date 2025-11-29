import React, { useState } from 'react';
import { User, Lock, ArrowRight, Loader2 } from 'lucide-react';

interface LoginScreenProps {
  onLogin: () => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simulate auth delay
    setTimeout(() => {
        setIsLoading(false);
        onLogin();
    }, 1500);
  };

  return (
    <div 
      className="h-full w-full flex items-center justify-center bg-cover bg-center"
      style={{ 
        backgroundImage: 'url("https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop")',
        boxShadow: 'inset 0 0 100px rgba(0,0,0,0.8)' 
      }}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
      
      <div className="relative z-10 w-full max-w-md p-8 rounded-2xl bg-black/30 border border-white/10 backdrop-blur-xl shadow-2xl animate-in fade-in zoom-in duration-500">
        <div className="flex flex-col items-center mb-8">
           <div className="w-24 h-24 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 p-1 mb-4 shadow-lg shadow-cyan-500/20">
               <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center">
                   <User size={48} className="text-slate-200" />
               </div>
           </div>
           <h2 className="text-2xl font-bold text-white">superuser</h2>
           <p className="text-slate-400 text-sm">Megam OS • Enterprise Edition</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
           <div className="relative group">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-cyan-400 transition" size={18} />
              <input 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full bg-slate-900/50 border border-slate-600 rounded-lg py-3 pl-10 pr-4 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition"
                autoFocus
              />
           </div>
           
           <button 
             type="submit" 
             disabled={isLoading}
             className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 transition disabled:opacity-70 disabled:cursor-not-allowed"
           >
             {isLoading ? <Loader2 className="animate-spin" /> : <>Login <ArrowRight size={18} /></>}
           </button>
           
           {error && <p className="text-red-400 text-sm text-center">{error}</p>}
        </form>
        
        <div className="mt-8 flex justify-center gap-4 text-slate-400 text-xs">
           <button className="hover:text-white transition">Switch User</button>
           <span>|</span>
           <button className="hover:text-white transition">Restart</button>
           <span>|</span>
           <button className="hover:text-white transition">Shut Down</button>
        </div>
      </div>

      <div className="absolute bottom-8 right-8 text-white/50 font-mono text-xs">
         v2.0.0-stable
      </div>
    </div>
  );
};

export default LoginScreen;