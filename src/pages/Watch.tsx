import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router';
import { VideoSurface } from '@/components/player/VideoSurface';
import { findChannel } from '@/lib/api';
import { useChannels } from '@/lib/useChannels';
import { capitalize, monogram } from '@/lib/format';
import type { Channel } from '@/types';

const RELATED_LIMIT = 12;

function RailCard({ channel }: { channel: Channel }) {
  const [logoFailed, setLogoFailed] = useState(false);

  return (
    <Link
      to={`/watch/${channel.id}`}
      className="flex-none overflow-hidden rounded-xl border border-line bg-surface transition duration-200 ease-out-quart w-40 hover:border-accent/45 hover:bg-surface-2"
    >
      <div className="flex h-16 items-center justify-center p-3">
        {channel.logo && !logoFailed ? (
          <img
            src={channel.logo}
            alt=""
            loading="lazy"
            onError={() => setLogoFailed(true)}
            className="h-full w-full rounded object-contain"
          />
        ) : (
          <span aria-hidden="true" className="font-display text-ink-faint">
            {monogram(channel.name)}
          </span>
        )}
      </div>
      <p className="line-clamp-1 p-2.5 text-xs text-ink">{channel.name}</p>
    </Link>
  );
}

export default function Watch() {
  const { channelId } = useParams<{ channelId: string }>();
  const { channels, loading, error, reload } = useChannels();

  const channel = useMemo(
    () => (channelId ? findChannel(channels, channelId) : undefined),
    [channelId, channels],
  );

  const { related, mixedCountries } = useMemo(() => {
    if (!channel) return { related: [], mixedCountries: false };
    const sameCountry = channels.filter(
      (c) => c.id !== channel.id && c.country.code === channel.country.code,
    );
    let list = sameCountry;
    let mixed = false;
    if (list.length < RELATED_LIMIT && channel.category) {
      const extra = channels.filter(
        (c) =>
          c.id !== channel.id &&
          c.category === channel.category &&
          !list.includes(c),
      );
      list = [...list, ...extra];
      mixed = extra.length > 0;
    }
    return { related: list.slice(0, RELATED_LIMIT), mixedCountries: mixed };
  }, [channel, channels]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [channelId]);

  useEffect(() => {
    if (!channel) return;
    document.title = `${channel.name} · Still`;
    return () => {
      document.title = 'Still · calm IPTV';
    };
  }, [channel]);

  if (loading) {
    return (
      <main className="min-h-screen">
        <div className="mx-auto max-w-6xl px-4 pt-6 pb-16 sm:px-6">
          <div className="h-4 w-24 animate-pulse rounded bg-surface-2" />
          <div className="mt-4 aspect-video w-full animate-pulse rounded-xl bg-surface" />
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex min-h-screen items-center justify-center px-4">
        <div className="text-center">
          <h1 className="font-display text-3xl text-ink">Something went wrong.</h1>
          <p className="mt-2 text-sm text-ink-muted">The channel list failed to load.</p>
          <button
            type="button"
            onClick={reload}
            className="mt-5 h-10 rounded-full bg-accent px-5 font-semibold text-accent-ink transition hover:brightness-110"
          >
            Try again
          </button>
        </div>
      </main>
    );
  }

  if (!channel) {
    return (
      <main className="flex min-h-screen items-center justify-center px-4">
        <div className="text-center">
          <h1 className="font-display text-3xl text-ink">Nothing on air.</h1>
          <p className="mt-2 text-sm text-ink-muted">That channel is not in the guide.</p>
          <Link
            to="/"
            className="mt-5 inline-flex h-10 items-center rounded-full bg-accent px-5 font-semibold text-accent-ink transition hover:brightness-110"
          >
            Back to all channels
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-6xl px-4 pt-6 pb-16 sm:px-6">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm text-ink-muted transition-colors hover:text-ink"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M19 12H5" />
            <path d="M12 19l-7-7 7-7" />
          </svg>
          All channels
        </Link>

        <div className="mt-4">
          <VideoSurface url={channel.url} poster={channel.logo} />
        </div>

        <div className="mt-5 flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <h1 className="text-lg font-semibold text-ink">{channel.name}</h1>
          <p className="text-sm text-ink-faint">
            {channel.country.name}
            {channel.category && (
              <>
                {' · '}
                {capitalize(channel.category)}
              </>
            )}
          </p>
          {channel.quality && (
            <span className="rounded-full border border-line px-2.5 py-0.5 text-xs text-ink-muted">
              {channel.quality}
            </span>
          )}
        </div>

        {related.length > 0 && (
          <section className="mt-10">
            <h2 className="text-base font-semibold text-ink">
              {mixedCountries
                ? 'More channels'
                : `More from ${channel.country.name}`}
            </h2>
            <div className="relative mt-4">
              <div
                className="flex gap-4 overflow-x-auto pb-4"
                style={{ scrollbarWidth: 'thin' }}
              >
                {related.map((c) => (
                  <RailCard key={c.id} channel={c} />
                ))}
              </div>
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-bg to-transparent"
              />
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
