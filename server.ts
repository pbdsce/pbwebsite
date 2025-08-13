import { createServer } from 'http';
import { parse } from 'url';
import next from 'next';
import { initializeTelemetry, shutdownTelemetry } from './telemetry/setup';

const dev = process.env.NODE_ENV !== 'production';
const hostname = process.env.HOSTNAME || 'localhost';
const port = parseInt(process.env.PORT || '3002', 10);

let server: any = null;
let isShuttingDown = false;

const telemetryInitialized = initializeTelemetry();

if (!telemetryInitialized) {
  process.exit(1);
}

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  server = createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url!, true);
      await handle(req, res, parsedUrl);
    } catch (error) {
      if (!res.headersSent) {
        res.statusCode = 500;
        res.end('Internal Server Error');
      }
    }
  })
  .once('error', (err) => {
    if (!isShuttingDown) {
      process.exit(1);
    }
  })
  .listen(port);
});

async function gracefulShutdown(signal: string) {
  if (isShuttingDown) return;
  
  isShuttingDown = true;
  
  const timeout = setTimeout(() => {
    process.exit(1);
  }, 10000);
  
  try {
    if (server) {
      await new Promise<void>((resolve) => {
        server.close(() => resolve());
      });
    }
    
    await shutdownTelemetry();
    
    clearTimeout(timeout);
    process.exit(0);
  } catch (error) {
    clearTimeout(timeout);
    process.exit(1);
  }
}

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

process.on('uncaughtException', async (error) => {
  if (!isShuttingDown) {
    await gracefulShutdown('uncaughtException');
  }
});

process.on('unhandledRejection', async (reason, promise) => {
  if (!isShuttingDown) {
    await gracefulShutdown('unhandledRejection');
  }
}); 