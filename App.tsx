
import React, { useState, useEffect, useMemo } from 'react';
import { HashRouter, Routes, Route, NavLink } from 'react-router-dom';
import { Home, ClipboardList, Bell, User, Plus, Search, Sun, Moon } from 'lucide-react';
import Dashboard from './components/Dashboard';
import OrderList from './components/OrderList';
import Reminders from './components/Reminders';
import Profile from './components/Profile';
import OrderForm from './components/OrderForm';
import { Order, OrderStatus } from './types';
import { DEMO_ORDERS } from './constants';

const App: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('fof_orders');
    return saved ? JSON.parse(saved) : DEMO_ORDERS;
  });
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('fof_theme');
    return (saved as 'light' | 'dark') || 'light';
  });

  useEffect(() => {
    localStorage.setItem('fof_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('fof_theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  const addOrder = (order: Order) => {
    setOrders(prev => [order, ...prev]);
    setIsFormOpen(false);
  };

  const updateOrder = (updatedOrder: Order) => {
    setOrders(prev => prev.map(o => o.id === updatedOrder.id ? updatedOrder : o));
  };

  const deleteOrder = (id: string) => {
    setOrders(prev => prev.filter(o => o.id !== id));
  };

  return (
    <HashRouter>
      <div className="flex flex-col min-h-screen pb-20 max-w-md mx-auto relative shadow-2xl bg-white dark:bg-navy-950 overflow-hidden font-sans transition-colors duration-300">
        
        {/* Header */}
        <header className="px-6 pt-8 pb-4 flex justify-between items-center sticky top-0 z-40 bg-white/80 dark:bg-navy-950/80 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gold-500 flex items-center justify-center font-serif font-bold text-navy-950">F</div>
            <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-navy-900 to-navy-700 dark:from-white dark:to-slate-400 bg-clip-text text-transparent">
              OrderFlow <span className="text-gold-500">Pro</span>
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-full glass hover:bg-navy-100 dark:hover:bg-navy-800 transition-all duration-300"
            >
              {theme === 'light' ? <Moon size={20} className="text-navy-900" /> : <Sun size={20} className="text-gold-500" />}
            </button>
            <button className="p-2 rounded-full glass hover:bg-navy-100 dark:hover:bg-navy-800 transition-all duration-300">
              <Search size={20} className="text-navy-500 dark:text-slate-400" />
            </button>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 px-4 overflow-y-auto no-scrollbar">
          <Routes>
            <Route path="/" element={<Dashboard orders={orders} onUpdateOrder={updateOrder} />} />
            <Route path="/orders" element={<OrderList orders={orders} onUpdateOrder={updateOrder} onDeleteOrder={deleteOrder} />} />
            <Route path="/reminders" element={<Reminders orders={orders} />} />
            <Route path="/profile" element={<Profile orders={orders} theme={theme} onToggleTheme={toggleTheme} />} />
          </Routes>
        </main>

        {/* Floating Action Button */}
        <button 
          onClick={() => setIsFormOpen(true)}
          className="fixed bottom-24 right-6 w-14 h-14 rounded-full bg-gold-500 text-navy-950 flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all duration-300 z-50 gold-glow"
        >
          <Plus size={32} />
        </button>

        {/* Bottom Navigation */}
        <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto glass border-t border-navy-100 dark:border-white/5 px-6 py-4 flex justify-between items-center z-50">
          <NavItem to="/" icon={<Home size={24} />} label="Home" />
          <NavItem to="/orders" icon={<ClipboardList size={24} />} label="Orders" />
          <NavItem to="/reminders" icon={<Bell size={24} />} label="Alerts" />
          <NavItem to="/profile" icon={<User size={24} />} label="Profile" />
        </nav>

        {/* Add Order Overlay */}
        {isFormOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-navy-900/40 dark:bg-navy-950/90 backdrop-blur-sm" onClick={() => setIsFormOpen(false)} />
            <OrderForm onSubmit={addOrder} onCancel={() => setIsFormOpen(false)} />
          </div>
        )}
      </div>
    </HashRouter>
  );
};

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
}

const NavItem: React.FC<NavItemProps> = ({ to, icon, label }) => {
  return (
    <NavLink 
      to={to} 
      className={({ isActive }) => 
        `flex flex-col items-center gap-1 transition-all duration-300 ${isActive ? 'text-gold-500 scale-110' : 'text-navy-400 dark:text-slate-500 hover:text-navy-900 dark:hover:text-slate-300'}`
      }
    >
      {icon}
      <span className="text-[10px] font-medium uppercase tracking-wider">{label}</span>
    </NavLink>
  );
};

export default App;
