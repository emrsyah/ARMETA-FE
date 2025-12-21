import { useQuery, useMutation, useQueryClient, queryOptions, useInfiniteQuery } from '@tanstack/react-query'
import api from '../api/client'
import { FORUM_ENDPOINTS } from '../api/endpoints'
import type {
  ForumResponse,
  ForumDetailResponse,
  ForumListResponse,
  CreateForumInput,
  GetAllForumInput,
} from '../schemas/forum.schema'

// Query Keys Factory
export const forumKeys = {
  all: ['forum'] as const,
  lists: (filters?: GetAllForumInput) => [...forumKeys.all, 'list', filters] as const,
  bySubject: (subjectId: string) => [...forumKeys.all, 'subject', subjectId] as const,
  detail: (id: string) => [...forumKeys.all, 'detail', id] as const,
  search: (keyword: string) => [...forumKeys.all, 'search', keyword] as const,
  liked: (userId?: string) => [...forumKeys.all, 'liked', userId] as const,
  bookmarked: () => [...forumKeys.all, 'bookmarked'] as const,
}

// Query Options (for use in route loaders)
export const forumListQueryOptions = (filters?: GetAllForumInput) =>
  queryOptions({
    queryKey: forumKeys.lists(filters),
    queryFn: async () => {
      const response = await api.get<ForumListResponse>(FORUM_ENDPOINTS.GET_ALL, {
        params: filters,
      })
      return response.data.data
    },
  })

export const forumsBySubjectQueryOptions = (subjectId: string) =>
  queryOptions({
    queryKey: forumKeys.bySubject(subjectId),
    queryFn: async () => {
      const response = await api.get<ForumListResponse>(FORUM_ENDPOINTS.GET_BY_SUBJECT, {
        params: { id_subject: subjectId },
      })
      return response.data.data
    },
    enabled: !!subjectId,
  })

export const forumDetailQueryOptions = (forumId: string) =>
  queryOptions({
    queryKey: forumKeys.detail(forumId),
    queryFn: async () => {
      const response = await api.get<ForumDetailResponse>(FORUM_ENDPOINTS.GET_BY_ID, {
        params: { id_forum: forumId },
      })
      return response.data.data
    },
    enabled: !!forumId,
  })

export const likedForumQueryOptions = (userId?: string) =>
  queryOptions({
    queryKey: forumKeys.liked(userId),
    queryFn: async () => {
      const response = await api.get<ForumListResponse>(FORUM_ENDPOINTS.GET_LIKED, {
        params: userId ? { id_user: userId } : undefined,
      })
      return response.data.data
    },
  })

export const bookmarkedForumQueryOptions = () =>
  queryOptions({
    queryKey: forumKeys.bookmarked(),
    queryFn: async () => {
      const response = await api.get<ForumListResponse>(FORUM_ENDPOINTS.GET_BOOKMARKED)
      return response.data.data
    },
  })

// Query: Get all forums (with optional filters/sorting)
export function useForumList(filters?: GetAllForumInput) {
  return useQuery(forumListQueryOptions(filters))
}

// Query: Get all forums with infinite scroll
export function useInfiniteForumList(filters?: GetAllForumInput) {
  return useInfiniteQuery({
    queryKey: [...forumKeys.lists(filters), 'infinite'],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await api.get<ForumListResponse>(FORUM_ENDPOINTS.GET_ALL, {
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

// Query: Get forums by subject
export function useForumsBySubject(subjectId: string) {
  return useQuery(forumsBySubjectQueryOptions(subjectId))
}

// Query: Get single forum by ID
export function useForumDetail(forumId: string) {
  return useQuery(forumDetailQueryOptions(forumId))
}

// Query: Get liked forums
export function useLikedForum(userId?: string) {
  return useQuery(likedForumQueryOptions(userId))
}

// Query: Get bookmarked forums
export function useBookmarkedForum() {
  return useQuery(bookmarkedForumQueryOptions())
}

// Query: Search forums by keyword
export function useSearchForum(keyword: string) {
  return useQuery({
    queryKey: forumKeys.search(keyword),
    queryFn: async () => {
      const response = await api.get<ForumListResponse>(FORUM_ENDPOINTS.SEARCH, {
        params: { q: keyword },
      })
      return response.data.data
    },
    enabled: keyword.length > 0,
  })
}



// Mutation: Create forum
export function useCreateForum() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: CreateForumInput) => {
      const formData = new FormData()
      formData.append('title', data.title)
      formData.append('id_subject', data.id_subject)
      if (data.description) formData.append('description', data.description)
      if (data.isAnonymous) formData.append('isAnonymous', String(data.isAnonymous))
      if (data.files) {
        data.files.forEach((file) => formData.append('files', file))
      }

      const response = await api.post<ForumResponse>(FORUM_ENDPOINTS.CREATE, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      return response.data.data
    },
    onSuccess: (data) => {
      // Invalidate forum lists
      queryClient.invalidateQueries({ queryKey: forumKeys.lists() })
      if (data.id_subject) {
        queryClient.invalidateQueries({ queryKey: forumKeys.bySubject(data.id_subject) })
      }
    },
  })
}

// Mutation: Like forum
export function useLikeForum() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id_forum: string) => {
      const response = await api.post(FORUM_ENDPOINTS.LIKE, { id_forum })
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: forumKeys.all })
    },
  })
}

// Mutation: Unlike forum
export function useUnlikeForum() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id_forum: string) => {
      const response = await api.delete(FORUM_ENDPOINTS.LIKE, { data: { id_forum } })
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: forumKeys.all })
    },
  })
}

// Mutation: Bookmark forum
export function useBookmarkForum() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id_forum: string) => {
      const response = await api.post(FORUM_ENDPOINTS.BOOKMARK, { id_forum })
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: forumKeys.all })
    },
  })
}

// Mutation: Unbookmark forum
export function useUnbookmarkForum() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id_forum: string) => {
      const response = await api.delete(FORUM_ENDPOINTS.BOOKMARK, { data: { id_forum } })
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: forumKeys.all })
    },
  })
}

