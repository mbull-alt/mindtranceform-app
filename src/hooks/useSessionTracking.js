import { useRef, useEffect, useCallback } from 'react';
import { analytics } from './useAnalytics';

/**
 * Tracks session completion vs abandonment automatically.
 *
 * Usage example in a session/hypnosis component:
 *
 *   const { completeStep, completeSession } = useSessionTracking('hypnosis', 5);
 *
 *   // When user finishes step 1:
 *   completeStep(1, 'breathing_intro');
 *
 *   // When user finishes the whole session:
 *   completeSession();
 *
 * Abandonment is captured automatically when user closes the tab.
 */
export function useSessionTracking(sessionType, totalSteps) {
  const startTime = useRef(Date.now());
  const stepStart = useRef(Date.now());
  const currentStep = useRef(0);
  const completed = useRef(false);

  useEffect(() => {
    analytics.sessionStarted(sessionType);

    // Fires when user closes tab or navigates away mid-session
    const handleUnload = () => {
      if (!completed.current) {
        const pct = Math.round((currentStep.current / totalSteps) * 100);
        analytics.sessionAbandoned(sessionType, currentStep.current, pct);
      }
    };

    window.addEventListener('beforeunload', handleUnload);
    return () => window.removeEventListener('beforeunload', handleUnload);
  }, [sessionType, totalSteps]);

  // Call this when user completes each step
  const completeStep = useCallback((step, name) => {
    currentStep.current = step;
    const duration = (Date.now() - stepStart.current) / 1000;
    analytics.sessionStepCompleted(step, name, duration);
    stepStart.current = Date.now();
  }, []);

  // Call this when user finishes the whole session
  const completeSession = useCallback(() => {
    completed.current = true;
    const total = (Date.now() - startTime.current) / 1000;
    analytics.sessionCompleted(sessionType, total);
  }, [sessionType]);

  // Call this if user manually exits mid-session (e.g. clicks an Exit button)
  const abandonSession = useCallback((atStep) => {
    completed.current = true;
    const pct = Math.round((atStep / totalSteps) * 100);
    analytics.sessionAbandoned(sessionType, atStep, pct);
  }, [sessionType, totalSteps]);

  return { completeStep, completeSession, abandonSession };
}