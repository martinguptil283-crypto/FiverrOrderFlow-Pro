
import React, { useState, useEffect } from 'react';
import { Order, OrderStatus } from '../types';
import { Clock, User, DollarSign } from 'lucide-react';
import { formatTimeRemaining, isOverdue } from '../utils/dateUtils';
import { STATUS_LABELS } from '../constants';

interface OrderCardProps {
  order: Order;
}

const OrderCard: React.FC<OrderCardProps> = ({ order }) => {
  const [timeStr, setTimeStr] = useState(() => formatTimeRemaining(order.deliveryDate));
  const [overdue, setOverdue] = useState(() => isOverdue(order.deliveryDate) && order.status !== OrderStatus.DELIVERED);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeStr(formatTimeRemaining(order.deliveryDate));
      setOverdue(isOverdue(order.deliveryDate) && order.status !== OrderStatus.DELIVERED);
    }, 1000);

    return () => clearInterval(interval);
  }, [order.deliveryDate, order.status]);

  return (
    <div className="glass rounded-3xl p-5 border border-navy-100 dark:border-white/5 shadow-md dark:shadow-xl hover:shadow-gold-500/10 transition-all duration-300 group relative overflow-hidden">
      {/* Subtle background glow for urgent items */}
      {overdue && (
        <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 dark:bg-red-500/5 blur-[50px] pointer-events-none" />
      )}

      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-navy-100 dark:bg-navy-800 flex items-center justify-center border border-navy-200 dark:border-white/10 text-gold-600 dark:text-gold-500 group-hover:scale-110 transition-transform shadow-inner">
            <User size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-navy-900 dark:text-slate-100 group-hover:text-gold-600 dark:group-hover:text-gold-500 transition-colors">{order.buyerName}</h4>
              <div className="flex items-center text-emerald-600 dark:text-emerald-400 text-xs font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                <DollarSign size={10} />
                {order.price}
              </div>
            </div>
            <p className="text-[10px] text-navy-400 dark:text-slate-500 font-mono tracking-tighter">{order.id}</p>
          </div>
        </div>
        <div className={`px-2 py-1 rounded-lg text-[9px] font-bold uppercase tracking-widest ${
          overdue ? 'bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/40 animate-pulse' : 
          order.status === OrderStatus.REVIEW ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20' :
          order.status === OrderStatus.DELIVERED ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' :
          'bg-gold-500/10 text-gold-600 dark:text-gold-500 border border-gold-500/20'
        }`}>
          {overdue ? 'Critical Overdue' : STATUS_LABELS[order.status]}
        </div>
      </div>

      <p className="text-sm text-navy-600 dark:text-slate-400 line-clamp-2 mb-4 h-10 leading-relaxed">
        {order.details}
      </p>

      <div className="space-y-4">
        <div className="flex justify-between items-center text-xs">
          {/* Highlighted Countdown Badge */}
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all duration-300 ${
            overdue 
              ? 'bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-500/50 shadow-sm' 
              : 'bg-gold-50 dark:bg-gold-500/10 border-gold-200 dark:border-gold-500/30 shadow-sm'
          }`}>
            <Clock size={16} className={`${overdue ? 'text-red-600 dark:text-red-400' : 'text-gold-600 dark:text-gold-500'} animate-pulse`} />
            <span className={`font-mono text-sm tabular-nums tracking-wide font-bold ${
              overdue ? 'text-red-600 dark:text-red-400' : 'text-gold-700 dark:text-gold-400'
            }`}>
              {timeStr}
            </span>
          </div>
          
          <div className="flex flex-col items-end">
            <span className="text-navy-400 dark:text-slate-500 text-[9px] uppercase font-bold tracking-widest mb-0.5">Progress</span>
            <span className="text-navy-900 dark:text-slate-200 font-bold">{order.progress}%</span>
          </div>
        </div>
        
        {/* Progress Bar with Glow */}
        <div className="h-2.5 w-full bg-navy-100 dark:bg-navy-800 rounded-full overflow-hidden border border-navy-200 dark:border-white/5 p-[1px]">
          <div 
            className={`h-full rounded-full transition-all duration-1000 ease-out relative ${
              overdue ? 'bg-gradient-to-r from-red-600 to-red-400' : 'bg-gradient-to-r from-gold-600 to-gold-400'
            }`}
            style={{ 
              width: `${order.progress}%`,
              boxShadow: overdue ? '0 0 10px rgba(239, 68, 68, 0.4)' : '0 0 10px rgba(234, 179, 8, 0.4)'
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-[shimmer_2s_infinite] w-full h-full" />
          </div>
        </div>
      </div>

      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};

export default OrderCard;
