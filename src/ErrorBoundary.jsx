import { Component } from 'react';
import { Sentry } from './sentry.js';

// Fallback shown instead of a white screen when an uncaught error escapes the tree.
function ErrorFallback({ onReset }) {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#07091a',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      fontFamily: "'Helvetica Neue', sans-serif",
      color: '#c8c5d8',
      textAlign: 'center',
    }}>
      <div style={{ fontSize: '2rem', marginBottom: '1rem', opacity: 0.6 }}>✦</div>
      <h2 style={{ fontSize: '1.1rem', fontWeight: 400, letterSpacing: '0.08em', color: '#e8e6f0', marginBottom: '0.75rem' }}>
        Something went wrong
      </h2>
      <p style={{ fontSize: '0.85rem', color: '#8a879e', lineHeight: 1.65, maxWidth: '320px', marginBottom: '2rem' }}>
        We've been notified and are looking into it. Your sessions and progress are safe.
      </p>
      <button
        onClick={onReset}
        style={{
          background: 'rgba(255,255,255,0.07)',
          border: '0.5px solid rgba(255,255,255,0.15)',
          borderRadius: '10px',
          color: '#c8c5d8',
          cursor: 'pointer',
          fontSize: '0.85rem',
          padding: '0.65rem 1.5rem',
          letterSpacing: '0.05em',
        }}
      >
        Reload app
      </button>
    </div>
  );
}

export class AppErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, eventId: null };
    this.handleReset = this.handleReset.bind(this);
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    const eventId = Sentry.captureException(error, {
      extra: { componentStack: info.componentStack },
    });
    this.setState({ eventId });
  }

  handleReset() {
    this.setState({ hasError: false, eventId: null });
    window.location.reload();
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback onReset={this.handleReset} />;
    }
    return this.props.children;
  }
}
