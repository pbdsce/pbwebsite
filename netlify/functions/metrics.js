const { Registry, collectDefaultMetrics, Counter, Histogram } = require('prom-client');

// Create registry and collect default metrics
const register = new Registry();
collectDefaultMetrics({ register });

// Custom metrics for your website
const pageViews = new Counter({
  name: 'pointblank_page_views_total',
  help: 'Total number of page views',
  labelNames: ['page'],
  registers: [register]
});

const pageLoadTime = new Histogram({
  name: 'pointblank_page_load_time_seconds',
  help: 'Page load time in seconds',
  labelNames: ['page'],
  registers: [register]
});

const PUSHGATEWAY_URL = process.env.PUSHGATEWAY_URL;

async function pushToGateway(metrics) {
  if (!PUSHGATEWAY_URL) {
    console.error('PUSHGATEWAY_URL environment variable not set');
    return false;
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); 
    
    const response = await fetch(PUSHGATEWAY_URL, {
      method: 'POST',
      body: metrics,
      headers: { 
        'Content-Type': 'text/plain',
        'User-Agent': 'pointblank-netlify-function/1.0'
      },
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      console.error(`Pushgateway error: ${response.status} ${response.statusText}`);
      return false;
    }
    
    console.log('Metrics pushed to Pushgateway successfully');
    return true;
  } catch (error) {
    if (error.name === 'AbortError') {
      console.error('Pushgateway request timed out');
    } else {
      console.error('Error pushing to Pushgateway:', error.message);
    }
    return false;
  }
}

exports.handler = async (event, context) => {
  const headers = {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  };

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  try {
    if (event.httpMethod === 'POST' && event.headers['content-type']?.includes('application/json')) {
      const body = JSON.parse(event.body || '{}');
      
      if (body.type === 'page_view') {
        // Record custom metrics
        pageViews.inc({ page: body.page || 'unknown' });
        
        if (body.loadTime && typeof body.loadTime === 'number') {
          pageLoadTime.observe({ page: body.page || 'unknown' }, body.loadTime);
        }
        
        console.log(`Recorded page view: ${body.page}`);
      }
    }
    
    const metrics = await register.metrics();
    const pushSuccess = await pushToGateway(metrics);
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: pushSuccess ? 'Metrics recorded and pushed successfully' : 'Metrics recorded (push failed)',
        timestamp: new Date().toISOString()
      })
    };
    
  } catch (error) {
    console.error('Metrics function error:', error);
    
    try {
      const metrics = await register.metrics();
      await pushToGateway(metrics);
    } catch (fallbackError) {
      console.error('Fallback metrics push failed:', fallbackError);
    }
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: 'Failed to handle metrics',
        timestamp: new Date().toISOString()
      })
    };
  }
};