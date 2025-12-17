import { useQuery, useMutation, useQueryClient, queryOptions } from '@tanstack/react-query'
import api from '../api/client'
import { FORUM_ENDPOINTS } from '../api/endpoints'
import type {
  ForumResponse,
  ForumListResponse,
  CreateForumInput,
} from '../schemas/forum.schema'

// Query Keys Factory
export const forumKeys = {
  all: ['forum'] as const,
  lists: () => [...forumKeys.all, 'list'] as const,
  bySubject: (subjectId: string) => [...forumKeys.all, 'subject', subjectId] as const,
  detail: (id: string) => [...forumKeys.all, 'detail', id] as const,
  search: (keyword: string) => [...forumKeys.all, 'search', keyword] as const,
  filtered: (from: string, to: string) => [...forumKeys.all, 'filtered', from, to] as const,
}

// Query Options (for use in route loaders)
export const allForumsQueryOptions = () =>
  queryOptions({
    queryKey: forumKeys.lists(),
    queryFn: async () => {
      const response = await api.get<ForumListResponse>(FORUM_ENDPOINTS.GET_ALL)
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
      const response = await api.get<ForumResponse>(FORUM_ENDPOINTS.GET_BY_ID, {
        params: { id_forum: forumId },
      })
      return response.data.data
    },
    enabled: !!forumId,
  })

// Query: Get all forums
export function useAllForums() {
  return useQuery(allForumsQueryOptions())
}

// Query: Get forums by subject
export function useForumsBySubject(subjectId: string) {
  return useQuery(forumsBySubjectQueryOptions(subjectId))
}

// Query: Get single forum by ID
export function useForumDetail(forumId: string) {
  return useQuery(forumDetailQueryOptions(forumId))
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

// Query: Filter forums by date range
export function useFilterForum(from: string, to: string) {
  return useQuery({
    queryKey: forumKeys.filtered(from, to),
    queryFn: async () => {
      const response = await api.get<ForumListResponse>(FORUM_ENDPOINTS.FILTER, {
        params: { from, to },
      })
      return response.data.data
    },
    enabled: !!from && !!to,
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
      queryClient.invalidateQueries({ queryKey: forumKeys.bySubject(data.id_subject) })
    },
  })
}
