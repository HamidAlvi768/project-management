import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from './ui/button';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
          <div className="flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-red-100">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="mb-4 text-2xl font-bold text-gray-900">Something went wrong</h1>
          <div className="max-w-md mb-8">
            <p className="mb-4 text-gray-600">
              We're sorry, but something unexpected happened. Please try again or contact support if the problem persists.
            </p>
            {this.state.error && (
              <pre className="p-4 mb-4 overflow-auto text-sm text-left text-red-600 bg-red-50 rounded-md">
                {this.state.error.message}
              </pre>
            )}
          </div>
          <div className="space-x-4">
            <Button
              variant="outline"
              onClick={() => window.location.reload()}
            >
              Refresh Page
            </Button>
            <Button
              onClick={this.handleReset}
            >
              Try Again
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 