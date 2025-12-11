import { useForm } from "react-hook-form"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog"
import { Input } from "./ui/input"
import { Textarea } from "./ui/textarea"
import { Checkbox } from "./ui/checkbox"
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs"
import { Button } from "./ui/button"
import { Combobox } from "./ui/combobox"
import { CreateUlasanInput, createUlasanSchema } from "@/lib/schemas"
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form"
import { motion } from "motion/react"
import { Paperclip, X } from "lucide-react"
import { useRef } from "react"

// Dummy data
const dosenList = [
  { value: "dosen-1", label: "Dr. Ahmad Sudrajat, M.Kom" },
  { value: "dosen-2", label: "Prof. Budi Santoso, Ph.D" },
  { value: "dosen-3", label: "Ir. Citra Dewi, M.T" },
  { value: "dosen-4", label: "Dr. Dedi Kurniawan, S.Si" },
  { value: "dosen-5", label: "Eka Putri, M.Sc" },
]

const matkulList = [
  { value: "matkul-1", label: "Algoritma dan Pemrograman" },
  { value: "matkul-2", label: "Struktur Data" },
  { value: "matkul-3", label: "Basis Data" },
  { value: "matkul-4", label: "Pemrograman Web" },
  { value: "matkul-5", label: "Kecerdasan Buatan" },
]

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const CreateReviewModal = ({ open, onOpenChange }: Props) => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const form = useForm<CreateUlasanInput>({
    resolver: standardSchemaResolver(createUlasanSchema),
    defaultValues: {
      type: 'dosen',
      judulUlasan: '',
      textUlasan: '',
      isAnonymous: false,
      files: [],
    },
  })

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

  const onSubmit = (data: CreateUlasanInput) => {
    console.log(data)
    // TODO: Submit to API
    onOpenChange(false)
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
        <DialogHeader>
          <DialogTitle>Buat Ulasan</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Review Type Tabs */}
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
                      <TabsTrigger value="dosen" className="flex-1">
                        Ulasan Dosen
                      </TabsTrigger>
                      <TabsTrigger value="matkul" className="flex-1">
                        Ulasan Mata Kuliah
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </FormItem>
              )}
            />

            {/* Select Dosen/Matkul */}
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

            {/* Title */}
            <FormField
              name="judulUlasan"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Judul Ulasan</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      placeholder="Masukkan judul ulasan..."
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
                  <FormLabel>Isi Ulasan</FormLabel>
                  <FormControl>
                    <Textarea 
                      {...field} 
                      placeholder="Tulis ulasan Anda di sini..."
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
                <FormField
                  name="isAnonymous"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-2 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="text-sm font-normal cursor-pointer">
                        Anonim
                      </FormLabel>
                    </FormItem>
                  )}
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-2">
                <Button size={'lg'} type="submit">
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
