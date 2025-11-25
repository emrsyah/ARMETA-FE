import { createFileRoute } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/(app)/a/courses')({
  component: CoursesPage,
})

function CoursesPage() {
  const courses = [
    {
      id: 1,
      name: 'Algoritma dan Struktur Data',
      code: 'ASD101',
      lecturer: 'Dr. Ahmad Rahman',
      schedule: 'Senin, 08:00 - 10:00',
      room: 'Ruang 301',
      progress: 75,
      status: 'active'
    },
    {
      id: 2,
      name: 'Basis Data',
      code: 'BD102',
      lecturer: 'Prof. Siti Nurhaliza',
      schedule: 'Selasa, 10:00 - 12:00',
      room: 'Ruang 205',
      progress: 60,
      status: 'active'
    },
    {
      id: 3,
      name: 'Pemrograman Web',
      code: 'PW103',
      lecturer: 'Dr. Budi Santoso',
      schedule: 'Rabu, 13:00 - 15:00',
      room: 'Lab Komputer 1',
      progress: 85,
      status: 'active'
    },
    {
      id: 4,
      name: 'Jaringan Komputer',
      code: 'JK104',
      lecturer: 'Ir. Dian Pratiwi',
      schedule: 'Kamis, 08:00 - 10:00',
      room: 'Ruang 102',
      progress: 45,
      status: 'active'
    }
  ]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mata Kuliah</h1>
          <p className="mt-2 text-sm text-gray-600">
            Kelola dan pantau progress mata kuliah Anda
          </p>
        </div>
        <Button>
          Tambah Mata Kuliah
        </Button>
      </div>

      {/* Course Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {courses.map((course) => (
          <div key={course.id} className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-gray-900">{course.name}</h3>
                  <p className="text-sm text-gray-500">{course.code}</p>
                </div>
                <div className="flex-shrink-0">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    course.status === 'active'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {course.status === 'active' ? 'Aktif' : 'Tidak Aktif'}
                  </span>
                </div>
              </div>

              <div className="mt-4 space-y-3">
                <div className="flex items-center text-sm text-gray-600">
                  <span className="font-medium">Dosen:</span>
                  <span className="ml-2">{course.lecturer}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <span className="font-medium">Jadwal:</span>
                  <span className="ml-2">{course.schedule}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <span className="font-medium">Ruangan:</span>
                  <span className="ml-2">{course.room}</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-4">
                <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                  <span>Progress</span>
                  <span>{course.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-indigo-600 h-2 rounded-full"
                    style={{ width: `${course.progress}%` }}
                  ></div>
                </div>
              </div>

              <div className="mt-4 flex space-x-3">
                <Button variant="outline" size="sm">
                  Lihat Detail
                </Button>
                <Button variant="outline" size="sm">
                  Materi
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary Stats */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            Ringkasan Akademik
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-indigo-600">{courses.length}</div>
              <div className="text-sm text-gray-500">Total Mata Kuliah</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {Math.round(courses.reduce((acc, course) => acc + course.progress, 0) / courses.length)}%
              </div>
              <div className="text-sm text-gray-500">Rata-rata Progress</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {courses.filter(course => course.progress >= 75).length}
              </div>
              <div className="text-sm text-gray-500">Mata Kuliah Selesai</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}