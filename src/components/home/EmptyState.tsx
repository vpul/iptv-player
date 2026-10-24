interface EmptyStateProps {
  title: string;
  body: string;
  actionLabel: string;
  onAction: () => void;
}

export function EmptyState({ title, body, actionLabel, onAction }: EmptyStateProps) {
  return (
    <div className="py-24 text-center">
      <h2 className="font-display text-3xl font-medium text-ink">{title}</h2>
      <p className="mx-auto mt-3 max-w-md text-sm text-ink-muted">{body}</p>
      <button
        type="button"
        onClick={onAction}
        className="mt-6 h-10 rounded-full bg-accent px-5 text-sm font-semibold text-accent-ink transition duration-200 ease-out-quart hover:brightness-110 active:brightness-95"
      >
        {actionLabel}
      </button>
    </div>
  );
}
