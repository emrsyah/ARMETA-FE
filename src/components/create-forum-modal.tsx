import { useForm } from "react-hook-form"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { CreateForumInput, createForumSchema } from "@/lib/schemas"
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form"
import { motion } from "motion/react"
import { useState } from "react"
import { Textarea } from "./ui/textarea"



type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const CreateForumModal = ({ open, onOpenChange }: Props) => {
  const form = useForm<CreateForumInput>({
    resolver: standardSchemaResolver(createForumSchema),
    defaultValues: {
      title: '',
      description: '',
      id_subject: '',
    },
  })


  const [onSubmitLoading, setOnSubmitLoading] = useState(false)

  const onSubmit = (data: CreateForumInput) => {
    console.log(data)
    // TODO: Submit to API
    setOnSubmitLoading(true)
    // onOpenChange(false)
    setTimeout(() => {
      setOnSubmitLoading(false)
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
                  <FormLabel>Deskripsi Forum</FormLabel>
                  <FormControl>
                    <Textarea 
                      {...field} 
                      placeholder="Masukkan deskripsi forum..."
                      autoFocus 
                      className="min-h-[120px] resize-none"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Bottom Actions */}
            <div className="flex items-center justify-end pt-2">

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
