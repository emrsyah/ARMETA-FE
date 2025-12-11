import { z } from 'zod'

// Token refresh response
export const refreshTokenResponseSchema = z.object({
  status: z.boolean(),
  message: z.string(),
  accessToken: z.string(),
})

export type RefreshTokenResponse = z.infer<typeof refreshTokenResponseSchema>

// Logout response
export const logoutResponseSchema = z.object({
  status: z.boolean(),
  message: z.string(),
})

export type LogoutResponse = z.infer<typeof logoutResponseSchema>

