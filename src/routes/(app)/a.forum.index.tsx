import { createFileRoute } from '@tanstack/react-router'
import ForumCard from '@/components/card/forum-card'
import { useState, useMemo, useEffect } from 'react'
import CreateForumModal from '@/components/create-forum-modal'
import { Input } from '@/components/ui/input'
import { motion, LayoutGroup } from 'motion/react'
import { useInfiniteForumList } from '@/lib/queries'
import { Skeleton } from '@/components/ui/skeleton'
import { Route as ALayoutRoute } from './a'
import { getDateRangeFromFilter } from '@/lib/utils'
import type { GetAllForumInput } from '@/lib/schemas/forum.schema'
import { useInView } from 'react-intersection-observer'
import { Loader2 } from 'lucide-react'

export const Route = createFileRoute('/(app)/a/forum/')({
  component: ForumPage,
})

function ForumPage() {
  const [openCreateForumModal, setOpenCreateForumModal] = useState(false)
  const search = ALayoutRoute.useSearch()
  const { ref, inView } = useInView()

  // Build filter params from search state
  const filterParams = useMemo<GetAllForumInput | undefined>(() => {
    const dateRange = search.filter ? getDateRangeFromFilter(search.filter) : null

    if (!dateRange && !search.sortBy) {
      return undefined
    }

    return {
      ...(dateRange && { from: dateRange.from, to: dateRange.to }),
      ...(search.sortBy && { sortBy: search.sortBy as GetAllForumInput['sortBy'] }),
      ...(search.order && { order: search.order as GetAllForumInput['order'] }),
    }
  }, [search.filter, search.sortBy, search.order])

  // Use unified infinite query with optional filters
  const {
    data,
    isLoading: isForumLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteForumList(filterParams)

  // Flatten all pages of forums
  const allForums = data?.pages.flatMap((page) => page.data) || []

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage])

  return (
    <LayoutGroup>
      <CreateForumModal open={openCreateForumModal} onOpenChange={setOpenCreateForumModal} />
      <div className="space-y-6 pb-20">
        <h1 className="text-3xl font-bold text-gray-900">Forum Diskusi</h1>

        {!openCreateForumModal && (
          <motion.div
            layoutId="create-forum-input"
            onClick={() => setOpenCreateForumModal(true)}
            className="cursor-pointer"
            transition={{
              type: "spring",
              stiffness: 350,
              damping: 30,
            }}
          >
            <Input
              readOnly
              placeholder="Buat forum..."
              className="cursor-pointer"
            />
          </motion.div>
        )}

        {isForumLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-lg border p-4 space-y-4">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-6 w-16 rounded-full" />
                  <Skeleton className="h-6 w-20 rounded-full" />
                </div>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-16 w-full" />
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    <Skeleton className="h-8 w-16" />
                    <Skeleton className="h-8 w-16" />
                    <Skeleton className="h-8 w-16" />
                  </div>
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : allForums.length > 0 ? (
          <>
            <div className="space-y-4">
              {allForums.map((forum) => (
                <ForumCard
                  key={forum.id_forum}
                  {...forum}
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
                <p className="text-sm text-gray-500">Sudah menampilkan semua forum</p>
              )}
            </div>
          </>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <p>Belum ada forum. Jadilah yang pertama membuat forum diskusi!</p>
          </div>
        )}
      </div>
    </LayoutGroup>
  )
}
