// import { Button } from '@/components/ui/button'
import { Button } from '@/components/ui/button'
import { createFileRoute } from '@tanstack/react-router'
import { Image } from '@unpic/react'
import hero from '~/images/armeta-hero.webp'
import googleIcon from '~/images/google.png'
export const Route = createFileRoute('/')({ component: App })

function App() {

  return (
    <div className='max-w-7xl mx-auto px-4 lg:px-2 min-h-screen flex items-center justify-center'>
      <div className='flex flex-col-reverse lg:flex-row items-center gap-8 lg:gap-3'>
        <Image src={hero} alt='hero' width={640} height={640} className='w-full max-w-[320px] lg:max-w-[640px] h-auto' />
        <div className='flex flex-col gap-3 items-center justify-center'>
          <h1 className='text-4xl lg:text-6xl text-center font-bold'>Selamat Datang di <span className='text-primary'>A</span>RMETA</h1>
          <p className='text-base lg:text-lg mt-3 font-medium text-center'>Silahkan login untuk melanjutkan.</p>
          <Button className='mt-6' size={'lg'} variant={'outline'}>
            <Image src={googleIcon} alt='google' width={20} height={20} />
            Lanjutkan dengan Google
          </Button>
        </div>
      </div>
    </div>
  )
}
