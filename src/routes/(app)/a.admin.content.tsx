import { createFileRoute } from '@tanstack/react-router'
import { Plus, GraduationCap, BookMarked, Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useLecturers, useSubjects, useDeleteLecturer, useDeleteSubject } from '@/lib/queries/lecturer-subject'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useState } from 'react'
import { LecturerModal } from '@/components/admin/lecturer-modal'
import { SubjectModal } from '@/components/admin/subject-modal'
import { type Lecturer, type Subject } from '@/lib/schemas/lecturer-subject.schema'
import { toast } from 'sonner'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export const Route = createFileRoute('/(app)/a/admin/content')({
  component: AdminContentManagement,
})

function AdminContentManagement() {
  const [lecturerModalOpen, setLecturerModalOpen] = useState(false)
  const [subjectModalOpen, setSubjectModalOpen] = useState(false)
  const [selectedLecturer, setSelectedLecturer] = useState<Lecturer | null>(null)
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null)

  const handleAddLecturer = () => {
    setSelectedLecturer(null)
    setLecturerModalOpen(true)
  }

  const handleEditLecturer = (lecturer: Lecturer) => {
    setSelectedLecturer(lecturer)
    setLecturerModalOpen(true)
  }

  const handleAddSubject = () => {
    setSelectedSubject(null)
    setSubjectModalOpen(true)
  }

  const handleEditSubject = (subject: Subject) => {
    setSelectedSubject(subject)
    setSubjectModalOpen(true)
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="lecturers" className="w-full">
        <TabsList className="bg-white/50 backdrop-blur-sm border-none shadow-sm p-1">
          <TabsTrigger value="lecturers" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
            <GraduationCap className="mr-2 h-4 w-4" /> Dosen
          </TabsTrigger>
          <TabsTrigger value="subjects" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
            <BookMarked className="mr-2 h-4 w-4" /> Mata Kuliah
          </TabsTrigger>
        </TabsList>

        <TabsContent value="lecturers" className="mt-6">
          <LecturerTable onAdd={handleAddLecturer} onEdit={handleEditLecturer} />
        </TabsContent>

        <TabsContent value="subjects" className="mt-6">
          <SubjectTable onAdd={handleAddSubject} onEdit={handleEditSubject} />
        </TabsContent>
      </Tabs>

      <LecturerModal
        open={lecturerModalOpen}
        onOpenChange={setLecturerModalOpen}
        editData={selectedLecturer}
      />
      <SubjectModal
        open={subjectModalOpen}
        onOpenChange={setSubjectModalOpen}
        editData={selectedSubject}
      />
    </div>
  )
}

function LecturerTable({ onAdd, onEdit }: { onAdd: () => void; onEdit: (l: Lecturer) => void }) {
  const { data: lecturers, isLoading } = useLecturers()
  const deleteMutation = useDeleteLecturer()
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const handleDelete = async () => {
    if (!deleteId) return
    try {
      await deleteMutation.mutateAsync(deleteId)
      toast.success("Dosen berhasil dihapus")
    } catch (error) {
      toast.error("Gagal menghapus dosen")
    } finally {
      setDeleteId(null)
    }
  }

  return (
    <>
      <Card className="border-none shadow-sm bg-white/50 backdrop-blur-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Manajemen Dosen</CardTitle>
            <p className="text-sm text-muted-foreground">List semua dosen yang terdaftar di sistem.</p>
          </div>
          <Button onClick={onAdd} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="mr-2 h-4 w-4" /> Tambah Dosen
          </Button>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center p-8">Loading lecturers...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama</TableHead>
                  <TableHead>Fakultas</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {lecturers?.map((lecturer) => (
                  <TableRow key={lecturer.id_lecturer}>
                    <TableCell className="font-medium">{lecturer.name}</TableCell>
                    <TableCell>{lecturer.faculty}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="ghost" size="icon" onClick={() => onEdit(lecturer)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-500 hover:text-red-600 hover:bg-red-50"
                        onClick={() => setDeleteId(lecturer.id_lecturer)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={!!deleteId} onOpenChange={(open: boolean) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat dibatalkan. Ini akan menghapus data dosen secara permanen dari server.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-500 hover:bg-red-600">
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

function SubjectTable({ onAdd, onEdit }: { onAdd: () => void; onEdit: (s: Subject) => void }) {
  const { data: subjects, isLoading } = useSubjects()
  const deleteMutation = useDeleteSubject()
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const handleDelete = async () => {
    if (!deleteId) return
    try {
      await deleteMutation.mutateAsync(deleteId)
      toast.success("Mata kuliah berhasil dihapus")
    } catch (error) {
      toast.error("Gagal menghapus mata kuliah")
    } finally {
      setDeleteId(null)
    }
  }

  return (
    <>
      <Card className="border-none shadow-sm bg-white/50 backdrop-blur-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Manajemen Mata Kuliah</CardTitle>
            <p className="text-sm text-muted-foreground">List semua mata kuliah yang terdaftar di sistem.</p>
          </div>
          <Button onClick={onAdd} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="mr-2 h-4 w-4" /> Tambah Matkul
          </Button>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center p-8">Loading subjects...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Kode</TableHead>
                  <TableHead>Nama</TableHead>
                  <TableHead>Semester</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subjects?.map((subject) => (
                  <TableRow key={subject.id_subject}>
                    <TableCell className="font-mono text-xs">{subject.code}</TableCell>
                    <TableCell className="font-medium">{subject.name}</TableCell>
                    <TableCell>{subject.semester}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="ghost" size="icon" onClick={() => onEdit(subject)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-500 hover:text-red-600 hover:bg-red-50"
                        onClick={() => setDeleteId(subject.id_subject)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={!!deleteId} onOpenChange={(open: boolean) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat dibatalkan. Ini akan menghapus data mata kuliah secara permanen dari server.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-500 hover:bg-red-600">
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
