import { SendHorizonal } from 'lucide-react'
import { Input } from './ui/input'
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from './ui/input-group'

type Props = {
    type?: "home" | 'forum'
}

const MainInputCreation = ({ type = "home" }: Props) => {
    const placeholder = type === "home" ? "Apa yang diulas hari ini?" : "Apa yang ingin di diskusikan hari ini?"
    return (
        <div>
            <InputGroup>
                <InputGroupInput className='h-16' placeholder={placeholder} />
                <InputGroupAddon align="inline-end">
                    <InputGroupButton variant="default">
                    Tulis
                    <SendHorizonal className='h-4 w-4 text-white' />
                    </InputGroupButton>
                </InputGroupAddon>
            </InputGroup>
        </div>

    )
}

export default MainInputCreation