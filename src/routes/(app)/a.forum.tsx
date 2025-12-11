import { createFileRoute } from '@tanstack/react-router'
import ForumCard from '@/components/card/forum-card'
import { useState } from 'react'
import CreateForumModal from '@/components/create-forum-modal'
import { Input } from '@/components/ui/input'
import { motion, LayoutGroup } from 'motion/react'

export const Route = createFileRoute('/(app)/a/forum')({
  component: ForumPage,
})

const FORUM_CARDS = [
  {
    tags: ['Test', 'Test', 'Test'],
    title: 'Test',
    replies: [{ authorName: 'Test', content: 'Test' }],
    commentCount: 10,
    bookmarkCount: 10,
    likeCount: 10,
    timestamp: '5 menit yang lalu',
  },
  {
    tags: ['Test', 'Test', 'Test'],
    title: 'Test',
    replies: [{ authorName: 'Test', content: 'Test' }],
    commentCount: 10,
    bookmarkCount: 10,
    likeCount: 10,
    timestamp: '5 menit yang lalu',
  },
]

const FORUM_AUTHORS = [
  {
    name: 'Test',
    avatar: 'https://github.com/shadcn.png',
    initials: 'TS',
  },
]


function ForumPage() {
  const [openCreateForumModal, setOpenCreateForumModal] = useState(false)

  return (
    <LayoutGroup>
    <CreateForumModal open={openCreateForumModal} onOpenChange={setOpenCreateForumModal} />
    <div className="space-y-6">
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
      <ForumCard
        tags={FORUM_CARDS[0].tags}
        title={FORUM_CARDS[0].title}
        replies={FORUM_CARDS[0].replies}
        commentCount={FORUM_CARDS[0].commentCount}
        bookmarkCount={FORUM_CARDS[0].bookmarkCount}
        likeCount={FORUM_CARDS[0].likeCount}
        author={FORUM_AUTHORS[0]}
        timestamp={FORUM_CARDS[0].timestamp}
      />
      <ForumCard
        tags={FORUM_CARDS[0].tags}
        title={FORUM_CARDS[0].title}
        replies={FORUM_CARDS[0].replies}
        commentCount={FORUM_CARDS[0].commentCount}
        bookmarkCount={FORUM_CARDS[0].bookmarkCount}
        likeCount={FORUM_CARDS[0].likeCount}
        author={FORUM_AUTHORS[0]}
        timestamp={FORUM_CARDS[0].timestamp}
      />
      <ForumCard
        tags={FORUM_CARDS[0].tags}
        title={FORUM_CARDS[0].title}
        replies={FORUM_CARDS[0].replies}
        commentCount={FORUM_CARDS[0].commentCount}
        bookmarkCount={FORUM_CARDS[0].bookmarkCount}
        likeCount={FORUM_CARDS[0].likeCount}
        author={FORUM_AUTHORS[0]}
        timestamp={FORUM_CARDS[0].timestamp}
      />

    </div>
    </LayoutGroup>
  )
}