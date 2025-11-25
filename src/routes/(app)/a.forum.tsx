import { createFileRoute } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/(app)/a/forum')({
  component: ForumPage,
})

function ForumPage() {
  const forumPosts = [
    {
      id: 1,
      title: 'Pertanyaan tentang Algoritma Sorting',
      author: 'Ahmad Rahman',
      course: 'Algoritma dan Struktur Data',
      replies: 12,
      lastReply: '2 jam yang lalu',
      category: 'Pertanyaan',
      avatar: '👨‍🎓'
    },
    {
      id: 2,
      title: 'Diskusi: Tren Teknologi 2024',
      author: 'Siti Nurhaliza',
      course: 'Pemrograman Web',
      replies: 8,
      lastReply: '4 jam yang lalu',
      category: 'Diskusi',
      avatar: '👩‍💻'
    },
    {
      id: 3,
      title: 'Bantuan: Error pada Query SQL',
      author: 'Budi Santoso',
      course: 'Basis Data',
      replies: 5,
      lastReply: '1 hari yang lalu',
      category: 'Bantuan',
      avatar: '👨‍💼'
    },
    {
      id: 4,
      title: 'Review Materi Jaringan Komputer',
      author: 'Dian Pratiwi',
      course: 'Jaringan Komputer',
      replies: 15,
      lastReply: '2 hari yang lalu',
      category: 'Review',
      avatar: '👩‍🔬'
    },
    {
      id: 5,
      title: 'Tips Belajar Efektif untuk Ujian',
      author: 'Muhammad Iqbal',
      course: 'Umum',
      replies: 22,
      lastReply: '3 hari yang lalu',
      category: 'Tips',
      avatar: '👨‍🏫'
    }
  ]

  const categories = [
    { name: 'Semua', count: 48, active: true },
    { name: 'Pertanyaan', count: 18, active: false },
    { name: 'Diskusi', count: 12, active: false },
    { name: 'Bantuan', count: 10, active: false },
    { name: 'Review', count: 8, active: false }
  ]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Forum Diskusi</h1>
          <p className="mt-2 text-sm text-gray-600">
            Berbagi pengetahuan dan berdiskusi dengan sesama mahasiswa
          </p>
        </div>
        <Button>
          Buat Postingan Baru
        </Button>
      </div>

      {/* Categories */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            Kategori
          </h3>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category.name}
                className={`inline-flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                  category.active
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category.name}
                <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-200 text-gray-800">
                  {category.count}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Forum Posts */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {forumPosts.map((post) => (
            <li key={post.id}>
              <div className="px-4 py-4 sm:px-6 hover:bg-gray-50 cursor-pointer">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-lg">
                        {post.avatar}
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {post.title}
                      </div>
                      <div className="text-sm text-gray-500">
                        oleh {post.author} • {post.course}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="text-sm text-gray-900">
                        {post.replies} balasan
                      </div>
                      <div className="text-sm text-gray-500">
                        {post.lastReply}
                      </div>
                    </div>
                    <div className="flex-shrink-0">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        post.category === 'Pertanyaan'
                          ? 'bg-blue-100 text-blue-800'
                          : post.category === 'Diskusi'
                          ? 'bg-green-100 text-green-800'
                          : post.category === 'Bantuan'
                          ? 'bg-yellow-100 text-yellow-800'
                          : post.category === 'Review'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {post.category}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Forum Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                  <span className="text-white text-sm font-medium">💬</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Postingan
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">48</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                  <span className="text-white text-sm font-medium">👥</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Anggota Aktif
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">156</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center">
                  <span className="text-white text-sm font-medium">📈</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Postingan Hari Ini
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">12</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
                  <span className="text-white text-sm font-medium">🏆</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Top Contributor
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">Ahmad</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}