type LogLevel = "info" | "warn" | "error";

export function serializeError(error: unknown): Record<string, unknown> {
  if (error instanceof Error) {
    const out: Record<string, unknown> = {
      name: error.name,
      message: error.message,
    };
    if ("code" in error && typeof (error as { code?: unknown }).code === "string") {
      out.code = (error as { code: string }).code;
    }
    if (process.env.NODE_ENV !== "production" && error.stack) {
      out.stack = error.stack.split("\n").slice(0, 4).join(" | ");
    }
    return out;
  }
  return { raw: String(error) };
}

function writeLog(
  level: LogLevel,
  scope: string,
  message: string,
  meta?: Record<string, unknown>
): void {
  const entry = {
    timestamp: new Date().toISOString(),
    level,
    scope,
    message,
    ...(meta && Object.keys(meta).length > 0 ? { meta } : {}),
  };

  const sink =
    level === "error" ? console.error : level === "warn" ? console.warn : console.info;

  if (process.env.NODE_ENV === "production") {
    sink(JSON.stringify(entry));
  } else {
    const prefix = `[${entry.timestamp}] [${level.toUpperCase()}] [${scope}]`;
    if (meta && Object.keys(meta).length > 0) {
      sink(`${prefix} ${message}`, meta);
    } else {
      sink(`${prefix} ${message}`);
    }
  }
}

export const logger = {
  info(scope: string, message: string, meta?: Record<string, unknown>) {
    writeLog("info", scope, message, meta);
  },
  warn(scope: string, message: string, meta?: Record<string, unknown>) {
    writeLog("warn", scope, message, meta);
  },
  error(scope: string, message: string, error?: unknown, meta?: Record<string, unknown>) {
    writeLog("error", scope, message, {
      ...(meta || {}),
      ...(error !== undefined ? { error: serializeError(error) } : {}),
    });
  },
};
