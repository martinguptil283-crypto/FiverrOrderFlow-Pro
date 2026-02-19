
export const formatTimeRemaining = (targetDate: string): string => {
  const diff = new Date(targetDate).getTime() - Date.now();
  const isPast = diff < 0;
  const absDiff = Math.abs(diff);

  const days = Math.floor(absDiff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((absDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((absDiff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((absDiff % (1000 * 60)) / 1000);

  const parts = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0 || days > 0) parts.push(`${hours}h`);
  if (minutes > 0 || hours > 0 || days > 0) parts.push(`${minutes}m`);
  parts.push(`${seconds}s`);

  const timeStr = parts.join(' ');

  if (isPast) {
    return `${timeStr} overdue`;
  }

  return `${timeStr} left`;
};

export const isOverdue = (targetDate: string): boolean => {
  return new Date(targetDate).getTime() < Date.now();
};
