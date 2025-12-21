import { createFileRoute, Outlet, useMatch } from '@tanstack/react-router'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/app-sidebar'
import { TopNavigation } from '@/components/top-navigation'
import SidebarFilter from '@/components/sidebar-filter'

// Filter search params type - shared across child routes
export type FilterType = 'today' | 'week' | 'month' | 'year'
export type SortByType = 'date' | 'most_like' | 'most_bookmark' | 'most_popular'
export type OrderType = 'asc' | 'desc'

export type FilterSearch = {
  filter?: FilterType
  sortBy?: SortByType
  order?: OrderType
}

export const Route = createFileRoute('/(app)/a')({
  validateSearch: (search: Record<string, unknown>): FilterSearch => {
    return {
      filter: ['today', 'week', 'month', 'year'].includes(search.filter as string)
        ? (search.filter as FilterType)
        : undefined,
      sortBy: ['date', 'most_like', 'most_bookmark', 'most_popular'].includes(search.sortBy as string)
        ? (search.sortBy as SortByType)
        : undefined,
      order: ['asc', 'desc'].includes(search.order as string)
        ? (search.order as OrderType)
        : undefined,
    }
  },
  component: ALayout,
})

function ALayout() {
  const isArmePage = useMatch({ from: '/(app)/a/arme', shouldThrow: false })
  const isDetailForumPage = useMatch({ from: '/(app)/a/forum/$forumId', shouldThrow: false })
  const isDetailUlasanPage = useMatch({ from: '/(app)/a/ulasan/$ulasanId', shouldThrow: false })
  const isForumPage = useMatch({ from: '/(app)/a/forum/', shouldThrow: false })

  // Determine current page type for sidebar filter
  const currentPage = isForumPage ? 'forum' : 'ulasan'

  const showSidebarFilter = !isDetailForumPage && !isDetailUlasanPage && !isArmePage

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <TopNavigation />
        <div className="flex flex-1 flex-col gap-4 p-4">
          <div className='flex items-start gap-3'>
            <div className='flex-1 grow'>
              <Outlet />
            </div>
            {showSidebarFilter && <SidebarFilter currentPage={currentPage} />}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}