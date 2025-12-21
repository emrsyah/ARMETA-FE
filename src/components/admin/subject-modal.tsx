import { useForm } from "react-hook-form"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../ui/dialog"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema"
import { createSubjectSchema, type CreateSubjectInput, type Subject } from "@/lib/schemas/lecturer-subject.schema"
import { useCreateSubject, useUpdateSubject } from "@/lib/queries/lecturer-subject"
import { useEffect } from "react"
import { toast } from "sonner"

type Props = {
    open: boolean
    onOpenChange: (open: boolean) => void
    editData?: Subject | null
}

export function SubjectModal({ open, onOpenChange, editData }: Props) {
    const createMutation = useCreateSubject()
    const updateMutation = useUpdateSubject()

    const form = useForm<CreateSubjectInput>({
        resolver: standardSchemaResolver(createSubjectSchema),
        defaultValues: {
            code: "",
            name: "",
            semester: 1,
        },
    })

    useEffect(() => {
        if (open) {
            if (editData) {
                form.reset({
                    code: editData.code,
                    name: editData.name,
                    semester: Number(editData.semester),
                })
            } else {
                form.reset({
                    code: "",
                    name: "",
                    semester: 1,
                })
            }
        }
    }, [open, editData, form])

    const onSubmit = async (data: CreateSubjectInput) => {
        try {
            if (editData) {
                await updateMutation.mutateAsync({ id: editData.id_subject, data })
                toast.success("Mata kuliah berhasil diperbarui")
            } else {
                await createMutation.mutateAsync(data)
                toast.success("Mata kuliah baru berhasil ditambahkan")
            }
            onOpenChange(false)
        } catch (error) {
            toast.error("Terjadi kesalahan saat menyimpan data")
        }
    }

    const isPending = createMutation.isPending || updateMutation.isPending

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{editData ? "Edit Mata Kuliah" : "Tambah Mata Kuliah"}</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <div className="grid grid-cols-3 gap-4">
                            <FormField
                                control={form.control}
                                name="code"
                                render={({ field }) => (
                                    <FormItem className="col-span-1">
                                        <FormLabel>Kode MK</FormLabel>
                                        <FormControl>
                                            <Input {...field} placeholder="CSH4A3" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem className="col-span-2">
                                        <FormLabel>Nama Mata Kuliah</FormLabel>
                                        <FormControl>
                                            <Input {...field} placeholder="Contoh: Algoritma & Struktur Data" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <FormField
                            control={form.control}
                            name="semester"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Semester</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            type="number"
                                            min={1}
                                            max={8}
                                            onChange={(e) => field.onChange(Number(e.target.value))}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <DialogFooter className="pt-4">
                            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
                                Batal
                            </Button>
                            <Button type="submit" loading={isPending}>
                                {editData ? "Simpan Perubahan" : "Tambah Matkul"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
