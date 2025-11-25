import { useNavigate } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function Navigation() {
  const navigate = useNavigate()

  const menuItems = [
    { path: '/a/home', label: 'Beranda', icon: '🏠' },
    { path: '/a/courses', label: 'Mata Kuliah', icon: '📚' },
    { path: '/a/forum', label: 'Forum', icon: '💬' },
    { path: '/a/arme', label: 'ARME', icon: '🎯' },
  ]

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <h1 className="text-xl font-bold text-gray-900">ARMETA</h1>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {menuItems.map((item) => (
                <Button
                  key={item.path}
                  onClick={() => navigate({ to: item.path })}
                  className={cn(
                    "inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium",
                    window.location.pathname === item.path
                      ? "border-indigo-500 text-gray-900"
                      : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                  )}
                >
                  <span className="mr-2">{item.icon}</span>
                  {item.label}
                </Button>
              ))}
            </div>
          </div>
          <div className="flex items-center">
            <Button variant="outline" size="sm">
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className="sm:hidden">
        <div className="pt-2 pb-3 space-y-1">
          {menuItems.map((item) => (
            <Button
              key={item.path}
              onClick={() => navigate({ to: item.path })}
              className={cn(
                "block pl-3 pr-4 py-2 border-l-4 text-base font-medium w-full text-left cursor-pointer",
                window.location.pathname === item.path
                  ? "bg-indigo-50 border-indigo-500 text-indigo-700"
                  : "border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
              )}
            >
              <span className="mr-2">{item.icon}</span>
              {item.label}
            </Button>
          ))}
        </div>
      </div>
    </nav>
  )
}
