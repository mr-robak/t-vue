import type { Show } from '@/api/types'

export interface StoreState {
  shows: Show[]
  isLoading: boolean
  error: string | null
}
