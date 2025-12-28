import { queryOptions, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../api/client";
import { USER_ENDPOINTS } from "../api/endpoints";
import type { UpdateProfileInput, UserResponse } from "../schemas/user.schema";

// Query Keys Factory
export const userKeys = {
	all: ["user"] as const,
	profile: () => [...userKeys.all, "profile"] as const,
	detail: (id: string) => [...userKeys.all, "detail", id] as const,
};

// Query Options (for use in route loaders)
export const profileQueryOptions = () =>
	queryOptions({
		queryKey: userKeys.profile(),
		queryFn: async () => {
			const response = await api.get<UserResponse>(USER_ENDPOINTS.PROFILE);
			return response.data.data;
		},
	});

export const userByIdQueryOptions = (userId: string) =>
	queryOptions({
		queryKey: userKeys.detail(userId),
		queryFn: async () => {
			const response = await api.get<UserResponse>(`${USER_ENDPOINTS.GET_USER_BY_ID}/${userId}`);
			return response.data.data;
		},
		enabled: !!userId,
	});

// Query: Get current user profile
export function useProfile() {
	return useQuery(profileQueryOptions());
}

// Query: Get user profile by ID
export function useUser(userId: string) {
	return useQuery(userByIdQueryOptions(userId));
}

// Mutation: Update profile
export function useUpdateProfile() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (data: UpdateProfileInput) => {
			const formData = new FormData();

			if (data.name) {
				formData.append("name", data.name);
			}
			if (data.image) {
				formData.append("image", data.image);
			}

			const response = await api.patch<UserResponse>(USER_ENDPOINTS.CHANGE_PROFILE, formData, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			});
			return response.data.data;
		},
		onSuccess: (data) => {
			// Update profile in cache
			queryClient.setQueryData(userKeys.profile(), data);
		},
	});
}
