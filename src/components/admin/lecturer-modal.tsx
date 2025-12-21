import { useForm } from "react-hook-form"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../ui/dialog"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema"
import { createLecturerSchema, type CreateLecturerInput, type Lecturer, facultyEnum } from "@/lib/schemas/lecturer-subject.schema"
import { useCreateLecturer, useUpdateLecturer } from "@/lib/queries/lecturer-subject"
import { useEffect } from "react"
import { toast } from "sonner"

type Props = {
    open: boolean
    onOpenChange: (open: boolean) => void
    editData?: Lecturer | null
}

export function LecturerModal({ open, onOpenChange, editData }: Props) {
    const createMutation = useCreateLecturer()
    const updateMutation = useUpdateLecturer()

    const form = useForm<CreateLecturerInput>({
        resolver: standardSchemaResolver(createLecturerSchema),
        defaultValues: {
            name: "",
            npm: "",
            email: "",
            faculty: "FIF",
        },
    })

    useEffect(() => {
        if (open) {
            if (editData) {
                form.reset({
                    name: editData.name,
                    npm: editData.npm || "",
                    email: editData.email || "",
                    faculty: editData.faculty,
                })
            } else {
                form.reset({
                    name: "",
                    npm: "",
                    email: "",
                    faculty: "FIF",
                })
            }
        }
    }, [open, editData, form])

    const onSubmit = async (data: CreateLecturerInput) => {
        try {
            if (editData) {
                await updateMutation.mutateAsync({ id: editData.id_lecturer, data })
                toast.success("Data dosen berhasil diperbarui")
            } else {
                await createMutation.mutateAsync(data)
                toast.success("Dosen baru berhasil ditambahkan")
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
                    <DialogTitle>{editData ? "Edit Dosen" : "Tambah Dosen"}</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nama Lengkap</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder="Contoh: Dr. Ir. John Doe, M.T." />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="npm"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>NPM / Kode Dosen</FormLabel>
                                        <FormControl>
                                            <Input {...field} placeholder="12345678" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="faculty"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Fakultas</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Pilih Fakultas" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {facultyEnum.options.map((option) => (
                                                    <SelectItem key={option} value={option}>
                                                        {option}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email (Opsional)</FormLabel>
                                    <FormControl>
                                        <Input {...field} type="email" placeholder="john.doe@telkomuniversity.ac.id" />
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
                                {editData ? "Simpan Perubahan" : "Tambah Dosen"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
