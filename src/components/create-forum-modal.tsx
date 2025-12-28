import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { motion } from "motion/react";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useFileUpload } from "@/hooks/use-file-upload";
import { useCreateForum, useEditForum } from "@/lib/queries/forum";
import { useSubjects } from "@/lib/queries/lecturer-subject";
import { type CreateForumInput, createForumSchema } from "@/lib/schemas";
import { FilePreview } from "./shared/file-preview";
import { FormFieldCounter } from "./shared/form-field-counter";
import { PostActions } from "./shared/post-actions";
import { Combobox } from "./ui/combobox";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Form, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";

type Props = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	editData?: {
		id_forum: string;
		title: string;
		description?: string;
		id_subject: string;
		isAnonymous: boolean;
	};
};

const CreateForumModal = ({ open, onOpenChange, editData }: Props) => {
	const { data: subjects = [] } = useSubjects();
	const createForumMutation = useCreateForum();
	const editForumMutation = useEditForum();

	const subjectList = useMemo(
		() =>
			subjects.map((subject) => ({
				value: subject.id_subject,
				label: `${subject.code} - ${subject.name}`,
			})),
		[subjects]
	);

	const form = useForm<CreateForumInput>({
		resolver: standardSchemaResolver(createForumSchema),
		defaultValues: {
			title: "",
			description: "",
			id_subject: "",
			files: [],
			isAnonymous: false,
		},
	});

	const { fileInputRef, handleFileSelect, removeFile, files } = useFileUpload(form);

	// Sync form with editData
	useEffect(() => {
		if (open) {
			form.reset({
				title: editData?.title || "",
				description: editData?.description ?? "",
				id_subject: editData?.id_subject || "",
				files: [],
				isAnonymous: editData?.isAnonymous || false,
			});
		}
	}, [open, editData, form]);

	const onSubmit = async (data: CreateForumInput) => {
		if (!data.id_subject) {
			toast.error("Mata Kuliah Wajib Diisi");
			return;
		}

		try {
			if (editData) {
				await editForumMutation.mutateAsync({
					id_forum: editData.id_forum,
					title: data.title,
					description: data.description,
					isAnonymous: data.isAnonymous,
					files: data.files,
				});
				toast.success("Forum berhasil diperbarui");
			} else {
				await createForumMutation.mutateAsync({
					title: data.title,
					description: data.description,
					id_subject: data.id_subject,
					files: data.files,
					isAnonymous: data.isAnonymous,
				});
				toast.success("Forum berhasil dibuat");
			}
			form.reset();
			onOpenChange(false);
		} catch (error) {
			console.error("Failed to submit forum:", error);
			toast.error(editData ? "Gagal memperbarui forum" : "Gagal membuat forum");
		}
	};

	const isPending = createForumMutation.isPending || editForumMutation.isPending;

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
						<DialogTitle>{editData ? "Edit Forum" : "Buat Forum"}</DialogTitle>
					</DialogHeader>

					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
							<FormField
								name="id_subject"
								control={form.control}
								render={({ field }) => (
									<FormItem>
										<FormLabel>Mata Kuliah</FormLabel>
										<Combobox
											options={subjectList}
											value={field.value}
											onChange={(value) => field.onChange(value || "")}
											placeholder="Pilih mata kuliah..."
											searchPlaceholder="Cari mata kuliah..."
											emptyText="Mata kuliah tidak ditemukan."
										/>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormFieldCounter
								control={form.control}
								name="title"
								label="Judul Forum"
								placeholder="Masukkan judul forum..."
								maxLength={100}
								autoFocus
							/>

							<FormFieldCounter
								control={form.control}
								name="description"
								label="Isi Forum"
								placeholder="Masukkan isi forum..."
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
								submitLabel={editData ? "Perbarui" : "Kirim"}
							/>
						</form>
					</Form>
				</motion.div>
			</DialogContent>
		</Dialog>
	);
};

export default CreateForumModal;
