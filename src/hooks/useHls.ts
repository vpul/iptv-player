import { useCallback, useEffect, useRef, useState } from 'react';
import type { RefObject } from 'react';
import Hls from 'hls.js';

export type HlsStatus = 'loading' | 'ready' | 'error';

export interface UseHlsResult {
  videoRef: RefObject<HTMLVideoElement | null>;
  status: HlsStatus;
  needsGesture: boolean;
  play: () => void;
  retry: () => void;
}

/**
 * Attaches an HLS stream to a <video> element, preferring hls.js and
 * falling back to native HLS (Safari). Exposes playback status so the
 * surface can show tuning, gesture-required, and dead-stream states.
 */
export function useHls(url: string): UseHlsResult {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [status, setStatus] = useState<HlsStatus>('loading');
  const [needsGesture, setNeedsGesture] = useState(false);
  const [nonce, setNonce] = useState(0);

  const attemptPlay = useCallback((video: HTMLVideoElement) => {
    video.play().catch(() => {
      // Autoplay was blocked; the surface shows a play button instead.
      setNeedsGesture(true);
    });
  }, []);

  const play = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    video
      .play()
      .then(() => setNeedsGesture(false))
      .catch(() => undefined);
  }, []);

  const retry = useCallback(() => setNonce((n) => n + 1), []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    setStatus('loading');
    setNeedsGesture(false);

    if (Hls.isSupported()) {
      const hls = new Hls({ enableWorker: true });
      let recoveredMediaError = false;

      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        setStatus('ready');
        attemptPlay(video);
      });
      hls.on(Hls.Events.ERROR, (_event, data) => {
        if (!data.fatal) return;
        if (data.type === Hls.ErrorTypes.MEDIA_ERROR && !recoveredMediaError) {
          recoveredMediaError = true;
          hls.recoverMediaError();
          return;
        }
        hls.destroy();
        setStatus('error');
      });
      hls.loadSource(url);

      return () => {
        hls.destroy();
      };
    }

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      const onCanPlay = () => {
        setStatus('ready');
        attemptPlay(video);
      };
      const onError = () => setStatus('error');
      video.src = url;
      video.addEventListener('canplay', onCanPlay);
      video.addEventListener('error', onError);
      return () => {
        video.removeEventListener('canplay', onCanPlay);
        video.removeEventListener('error', onError);
        video.removeAttribute('src');
        video.load();
      };
    }

    setStatus('error');
    return undefined;
  }, [url, nonce, attemptPlay]);

  return { videoRef, status, needsGesture, play, retry };
}
