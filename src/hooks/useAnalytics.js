import { posthog } from '../lib/posthog';

// ── Identify user after login/signup ─────────────────────────────
// Call this right after a user logs in or signs up
export function identifyUser(user) {
  posthog.identify(user.id, {
    email: user.email,
    name: user.name,
    plan: user.plan,               // 'free', 'trial', or 'paid'
    created_at: user.createdAt,
    trial_ends: user.trialEnds,
  });
}

// Call this when user logs out
export function resetUser() {
  posthog.reset();
}

// ── All analytics events ──────────────────────────────────────────
export const analytics = {

  // Signup funnel — add these to your signup page/components
  signupFlowStarted: () =>
    posthog.capture('signup_flow_started'),

  signupEmailEntered: (method) =>
    posthog.capture('signup_email_entered', { method }), // 'email', 'google', etc.

  signupFormSubmitted: () =>
    posthog.capture('signup_form_submitted'),

  signupEmailVerified: () =>
    posthog.capture('signup_email_verified'),

  signupCompleted: () =>
    posthog.capture('signup_completed'),

  // Trial & conversion
  trialStarted: (plan) =>
    posthog.capture('trial_started', { plan }),

  upgradePageViewed: (source) =>
    posthog.capture('upgrade_page_viewed', { source }),

  upgradeCheckoutStarted: (plan) =>
    posthog.capture('upgrade_checkout_started', { plan }),

  upgradeCompleted: (plan, price) =>
    posthog.capture('upgrade_completed', { plan, price }),

  // Session tracking
  sessionStarted: (type) =>
    posthog.capture('session_started', { session_type: type }),

  sessionStepCompleted: (step, name, durationSeconds) =>
    posthog.capture('session_step_completed', {
      step,
      step_name: name,
      duration_seconds: durationSeconds,
    }),

  sessionCompleted: (type, totalSeconds) =>
    posthog.capture('session_completed', {
      session_type: type,
      total_duration_seconds: totalSeconds,
      completed: true,
    }),

  sessionAbandoned: (type, atStep, atPercent) =>
    posthog.capture('session_abandoned', {
      session_type: type,
      abandoned_at_step: atStep,
      abandoned_at_percent: atPercent,
      completed: false,
    }),
};