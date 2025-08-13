import { Registry, collectDefaultMetrics, Counter, Histogram } from 'prom-client';

const register = new Registry();
collectDefaultMetrics({ register });

// Website-specific metrics
const pageViewCounter = new Counter({
  name: 'website_page_views_total',
  help: 'Total number of page views',
  labelNames: ['page', 'user_agent'],
  registers: [register]
});

const pageLoadTime = new Histogram({
  name: 'website_page_load_duration_seconds',
  help: 'Page load time in seconds',
  labelNames: ['page'],
  buckets: [0.1, 0.5, 1, 2, 5, 10],
  registers: [register]
});

const PUSHGATEWAY_URL = process.env.PUSHGATEWAY_URL;

export async function pushMetrics() {
  if (!PUSHGATEWAY_URL) {
    console.error('PUSHGATEWAY_URL is not configured');
    return;
  }
  
  try {
    const metrics = await register.metrics();
    const res = await fetch(PUSHGATEWAY_URL, {
      method: 'POST',
      body: metrics,
      headers: { 'Content-Type': 'text/plain' },
    });
    if (!res.ok) {
      throw new Error(`Pushgateway returned ${res.status}`);
    }
    console.log('Metrics pushed successfully');
  } catch (error) {
    console.error('Error pushing metrics:', error);
  }
}

// Function to record page view (called from layout)
export function recordPageView(page: string = '/') {
  if (typeof window !== 'undefined') {
    const userAgent = navigator.userAgent;
    pageViewCounter.inc({ page, user_agent: userAgent });
    
    // Record page load time
    const loadTime = performance.now() / 1000; // Convert to seconds
    pageLoadTime.observe({ page }, loadTime);
  }
}

// CommonJS export for Netlify functions
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { pushMetrics, recordPageView };
}
