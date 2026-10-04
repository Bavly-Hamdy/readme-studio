import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('README Studio caught boundary error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-[var(--bg)] text-[var(--text)]">
          <div className="max-w-md w-full p-6 rounded-2xl border border-red-500/30 bg-[var(--surface)] shadow-2xl text-center space-y-4">
            <div className="w-12 h-12 mx-auto rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-semibold tracking-tight">
              {this.props.fallbackTitle || 'Something went wrong in the workspace'}
            </h2>
            <p className="text-xs text-[var(--text-muted)] font-mono bg-[var(--surface-2)] p-3 rounded-lg overflow-x-auto text-left">
              {this.state.error?.message || 'Unexpected application state.'}
            </p>
            <button
              onClick={this.handleReset}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-xl bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] transition-all shadow-xs"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reload Workspace</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
