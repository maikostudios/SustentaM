import { AppError, ErrorType, ErrorSeverity } from '../hooks/useErrorHandling';

export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'fatal';

export interface LogEntry {
  id: string;
  level: LogLevel;
  message: string;
  timestamp: Date;
  context?: Record<string, any>;
  error?: AppError;
  source?: string;
  userId?: string;
  sessionId?: string;
}

export interface LoggerConfig {
  enableConsoleLogging: boolean;
  enableLocalStorage: boolean;
  enableRemoteLogging: boolean;
  maxLocalStorageEntries: number;
  logLevel: LogLevel;
  remoteEndpoint?: string;
  apiKey?: string;
  batchSize: number;
  flushInterval: number;
}

const DEFAULT_CONFIG: LoggerConfig = {
  enableConsoleLogging: process.env.NODE_ENV === 'development',
  enableLocalStorage: true,
  enableRemoteLogging: process.env.NODE_ENV === 'production',
  maxLocalStorageEntries: 1000,
  logLevel: process.env.NODE_ENV === 'development' ? 'debug' : 'warn',
  batchSize: 10,
  flushInterval: 30000 // 30 segundos
};

class ErrorLogger {
  private config: LoggerConfig;
  private logQueue: LogEntry[] = [];
  private flushTimer: number | null = null;
  private sessionId: string;

  constructor(config: Partial<LoggerConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.sessionId = crypto.randomUUID();
    this.startFlushTimer();
    this.setupGlobalErrorHandlers();
  }

  private setupGlobalErrorHandlers() {
    // Capturar errores no manejados
    window.addEventListener('error', (event) => {
      this.logError('Unhandled Error', {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        error: event.error
      });
    });

    // Capturar promesas rechazadas no manejadas
    window.addEventListener('unhandledrejection', (event) => {
      this.logError('Unhandled Promise Rejection', {
        reason: event.reason,
        promise: event.promise
      });
    });

    // Capturar errores de recursos
    window.addEventListener('error', (event) => {
      if (event.target !== window) {
        this.logError('Resource Error', {
          source: (event.target as any)?.src || (event.target as any)?.href,
          type: (event.target as any)?.tagName
        });
      }
    }, true);
  }

  private startFlushTimer() {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
    }

