import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import api from "@/lib/api/client";
import { LECTURER_SUBJECT_ENDPOINTS } from "@/lib/api/endpoints";

export const Route = createFileRoute("/(app)/a/admin/subjects")({
	component: AdminSubjects,
});

function AdminSubjects() {
	const { data: subjects, isLoading } = useQuery({
		queryKey: ["subjects"],
		queryFn: async () => {
			const response = await api.get(LECTURER_SUBJECT_ENDPOINTS.GET_SUBJECTS);
			return response.data.data;
		},
	});

	return (
		<Card className="border-none shadow-sm bg-white/50 backdrop-blur-sm">
			<CardHeader className="flex flex-row items-center justify-between">
				<div>
					<CardTitle>Manajemen Mata Kuliah</CardTitle>
					<p className="text-sm text-muted-foreground">
						List semua mata kuliah yang terdaftar di sistem.
					</p>
				</div>
				<Button className="bg-[#123980] hover:bg-[#123980]/90">
					<Plus className="mr-2 h-4 w-4" /> Tambah Matkul
				</Button>
			</CardHeader>
			<CardContent>
				{isLoading ? (
					<div>Loading subjects...</div>
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
							{subjects?.map((subject: any) => (
								<TableRow key={subject.id_subject}>
									<TableCell className="font-mono text-xs">{subject.code}</TableCell>
									<TableCell className="font-medium">{subject.name}</TableCell>
									<TableCell>{subject.semester}</TableCell>
									<TableCell className="text-right">
										<Button variant="ghost" size="sm">
											Edit
										</Button>
										<Button
											variant="ghost"
											size="sm"
											className="text-red-500 hover:text-red-600 hover:bg-red-50"
										>
											Hapus
										</Button>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				)}
			</CardContent>
		</Card>
	);
}
