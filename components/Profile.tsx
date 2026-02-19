
import React from 'react';
import { Order, OrderStatus } from '../types';
import { Settings, Shield, CreditCard, ChevronRight, BarChart3, Download, Zap, LogOut, Sun, Moon } from 'lucide-react';

interface ProfileProps {
  orders: Order[];
  theme?: 'light' | 'dark';
  onToggleTheme?: () => void;
}

const Profile: React.FC<ProfileProps> = ({ orders, theme, onToggleTheme }) => {
  const completedCount = orders.filter(o => o.status === OrderStatus.COMPLETED || o.status === OrderStatus.DELIVERED).length;
  const totalRev = orders
    .filter(o => o.status === OrderStatus.COMPLETED || o.status === OrderStatus.DELIVERED)
    .reduce((acc, o) => acc + (o.price || 0), 0);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      
      {/* Profile Header */}
      <div className="flex flex-col items-center py-6">
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-navy-100 dark:bg-navy-800 border-2 border-gold-500 p-1 flex items-center justify-center overflow-hidden shadow-lg">
            <img 
               src="https://picsum.photos/seed/freelancer/200" 
               alt="Profile" 
               className="w-full h-full rounded-full object-cover"
            />
          </div>
          <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-gold-500 rounded-full flex items-center justify-center text-navy-950 border-4 border-white dark:border-navy-950">
            <Zap size={16} fill="currentColor" />
          </div>
        </div>
        <h2 className="text-2xl font-bold mt-4 text-navy-950 dark:text-white">Marcus Aurelius</h2>
        <p className="text-gold-600 dark:text-gold-500 text-xs font-bold uppercase tracking-widest mt-1">Level 2 Seller • Top Rated</p>
      </div>

      {/* Stats Summary Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="glass rounded-3xl p-5 text-center shadow-md">
           <h4 className="text-navy-400 dark:text-slate-500 text-[10px] uppercase font-bold tracking-tighter mb-1">Total Delivered</h4>
           <p className="text-2xl font-bold text-navy-950 dark:text-white">{completedCount}</p>
        </div>
        <div className="glass rounded-3xl p-5 text-center shadow-md">
           <h4 className="text-navy-400 dark:text-slate-500 text-[10px] uppercase font-bold tracking-tighter mb-1">Lifetime Rev</h4>
           <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">${totalRev.toLocaleString()}</p>
        </div>
      </div>

      {/* Menu Options */}
      <div className="space-y-3">
        <p className="text-[10px] uppercase tracking-widest text-navy-400 dark:text-slate-600 font-bold ml-4 mb-2">Appearance & Tools</p>
        
        <button 
          onClick={onToggleTheme}
          className="w-full glass rounded-2xl p-4 flex justify-between items-center hover:bg-navy-50 dark:hover:bg-navy-800 transition-all active:scale-98 shadow-sm"
        >
          <div className="flex items-center gap-4">
            {theme === 'light' ? <Moon className="text-navy-800" /> : <Sun className="text-gold-500" />}
            <span className="text-sm font-medium text-navy-900 dark:text-slate-200">Switch to {theme === 'light' ? 'Dark' : 'Light'} Mode</span>
          </div>
          <ChevronRight size={18} className="text-navy-300 dark:text-slate-700" />
        </button>

        <MenuButton icon={<BarChart3 className="text-blue-500" />} label="Detailed Analytics" />
        <MenuButton icon={<Download className="text-purple-500" />} label="Export Records (CSV/PDF)" />
        <MenuButton icon={<Shield className="text-green-500" />} label="Security & Biometrics" />
        <MenuButton icon={<CreditCard className="text-gold-600 dark:text-gold-500" />} label="Billing & Subscription" />
        <MenuButton icon={<Settings className="text-navy-400 dark:text-slate-400" />} label="General Settings" />
      </div>

      {/* Logout */}
      <button className="w-full py-4 glass text-red-600 dark:text-red-500 font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-red-500/10 transition-colors shadow-sm">
        <LogOut size={20} />
        Logout Session
      </button>

      {/* Version Tag */}
      <div className="text-center opacity-50">
        <p className="text-[10px] text-navy-900 dark:text-slate-700 uppercase tracking-widest">FiverrOrderFlow Pro v2.5.0 (Modernized)</p>
      </div>
    </div>
  );
};

const MenuButton: React.FC<{ icon: React.ReactNode, label: string }> = ({ icon, label }) => (
  <button className="w-full glass rounded-2xl p-4 flex justify-between items-center hover:bg-navy-50 dark:hover:bg-navy-800 transition-all active:scale-98 shadow-sm">
    <div className="flex items-center gap-4">
      {icon}
      <span className="text-sm font-medium text-navy-900 dark:text-slate-200">{label}</span>
    </div>
    <ChevronRight size={18} className="text-navy-300 dark:text-slate-700" />
  </button>
);

export default Profile;
