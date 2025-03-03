// lib/logger.ts
import { logs } from '@opentelemetry/api-logs';

let logger: any;

// Initialize logger only on the server side
if (typeof window === 'undefined') {
  logger = logs.getLogger('point-blank-logger');
}

export function logInfo(message: string, attributes?: Record<string, any>) {
  if (logger) {
    logger.emit({
      severityText: 'INFO',
      body: message,
      attributes: attributes || {},
    });
  }
  console.info(message);
}

export function logError(message: string, error?: Error, attributes?: Record<string, any>) {
  if (logger) {
    logger.emit({
      severityText: 'ERROR',
      body: message,
      attributes: {
        ...(attributes || {}),
        'error.message': error?.message,
        'error.stack': error?.stack,
      },
    });
  }
  console.error(message, error);
}

export function logWarning(message: string, attributes?: Record<string, any>) {
  if (logger) {
    logger.emit({
      severityText: 'WARN',
      body: message,
      attributes: attributes || {},
    });
  }
  console.warn(message);
}

export function logDebug(message: string, attributes?: Record<string, any>) {
  if (logger) {
    logger.emit({
      severityText: 'DEBUG',
      body: message,
      attributes: attributes || {},
    });
  }
  console.debug(message);
}