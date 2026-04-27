import posthog from 'posthog-js';

// Call this once in main.jsx or App.jsx
export function initPostHog() {
  posthog.init(import.meta.env.VITE_POSTHOG_KEY, {
    api_host: 'https://app.posthog.com',
    autocapture: true,
    session_recording: { recordCrossOriginIframes: true },
    loaded: (ph) => {
      if (import.meta.env.DEV) ph.opt_out_capturing();
    },
  });
}

export { posthog };