import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Search, LogOut, User, MessageSquare, Sparkles, LayoutDashboard, History } from 'lucide-react'
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
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command'

const SEARCH_HISTORY_KEY = 'armeta_search_history'

export function TopNavigation() {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchHistory, setSearchHistory] = useState<string[]>([])

  const { data: user, isLoading } = useProfile()
  const logout = useLogout()

  // Load history from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(SEARCH_HISTORY_KEY)
    if (saved) {
      try {
        setSearchHistory(JSON.parse(saved))
      } catch (e) {
        console.error('Failed to parse search history', e)
      }
    }
  }, [])

  const handleLogout = () => {
    logout.mutate(undefined, {
      onSuccess: () => {
        navigate({ to: '/' })
      },
    })
  }

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  const handleSearch = (query: string) => {
    if (query.trim()) {
      // Update history
      const newHistory = [
        query.trim(),
        ...searchHistory.filter((h) => h !== query.trim())
      ].slice(0, 3)

      setSearchHistory(newHistory)
      localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(newHistory))

      setOpen(false)
      navigate({ to: '/a/search' as any, search: { q: query } as any })
      setSearchQuery('')
    }
  }

  const clearHistory = () => {
    setSearchHistory([])
    localStorage.removeItem(SEARCH_HISTORY_KEY)
  }

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b px-6 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 sticky top-0 z-50">
      <div className="flex flex-1 items-center gap-4 max-w-3xl">
        <button
          onClick={() => setOpen(true)}
          className="relative flex h-10 w-full  max-w-sm items-center justify-between rounded-xl border border-input bg-muted/50 px-4 text-sm text-muted-foreground transition-all hover:bg-muted hover:ring-2 hover:ring-primary/20 group"
        >
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            <span>Cari di Armeta...</span>
          </div>
          <kbd className="pointer-events-none hidden h-5 items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
            <span className="text-xs">⌘</span>K
          </kbd>
        </button>

        <CommandDialog className='w-4xl' open={open} onOpenChange={setOpen}>
          <CommandInput
            placeholder="Cari ulasan, forum, atau matkul..."
            value={searchQuery}
            className='w-full'
            onValueChange={setSearchQuery}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSearch(searchQuery)
              }
            }}
          />
          <CommandList className="max-h-[70vh]">
            <CommandEmpty>Tidak ada hasil ditemukan.</CommandEmpty>

            {searchQuery && (
              <CommandGroup heading="Hasil">
                <CommandItem onSelect={() => handleSearch(searchQuery)} className="text-primary font-medium">
                  <Search className="mr-2 h-4 w-4" />
                  Cari "{searchQuery}"
                </CommandItem>
              </CommandGroup>
            )}

            <CommandGroup heading="Navigasi Cepat">
              <CommandItem onSelect={() => { setOpen(false); navigate({ to: '/a/home' }) }}>
                <LayoutDashboard className="mr-2 h-4 w-4" />
                Beranda
              </CommandItem>
              <CommandItem onSelect={() => { setOpen(false); navigate({ to: '/a/forum' as any }) }}>
                <MessageSquare className="mr-2 h-4 w-4" />
                Forum Diskusi
              </CommandItem>
              <CommandItem onSelect={() => { setOpen(false); navigate({ to: '/a/arme' as any }) }}>
                <Sparkles className="mr-2 h-4 w-4" />
                ARME - AI Chatbot
              </CommandItem>
              <CommandItem onSelect={() => { setOpen(false); navigate({ to: '/a/profile' as any }) }}>
                <User className="mr-2 h-4 w-4" />
                Profil Saya
              </CommandItem>
            </CommandGroup>

            <CommandSeparator />

            <CommandGroup
              heading={
                <div className="flex items-center justify-between w-full pr-2">
                  <span>Riwayat Pencarian</span>
                  {searchHistory.length > 0 && (
                    <button
                      onClick={(e) => { e.stopPropagation(); clearHistory(); }}
                      className="text-[10px] text-muted-foreground hover:text-destructive transition-colors font-medium border rounded px-1.5 py-0.5 bg-muted/50"
                    >
                      Hapus Semua
                    </button>
                  )}
                </div>
              }
            >
              {searchHistory.length > 0 ? (
                searchHistory.map((item) => (
                  <CommandItem key={item} onSelect={() => handleSearch(item)}>
                    <History className="mr-2 h-4 w-4 text-muted-foreground" />
                    {item}
                  </CommandItem>
                ))
              ) : (
                <CommandItem disabled className="opacity-50 italic text-xs">
                  <History className="mr-2 h-3.5 w-3.5" />
                  Belum ada riwayat pencarian
                </CommandItem>
              )}
            </CommandGroup>
          </CommandList>
        </CommandDialog>
      </div>

      <div className="flex items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0 overflow-hidden hover:ring-2 hover:ring-primary/20 transition-all group">
              {isLoading ? (
                <Skeleton className="h-full w-full" />
              ) : (
                <Avatar className="h-full w-full">
                  <AvatarImage src={user?.image ?? undefined} className="object-cover" />
                  <AvatarFallback className="bg-primary/10 text-primary font-bold">
                    {user?.name?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 p-1 mt-2">
            <div className="flex items-center gap-2 p-2 border-b mb-1">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.image ?? undefined} />
                <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col min-w-0">
                <p className="text-sm font-semibold truncate leading-none">{user?.name}</p>
                <p className="text-xs text-muted-foreground truncate">{user?.id_user}</p>
              </div>
            </div>
            <DropdownMenuItem onClick={() => navigate({ to: '/a/profile' as any })} className="gap-2 cursor-pointer py-2 text-sm font-medium">
              <User className="h-4 w-4" />
              Profil Saya
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleLogout} className="gap-2 cursor-pointer py-2 text-sm font-medium text-destructive focus:text-destructive focus:bg-destructive/10">
              <LogOut className="h-4 w-4" />
              Keluar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}

