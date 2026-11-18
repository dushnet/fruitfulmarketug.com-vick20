// lib/logger.ts

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

export default class Logger {
  private static instance: Logger;
  private isEnabled: boolean = true;

  private constructor() {
    // Defaults to true in development, false in production (or override manually)
    this.isEnabled = process.env.NODE_ENV !== 'production';
  }

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  // Toggle logging on or off globally at runtime
  public setEnabled(enabled: boolean): void {
    this.isEnabled = enabled;
  }

  public getEnabled(): boolean {
    return this.isEnabled;
  }

  private formatMessage(level: LogLevel, message: string): string {
    const timestamp = new Date().toISOString();
    return `[${timestamp}] [${level.toUpperCase()}]: ${message}`;
  }

  public info(message: string, ...args: unknown[]): void {
    if (!this.isEnabled) return;
    console.info(this.formatMessage('info', message), ...args);
  }

  public warn(message: string, ...args: unknown[]): void {
    if (!this.isEnabled) return;
    console.warn(this.formatMessage('warn', message), ...args);
  }

  public error(message: string, ...args: unknown[]): void {
    if (!this.isEnabled) return;
    console.error(this.formatMessage('error', message), ...args);
  }

  public debug(message: string, ...args: unknown[]): void {
    if (!this.isEnabled) return;
    console.debug(this.formatMessage('debug', message), ...args);
  }
}

// Export a single global instance
export const logger = Logger.getInstance();
