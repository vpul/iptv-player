interface CountryOption {
  code: string;
  name: string;
  count: number;
}

interface CategoryOption {
  name: string;
  count: number;
}

interface FilterBarProps {
  countries: CountryOption[];
  categories: CategoryOption[];
  activeCountry: string;
  activeCategory: string;
  onCountryChange: (code: string) => void;
  onCategoryChange: (name: string) => void;
}

const TOP_CATEGORY_COUNT = 10;

function chipClasses(active: boolean): string {
  const base =
    'h-9 shrink-0 whitespace-nowrap rounded-full border px-4 text-sm transition-colors duration-200 ease-out-quart';
  return active
    ? `${base} border-accent/60 bg-accent-soft font-medium text-accent`
    : `${base} border-line text-ink-muted hover:border-ink-faint/40 hover:text-ink`;
}

export function FilterBar({
  countries,
  categories,
  activeCountry,
  activeCategory,
  onCountryChange,
  onCategoryChange,
}: FilterBarProps) {
  return (
    <div className="flex items-center gap-3 overflow-x-auto py-3">
      <select
        aria-label="Filter by country"
        value={activeCountry}
        onChange={(event) => onCountryChange(event.target.value)}
        className="h-9 shrink-0 rounded-full border border-line bg-surface px-4 text-sm text-ink transition-colors duration-200 ease-out-quart focus:border-accent/50 focus:outline-none"
      >
        <option value="all">All countries</option>
        {countries.map((country) => (
          <option key={country.code} value={country.code}>
            {country.name} ({country.count})
          </option>
        ))}
      </select>
      <button
        type="button"
        aria-pressed={activeCategory === 'all'}
        onClick={() => onCategoryChange('all')}
        className={chipClasses(activeCategory === 'all')}
      >
        All
      </button>
      {categories.slice(0, TOP_CATEGORY_COUNT).map((category) => {
        const active = category.name === activeCategory;
        return (
          <button
            key={category.name}
            type="button"
            aria-pressed={active}
            onClick={() => onCategoryChange(category.name)}
            className={chipClasses(active)}
          >
            {category.name}
          </button>
        );
      })}
    </div>
  );
}
