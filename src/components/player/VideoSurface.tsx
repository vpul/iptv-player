import { useHls } from '@/hooks/useHls';
import { StreamError } from './StreamError';

interface VideoSurfaceProps {
  url: string;
  poster?: string | null;
}

/** 16:9 player stage with tuning, gesture-required, and dead-stream overlays. */
export function VideoSurface({ url, poster }: VideoSurfaceProps) {
  const { videoRef, status, needsGesture, play, retry } = useHls(url);

  return (
    <div className="relative aspect-video max-h-[72vh] w-full overflow-hidden rounded-xl border border-line bg-black">
      <video
        ref={videoRef}
        className="h-full w-full"
        controls
        playsInline
        poster={poster ?? undefined}
      />
      {status === 'loading' && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <p className="animate-pulse text-sm text-ink-faint">Tuning&hellip;</p>
        </div>
      )}
      {status === 'error' && <StreamError onRetry={retry} />}
      {status === 'ready' && needsGesture && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <button
            type="button"
            onClick={play}
            aria-label="Play stream"
            className="pointer-events-auto flex h-14 w-14 items-center justify-center rounded-full bg-accent text-accent-ink transition hover:brightness-110"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M8 5.5v13l11-6.5-11-6.5z" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
