export function formatSessionDate(epochMs: number): string {
  const date = new Date(epochMs);
  const now = new Date();
  const isSameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);

  const time = date.toLocaleTimeString('es-MX', { hour: 'numeric', minute: '2-digit' });

  if (isSameDay(date, now)) return `Hoy, ${time}`;
  if (isSameDay(date, yesterday)) return `Ayer, ${time}`;

  const day = date.toLocaleDateString('es-MX', { day: 'numeric', month: 'long' });
  return `${day}, ${time}`;
}

export function formatDuration(durationMs: number): string {
  const totalMinutes = Math.round(durationMs / 60000);
  if (totalMinutes < 1) return '<1 min';
  if (totalMinutes < 60) return `${totalMinutes} min`;
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return minutes > 0 ? `${hours} h ${minutes} min` : `${hours} h`;
}

export function formatDistance(distanceMeters: number): string {
  return distanceMeters >= 1000
    ? `${(distanceMeters / 1000).toFixed(2)} km`
    : `${Math.round(distanceMeters)} m`;
}
