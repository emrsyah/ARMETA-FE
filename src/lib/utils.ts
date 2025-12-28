import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { FilterType } from "@/routes/(app)/a";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

/**
 * Convert filter type to date range (from, to) in ISO format (YYYY-MM-DD)
 * Uses local time to determine the dates.
 */
export function getDateRangeFromFilter(filter: FilterType): { from: string; to: string } {
	const now = new Date();

	const formatDate = (date: Date) => {
		const year = date.getFullYear();
		const month = String(date.getMonth() + 1).padStart(2, "0");
		const day = String(date.getDate()).padStart(2, "0");
		return `${year}-${month}-${day}`;
	};

	const to = formatDate(now);
	let fromDate: Date;

	switch (filter) {
		case "today":
			fromDate = now;
			break;
		case "week":
			fromDate = new Date(now);
			fromDate.setDate(now.getDate() - 7);
			break;
		case "month":
			fromDate = new Date(now);
			fromDate.setDate(now.getDate() - 30);
			break;
		case "year":
			fromDate = new Date(now);
			fromDate.setFullYear(now.getFullYear() - 1);
			break;
		default:
			fromDate = now;
	}

	return {
		from: formatDate(fromDate),
		to,
	};
}
