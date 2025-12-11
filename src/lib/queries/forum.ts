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
}

// Query Options (for use in route loaders)
export const forumsBySubjectQueryOptions = (subjectId: string) =>
  queryOptions({
    queryKey: forumKeys.bySubject(subjectId),
    queryFn: async () => {
      const response = await api.get<ForumListResponse>(FORUM_ENDPOINTS.GET_BY_SUBJECT, {
        data: { id_subject: subjectId },
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

// Query: Get forums by subject
export function useForumsBySubject(subjectId: string) {
  return useQuery(forumsBySubjectQueryOptions(subjectId))
}

// Query: Get single forum by ID
export function useForumDetail(forumId: string) {
  return useQuery(forumDetailQueryOptions(forumId))
}

// Mutation: Create forum
export function useCreateForum() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: CreateForumInput) => {
      const response = await api.post<ForumResponse>(FORUM_ENDPOINTS.CREATE, data)
      return response.data.data
    },
    onSuccess: (data) => {
      // Invalidate forum list for the subject
      queryClient.invalidateQueries({ queryKey: forumKeys.bySubject(data.id_subject) })
    },
  })
}

