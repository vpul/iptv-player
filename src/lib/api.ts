import type { Channel, ChannelsFile } from '@/types';

const url = `${import.meta.env.BASE_URL}channels.json`;

let cache: Promise<ChannelsFile> | null = null;

/** Fetch the curated channel list shipped with the app. Cached per session. */
export function fetchChannels(): Promise<ChannelsFile> {
  if (cache === null) {
    const request = fetch(url).then(async (res) => {
      if (!res.ok) throw new Error(`Failed to load channels (${res.status})`);
      return res.json() as Promise<ChannelsFile>;
    });
    cache = request;
    // A network-level rejection must not poison the cache: retry should refetch.
    request.catch(() => {
      cache = null;
    });
  }
  return cache;
}

export function findChannel(channels: Channel[], id: string): Channel | undefined {
  return channels.find((channel) => channel.id === id);
}
