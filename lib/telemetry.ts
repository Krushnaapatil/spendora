/**
 * Simple telemetry wrapper.
 * - If SENTRY_DSN is present and @sentry/node is available, initialize Sentry.
 * - Otherwise fallback to console logging.
 *
 * Exported helpers are safe to call on server only.
 */
import { env } from "./env";

let sentryInitialized = false;
let Sentry: any = null;

function initSentry() {
  if (sentryInitialized) return;

  const dsn = env.RESEND_API_KEY ? undefined : undefined; // placeholder to avoid unused env lint

  try {
    // initialize only if SENTRY_DSN is configured
    // Use dynamic require to avoid hard dependency
    const sentryDsn = process.env.SENTRY_DSN || (process.env.SENTRY_DSN as string | undefined);

    if (sentryDsn) {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      Sentry = require("@sentry/node");
      Sentry.init({ dsn: sentryDsn });
      sentryInitialized = true;
    }
  } catch (err) {
    // Fail silently; keep console fallback
    sentryInitialized = false;
    Sentry = null;
  }
}

export function captureException(err: unknown, context: Record<string, unknown> = {}) {
  try {
    initSentry();
    if (sentryInitialized && Sentry) {
      Sentry.captureException(err, { extra: context });
      return;
    }
  } catch (e) {
    // ignore
  }

  // fallback
  try {
    console.error("[telemetry] exception", err, context);
  } catch {}
}

export function captureEvent(name: string, details: Record<string, unknown> = {}) {
  try {
    initSentry();
    if (sentryInitialized && Sentry) {
      Sentry.captureMessage(name, { level: "info", extra: details });
      return;
    }
  } catch (e) {
    // ignore
  }

  // fallback
  try {
    console.info("[telemetry] event", name, details);
  } catch {}
}

export default {
  captureException,
  captureEvent,
};
