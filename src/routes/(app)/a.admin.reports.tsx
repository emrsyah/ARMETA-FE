import { createFileRoute } from "@tanstack/react-router";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { CheckCircle2, ExternalLink, MoreVertical, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { useAllReports, useDeleteContent, useResolveReport } from "@/lib/queries/admin";

export const Route = createFileRoute("/(app)/a/admin/reports")({
	component: AdminReports,
});

function AdminReports() {
	const { data: reports, isLoading } = useAllReports();
	const resolveMutation = useResolveReport();
	const deleteMutation = useDeleteContent();

	const [deleteDialog, setDeleteDialog] = useState<{
		open: boolean;
		type: "review" | "forum";
		id: string;
		reportId: string;
	} | null>(null);

	const handleResolve = async (id_report: string, status: "Resolved" | "Ignored") => {
		try {
			await resolveMutation.mutateAsync({ id_report, status });
			toast.success(`Laporan ditandai sebagai ${status}`);
		} catch (_error) {
			toast.error("Gagal memproses laporan");
		}
	};

	const handleDeleteContent = async () => {
		if (!deleteDialog) return;
		try {
			await deleteMutation.mutateAsync({ type: deleteDialog.type, id: deleteDialog.id });
			await resolveMutation.mutateAsync({ id_report: deleteDialog.reportId, status: "Resolved" });
			toast.success("Konten berhasil dihapus dan laporan diselesaikan");
		} catch (_error) {
			toast.error("Gagal menghapus konten");
		} finally {
			setDeleteDialog(null);
		}
	};

	return (
		<Card className="border-none shadow-sm bg-white/50 backdrop-blur-sm">
			<CardHeader>
				<CardTitle>Moderasi Laporan</CardTitle>
				<p className="text-sm text-muted-foreground">
					Tinjau dan tindak lanjuti laporan dari pengguna.
				</p>
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
										{format(new Date(report.created_at), "dd MMM yyyy, HH:mm", { locale: id })}
									</TableCell>
									<TableCell>
										<div className="flex flex-col">
											<span className="font-medium text-xs">{report.reporter?.name}</span>
											<span className="text-[10px] text-muted-foreground">
												{report.reporter?.email}
											</span>
										</div>
									</TableCell>
									<TableCell>
										<div className="flex flex-col gap-1">
											<Badge variant="secondary" className="w-fit text-[10px]">
												{report.reason}
											</Badge>
											<p className="text-xs text-muted-foreground line-clamp-1">
												{report.description}
											</p>
										</div>
									</TableCell>
									<TableCell>
										{report.id_review ? (
											<Badge
												variant="outline"
												className="gap-1 bg-rose-50 border-rose-100 text-rose-600"
											>
												Ulasan <ExternalLink size={10} />
											</Badge>
										) : report.id_forum ? (
											<Badge
												variant="outline"
												className="gap-1 bg-indigo-50 border-indigo-100 text-indigo-600"
											>
												Forum <ExternalLink size={10} />
											</Badge>
										) : (
											<Badge variant="outline">Dosen/Matkul</Badge>
										)}
									</TableCell>
									<TableCell>
										<Badge
											variant={
												report.status === "Pending"
													? "default"
													: report.status === "Resolved"
														? "default"
														: "secondary"
											}
										>
											{report.status}
										</Badge>
									</TableCell>
									<TableCell className="text-right whitespace-nowrap">
										{report.status === "Pending" && (
											<DropdownMenu>
												<DropdownMenuTrigger asChild>
													<Button variant="ghost" size="icon">
														<MoreVertical size={16} />
													</Button>
												</DropdownMenuTrigger>
												<DropdownMenuContent align="end" className="w-48">
													<DropdownMenuLabel>Aksi Laporan</DropdownMenuLabel>
													<DropdownMenuSeparator />
													<DropdownMenuItem
														onClick={() => handleResolve(report.id_report, "Ignored")}
														className="text-green-600 focus:text-green-600 cursor-pointer"
													>
														<CheckCircle2 className="mr-2 h-4 w-4" /> Selesaikan (Abaikan)
													</DropdownMenuItem>
													<DropdownMenuItem
														onClick={() => {
															if (report.id_review)
																setDeleteDialog({
																	open: true,
																	type: "review",
																	id: report.id_review,
																	reportId: report.id_report,
																});
															else if (report.id_forum)
																setDeleteDialog({
																	open: true,
																	type: "forum",
																	id: report.id_forum,
																	reportId: report.id_report,
																});
														}}
														className="text-red-600 focus:text-red-600 cursor-pointer"
													>
														<Trash2 className="mr-2 h-4 w-4" /> Hapus Konten
													</DropdownMenuItem>
												</DropdownMenuContent>
											</DropdownMenu>
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
							Tindakan ini akan menghapus{" "}
							{deleteDialog?.type === "review" ? "ulasan" : "postingan forum"} secara permanen dan
							menandai laporan ini sebagai selesai.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Batal</AlertDialogCancel>
						<AlertDialogAction
							onClick={handleDeleteContent}
							className="bg-red-500 hover:bg-red-600"
						>
							Ya, Hapus
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</Card>
	);
}
