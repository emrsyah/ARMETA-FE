import { createFileRoute, Link } from '@tanstack/react-router'
import { useForumDetail, useLikeForum, useUnlikeForum, useBookmarkForum, useUnbookmarkForum } from '@/lib/queries/forum'
import { useCreateUlasan } from '@/lib/queries/ulasan'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/input'
import { motion, LayoutGroup } from 'motion/react'
import {
  ArrowLeft,
  Bookmark,
  Flag,
  Heart,
  MessageCircle,
  Share,
  Send,
} from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import ReviewCard from '@/components/card/review-card'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/(app)/a/forum/$forumId')({
  validateSearch: (search: Record<string, unknown>) => {
    return {
      focus: search.focus === true || search.focus === 'true'
    }
  },
  component: ForumDetailPage,
})

// Helper to get initials from name
const getInitials = (name: string | null | undefined) => {
  if (!name) return '?'
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

function ForumDetailPage() {
  const { forumId } = Route.useParams()
  const { data: forum, isLoading: isForumLoading } = useForumDetail(forumId)

  const [replyText, setReplyText] = useState('')
  const createUlasanMutation = useCreateUlasan()

  // Local state for optimistic updates
  const [localIsLiked, setLocalIsLiked] = useState(false)
  const [localLikeCount, setLocalLikeCount] = useState(0)
  const [localIsBookmarked, setLocalIsBookmarked] = useState(false)
  const [localBookmarkCount, setLocalBookmarkCount] = useState(0)

  // Sync with forum data when it changes
  useEffect(() => {
    if (forum) {
      setLocalIsLiked(forum.is_liked)
      setLocalLikeCount(forum.total_like)
      setLocalIsBookmarked(forum.is_bookmarked)
      setLocalBookmarkCount(forum.total_bookmark)
    }
  }, [forum])

  const { focus } = Route.useSearch()
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (focus && !isForumLoading && inputRef.current) {
      inputRef.current.focus()
    }
  }, [focus, isForumLoading])

  // Mutations
  const likeMutation = useLikeForum()
  const unlikeMutation = useUnlikeForum()
  const bookmarkMutation = useBookmarkForum()
  const unbookmarkMutation = useUnbookmarkForum()

  const handleLike = () => {
    if (localIsLiked) {
      setLocalIsLiked(false)
      setLocalLikeCount(prev => Math.max(0, prev - 1))
      unlikeMutation.mutate(forumId, {
        onError: () => {
          setLocalIsLiked(true)
          setLocalLikeCount(prev => prev + 1)
        }
      })
    } else {
      setLocalIsLiked(true)
      setLocalLikeCount(prev => prev + 1)
      likeMutation.mutate(forumId, {
        onError: () => {
          setLocalIsLiked(false)
          setLocalLikeCount(prev => Math.max(0, prev - 1))
        }
      })
    }
  }

  const handleBookmark = () => {
    if (localIsBookmarked) {
      setLocalIsBookmarked(false)
      setLocalBookmarkCount(prev => Math.max(0, prev - 1))
      unbookmarkMutation.mutate(forumId, {
        onError: () => {
          setLocalIsBookmarked(true)
          setLocalBookmarkCount(prev => prev + 1)
        }
      })
    } else {
      setLocalIsBookmarked(true)
      setLocalBookmarkCount(prev => prev + 1)
      bookmarkMutation.mutate(forumId, {
        onError: () => {
          setLocalIsBookmarked(false)
          setLocalBookmarkCount(prev => Math.max(0, prev - 1))
        }
      })
    }
  }

  const handleSubmitReply = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!replyText.trim() || createUlasanMutation.isPending) return

    try {
      await createUlasanMutation.mutateAsync({
        judulUlasan: 'reply',
        textUlasan: replyText,
        idForum: forumId,
      })
      setReplyText('')
    } catch (error) {
      console.error('Failed to submit reply:', error)
    }
  }

  if (isForumLoading) {
    return <ForumDetailSkeleton />
  }

  return (
    <LayoutGroup>
      <div className="space-y-6 pb-60">
        {/* Back button */}
        <Link
          to="/a/forum"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali ke Forum
        </Link>

        {/* Forum Detail Card */}
        <Card className="overflow-hidden">
          <CardHeader className="border-b bg-gradient-to-r from-slate-50 to-gray-50">
            <div className="flex items-start justify-between">
              <div className="space-y-3">
                {/* Tags */}
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">Diskusi</Badge>
                  <Badge variant="outline">Umum</Badge>
                </div>
                {/* Title */}
                <h1 className="text-2xl font-bold text-gray-900">
                  {forum?.title || 'Forum Title'}
                </h1>
              </div>
              <Button variant="ghost" size="icon">
                <Flag className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="pt-6">
            {/* Description */}
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-700 leading-relaxed">
                {forum?.description || 'Tidak ada deskripsi untuk forum ini.'}
              </p>
            </div>

            <Separator className="my-6" />

            {/* Author & Meta */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={forum?.user?.image ?? undefined} />
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {getInitials(forum?.user?.name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-sm">{forum?.user?.name ?? 'Anonymous'}</p>
                  <p className="text-xs text-muted-foreground">
                    {forum?.created_at
                      ? new Date(forum.created_at).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })
                      : 'Tanggal tidak tersedia'}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>

          <CardFooter className="border-t bg-gray-50/50 py-3">
            <div className="flex items-center gap-2 w-full">
              <Button variant="ghost" size="sm" className="gap-2">
                <MessageCircle className="h-4 w-4" />
                <span>{forum?.total_reply ?? 0} Balasan</span>
              </Button>
              <Button variant="ghost" size="sm" className="gap-2" onClick={handleBookmark}>
                <Bookmark className={cn("h-4 w-4", localIsBookmarked && "fill-current text-yellow-500")} />
                <span>{localBookmarkCount} Simpan</span>
              </Button>
              <Button variant="ghost" size="sm" className="gap-2" onClick={handleLike}>
                <Heart className={cn("h-4 w-4", localIsLiked && "fill-current text-red-500")} />
                <span>{localLikeCount} Suka</span>
              </Button>
              <Button variant="ghost" size="sm" className="gap-2 ml-auto">
                <Share className="h-4 w-4" />
                <span>Bagikan</span>
              </Button>
            </div>
          </CardFooter>
        </Card>

        {/* Reply Input Form */}
        <motion.div
          layoutId="create-forum-reply-input"
          transition={{
            type: 'spring',
            stiffness: 350,
            damping: 30,
          }}
        >
          <Card className="overflow-hidden border-primary/20 shadow-sm">
            <CardContent className="py-4">
              <form onSubmit={handleSubmitReply} className="flex items-center gap-3">
                <Input
                  ref={inputRef}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Tulis balasan untuk diskusi ini..."
                  className="flex-1 bg-gray-50 focus-visible:ring-primary/20 border-gray-200"
                  disabled={createUlasanMutation.isPending}
                />
                <Button
                  type="submit"
                  size="icon"
                  className={cn(
                    "shrink-0 transition-all",
                    replyText.trim() ? "bg-primary text-white" : "bg-gray-100 text-gray-400"
                  )}
                  disabled={!replyText.trim() || createUlasanMutation.isPending}
                >
                  <Send className={cn("h-4 w-4", createUlasanMutation.isPending && "animate-pulse")} />
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>

        {/* Replies Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">
              Balasan ({forum?.reviews?.length || 0})
            </h2>
          </div>

          {forum?.reviews && forum.reviews.length > 0 ? (
            forum.reviews.map((reply) => (
              <ReviewCard
                key={reply.id_review}
                id={reply.id_review}
                userName={reply.user?.name ?? 'Anonymous'}
                avatarUrl={reply.user?.image ?? undefined}
                avatarFallback={getInitials(reply.user?.name)}
                title={reply.title ?? ''}
                content={reply.body ?? ''}
                files={reply.files ?? []}
                commentCount={reply.total_reply || 0}
                bookmarkCount={reply.total_bookmark || 0}
                likeCount={reply.total_like || 0}
                isReply={true}
              />
            ))
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <MessageCircle className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                <p className="text-muted-foreground">
                  Belum ada balasan untuk forum ini.
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Jadilah yang pertama memulai diskusi!
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </LayoutGroup>
  )
}

function ForumDetailSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-5 w-32" />
      <Card>
        <CardHeader className="space-y-4">
          <div className="flex gap-2">
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-6 w-16" />
          </div>
          <Skeleton className="h-8 w-3/4" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
          <Separator className="my-6" />
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-32" />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <div className="flex gap-4">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-8 w-24" />
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
