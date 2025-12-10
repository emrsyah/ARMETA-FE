import MainInputCreation from '@/components/main-input-creation'
import ReviewCard from '@/components/card/review-card'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(app)/a/home')({
  component: HomePage,
})

function HomePage() {
  return (
    <div className="space-y-6 pb-60">
      <h1 className="text-3xl font-bold text-gray-900">Selamat datang .."nama user"</h1>
      <MainInputCreation />

      <ReviewCard
        userName="John Doe"
        avatarFallback="JD"
        title="Review Card"
        content="Lorem ipsum dolor sit amet consectetur adipisicing elit. Ducimus esse animi obcaecati eveniet soluta. Delectus dolorum eum odit, magni porro mollitia eos? Eveniet reiciendis, nostrum nulla accusamus illo voluptates corrupti numquam tempora? Voluptatem earum laudantium nihil qui cupiditate repellendus beatae?"
        // images={["https://via.placeholder.com/150", "https://via.placeholder.com/150", "https://via.placeholder.com/150", "https://via.placeholder.com/150"]}
        images={[]}
        commentCount={200}
        bookmarkCount={7}
        likeCount={623}
      />
      <ReviewCard
        userName="John Doe"
        avatarFallback="JD"
        title="Review Card"
        content="Lorem ipsum dolor sit amet consectetur adipisicing elit. Ducimus esse animi obcaecati eveniet soluta. Delectus dolorum eum odit, magni porro mollitia eos? Eveniet reiciendis, nostrum nulla accusamus illo voluptates corrupti numquam tempora? Voluptatem earum laudantium nihil qui cupiditate repellendus beatae?"
        images={["https://via.placeholder.com/150", "https://via.placeholder.com/150", "https://via.placeholder.com/150", "https://via.placeholder.com/150"]}
        // images={[]}
        commentCount={200}
        bookmarkCount={7}
        likeCount={623}
      />

    </div>
  )
}