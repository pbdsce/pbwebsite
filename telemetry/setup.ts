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
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
    
    const res = await fetch(PUSHGATEWAY_URL, {
      method: 'POST',
      body: metrics,
      headers: { 'Content-Type': 'text/plain' },
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (!res.ok) {
      throw new Error(`Pushgateway returned ${res.status}`);
    }
    console.log('Metrics pushed successfully');
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        console.error('Metrics push timed out - monitoring server may be unreachable');
      } else if ((error as any).code === 'UND_ERR_CONNECT_TIMEOUT') {
        console.error('Connection timeout - monitoring server may be down or unreachable');
      } else {
        console.error('Error pushing metrics:', error.message);
      }
    } else {
      console.error('Unknown error pushing metrics:', error);
    }
    
   
  }
}

// CommonJS export for Netlify functions
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { pushMetrics };
}
