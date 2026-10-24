import { useEffect, useMemo, useRef, useState } from 'react';
import { useChannels } from '@/lib/useChannels';
import { capitalize } from '@/lib/format';
import type { Channel } from '@/types';
import { Header } from '@/components/home/Header';
import { FilterBar } from '@/components/home/FilterBar';
import { ChannelGrid } from '@/components/home/ChannelGrid';
import { GridSkeleton } from '@/components/home/GridSkeleton';
import { EmptyState } from '@/components/home/EmptyState';

const dateFormatter = new Intl.DateTimeFormat('en', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
});

export default function Home() {
  const { channels, generatedAt, loading, error, reload } = useChannels();
  const [searchTerm, setSearchTerm] = useState('');
  const [country, setCountry] = useState('all');
  const [category, setCategory] = useState('all');
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== '/') return;
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      const target = event.target as HTMLElement | null;
      const tag = target?.tagName;
      if (
        tag === 'INPUT' ||
        tag === 'SELECT' ||
        tag === 'TEXTAREA' ||
        target?.isContentEditable
      ) {
        return;
      }
      event.preventDefault();
      searchInputRef.current?.focus();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const countryOptions = useMemo(() => {
    const counts = new Map<string, { name: string; count: number }>();
    for (const channel of channels) {
      const existing = counts.get(channel.country.code);
      if (existing) {
        existing.count += 1;
      } else {
        counts.set(channel.country.code, { name: channel.country.name, count: 1 });
      }
    }
    return [...counts.entries()]
      .map(([code, { name, count }]) => ({ code, name, count }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [channels]);

  const categoryOptions = useMemo(() => {
    const counts = new Map<string, number>();
    for (const channel of channels) {
      if (channel.category === null) continue;
      const key = channel.category.toLowerCase();
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
    return [...counts.entries()]
      .map(([key, count]) => ({ name: capitalize(key), count }))
      .sort((a, b) => b.count - a.count);
  }, [channels]);

  const filteredChannels = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return channels.filter((channel: Channel) => {
      if (term !== '' && !channel.name.toLowerCase().includes(term)) return false;
      if (country !== 'all' && channel.country.code !== country) return false;
      if (
        category !== 'all' &&
        (channel.category ?? '').toLowerCase() !== category.toLowerCase()
      ) {
        return false;
      }
      return true;
    });
  }, [channels, searchTerm, country, category]);

  const updatedLabel = useMemo(() => {
    if (generatedAt === null) return null;
    const date = new Date(generatedAt);
    if (Number.isNaN(date.getTime())) return null;
    return dateFormatter.format(date);
  }, [generatedAt]);

  // Announce the result count to screen readers only once typing settles;
  // announcing per keystroke would narrate over the user's input.
  const [announcedCount, setAnnouncedCount] = useState(0);
  useEffect(() => {
    const timer = setTimeout(() => setAnnouncedCount(filteredChannels.length), 500);
    return () => clearTimeout(timer);
  }, [filteredChannels.length]);

  const trimmedSearch = searchTerm.trim();

  const clearFilters = () => {
    setSearchTerm('');
    setCountry('all');
    setCategory('all');
  };

  return (
    <div className="min-h-screen">
      <Header
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        searchInputRef={searchInputRef}
      />
      <main className="mx-auto max-w-[90rem] px-4 pb-16 sm:px-6 lg:px-8">
        <h1 className="sr-only">Still — live channel guide</h1>
        <FilterBar
          countries={countryOptions}
          categories={categoryOptions}
          activeCountry={country}
          activeCategory={category}
          onCountryChange={setCountry}
          onCategoryChange={setCategory}
        />
        <p className="py-2 text-xs text-ink-faint">
          {filteredChannels.length}{' '}
          {filteredChannels.length === 1 ? 'channel' : 'channels'} · updated{' '}
          {updatedLabel ?? '—'}
        </p>
        <p className="sr-only" aria-live="polite">
          {announcedCount} {announcedCount === 1 ? 'channel' : 'channels'}
        </p>
        {loading ? (
          <GridSkeleton />
        ) : error ? (
          <EmptyState
            title="Something went wrong."
            body="The channel list failed to load."
            actionLabel="Try again"
            onAction={reload}
          />
        ) : filteredChannels.length === 0 ? (
          <EmptyState
            title="Nothing on air."
            body={
              trimmedSearch !== ''
                ? `No channels match “${trimmedSearch}”.`
                : 'No channels match the selected filters.'
            }
            actionLabel="Clear filters"
            onAction={clearFilters}
          />
        ) : (
          <ChannelGrid channels={filteredChannels} />
        )}
        <footer className="mt-16 flex flex-wrap justify-between gap-2 border-t border-line pt-6 text-xs text-ink-faint">
          <p>Channel data from the iptv-org project · links refresh weekly</p>
          <p>Availability depends on each broadcaster</p>
        </footer>
      </main>
    </div>
  );
}
