import { Ghost, Paperclip } from "lucide-react";
import type { Control } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";

interface PostActionsProps {
	control: Control<any>;
	onFileClick: () => void;
	filesCount: number;
	maxFiles?: number;
	isPending: boolean;
	submitLabel: string;
	showAnonymous?: boolean;
}

export const PostActions = ({
	control,
	onFileClick,
	filesCount,
	maxFiles = 4,
	isPending,
	submitLabel,
	showAnonymous = true,
}: PostActionsProps) => {
	return (
		<div className="flex items-center justify-between pt-2">
			<div className="flex items-center gap-3">
				<button
					type="button"
					disabled={filesCount >= maxFiles}
					onClick={onFileClick}
					className="text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
					title={filesCount >= maxFiles ? `Maksimal ${maxFiles} file` : "Lampirkan file"}
				>
					<Paperclip className="size-5" />
				</button>

				{showAnonymous && (
					<FormField
						control={control}
						name="isAnonymous"
						render={({ field }) => (
							<FormItem className="flex flex-row items-center space-x-2 space-y-0 text-muted-foreground">
								<FormControl>
									<Switch checked={field.value} onCheckedChange={field.onChange} />
								</FormControl>
								<div className="flex items-center gap-1.5 leading-none">
									<FormLabel className="text-sm font-medium cursor-pointer flex items-center gap-1">
										<Ghost className="size-3.5" />
										Anonim
									</FormLabel>
								</div>
							</FormItem>
						)}
					/>
				)}
			</div>

			<div className="flex gap-2">
				<Button size={"lg"} type="submit" loading={isPending}>
					{submitLabel}
				</Button>
			</div>
		</div>
	);
};
