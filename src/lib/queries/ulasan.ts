import { useQuery, useMutation, useQueryClient, queryOptions } from '@tanstack/react-query'
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
  GetAllUlasanInput,
  Like,
  Bookmark,
} from '../schemas/ulasan.schema'
import type { ApiResponse } from '../api/types'

export const ulasanKeys = {
  all: ['ulasan'] as const,
  lists: (filters?: GetAllUlasanInput) => [...ulasanKeys.all, 'list', filters] as const,
  detail: (id: string) => [...ulasanKeys.all, 'detail', id] as const,
  searchVector: (query: string) => [...ulasanKeys.all, 'search-vector', query] as const,
  searchText: (query: string) => [...ulasanKeys.all, 'search-text', query] as const,
  liked: () => [...ulasanKeys.all, 'liked'] as const,
  bookmarked: () => [...ulasanKeys.all, 'bookmarked'] as const,
}

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

// Query: Get all ulasan (with optional filters/sorting)
export function useUlasanList(filters?: GetAllUlasanInput) {
  return useQuery(ulasanListQueryOptions(filters))
}

// Query: Get liked ulasan
export function useLikedUlasan() {
  return useQuery(likedUlasanQueryOptions())
}

// Query: Get bookmarked ulasan
export function useBookmarkedUlasan() {
  return useQuery(bookmarkedUlasanQueryOptions())
}

// Query: Get single ulasan by ID
export function useUlasanDetail(ulasanId: string) {
  return useQuery(ulasanDetailQueryOptions(ulasanId))
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
    onSuccess: (_, variables) => {
      // Invalidate ulasan list to refetch
      // Note: We invalidate all lists regardless of filters
      queryClient.invalidateQueries({ queryKey: ['ulasan', 'list'] })

      // If this was a reply, invalidate the parent ulasan detail to fetch the new reply
      if (variables.idReply) {
        queryClient.invalidateQueries({ queryKey: ulasanKeys.detail(variables.idReply) })
      }

      // If this was a forum reply, invalidate the forum detail to fetch the new reply
      if (variables.idForum) {
        queryClient.invalidateQueries({ queryKey: ['forum', 'detail', variables.idForum] })
      }
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
      queryClient.invalidateQueries({ queryKey: ['ulasan', 'list'] })
    },
  })
}

// Mutation: Vector search ulasan (semantic similarity)
export function useSearchVectorUlasan() {
  return useMutation({
    mutationFn: async (data: SearchVectorUlasanInput) => {
      const response = await api.post<SearchResponse>(ULASAN_ENDPOINTS.SEARCH_VECTOR, data)
      return response.data.data
    },
  })
}

// Query: Text search ulasan by keyword
export function useSearchTextUlasan(keyword: string) {
  return useQuery({
    queryKey: ulasanKeys.searchText(keyword),
    queryFn: async () => {
      const response = await api.get<UlasanListResponse>(ULASAN_ENDPOINTS.SEARCH_TEXT, {
        params: { q: keyword },
      })
      return response.data.data
    },
    enabled: keyword.length > 0,
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
      queryClient.invalidateQueries({ queryKey: ulasanKeys.all })
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
      queryClient.invalidateQueries({ queryKey: ulasanKeys.all })
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
      queryClient.invalidateQueries({ queryKey: ulasanKeys.all })
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
      queryClient.invalidateQueries({ queryKey: ulasanKeys.all })
    },
  })
}

