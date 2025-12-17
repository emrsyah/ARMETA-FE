import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { FilterType } from "@/routes/(app)/a"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Convert filter type to date range (from, to) in ISO format
 */
export function getDateRangeFromFilter(filter: FilterType): { from: string; to: string } {
  const now = new Date()
  const to = now.toISOString().split('T')[0] // Today in YYYY-MM-DD format
  
  let from: Date
  
  switch (filter) {
    case 'today':
      from = now
      break
    case 'week':
      from = new Date(now)
      from.setDate(now.getDate() - 7)
      break
    case 'month':
      from = new Date(now)
      from.setDate(now.getDate() - 30)
      break
    case 'year':
      from = new Date(now)
      from.setFullYear(now.getFullYear() - 1)
      break
    default:
      from = now
  }
  
  return {
    from: from.toISOString().split('T')[0],
    to,
  }
}
