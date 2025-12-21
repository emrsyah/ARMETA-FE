import { useForm } from "react-hook-form"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog"
import { Input } from "./ui/input"
import { Textarea } from "./ui/textarea"


import { Button } from "./ui/button"
import { Combobox } from "./ui/combobox"
import { createUlasanSchema, type CreateUlasanInput } from "@/lib/schemas"
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form"
import { motion } from "motion/react"
import { Paperclip, X, Ghost } from "lucide-react"
import { useMemo, useRef, useEffect } from "react"


import { useLecturers, useSubjects } from "@/lib/queries/lecturer-subject"
import { useCreateUlasan, useEditUlasan } from "@/lib/queries/ulasan"
import { toast } from "sonner"
import { Switch } from "./ui/switch"

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  replyToId?: string
  forumId?: string
  editData?: {
    id_review: string;
    judulUlasan: string;
    textUlasan: string;
    idDosen?: string;
    idMatkul?: string;
    isAnonymous: boolean;
  }
}



const CreateReviewModal = ({ open, onOpenChange, replyToId, forumId, editData }: Props) => {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { data: lecturers = [] } = useLecturers()
  const { data: subjects = [] } = useSubjects()
  const createUlasanMutation = useCreateUlasan()
  const editUlasanMutation = useEditUlasan()

  const dosenList = useMemo(() =>
    lecturers.map((lecturer) => ({
      value: lecturer.id_lecturer,
      label: lecturer.name,
    })), [lecturers])

  const matkulList = useMemo(() =>
    subjects.map((subject) => ({
      value: subject.id_subject,
      label: subject.name,
    })), [subjects])

  const form = useForm<CreateUlasanInput>({
    resolver: standardSchemaResolver(createUlasanSchema),
    defaultValues: {
      judulUlasan: '',
      textUlasan: '',
      files: [],
      isAnonymous: false,
    },
  })

  // Reset form when modal opens/closes or props change
  useEffect(() => {
    if (open) {
      if (editData) {
        form.reset({
          judulUlasan: editData.judulUlasan || (replyToId ? 'reply' : ''),
          textUlasan: editData.textUlasan,
          files: [],
          idDosen: editData.idDosen,
          idMatkul: editData.idMatkul,
          isAnonymous: editData.isAnonymous,
        })
      } else {
        form.reset({
          judulUlasan: replyToId ? 'reply' : '',
          textUlasan: '',
          files: [],
          idDosen: undefined,
          idMatkul: undefined,
          isAnonymous: false,
        })
      }
    }
  }, [open, editData, replyToId, forumId, form])

  const files = form.watch('files') || []

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || [])
    const currentFiles = form.getValues('files') || []

    if (currentFiles.length + selectedFiles.length > 4) {
      toast.error('Maksimal 4 file yang dapat diunggah')
      return
    }

    const overSizedFiles = selectedFiles.filter(file => file.size > 10 * 1024 * 1024)
    if (overSizedFiles.length > 0) {
      toast.error('Ukuran file maksimal 10MB per file')
      return
    }

    form.setValue('files', [...currentFiles, ...selectedFiles])
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const removeFile = (index: number) => {
    const currentFiles = form.getValues('files') || []
    form.setValue('files', currentFiles.filter((_, i) => i !== index))
  }

  const onSubmit = async (data: CreateUlasanInput) => {
    try {
      if (!data.judulUlasan || !data.textUlasan) {
        toast.error('Judul dan Ulasan tidak boleh kosong')
        return
      }

      if (editData) {
        // Handle Edit
        await editUlasanMutation.mutateAsync({
          id_review: editData.id_review,
          title: data.judulUlasan,
          body: data.textUlasan,
          files: data.files,
          isAnonymous: data.isAnonymous
        })
        toast.success('Ulasan berhasil diperbarui')
      } else {
        // Handle Create
        const isReply = !!(replyToId || forumId)
        if (!isReply && !data.idDosen && !data.idMatkul) {
          toast.error('Pilih setidaknya satu Dosen atau Mata Kuliah')
          return
        }

        await createUlasanMutation.mutateAsync({
          judulUlasan: data.judulUlasan,
          textUlasan: data.textUlasan,
          idDosen: data.idDosen,
          idMatkul: data.idMatkul,
          idReply: replyToId,
          idForum: forumId,
          files: data.files,
          isAnonymous: data.isAnonymous,
        })
        toast.success('Ulasan berhasil dikirim')
      }
      form.reset()
      onOpenChange(false)
    } catch (error) {
      console.error('Failed to submit ulasan:', error)
      toast.error(editData ? 'Gagal memperbarui ulasan' : 'Gagal mengirim ulasan / balasan')
    }
  }

  const isPending = createUlasanMutation.isPending || editUlasanMutation.isPending
  const isReply = !!(replyToId || forumId)
  const isEdit = !!editData

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg p-0 overflow-hidden">
        <motion.div
          layoutId="create-review-input"
          className="p-6"
          transition={{
            type: "spring",
            stiffness: 350,
            damping: 30,
          }}
        >
          <DialogHeader className="mb-4">
            <DialogTitle>
              {isEdit ? 'Edit Ulasan' : (forumId ? 'Buat Ulasan' : isReply ? 'Buat Balasan' : 'Buat Ulasan')}
            </DialogTitle>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Select Dosen/Matkul - Hide if replying or editing */}
              {!isReply && !isEdit && (
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    name="idMatkul"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Mata Kuliah</FormLabel>
                        <Combobox
                          options={matkulList}
                          value={field.value}
                          onChange={field.onChange}
                          placeholder="Pilih mata kuliah..."
                          searchPlaceholder="Cari mata kuliah..."
                          emptyText="Mata kuliah tidak ditemukan."
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    name="idDosen"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Dosen</FormLabel>
                        <Combobox
                          options={dosenList}
                          value={field.value}
                          onChange={field.onChange}
                          placeholder="Pilih dosen..."
                          searchPlaceholder="Cari dosen..."
                          emptyText="Dosen tidak ditemukan."
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              {/* Title - Hide if replying to a review, but show if for forum or root ulasan */}
              {!replyToId && (
                <FormField
                  name="judulUlasan"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Judul {forumId ? 'Ulasan' : isReply ? 'Balasan' : 'Ulasan'}</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            {...field}
                            placeholder={`Masukkan judul ${forumId ? 'ulasan' : isReply ? 'balasan' : 'ulasan'}...`}
                            autoFocus
                            maxLength={100}
                            className="pr-12"
                          />
                          <div className="absolute right-2 bottom-2 text-[10px] text-muted-foreground/50 pointer-events-none">
                            {(field.value?.length || 0)}/100
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {/* Review Content */}
              <FormField
                name="textUlasan"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Isi {forumId ? 'Ulasan' : isReply ? 'Balasan' : 'Ulasan'}</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Textarea
                          {...field}
                          placeholder={`Tulis ${forumId ? 'ulasan' : isReply ? 'balasan' : 'ulasan'} Anda di sini...`}
                          className="min-h-[120px] resize-none pb-6 pr-12"
                          maxLength={1000}
                        />
                        <div className="absolute right-2 bottom-2 text-[10px] text-muted-foreground/50 pointer-events-none">
                          {(field.value?.length || 0)}/1000
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Selected Files */}
              {files.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {files.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-1 bg-muted px-2 py-1 rounded-md text-sm"
                    >
                      <span className="truncate max-w-[150px]">{file.name}</span>
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <X className="size-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Bottom Actions */}
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-3">
                  {/* File Upload */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <button
                    type="button"
                    disabled={files.length >= 4}
                    onClick={() => fileInputRef.current?.click()}
                    className="text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    title={files.length >= 4 ? "Maksimal 4 file" : "Lampirkan file"}
                  >
                    <Paperclip className="size-5" />
                  </button>

                  <FormField
                    control={form.control}
                    name="isAnonymous"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center space-x-2 space-y-0 text-muted-foreground">
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="flex items-center gap-1.5 leading-none">
                          <FormLabel className="text-sm font-medium cursor-pointer flex items-center gap-1">
                            <Ghost className="size-3.5" />
                            Anonim
                          </FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>

                {/* Submit Buttons */}
                <div className="flex gap-2">
                  <Button size={'lg'} type="submit" loading={isPending}>
                    {isEdit ? 'Perbarui' : 'Kirim'}
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        </motion.div>
      </DialogContent>
    </Dialog>
  )
}

export default CreateReviewModal
