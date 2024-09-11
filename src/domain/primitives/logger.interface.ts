interface LogFunction {
  (message: string): void;
  (object: Record<string, unknown>, message?: string): void;
}

interface LoggerInterface {
  trace: LogFunction;
  debug: LogFunction;
  info: LogFunction;
  warn: LogFunction;
  error: LogFunction;
  fatal: LogFunction;
  child(object: Record<string, unknown>): LoggerInterface;
}

export default LoggerInterface;
