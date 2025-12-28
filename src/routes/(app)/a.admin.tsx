import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { profileQueryOptions } from "@/lib/queries/user";

export const Route = createFileRoute("/(app)/a/admin")({
	beforeLoad: async ({ context }) => {
		// Check if user is admin
		try {
			const user = await context.queryClient.ensureQueryData(profileQueryOptions());
			if (user.role !== "admin") {
				throw redirect({
					to: "/a/home",
				});
			}
		} catch (_error) {
			throw redirect({
				to: "/a/home",
			});
		}
	},
	component: AdminLayout,
});

function AdminLayout() {
	return (
		<div className="flex flex-col gap-6">
			<div className="flex flex-col gap-1">
				<h1 className="text-3xl font-bold tracking-tight">Admin Management</h1>
				<p className="text-muted-foreground">
					Kelola user, dosen, mata kuliah, dan laporan moderasi.
				</p>
			</div>
			<div className="w-full">
				<Outlet />
			</div>
		</div>
	);
}
