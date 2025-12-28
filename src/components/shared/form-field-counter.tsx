import type { Control } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface FormFieldCounterProps {
	control: Control<any>;
	name: string;
	label: string;
	placeholder?: string;
	maxLength: number;
	type?: "input" | "textarea";
	className?: string;
	autoFocus?: boolean;
}

export const FormFieldCounter = ({
	control,
	name,
	label,
	placeholder,
	maxLength,
	type = "input",
	className,
	autoFocus,
}: FormFieldCounterProps) => {
	const Component = type === "input" ? Input : Textarea;

	return (
		<FormField
			name={name}
			control={control}
			render={({ field }) => (
				<FormItem>
					<FormLabel>{label}</FormLabel>
					<FormControl>
						<div className="relative min-w-0 w-full">
							<Component
								{...field}
								placeholder={placeholder}
								autoFocus={autoFocus}
								maxLength={maxLength}
								className={`${className} pr-12`}
							/>
							<div className="absolute right-2 bottom-2 text-[10px] text-muted-foreground/50 pointer-events-none">
								{field.value?.length || 0}/{maxLength}
							</div>
						</div>
					</FormControl>
					<FormMessage />
				</FormItem>
			)}
		/>
	);
};
