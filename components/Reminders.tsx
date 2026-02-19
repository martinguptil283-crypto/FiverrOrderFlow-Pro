
import React, { useMemo } from 'react';
import { Order, OrderStatus, Urgency } from '../types';
import { Bell, AlertTriangle, Clock, ShieldCheck, ChevronRight } from 'lucide-react';

interface RemindersProps {
  orders: Order[];
}

const Reminders: React.FC<RemindersProps> = ({ orders }) => {
  const reminderItems = useMemo(() => {
    const now = Date.now();
    return orders
      .filter(o => ![OrderStatus.COMPLETED, OrderStatus.DELIVERED].includes(o.status))
      .map(o => {
        const diff = new Date(o.deliveryDate).getTime() - now;
        let urgency = Urgency.FUTURE;
        if (diff < 0) urgency = Urgency.URGENT;
        else if (diff < 86400000) urgency = Urgency.TODAY;

        return {
          order: o,
          urgency,
          timeText: diff < 0 ? 'Overdue' : diff < 3600000 ? 'Due soon' : `Due in ${Math.round(diff / 3600000)}h`
        };
      })
      .sort((a, b) => {
        const urgencyOrder = { [Urgency.URGENT]: 0, [Urgency.TODAY]: 1, [Urgency.FUTURE]: 2 };
        return urgencyOrder[a.urgency] - urgencyOrder[b.urgency];
      });
  }, [orders]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="px-2">
        <h2 className="text-2xl font-bold text-navy-950 dark:text-white">Smart Alerts</h2>
        <p className="text-navy-500 dark:text-slate-500 text-sm">Automated delivery intelligence</p>
      </div>

      <div className="space-y-4">
        {reminderItems.length > 0 ? (
          reminderItems.map(({ order, urgency, timeText }) => (
            <div 
              key={order.id} 
              className={`glass rounded-3xl p-5 border-l-4 transition-all hover:translate-x-1 shadow-sm ${
                urgency === Urgency.URGENT ? 'border-l-red-500' : 
                urgency === Urgency.TODAY ? 'border-l-orange-500' : 
                'border-l-gold-500'
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="flex gap-4">
                  <div className={`p-3 rounded-2xl ${
                    urgency === Urgency.URGENT ? 'bg-red-500/10 text-red-600 dark:text-red-500' : 
                    urgency === Urgency.TODAY ? 'bg-orange-500/10 text-orange-600 dark:text-orange-500' : 
                    'bg-gold-500/10 text-gold-600 dark:text-gold-500'
                  }`}>
                    {urgency === Urgency.URGENT ? <AlertTriangle size={24} /> : <Clock size={24} />}
                  </div>
                  <div>
                    <h4 className="font-bold text-navy-900 dark:text-slate-100">{order.buyerName}</h4>
                    <p className="text-xs text-navy-500 dark:text-slate-500 mt-0.5">Delivery {timeText.toLowerCase()}</p>
                    <div className="mt-3 flex gap-2">
                      <button className="px-3 py-1 bg-navy-100 dark:bg-white/5 rounded-full text-[10px] uppercase font-bold text-navy-500 dark:text-slate-400 hover:bg-navy-200 dark:hover:bg-white/10 transition-colors">Snooze 1h</button>
                      <button className="px-3 py-1 bg-gold-500 text-navy-950 rounded-full text-[10px] uppercase font-bold hover:scale-105 transition-transform shadow-md">Update Status</button>
                    </div>
                  </div>
                </div>
                <ChevronRight size={20} className="text-navy-300 dark:text-slate-700 mt-1" />
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 opacity-50">
            <ShieldCheck size={48} className="text-gold-500" />
            <p className="text-navy-400 dark:text-slate-400">All orders are on schedule.<br/>No pending alerts.</p>
          </div>
        )}
      </div>

      <section className="mt-8 pb-12">
        <div className="glass rounded-3xl p-6 bg-gradient-to-br from-navy-50 to-white dark:from-navy-800 dark:to-navy-950 shadow-md">
          <h3 className="font-bold mb-4 flex items-center gap-2 text-navy-900 dark:text-white">
            <Bell size={18} className="text-gold-500" />
            Notification Rules
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center text-sm">
              <span className="text-navy-700 dark:text-slate-300">Nagging Mode</span>
              <div className="w-10 h-5 bg-gold-500 rounded-full relative shadow-inner">
                <div className="absolute right-1 top-1 w-3 h-3 bg-white dark:bg-navy-950 rounded-full shadow-lg" />
              </div>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-navy-700 dark:text-slate-300">Repeat intervals</span>
              <span className="text-gold-600 dark:text-gold-500 font-bold">2 Hours</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-navy-700 dark:text-slate-300">Escalate critical alerts</span>
              <span className="text-navy-400 dark:text-slate-500 text-xs">Enabled</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Reminders;
