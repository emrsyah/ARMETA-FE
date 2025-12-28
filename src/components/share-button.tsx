import { Share } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";

interface ShareButtonProps extends React.ComponentProps<typeof Button> {
	url: string;
	label?: string;
	showLabel?: boolean;
}

export const ShareButton = ({
	url,
	label = "Bagikan",
	showLabel = true,
	className,
	...props
}: ShareButtonProps) => {
	const handleShare = async (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();

		try {
			await navigator.clipboard.writeText(url);
			toast.success("Tautan telah disalin");
		} catch (err) {
			console.error("Failed to copy: ", err);
			toast.error("Gagal menyalin tautan");
		}
	};

	return (
		<Button variant="ghost" onClick={handleShare} className={cn("gap-2", className)} {...props}>
			<Share className="h-4 w-4" />
			{showLabel && <span>{label}</span>}
		</Button>
	);
};
