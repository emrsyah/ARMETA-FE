import {
	queryOptions,
	useInfiniteQuery,
	useMutation,
	useQuery,
	useQueryClient,
} from "@tanstack/react-query";
import api from "../api/client";
import { FORUM_ENDPOINTS } from "../api/endpoints";
import type {
	GetAllForumInput as BaseGetAllForumInput,
	CreateForumInput,
	EditForumInput,
	ForumDetailResponse,
	ForumListResponse,
	ForumResponse,
} from "../schemas/forum.schema";

// --- TAMBAHAN: Definisi Sorting & Type Extension ---
export const FORUM_SORT_OPTIONS = {
	LATEST: "date",
	MOST_LIKED: "most_like",
	MOST_BOOKMARKED: "most_bookmark",
	POPULAR: "most_popular",
	MOST_REPLY: "most_reply",
} as const;

export type ForumSortOption = (typeof FORUM_SORT_OPTIONS)[keyof typeof FORUM_SORT_OPTIONS];

// Memperluas tipe input agar mendukung search 'q' dan custom 'sortBy'
export interface GetAllForumInput extends Omit<BaseGetAllForumInput, "sortBy"> {
	sortBy?: ForumSortOption;
	q?: string; // Tambahan untuk search query
	search?: string; // Alias untuk q (jika backend pakai 'search')
}
// ---------------------------------------------------

// Query Keys Factory
export const forumKeys = {
	all: ["forum"] as const,
	lists: (filters?: GetAllForumInput) => [...forumKeys.all, "list", filters] as const,
	bySubject: (subjectId: string) => [...forumKeys.all, "subject", subjectId] as const,
	detail: (id: string) => [...forumKeys.all, "detail", id] as const,
	// Update key search agar unik berdasarkan semua parameter filter
	search: (params: GetAllForumInput) => [...forumKeys.all, "search", params] as const,
	liked: (userId?: string) => [...forumKeys.all, "liked", userId] as const,
	bookmarked: () => [...forumKeys.all, "bookmarked"] as const,
};

// ... (Query Options lain tetap sama) ...
export const forumListQueryOptions = (filters?: GetAllForumInput) =>
	queryOptions({
		queryKey: forumKeys.lists(filters),
		queryFn: async () => {
			const response = await api.get<ForumListResponse>(FORUM_ENDPOINTS.GET_ALL, {
				params: filters,
			});
			return response.data.data;
		},
	});

export const forumsBySubjectQueryOptions = (subjectId: string) =>
	queryOptions({
		queryKey: forumKeys.bySubject(subjectId),
		queryFn: async () => {
			const response = await api.get<ForumListResponse>(FORUM_ENDPOINTS.GET_BY_SUBJECT, {
				params: { id_subject: subjectId },
			});
			return response.data.data;
		},
		enabled: !!subjectId,
	});

export const forumDetailQueryOptions = (forumId: string) =>
	queryOptions({
		queryKey: forumKeys.detail(forumId),
		queryFn: async () => {
			const response = await api.get<ForumDetailResponse>(FORUM_ENDPOINTS.GET_BY_ID, {
				params: { id_forum: forumId },
			});
			return response.data.data;
		},
		enabled: !!forumId,
	});

export const likedForumQueryOptions = (userId?: string) =>
	queryOptions({
		queryKey: forumKeys.liked(userId),
		queryFn: async () => {
			const response = await api.get<ForumListResponse>(FORUM_ENDPOINTS.GET_LIKED, {
				params: userId ? { id_user: userId } : undefined,
			});
			return response.data.data;
		},
	});

export const bookmarkedForumQueryOptions = () =>
	queryOptions({
		queryKey: forumKeys.bookmarked(),
		queryFn: async () => {
			const response = await api.get<ForumListResponse>(FORUM_ENDPOINTS.GET_BOOKMARKED);
			return response.data.data;
		},
	});

// Query: Get all forums (list biasa)
export function useForumList(filters?: GetAllForumInput) {
	return useQuery(forumListQueryOptions(filters));
}

// Query: Get all forums with infinite scroll
export function useInfiniteForumList(filters?: GetAllForumInput) {
	return useInfiniteQuery({
		queryKey: [...forumKeys.lists(filters), "infinite"],
		queryFn: async ({ pageParam = 1 }) => {
			const response = await api.get<ForumListResponse>(FORUM_ENDPOINTS.GET_ALL, {
				params: { ...filters, page: pageParam, limit: filters?.limit || 10 },
			});
			return response.data;
		},
		initialPageParam: 1,
		getNextPageParam: (lastPage) => {
			if (lastPage.pagination?.hasNextPage) {
				return lastPage.pagination.currentPage + 1;
			}
			return undefined;
		},
	});
}

