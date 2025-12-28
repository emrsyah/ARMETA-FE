import { X } from "lucide-react";

interface FilePreviewProps {
	files: File[];
	onRemove: (index: number) => void;
}

export const FilePreview = ({ files, onRemove }: FilePreviewProps) => {
	if (files.length === 0) return null;

	return (
		<div className="flex flex-wrap gap-2">
			{files.map((file, index) => (
				<div
					key={`${file.name}-${index}`}
					className="flex items-center gap-1 bg-muted px-2 py-1 rounded-md text-sm"
				>
					<span className="truncate max-w-[150px]">{file.name}</span>
					<button
						type="button"
						onClick={() => onRemove(index)}
						className="text-muted-foreground hover:text-foreground transition-colors"
					>
						<X className="size-3" />
					</button>
				</div>
			))}
		</div>
	);
};
