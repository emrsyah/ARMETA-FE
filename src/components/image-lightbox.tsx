import { ChevronLeft, ChevronRight, Download, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useState } from "react";

interface ImageLightboxProps {
	images: string[];
	initialIndex: number;
	isOpen: boolean;
	onClose: () => void;
}

const ImageLightbox = ({ images, initialIndex, isOpen, onClose }: ImageLightboxProps) => {
	const [index, setIndex] = useState(initialIndex);

	useEffect(() => {
		if (isOpen) {
			setIndex(initialIndex);
			// Prevent body scroll when open
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "unset";
		}
		return () => {
			document.body.style.overflow = "unset";
		};
	}, [isOpen, initialIndex]);

	const handleNext = useCallback(
		() => setIndex((prev) => (prev + 1) % images.length),
		[images.length]
	);
	const handlePrev = useCallback(
		() => setIndex((prev) => (prev - 1 + images.length) % images.length),
		[images.length]
	);

	// Handle escape key and arrows
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (!isOpen) return;
			if (e.key === "Escape") onClose();
			if (e.key === "ArrowRight") handleNext();
			if (e.key === "ArrowLeft") handlePrev();
		};
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [isOpen, onClose, handleNext, handlePrev]);

	if (!isOpen) return null;

	return (
		<AnimatePresence>
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				exit={{ opacity: 0 }}
				className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center select-none"
				onClick={onClose}
			>
				{/* Header Controls */}
				<div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-[110]">
					<div className="text-white/70 text-sm font-medium">
						{index + 1} dari {images.length}
					</div>
					<div className="flex items-center gap-4">
						<a
							href={images[index]}
							target="_blank"
							rel="noopener noreferrer"
							onClick={(e) => e.stopPropagation()}
							className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-all text-white group"
							title="Download Original"
						>
							<Download size={20} className="group-hover:scale-110 transition-transform" />
						</a>
						<button
							type="button"
							onClick={onClose}
							className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-all text-white group"
							title="Close (Esc)"
						>
							<X size={20} className="group-hover:rotate-90 transition-transform" />
						</button>
					</div>
				</div>

				{/* Navigation Buttons */}
				{images.length > 1 && (
					<>
						<button
							type="button"
							onClick={(e) => {
								e.stopPropagation();
								handlePrev();
							}}
							className="absolute left-6 z-[110] p-4 bg-white/5 hover:bg-white/15 rounded-full transition-all text-white group"
						>
							<ChevronLeft size={32} className="group-hover:-translate-x-1 transition-transform" />
						</button>
						<button
							type="button"
							onClick={(e) => {
								e.stopPropagation();
								handleNext();
							}}
							className="absolute right-6 z-[110] p-4 bg-white/5 hover:bg-white/15 rounded-full transition-all text-white group"
						>
							<ChevronRight size={32} className="group-hover:translate-x-1 transition-transform" />
						</button>
					</>
				)}

				{/* Main Image Container */}
				<motion.div
					key={index}
					initial={{ scale: 0.9, opacity: 0, y: 20 }}
					animate={{ scale: 1, opacity: 1, y: 0 }}
					exit={{ scale: 0.9, opacity: 0, y: 20 }}
					transition={{ type: "spring", damping: 25, stiffness: 200 }}
					className="relative max-w-[90vw] max-h-[85vh] flex items-center justify-center"
					onClick={(e) => e.stopPropagation()}
				>
					<img
						src={images[index]}
						alt={`Attachment ${index + 1}`}
						className="max-w-full max-h-full object-contain shadow-[0_0_50px_rgba(0,0,0,0.5)] rounded-sm"
						style={{ pointerEvents: "auto" }}
					/>
				</motion.div>

				{/* Backdrop Glow */}
				<div className="absolute inset-0 z-[-1] overflow-hidden pointer-events-none">
					<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 blur-[120px] rounded-full opacity-50" />
				</div>
			</motion.div>
		</AnimatePresence>
	);
};

export default ImageLightbox;
