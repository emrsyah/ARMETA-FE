import MainInputCreation from '@/components/main-input-creation'
import ReviewCard from '@/components/review-card'
import { createFileRoute } from '@tanstack/react-router'
import { BookMarked, Flag, Heart, MessageCircle, Share } from 'lucide-react'

export const Route = createFileRoute('/(app)/a/home')({
  component: HomePage,
})

function HomePage() {
  return (
    <div className="space-y-6 pb-60">
      <MainInputCreation />
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Selamat datang .."nama user"</h1>
      </div>

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

      {/* Dashboard Cards */}


      {/* Recent Activities */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className=' flex mb-4'>
            <img
              className="h-12 w-12 rounded-full mr-2"
              src="https://via.placeholder.com/150"
              alt="User Avatar"
            />
            <p className="text-sm font-medium text-gray-900">"nama user"</p>
            <Flag className="ml-auto h-5 w-5 text-black-400" />
          </div>
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Desain Gak Cuma Soal UI — Tapi Gimana Bisa Dites!
          </h3>
          <div className="mt-5">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-gray-900">
                    Banyak yang ngeremehin bagian desain di matkul ini, padahal justru di situ akar masalah bug sering muncul.
                    Kalau dari awal desainnya udah robust dengan sequence diagram dan use case yang jelas, proses implementasi dan pengujiannya bakal jauh lebih lancar.
                    Aku sendiri pernah ngalamin waktu ngembangin ide web course tracker, hasil akhirnya gak sesuai ekspektasi karena desain databasenya belum matang.
                    Dari situ aku belajar hal penting bahwa validasi ide itu gak cukup lewat mockup aja, tapi juga perlu dilihat dari alur pengujian dan integrasi datanya.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex mt-6 bg-blue-50 py-4 px-10 rounded-md justify-between">
            <div className="flex items-center">
              <MessageCircle className="h-5 w-5 text-black-400 mr-1" />
              <span className="text-sm text-gray-600">200</span>
            </div>

            <div className="flex items-center">
              <BookMarked className="h-5 w-5 text-black-400 mr-2" />
              <span className="text-sm text-gray-600">7</span>
            </div>

            <div className="flex items-center">
              <Heart className="h-5 w-5 text-black-400 mr-2" />
              <span className="text-sm text-gray-600">623</span>
            </div>

            <div className="flex items-center">
              <Share className="h-5 w-5 text-black-400 mr-2" />
              <span className="text-sm text-gray-600">Bagikan</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}