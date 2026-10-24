import type { KeyboardEvent, RefObject } from 'react';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  inputRef: RefObject<HTMLInputElement | null>;
}

export function SearchInput({ value, onChange, inputRef }: SearchInputProps) {
  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== 'Escape') return;
    if (value) onChange('');
    inputRef.current?.blur();
  };

  return (
    <div className="relative w-full">
      <svg
        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint"
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
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.5-3.5" />
      </svg>
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Search channels"
        aria-label="Search channels"
        className="h-10 w-full rounded-full border border-line bg-surface pl-10 pr-12 text-sm text-ink transition-colors duration-200 ease-out-quart placeholder:text-ink-faint focus:border-accent/50 focus:outline-none"
      />
      {value.length === 0 && (
        <span
          aria-hidden="true"
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded border border-line px-2 py-0.5 text-xs text-ink-faint"
        >
          /
        </span>
      )}
    </div>
  );
}
