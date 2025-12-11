import { useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../api/client'
import { USER_ENDPOINTS, AUTH_ENDPOINTS } from '../api/endpoints'
import type { LogoutResponse } from '../schemas/auth.schema'

// Mutation: Logout
export function useLogout() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      const response = await api.post<LogoutResponse>(USER_ENDPOINTS.LOGOUT)
      return response.data
    },
    onSuccess: () => {
      // Clear all cached data on logout
      queryClient.clear()
    },
  })
}

// Helper: Redirect to Google login
export function redirectToGoogleLogin() {
  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001'
  window.location.href = `${baseUrl}${AUTH_ENDPOINTS.GOOGLE_LOGIN}`
}

