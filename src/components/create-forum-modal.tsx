import { useForm } from "react-hook-form"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog"
import { Button } from "./ui/button"
import { CreateForumInput, createForumSchema } from "@/lib/schemas"
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form"
import { motion } from "motion/react"
import { Paperclip, X, Ghost } from "lucide-react"
import { useMemo, useRef } from "react"
import { Textarea } from "./ui/textarea"
import { Input } from "./ui/input"
import { Combobox } from "./ui/combobox"
import { useSubjects } from "@/lib/queries/lecturer-subject"
import { useCreateForum } from "@/lib/queries/forum"
import { toast } from "sonner"
import { Switch } from "./ui/switch"

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const CreateForumModal = ({ open, onOpenChange }: Props) => {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { data: subjects = [] } = useSubjects()
  const createForumMutation = useCreateForum()

  const subjectList = useMemo(() =>
    subjects.map((subject) => ({
      value: subject.id_subject,
      label: `${subject.code} - ${subject.name}`,
    })), [subjects])

  const form = useForm<CreateForumInput>({
    resolver: standardSchemaResolver(createForumSchema),
    defaultValues: {
      title: '',
      description: '',
      id_subject: '',
      files: [],
      isAnonymous: false,
    },
  })

  const files = form.watch('files') || []

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

  const onSubmit = async (data: CreateForumInput) => {
    if (!data.id_subject) {
      toast('Mata Kuliah Wajib Diisi')
      return
    }
    try {
      await createForumMutation.mutateAsync({
        title: data.title,
        description: data.description,
        id_subject: data.id_subject,
        files: data.files,
        isAnonymous: data.isAnonymous,
      })
      form.reset()
      onOpenChange(false)
    } catch (error) {
      console.error('Failed to create forum:', error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg p-0 overflow-hidden">
        <motion.div
          layoutId="create-forum-input"
          className="p-6"
          transition={{
            type: "spring",
            stiffness: 350,
            damping: 30,
          }}
        >
          <DialogHeader className="mb-4">
            <DialogTitle>Buat Forum</DialogTitle>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Subject Selection */}
              <FormField
                name="id_subject"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mata Kuliah</FormLabel>
                    <Combobox
                      options={subjectList}
                      value={field.value}
                      onChange={(value) => field.onChange(value || '')}
                      placeholder="Pilih mata kuliah..."
                      searchPlaceholder="Cari mata kuliah..."
                      emptyText="Mata kuliah tidak ditemukan."
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Title */}
              <FormField
                name="title"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Judul Forum</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Masukkan judul forum..."
                        autoFocus
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Description */}
              <FormField
                name="description"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Isi Forum</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Masukkan isi forum..."
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

                {/* Submit Button */}
                <div className="flex gap-2">
                  <Button size={'lg'} type="submit" loading={createForumMutation.isPending}>
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

export default CreateForumModal
