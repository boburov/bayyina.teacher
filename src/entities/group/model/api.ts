import { MOCK_GROUPS, simulateDelay } from '@/shared/api/mock-data'
import type { Group } from './types'

export async function fetchGroups(): Promise<Group[]> {
  return simulateDelay(MOCK_GROUPS)
}

export async function fetchGroupById(id: string): Promise<Group | null> {
  const group = MOCK_GROUPS.find((g) => g.id === id) ?? null
  return simulateDelay(group)
}