    this.flushTimer = window.setInterval(() => {
      this.flush();
    }, this.config.flushInterval);
  }

  private shouldLog(level: LogLevel): boolean {
    const levels: LogLevel[] = ['debug', 'info', 'warn', 'error', 'fatal'];
    const currentLevelIndex = levels.indexOf(this.config.logLevel);
    const messageLevelIndex = levels.indexOf(level);
    return messageLevelIndex >= currentLevelIndex;
  }

  private generateLogId(): string {
    return `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private createLogEntry(
    level: LogLevel,
    message: string,
    context?: Record<string, any>,
    error?: AppError
  ): LogEntry {
    return {
      id: this.generateLogId(),
      level,
      message,
      timestamp: new Date(),
      context: {
        ...context,
        url: window.location.href,
        userAgent: navigator.userAgent,
        sessionId: this.sessionId,
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight
        }
      },
      error,
      source: 'web-app'
    };
  }

  private logToConsole(entry: LogEntry) {
    if (!this.config.enableConsoleLogging) return;

    const style = this.getConsoleStyle(entry.level);
    const timestamp = entry.timestamp.toISOString();

    switch (entry.level) {
      case 'debug':
        console.debug(`%c[${timestamp}] DEBUG: ${entry.message}`, style, entry.context);
        break;
      case 'info':
        console.info(`%c[${timestamp}] INFO: ${entry.message}`, style, entry.context);
        break;
      case 'warn':
        console.warn(`%c[${timestamp}] WARN: ${entry.message}`, style, entry.context);
        break;
      case 'error':
      case 'fatal':
        console.error(`%c[${timestamp}] ${entry.level.toUpperCase()}: ${entry.message}`, style, entry.context);
        if (entry.error) {
          console.error('Error details:', entry.error);
        }
        break;
    }
  }

  private getConsoleStyle(level: LogLevel): string {
    switch (level) {
      case 'debug':
        return 'color: #6b7280; font-size: 11px;';
      case 'info':
        return 'color: #3b82f6; font-weight: bold;';
      case 'warn':
        return 'color: #f59e0b; font-weight: bold;';
      case 'error':
        return 'color: #ef4444; font-weight: bold;';
      case 'fatal':
        return 'color: #dc2626; font-weight: bold; background: #fee2e2; padding: 2px 4px;';
      default:
        return '';
    }
  }

  private saveToLocalStorage(entry: LogEntry) {
    if (!this.config.enableLocalStorage) return;

    try {
      const existingLogs = this.getLocalStorageLogs();
      const updatedLogs = [...existingLogs, entry].slice(-this.config.maxLocalStorageEntries);
      localStorage.setItem('app_logs', JSON.stringify(updatedLogs));
    } catch (error) {
      console.warn('Failed to save log to localStorage:', error);
    }
  }

  private getLocalStorageLogs(): LogEntry[] {
    try {
      const logs = localStorage.getItem('app_logs');
      return logs ? JSON.parse(logs) : [];
    } catch (error) {
      console.warn('Failed to read logs from localStorage:', error);
      return [];
    }
  }

  private addToQueue(entry: LogEntry) {
    this.logQueue.push(entry);

    if (this.logQueue.length >= this.config.batchSize) {
      this.flush();
    }
  }

  private async sendToRemote(entries: LogEntry[]) {
    if (!this.config.enableRemoteLogging || !this.config.remoteEndpoint) return;

    try {
      const response = await fetch(this.config.remoteEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(this.config.apiKey && { 'Authorization': `Bearer ${this.config.apiKey}` })
        },
        body: JSON.stringify({
          logs: entries,
          metadata: {
            sessionId: this.sessionId,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            url: window.location.href
          }
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      console.warn('Failed to send logs to remote endpoint:', error);
    }
  }

  // Métodos públicos de logging
  public debug(message: string, context?: Record<string, any>) {
    if (!this.shouldLog('debug')) return;

    const entry = this.createLogEntry('debug', message, context);
    this.logToConsole(entry);
    this.saveToLocalStorage(entry);
    this.addToQueue(entry);
  }

  public info(message: string, context?: Record<string, any>) {
    if (!this.shouldLog('info')) return;

    const entry = this.createLogEntry('info', message, context);
    this.logToConsole(entry);
    this.saveToLocalStorage(entry);
    this.addToQueue(entry);
  }

  public warn(message: string, context?: Record<string, any>) {
    if (!this.shouldLog('warn')) return;

    const entry = this.createLogEntry('warn', message, context);
    this.logToConsole(entry);
    this.saveToLocalStorage(entry);
    this.addToQueue(entry);
  }

  public logError(message: string, context?: Record<string, any>, error?: AppError) {
    if (!this.shouldLog('error')) return;

    const entry = this.createLogEntry('error', message, context, error);
    this.logToConsole(entry);
    this.saveToLocalStorage(entry);
    this.addToQueue(entry);
  }

  public fatal(message: string, context?: Record<string, any>, error?: AppError) {
    const entry = this.createLogEntry('fatal', message, context, error);
    this.logToConsole(entry);
    this.saveToLocalStorage(entry);
    this.addToQueue(entry);
    
    // Enviar inmediatamente los logs fatales
    this.flush();
  }

  public logAppError(appError: AppError) {
    const level: LogLevel = appError.severity === 'critical' ? 'fatal' : 
                           appError.severity === 'high' ? 'error' : 'warn';
    
    this[level === 'fatal' ? 'fatal' : level === 'error' ? 'logError' : 'warn'](
      `${appError.type}: ${appError.message}`,
      appError.context,
      appError
    );
  }

  public async flush() {
    if (this.logQueue.length === 0) return;

    const logsToSend = [...this.logQueue];
    this.logQueue = [];

    await this.sendToRemote(logsToSend);
  }

  public getLogs(level?: LogLevel, limit?: number): LogEntry[] {
    const logs = this.getLocalStorageLogs();
    
    let filteredLogs = level ? logs.filter(log => log.level === level) : logs;
    
    if (limit) {
      filteredLogs = filteredLogs.slice(-limit);
    }

    return filteredLogs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  public clearLogs() {
    try {
      localStorage.removeItem('app_logs');
      this.logQueue = [];
    } catch (error) {
      console.warn('Failed to clear logs:', error);
    }
  }

  public getLogStats() {
    const logs = this.getLocalStorageLogs();
    const now = new Date();
    const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const lastHour = new Date(now.getTime() - 60 * 60 * 1000);

    const recent = logs.filter(log => new Date(log.timestamp) > last24h);
    const byLevel = logs.reduce((acc, log) => {
      acc[log.level] = (acc[log.level] || 0) + 1;
      return acc;
    }, {} as Record<LogLevel, number>);

    return {
      total: logs.length,
      last24h: recent.length,
      lastHour: logs.filter(log => new Date(log.timestamp) > lastHour).length,
      byLevel,
      queueSize: this.logQueue.length
    };
  }

  public updateConfig(newConfig: Partial<LoggerConfig>) {
    this.config = { ...this.config, ...newConfig };
    this.startFlushTimer();
  }

  public destroy() {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
      this.flushTimer = null;
    }
    this.flush();
  }
}

// Instancia singleton del logger
export const errorLogger = new ErrorLogger();

// Hook para usar el logger en componentes React
export function useLogger() {
  return {
    debug: errorLogger.debug.bind(errorLogger),
    info: errorLogger.info.bind(errorLogger),
    warn: errorLogger.warn.bind(errorLogger),
    error: errorLogger.logError.bind(errorLogger),
    fatal: errorLogger.fatal.bind(errorLogger),
    logAppError: errorLogger.logAppError.bind(errorLogger),
    getLogs: errorLogger.getLogs.bind(errorLogger),
    clearLogs: errorLogger.clearLogs.bind(errorLogger),
    getStats: errorLogger.getLogStats.bind(errorLogger)
  };
}
