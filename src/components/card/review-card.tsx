import { Bookmark, Flag, Heart, MessageCircle, Share, FileText } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../ui/card"
import { Button } from "../ui/button"
import { useLikeUlasan, useUnlikeUlasan, useBookmarkUlasan, useRemoveBookmark } from "@/lib/queries/ulasan"
import { useState, useEffect } from "react"
import { Link } from "@tanstack/react-router"
import { Badge } from "../ui/badge"

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
    onReport?: () => void;
    isReply?: boolean;
    subjectName?: string;
    type?: 'dosen' | 'matkul'
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
    onReport,
    isReply = false,
    subjectName,
    type
}: Props) => {
    const [liked, setLiked] = useState(isLiked)
    const [bookmarked, setBookmarked] = useState(isBookmarked)
    const [currentLikeCount, setCurrentLikeCount] = useState(likeCount)
    const [currentBookmarkCount, setCurrentBookmarkCount] = useState(bookmarkCount)

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
                        <AvatarImage src={avatarUrl} />
                        <AvatarFallback>{avatarFallback}</AvatarFallback>
                    </Avatar>
                    <span className="transition-all group-hover:underline">
                        {userName}
                    </span>
                </CardTitle>
                <Button variant="ghost" size="icon" onClick={onReport}>
                    <Flag />
                </Button>
            </CardHeader>
            <CardContent className="flex items-start gap-8">
                <div className="w-full">
                    {!isReply ? (
                        <div className="flex flex-col gap-2">
                            {type ? (
                                <Badge variant={'outline'}>{type === 'dosen' ? 'Dosen' : "Matkul"}: {subjectName}</Badge>
                            ) : null}
                            <Link to="/a/ulasan/$ulasanId" params={{ ulasanId: id }}>
                                <h3 className="text-xl font-bold line-clamp-3 cursor-pointer hover:underline">{title == "" ? "No Title" : title}</h3>
                            </Link>
                        </div>
                    ) : null}
                    <p className="text-sm mt-2 text-gray-500 leading-relaxed text-justify line-clamp-5">{content}</p>
                </div>
                {files && files.length > 0 && (
                    <div className="shrink-0 w-64 gap-1 rounded-lg overflow-hidden">
                        {files.length === 1 ? (
                            <a
                                href={files[0]}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block w-full cursor-pointer hover:opacity-90 transition-opacity"
                                onClick={(e) => e.stopPropagation()}
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
                            </a>
                        ) : (
                            <div className={`grid gap-1 ${files.length === 2 ? 'grid-cols-2' : 'grid-cols-3 grid-rows-2'}`}>
                                {files.slice(0, 4).map((file, index) => (
                                    <a
                                        key={index}
                                        href={file}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`cursor-pointer hover:opacity-90 transition-opacity block ${index === 0 && files.length > 1 ? 'col-span-3 row-span-1' : 'col-span-1'
                                            }`}
                                        onClick={(e) => e.stopPropagation()}
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
                                    </a>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </CardContent>
            <CardFooter className="flex items-center justify-between">
                <Button variant="ghost">
                    <MessageCircle />
                    <span>{commentCount}</span>
                </Button>
                <Button
                    variant="ghost"
                    onClick={handleBookmark}
                    disabled={bookmarkMutation.isPending || removeBookmarkMutation.isPending}
                    className={bookmarked ? 'text-primary' : ''}
                >
                    <Bookmark className={bookmarked ? 'fill-current' : ''} />
                    <span>{currentBookmarkCount}</span>
                </Button>
                <Button
                    variant="ghost"
                    onClick={handleLike}
                    disabled={likeMutation.isPending || unlikeMutation.isPending}
                    className={liked ? 'text-red-500' : ''}
                >
                    <Heart className={liked ? 'fill-current' : ''} />
                    <span>{currentLikeCount}</span>
                </Button>
                <Button variant="ghost">
                    <Share />
                    <span>Bagikan</span>
                </Button>
            </CardFooter>
        </Card>
    )
}

export default ReviewCard
