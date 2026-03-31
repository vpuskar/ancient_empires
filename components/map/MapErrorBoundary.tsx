'use client';

import { Component } from 'react';
import type { ReactNode, ErrorInfo } from 'react';
import * as Sentry from '@sentry/nextjs';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  showDetails: boolean;
}

export default class MapErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null, showDetails: false };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    Sentry.captureException(error, {
      extra: { componentStack: info.componentStack },
    });
  }

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    return (
      <div className="mx-6 flex h-[calc(100vh-140px)] items-center justify-center rounded-lg border border-[#8B7355] bg-[#1a1815]">
        <div className="max-w-md text-center">
          <h2 className="text-xl font-bold text-[#C9A84C]">
            Map failed to load
          </h2>
          <p className="mt-2 text-sm text-[#F0ECE2]/70">
            Something went wrong while rendering the map. This error has been
            reported automatically.
          </p>
          <div className="mt-6 flex items-center justify-center gap-3">
            <button
              onClick={() =>
                this.setState({
                  hasError: false,
                  error: null,
                  showDetails: false,
                })
              }
              className="rounded-lg border border-[#C9A84C] bg-[#C9A84C]/10 px-4 py-2 text-sm font-medium text-[#C9A84C] transition hover:bg-[#C9A84C]/20"
            >
              Try again
            </button>
            <button
              onClick={() => window.history.back()}
              className="rounded-lg border border-[#8B7355] px-4 py-2 text-sm text-[#8B7355] transition hover:border-[#F0ECE2]/40 hover:text-[#F0ECE2]/60"
            >
              Go back
            </button>
          </div>
          <button
            onClick={() =>
              this.setState((s) => ({ showDetails: !s.showDetails }))
            }
            className="mt-4 text-xs text-[#8B7355] underline transition hover:text-[#F0ECE2]/60"
          >
            {this.state.showDetails
              ? 'Hide technical details'
              : 'Show technical details'}
          </button>
          {this.state.showDetails && this.state.error && (
            <pre className="mt-3 max-h-40 overflow-auto rounded border border-[#8B7355]/30 bg-[#0C0B09] p-3 text-left text-xs text-[#8B7355]">
              {this.state.error.message}
              {'\n\n'}
              {this.state.error.stack}
            </pre>
          )}
        </div>
      </div>
    );
  }
}
