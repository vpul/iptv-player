export interface Country {
  code: string;
  name: string;
}

/** A single curated live channel, as stored in public/channels.json. */
export interface Channel {
  /** Stable slug (iptv-org id), used in the /watch/:channelId route. */
  id: string;
  name: string;
  /** HLS playlist URL. Always https to avoid mixed-content blocking. */
  url: string;
  logo: string | null;
  quality: string | null;
  category: string | null;
  country: Country;
}

export interface ChannelsFile {
  generatedAt: string;
  source: string;
  count: number;
  channels: Channel[];
}
