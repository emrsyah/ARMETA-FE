import { createFileRoute } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/(app)/a/arme')({
  component: ArmePage,
})

function ArmePage() {
  const armeSessions = [
    {
      id: 1,
      title: 'Pengenalan Fisika Mekanika',
      course: 'Fisika Dasar',
      duration: '45 menit',
      difficulty: 'Pemula',
      completed: true,
      score: 85,
      lastPlayed: '2 hari yang lalu',
      icon: '⚛️'
    },
    {
      id: 2,
      title: 'Struktur Atom Interaktif',
      course: 'Kimia Dasar',
      duration: '30 menit',
      difficulty: 'Menengah',
      completed: true,
      score: 92,
      lastPlayed: '5 hari yang lalu',
      icon: '🧪'
    },
    {
      id: 3,
      title: 'Sistem Tata Surya 3D',
      course: 'Astronomi',
      duration: '60 menit',
      difficulty: 'Lanjutan',
      completed: false,
      score: null,
      lastPlayed: '1 minggu yang lalu',
      icon: '🪐'
    },
    {
      id: 4,
      title: 'Simulasi Gerak Parabola',
      course: 'Fisika Lanjutan',
      duration: '40 menit',
      difficulty: 'Menengah',
      completed: false,
      score: null,
      lastPlayed: 'Belum pernah dimainkan',
      icon: '🏹'
    }
  ]

  const achievements = [
    {
      id: 1,
      title: 'Pembelajar Fisika',
      description: 'Menyelesaikan 5 sesi fisika',
      earned: true,
      icon: '🏆',
      earnedDate: '15 Nov 2024'
    },
    {
      id: 2,
      title: 'Master Kimia',
      description: 'Skor sempurna di sesi kimia',
      earned: true,
      icon: '🥇',
      earnedDate: '10 Nov 2024'
    },
    {
      id: 3,
      title: 'Penjelajah Angkasa',
      description: 'Menyelesaikan semua sesi astronomi',
      earned: false,
      icon: '🚀',
      earnedDate: null
    },
    {
      id: 4,
      title: 'Ahli Matematika',
      description: 'Skor rata-rata 90+ di matematika',
      earned: false,
      icon: '🧮',
      earnedDate: null
    }
  ]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">ARME (Augmented Reality for Mathematics Education)</h1>
          <p className="mt-2 text-sm text-gray-600">
            Pelajari konsep-konsep matematika dan sains melalui pengalaman augmented reality interaktif
          </p>
        </div>
        <Button>
          Mulai Sesi Baru
        </Button>
      </div>

      {/* ARME Sessions */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            Sesi ARME Tersedia
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {armeSessions.map((session) => (
              <div key={session.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div className="text-2xl">{session.icon}</div>
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-900">{session.title}</h4>
                      <p className="text-sm text-gray-500">{session.course}</p>
                      <div className="mt-2 flex items-center space-x-4 text-xs text-gray-500">
                        <span>⏱️ {session.duration}</span>
                        <span className={`px-2 py-1 rounded-full ${
                          session.difficulty === 'Pemula'
                            ? 'bg-green-100 text-green-800'
                            : session.difficulty === 'Menengah'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {session.difficulty}
                        </span>
                      </div>
                      <div className="mt-2 text-xs text-gray-500">
                        Terakhir dimainkan: {session.lastPlayed}
                      </div>
                      {session.completed && (
                        <div className="mt-2 flex items-center text-xs">
                          <span className="text-gray-500 mr-2">Skor:</span>
                          <span className={`font-medium ${
                            session.score >= 90
                              ? 'text-green-600'
                              : session.score >= 75
                              ? 'text-yellow-600'
                              : 'text-red-600'
                          }`}>
                            {session.score}/100
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    {session.completed ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        ✓ Selesai
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        Belum dimainkan
                      </span>
                    )}
                  </div>
                </div>
                <div className="mt-4">
                  <Button size="sm" className="w-full">
                    {session.completed ? 'Mainkan Lagi' : 'Mulai Bermain'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Achievements */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            Pencapaian
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {achievements.map((achievement) => (
              <div
                key={achievement.id}
                className={`border rounded-lg p-4 ${
                  achievement.earned
                    ? 'border-yellow-200 bg-yellow-50'
                    : 'border-gray-200 bg-gray-50'
                }`}
              >
                <div className="text-center">
                  <div className="text-3xl mb-2">{achievement.icon}</div>
                  <h4 className={`text-sm font-medium ${
                    achievement.earned ? 'text-yellow-900' : 'text-gray-900'
                  }`}>
                    {achievement.title}
                  </h4>
                  <p className={`text-xs mt-1 ${
                    achievement.earned ? 'text-yellow-700' : 'text-gray-500'
                  }`}>
                    {achievement.description}
                  </p>
                  {achievement.earned && (
                    <p className="text-xs text-yellow-600 mt-2">
                      Didapatkan: {achievement.earnedDate}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ARME Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                  <span className="text-white text-sm font-medium">🎯</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Sesi Diselesaikan
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {armeSessions.filter(s => s.completed).length}
                  </dd>
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
                  <span className="text-white text-sm font-medium">⭐</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Rata-rata Skor
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {Math.round(armeSessions.filter(s => s.score).reduce((acc, s) => acc + s.score, 0) /
                      armeSessions.filter(s => s.score).length)}%
                  </dd>
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
                  <span className="text-white text-sm font-medium">⏱️</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Waktu Bermain
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">4.5 jam</dd>
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
                    Pencapaian
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {achievements.filter(a => a.earned).length}/{achievements.length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}