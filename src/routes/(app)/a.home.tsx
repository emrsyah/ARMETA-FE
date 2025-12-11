import MainInputCreation from '@/components/main-input-creation'
import ReviewCard from '@/components/card/review-card'
import { createFileRoute } from '@tanstack/react-router'
import { useProfile } from '@/lib/queries/user'
import { useUlasanList, ulasanListQueryOptions } from '@/lib/queries/ulasan'
import { profileQueryOptions } from '@/lib/queries/user'
import { Skeleton } from '@/components/ui/skeleton'
import { useState } from 'react'
import CreateReviewModal from '@/components/create-review-modal'
import { Input } from '@/components/ui/input'
import { motion, LayoutGroup } from 'motion/react'

export const Route = createFileRoute('/(app)/a/home')({
  loader: ({ context }) => {
    // Prefetch data on route navigation
    context.queryClient.ensureQueryData(ulasanListQueryOptions())
    context.queryClient.ensureQueryData(profileQueryOptions())
  },
  component: HomePage,
})

function HomePage() {
  const { data: user, isLoading: isUserLoading } = useProfile()
  const { data: ulasanList, isLoading: isUlasanLoading } = useUlasanList()

  const [openCreateReviewModal, setOpenCreateReviewModal] = useState(false)

  return (
    <LayoutGroup>
    <CreateReviewModal open={openCreateReviewModal} onOpenChange={setOpenCreateReviewModal} />
    <div className="space-y-6 pb-60">
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
      
      {/* <MainInputCreation /> */}

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
      ) : ulasanList && ulasanList.length > 0 ? (
        ulasanList.map((ulasan) => (
          <ReviewCard
            key={ulasan.id_review}
            id={ulasan.id_review}
            userName="User" // TODO: Fetch user data for each review
            avatarFallback="U"
            title={ulasan.title}
            content={ulasan.body}
            images={ulasan.files}
            commentCount={0}
            bookmarkCount={0}
            likeCount={0}
          />
        ))
      ) : (
        <div className="text-center py-12 text-gray-500">
          <p>Belum ada ulasan. Jadilah yang pertama menulis ulasan!</p>
        </div>
      )}
    </div>
    </LayoutGroup>
  )
}
