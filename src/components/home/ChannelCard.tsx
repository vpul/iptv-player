import { useState } from 'react';
import { Link } from 'react-router';
import type { Channel } from '@/types';

interface ChannelCardProps {
  channel: Channel;
}

function monogram(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join('');
}

export function ChannelCard({ channel }: ChannelCardProps) {
  const [logoFailed, setLogoFailed] = useState(false);
  const logo = channel.logo;
  const showLogo = logo !== null && !logoFailed;

  return (
    <Link
      to={`/watch/${channel.id}`}
      className="block overflow-hidden rounded-xl border border-line bg-surface transition-[transform,border-color,background-color] duration-200 ease-out-quart hover:-translate-y-0.5 hover:border-accent/45 hover:bg-surface-2"
    >
      <div className="flex h-24 items-center justify-center p-4">
        {showLogo ? (
          <img
            src={logo}
            alt=""
            loading="lazy"
            decoding="async"
            className="h-full w-full rounded-md object-contain"
            onError={() => setLogoFailed(true)}
          />
        ) : (
          <div aria-hidden="true" className="font-display text-2xl text-ink-faint">
            {monogram(channel.name)}
          </div>
        )}
      </div>
      <div className="p-3 pt-2">
        <p className="line-clamp-2 min-h-[2.5rem] text-sm font-medium leading-snug text-ink">
          {channel.name}
        </p>
        <p className="mt-1 truncate text-xs text-ink-faint">
          {channel.country.name}
          {channel.quality !== null && ` · ${channel.quality}`}
        </p>
      </div>
    </Link>
  );
}
