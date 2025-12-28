import { createFileRoute, isRedirect, Outlet, redirect, useMatch } from "@tanstack/react-router";
import { AppSidebar } from "@/components/app-sidebar";
import SidebarFilter from "@/components/sidebar-filter";
import { TopNavigation } from "@/components/top-navigation";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { profileQueryOptions } from "@/lib/queries/user";

// Filter search params type - shared across child routes
export type FilterType = "today" | "week" | "month" | "year";
export type SortByType = "date" | "most_like" | "most_bookmark" | "most_popular";
export type OrderType = "asc" | "desc";

export type FilterSearch = {
	filter?: FilterType;
	sortBy?: SortByType;
	order?: OrderType;
	id_lecturer?: string;
	id_subject?: string;
};

export const Route = createFileRoute("/(app)/a")({
	beforeLoad: async ({ context }) => {
		// Skip auth check on server because tokens are in localStorage
		if (typeof window === "undefined") return;

		try {
			await context.queryClient.ensureQueryData(profileQueryOptions());
		} catch (error) {
			if (isRedirect(error)) throw error;
			throw redirect({
				to: "/",
			});
		}
	},
	validateSearch: (search: Record<string, unknown>): FilterSearch => {
		return {
			filter: ["today", "week", "month", "year"].includes(search.filter as string)
				? (search.filter as FilterType)
				: undefined,
			sortBy: ["date", "most_like", "most_bookmark", "most_popular"].includes(
				search.sortBy as string
			)
				? (search.sortBy as SortByType)
				: undefined,
			order: ["asc", "desc"].includes(search.order as string)
				? (search.order as OrderType)
				: undefined,
			id_lecturer: typeof search.id_lecturer === "string" ? search.id_lecturer : undefined,
			id_subject: typeof search.id_subject === "string" ? search.id_subject : undefined,
		};
	},
	component: ALayout,
});

function ALayout() {
	const isForumPage = useMatch({ from: "/(app)/a/forum/", shouldThrow: false });
	const isReviewPage = useMatch({ from: "/(app)/a/home", shouldThrow: false });
	const isSearchPage = useMatch({ from: "/(app)/a/search", shouldThrow: false });

	// Determine current page type for sidebar filter
	const currentPage = isForumPage ? "forum" : isReviewPage ? "ulasan" : "search";

	return (
		<SidebarProvider>
			<AppSidebar />
			<SidebarInset>
				<TopNavigation />
				<div className="flex flex-1 flex-col gap-4 p-4">
					<div className="flex items-start gap-3">
						<div className="flex-1 grow min-w-0">
							<Outlet />
						</div>
						{(isForumPage || isReviewPage || isSearchPage) && (
							<SidebarFilter currentPage={currentPage} />
						)}
					</div>
				</div>
			</SidebarInset>
		</SidebarProvider>
	);
}
