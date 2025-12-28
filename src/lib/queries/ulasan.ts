import { useQuery, useMutation, useQueryClient, queryOptions, useInfiniteQuery } from '@tanstack/react-query'
import api from '../api/client'
import { ULASAN_ENDPOINTS } from '../api/endpoints'
import type {
  UlasanResponse,
  UlasanListResponse,
  SearchResponse,
  CreateUlasanInput,
  EditUlasanInput,
  SearchVectorUlasanInput,
  UlasanIdInput,
  GetAllUlasanInput as BaseGetAllUlasanInput, // Alias
  Like,
  Bookmark,
} from '../schemas/ulasan.schema'
import type { ApiResponse } from '../api/types'

// --- TAMBAHAN: Type Extension untuk Ulasan ---
// Memperluas tipe input agar mendukung search 'q'
export interface GetAllUlasanInput extends BaseGetAllUlasanInput {
  q?: string;
}
// ----------------------------------------------

export const ulasanKeys = {
  all: ['ulasan'] as const,
  lists: (filters?: GetAllUlasanInput) => [...ulasanKeys.all, 'list', filters] as const,
  detail: (id: string) => [...ulasanKeys.all, 'detail', id] as const,
  // Update key search agar unik berdasarkan params object
  searchText: (params: GetAllUlasanInput) => [...ulasanKeys.all, 'search-text', params] as const,
  // (Search Vector mungkin tidak dipakai lagi, tapi biarkan saja jika ada)
  searchVector: (query: string) => [...ulasanKeys.all, 'search-vector', query] as const,
  liked: (userId?: string) => [...ulasanKeys.all, 'liked', userId] as const,
  bookmarked: () => [...ulasanKeys.all, 'bookmarked'] as const,
}

// ... (Query Options List, Liked, Bookmarked, Detail tetap sama) ...
export const ulasanListQueryOptions = (filters?: GetAllUlasanInput) =>
  queryOptions({
    queryKey: ulasanKeys.lists(filters),
    queryFn: async () => {
      const response = await api.get<UlasanListResponse>(ULASAN_ENDPOINTS.GET_ALL, {
        params: filters,
      })
      return response.data.data
    },
  })

export const likedUlasanQueryOptions = (userId?: string) =>
  queryOptions({
    queryKey: ulasanKeys.liked(userId),
    queryFn: async () => {
      const response = await api.get<UlasanListResponse>(ULASAN_ENDPOINTS.GET_LIKED, {
        params: userId ? { id_user: userId } : undefined,
      })
      return response.data.data
    },
  })

export const bookmarkedUlasanQueryOptions = () =>
  queryOptions({
    queryKey: ulasanKeys.bookmarked(),
    queryFn: async () => {
      const response = await api.get<UlasanListResponse>(ULASAN_ENDPOINTS.GET_BOOKMARKED)
      return response.data.data
    },
  })

export const ulasanDetailQueryOptions = (ulasanId: string) =>
  queryOptions({
    queryKey: ulasanKeys.detail(ulasanId),
    queryFn: async () => {
      const response = await api.get<UlasanResponse>(ULASAN_ENDPOINTS.GET_BY_ID, {
        params: { id_review: ulasanId },
      })
      return response.data.data
    },
    enabled: !!ulasanId,
  })

// Query: Get all ulasan (list biasa)
export function useUlasanList(filters?: GetAllUlasanInput) {
  return useQuery(ulasanListQueryOptions(filters))
}

// Query: Get all ulasan with infinite scroll
export function useInfiniteUlasanList(filters?: GetAllUlasanInput) {
  return useInfiniteQuery({
    queryKey: [...ulasanKeys.lists(filters), 'infinite'],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await api.get<UlasanListResponse>(ULASAN_ENDPOINTS.GET_ALL, {
        params: { ...filters, page: pageParam, limit: filters?.limit || 10 },
      })
      return response.data
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.pagination && lastPage.pagination.hasNextPage) {
        return lastPage.pagination.currentPage + 1
      }
      return undefined
    },
  })
}

// ... (Hooks Liked, Bookmarked, Detail tetap sama) ...
export function useLikedUlasan(userId?: string) {
  return useQuery(likedUlasanQueryOptions(userId))
}

export function useBookmarkedUlasan() {
  return useQuery(bookmarkedUlasanQueryOptions())
}

export function useUlasanDetail(ulasanId: string) {
  return useQuery(ulasanDetailQueryOptions(ulasanId))
}

