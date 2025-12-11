import { Bookmark, Flag, Heart, MessageCircle, Share } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../ui/card"
import { Button } from "../ui/button"
import { useLikeUlasan, useUnlikeUlasan, useBookmarkUlasan, useRemoveBookmark } from "@/lib/queries/ulasan"
import { useState } from "react"
import { Link } from "@tanstack/react-router"

type Props = {
    id: string;
    userName: string;
    avatarUrl?: string;
    avatarFallback: string;
    title: string;
    content: string;
    images: string[];
    commentCount: number;
    bookmarkCount: number;
    likeCount: number;
    isLiked?: boolean;
    isBookmarked?: boolean;
    onReport?: () => void;
}

const ReviewCard = ({
    id,
    userName,
    avatarUrl,
    avatarFallback,
    title,
    content,
    images,
    commentCount,
    bookmarkCount,
    likeCount,
    isLiked = false,
    isBookmarked = false,
    onReport,
}: Props) => {
    const [liked, setLiked] = useState(isLiked)
    const [bookmarked, setBookmarked] = useState(isBookmarked)
    const [currentLikeCount, setCurrentLikeCount] = useState(likeCount)
    const [currentBookmarkCount, setCurrentBookmarkCount] = useState(bookmarkCount)

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
                <div>
                    <Link to="/a/ulasan/$ulasanId" params={{ ulasanId: id }}>
                        <h3 className="text-xl font-bold line-clamp-3 cursor-pointer hover:underline">{title}</h3>
                    </Link>
                    <p className="text-sm mt-2 text-gray-500 leading-relaxed text-justify line-clamp-5">{content}</p>
                </div>
                {images.length > 0 && (
                    <div className="shrink-0 w-64 gap-1 rounded-lg overflow-hidden">
                        {images.length === 1 ? (
                            <button
                                className="w-full cursor-pointer hover:opacity-90 transition-opacity"
                                onClick={() => console.log("Image 1 clicked")}
                            >
                                <img
                                    src={images[0]}
                                    alt="Review image 1"
                                    className="w-full h-32 object-cover rounded-lg"
                                />
                            </button>
                        ) : (
                            <div className={`grid gap-1 ${images.length === 2 ? 'grid-cols-2' : 'grid-cols-3 grid-rows-2'}`}>
                                {images.slice(0, 4).map((image, index) => (
                                    <button
                                        key={index}
                                        className={`cursor-pointer hover:opacity-90 transition-opacity ${index === 0 && images.length > 1 ? 'col-span-3 row-span-1' : 'col-span-1'
                                            }`}
                                        onClick={() => console.log(`Image ${index + 1} clicked`)}
                                    >
                                        <img
                                            src={image}
                                            alt={`Review image ${index + 1}`}
                                            className={`w-full object-cover rounded ${index === 0 && images.length > 1 ? 'h-24' : 'h-16'
                                                }`}
                                        />
                                    </button>
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
