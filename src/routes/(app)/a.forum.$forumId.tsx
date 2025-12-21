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
  Send,
  Ghost,
} from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import ReviewCard from '@/components/card/review-card'
import { cn } from '@/lib/utils'
import { ShareButton } from '@/components/share-button'
import { ReportDialog } from '@/components/report-dialog'
import { FileText, ImageIcon } from 'lucide-react'
import ImageLightbox from '@/components/image-lightbox'

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
  const { data: forum, isLoading: isForumLoading, isError } = useForumDetail(forumId)

  const [replyText, setReplyText] = useState('')
  const createUlasanMutation = useCreateUlasan()

  // Local state for optimistic updates
  const [localIsLiked, setLocalIsLiked] = useState(false)
  const [localLikeCount, setLocalLikeCount] = useState(0)
  const [localIsBookmarked, setLocalIsBookmarked] = useState(false)
  const [localBookmarkCount, setLocalBookmarkCount] = useState(0)
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false)
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null)

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

  const isImage = (file: string) => /\.(jpg|jpeg|png|webp|avif|gif|svg)$/i.test(file);
  const getFileName = (url: string) => url.split('/').pop() || 'File';

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="relative">
          <Ghost className="h-24 w-24 text-muted-foreground/20" />
          <motion.div
            animate={{
              y: [0, -10, 0],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute -top-2 -right-2"
          >
            <div className="bg-primary/10 p-2 rounded-full">
              <MessageCircle className="h-6 w-6 text-primary/40" />
            </div>
          </motion.div>
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold tracking-tight">Forum Tidak Ditemukan</h2>
          <p className="text-muted-foreground max-w-sm mx-auto">
            Maaf, forum diskusi yang Anda cari tidak tersedia atau mungkin telah dihapus.
          </p>
        </div>
        <div className="flex gap-4">
          <Button variant="outline" asChild>
            <Link to="/a/forum">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Ke Daftar Forum
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <LayoutGroup>
      {/* Image Lightbox */}
      <ImageLightbox
        images={forum?.files?.filter(isImage) || []}
        initialIndex={selectedImageIndex !== null ? forum?.files?.filter(isImage).indexOf(forum.files[selectedImageIndex]) ?? 0 : 0}
        isOpen={selectedImageIndex !== null}
        onClose={() => setSelectedImageIndex(null)}
      />
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
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={() => setIsReportDialogOpen(true)}>
                  <Flag className="h-4 w-4" />
                </Button>
                <ReportDialog
                  isOpen={isReportDialogOpen}
                  onClose={() => setIsReportDialogOpen(false)}
                  forumId={forumId}
                  title="Laporkan Forum"
                />
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-6">
            {/* Content */}
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {forum?.description || 'Tidak ada deskripsi untuk forum ini.'}
              </p>
            </div>

            {/* Files Section */}
            {forum?.files && forum.files.length > 0 && (
              <div className="mt-6 space-y-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <ImageIcon className="h-4 w-4" />
                  <span>{forum.files.length} Lampiran</span>
                </div>
                <div
                  className={`grid gap-2 ${forum.files.length === 1
                    ? 'grid-cols-1'
                    : forum.files.length === 2
                      ? 'grid-cols-2'
                      : 'grid-cols-3'
                    }`}
                >
                  {forum.files.map((file, index) => {
                    if (isImage(file)) {
                      return (
                        <button
                          key={index}
                          className="relative aspect-video overflow-hidden rounded-lg group cursor-pointer border"
                          onClick={() => setSelectedImageIndex(index)}
                        >
                          <img
                            src={file}
                            alt={`Image ${index + 1}`}
                            className="w-full h-full object-cover transition-transform group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                        </button>
                      )
                    } else {
                      return (
                        <a
                          key={index}
                          href={file}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="relative aspect-video overflow-hidden rounded-lg group cursor-pointer border bg-gray-50 flex flex-col items-center justify-center p-4 hover:bg-gray-100 transition-colors"
                        >
                          <FileText className="h-10 w-10 text-gray-400 mb-2" />
                          <span className="text-sm text-gray-600 font-medium truncate w-full text-center">{getFileName(file)}</span>
                        </a>
                      )
                    }
                  })}
                </div>
              </div>
            )}

            <Separator className="my-6" />

            {/* Author & Meta */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={forum?.is_anonymous ? undefined : forum?.user?.image ?? undefined} />
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {forum?.is_anonymous ? "?" : getInitials(forum?.user?.name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-sm flex items-center gap-1.5">
                    {forum?.is_anonymous ? "Anonim" : forum?.user?.name ?? 'Anonymous'}
                    {forum?.is_anonymous && <Ghost className="size-3.5 text-muted-foreground" />}
                  </p>
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
              <ShareButton
                url={`${window.location.origin}/a/forum/${forumId}`}
                size="sm"
                className="gap-2 ml-auto"
              />
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
                isAnonymous={reply.is_anonymous}
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
