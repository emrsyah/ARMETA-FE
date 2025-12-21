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
import { Paperclip, X, Ghost } from "lucide-react"
import { useMemo, useRef, useEffect } from "react"
import z from "zod"
import { useLecturers, useSubjects } from "@/lib/queries/lecturer-subject"
import { useCreateUlasan } from "@/lib/queries/ulasan"
import { toast } from "sonner"
import { Switch } from "./ui/switch"

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
      isAnonymous: false,
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
        isAnonymous: false,
      })
    }
  }, [open, replyToId, forumId, form])

  const files = form.watch('files') || []
  const reviewType = form.watch('type')

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

  const onSubmit = async (data: ExtendedCreateUlasanInput) => {
    try {
      if (!data.judulUlasan || !data.textUlasan) {
        toast('Judul dan Ulasan tidak boleh kosong')
        return
      }
      if ((data.type == 'dosen' || data.type == 'matkul') && (!data.idDosen && !data.idMatkul)) {
        toast('Dosen atau Mata Kuliah Wajib Diisi')
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
        isAnonymous: data.isAnonymous,
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
                      <div className="relative">
                        <Input
                          {...field}
                          placeholder={`Masukkan judul ${(replyToId || forumId) ? 'balasan' : 'ulasan'}...`}
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

              {/* Review Content */}
              <FormField
                name="textUlasan"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Isi {(replyToId || forumId) ? 'Balasan' : 'Ulasan'}</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Textarea
                          {...field}
                          placeholder={`Tulis ${(replyToId || forumId) ? 'balasan' : 'ulasan'} Anda di sini...`}
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
