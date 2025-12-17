import { ChartNoAxesColumnDecreasing, Funnel, LucideIcon } from 'lucide-react';
import { Button } from './ui/button';
import { useNavigate } from '@tanstack/react-router';
import { Route as ALayoutRoute, type FilterType, type SortByType } from '@/routes/(app)/a';

// Filter options mapped to API filter values
const FILTER_OPTIONS: { label: string; value: FilterType }[] = [
  { label: 'Hari ini', value: 'today' },
  { label: 'Minggu ini', value: 'week' },
  { label: 'Bulan ini', value: 'month' },
  { label: 'Tahun ini', value: 'year' },
];

// Sorting options mapped to API sort values (ulasan only)
const SORTING_OPTIONS: { label: string; value: SortByType }[] = [
  { label: 'Terbaru', value: 'date' },
  { label: 'Paling banyak dilike', value: 'likes' },
  { label: 'Paling banyak dibookmark', value: 'bookmarks' },
];

type FilterSectionProps<T extends string> = {
  icon: LucideIcon;
  title: string;
  options: { label: string; value: T }[];
  activeValue?: T;
  onSelect: (value: T | undefined) => void;
};

function FilterSection<T extends string>({
  icon: Icon,
  title,
  options,
  activeValue,
  onSelect,
}: FilterSectionProps<T>) {
  return (
    <div className="p-4">
      <div className="mb-2">
        <Icon className="inline-block mr-2 text-[#2067E9]" size={16} />
        <span className="font-semibold text-md">{title}</span>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {options.map((option) => {
          const isActive = activeValue === option.value;
          return (
            <Button
              key={option.value}
              variant={isActive ? 'default' : 'outline'}
              size="sm"
              className="rounded-full"
              onClick={() => onSelect(isActive ? undefined : option.value)}
            >
              {option.label}
            </Button>
          );
        })}
      </div>
    </div>
  );
}

type SidebarFilterProps = {
  currentPage: 'forum' | 'ulasan';
};

const SidebarFilter = ({ currentPage }: SidebarFilterProps) => {
  const search = ALayoutRoute.useSearch();
  const navigate = useNavigate();

  const handleFilterChange = (filter: FilterType | undefined) => {
    void navigate({
      to: '.',
      search: {
        ...search,
        filter,
      },
      replace: true,
    });
  };

  const handleSortChange = (sortBy: SortByType | undefined) => {
    void navigate({
      to: '.',
      search: {
        ...search,
        sortBy,
        // Default to desc order when selecting a sort option
        order: sortBy ? 'desc' : undefined,
      },
      replace: true,
    });
  };

  return (
    <div className="sticky top-0 flex flex-col max-w-xs w-full h-fit -mt-4 -mr-4 pt-4">
      <div className="text-xl font-bold px-8">Filter & Sorting</div>

      <FilterSection
        icon={Funnel}
        title="Filter"
        options={FILTER_OPTIONS}
        activeValue={search.filter}
        onSelect={handleFilterChange}
      />

      {/* Only show sorting for ulasan page - forum API doesn't support sorting */}
      {currentPage === 'ulasan' && (
        <FilterSection
          icon={ChartNoAxesColumnDecreasing}
          title="Sorting"
          options={SORTING_OPTIONS}
          activeValue={search.sortBy}
          onSelect={handleSortChange}
        />
      )}
    </div>
  );
};

export default SidebarFilter;