// --- UPDATE PENTING: useSearchTextUlasan ---
// Sekarang menerima object params, bukan cuma string keyword
export function useSearchTextUlasan(params: GetAllUlasanInput) {
  return useQuery({
    queryKey: ulasanKeys.searchText(params),
    queryFn: async () => {
      // Menggunakan GET_ALL karena controller ini mendukung q + filter + sorting
      const response = await api.get<UlasanListResponse>(ULASAN_ENDPOINTS.GET_ALL, {
        params: {
            q: params.q, // Backend Ulasan pakai 'q'
            ...params
        },
      })
      return response.data.data
    },
    enabled: !!params.q && params.q.length > 0,
  })
}


// ... (Bagian Mutation Create, Edit, Delete, dll TETAP SAMA seperti file asli Anda) ...
export function useCreateUlasan() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: CreateUlasanInput) => {
      const formData = new FormData()
      formData.append('judulUlasan', data.judulUlasan)
      formData.append('textUlasan', data.textUlasan)
      if (data.idMatkul) formData.append('idMatkul', data.idMatkul)
      if (data.idDosen) formData.append('idDosen', data.idDosen)
      if (data.idReply) formData.append('idReply', data.idReply)
      if (data.idForum) formData.append('idForum', data.idForum)
      if (data.isAnonymous) formData.append('isAnonymous', String(data.isAnonymous))
      if (data.files) {
        data.files.forEach((file) => {
          formData.append('files', file)
        })
      }
      const response = await api.post<UlasanResponse>(ULASAN_ENDPOINTS.CREATE, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      return response.data.data
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['ulasan', 'list'] })
      if (variables.idReply) {
        queryClient.invalidateQueries({ queryKey: ulasanKeys.detail(variables.idReply) })
      }
      if (variables.idForum) {
        queryClient.invalidateQueries({ queryKey: ['forum', 'detail', variables.idForum] })
      }
    },
  })
}

export function useEditUlasan() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: EditUlasanInput) => {
      const formData = new FormData()
      formData.append('id_review', data.id_review)
      if (data.title) formData.append('title', data.title)
      if (data.body) formData.append('body', data.body)
      if (data.isAnonymous !== undefined) formData.append('isAnonymous', String(data.isAnonymous))
      if (data.files) {
        data.files.forEach((file: File) => {
          formData.append('files', file)
        })
      }
      const response = await api.patch<UlasanResponse>(ULASAN_ENDPOINTS.EDIT, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      return response.data.data
    },
    onSuccess: (data) => {
      queryClient.setQueryData(ulasanKeys.detail(data.id_review), data)
      queryClient.invalidateQueries({ queryKey: ['ulasan', 'list'] })
    },
  })
}

export function useDeleteUlasan() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id_review }: { id_review: string; forumId?: string; idReply?: string }) => {
      const response = await api.delete(ULASAN_ENDPOINTS.DELETE, { data: { id_review } })
      return response.data
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['ulasan', 'list'] })
      if (variables.idReply) {
        queryClient.invalidateQueries({ queryKey: ulasanKeys.detail(variables.idReply) })
      }
      if (variables.forumId) {
        queryClient.invalidateQueries({ queryKey: ['forum', 'detail', variables.forumId] })
      }
      queryClient.invalidateQueries({ queryKey: ulasanKeys.detail(variables.id_review) })
    },
  })
}

export function useLikeUlasan() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: UlasanIdInput) => {
      const response = await api.post<ApiResponse<Like>>(ULASAN_ENDPOINTS.LIKE, data)
      return response.data.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ulasanKeys.all })
    },
  })
}

export function useUnlikeUlasan() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: UlasanIdInput) => {
      const response = await api.delete<ApiResponse<Like>>(ULASAN_ENDPOINTS.LIKE, { data })
      return response.data.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ulasanKeys.all })
    },
  })
}

export function useBookmarkUlasan() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: UlasanIdInput) => {
      const response = await api.post<ApiResponse<Bookmark>>(ULASAN_ENDPOINTS.BOOKMARK, data)
      return response.data.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ulasanKeys.all })
    },
  })
}

export function useRemoveBookmark() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: UlasanIdInput) => {
      const response = await api.delete<ApiResponse<Bookmark>>(ULASAN_ENDPOINTS.BOOKMARK, { data })
      return response.data.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ulasanKeys.all })
    },
  })
}