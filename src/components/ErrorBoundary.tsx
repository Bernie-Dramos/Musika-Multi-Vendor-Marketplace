import { Component, type ErrorInfo, type ReactNode } from 'react';
import { Button } from '@/components/ui/button';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Application error caught by ErrorBoundary:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-white flex items-center justify-center px-4">
          <div className="max-w-md w-full text-center border border-slate-200 rounded-2xl p-8 shadow-sm">
            <h1 className="text-2xl font-bold text-[#0F172A] mb-3">Something went wrong</h1>
            <p className="text-slate-600 mb-6">
              We hit an unexpected error. Please reload the page or return home.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button onClick={this.handleReload} className="bg-[#0F172A] hover:bg-[#1E293B] text-white">
                Reload Page
              </Button>
              <Button onClick={this.handleGoHome} variant="outline" className="border-slate-300">
                Go Home
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
