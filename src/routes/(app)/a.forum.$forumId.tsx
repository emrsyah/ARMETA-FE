import { createFileRoute, Link } from '@tanstack/react-router'
import { useForumDetail } from '@/lib/queries/forum'
import { useUlasanList } from '@/lib/queries/ulasan'
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
import { useState } from 'react'
import CreateReviewModal from '@/components/create-review-modal'
import ReviewCard from '@/components/card/review-card'

export const Route = createFileRoute('/(app)/a/forum/$forumId')({
  component: ForumDetailPage,
})

function ForumDetailPage() {
  const { forumId } = Route.useParams()
  const { data: forum, isLoading: isForumLoading } = useForumDetail(forumId)
  const { data: ulasanList, isLoading: isUlasanLoading } = useUlasanList()

  const [openCreateReviewModal, setOpenCreateReviewModal] = useState(false)

  // Filter replies that belong to this forum
  const forumReplies = ulasanList?.filter(
    (ulasan) => ulasan.id_forum === forumId
  )

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
                  <AvatarImage src="" />
                  <AvatarFallback className="bg-primary/10 text-primary">
                    U
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-sm">Pembuat Forum</p>
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
                <span>{forumReplies?.length || 0} Balasan</span>
              </Button>
              <Button variant="ghost" size="sm" className="gap-2">
                <Bookmark className="h-4 w-4" />
                <span>Simpan</span>
              </Button>
              <Button variant="ghost" size="sm" className="gap-2">
                <Heart className="h-4 w-4" />
                <span>Suka</span>
              </Button>
              <Button variant="ghost" size="sm" className="gap-2 ml-auto">
                <Share className="h-4 w-4" />
                <span>Bagikan</span>
              </Button>
            </div>
          </CardFooter>
        </Card>

        {/* Reply Input */}
        {!openCreateReviewModal && (
          <motion.div
            layoutId="create-forum-reply-input"
            onClick={() => setOpenCreateReviewModal(true)}
            className="cursor-pointer"
            transition={{
              type: 'spring',
              stiffness: 350,
              damping: 30,
            }}
          >
            <Card className="overflow-hidden hover:border-primary/50 transition-colors">
              <CardContent className="py-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                  <Input
                    readOnly
                    placeholder="Tulis balasan untuk diskusi ini..."
                    className="cursor-pointer flex-1 bg-gray-50"
                  />
                  <Button size="icon" variant="ghost">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Replies Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">
              Balasan ({forumReplies?.length || 0})
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
          ) : forumReplies && forumReplies.length > 0 ? (
            forumReplies.map((reply) => (
              <ReviewCard
                key={reply.id_review}
                id={reply.id_review}
                userName="User"
                avatarFallback="U"
                title={reply.title}
                content={reply.body}
                images={reply.files}
                commentCount={0}
                bookmarkCount={0}
                likeCount={0}
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
