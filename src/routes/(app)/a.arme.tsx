import { createFileRoute } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { SendHorizonal } from 'lucide-react'

export const Route = createFileRoute('/(app)/a/arme')({
  component: ArmePage,
})

function ArmePage() {


  return (
    <div className="flex flex-col justify-center items-center h-screen space-y-4 pb-20">
      <div>
        <h1 className="text-2xl font-semibold text-black">Apa yang bisa ARME bantu, "nama user"?</h1>
      </div>
      <div className="relative w-full max-w-4xl">
        <Input 
          className="pr-20 rounded-2xl border-blue-400"
          placeholder="Tanya ARME..."
        />

        <button 
          className="absolute right-2 top-1/2 -translate-y-1/2 
                    bg-blue-600 p-1.5 rounded-lg flex items-center justify-center"
        >
          <SendHorizonal className="h-4 w-4 text-white" />
        </button>
      </div>
    </div>
  )
}