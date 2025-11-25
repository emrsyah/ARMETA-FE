import { useNavigate } from '@tanstack/react-router'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { BookOpenIcon, LayoutDashboardIcon, MessageCircleIcon, TargetIcon } from 'lucide-react'
import { Button } from './ui/button'

export function AppSidebar() {
  const navigate = useNavigate()

  const menuItems = [
    {
      title: 'Beranda',
      url: '/a/home',
      icon: <LayoutDashboardIcon size={16} />,
    },
    {
      title: 'Mata Kuliah',
      url: '/a/courses',
      icon: <BookOpenIcon size={16} />,
    },
    {
      title: 'Forum',
      url: '/a/forum',
      icon: <MessageCircleIcon size={16} />,
    },
    {
      title: 'ARME',
      url: '/a/arme',
      icon: <TargetIcon size={16} />,
    },
  ]

  return (
    <Sidebar collapsible="icon" className='bg-white '>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <span className="text-sm font-bold">A</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={window.location.pathname === item.url}
                  >
                    <Button onClick={() => navigate({ to: item.url })} variant={'ghost'} size={'lg'} className='w-full text-start! justify-start!'>
                      <span className="text-lg text-start">{item.icon}</span>
                      <span>{item.title}</span>
                    </Button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
