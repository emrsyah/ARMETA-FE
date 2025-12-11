import { createFileRoute } from '@tanstack/react-router'
import { SendHorizonal } from 'lucide-react'
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from '@/components/ui/input-group'

export const Route = createFileRoute('/(app)/a/arme')({
  component: ArmePage,
})

function ArmePage() {


  return (
    <div className="flex flex-col justify-center items-center h-screen space-y-4 pb-20">
      <div>
        <h1 className="text-2xl font-semibold text-black">Apa yang bisa ARME bantu, "nama user"?</h1>
      </div>
      <InputGroup className='h-12'>
        <InputGroupInput className='h-16 rounded-3xl' placeholder="Tanya ARME..." />
        <InputGroupAddon align="inline-end">
          <InputGroupButton size={'icon-sm'} variant="default">
            <SendHorizonal className='h-4 w-4 text-white' />
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </div>
  )
}