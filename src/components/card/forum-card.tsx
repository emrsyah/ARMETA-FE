import { Flag, MessageCircle, Bookmark, Heart, Share } from "lucide-react"
import { Button } from "../ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card"
import { Badge } from "../ui/badge"
import { Separator } from "../ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Link } from "@tanstack/react-router"

export type ForumReply = {
    authorName: string
    content: string
}

export type ForumAuthor = {
    name: string
    avatar?: string
    initials: string
}

export type ForumCardProps = {
    id: string
    tags: string[]
    title: string
    description?: string
    replies: ForumReply[]
    commentCount: number
    bookmarkCount: number
    likeCount: number
    author: ForumAuthor
    timestamp: string
}

const ForumCard = ({
    id,
    tags,
    title,
    description,
    replies,
    commentCount,
    bookmarkCount,
    likeCount,
    author,
    timestamp,
}: ForumCardProps) => {
    return (
        <Card>
            <CardHeader className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                    {tags.map((tag, index) => (
                        <Badge key={index} variant={'secondary'}>{tag}</Badge>
                    ))}
                </div>
                <Button variant="ghost" size="icon">
                    <Flag />
                </Button>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
                <Link to="/a/forum/$forumId" params={{ forumId: id }}>
                    <h3 className="text-lg font-semibold line-clamp-2 cursor-pointer hover:underline">{title}</h3>
                </Link>
                {description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
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
            </CardContent>
            <CardFooter className="flex items-center justify-between">
                <div className="flex items-center gap-3">
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
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-3 cursor-pointer group">
                        <Avatar>
                            <AvatarImage src={author.avatar} />
                            <AvatarFallback>{author.initials}</AvatarFallback>
                        </Avatar>
                        <span className="transition-all font-semibold group-hover:underline">
                            {author.name}
                        </span>
                    </div>
                    <p className="text-sm text-muted-foreground ">{timestamp}</p>
                </div>
            </CardFooter>
        </Card>
    )
}

export default ForumCard