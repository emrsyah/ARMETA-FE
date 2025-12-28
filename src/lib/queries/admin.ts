import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../api/client";
import { ADMIN_ENDPOINTS } from "../api/endpoints";
import type { User } from "../schemas/user.schema";

export const adminKeys = {
	all: ["admin"] as const,
	stats: () => [...adminKeys.all, "stats"] as const,
	users: () => [...adminKeys.all, "users"] as const,
	reports: () => [...adminKeys.all, "reports"] as const,
};

export function useAdminStats() {
	return useQuery({
		queryKey: adminKeys.stats(),
		queryFn: async () => {
			const response = await api.get(ADMIN_ENDPOINTS.STATS);
			return response.data.data;
		},
	});
}

export function useAllUsers() {
	return useQuery<User[]>({
		queryKey: adminKeys.users(),
		queryFn: async () => {
			const response = await api.get(ADMIN_ENDPOINTS.GET_ALL_USERS);
			return response.data.data;
		},
	});
}

export function useAllReports() {
	return useQuery({
		queryKey: adminKeys.reports(),
		queryFn: async () => {
			const response = await api.get(ADMIN_ENDPOINTS.GET_REPORTS);
			return response.data.data;
		},
	});
}

export function useToggleBan() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (id_user: string) => {
			const response = await api.patch(`${ADMIN_ENDPOINTS.TOGGLE_BAN}/${id_user}/ban`);
			return response.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: adminKeys.users() });
		},
	});
}

export function useUpdateUserRole() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async ({ id_user, role }: { id_user: string; role: string }) => {
			const response = await api.patch(`${ADMIN_ENDPOINTS.UPDATE_ROLE}/${id_user}/role`, { role });
			return response.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: adminKeys.users() });
		},
	});
}

export function useResolveReport() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async ({
			id_report,
			status,
		}: {
			id_report: string;
			status: "Resolved" | "Ignored";
		}) => {
			const response = await api.patch(`${ADMIN_ENDPOINTS.RESOLVE_REPORT}/${id_report}/resolve`, {
				status,
			});
			return response.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: adminKeys.reports() });
			queryClient.invalidateQueries({ queryKey: adminKeys.stats() });
		},
	});
}

export function useDeleteContent() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async ({ type, id }: { type: "review" | "forum"; id: string }) => {
			const response = await api.delete(`${ADMIN_ENDPOINTS.DELETE_CONTENT}/${type}/${id}`);
			return response.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: adminKeys.reports() });
		},
	});
}
