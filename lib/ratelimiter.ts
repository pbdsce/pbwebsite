
type RequestLog = {
  [ip: string]: number[];
};

const requestLogs: RequestLog = {};

const WINDOW_MS = 60 * 1000; 
const CLEANUP_INTERVAL = 5 * 60 * 1000;

export function rateLimiter(ip: string, limit: number): boolean {
  const now = Date.now();

  if (!requestLogs[ip]) {
    requestLogs[ip] = [];
  }

  requestLogs[ip] = requestLogs[ip].filter(ts => now - ts < WINDOW_MS);

  if (requestLogs[ip].length >= limit) {
    return false;
  }

  requestLogs[ip].push(now);
  return true;
}

setInterval(() => {
  const now = Date.now();
  for (const ip in requestLogs) {
    requestLogs[ip] = requestLogs[ip].filter(ts => now - ts < WINDOW_MS);
    if (requestLogs[ip].length === 0) {
      delete requestLogs[ip];
    }
  }
}, CLEANUP_INTERVAL);
