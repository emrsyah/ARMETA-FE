import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { createReportSchema, reportTypeEnum, type CreateReportInput } from "@/lib/schemas/report.schema"
import { useCreateReport } from "@/lib/queries/report"

interface ReportDialogProps {
    isOpen: boolean
    onClose: () => void
    reviewId?: string
    lecturerId?: string
    forumId?: string
    title?: string
}

export function ReportDialog({
    isOpen,
    onClose,
    reviewId,
    lecturerId,
    forumId,
    title = "Report Content",
}: ReportDialogProps) {
    const createReport = useCreateReport()

    const form = useForm<CreateReportInput>({
        resolver: zodResolver(createReportSchema as any),
        defaultValues: {
            id_review: reviewId,
            id_lecturer: lecturerId,
            id_forum: forumId,
            type: undefined,
            body: "",
        },
    })

    // Update default values when props change
    useEffect(() => {
        if (isOpen) {
            form.reset({
                id_review: reviewId,
                id_lecturer: lecturerId,
                id_forum: forumId,
                type: undefined,
                body: "",
            })
        }
    }, [isOpen, reviewId, lecturerId, forumId, form])

    const onSubmit = async (data: CreateReportInput) => {
        try {
            await createReport.mutateAsync(data)
            toast.success("Laporan berhasil dikirim", {
                description: "Terima kasih telah membantu menjaga komunitas kami tetap aman.",
            })
            form.reset()
            onClose()
        } catch (error) {
            toast.error("Gagal mengirim laporan", {
                description: "Terjadi kesalahan saat mencoba mengirim laporan. Silakan coba lagi.",
            })
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>
                        Bantu kami memahami apa yang salah dengan konten ini. Privasi Anda tetap terjaga.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="type"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Alasan Pelaporan</FormLabel>
                                    <Select

                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                        value={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Pilih alasan..." />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {reportTypeEnum.options.map((option) => (
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

                        <FormField
                            control={form.control}
                            name="body"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Keterangan Tambahan (Opsional)</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Berikan detail lebih lanjut..."
                                            className="resize-none"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={onClose}
                                disabled={createReport.isPending}
                            >
                                Batal
                            </Button>
                            <Button type="submit" disabled={createReport.isPending}>
                                {createReport.isPending ? "Mengirim..." : "Kirim Laporan"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
