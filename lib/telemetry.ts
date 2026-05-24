/**
 * Simple telemetry wrapper.
 *
 * Keep this dependency-free so production builds
 * never fail because of an optional observability SDK.
 */

export function captureException(
  err: unknown,
  context: Record<string, unknown> = {}
) {
  try {
    console.error(
      "[telemetry] exception",
      err,
      context
    );
  } catch {
    // ignore
  }
}

export function captureEvent(
  name: string,
  details: Record<string, unknown> = {}
) {
  try {
    console.info(
      "[telemetry] event",
      name,
      details
    );
  } catch {
    // ignore
  }
}

export default {
  captureException,
  captureEvent,
};
