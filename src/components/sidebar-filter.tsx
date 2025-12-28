import { useNavigate } from "@tanstack/react-router";
import {
	BookOpen,
	ChartNoAxesColumnDecreasing,
	Funnel,
	GraduationCap,
	type LucideIcon,
} from "lucide-react";
import { useLecturers, useSubjects } from "@/lib/queries/lecturer-subject";
import { Route as ALayoutRoute, type FilterType, type SortByType } from "@/routes/(app)/a";
import { Button } from "./ui/button";
import { Combobox } from "./ui/combobox";
import { Label } from "./ui/label";

// Filter options mapped to API filter values
const FILTER_OPTIONS: { label: string; value: FilterType }[] = [
	{ label: "Hari ini", value: "today" },
	{ label: "Minggu ini", value: "week" },
	{ label: "Bulan ini", value: "month" },
	{ label: "Tahun ini", value: "year" },
];

// Sorting options mapped to API sort values (ulasan only)
const SORTING_OPTIONS: { label: string; value: SortByType }[] = [
	{ label: "Terbaru", value: "date" },
	{ label: "Paling banyak dilike", value: "most_like" },
	{ label: "Paling banyak dibookmark", value: "most_bookmark" },
	{ label: "Populer", value: "most_popular" },
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
		<div className="p-4 border-b">
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
							variant={isActive ? "default" : "outline"}
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
	currentPage: "forum" | "ulasan" | "search";
};

const SidebarFilter = ({ currentPage }: SidebarFilterProps) => {
	const search = ALayoutRoute.useSearch();
	const navigate = useNavigate();

	const { data: lecturers } = useLecturers();
	const { data: subjects } = useSubjects();

	const handleParamChange = (params: Partial<typeof search>) => {
		void navigate({
			to: ".",
			search: {
				...search,
				...params,
			},
			replace: true,
		});
	};

	const lecturerOptions = lecturers?.map((l) => ({ value: l.id_lecturer, label: l.name })) || [];
	const subjectOptions = subjects?.map((s) => ({ value: s.id_subject, label: s.name })) || [];

	return (
		<div className="sticky top-0 flex flex-col max-w-xs w-64 h-fit -mt-4 -mr-4 pt-4 border-l bg-white/50 backdrop-blur-sm min-h-[calc(100vh-4rem)]">
			<div className="text-xl font-bold px-4 mb-2">Filter & Sorting</div>

			<FilterSection
				icon={Funnel}
				title="Waktu"
				options={FILTER_OPTIONS}
				activeValue={search.filter}
				onSelect={(val) => handleParamChange({ filter: val })}
			/>

			{/* Lecturer Filter (Only for ulasan) */}
			{currentPage === "ulasan" && (
				<div className="p-4 border-b space-y-2">
					<div className="flex items-center gap-2">
						<GraduationCap className="size-4 text-[#2067E9]" />
						<Label className="font-semibold text-md">Dosen</Label>
					</div>
					<Combobox
						options={lecturerOptions}
						value={search.id_lecturer}
						onChange={(val) => handleParamChange({ id_lecturer: val })}
						placeholder="Pilih Dosen..."
						searchPlaceholder="Cari dosen..."
					/>
				</div>
			)}

			{/* Subject Filter (For both) */}
			<div className="p-4 border-b space-y-2">
				<div className="flex items-center gap-2">
					<BookOpen className="size-4 text-[#2067E9]" />
					<Label className="font-semibold text-md">Mata Kuliah</Label>
				</div>
				<Combobox
					options={subjectOptions}
					value={search.id_subject}
					onChange={(val) => handleParamChange({ id_subject: val })}
					placeholder="Pilih Matkul..."
					searchPlaceholder="Cari matkul..."
				/>
			</div>

			{/* Only show sorting for ulasan page - forum API doesn't support sorting */}
			{currentPage === "ulasan" && (
				<FilterSection
					icon={ChartNoAxesColumnDecreasing}
					title="Sorting"
					options={SORTING_OPTIONS}
					activeValue={search.sortBy}
					onSelect={(val) => handleParamChange({ sortBy: val, order: val ? "desc" : undefined })}
				/>
			)}

			{/* Only show sorting for forum page - ulasan API doesn't support sorting */}
			{currentPage === "forum" && (
				<FilterSection
					icon={ChartNoAxesColumnDecreasing}
					title="Sorting"
					options={SORTING_OPTIONS}
					activeValue={search.sortBy}
					onSelect={(val) => handleParamChange({ sortBy: val })}
				/>
			)}

			{/* Only show sorting for forum page - ulasan API doesn't support sorting */}
			{currentPage === "search" && (
				<FilterSection
					icon={ChartNoAxesColumnDecreasing}
					title="Sorting"
					options={SORTING_OPTIONS}
					activeValue={search.sortBy}
					onSelect={(val) => handleParamChange({ sortBy: val })}
				/>
			)}

			{(search.filter || search.id_lecturer || search.id_subject || search.sortBy) && (
				<div className="p-4">
					<Button
						variant="ghost"
						className="w-full text-sm text-muted-foreground hover:text-destructive"
						onClick={() =>
							handleParamChange({
								filter: undefined,
								id_lecturer: undefined,
								id_subject: undefined,
								sortBy: undefined,
								order: undefined,
							})
						}
					>
						Hapus Semua Filter
					</Button>
				</div>
			)}
		</div>
	);
};

export default SidebarFilter;
