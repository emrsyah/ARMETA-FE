import { queryOptions, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../api/client";
import { REPORT_ENDPOINTS } from "../api/endpoints";
import type {
	CreateReportInput,
	ReportListResponse,
	ReportResponse,
} from "../schemas/report.schema";

// Query Keys Factory
export const reportKeys = {
	all: ["report"] as const,
	lists: () => [...reportKeys.all, "list"] as const,
	detail: (id: string) => [...reportKeys.all, "detail", id] as const,
};

// Query Options (for use in route loaders)
export const userReportsQueryOptions = () =>
	queryOptions({
		queryKey: reportKeys.lists(),
		queryFn: async () => {
			const response = await api.get<ReportListResponse>(REPORT_ENDPOINTS.GET_USER_REPORTS);
			return response.data.data;
		},
	});

// Query: Get user's reports
export function useUserReports() {
	return useQuery(userReportsQueryOptions());
}

// Mutation: Create report
export function useCreateReport() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (data: CreateReportInput) => {
			const response = await api.post<ReportResponse>(REPORT_ENDPOINTS.CREATE, data);
			return response.data.data;
		},
		onSuccess: () => {
			// Invalidate reports list
			queryClient.invalidateQueries({ queryKey: reportKeys.lists() });
		},
	});
}
