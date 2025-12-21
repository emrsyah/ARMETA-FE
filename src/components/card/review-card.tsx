import { Bookmark, Flag, Heart, MessageCircle, FileText, Ghost } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../ui/card"
import { Button } from "../ui/button"
import { useLikeUlasan, useUnlikeUlasan, useBookmarkUlasan, useRemoveBookmark } from "@/lib/queries/ulasan"
import { useState, useEffect } from "react"
import { Link } from "@tanstack/react-router"
import { Badge } from "../ui/badge"
import { ShareButton } from "../share-button"
import { ReportDialog } from "../report-dialog"
import { cn } from "@/lib/utils"
import ImageLightbox from "../image-lightbox"

type Props = {
    id: string;
    userName: string;
    avatarUrl?: string;
    avatarFallback: string;
    title: string;
    content: string;
    files: string[];
    commentCount: number;
    bookmarkCount: number;
    likeCount: number;
    isLiked?: boolean;
    isBookmarked?: boolean;
    isReply?: boolean;
    subjectName?: string;
    type?: 'dosen' | 'matkul';
    isAnonymous?: boolean;
}

const ReviewCard = ({
    id,
    userName,
    avatarUrl,
    avatarFallback,
    title,
    content,
    files,
    commentCount,
    bookmarkCount,
    likeCount,
    isLiked = false,
    isBookmarked = false,
    isReply = false,
    subjectName,
    type,
    isAnonymous = false,
}: Props) => {
    const [liked, setLiked] = useState(isLiked)
    const [bookmarked, setBookmarked] = useState(isBookmarked)
    const [currentLikeCount, setCurrentLikeCount] = useState(likeCount)
    const [currentBookmarkCount, setCurrentBookmarkCount] = useState(bookmarkCount)
    const [isReportDialogOpen, setIsReportDialogOpen] = useState(false)
    const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null)

    useEffect(() => {
        setLiked(isLiked)
        setBookmarked(isBookmarked)
        setCurrentLikeCount(likeCount)
        setCurrentBookmarkCount(bookmarkCount)
    }, [isLiked, isBookmarked, likeCount, bookmarkCount])

    const likeMutation = useLikeUlasan()
    const unlikeMutation = useUnlikeUlasan()
    const bookmarkMutation = useBookmarkUlasan()
    const removeBookmarkMutation = useRemoveBookmark()

    const handleLike = async () => {
        if (liked) {
            setLiked(false)
            setCurrentLikeCount((prev) => prev - 1)
            try {
                await unlikeMutation.mutateAsync({ id_review: id })
            } catch {
                // Revert on error
                setLiked(true)
                setCurrentLikeCount((prev) => prev + 1)
            }
        } else {
            setLiked(true)
            setCurrentLikeCount((prev) => prev + 1)
            try {
                await likeMutation.mutateAsync({ id_review: id })
            } catch {
                // Revert on error
                setLiked(false)
                setCurrentLikeCount((prev) => prev - 1)
            }
        }
    }

    const handleBookmark = async () => {
        if (bookmarked) {
            setBookmarked(false)
            setCurrentBookmarkCount((prev) => prev - 1)
            try {
                await removeBookmarkMutation.mutateAsync({ id_review: id })
            } catch {
                // Revert on error
                setBookmarked(true)
                setCurrentBookmarkCount((prev) => prev + 1)
            }
        } else {
            setBookmarked(true)
            setCurrentBookmarkCount((prev) => prev + 1)
            try {
                await bookmarkMutation.mutateAsync({ id_review: id })
            } catch {
                // Revert on error
                setBookmarked(false)
                setCurrentBookmarkCount((prev) => prev - 1)
            }
        }
    }

    const isImage = (file: string) => /\.(jpg|jpeg|png|webp|avif|gif|svg)$/i.test(file);
    const getFileName = (url: string) => url.split('/').pop() || 'File';

    return (
        <Card>
            <CardHeader className="flex items-center justify-between w-full">
                <CardTitle className="flex items-center gap-3 cursor-pointer group">
                    <Avatar>
                        <AvatarImage src={isAnonymous ? undefined : avatarUrl} />
                        <AvatarFallback>{isAnonymous ? "?" : avatarFallback}</AvatarFallback>
                    </Avatar>
                    <span className="transition-all group-hover:underline flex items-center gap-1.5">
                        {isAnonymous ? "Anonim" : userName}
                        {isAnonymous && <Ghost className="size-3.5 text-muted-foreground" />}
                    </span>
                </CardTitle>
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={() => setIsReportDialogOpen(true)}>
                        <Flag className="h-4 w-4" />
                    </Button>
                    <ReportDialog
                        isOpen={isReportDialogOpen}
                        onClose={() => setIsReportDialogOpen(false)}
                        reviewId={id}
                        title="Laporkan Ulasan"
                    />
                </div>
            </CardHeader>
            <CardContent className="flex items-start gap-8">
                <div className="w-full">
                    {!isReply ? (
                        <div className="flex flex-col gap-2">
                            {type ? (
                                <Badge variant={'outline'}>{type === 'dosen' ? 'Dosen' : "Matkul"}: {subjectName}</Badge>
                            ) : null}
                            <Link to="/a/ulasan/$ulasanId" params={{ ulasanId: id }} search={{ focus: false }}>
                                <h3 className="text-xl font-bold line-clamp-3 cursor-pointer hover:underline">{title == "" ? "No Title" : title}</h3>
                            </Link>
                        </div>
                    ) : null}
                    <p className={`  leading-relaxed text-justify line-clamp-5 ${isReply ? 'text-base text-gray-950' : 'text-sm text-gray-500'}`}>{content}</p>
                </div>
                {files && files.length > 0 && (
                    <div className="shrink-0 w-64 gap-1 rounded-lg overflow-hidden">
                        {files.length === 1 ? (
                            <div
                                className="block w-full cursor-pointer hover:opacity-90 transition-opacity"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (isImage(files[0])) setSelectedImageIndex(0);
                                    else window.open(files[0], '_blank');
                                }}
                            >
                                {isImage(files[0]) ? (
                                    <img
                                        src={files[0]}
                                        alt="Review attachment"
                                        className="w-full h-32 object-cover rounded-lg"
                                    />
                                ) : (
                                    <div className="w-full h-32 bg-gray-100 rounded-lg flex flex-col items-center justify-center p-4 text-gray-500 border border-gray-200">
                                        <FileText className="h-8 w-8 mb-2" />
                                        <span className="text-xs text-center truncate w-full px-2">{getFileName(files[0])}</span>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className={`grid gap-1 ${files.length === 2 ? 'grid-cols-2' : 'grid-cols-3 grid-rows-2'}`}>
                                {files.slice(0, 4).map((file, index) => (
                                    <div
                                        key={index}
                                        className={`cursor-pointer hover:opacity-90 transition-opacity block ${index === 0 && files.length > 1 ? 'col-span-3 row-span-1' : 'col-span-1'
                                            }`}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            if (isImage(file)) setSelectedImageIndex(index);
                                            else window.open(file, '_blank');
                                        }}
                                    >
                                        {isImage(file) ? (
                                            <img
                                                src={file}
                                                alt={`Review attachment ${index + 1}`}
                                                className={`w-full object-cover rounded ${index === 0 && files.length > 1 ? 'h-24' : 'h-16'
                                                    }`}
                                            />
                                        ) : (
                                            <div className={`w-full bg-gray-100 rounded flex flex-col items-center justify-center p-2 text-gray-500 border border-gray-200 ${index === 0 && files.length > 1 ? 'h-24' : 'h-16'
                                                }`}>
                                                <FileText className="h-4 w-4 mb-1" />
                                                <span className="text-[10px] text-center truncate w-full">{index === 0 && files.length > 1 ? getFileName(file) : 'PDF'}</span>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
                <ImageLightbox
                    images={files.filter(isImage)}
                    initialIndex={selectedImageIndex !== null ? files.filter(isImage).indexOf(files[selectedImageIndex]) : 0}
                    isOpen={selectedImageIndex !== null}
                    onClose={() => setSelectedImageIndex(null)}
                />
            </CardContent>
            <CardFooter className="flex items-center justify-between">
                {!isReply ? (
                    <Link to="/a/ulasan/$ulasanId" params={{ ulasanId: id }} search={{ focus: true }}>
                        <Button variant="ghost">
                            <MessageCircle className="h-4 w-4" />
                            <span>{commentCount}</span>
                        </Button>
                    </Link>
                ) : null}
                {!isReply ? (
                    <Button
                        variant="ghost"
                        onClick={handleBookmark}
                        disabled={bookmarkMutation.isPending || removeBookmarkMutation.isPending}
                        className={bookmarked ? 'text-primary' : ''}
                    >
                        <Bookmark className={cn("h-4 w-4", bookmarked && 'fill-current')} />
                        <span>{currentBookmarkCount}</span>
                    </Button>
                ) : null}
                <Button
                    variant="ghost"
                    onClick={handleLike}
                    disabled={likeMutation.isPending || unlikeMutation.isPending}
                    className={liked ? 'text-red-500' : ''}
                >
                    <Heart className={cn("h-4 w-4", liked && 'fill-current')} />
                    <span>{currentLikeCount}</span>
                </Button>
                <ShareButton url={`${window.location.origin}/a/ulasan/${id}`} />
            </CardFooter>
        </Card>
    )
}

export default ReviewCard
