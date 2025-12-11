import { SendHorizonal } from 'lucide-react'
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from './ui/input-group'
import { useForm } from 'react-hook-form'
import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'
import { createUlasanSchema, type CreateUlasanInput } from '@/lib/schemas/ulasan.schema'
import { useCreateUlasan } from '@/lib/queries/ulasan'

type Props = {
    type?: "home" | 'forum'
    idForum?: string
}

const MainInputCreation = ({ type = "home", idForum }: Props) => {
    const placeholder = type === "home" 
        ? "Apa yang diulas hari ini?" 
        : "Apa yang ingin di diskusikan hari ini?"

    const createUlasan = useCreateUlasan()

    const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm<CreateUlasanInput>({
        resolver: standardSchemaResolver(createUlasanSchema),
        defaultValues: {
            judulUlasan: '',
            textUlasan: '',
            idForum: idForum,
        },
    })

    const onSubmit = async (data: CreateUlasanInput) => {
        try {
            await createUlasan.mutateAsync(data)
            reset()
        } catch (error) {
            console.error('Failed to create ulasan:', error)
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <InputGroup className='h-12'>
                <InputGroupInput 
                    className='h-16' 
                    placeholder={placeholder}
                    {...register('textUlasan')}
                />
                <InputGroupAddon align="inline-end">
                    <InputGroupButton 
                        size={'icon-sm'} 
                        variant="default"
                        type="submit"
                        disabled={isSubmitting || createUlasan.isPending}
                    >
                        <SendHorizonal className='h-4 w-4 text-white' />
                    </InputGroupButton>
                </InputGroupAddon>
            </InputGroup>
        </form>
    )
}

export default MainInputCreation
