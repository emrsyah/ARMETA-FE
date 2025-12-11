
import { useId } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { User, Search } from 'lucide-react'

export function TopNavigation() {
  const id = useId()

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
        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
          <User className="h-4 w-4" />
          <span className="sr-only">User profile</span>
        </Button>
      </div>
    </header>
  )
}
