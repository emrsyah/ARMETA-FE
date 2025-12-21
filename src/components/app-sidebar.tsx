import { useNavigate, useLocation } from '@tanstack/react-router'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import {
  LayoutDashboardIcon,
  CalendarIcon,
  MessagesSquare,
  Sparkles,
  ShieldCheck,
  Users,
  GraduationCap,
  BarChart3,
  Gavel
} from 'lucide-react'
import { Button } from './ui/button'
import { useProfile } from '@/lib/queries/user'

export function AppSidebar() {
  const navigate = useNavigate()
  const location = useLocation()
  const { data: user } = useProfile()

  const isAdmin = user?.role === 'admin'

  const menuItems = [
    {
      title: 'Beranda',
      url: '/a/home',
      icon: <LayoutDashboardIcon size={20} className="text-[#2067E9]" />,
    },

    {
      title: 'Forum',
      url: '/a/forum',
      icon: <MessagesSquare size={20} className="text-[#2067E9]" />,
    },
    {
      title: 'ARME',
      url: '/a/arme',
      icon: <Sparkles size={20} className="text-[#2067E9]" />,
    },
  ]

  const adminMenuItems = [
    {
      title: 'Dashboard',
      url: '/a/admin/dashboard',
      icon: <BarChart3 size={20} className="text-[#E92067]" />,
    },
    {
      title: 'Manajemen User',
      url: '/a/admin/users',
      icon: <Users size={20} className="text-[#E92067]" />,
    },
    {
      title: 'Data Akademik',
      url: '/a/admin/content',
      icon: <GraduationCap size={20} className="text-[#E92067]" />,
    },
    {
      title: 'Moderasi',
      url: '/a/admin/reports',
      icon: <Gavel size={20} className="text-[#E92067]" />,
    },
  ]

  return (
    <Sidebar collapsible="icon" className='bg-white'>
      <SidebarContent>
        {/* ========== BAGIAN SEMESTER DETAIL ========== */}
        <SidebarGroup>
          <div className="rounded-lg bg-linear-to-br from-[#123980] to-[#2067E9] px-4 py-4 text-white">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[13px] font-semibold leading-[95%] tracking-normal opacity-90" style={{ fontFamily: 'Plus Jakarta Sans' }}>Semester Aktif</span>
              <CalendarIcon size={14} className="opacity-90" />
            </div>
            <h3 className="text-[20px] font-bold leading-tight mb-1">
              Ganjil<br />2024/2025
            </h3>
            <p className="text-[12px] opacity-90">8 Mata Kuliah Aktif</p>
          </div>
        </SidebarGroup>

        {/* ========== FITUR UTAMA ========== */}
        <SidebarGroup>
          <div className="px-3 py-2">
            <h4 className="text-[16px] font-bold text-black tracking-wider">
              Fitur Utama
            </h4>
          </div>
          <SidebarGroupContent>
            <SidebarMenu className="flex flex-col items-center text-[13px] font-medium leading-[95%] tracking-normal text-justify">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title} className="w-full max-w-[200px]">
                  <SidebarMenuButton
                    asChild
                    isActive={location.pathname === item.url}
                  >
                    <Button
                      onClick={() => navigate({ to: item.url })}
                      variant={'ghost'}
                      size={'lg'}
                      className="w-full justify-start [&_svg]:!h-[20px] [&_svg]:!w-[20px]"
                    >
                      <span>{item.icon}</span>
                      <span>{item.title}</span>
                    </Button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* ========== ADMIN MANAGEMENT ========== */}
        {isAdmin && (
          <SidebarGroup>
            <div className="px-3 py-2 flex items-center gap-2">
              <ShieldCheck size={18} className="text-[#E92067]" />
              <h4 className="text-[16px] font-bold text-[#E92067] tracking-wider">
                Admin
              </h4>
            </div>
            <SidebarGroupContent>
              <SidebarMenu className="flex flex-col items-center text-[13px] font-medium leading-[95%] tracking-normal text-justify">
                {adminMenuItems.map((item) => (
                  <SidebarMenuItem key={item.title} className="w-full max-w-[200px]">
                    <SidebarMenuButton
                      asChild
                      isActive={location.pathname.startsWith(item.url)}
                    >
                      <Button
                        onClick={() => navigate({ to: item.url })}
                        variant={'ghost'}
                        size={'lg'}
                        className="w-full justify-start [&_svg]:!h-[20px] [&_svg]:!w-[20px]"
                      >
                        <span>{item.icon}</span>
                        <span>{item.title}</span>
                      </Button>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
    </Sidebar>
  )
}
