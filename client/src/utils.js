export function formatNumber(n) {
  if (n == null || Number.isNaN(n)) return '—';
  return new Intl.NumberFormat(undefined, { maximumFractionDigits: 0 }).format(n);
}

export function formatPercent(n) {
  if (n == null || Number.isNaN(n)) return '—';
  return `${Number(n).toFixed(1)}%`;
}

export function formatLatency(ms) {
  if (ms == null || Number.isNaN(ms)) return '—';
  if (ms < 1000) return `${Math.round(ms)} ms`;
  return `${(ms / 1000).toFixed(2)} s`;
}

/** Roll up time-series points by bucket for throughput bars */
export function bucketHitsByTime(points) {
  if (!Array.isArray(points) || points.length === 0) return [];
  const map = new Map();
  for (const p of points) {
    const raw = p.timestamp;
    const key =
      typeof raw === 'string' || typeof raw === 'number'
        ? String(raw)
        : raw instanceof Date
          ? raw.toISOString()
          : raw
            ? new Date(raw).toISOString()
            : '';
    if (!key) continue;
    // Format timestamp nicely for charting
    const date = new Date(key);
    const formattedTime = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    if (!map.has(formattedTime)) {
      map.set(formattedTime, { time: formattedTime, hits: 0, errors: 0 });
    }
    const bucket = map.get(formattedTime);
    bucket.hits += (Number(p.totalHits) || 0);
    bucket.errors += (Number(p.errorHits) || 0);
  }
  return Array.from(map.values());
}
