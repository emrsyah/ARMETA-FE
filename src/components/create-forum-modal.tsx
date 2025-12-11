import { useForm } from "react-hook-form"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog"
import { Button } from "./ui/button"
import { Checkbox } from "./ui/checkbox"
import { CreateForumInput, createForumSchema } from "@/lib/schemas"
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema"
import { Form, FormControl, FormField, FormItem, FormMessage } from "./ui/form"
import { motion } from "motion/react"
import { Paperclip, X } from "lucide-react"
import { useRef, useState } from "react"
import { Textarea } from "./ui/textarea"



type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const CreateForumModal = ({ open, onOpenChange }: Props) => {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const form = useForm<CreateForumInput>({
    resolver: standardSchemaResolver(createForumSchema),
    defaultValues: {
      title: '',
      description: '',
      id_subject: '',
    },
  })

  const [files, setFiles] = useState<File[]>([])
  const [isAnonymous, setIsAnonymous] = useState(false)
  const [onSubmitLoading, setOnSubmitLoading] = useState(false)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || [])
    setFiles(prev => [...prev, ...selectedFiles])
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index))
  }

  const onSubmit = (data: CreateForumInput) => {
    console.log({ ...data, files, isAnonymous })
    // TODO: Submit to API
    setOnSubmitLoading(true)
    // onOpenChange(false)
    setTimeout(() => {
      setOnSubmitLoading(false)
      setFiles([])
      setIsAnonymous(false)
      onOpenChange(false)
    }, 1000)
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
            {/* Description */}
            <FormField
              name="description"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  {/* <FormLabel>Isi Forum</FormLabel> */}
                  <FormControl>
                    <Textarea 
                      {...field} 
                      placeholder="Masukkan isi forum..."
                      autoFocus 
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

                {/* Anonymous Checkbox */}
                <label className="flex items-center gap-2 cursor-pointer">
                  <Checkbox
                    checked={isAnonymous}
                    onCheckedChange={(checked) => setIsAnonymous(checked === true)}
                  />
                  <span className="text-sm font-normal">Anonim</span>
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-2">
                <Button size={'lg'} type="submit" loading={onSubmitLoading}>
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
