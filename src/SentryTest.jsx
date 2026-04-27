// Deliberately throws during render so the ErrorBoundary catches it and
// Sentry receives an event with a readable (source-mapped) stack trace.
// Trigger: open the app with ?sentry_test=1 in the URL.
// Remove this file once the integration is verified.
export function SentryTestThrower() {
  throw new Error('[Sentry test] Deliberate render error — delete SentryTest.jsx after confirming.');
}
