import type { ErrorInfo, ReactNode } from 'react';
import { Component } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  message: string;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = {
    hasError: false,
    message: ''
  };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      message: error.message
    };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('Application error boundary caught an error', error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="error-screen">
          <p className="eyebrow">โหมดกู้คืน</p>
          <h1>มีบางอย่างต้องตรวจสอบ</h1>
          <p>{this.state.message}</p>
        </main>
      );
    }

    return this.props.children;
  }
}
