// Sistema de logging para debugging
export class Logger {
  private static instance: Logger;
  private logs: Array<{ timestamp: string; level: string; component: string; message: string; data?: any }> = [];

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  private log(level: 'INFO' | 'WARN' | 'ERROR' | 'DEBUG', component: string, message: string, data?: any) {
    const timestamp = new Date().toISOString();
    const logEntry = { timestamp, level, component, message, data };
    
    this.logs.push(logEntry);
    
    // Console output con colores
    const style = {
      INFO: 'color: #2563eb; font-weight: bold',
      WARN: 'color: #d97706; font-weight: bold', 
      ERROR: 'color: #dc2626; font-weight: bold',
      DEBUG: 'color: #059669; font-weight: bold'
    };

    console.log(
      `%c[${level}] ${component}: ${message}`,
      style[level],
      data ? data : ''
    );

    // Mantener solo los últimos 100 logs
    if (this.logs.length > 100) {
      this.logs = this.logs.slice(-100);
    }
  }

  info(component: string, message: string, data?: any) {
    this.log('INFO', component, message, data);
  }

  warn(component: string, message: string, data?: any) {
    this.log('WARN', component, message, data);
  }

  error(component: string, message: string, data?: any) {
    this.log('ERROR', component, message, data);
  }

  debug(component: string, message: string, data?: any) {
    this.log('DEBUG', component, message, data);
  }

  getLogs() {
    return this.logs;
  }

  clearLogs() {
    this.logs = [];
  }

  // Método para mostrar logs en pantalla
  showLogsInConsole() {
    console.group('🔍 SYSTEM LOGS');
    this.logs.forEach(log => {
      console.log(`[${log.timestamp}] [${log.level}] ${log.component}: ${log.message}`, log.data || '');
    });
    console.groupEnd();
  }
}

export const logger = Logger.getInstance();
