import { createFileRoute } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import MainInputCreation from '@/components/main-input-creation'
import ForumCard from '@/components/card/forum-card'

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

const FORUM_REPLIES = [
  {
    authorName: 'Test',
    content: 'Test',
  },
]

function ForumPage() {

  return (
    <div className="space-y-6">
      <MainInputCreation type='forum' />
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
  )
}