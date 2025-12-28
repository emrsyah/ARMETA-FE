import { useRef } from "react";
import type { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";

interface FileUploadOptions {
	maxFiles?: number;
	maxSizeMB?: number;
	fieldName?: string;
}

export const useFileUpload = (form: UseFormReturn<any>, options: FileUploadOptions = {}) => {
	const { maxFiles = 4, maxSizeMB = 10, fieldName = "files" } = options;
	const fileInputRef = useRef<HTMLInputElement>(null);

	const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
		const selectedFiles = Array.from(e.target.files || []);
		const currentFiles = form.getValues(fieldName) || [];

		if (currentFiles.length + selectedFiles.length > maxFiles) {
			toast.error(`Maksimal ${maxFiles} file yang dapat diunggah`);
			return;
		}

		const overSizedFiles = selectedFiles.filter((file) => file.size > maxSizeMB * 1024 * 1024);
		if (overSizedFiles.length > 0) {
			toast.error(`Ukuran file maksimal ${maxSizeMB}MB per file`);
			return;
		}

		form.setValue(fieldName, [...currentFiles, ...selectedFiles], {
			shouldValidate: true,
			shouldDirty: true,
		});
		if (fileInputRef.current) {
			fileInputRef.current.value = "";
		}
	};

	const removeFile = (index: number) => {
		const currentFiles = form.getValues(fieldName) || [];
		form.setValue(
			fieldName,
			currentFiles.filter((_: any, i: number) => i !== index),
			{
				shouldValidate: true,
				shouldDirty: true,
			}
		);
	};

	return {
		fileInputRef,
		handleFileSelect,
		removeFile,
		files: (form.watch(fieldName) || []) as File[],
	};
};
