import { SendHorizonal } from 'lucide-react'
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from './ui/input-group'

type Props = {
    type?: "home" | 'forum'
}

const MainInputCreation = ({ type = "home" }: Props) => {
    const placeholder = type === "home" ? "Apa yang diulas hari ini?" : "Apa yang ingin di diskusikan hari ini?"
    return (
            <InputGroup className='h-12'>
                <InputGroupInput className='h-16' placeholder={placeholder} />
                <InputGroupAddon align="inline-end">
                    <InputGroupButton size={'icon-sm'} variant="default">
                    <SendHorizonal className='h-4 w-4 text-white' />
                    </InputGroupButton>
                </InputGroupAddon>
            </InputGroup>

    )
}

export default MainInputCreation