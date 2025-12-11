import { useQuery, useMutation, useQueryClient, queryOptions } from '@tanstack/react-query'
import api from '../api/client'
import { USER_ENDPOINTS } from '../api/endpoints'
import type { UserResponse, UpdateProfileInput } from '../schemas/user.schema'

// Query Keys Factory
export const userKeys = {
  all: ['user'] as const,
  profile: () => [...userKeys.all, 'profile'] as const,
}

// Query Options (for use in route loaders)
export const profileQueryOptions = () =>
  queryOptions({
    queryKey: userKeys.profile(),
    queryFn: async () => {
      const response = await api.get<UserResponse>(USER_ENDPOINTS.PROFILE)
      return response.data.data
    },
  })

// Query: Get current user profile
export function useProfile() {
  return useQuery(profileQueryOptions())
}

// Mutation: Update profile
export function useUpdateProfile() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: UpdateProfileInput) => {
      const formData = new FormData()

      if (data.name) {
        formData.append('name', data.name)
      }
      if (data.image) {
        formData.append('image', data.image)
      }

      const response = await api.patch<UserResponse>(USER_ENDPOINTS.CHANGE_PROFILE, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      return response.data.data
    },
    onSuccess: (data) => {
      // Update profile in cache
      queryClient.setQueryData(userKeys.profile(), data)
    },
  })
}

