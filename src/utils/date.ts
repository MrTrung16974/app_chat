export const formatTime = (iso: string) =>
  new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

export const formatDay = (iso: string) =>
  new Date(iso).toLocaleDateString([], { month: 'short', day: 'numeric' });

export const subtractMinutes = (base: Date, minutes: number) =>
  new Date(base.getTime() - minutes * 60000).toISOString();
