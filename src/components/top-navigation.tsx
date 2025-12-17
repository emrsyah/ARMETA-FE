
import { useId } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, LogOut } from 'lucide-react'
import { useProfile, useLogout } from '@/lib/queries'
import { useNavigate } from '@tanstack/react-router'
import { Skeleton } from './ui/skeleton'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'

export function TopNavigation() {
  const id = useId()
  const navigate = useNavigate()

  const { data: user, isLoading } = useProfile()
  const logout = useLogout()

  const handleLogout = () => {
    logout.mutate(undefined, {
      onSuccess: () => {
        navigate({ to: '/' })
      },
    })
  }

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
      <div className="ml-auto flex items-center space-x-2 w-full justify-between">
        <div className="flex-1">
          <div className="relative max-w-3xl w-full ">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              id={id}
              type="search"
              placeholder="Cari..."
              className="w-full pl-8 pr-11 [&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:appearance-none [&::-webkit-search-results-button]:appearance-none [&::-webkit-search-results-decoration]:appearance-none peer"
            />
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center justify-center pr-3 peer-disabled:opacity-50">
              <kbd className="text-muted-foreground bg-accent inline-flex h-5 max-h-full items-center rounded border px-1 font-[inherit] text-[0.625rem] font-medium">
                ⌘k
              </kbd>
            </div>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 h-8 rounded-full px-2">
              {isLoading ? (
                <Skeleton className="h-8 w-8 rounded-full" />
              ) : (
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.image ?? undefined} />
                  <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
                </Avatar>
              )}
              <p className="text-sm font-medium whitespace-nowrap">{user?.name ?? 'User'}</p>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}

