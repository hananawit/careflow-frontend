import { Component, type ErrorInfo, type ReactNode } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface AppErrorBoundaryProps {
  children: ReactNode;
}

interface AppErrorBoundaryState {
  error: Error | null;
}

export class AppErrorBoundary extends Component<
  AppErrorBoundaryProps,
  AppErrorBoundaryState
> {
  state: AppErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): AppErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("CareFlow application error:", error, errorInfo);
  }

  render() {
    if (!this.state.error) {
      return this.props.children;
    }

    return (
      <main className="flex min-h-screen items-center justify-center bg-background p-6">
        <section className="w-full max-w-lg rounded-lg border border-destructive/30 bg-card p-6 shadow-sm">
          <AlertTriangle className="size-7 text-destructive" aria-hidden="true" />
          <h1 className="mt-4 text-xl font-semibold text-foreground">
            CareFlow could not load
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Refresh the application and try again.
          </p>
          <p className="mt-3 break-words rounded-md bg-muted p-3 font-mono text-xs text-muted-foreground">
            {this.state.error.message || "Unexpected application error"}
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-5 inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            <RefreshCw className="size-4" />
            Refresh
          </button>
        </section>
      </main>
    );
  }
}
