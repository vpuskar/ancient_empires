'use client';

import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';

type FallbackRenderProps = {
  error: Error;
  moduleName: string;
  reset: () => void;
};

type FallbackProp =
  | ReactNode
  | ((props: FallbackRenderProps) => ReactNode);

interface Props {
  children: ReactNode;
  moduleName: string;
  fallback?: FallbackProp;
}

interface State {
  error: Error | null;
}

function DefaultFallback({ moduleName, reset }: FallbackRenderProps) {
  return (
    <div className="flex min-h-[320px] items-center justify-center rounded-2xl border border-[#8B7355]/40 bg-[#171410] p-8 shadow-[0_24px_80px_rgba(0,0,0,0.35)]">
      <div className="max-w-md text-center">
        <p className="text-xs font-semibold tracking-[0.3em] text-[#C9A84C]/70 uppercase">
          Module Error
        </p>
        <h2 className="mt-3 font-display text-2xl font-semibold text-[#F0ECE2]">
          {moduleName} failed to load
        </h2>
        <p className="mt-4 text-sm leading-7 text-[#F0ECE2]/70">
          Something went wrong while rendering this section. You can retry
          without leaving the page.
        </p>
        <button
          onClick={reset}
          className="mt-6 rounded-lg border border-[#C9A84C] bg-[#C9A84C]/12 px-5 py-2.5 text-sm font-medium text-[#F6D37B] transition hover:bg-[#C9A84C]/20"
        >
          Try again
        </button>
      </div>
    </div>
  );
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error(`[${this.props.moduleName}] boundary caught an error`, error, {
      componentStack: info.componentStack,
    });
  }

  private reset = () => {
    this.setState({ error: null });
  };

  render() {
    if (!this.state.error) {
      return this.props.children;
    }

    const fallbackProps: FallbackRenderProps = {
      error: this.state.error,
      moduleName: this.props.moduleName,
      reset: this.reset,
    };

    if (typeof this.props.fallback === 'function') {
      return this.props.fallback(fallbackProps);
    }

    if (this.props.fallback) {
      return this.props.fallback;
    }

    return <DefaultFallback {...fallbackProps} />;
  }
}
