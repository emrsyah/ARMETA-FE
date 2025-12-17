import { createFileRoute } from '@tanstack/react-router'
import ForumCard from '@/components/card/forum-card'
import { useState } from 'react'
import CreateForumModal from '@/components/create-forum-modal'
import { Input } from '@/components/ui/input'
import { motion, LayoutGroup } from 'motion/react'
import { useAllForums, useFilterForum } from '@/lib/queries'
import { Skeleton } from '@/components/ui/skeleton'
import { Route as ALayoutRoute } from './a'
import { getDateRangeFromFilter } from '@/lib/utils'

export const Route = createFileRoute('/(app)/a/forum/')({
  component: ForumPage,
})

// Helper to format timestamp
function formatTimestamp(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'Baru saja'
  if (diffMins < 60) return `${diffMins} menit yang lalu`
  if (diffHours < 24) return `${diffHours} jam yang lalu`
  if (diffDays < 7) return `${diffDays} hari yang lalu`
  return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
}

function ForumPage() {
  const [openCreateForumModal, setOpenCreateForumModal] = useState(false)
  const search = ALayoutRoute.useSearch()

  // Calculate date range if filter is active
  const dateRange = search.filter ? getDateRangeFromFilter(search.filter) : null

  // Use different queries based on active filter
  const { data: allForums, isLoading: isAllLoading } = useAllForums()
  const { data: filteredForums, isLoading: isFilterLoading } = useFilterForum(
    dateRange?.from ?? '',
    dateRange?.to ?? ''
  )

  // Determine which data to use
  const forums = search.filter ? filteredForums : allForums
  const isLoading = search.filter ? isFilterLoading : isAllLoading

  return (
    <LayoutGroup>
      <CreateForumModal open={openCreateForumModal} onOpenChange={setOpenCreateForumModal} />
      <div className="space-y-6 pb-60">
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

        {isLoading ? (
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
        ) : forums && forums.length > 0 ? (
          forums.map((forum) => (
            <ForumCard
              key={forum.id_forum}
              id={forum.id_forum}
              tags={[]} // TODO: Add tags when API supports it
              title={forum.title}
              description={forum.description ?? undefined}
              replies={[]} // TODO: Add replies when API supports it
              commentCount={0}
              bookmarkCount={0}
              likeCount={0}
              author={{
                name: 'User', // TODO: Fetch user data
                initials: 'U',
              }}
              timestamp={formatTimestamp(forum.created_at)}
            />
          ))
        ) : (
          <div className="text-center py-12 text-gray-500">
            <p>Belum ada forum. Jadilah yang pertama membuat forum diskusi!</p>
          </div>
        )}
      </div>
    </LayoutGroup>
  )
}