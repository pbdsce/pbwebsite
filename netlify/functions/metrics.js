const { Registry, collectDefaultMetrics } = require('prom-client');

const register = new Registry();
collectDefaultMetrics({ register });

const PUSHGATEWAY_URL = process.env.PUSHGATEWAY_URL;

exports.handler = async (event, context) => {
  try {
    const metrics = await register.metrics();
    
    const pushResponse = await fetch(PUSHGATEWAY_URL, {
      method: 'POST',
      body: metrics,
      headers: { 'Content-Type': 'text/plain' },
    });
    
    if (!pushResponse.ok) {
      console.error(`Pushgateway error: ${pushResponse.status}`);
    } else {
      console.log('Metrics pushed to Pushgateway successfully');
    }
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'text/plain',
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      },
      body: metrics
    };
  } catch (error) {
    console.error('Metrics collection error:', error);
    
    try {
      const metrics = await register.metrics();
      return {
        statusCode: 500,
        headers: {
          'Content-Type': 'text/plain',
          'Cache-Control': 'no-cache, no-store, must-revalidate'
        },
        body: `# Error collecting metrics: ${error.message}\n\n${metrics}`
      };
    } catch (fallbackError) {
      return {
        statusCode: 500,
        headers: { 'Content-Type': 'text/plain' },
        body: `# Error: ${error.message}`
      };
    }
  }
};
