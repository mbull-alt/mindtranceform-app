import React from 'react';
import ReactDOM from 'react-dom/client';
import { initSentry } from './sentry.js';
import { initPostHog } from './lib/posthog.js';
import { AppErrorBoundary } from './ErrorBoundary.jsx';
import App from './App.jsx';
import { SentryTestThrower } from './SentryTest.jsx';

// Initialize Sentry before React renders so the first render is already instrumented.
initSentry();
// Initialize PostHog (no-ops in dev — see lib/posthog.js).
initPostHog();

const isSentryTest = new URLSearchParams(window.location.search).has('sentry_test');

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AppErrorBoundary>
      {isSentryTest ? <SentryTestThrower /> : <App />}
    </AppErrorBoundary>
  </React.StrictMode>,
);
