import React from 'react'
import { useNavigate } from '@tanstack/react-router'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { BookOpenIcon, LayoutDashboardIcon, MessageCircleIcon, TargetIcon } from 'lucide-react'

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
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={window.location.pathname === item.url}
                  >
                    <button onClick={() => navigate({ to: item.url })}>
                      <span className="text-lg">{item.icon}</span>
                      <span>{item.title}</span>
                    </button>
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
