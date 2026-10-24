import { Link } from 'react-router';

interface StreamErrorProps {
  onRetry: () => void;
}

/** Dead-stream overlay: calm headline, one-line cause, one way back. */
export function StreamError({ onRetry }: StreamErrorProps) {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-danger-soft/90 p-6 text-center">
      <div>
        <h2 className="font-display text-2xl text-ink">This stream is off air.</h2>
        <p className="mt-2 max-w-sm text-sm text-ink-muted">
          The broadcaster&rsquo;s link is down or unavailable in your region.
        </p>
        <div className="mt-5 flex justify-center gap-3">
          <button
            type="button"
            onClick={onRetry}
            className="h-9 rounded-full border border-line px-4 text-sm text-ink transition hover:bg-surface-2"
          >
            Try again
          </button>
          <Link
            to="/"
            className="inline-flex h-9 items-center rounded-full bg-accent px-4 text-sm font-semibold text-accent-ink transition hover:brightness-110"
          >
            Browse channels
          </Link>
        </div>
      </div>
    </div>
  );
}
