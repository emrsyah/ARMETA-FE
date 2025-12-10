import { createFileRoute, Outlet, useMatch } from '@tanstack/react-router'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/app-sidebar'
import { TopNavigation } from '@/components/top-navigation'
import SidebarFilter from '@/components/sidebar-filter'

export const Route = createFileRoute('/(app)/a')({
  component: ALayout,
})

function ALayout() {
  const isArmePage = useMatch({ from: '/(app)/a/arme', shouldThrow: false })

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
            {!isArmePage && <SidebarFilter />}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}