import * as Sentry from '@sentry/react';

export function initSentry() {
  const dsn = import.meta.env.VITE_SENTRY_DSN;
  if (!dsn) return; // No-op when DSN is not configured (local dev default)

  Sentry.init({
    dsn,
    environment: import.meta.env.MODE, // 'production' | 'development'
    enabled: import.meta.env.PROD,     // Never sends from `vite dev` — no dev noise in alerts

    // Capture 10% of transactions for performance monitoring in prod.
    // Set to 0 to disable performance monitoring entirely.
    tracesSampleRate: 0.1,

    // Session replay explicitly disabled — this app handles sensitive mental-health content.
    replaysSessionSampleRate: 0,
    replaysOnErrorSampleRate: 0,

    // Keep the bundle lean: no replay integration loaded at all.
    integrations: [],
  });
}

// Re-export so callers don't need to import @sentry/react directly.
export { Sentry };
