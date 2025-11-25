import { SidebarTrigger } from '@/components/ui/sidebar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { User, Search } from 'lucide-react'

export function TopNavigation() {
  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
      <SidebarTrigger className="-ml-1" />
      <div className="ml-auto flex items-center space-x-2">
        <div className="hidden md:flex">
          <span className="font-bold text-lg">ARMETA</span>
        </div>
        <div className="flex-1 px-4">
          <div className="relative max-w-md">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Cari..."
              className="w-full pl-8 md:w-[300px] lg:w-[400px]"
            />
          </div>
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
          <User className="h-4 w-4" />
          <span className="sr-only">User profile</span>
        </Button>
      </div>
    </header>
  )
}
