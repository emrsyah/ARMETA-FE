import ReviewCard from '@/components/card/review-card'
import { createFileRoute } from '@tanstack/react-router'
import { useProfile } from '@/lib/queries/user'
import { useInfiniteUlasanList } from '@/lib/queries/ulasan'
import { Skeleton } from '@/components/ui/skeleton'
import { useState, useEffect } from 'react'
import CreateReviewModal from '@/components/create-review-modal'
import { Input } from '@/components/ui/input'
import { motion, LayoutGroup } from 'motion/react'
import { Route as ALayoutRoute } from './a'
import { getDateRangeFromFilter } from '@/lib/utils'
import { useInView } from 'react-intersection-observer'
import { Loader2 } from 'lucide-react'

export const Route = createFileRoute('/(app)/a/home')({
  // Note: No SSR prefetching for authenticated queries (cookies not available in SSR)
  component: HomePage,
})

function HomePage() {
  const { data: user, isLoading: isUserLoading } = useProfile()
  const search = ALayoutRoute.useSearch()
  const { ref, inView } = useInView()

  // Calculate date range if filter is active
  const dateRange = search.filter ? getDateRangeFromFilter(search.filter) : null

  // Use unified infinite query with filters/sorting
  const {
    data,
    isLoading: isUlasanLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteUlasanList({
    from: dateRange?.from,
    to: dateRange?.to,
    sortBy: search.sortBy,
    order: search.order,
  })

  // Flatten all pages of ulasan
  const allUlasan = data?.pages.flatMap((page) => page.data) || []

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage])

  const [openCreateReviewModal, setOpenCreateReviewModal] = useState(false)

  return (
    <LayoutGroup>
      <CreateReviewModal open={openCreateReviewModal} onOpenChange={setOpenCreateReviewModal} />
      <div className="space-y-6 pb-20">
        <h1 className="text-3xl font-bold text-gray-900">
          Selamat datang{' '}
          {isUserLoading ? (
            <Skeleton className="inline-block h-8 w-40" />
          ) : (
            user?.name || 'User'
          )}
        </h1>

        {!openCreateReviewModal && (
          <motion.div
            layoutId="create-review-input"
            onClick={() => setOpenCreateReviewModal(true)}
            className="cursor-pointer"
            transition={{
              type: "spring",
              stiffness: 350,
              damping: 30,
            }}
          >
            <Input
              readOnly
              placeholder="Tulis ulasan..."
              className="cursor-pointer"
            />
          </motion.div>
        )}

        {isUlasanLoading ? (
          // Loading skeleton for reviews
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-lg border p-4 space-y-4">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <Skeleton className="h-4 w-32" />
                </div>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-20 w-full" />
              </div>
            ))}
          </div>
        ) : allUlasan.length > 0 ? (
          <>
            <div className="space-y-4">
              {allUlasan.map((ulasan) => (
                <ReviewCard
                  key={ulasan.id_review}
                  id={ulasan.id_review}
                  subjectName={ulasan.subject_name}
                  lecturerName={ulasan.lecturer_name}
                  idMatkul={ulasan.id_subject ?? undefined}
                  idDosen={ulasan.id_lecturer ?? undefined}
                  isReply={!!(ulasan.id_reply || ulasan.id_forum)}
                  userName={ulasan.user?.name || 'User'}
                  avatarFallback="U"
                  avatarUrl={ulasan.user?.image || 'U'}
                  title={ulasan.title}
                  content={ulasan.body}
                  files={ulasan.files}
                  commentCount={ulasan.total_reply || 0}
                  bookmarkCount={ulasan.total_bookmarks ?? 0}
                  likeCount={ulasan.total_likes ?? 0}
                  isLiked={!!ulasan.is_liked}
                  isBookmarked={!!ulasan.is_bookmarked}
                  idReply={ulasan.id_reply}
                  idForum={ulasan.id_forum}
                  userId={ulasan.user?.id_user}
                  parentUserName={ulasan.parent_source?.user?.name}
                  isAnonymous={ulasan.is_anonymous}
                />
              ))}
            </div>

            {/* Pagination Ref / Loading Spinner */}
            <div ref={ref} className="py-8 flex justify-center">
              {isFetchingNextPage ? (
                <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
              ) : hasNextPage ? (
                <div className="h-1" />
              ) : (
                <p className="text-sm text-gray-500">Sudah menampilkan semua ulasan</p>
              )}
            </div>
          </>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <p>Belum ada ulasan. Jadilah yang pertama menulis ulasan!</p>
          </div>
        )}
      </div>
    </LayoutGroup>
  )
}
