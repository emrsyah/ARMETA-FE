import { createFileRoute } from '@tanstack/react-router'
import { CheckCircle2, Trash2, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAllReports, useResolveReport, useDeleteContent } from '@/lib/queries/admin'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'
import { useState } from 'react'
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

export const Route = createFileRoute('/(app)/a/admin/reports')({
  component: AdminReports,
})

function AdminReports() {
  const { data: reports, isLoading } = useAllReports()
  const resolveMutation = useResolveReport()
  const deleteMutation = useDeleteContent()

  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; type: 'review' | 'forum'; id: string; reportId: string } | null>(null)

  const handleResolve = async (id_report: string, status: 'Resolved' | 'Ignored') => {
    try {
      await resolveMutation.mutateAsync({ id_report, status })
      toast.success(`Laporan ditandai sebagai ${status}`)
    } catch (error) {
      toast.error("Gagal memproses laporan")
    }
  }

  const handleDeleteContent = async () => {
    if (!deleteDialog) return
    try {
      await deleteMutation.mutateAsync({ type: deleteDialog.type, id: deleteDialog.id })
      await resolveMutation.mutateAsync({ id_report: deleteDialog.reportId, status: 'Resolved' })
      toast.success("Konten berhasil dihapus dan laporan diselesaikan")
    } catch (error) {
      toast.error("Gagal menghapus konten")
    } finally {
      setDeleteDialog(null)
    }
  }

  return (
    <Card className="border-none shadow-sm bg-white/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle>Moderasi Laporan</CardTitle>
        <p className="text-sm text-muted-foreground">Tinjau dan tindak lanjuti laporan dari pengguna.</p>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center p-8">Loading reports...</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Waktu</TableHead>
                <TableHead>Reporter</TableHead>
                <TableHead>Alasan</TableHead>
                <TableHead>Konten</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reports?.map((report: any) => (
                <TableRow key={report.id_report}>
                  <TableCell className="text-xs whitespace-nowrap">
                    {format(new Date(report.created_at), 'dd MMM yyyy, HH:mm', { locale: id })}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium text-xs">{report.reporter?.name}</span>
                      <span className="text-[10px] text-muted-foreground">{report.reporter?.email}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <Badge variant="secondary" className="w-fit text-[10px]">{report.reason}</Badge>
                      <p className="text-xs text-muted-foreground line-clamp-1">{report.description}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    {report.id_review ? (
                      <Badge variant="outline" className="gap-1 bg-rose-50 border-rose-100 text-rose-600">
                        Ulasan <ExternalLink size={10} />
                      </Badge>
                    ) : report.id_forum ? (
                      <Badge variant="outline" className="gap-1 bg-indigo-50 border-indigo-100 text-indigo-600">
                        Forum <ExternalLink size={10} />
                      </Badge>
                    ) : (
                      <Badge variant="outline">Dosen/Matkul</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={report.status === 'Pending' ? 'default' : report.status === 'Resolved' ? 'default' : 'secondary'}
                    >
                      {report.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right space-x-1 whitespace-nowrap">
                    {report.status === 'Pending' && (
                      <>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-green-600 hover:text-green-700 hover:bg-green-50"
                          title="Selesaikan (Abaikan)"
                          onClick={() => handleResolve(report.id_report, 'Ignored')}
                        >
                          <CheckCircle2 size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-500 hover:text-red-600 hover:bg-red-50"
                          title="Hapus Konten"
                          onClick={() => {
                            if (report.id_review) setDeleteDialog({ open: true, type: 'review', id: report.id_review, reportId: report.id_report })
                            else if (report.id_forum) setDeleteDialog({ open: true, type: 'forum', id: report.id_forum, reportId: report.id_report })
                          }}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>

      <AlertDialog open={!!deleteDialog} onOpenChange={(open) => !open && setDeleteDialog(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Konten?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini akan menghapus {deleteDialog?.type === 'review' ? 'ulasan' : 'postingan forum'} secara permanen dan menandai laporan ini sebagai selesai.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteContent} className="bg-red-500 hover:bg-red-600">
              Ya, Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  )
}
