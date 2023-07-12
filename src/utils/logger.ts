enum LogLevel {
  DEBUG,
  INFO,
  WARN,
  ERROR,
}

class Logger {
  private readonly logLevel: LogLevel;

  constructor(logLevelConfig = 'INFO') {
    switch (logLevelConfig.toUpperCase()) {
      case 'DEBUG':
        this.logLevel = LogLevel.DEBUG;
        break;
      case 'WARN':
        this.logLevel = LogLevel.WARN;
        break;
      case 'ERROR':
        this.logLevel = LogLevel.ERROR;
        break;
      default:
        this.logLevel = LogLevel.INFO;
    }
  }

  private getTimestamp() {
    return new Date().toISOString();
  }

  public debug(message: string, ...extra: unknown[]) {
    this.logLevel <= LogLevel.DEBUG &&
      console.info(
        this.getTimestamp(),
        LogLevel[LogLevel.DEBUG],
        message,
        ...extra
      );
  }

  public info(message: string, ...extra: unknown[]) {
    this.logLevel <= LogLevel.INFO &&
      console.info(
        this.getTimestamp(),
        LogLevel[LogLevel.INFO],
        message,
        ...extra
      );
  }

  public warn(message: string, ...extra: unknown[]) {
    this.logLevel <= LogLevel.WARN &&
      console.warn(
        this.getTimestamp(),
        LogLevel[LogLevel.WARN],
        message,
        ...extra
      );
  }

  public error(err: string | Error, ...extra: unknown[]) {
    this.logLevel <= LogLevel.ERROR &&
      console.error(
        this.getTimestamp(),
        LogLevel[LogLevel.ERROR],
        err,
        ...extra
      );
  }
}

export default new Logger(process.env.LOG_LEVEL);
