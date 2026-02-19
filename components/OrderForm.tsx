
import React, { useState } from 'react';
import { X, Mic, Send, DollarSign } from 'lucide-react';
import { Order, OrderStatus } from '../types';

interface OrderFormProps {
  onSubmit: (order: Order) => void;
  onCancel: () => void;
  initialData?: Partial<Order>;
}

const OrderForm: React.FC<OrderFormProps> = ({ onSubmit, onCancel, initialData }) => {
  const [formData, setFormData] = useState({
    buyerName: initialData?.buyerName || '',
    details: initialData?.details || '',
    deliveryDate: initialData?.deliveryDate ? new Date(initialData.deliveryDate).toISOString().slice(0, 16) : '',
    price: initialData?.price || '',
    notes: initialData?.notes || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isVibrating, setIsVibrating] = useState(false);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.buyerName) newErrors.buyerName = 'Buyer name is required';
    if (!formData.details) newErrors.details = 'Details are required';
    if (!formData.deliveryDate) newErrors.deliveryDate = 'Delivery date is required';
    if (!formData.price || isNaN(Number(formData.price))) newErrors.price = 'Valid price is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      const newOrder: Order = {
        id: `OR-${Math.floor(Math.random() * 9000) + 1000}`,
        buyerName: formData.buyerName,
        details: formData.details,
        deliveryDate: new Date(formData.deliveryDate).toISOString(),
        price: Number(formData.price),
        notes: formData.notes,
        status: OrderStatus.NOT_STARTED,
        progress: 0,
        createdAt: new Date().toISOString(),
      };
      onSubmit(newOrder);
    } else {
      setIsVibrating(true);
      setTimeout(() => setIsVibrating(false), 500);
    }
  };

  return (
    <form 
      onSubmit={handleSubmit}
      className={`glass bg-white dark:bg-navy-900 rounded-[2rem] p-8 w-full max-w-sm shadow-2xl relative animate-in zoom-in duration-300 ${isVibrating ? 'animate-shake' : ''}`}
    >
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake { animation: shake 0.2s ease-in-out 0s 2; }
      `}</style>

      <button 
        type="button" 
        onClick={onCancel}
        className="absolute top-6 right-6 p-2 text-navy-400 hover:text-navy-900 dark:text-slate-500 dark:hover:text-white transition-colors"
      >
        <X size={20} />
      </button>

      <h2 className="text-2xl font-bold mb-6 tracking-tight text-navy-950 dark:text-white">New Order</h2>

      <div className="space-y-5">
        <div className="space-y-1">
          <label className="text-[10px] uppercase tracking-widest text-navy-500 dark:text-slate-500 font-bold ml-1">Buyer Name</label>
          <div className="relative">
            <input 
              type="text"
              className={`w-full bg-navy-50 dark:bg-navy-800/50 border ${errors.buyerName ? 'border-red-500' : 'border-navy-200 dark:border-white/10'} rounded-xl px-4 py-3 focus:outline-none focus:border-gold-500/50 transition-all text-sm text-navy-900 dark:text-white placeholder:text-navy-300 dark:placeholder:text-navy-500`}
              placeholder="e.g. John Doe"
              value={formData.buyerName}
              onChange={(e) => setFormData({ ...formData, buyerName: e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1) })}
            />
            <button type="button" className="absolute right-3 top-3 text-navy-400"><Mic size={16} /></button>
          </div>
          {errors.buyerName && <p className="text-red-500 text-[10px] mt-1 ml-1">{errors.buyerName}</p>}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-[10px] uppercase tracking-widest text-navy-500 dark:text-slate-500 font-bold ml-1">Price ($)</label>
            <div className="relative">
              <span className="absolute left-3 top-3 text-navy-400"><DollarSign size={14} /></span>
              <input 
                type="number"
                className={`w-full bg-navy-50 dark:bg-navy-800/50 border ${errors.price ? 'border-red-500' : 'border-navy-200 dark:border-white/10'} rounded-xl pl-8 pr-4 py-3 focus:outline-none focus:border-gold-500/50 transition-all text-sm text-navy-900 dark:text-white`}
                placeholder="0.00"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] uppercase tracking-widest text-navy-500 dark:text-slate-500 font-bold ml-1">Delivery</label>
            <input 
              type="datetime-local"
              className={`w-full bg-navy-50 dark:bg-navy-800/50 border ${errors.deliveryDate ? 'border-red-500' : 'border-navy-200 dark:border-white/10'} rounded-xl px-4 py-3 focus:outline-none focus:border-gold-500/50 transition-all text-[10px] text-navy-900 dark:text-slate-200`}
              value={formData.deliveryDate}
              onChange={(e) => setFormData({ ...formData, deliveryDate: e.target.value })}
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-[10px] uppercase tracking-widest text-navy-500 dark:text-slate-500 font-bold ml-1">Order Details</label>
          <textarea 
            className={`w-full bg-navy-50 dark:bg-navy-800/50 border ${errors.details ? 'border-red-500' : 'border-navy-200 dark:border-white/10'} rounded-xl px-4 py-3 focus:outline-none focus:border-gold-500/50 transition-all text-sm h-20 resize-none text-navy-900 dark:text-white`}
            placeholder="What needs to be done?"
            value={formData.details}
            onChange={(e) => setFormData({ ...formData, details: e.target.value })}
          />
          <div className="flex justify-between items-center mt-1">
             {errors.details && <p className="text-red-500 text-[10px] ml-1">{errors.details}</p>}
             <span className="text-[10px] text-navy-400 dark:text-slate-600 ml-auto">{formData.details.length} chars</span>
          </div>
        </div>

        <button 
          type="submit"
          className="w-full py-4 bg-gold-500 text-navy-950 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-gold-600 active:scale-95 transition-all shadow-lg gold-glow mt-2"
        >
          <Send size={18} />
          Create Order
        </button>
      </div>
    </form>
  );
};

export default OrderForm;
