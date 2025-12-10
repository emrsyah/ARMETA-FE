import { Bookmark, Flag, Heart, MessageCircle, Share } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"

type Props = {
    userName: string;
    avatarUrl?: string;
    avatarFallback: string;
    title: string;
    content: string;
    images: string[];
    commentCount: number;
    bookmarkCount: number;
    likeCount: number;
}

const ReviewCard = ({
    userName,
    avatarUrl,
    avatarFallback,
    title,
    content,
    images,
    commentCount,
    bookmarkCount,
    likeCount
}: Props) => {
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
                <Button variant="ghost" size="icon">
                    <Flag />
                </Button>
            </CardHeader>
            <CardContent className="flex items-start gap-8">
                <div>
                    <h3 className="text-xl font-bold line-clamp-3 cursor-pointer hover:underline">{title}</h3>
                    <p className="text-sm mt-2 text-gray-500  leading-relaxed text-justify line-clamp-5">{content}</p>
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
                                        className={`cursor-pointer hover:opacity-90 transition-opacity ${
                                            index === 0 && images.length > 1 ? 'col-span-3 row-span-1' : 'col-span-1'
                                        }`}
                                        onClick={() => console.log(`Image ${index + 1} clicked`)}
                                    >
                                        <img
                                            src={image}
                                            alt={`Review image ${index + 1}`}
                                            className={`w-full object-cover rounded ${
                                                index === 0 && images.length > 1 ? 'h-24' : 'h-16'
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
                <Button variant="ghost">
                    <Bookmark />
                    <span>{bookmarkCount}</span>
                </Button>
                <Button variant="ghost">
                    <Heart />
                    <span>{likeCount}</span>
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