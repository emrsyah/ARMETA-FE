import { ChartNoAxesColumnDecreasing, Funnel, LucideIcon } from 'lucide-react';
import { Button } from './ui/button';

const FILTER_OPTIONS = [
  'Hari ini',
  'Minggu ini',
  'Bulan ini',
  'Tahun ini',
  'Kamu ikuti',
  'Gambar',
];

const SORTING_OPTIONS = [
  'Terbaru',
  'Populer',
  'Paling banyak dilihat',
  'Paling banyak dilike',
  'Paling banyak dibookmark',
];


function FilterSection({ icon: Icon, title, options }: { 
  icon: LucideIcon; 
  title: string; 
  options: string[];
}) {
  return (
    <div className="p-4">
      <div className="mb-2">
        <Icon className="inline-block mr-2 text-[#2067E9]" size={16} />
        <span className="font-semibold text-md">{title}</span>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {options.map((option) => (
          <Button
            key={option}
            variant="outline"
            size="sm"
            className='rounded-full'
                      >
            {option}
          </Button>
        ))}
      </div>
    </div>
  );
}

const SidebarFilter = () => {
  return (
    <div className="flex flex-col max-w-xs w-full h-full border-l-2 px-4">
      <div className="text-xl font-bold mt-4 px-4">Filter & Sorting</div>
      
      <FilterSection icon={Funnel} title="Filter" options={FILTER_OPTIONS} />
      <FilterSection icon={ChartNoAxesColumnDecreasing} title="Sorting" options={SORTING_OPTIONS} />
    </div>
  );
};

export default SidebarFilter;

