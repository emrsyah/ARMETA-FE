import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart3, Users, MessageSquare, Gavel } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import api from '@/lib/api/client'
import { ADMIN_ENDPOINTS } from '@/lib/api/endpoints'

export const Route = createFileRoute('/(app)/a/admin/dashboard')({
  component: AdminDashboard,
})

function AdminDashboard() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin', 'stats'],
    queryFn: async () => {
      const response = await api.get(ADMIN_ENDPOINTS.STATS)
      return response.data.data
    }
  })

  const cards = [
    {
      title: 'Total User',
      value: stats?.totalUsers ?? 0,
      icon: <Users className="h-4 w-4 text-muted-foreground" />,
      description: 'Total pengguna terdaftar',
    },
    {
      title: 'Total Forum',
      value: stats?.totalForums ?? 0,
      icon: <MessageSquare className="h-4 w-4 text-muted-foreground" />,
      description: 'Postingan di forum',
    },
    {
      title: 'Total Ulasan',
      value: stats?.totalReviews ?? 0,
      icon: <BarChart3 className="h-4 w-4 text-muted-foreground" />,
      description: 'Ulasan dosen & matkul',
    },
    {
      title: 'Laporan Pending',
      value: stats?.pendingReports ?? 0,
      icon: <Gavel className="h-4 w-4 text-[#E92067]" />,
      description: 'Perlu moderasi',
    },
  ]

  if (isLoading) {
    return <div>Loading stats...</div>
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.title} className="border-none shadow-sm bg-white/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
            {card.icon}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{card.value}</div>
            <p className="text-xs text-muted-foreground mt-1">{card.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
