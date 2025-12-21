import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useUlasanDetail, useLikeUlasan, useUnlikeUlasan, useBookmarkUlasan, useRemoveBookmark, useCreateUlasan, useDeleteUlasan } from '@/lib/queries/ulasan'
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
  Send,
  ImageIcon,
  Calendar,
  FileText,
  Ghost,
  MoreHorizontal,
  Pencil,
  Trash2,
} from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import ReviewCard from '@/components/card/review-card'
import { cn } from '@/lib/utils'
import { ShareButton } from '@/components/share-button'
import { ReportDialog } from '@/components/report-dialog'
import ImageLightbox from '@/components/image-lightbox'
import { toast } from 'sonner'
import { useProfile } from '@/lib/queries'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import CreateReviewModal from '@/components/create-review-modal'

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
  const { data: ulasan, isLoading: isUlasanLoading, isFetching: isUlasanRefetching, isError } = useUlasanDetail(ulasanId)
  const { data: currentUser } = useProfile()
  const navigate = useNavigate()

  const [replyText, setReplyText] = useState('')
  const createUlasanMutation = useCreateUlasan()
  const deleteUlasanMutation = useDeleteUlasan()

  const [liked, setLiked] = useState(false)
  const [bookmarked, setBookmarked] = useState(false)
  const [likeCount, setLikeCount] = useState(0)
  const [bookmarkCount, setBookmarkCount] = useState(0)
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null)
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  const likeMutation = useLikeUlasan()
  const unlikeMutation = useUnlikeUlasan()
  const bookmarkMutation = useBookmarkUlasan()
  const removeBookmarkMutation = useRemoveBookmark()
  const { focus } = Route.useSearch()
  const inputRef = useRef<HTMLInputElement>(null)

  const isOwner = currentUser?.id_user === ulasan?.id_user

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
        toast.success("Ulasan berhasil dihapus dari bookmark")
      } catch {
        setBookmarked(true)
        setBookmarkCount((prev) => prev + 1)
        toast.error("Gagal menghapus ulasan dari bookmark")
      }
    } else {
      setBookmarked(true)
      setBookmarkCount((prev) => prev + 1)
      try {
        await bookmarkMutation.mutateAsync({ id_review: ulasanId })
        toast.success("Ulasan berhasil ditambahkan ke bookmark")
      } catch {
        setBookmarked(false)
        setBookmarkCount((prev) => prev - 1)
        toast.error("Gagal menambahkan ulasan ke bookmark")
      }
    }
  }

  const handleDelete = async () => {
    try {
      await deleteUlasanMutation.mutateAsync(ulasanId)
      toast.success("Ulasan berhasil dihapus")
      navigate({ to: '/a/home' })
    } catch (error) {
      toast.error("Gagal menghapus ulasan")
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
              <FileText className="h-6 w-6 text-primary/40" />
            </div>
          </motion.div>
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold tracking-tight">Ulasan Tidak Ditemukan</h2>
          <p className="text-muted-foreground max-w-sm mx-auto">
            Maaf, ulasan yang Anda cari tidak tersedia atau mungkin telah dihapus oleh pemiliknya.
          </p>
        </div>
        <div className="flex gap-4">
          <Button variant="outline" asChild>
            <Link to="/a/home">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Ke Beranda
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  const isImage = (file: string) => /\.(jpg|jpeg|png|webp|avif|gif|svg)$/i.test(file);
  const getFileName = (url: string) => url.split('/').pop() || 'File';

  return (
    <LayoutGroup>

      {/* Image Lightbox */}
      <ImageLightbox
        images={ulasan?.files?.filter(isImage) || []}
        initialIndex={selectedImageIndex !== null ? ulasan?.files?.filter(isImage).indexOf(ulasan.files[selectedImageIndex]) ?? 0 : 0}
        isOpen={selectedImageIndex !== null}
        onClose={() => setSelectedImageIndex(null)}
      />

      <div className="space-y-6 pb-60">
        {/* Back button */}
        <Link
          to="/a/home"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali ke Beranda
        </Link>

        {/* Parent Context (if it's a reply) */}
        {(() => {
          const parentSource = ulasan?.parent_source
          if (!parentSource) return null

          return (
            <div className="relative px-4 sm:px-0">
              {/* Connection Line */}
              <div className="absolute left-[30px] top-10 bottom-[-24px] w-0.5 bg-linear-to-b from-gray-200 to-gray-200 z-0" />

              {parentSource.type === 'review' ? (
                <Link
                  to="/a/ulasan/$ulasanId"
                  params={{ ulasanId: parentSource.id }}
                  search={{ focus: false }}
                  className="group block mb-6 relative z-10"
                >
                  <ParentPreview source={parentSource} />
                </Link>
              ) : (
                <Link
                  to="/a/forum/$forumId"
                  params={{ forumId: parentSource.id }}
                  search={{ focus: false }}
                  className="group block mb-6 relative z-10"
                >
                  <ParentPreview source={parentSource} />
                </Link>
              )}
            </div>
          )
        })()}

        {/* Ulasan Detail Card */}
        <Card className="overflow-hidden min-w-0">
          <CardHeader className="border-b">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                {!ulasan?.is_anonymous && ulasan?.user?.id_user ? (
                  <Link
                    to="/a/u/$userId"
                    params={{ userId: ulasan.user.id_user }}
                    className={cn("flex items-center gap-3 cursor-pointer group")}
                  >
                    <Avatar className="h-12 w-12 group-hover:ring-2 ring-primary/20 transition-all">
                      <AvatarImage src={ulasan?.user?.image || ""} />
                      <AvatarFallback className="bg-linear-to-br from-primary/20 to-primary/10 text-primary font-medium">
                        {ulasan?.user?.name?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold flex items-center gap-1.5 group-hover:underline">
                        {ulasan?.user?.name}
                      </p>
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
                  </Link>
                ) : (
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={undefined} />
                      <AvatarFallback className="bg-linear-to-br from-primary/20 to-primary/10 text-primary font-medium">
                        {ulasan?.is_anonymous ? "?" : ulasan?.user?.name?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold flex items-center gap-1.5">
                        {ulasan?.is_anonymous ? "Anonim" : ulasan?.user?.name}
                        {ulasan?.is_anonymous && <Ghost className="size-3.5 text-muted-foreground" />}
                      </p>
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
                  reviewId={ulasanId}
                  title="Laporkan Ulasan"
                />

                <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Apakah Anda yakin?</DialogTitle>
                      <DialogDescription>
                        Tindakan ini tidak dapat dibatalkan. Ulasan Anda akan dihapus secara permanen.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-2">
                      <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Batal</Button>
                      <Button variant="destructive" onClick={handleDelete} loading={deleteUlasanMutation.isPending}>
                        Hapus
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                <CreateReviewModal
                  open={isEditDialogOpen}
                  onOpenChange={setIsEditDialogOpen}
                  editData={{
                    id_review: ulasanId,
                    judulUlasan: ulasan?.title || '',
                    textUlasan: ulasan?.body || '',
                    idDosen: ulasan?.id_lecturer || undefined,
                    idMatkul: ulasan?.id_subject || undefined,
                    isAnonymous: !!ulasan?.is_anonymous
                  }}
                  replyToId={ulasan?.id_reply ?? undefined}
                  forumId={ulasan?.id_forum ?? undefined}
                />
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-6 space-y-6">
            {/* Title */}
            <h1 className="text-2xl font-bold text-gray-900 break-all">
              {ulasan?.title || 'Judul Ulasan'}
            </h1>

            {/* Content */}
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap break-all">
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
              <ShareButton
                url={`${window.location.origin}/a/ulasan/${ulasanId}`}
                size="sm"
                className="gap-2 ml-auto"
              />
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
                <div className="flex-1 relative">
                  <Input
                    ref={inputRef}
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Tulis balasan untuk ulasan ini..."
                    className="w-full bg-gray-50 focus-visible:ring-primary/20 border-gray-200 pr-16"
                    disabled={createUlasanMutation.isPending}
                    maxLength={300}
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground/50 pointer-events-none">
                    {replyText.length}/300
                  </div>
                </div>
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
                isAnonymous={reply.is_anonymous}
                userId={reply.user?.id_user}
                idReply={ulasanId}
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

function ParentPreview({ source }: { source: any }) {
  return (
    <>
      {!source.is_anonymous && source.user.id_user ? (
        <Link
          to="/a/u/$userId"
          params={{ userId: source.user.id_user }}
          className="flex gap-4 cursor-pointer group"
        >
          <div className="relative">
            <Avatar className="h-12 w-12 border-2 border-white shadow-sm group-hover:ring-4 ring-primary/10 transition-all duration-300">
              <AvatarImage src={source.user.image || ""} />
              <AvatarFallback className="bg-gray-100 text-gray-500 font-medium">
                {source.user.name?.charAt(0).toUpperCase() || "?"}
              </AvatarFallback>
            </Avatar>
          </div>
          <div className="flex-1 py-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-bold text-gray-900 group-hover:text-primary transition-colors">
                {source.user.name}
              </span>
              <span className="text-[10px] px-1.5 py-0.5 bg-gray-100 text-gray-400 rounded uppercase tracking-wider font-bold">
                {source.type === 'review' ? 'Ulasan' : 'Forum'}
              </span>
              <span className="text-xs text-gray-400">
                {new Date(source.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
              </span>
            </div>
            <p className="text-gray-500 text-sm line-clamp-2 leading-relaxed italic">
              "{source.body || source.title}"
            </p>
          </div>
        </Link>
      ) : (
        <div className="flex gap-4">
          <div className="relative">
            <Avatar className="h-12 w-12 border-2 border-white shadow-sm transition-all duration-300">
              <AvatarImage src={undefined} />
              <AvatarFallback className="bg-gray-100 text-gray-500 font-medium">
                {source.is_anonymous ? "?" : source.user.name?.charAt(0).toUpperCase() || "?"}
              </AvatarFallback>
            </Avatar>
          </div>
          <div className="flex-1 py-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-bold text-gray-900">
                {source.is_anonymous ? "Anonim" : source.user.name}
              </span>
              <span className="text-[10px] px-1.5 py-0.5 bg-gray-100 text-gray-400 rounded uppercase tracking-wider font-bold">
                {source.type === 'review' ? 'Ulasan' : 'Forum'}
              </span>
              <span className="text-xs text-gray-400">
                {new Date(source.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
              </span>
            </div>
            <p className="text-gray-500 text-sm line-clamp-2 leading-relaxed italic">
              "{source.body || source.title}"
            </p>
          </div>
        </div>
      )}
    </>
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
