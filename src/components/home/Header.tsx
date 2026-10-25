import { Link } from 'react-router';
import type { RefObject } from 'react';
import { SearchInput } from './SearchInput';

interface HeaderProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  searchInputRef: RefObject<HTMLInputElement | null>;
}

export function Header({ searchValue, onSearchChange, searchInputRef }: HeaderProps) {
  return (
    <header className="sticky top-0 z-10 h-16 border-b border-line bg-bg">
      <div className="flex h-full items-center gap-4 px-4 sm:px-6 lg:px-8">
        <Link to="/" className="shrink-0">
          <span className="font-display text-xl font-medium text-ink">Luma</span>
          <span className="ml-2 hidden text-sm text-ink-faint sm:inline">· free live TV</span>
        </Link>
        <div className="flex max-w-md flex-1">
          <SearchInput value={searchValue} onChange={onSearchChange} inputRef={searchInputRef} />
        </div>
        <a
          href="https://github.com/vpul/iptv-player"
          target="_blank"
          rel="noreferrer"
          aria-label="View source on GitHub"
          className="ml-auto shrink-0 text-ink-faint transition-colors duration-200 ease-out-quart hover:text-ink"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 16 16"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
          </svg>
        </a>
      </div>
    </header>
  );
}
