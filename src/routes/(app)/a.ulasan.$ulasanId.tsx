import { createFileRoute, Link } from '@tanstack/react-router'
import { useUlasanDetail, useLikeUlasan, useUnlikeUlasan, useBookmarkUlasan, useRemoveBookmark, useCreateUlasan } from '@/lib/queries/ulasan'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

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
  ImageIcon,
  Calendar,
  FileText,
} from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import ReviewCard from '@/components/card/review-card'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/(app)/a/ulasan/$ulasanId')({
  validateSearch: (search: Record<string, unknown>) => {
    return {
      focus: search.focus === true || search.focus === 'true'
    }
  },
  component: UlasanDetailPage,
})

function UlasanDetailPage() {
  const { ulasanId } = Route.useParams()
  const { data: ulasan, isLoading: isUlasanLoading, isFetching: isUlasanRefetching } = useUlasanDetail(ulasanId)

  const [replyText, setReplyText] = useState('')
  const createUlasanMutation = useCreateUlasan()
  const [liked, setLiked] = useState(false)
  const [bookmarked, setBookmarked] = useState(false)
  const [likeCount, setLikeCount] = useState(0)
  const [bookmarkCount, setBookmarkCount] = useState(0)
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null)

  const likeMutation = useLikeUlasan()
  const unlikeMutation = useUnlikeUlasan()
  const bookmarkMutation = useBookmarkUlasan()
  const removeBookmarkMutation = useRemoveBookmark()
  const { focus } = Route.useSearch()
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (focus && !isUlasanLoading && inputRef.current) {
      inputRef.current.focus()
    }
  }, [focus, isUlasanLoading])

  const isMutating = likeMutation.isPending || unlikeMutation.isPending || bookmarkMutation.isPending || removeBookmarkMutation.isPending

  useEffect(() => {
    if (ulasan && !isMutating && !isUlasanRefetching) {
      setLiked(!!ulasan.is_liked)
      setBookmarked(!!ulasan.is_bookmarked)
      setLikeCount(ulasan.total_likes ?? 0)
      setBookmarkCount(ulasan.total_bookmarks ?? 0)
    }
  }, [ulasan, isMutating, isUlasanRefetching])

  // Replies are now fetched with the ulasan detail
  const replies = ulasan?.replies || []

  const handleLike = async () => {
    if (liked) {
      setLiked(false)
      setLikeCount((prev) => prev - 1)
      try {
        await unlikeMutation.mutateAsync({ id_review: ulasanId })
      } catch {
        setLiked(true)
        setLikeCount((prev) => prev + 1)
      }
    } else {
      setLiked(true)
      setLikeCount((prev) => prev + 1)
      try {
        await likeMutation.mutateAsync({ id_review: ulasanId })
      } catch {
        setLiked(false)
        setLikeCount((prev) => prev - 1)
      }
    }
  }

  const handleBookmark = async () => {
    if (bookmarked) {
      setBookmarked(false)
      setBookmarkCount((prev) => prev - 1)
      try {
        await removeBookmarkMutation.mutateAsync({ id_review: ulasanId })
      } catch {
        setBookmarked(true)
        setBookmarkCount((prev) => prev + 1)
      }
    } else {
      setBookmarked(true)
      setBookmarkCount((prev) => prev + 1)
      try {
        await bookmarkMutation.mutateAsync({ id_review: ulasanId })
      } catch {
        setBookmarked(false)
        setBookmarkCount((prev) => prev - 1)
      }
    }
  }

  const handleSubmitReply = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!replyText.trim() || createUlasanMutation.isPending) return

    try {
      await createUlasanMutation.mutateAsync({
        judulUlasan: 'reply',
        textUlasan: replyText,
        idReply: ulasanId,
      })
      setReplyText('')
    } catch (error) {
      console.error('Failed to submit reply:', error)
    }
  }

  if (isUlasanLoading) {
    return <UlasanDetailSkeleton />
  }

  const isImage = (file: string) => /\.(jpg|jpeg|png|webp|avif|gif|svg)$/i.test(file);
  const getFileName = (url: string) => url.split('/').pop() || 'File';

  return (
    <LayoutGroup>

      {/* Image Lightbox */}
      {selectedImageIndex !== null && ulasan?.files && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setSelectedImageIndex(null)}
        >
          <button
            className="absolute top-4 right-4 text-white hover:text-gray-300"
            onClick={() => setSelectedImageIndex(null)}
          >
            ✕
          </button>
          <img
            src={ulasan.files[selectedImageIndex]}
            alt={`Image ${selectedImageIndex + 1}`}
            className="max-w-full max-h-full object-contain"
          />
          {/* Navigation buttons */}
          {ulasan.files.length > 1 && (
            <>
              <button
                className="absolute left-4 text-white hover:text-gray-300 text-2xl p-2"
                onClick={(e) => {
                  e.stopPropagation()
                  let newIndex = (selectedImageIndex - 1 + ulasan.files.length) % ulasan.files.length;
                  while (!isImage(ulasan.files[newIndex]) && newIndex !== selectedImageIndex) {
                    newIndex = (newIndex - 1 + ulasan.files.length) % ulasan.files.length;
                  }
                  setSelectedImageIndex(newIndex)
                }}
              >
                ←
              </button>
              <button
                className="absolute right-4 text-white hover:text-gray-300 text-2xl p-2"
                onClick={(e) => {
                  e.stopPropagation()
                  let newIndex = (selectedImageIndex + 1) % ulasan.files.length;
                  while (!isImage(ulasan.files[newIndex]) && newIndex !== selectedImageIndex) {
                    newIndex = (newIndex + 1) % ulasan.files.length;
                  }
                  setSelectedImageIndex(newIndex)
                }}
              >
                →
              </button>
            </>
          )}
        </div>
      )}

      <div className="space-y-6 pb-60">
        {/* Back button */}
        <Link
          to="/a/home"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali ke Beranda
        </Link>

        {/* Ulasan Detail Card */}
        <Card className="overflow-hidden">
          <CardHeader className="border-b">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={ulasan?.user?.image || ""} />
                  <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 text-primary font-medium">
                    {ulasan?.user?.name?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{ulasan?.user?.name}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <span>
                      {ulasan?.created_at
                        ? new Date(ulasan.created_at).toLocaleDateString(
                          'id-ID',
                          {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          }
                        )
                        : 'Tanggal tidak tersedia'}
                    </span>
                  </div>
                </div>
              </div>
              <Button variant="ghost" size="icon">
                <Flag className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="pt-6 space-y-6">
            {/* Title */}
            <h1 className="text-2xl font-bold text-gray-900">
              {ulasan?.title || 'Judul Ulasan'}
            </h1>

            {/* Content */}
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {ulasan?.body || 'Tidak ada konten.'}
              </p>
            </div>

            {/* Files */}
            {ulasan?.files && ulasan.files.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <ImageIcon className="h-4 w-4" />
                  <span>{ulasan.files.length} Lampiran</span>
                </div>
                <div
                  className={`grid gap-2 ${ulasan.files.length === 1
                    ? 'grid-cols-1'
                    : ulasan.files.length === 2
                      ? 'grid-cols-2'
                      : 'grid-cols-3'
                    }`}
                >
                  {ulasan.files.map((file, index) => {
                    if (isImage(file)) {
                      return (
                        <button
                          key={index}
                          className="relative aspect-video overflow-hidden rounded-lg group cursor-pointer"
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
                          <FileText className="h-12 w-12 text-gray-400 mb-2" />
                          <span className="text-sm text-gray-600 font-medium truncate w-full text-center">{getFileName(file)}</span>
                        </a>
                      )
                    }
                  })}
                </div>
              </div>
            )}
          </CardContent>

          <CardFooter className="border-t bg-gray-50/50 py-3">
            <div className="flex items-center gap-2 w-full">
              <Button variant="ghost" size="sm" className="gap-2">
                <MessageCircle className="h-4 w-4" />
                <span>{replies?.length || 0} Balasan</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className={`gap-2 ${bookmarked ? 'text-primary' : ''}`}
                onClick={handleBookmark}
                disabled={
                  bookmarkMutation.isPending || removeBookmarkMutation.isPending
                }
              >
                <Bookmark
                  className={`h-4 w-4 ${bookmarked ? 'fill-current' : ''}`}
                />
                <span>{bookmarkCount}</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className={`gap-2 ${liked ? 'text-red-500' : ''}`}
                onClick={handleLike}
                disabled={likeMutation.isPending || unlikeMutation.isPending}
              >
                <Heart className={`h-4 w-4 ${liked ? 'fill-current' : ''}`} />
                <span>{likeCount}</span>
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
          layoutId="create-review-input"
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
                  placeholder="Tulis balasan untuk ulasan ini..."
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
              Balasan ({replies?.length || 0})
            </h2>
          </div>

          {isUlasanLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Card key={i}>
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : replies && replies.length > 0 ? (
            replies.map((reply) => (
              <ReviewCard
                isReply
                key={reply.id_review}
                id={reply.id_review}
                userName={reply.user?.name || "User"}
                avatarUrl={reply.user?.image || undefined}
                avatarFallback={reply.user?.name?.charAt(0).toUpperCase() || "U"}
                title={reply.title || "" /* Title might be empty for replies */}
                content={reply.body || ""}
                files={reply.files}
                commentCount={reply.total_reply || 0}
                bookmarkCount={reply.total_bookmarks ?? 0}
                likeCount={reply.total_likes ?? 0}
                isLiked={!!reply.is_liked}
                isBookmarked={!!reply.is_bookmarked}
              />
            ))
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <MessageCircle className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                <p className="text-muted-foreground">
                  Belum ada balasan untuk ulasan ini.
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Jadilah yang pertama memberikan tanggapan!
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </LayoutGroup>
  )
}

function UlasanDetailSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-5 w-32" />
      <Card>
        <CardHeader className="space-y-4">
          <div className="flex items-center gap-3">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-32" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-48 w-full rounded-lg" />
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
