
export enum OrderStatus {
  NOT_STARTED = 'NOT_STARTED',
  IN_PROGRESS = 'IN_PROGRESS',
  REVIEW = 'REVIEW',
  DELIVERED = 'DELIVERED',
  COMPLETED = 'COMPLETED',
  OVERDUE = 'OVERDUE'
}

export enum Urgency {
  FUTURE = 'FUTURE',
  TODAY = 'TODAY',
  URGENT = 'URGENT'
}

export interface Order {
  id: string;
  buyerName: string;
  details: string;
  deliveryDate: string; // ISO string
  price: number;
  notes?: string;
  status: OrderStatus;
  progress: number; // 0 to 100
  createdAt: string;
}

export interface Reminder {
  id: string;
  orderId: string;
  title: string;
  dueTime: string;
  isAcknowledged: boolean;
  urgency: Urgency;
}

export interface DashboardStats {
  activeCount: number;
  overdueCount: number;
  avgTimeRemaining: string;
  totalActiveValue: number;
  statusBreakdown: { name: string; value: number }[];
  monthlyTrend: { date: string; count: number }[];
}
