import { createFileRoute, Outlet, useMatch, redirect, isRedirect } from '@tanstack/react-router'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/app-sidebar'
import { TopNavigation } from '@/components/top-navigation'
import SidebarFilter from '@/components/sidebar-filter'
import { profileQueryOptions } from '@/lib/queries/user'

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
  beforeLoad: async ({ context }) => {
    // Skip auth check on server because tokens are in localStorage
    if (typeof window === 'undefined') return

    try {
      await context.queryClient.ensureQueryData(profileQueryOptions())
    } catch (error) {
      if (isRedirect(error)) throw error
      throw redirect({
        to: '/',
      })
    }
  },
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
  const isProfilePage = useMatch({ from: '/(app)/a/profile', shouldThrow: false })
  const isUserDetailPage = useMatch({ from: '/(app)/a/u/$userId', shouldThrow: false })
  const isForumPage = useMatch({ from: '/(app)/a/forum/', shouldThrow: false })

  // Determine current page type for sidebar filter
  const currentPage = isForumPage ? 'forum' : 'ulasan'

  const showSidebarFilter = !isDetailForumPage && !isDetailUlasanPage && !isArmePage && !isProfilePage && !isUserDetailPage

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <TopNavigation />
        <div className="flex flex-1 flex-col gap-4 p-4">
          <div className='flex items-start gap-3'>
            <div className='flex-1 grow min-w-0'>
              <Outlet />
            </div>
            {showSidebarFilter && <SidebarFilter currentPage={currentPage} />}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}