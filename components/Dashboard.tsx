
import React, { useMemo } from 'react';
import { Order, OrderStatus } from '../types';
import { TrendingUp, AlertCircle, Clock, CheckCircle, ArrowRight, DollarSign } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line } from 'recharts';
import { COLORS } from '../constants';
import OrderCard from './OrderCard';
import { formatTimeRemaining } from '../utils/dateUtils';

interface DashboardProps {
  orders: Order[];
  onUpdateOrder: (order: Order) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ orders, onUpdateOrder }) => {
  const stats = useMemo(() => {
    const active = orders.filter(o => [OrderStatus.IN_PROGRESS, OrderStatus.NOT_STARTED, OrderStatus.REVIEW].includes(o.status));
    const overdue = orders.filter(o => o.status === OrderStatus.OVERDUE);
    const completed = orders.filter(o => o.status === OrderStatus.COMPLETED || o.status === OrderStatus.DELIVERED);

    const totalTimeRemaining = active.reduce((acc, o) => {
      const diff = new Date(o.deliveryDate).getTime() - Date.now();
      return acc + (diff > 0 ? diff : 0);
    }, 0);

    const avgRemaining = active.length > 0 ? totalTimeRemaining / active.length : 0;
    const totalActiveValue = active.reduce((acc, o) => acc + (o.price || 0), 0);

    return {
      activeCount: active.length,
      overdueCount: overdue.length,
      completedCount: completed.length,
      totalActiveValue,
      avgRemainingText: formatTimeRemaining(new Date(Date.now() + avgRemaining).toISOString()),
      statusData: [
        { name: 'Active', value: active.length || 1, color: COLORS.GOLD },
        { name: 'Overdue', value: overdue.length || 0, color: COLORS.DANGER },
        { name: 'Done', value: completed.length || 0, color: COLORS.SUCCESS },
      ],
      trendData: [
        { date: '1/10', count: 4 },
        { date: '8/10', count: 7 },
        { date: '15/10', count: 5 },
        { date: '22/10', count: 9 },
        { date: '29/10', count: 6 },
        { date: '05/11', count: 8 },
      ]
    };
  }, [orders]);

  const ordersDueToday = useMemo(() => {
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    return orders.filter(o => 
      new Date(o.deliveryDate) <= today && 
      ![OrderStatus.COMPLETED, OrderStatus.DELIVERED].includes(o.status)
    ).slice(0, 3);
  }, [orders]);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Hero Section */}
      <section className="grid grid-cols-2 gap-4">
        <div className="col-span-2 glass rounded-3xl p-6 relative overflow-hidden group shadow-lg">
          <div className="absolute -top-12 -right-12 w-40 h-40 bg-gold-500/20 rounded-full blur-3xl group-hover:bg-gold-500/30 transition-all duration-700" />
          <div className="flex justify-between items-start relative z-10">
            <div>
              <p className="text-navy-500 dark:text-slate-400 text-sm font-medium">Average turnaround time</p>
              <div className="flex items-baseline gap-2 mt-1">
                <h2 className="text-3xl font-bold text-navy-950 dark:text-white">{stats.avgRemainingText.split(' ')[0]}</h2>
                <span className="text-gold-600 dark:text-gold-500 text-sm font-semibold uppercase">{stats.avgRemainingText.split(' ').slice(1).join(' ')}</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-navy-500 dark:text-slate-400 text-xs font-medium uppercase tracking-widest">Active pipeline</p>
              <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 flex items-center justify-end">
                <DollarSign size={20} />
                {stats.totalActiveValue.toLocaleString()}
              </p>
            </div>
          </div>
          <div className="mt-4 flex gap-4 relative z-10">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-gold-500" />
              <span className="text-xs text-navy-700 dark:text-slate-300 font-medium">{stats.activeCount} Active</span>
            </div>
            {stats.overdueCount > 0 && (
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span className="text-xs text-red-600 dark:text-red-400 font-bold">{stats.overdueCount} Overdue</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Analytics Mini Charts */}
      <section className="grid grid-cols-2 gap-4 h-48">
        <div className="glass rounded-3xl p-4 flex flex-col items-center shadow-md">
            <span className="text-[10px] uppercase tracking-widest text-navy-400 dark:text-slate-500 mb-2 font-bold">Volume</span>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats.trendData}>
                <Line type="monotone" dataKey="count" stroke={COLORS.GOLD} strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
        </div>
        <div className="glass rounded-3xl p-4 flex flex-col items-center shadow-md">
            <span className="text-[10px] uppercase tracking-widest text-navy-400 dark:text-slate-500 mb-2 font-bold">Statuses</span>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie 
                  data={stats.statusData} 
                  innerRadius={30} 
                  outerRadius={45} 
                  paddingAngle={5} 
                  dataKey="value"
                >
                  {stats.statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
        </div>
      </section>

      {/* Today's Focus */}
      <section>
        <div className="flex justify-between items-center mb-4 px-2">
          <h3 className="font-bold flex items-center gap-2 text-navy-900 dark:text-white">
            <Clock size={18} className="text-gold-500" />
            Today's Focus
          </h3>
          <span className="text-xs text-navy-400 dark:text-slate-500">View All</span>
        </div>
        <div className="space-y-4">
          {ordersDueToday.length > 0 ? (
            ordersDueToday.map(order => (
              <div key={order.id} className="glass rounded-2xl p-4 flex justify-between items-center group active:scale-95 transition-all shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="text-emerald-600 dark:text-emerald-400 font-bold text-sm bg-emerald-500/10 p-2 rounded-lg">
                    ${order.price}
                  </div>
                  <div>
                    <h4 className="font-semibold text-navy-950 dark:text-slate-100">{order.buyerName}</h4>
                    <p className="text-xs text-navy-500 dark:text-slate-500 truncate w-32">{order.details}</p>
                  </div>
                </div>
                <button 
                  onClick={() => onUpdateOrder({...order, status: OrderStatus.DELIVERED, progress: 100})}
                  className="px-3 py-1.5 rounded-lg bg-gold-500/10 border border-gold-500/20 text-gold-600 dark:text-gold-500 text-xs font-bold hover:bg-gold-500 hover:text-navy-950 transition-colors"
                >
                  Deliver
                </button>
              </div>
            ))
          ) : (
            <div className="glass rounded-2xl p-8 text-center border-dashed border-navy-200 dark:border-white/10">
              <CheckCircle size={32} className="mx-auto text-gold-500/30 mb-2" />
              <p className="text-navy-400 dark:text-slate-500 text-sm">Clear schedule for today!</p>
            </div>
          )}
        </div>
      </section>

      {/* Recent Running Orders */}
      <section className="pb-8">
        <div className="flex justify-between items-center mb-4 px-2">
          <h3 className="font-bold text-navy-900 dark:text-white">Active Orders</h3>
          <ArrowRight size={18} className="text-navy-400 dark:text-slate-500" />
        </div>
        <div className="space-y-4">
          {orders.filter(o => o.status !== OrderStatus.COMPLETED).slice(0, 5).map(order => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
