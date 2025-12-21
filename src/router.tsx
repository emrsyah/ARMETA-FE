import { createRouter } from '@tanstack/react-router'
import { QueryClient } from '@tanstack/react-query'

// Import the generated route tree
import { routeTree } from './routeTree.gen'
import { queryClient } from './lib/queries/query-client'

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof getRouter>
  }
}

// Define router context type
export interface RouterContext {
  queryClient: QueryClient
}

// Create a new router instance
export const getRouter = () => {
  const router = createRouter({
    routeTree,
    scrollRestoration: true,
    scrollRestorationBehavior: 'auto',
    getScrollRestorationKey: (location) => location.pathname,
    defaultPreloadStaleTime: 0,
    context: {
      queryClient,
    },
  })

  return router
}
