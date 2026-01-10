import React from 'react';
import Config from '../config';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });

    // Log error to monitoring service in production
    if (Config.IS_PRODUCTION) {
      console.error('Error caught by boundary:', error, errorInfo);
      // Here you would send to error tracking service like Sentry
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <div className="container">
            <div className="card">
              <div className="error-content">
                <h2>Something went wrong</h2>
                <p>We're sorry, but something unexpected happened.</p>
                
                {!Config.IS_PRODUCTION && (
                  <details style={{ whiteSpace: 'pre-wrap', marginTop: '20px' }}>
                    <summary>Error Details (Development Only)</summary>
                    <div style={{ marginTop: '10px', padding: '10px', background: '#f5f5f5', borderRadius: '4px' }}>
                      <strong>Error:</strong> {this.state.error && this.state.error.toString()}
                      <br />
                      <strong>Stack Trace:</strong> {this.state.errorInfo.componentStack}
                    </div>
                  </details>
                )}
                
                <div style={{ marginTop: '20px' }}>
                  <button 
                    className="btn btn-primary"
                    onClick={() => window.location.reload()}
                  >
                    Reload Page
                  </button>
                  <button 
                    className="btn btn-secondary"
                    onClick={() => window.location.href = '/'}
                    style={{ marginLeft: '10px' }}
                  >
                    Go Home
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;