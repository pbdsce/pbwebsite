import { Registry, collectDefaultMetrics } from 'prom-client';

const register = new Registry();
collectDefaultMetrics({ register });

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

// CommonJS export for Netlify functions
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { pushMetrics };
}
