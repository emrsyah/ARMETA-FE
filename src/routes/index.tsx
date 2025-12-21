import { Button } from '@/components/ui/button'
import { createFileRoute, redirect, isRedirect } from '@tanstack/react-router'
import { Image } from '@unpic/react'
import { redirectToGoogleLogin } from '@/lib/queries/auth'
import { AlertCircle } from 'lucide-react'
import hero from '~/images/armeta-hero.webp'
import googleIcon from '~/images/google.png'
import { profileQueryOptions } from '@/lib/queries/user'

type LoginSearch = {
  error?: string
}

export const Route = createFileRoute('/')({
  beforeLoad: async ({ context }) => {
    try {
      const user = await context.queryClient.ensureQueryData(profileQueryOptions())
      if (user) {
        throw redirect({
          to: '/a/home',
        })
      }
    } catch (error) {
      if (isRedirect(error)) {
        throw error
      }
      // If error (not a redirect), user is not logged in, stay on landing page
    }
  },
  validateSearch: (search: Record<string, unknown>): LoginSearch => {
    return {
      error: search.error as string | undefined,
    }
  },
  component: App,
})

function App() {
  const { error } = Route.useSearch()

  const handleGoogleLogin = () => {
    redirectToGoogleLogin()
  }

  return (
    <div className='max-w-7xl mx-auto px-4 lg:px-2 min-h-screen flex items-center justify-center'>
      <div className='flex flex-col-reverse lg:flex-row items-center gap-8 lg:gap-3'>
        <Image src={hero} alt='hero' width={640} height={640} className='w-full max-w-[320px] lg:max-w-[640px] h-auto' />
        <div className='flex flex-col gap-3 items-center justify-center'>
          <h1 className='text-4xl lg:text-6xl text-center font-bold'>Selamat Datang di <span className='text-primary'>A</span>RMETA</h1>
          <p className='text-base lg:text-lg mt-3 font-medium text-center'>Silahkan login untuk melanjutkan.</p>

          {error && (
            <div className='mt-4 flex items-center gap-2 text-destructive bg-destructive/10 px-4 py-2 rounded-lg'>
              <AlertCircle className='h-5 w-5' />
              <span className='text-sm font-medium'>
                {error === 'auth_failed'
                  ? 'Login gagal. Silahkan coba lagi.'
                  : 'Terjadi kesalahan. Silahkan coba lagi.'}
              </span>
            </div>
          )}

          <Button
            className='mt-6'
            size={'lg'}
            variant={'outline'}
            onClick={handleGoogleLogin}
          >
            <Image src={googleIcon} alt='google' width={20} height={20} />
            Lanjutkan dengan Google
          </Button>
        </div>
      </div>
    </div>
  )
}
