import { useForm } from "react-hook-form"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog"
import { Input } from "./ui/input"
import { Textarea } from "./ui/textarea"
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs"
import { Button } from "./ui/button"
import { Combobox } from "./ui/combobox"
import { createUlasanSchema } from "@/lib/schemas"
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form"
import { motion } from "motion/react"
import { Paperclip, X } from "lucide-react"
import { useMemo, useRef, useEffect } from "react"
import z from "zod"
import { useLecturers, useSubjects } from "@/lib/queries/lecturer-subject"
import { useCreateUlasan } from "@/lib/queries/ulasan"
import { toast } from "sonner"

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  replyToId?: string
  forumId?: string
}

const extendedCreateUlasanSchema = createUlasanSchema.extend({
  type: z.enum(['dosen', 'matkul', 'reply']),
})

type ExtendedCreateUlasanInput = z.infer<typeof extendedCreateUlasanSchema>

const CreateReviewModal = ({ open, onOpenChange, replyToId, forumId }: Props) => {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { data: lecturers = [] } = useLecturers()
  const { data: subjects = [] } = useSubjects()
  const createUlasanMutation = useCreateUlasan()

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

  const form = useForm<ExtendedCreateUlasanInput>({
    resolver: standardSchemaResolver(extendedCreateUlasanSchema),
    defaultValues: {
      type: (replyToId || forumId) ? 'reply' : 'matkul',
      judulUlasan: '',
      textUlasan: '',
      files: [],
    },
  })

  // Reset form when modal opens/closes or props change
  useEffect(() => {
    if (open) {
      form.reset({
        type: (replyToId || forumId) ? 'reply' : 'dosen',
        judulUlasan: '',
        textUlasan: '',
        files: [],
      })
    }
  }, [open, replyToId, forumId, form])

  const files = form.watch('files') || []
  const reviewType = form.watch('type')

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || [])
    const currentFiles = form.getValues('files') || []
    form.setValue('files', [...currentFiles, ...selectedFiles])
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const removeFile = (index: number) => {
    const currentFiles = form.getValues('files') || []
    form.setValue('files', currentFiles.filter((_, i) => i !== index))
  }

  const onSubmit = async (data: ExtendedCreateUlasanInput) => {
    try {
      if (!data.judulUlasan || !data.textUlasan) {
        toast('Judul dan Ulasan tidak boleh kosong')
        return
      }
      if (data.type === 'reply' && !replyToId) {
        toast('Reply ID tidak ditemukan')
        return
      }
      if ((data.type == 'dosen' || data.type == 'matkul') && (!data.idDosen && !data.idMatkul)) {
        toast('Dosen atau Matkul Wajib Diisi')
        return
      }
      await createUlasanMutation.mutateAsync({
        judulUlasan: data.judulUlasan,
        textUlasan: data.textUlasan,
        idDosen: data.type === 'dosen' ? data.idDosen : undefined,
        idMatkul: data.type === 'matkul' ? data.idMatkul : undefined,
        idReply: data.type === 'reply' ? replyToId : undefined,
        idForum: forumId,
        files: data.files,
      })
      form.reset()
      onOpenChange(false)
    } catch (error) {
      console.error('Failed to create ulasan:', error)
    }
  }

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
            <DialogTitle>{(replyToId || forumId) ? 'Buat Balasan' : 'Buat Ulasan'}</DialogTitle>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Review Type Tabs - Hide if replying */}
              {!replyToId && !forumId && (
                <FormField
                  name="type"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <Tabs
                        value={field.value}
                        onValueChange={(value) => {
                          field.onChange(value)
                          // Clear selection when switching type
                          form.setValue('idDosen', undefined)
                          form.setValue('idMatkul', undefined)
                        }}
                        className="w-full"
                      >
                        <TabsList className="w-full">
                          <TabsTrigger value="matkul" className="flex-1">
                            Ulasan Mata Kuliah
                          </TabsTrigger>
                          <TabsTrigger value="dosen" className="flex-1">
                            Ulasan Dosen
                          </TabsTrigger>
                        </TabsList>
                      </Tabs>
                    </FormItem>
                  )}
                />
              )}

              {/* Select Dosen/Matkul - Hide if replying */}
              {!replyToId && !forumId && (
                <FormItem>
                  <FormLabel>
                    {reviewType === 'dosen' ? 'Pilih Dosen' : 'Pilih Mata Kuliah'}
                  </FormLabel>
                  {reviewType === 'dosen' ? (
                    <Combobox
                      options={dosenList}
                      value={form.watch('idDosen')}
                      onChange={(value) => form.setValue('idDosen', value)}
                      placeholder="Pilih dosen..."
                      searchPlaceholder="Cari dosen..."
                      emptyText="Dosen tidak ditemukan."
                    />
                  ) : (
                    <Combobox
                      options={matkulList}
                      value={form.watch('idMatkul')}
                      onChange={(value) => form.setValue('idMatkul', value)}
                      placeholder="Pilih mata kuliah..."
                      searchPlaceholder="Cari mata kuliah..."
                      emptyText="Mata kuliah tidak ditemukan."
                    />
                  )}
                </FormItem>
              )}

              {/* Title */}
              <FormField
                name="judulUlasan"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Judul {(replyToId || forumId) ? 'Balasan' : 'Ulasan'}</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder={`Masukkan judul ${(replyToId || forumId) ? 'balasan' : 'ulasan'}...`}
                        autoFocus
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Review Content */}
              <FormField
                name="textUlasan"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Isi {(replyToId || forumId) ? 'Balasan' : 'Ulasan'}</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder={`Tulis ${(replyToId || forumId) ? 'balasan' : 'ulasan'} Anda di sini...`}
                        className="min-h-[120px] resize-none"
                      />
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
                    onClick={() => fileInputRef.current?.click()}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                    title="Lampirkan file"
                  >
                    <Paperclip className="size-5" />
                  </button>
                </div>

                {/* Submit Buttons */}
                <div className="flex gap-2">
                  <Button size={'lg'} type="submit" loading={createUlasanMutation.isPending}>
                    Kirim
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