// ... (Hooks bySubject, Detail, Liked, Bookmarked tetap sama) ...
export function useForumsBySubject(subjectId: string) {
	return useQuery(forumsBySubjectQueryOptions(subjectId));
}

export function useForumDetail(forumId: string) {
	return useQuery(forumDetailQueryOptions(forumId));
}

export function useLikedForum(userId?: string) {
	return useQuery(likedForumQueryOptions(userId));
}

export function useBookmarkedForum() {
	return useQuery(bookmarkedForumQueryOptions());
}

// --- UPDATE PENTING: useSearchForum ---
// Sekarang menerima object params, bukan cuma string keyword
export function useSearchForum(params: GetAllForumInput) {
	return useQuery({
		queryKey: forumKeys.search(params),
		queryFn: async () => {
			// Menggunakan GET_ALL karena controller ini yang sudah dimodifikasi support search + filter
			const response = await api.get<ForumListResponse>(FORUM_ENDPOINTS.GET_ALL, {
				params: {
					search: params.q, // Backend pakai 'search', frontend pakai 'q', kita mapping di sini
					...params,
				},
			});
			return response.data.data;
		},
		// Query hanya jalan jika ada parameter q (search query)
		enabled: !!params.q && params.q.length > 0,
	});
}

// ... (Bagian Mutation Create, Edit, Delete, Like, Bookmark TETAP SAMA seperti file asli Anda) ...
export function useCreateForum() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (data: CreateForumInput) => {
			const formData = new FormData();
			formData.append("title", data.title);
			formData.append("id_subject", data.id_subject);
			if (data.description) formData.append("description", data.description);
			if (data.isAnonymous) formData.append("isAnonymous", String(data.isAnonymous));
			if (data.files) {
				data.files.forEach((file) => formData.append("files", file));
			}
			const response = await api.post<ForumResponse>(FORUM_ENDPOINTS.CREATE, formData, {
				headers: { "Content-Type": "multipart/form-data" },
			});
			return response.data.data;
		},
		onSuccess: (data) => {
			queryClient.invalidateQueries({ queryKey: forumKeys.lists() });
			if (data.id_subject) {
				queryClient.invalidateQueries({ queryKey: forumKeys.bySubject(data.id_subject) });
			}
		},
	});
}

export function useEditForum() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (data: EditForumInput) => {
			const formData = new FormData();
			formData.append("id_forum", data.id_forum);
			if (data.title) formData.append("title", data.title);
			if (data.description) formData.append("description", data.description);
			if (data.isAnonymous !== undefined) formData.append("isAnonymous", String(data.isAnonymous));
			if (data.files) {
				data.files.forEach((file: File) => formData.append("files", file));
			}
			const response = await api.patch<ForumResponse>(FORUM_ENDPOINTS.EDIT, formData, {
				headers: { "Content-Type": "multipart/form-data" },
			});
			return response.data.data;
		},
		onSuccess: (data) => {
			queryClient.invalidateQueries({ queryKey: forumKeys.detail(data.id_forum) });
			queryClient.invalidateQueries({ queryKey: ["forum", "list"] });
		},
	});
}

export function useDeleteForum() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (id_forum: string) => {
			const response = await api.delete(FORUM_ENDPOINTS.DELETE, { data: { id_forum } });
			return response.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: forumKeys.all });
		},
	});
}

export function useLikeForum() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (id_forum: string) => {
			const response = await api.post(FORUM_ENDPOINTS.LIKE, { id_forum });
			return response.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: forumKeys.all });
		},
	});
}

export function useUnlikeForum() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (id_forum: string) => {
			const response = await api.delete(FORUM_ENDPOINTS.LIKE, { data: { id_forum } });
			return response.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: forumKeys.all });
		},
	});
}

export function useBookmarkForum() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (id_forum: string) => {
			const response = await api.post(FORUM_ENDPOINTS.BOOKMARK, { id_forum });
			return response.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: forumKeys.all });
		},
	});
}

export function useUnbookmarkForum() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (id_forum: string) => {
			const response = await api.delete(FORUM_ENDPOINTS.BOOKMARK, { data: { id_forum } });
			return response.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: forumKeys.all });
		},
	});
}
