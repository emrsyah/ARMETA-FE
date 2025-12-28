import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { motion } from "motion/react";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useFileUpload } from "@/hooks/use-file-upload";
import { useLecturers, useSubjects } from "@/lib/queries/lecturer-subject";
import { useCreateUlasan, useEditUlasan } from "@/lib/queries/ulasan";
import { type CreateUlasanInput, createUlasanSchema } from "@/lib/schemas";
import { FilePreview } from "./shared/file-preview";
import { FormFieldCounter } from "./shared/form-field-counter";
import { PostActions } from "./shared/post-actions";
import { Combobox } from "./ui/combobox";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Form, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";

type Props = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	replyToId?: string;
	forumId?: string;
	editData?: {
		id_review: string;
		judulUlasan: string;
		textUlasan: string;
		idDosen?: string;
		idMatkul?: string;
		isAnonymous: boolean;
	};
};

const CreateReviewModal = ({ open, onOpenChange, replyToId, forumId, editData }: Props) => {
	const { data: lecturers = [] } = useLecturers();
	const { data: subjects = [] } = useSubjects();
	const createUlasanMutation = useCreateUlasan();
	const editUlasanMutation = useEditUlasan();

	const dosenList = useMemo(
		() =>
			lecturers.map((lecturer) => ({
				value: lecturer.id_lecturer,
				label: lecturer.name,
			})),
		[lecturers]
	);

	const matkulList = useMemo(
		() =>
			subjects.map((subject) => ({
				value: subject.id_subject,
				label: subject.name,
			})),
		[subjects]
	);

	const form = useForm<CreateUlasanInput>({
		resolver: standardSchemaResolver(createUlasanSchema),
		defaultValues: {
			judulUlasan: "",
			textUlasan: "",
			files: [],
			isAnonymous: false,
		},
	});

	const { fileInputRef, handleFileSelect, removeFile, files } = useFileUpload(form);

	// Reset form when modal opens/closes or props change
	useEffect(() => {
		if (open) {
			form.reset({
				judulUlasan: editData?.judulUlasan || (replyToId ? "reply" : ""),
				textUlasan: editData?.textUlasan || "",
				files: [],
				idDosen: editData?.idDosen,
				idMatkul: editData?.idMatkul,
				isAnonymous: editData?.isAnonymous || false,
			});
		}
	}, [open, editData, replyToId, form]);

	const onSubmit = async (data: CreateUlasanInput) => {
		try {
			if (!data.judulUlasan || !data.textUlasan) {
				toast.error("Judul dan Ulasan tidak boleh kosong");
				return;
			}

			if (editData) {
				await editUlasanMutation.mutateAsync({
					id_review: editData.id_review,
					title: data.judulUlasan,
					body: data.textUlasan,
					files: data.files,
					isAnonymous: data.isAnonymous,
				});
				toast.success("Ulasan berhasil diperbarui");
			} else {
				const isReply = !!(replyToId || forumId);
				if (!isReply && !data.idDosen && !data.idMatkul) {
					toast.error("Pilih setidaknya satu Dosen atau Mata Kuliah");
					return;
				}

				await createUlasanMutation.mutateAsync({
					judulUlasan: data.judulUlasan,
					textUlasan: data.textUlasan,
					idDosen: data.idDosen,
					idMatkul: data.idMatkul,
					idReply: replyToId,
					idForum: forumId,
					files: data.files,
					isAnonymous: data.isAnonymous,
				});
				toast.success("Ulasan berhasil dikirim");
			}
			form.reset();
			onOpenChange(false);
		} catch (error) {
			console.error("Failed to submit ulasan:", error);
			toast.error(editData ? "Gagal memperbarui ulasan" : "Gagal mengirim ulasan / balasan");
		}
	};

	const isPending = createUlasanMutation.isPending || editUlasanMutation.isPending;
	const isReply = !!(replyToId || forumId);
	const isEdit = !!editData;

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
						<DialogTitle>
							{isEdit
								? "Edit Ulasan"
								: forumId
									? "Buat Ulasan"
									: isReply
										? "Buat Balasan"
										: "Buat Ulasan"}
						</DialogTitle>
					</DialogHeader>

					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
							{!isReply && !isEdit && (
								<div className="grid grid-cols-2 gap-4">
									<FormField
										name="idMatkul"
										control={form.control}
										render={({ field }) => (
											<FormItem className="flex flex-col">
												<FormLabel>Mata Kuliah</FormLabel>
												<Combobox
													options={matkulList}
													value={field.value}
													onChange={field.onChange}
													placeholder="Pilih mata kuliah..."
													searchPlaceholder="Cari mata kuliah..."
													emptyText="Mata kuliah tidak ditemukan."
												/>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										name="idDosen"
										control={form.control}
										render={({ field }) => (
											<FormItem className="flex flex-col">
												<FormLabel>Dosen</FormLabel>
												<Combobox
													options={dosenList}
													value={field.value}
													onChange={field.onChange}
													placeholder="Pilih dosen..."
													searchPlaceholder="Cari dosen..."
													emptyText="Dosen tidak ditemukan."
												/>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>
							)}

							{!replyToId && (
								<FormFieldCounter
									control={form.control}
									name="judulUlasan"
									label={`Judul ${forumId ? "Ulasan" : isReply ? "Balasan" : "Ulasan"}`}
									placeholder={`Masukkan judul ${forumId ? "ulasan" : isReply ? "balasan" : "ulasan"}...`}
									maxLength={100}
									autoFocus
								/>
							)}

							<FormFieldCounter
								control={form.control}
								name="textUlasan"
								label={`Isi ${forumId ? "Ulasan" : isReply ? "Balasan" : "Ulasan"}`}
								placeholder={`Tulis ${forumId ? "ulasan" : isReply ? "balasan" : "ulasan"} Anda di sini...`}
								maxLength={1000}
								type="textarea"
								className="min-h-[120px] resize-none pb-6"
							/>

							<FilePreview files={files} onRemove={removeFile} />

							<input
								ref={fileInputRef}
								type="file"
								multiple
								accept="image/*"
								onChange={handleFileSelect}
								className="hidden"
							/>

							<PostActions
								control={form.control}
								onFileClick={() => fileInputRef.current?.click()}
								filesCount={files.length}
								isPending={isPending}
								submitLabel={isEdit ? "Perbarui" : "Kirim"}
							/>
						</form>
					</Form>
				</motion.div>
			</DialogContent>
		</Dialog>
	);
};

export default CreateReviewModal;
