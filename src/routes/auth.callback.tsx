import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'
import { Loader2 } from 'lucide-react'

// Define search params schema
type CallbackSearch = {
  accessToken?: string
  refreshToken?: string
  error?: string
}

export const Route = createFileRoute('/auth/callback')({
  validateSearch: (search: Record<string, unknown>): CallbackSearch => {
    return {
      accessToken: search.accessToken as string | undefined,
      refreshToken: search.refreshToken as string | undefined,
      error: search.error as string | undefined,
    }
  },
  component: AuthCallback,
})

function AuthCallback() {
  const navigate = useNavigate()
  const { error } = Route.useSearch()

  useEffect(() => {
    const handleCallback = async () => {
      // If there's an error from OAuth
      if (error) {
        console.error('OAuth error:', error)
        navigate({ to: '/', search: { error: 'auth_failed' } })
        return
      }

      // With HTTP-only cookies, the backend sets the cookies during redirect
      // We just need to redirect to the authenticated area
      // The cookies are automatically included in subsequent requests

      // Small delay to ensure cookies are set
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Redirect to home/dashboard
      navigate({ to: '/a/home' })
    }

    handleCallback()
  }, [error, navigate])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <Loader2 className="h-12 w-12 animate-spin text-primary" />
      <p className="text-lg font-medium text-muted-foreground">
        Sedang memproses login...
      </p>
    </div>
  )
}
