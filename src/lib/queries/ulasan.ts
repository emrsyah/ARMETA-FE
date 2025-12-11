import { useQuery, useMutation, useQueryClient, queryOptions } from '@tanstack/react-query'
import api from '../api/client'
import { ULASAN_ENDPOINTS } from '../api/endpoints'
import type {
  UlasanResponse,
  UlasanListResponse,
  SearchResponse,
  CreateUlasanInput,
  EditUlasanInput,
  SearchUlasanInput,
  UlasanIdInput,
  Like,
  Bookmark,
} from '../schemas/ulasan.schema'
import type { ApiResponse } from '../api/types'

// Query Keys Factory
export const ulasanKeys = {
  all: ['ulasan'] as const,
  lists: () => [...ulasanKeys.all, 'list'] as const,
  detail: (id: string) => [...ulasanKeys.all, 'detail', id] as const,
  search: (query: string) => [...ulasanKeys.all, 'search', query] as const,
  liked: () => [...ulasanKeys.all, 'liked'] as const,
  bookmarked: () => [...ulasanKeys.all, 'bookmarked'] as const,
}

// Query Options (for use in route loaders)
export const ulasanListQueryOptions = () =>
  queryOptions({
    queryKey: ulasanKeys.lists(),
    queryFn: async () => {
      const response = await api.get<UlasanListResponse>(ULASAN_ENDPOINTS.GET_ALL)
      return response.data.data
    },
  })

export const likedUlasanQueryOptions = () =>
  queryOptions({
    queryKey: ulasanKeys.liked(),
    queryFn: async () => {
      const response = await api.get<UlasanListResponse>(ULASAN_ENDPOINTS.GET_LIKED)
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

// Query: Get all ulasan
export function useUlasanList() {
  return useQuery(ulasanListQueryOptions())
}

// Query: Get liked ulasan
export function useLikedUlasan() {
  return useQuery(likedUlasanQueryOptions())
}

// Query: Get bookmarked ulasan
export function useBookmarkedUlasan() {
  return useQuery(bookmarkedUlasanQueryOptions())
}

// Mutation: Create ulasan
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

      if (data.files) {
        data.files.forEach((file) => {
          formData.append('files', file)
        })
      }

      const response = await api.post<UlasanResponse>(ULASAN_ENDPOINTS.CREATE, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      return response.data.data
    },
    onSuccess: () => {
      // Invalidate ulasan list to refetch
      queryClient.invalidateQueries({ queryKey: ulasanKeys.lists() })
    },
  })
}

// Mutation: Edit ulasan
export function useEditUlasan() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: EditUlasanInput) => {
      const formData = new FormData()

      formData.append('id_review', data.id_review)
      if (data.title) formData.append('title', data.title)
      if (data.body) formData.append('body', data.body)

      if (data.files) {
        data.files.forEach((file) => {
          formData.append('files', file)
        })
      }

      const response = await api.patch<UlasanResponse>(ULASAN_ENDPOINTS.EDIT, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      return response.data.data
    },
    onSuccess: (data) => {
      // Update the specific ulasan in cache
      queryClient.setQueryData(ulasanKeys.detail(data.id_review), data)
      // Invalidate lists to refetch
      queryClient.invalidateQueries({ queryKey: ulasanKeys.lists() })
    },
  })
}

// Mutation: Search ulasan
export function useSearchUlasan() {
  return useMutation({
    mutationFn: async (data: SearchUlasanInput) => {
      const response = await api.post<SearchResponse>(ULASAN_ENDPOINTS.SEARCH, data)
      return response.data.data
    },
  })
}

// Mutation: Like ulasan
export function useLikeUlasan() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: UlasanIdInput) => {
      const response = await api.post<ApiResponse<Like>>(ULASAN_ENDPOINTS.LIKE, data)
      return response.data.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ulasanKeys.liked() })
      queryClient.invalidateQueries({ queryKey: ulasanKeys.lists() })
    },
  })
}

// Mutation: Unlike ulasan
export function useUnlikeUlasan() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: UlasanIdInput) => {
      const response = await api.delete<ApiResponse<Like>>(ULASAN_ENDPOINTS.LIKE, { data })
      return response.data.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ulasanKeys.liked() })
      queryClient.invalidateQueries({ queryKey: ulasanKeys.lists() })
    },
  })
}

// Mutation: Bookmark ulasan
export function useBookmarkUlasan() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: UlasanIdInput) => {
      const response = await api.post<ApiResponse<Bookmark>>(ULASAN_ENDPOINTS.BOOKMARK, data)
      return response.data.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ulasanKeys.bookmarked() })
    },
  })
}

// Mutation: Remove bookmark
export function useRemoveBookmark() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: UlasanIdInput) => {
      const response = await api.delete<ApiResponse<Bookmark>>(ULASAN_ENDPOINTS.BOOKMARK, { data })
      return response.data.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ulasanKeys.bookmarked() })
    },
  })
}

