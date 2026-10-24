import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useWindowVirtualizer } from '@tanstack/react-virtual';
import type { Channel } from '@/types';
import { ChannelCard } from './ChannelCard';

interface ChannelGridProps {
  channels: Channel[];
}

/*
  One card: 6rem logo box (96px) + p-3/pt-2 text block (8 + 40 + 4 + 16 + 12 = 80px)
  + 1px borders = 178px. With the 16px row gap that is a 194px row pitch.
*/
const ROW_HEIGHT = 194;
const GAP = 16;
const MIN_CARD_WIDTH = 176;
const OVERSCAN = 6;

export function ChannelGrid({ channels }: ChannelGridProps) {
  const gridRef = useRef<HTMLDivElement | null>(null);
  const [width, setWidth] = useState(0);
  const [scrollMargin, setScrollMargin] = useState(0);

  useLayoutEffect(() => {
    const element = gridRef.current;
    if (!element) return;
    const measure = () => {
      setWidth(element.clientWidth);
      setScrollMargin(element.getBoundingClientRect().top + window.scrollY);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const columns =
    width === 0
      ? 2
      : Math.min(8, Math.max(2, Math.floor(width / MIN_CARD_WIDTH)));

  const rows = useMemo(() => {
    const chunked: Channel[][] = [];
    for (let i = 0; i < channels.length; i += columns) {
      chunked.push(channels.slice(i, i + columns));
    }
    return chunked;
  }, [channels, columns]);

  const virtualizer = useWindowVirtualizer({
    count: rows.length,
    estimateSize: () => ROW_HEIGHT,
    overscan: OVERSCAN,
    scrollMargin,
  });

  // The container must stay mounted even before measuring: the ResizeObserver
  // needs the element to exist, so the rows (not the container) wait on width.
  const virtualRows = width === 0 ? [] : virtualizer.getVirtualItems();

  return (
    <div
      ref={gridRef}
      className="relative w-full"
      style={{ height: width === 0 ? 0 : virtualizer.getTotalSize() }}
    >
      {virtualRows.map((virtualRow) => (
        <div
          key={virtualRow.key}
          className="absolute left-0 top-0 w-full"
          style={{
            transform: `translateY(${virtualRow.start - scrollMargin}px)`,
          }}
        >
          <div
            className="grid"
            style={{
              gap: `${GAP}px`,
              gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
            }}
          >
            {rows[virtualRow.index]?.map((channel) => (
              <ChannelCard key={channel.id} channel={channel} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
