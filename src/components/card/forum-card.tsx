import { Flag, MessageCircle, Bookmark, Heart, Ghost, FileText, MoreHorizontal, Pencil, Trash2 } from "lucide-react"
import { Button } from "../ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card"
import { Badge } from "../ui/badge"
import { Separator } from "../ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Link } from "@tanstack/react-router"
import { cn } from "@/lib/utils"
import { ShareButton } from "../share-button"
import type { Forum } from "@/lib/schemas/forum.schema"
import { useLikeForum, useUnlikeForum, useBookmarkForum, useUnbookmarkForum, useDeleteForum } from "@/lib/queries/forum"
import { useState, useEffect } from "react"
import { ReportDialog } from "../report-dialog"
import ImageLightbox from "../image-lightbox"
import { toast } from "sonner"
import { useProfile } from "@/lib/queries"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "../ui/dialog"
import CreateForumModal from "../create-forum-modal"

export type ForumReply = {
    authorName: string
    content: string
}

export type ForumCardProps = Forum & {
    replies?: ForumReply[]
    isAnonymous?: boolean;
}

// Helper to format date
const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    })
}

// Helper to get initials from name
const getInitials = (name: string | null) => {
    if (!name) return '?'
    return name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
}

const ForumCard = ({
    id_forum,
    id_user,
    title,
    description,
    id_subject,
    subject_name,
    user,
    created_at,
    total_like,
    total_bookmark,
    total_reply,
    is_liked,
    is_bookmarked,
    files,
    isAnonymous = false,
    replies = [],
}: ForumCardProps) => {
    // Auth
    const { data: currentUser } = useProfile()
    const isOwner = currentUser?.id_user === id_user

    // Local state for optimistic updates
    const [localIsLiked, setLocalIsLiked] = useState(is_liked)
    const [localLikeCount, setLocalLikeCount] = useState(total_like)
    const [localIsBookmarked, setLocalIsBookmarked] = useState(is_bookmarked)
    const [localBookmarkCount, setLocalBookmarkCount] = useState(total_bookmark)
    const [isReportDialogOpen, setIsReportDialogOpen] = useState(false)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null)
    const [isExpanded, setIsExpanded] = useState(false)

    // Sync with props when they change (e.g., from refetch)
    useEffect(() => {
        setLocalIsLiked(is_liked)
        setLocalLikeCount(total_like)
        setLocalIsBookmarked(is_bookmarked)
        setLocalBookmarkCount(total_bookmark)
    }, [is_liked, total_like, is_bookmarked, total_bookmark])

    // Ensure files is an array (handle case where it might be a JSON string or null)
    const normalizedFiles = Array.isArray(files)
        ? files
        : typeof files === 'string'
            ? (() => {
                try {
                    return JSON.parse(files) as string[]
                } catch {
                    return []
                }
            })()
            : []

    // Mutations
    const likeMutation = useLikeForum()
    const unlikeMutation = useUnlikeForum()
    const bookmarkMutation = useBookmarkForum()
    const unbookmarkMutation = useUnbookmarkForum()
    const deleteForumMutation = useDeleteForum()

    const handleLike = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()

        if (localIsLiked) {
            // Optimistic unlike
            setLocalIsLiked(false)
            setLocalLikeCount(prev => Math.max(0, prev - 1))
            unlikeMutation.mutate(id_forum, {
                onError: () => {
                    // Revert on error
                    setLocalIsLiked(true)
                    setLocalLikeCount(prev => prev + 1)
                }
            })
        } else {
            // Optimistic like
            setLocalIsLiked(true)
            setLocalLikeCount(prev => prev + 1)
            likeMutation.mutate(id_forum, {
                onError: () => {
                    // Revert on error
                    setLocalIsLiked(false)
                    setLocalLikeCount(prev => Math.max(0, prev - 1))
                }
            })
        }
    }

    const handleBookmark = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()

        if (localIsBookmarked) {
            // Optimistic unbookmark
            setLocalIsBookmarked(false)
            setLocalBookmarkCount(prev => Math.max(0, prev - 1))
            toast.success("Forum berhasil dihapus dari bookmark")
            unbookmarkMutation.mutate(id_forum, {
                onError: () => {
                    // Revert on error
                    setLocalIsBookmarked(true)
                    setLocalBookmarkCount(prev => prev + 1)
                    toast.error("Gagal menghapus forum dari bookmark")
                }
            })
        } else {
            // Optimistic bookmark
            setLocalIsBookmarked(true)
            setLocalBookmarkCount(prev => prev + 1)
            toast.success("Forum berhasil ditambahkan ke bookmark")
            bookmarkMutation.mutate(id_forum, {
                onError: () => {
                    // Revert on error
                    setLocalIsBookmarked(false)
                    setLocalBookmarkCount(prev => Math.max(0, prev - 1))
                    toast.error("Gagal menambahkan forum ke bookmark")
                }
            })
        }
    }

    const handleDelete = async () => {
        try {
            await deleteForumMutation.mutateAsync(id_forum)
            toast.success("Forum berhasil dihapus")
            setIsDeleteDialogOpen(false)
        } catch (error) {
            toast.error("Gagal menghapus forum")
        }
    }

    const isImage = (file: string) => /\.(jpg|jpeg|png|webp|avif|gif|svg)$/i.test(file);
    const getFileName = (url: string) => url.split('/').pop() || 'File';

    return (
        <Card>
            <CardHeader className="flex items-center justify-between w-full min-w-0">
                <div className="flex items-center gap-2 min-w-0 overflow-hidden">
                    {subject_name && (
                        <Badge variant={'secondary'}>{subject_name}</Badge>
                    )}
                </div>
                <div className="flex items-center gap-1">
                    {isOwner ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-40">
                                <DropdownMenuItem onClick={() => setIsEditDialogOpen(true)} className="gap-2 cursor-pointer">
                                    <Pencil className="h-4 w-4" />
                                    <span>Edit</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => setIsDeleteDialogOpen(true)}
                                    className="gap-2 cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10"
                                >
                                    <Trash2 className="h-4 w-4" />
                                    <span>Hapus</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <Button variant="ghost" size="icon" onClick={() => setIsReportDialogOpen(true)} className="h-8 w-8 rounded-full">
                            <Flag className="h-4 w-4 text-muted-foreground" />
                        </Button>
                    )}

                    <ReportDialog
                        isOpen={isReportDialogOpen}
                        onClose={() => setIsReportDialogOpen(false)}
                        forumId={id_forum}
                        title="Laporkan Forum"
                    />

                    <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Apakah Anda yakin?</DialogTitle>
                                <DialogDescription>
                                    Tindakan ini tidak dapat dibatalkan. Forum Anda akan dihapus secara permanen.
                                </DialogDescription>
                            </DialogHeader>
                            <DialogFooter className="gap-2">
                                <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Batal</Button>
                                <Button variant="destructive" onClick={handleDelete} loading={deleteForumMutation.isPending}>
                                    Hapus
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>

                    <CreateForumModal
                        open={isEditDialogOpen}
                        onOpenChange={setIsEditDialogOpen}
                        editData={{
                            id_forum,
                            title,
                            description: description ?? undefined,
                            id_subject: id_subject ?? '',
                            isAnonymous
                        }}
                    />
                </div>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
                <Link to="/a/forum/$forumId" params={{ forumId: id_forum }} search={{ focus: false }}>
                    <h3 className="text-lg font-semibold line-clamp-2 cursor-pointer hover:underline break-all">{title}</h3>
                </Link>
                {description && (
                    <div className="relative">
                        <p className={cn(
                            "text-sm text-muted-foreground leading-relaxed transition-all duration-300 break-all",
                            !isExpanded && "line-clamp-3"
                        )}>
                            {description}
                        </p>
                        {description.length > 150 && (
                            <button
                                onClick={(e) => {
                                    e.preventDefault()
                                    e.stopPropagation()
                                    setIsExpanded(!isExpanded)
                                }}
                                className="text-primary text-xs font-semibold mt-1 hover:underline focus:outline-none"
                            >
                                {isExpanded ? "Sembunyikan" : "Baca Selengkapnya"}
                            </button>
                        )}
                    </div>
                )}
                {replies.length > 0 && (
                    <div className="flex gap-3">
                        <Separator orientation="vertical" className="h-2 w-2 bg-gray-200" />
                        <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                            {replies.map((reply, index) => (
                                <div key={index}>
                                    <span className="text-blue-500 font-medium">{reply.authorName}:</span>{" "}
                                    <span>{reply.content}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                {/* Image Attachments */}
                {normalizedFiles.length > 0 && (
                    <div className="mt-2 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                        {normalizedFiles.map((file, index) => (
                            <div
                                key={index}
                                className="shrink-0 cursor-pointer hover:opacity-90 transition-opacity"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (isImage(file)) setSelectedImageIndex(index);
                                    else window.open(file, '_blank');
                                }}
                            >
                                {isImage(file) ? (
                                    <img
                                        src={file}
                                        alt={`Forum attachment ${index + 1}`}
                                        className="h-20 w-32 object-cover rounded-md border border-gray-100"
                                    />
                                ) : (
                                    <div className="h-20 w-32 bg-gray-50 rounded-md flex flex-col items-center justify-center p-2 text-gray-400 border border-gray-100">
                                        <FileText className="h-6 w-6 mb-1" />
                                        <span className="text-[10px] text-center truncate w-full">{getFileName(file)}</span>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
                <ImageLightbox
                    images={normalizedFiles.filter(isImage)}
                    initialIndex={selectedImageIndex !== null ? normalizedFiles.filter(isImage).indexOf(normalizedFiles[selectedImageIndex] as string) : 0}
                    isOpen={selectedImageIndex !== null}
                    onClose={() => setSelectedImageIndex(null)}
                />
            </CardContent>
            <CardFooter className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Link to="/a/forum/$forumId" params={{ forumId: id_forum }} search={{ focus: true }}>
                        <Button variant="ghost">
                            <MessageCircle />
                            <span>{total_reply}</span>
                        </Button>
                    </Link>
                    <Button variant="ghost" onClick={handleBookmark}>
                        <Bookmark className={cn(localIsBookmarked && "fill-current text-yellow-500")} />
                        <span>{localBookmarkCount}</span>
                    </Button>
                    <Button variant="ghost" onClick={handleLike}>
                        <Heart className={cn(localIsLiked && "fill-current text-red-500")} />
                        <span>{localLikeCount}</span>
                    </Button>
                    <ShareButton url={`${window.location.origin}/a/forum/${id_forum}`} />
                </div>
                <div className="flex items-center gap-3">
                    {!isAnonymous && user.id_user ? (
                        <Link
                            to="/a/u/$userId"
                            params={{ userId: user.id_user }}
                            className="flex items-center gap-3 transition-all cursor-pointer group"
                        >
                            <Avatar>
                                <AvatarImage src={user.image ?? undefined} />
                                <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                            </Avatar>
                            <span className="text-sm font-semibold flex items-center gap-1.5 transition-all group-hover:underline">
                                {user.name ?? 'Anonymous'}
                            </span>
                        </Link>
                    ) : (
                        <div className="flex items-center gap-3 transition-all">
                            <Avatar>
                                <AvatarImage src={undefined} />
                                <AvatarFallback>{isAnonymous ? "?" : getInitials(user.name)}</AvatarFallback>
                            </Avatar>
                            <span className="text-sm font-semibold flex items-center gap-1.5 transition-all">
                                {isAnonymous ? "Anonim" : user.name ?? 'Anonymous'}
                                {isAnonymous && <Ghost className="size-3.5 text-muted-foreground" />}
                            </span>
                        </div>
                    )}
                    <p className="text-sm text-muted-foreground ">{formatDate(created_at)}</p>
                </div>
            </CardFooter>
        </Card>
    )
}

export default ForumCard