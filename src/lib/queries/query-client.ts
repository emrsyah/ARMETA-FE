import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: 1000 * 60 * 5, // 5 minutes
			gcTime: 1000 * 60 * 30, // 30 minutes (formerly cacheTime)
			retry: (failureCount, error) => {
				// Don't retry on 401, 403, or 404
				if (error instanceof Error) {
					const status = (error as { response?: { status: number } }).response?.status;
					if (status === 401 || status === 403 || status === 404) {
						return false;
					}
				}
				return failureCount < 3;
			},
			refetchOnWindowFocus: false,
		},
		mutations: {
			retry: false,
		},
	},
});
