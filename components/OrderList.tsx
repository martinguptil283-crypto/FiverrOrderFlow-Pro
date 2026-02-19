
import React, { useState } from 'react';
import { Order, OrderStatus } from '../types';
import { Filter, Search, Trash2, CheckCircle } from 'lucide-react';
import OrderCard from './OrderCard';

interface OrderListProps {
  orders: Order[];
  onUpdateOrder: (order: Order) => void;
  onDeleteOrder: (id: string) => void;
}

const OrderList: React.FC<OrderListProps> = ({ orders, onUpdateOrder, onDeleteOrder }) => {
  const [activeTab, setActiveTab] = useState<'active' | 'archived'>('active');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.buyerName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         order.details.toLowerCase().includes(searchTerm.toLowerCase());
    const isCompleted = order.status === OrderStatus.COMPLETED;
    
    if (activeTab === 'active') return matchesSearch && !isCompleted;
    return matchesSearch && isCompleted;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col gap-4">
        <h2 className="text-2xl font-bold px-2 text-navy-950 dark:text-white">Manage Orders</h2>
        
        {/* Search & Filter */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 text-navy-400 dark:text-slate-500" size={18} />
            <input 
              type="text" 
              placeholder="Search by buyer..." 
              className="w-full bg-navy-50 dark:bg-navy-800 border border-navy-100 dark:border-white/5 rounded-2xl pl-10 pr-4 py-3 focus:outline-none focus:border-gold-500/30 text-sm text-navy-900 dark:text-white shadow-inner"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="p-3 glass rounded-2xl text-navy-400 dark:text-slate-400 shadow-sm">
            <Filter size={20} />
          </button>
        </div>

        {/* Custom Tabs */}
        <div className="flex p-1 bg-navy-100 dark:bg-navy-800/50 rounded-2xl w-full">
          <button 
            onClick={() => setActiveTab('active')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold tracking-widest uppercase transition-all ${activeTab === 'active' ? 'bg-gold-500 text-navy-950 shadow-md' : 'text-navy-400 dark:text-slate-500'}`}
          >
            Running
          </button>
          <button 
            onClick={() => setActiveTab('archived')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold tracking-widest uppercase transition-all ${activeTab === 'archived' ? 'bg-gold-500 text-navy-950 shadow-md' : 'text-navy-400 dark:text-slate-500'}`}
          >
            Archive
          </button>
        </div>
      </div>

      <div className="space-y-4 pb-12">
        {filteredOrders.length > 0 ? (
          filteredOrders.map(order => (
            <div key={order.id} className="relative group">
              <OrderCard order={order} />
              <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                   onClick={() => onDeleteOrder(order.id)}
                   className="p-1.5 rounded-lg bg-red-500/20 text-red-600 dark:text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-sm"
                >
                  <Trash2 size={14} />
                </button>
                {order.status !== OrderStatus.COMPLETED && (
                  <button 
                    onClick={() => onUpdateOrder({...order, status: OrderStatus.COMPLETED, progress: 100})}
                    className="p-1.5 rounded-lg bg-green-500/20 text-green-600 dark:text-green-500 hover:bg-green-500 hover:text-white transition-all shadow-sm"
                  >
                    <CheckCircle size={14} />
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-20 opacity-30 italic text-navy-400 dark:text-slate-500">
            No orders found in {activeTab}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderList;
