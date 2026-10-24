import { useCallback, useEffect, useState } from 'react';
import { fetchChannels } from '@/lib/api';
import type { Channel, ChannelsFile } from '@/types';

interface ChannelsState {
  channels: Channel[];
  generatedAt: string | null;
  loading: boolean;
  error: Error | null;
  reload: () => void;
}

/** Loads the curated channel list once per session; callers derive whatever they need. */
export function useChannels(): ChannelsState {
  const [file, setFile] = useState<ChannelsFile | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [nonce, setNonce] = useState(0);

  const reload = useCallback(() => setNonce((n) => n + 1), []);

  useEffect(() => {
    let cancelled = false;
    fetchChannels()
      .then((data) => !cancelled && setFile(data))
      .catch((err: Error) => !cancelled && setError(err));
    return () => {
      cancelled = true;
    };
  }, [nonce]);

  return {
    channels: file?.channels ?? [],
    generatedAt: file?.generatedAt ?? null,
    loading: !file && !error,
    error,
    reload,
  };
}
