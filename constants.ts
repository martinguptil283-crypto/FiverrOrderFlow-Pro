
import { Order, OrderStatus } from './types';

export const DEMO_ORDERS: Order[] = [
  {
    id: 'OR-7821',
    buyerName: 'Alex Thompson',
    details: 'Logo Design for Fintech Startup',
    deliveryDate: new Date(Date.now() + 86400000 * 1.5).toISOString(),
    price: 150,
    status: OrderStatus.IN_PROGRESS,
    progress: 45,
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: 'OR-8922',
    buyerName: 'Sarah Jenkins',
    details: 'React Frontend Development (3 Pages)',
    deliveryDate: new Date(Date.now() + 86400000 * 4).toISOString(),
    price: 850,
    status: OrderStatus.NOT_STARTED,
    progress: 0,
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
  },
  {
    id: 'OR-1023',
    buyerName: 'Global Media Inc.',
    details: 'SEO Copywriting for Blog Posts',
    deliveryDate: new Date(Date.now() + 3600000 * 5).toISOString(),
    price: 45,
    status: OrderStatus.REVIEW,
    progress: 85,
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    id: 'OR-1104',
    buyerName: 'Creative Souls',
    details: 'Social Media Kit - Instagram/Facebook',
    deliveryDate: new Date(Date.now() - 3600000 * 2).toISOString(),
    price: 120,
    status: OrderStatus.OVERDUE,
    progress: 90,
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
  {
    id: 'OR-1205',
    buyerName: 'Mike Peterson',
    details: 'Shopify Store Optimization',
    deliveryDate: new Date(Date.now() + 86400000 * 0.5).toISOString(),
    price: 300,
    status: OrderStatus.IN_PROGRESS,
    progress: 60,
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  }
];

export const STATUS_LABELS: Record<OrderStatus, string> = {
  [OrderStatus.NOT_STARTED]: 'Not Started',
  [OrderStatus.IN_PROGRESS]: 'In Progress',
  [OrderStatus.REVIEW]: 'Review',
  [OrderStatus.DELIVERED]: 'Delivered',
  [OrderStatus.COMPLETED]: 'Completed',
  [OrderStatus.OVERDUE]: 'Overdue'
};

export const COLORS = {
  NAVY_950: '#020617',
  NAVY_900: '#0f172a',
  NAVY_800: '#1e293b',
  GOLD: '#eab308',
  SUCCESS: '#22c55e',
  DANGER: '#ef4444',
  WARNING: '#f97316'
};
