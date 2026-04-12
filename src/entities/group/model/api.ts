import { http } from '@/shared/api/http'
import { MOCK_GROUPS } from '@/shared/api/mock-data'
import type { Group, GroupsResponse } from './types'

function mapApiGroup(g: import('./types').ApiGroup): Group {
  return {
    id:           g._id,
    name:         g.name,
    description:  g.description,
    price:        g.price,
    teacher:      g.teacher,
    schedule:     g.schedule,
    room:         g.room,
    createdBy:    g.createdBy,
    createdAt:    g.createdAt,
    updatedAt:    g.updatedAt,
    // not returned from list endpoint — defaults until detail fetch
    studentCount: 0,
    students:     [],
  }
}

export async function fetchGroups(token: string): Promise<Group[]> {
  const res = await http.get<GroupsResponse>('groups', token)
  return res.groups.map(mapApiGroup)
}

export async function fetchGroupById(id: string): Promise<Group | null> {
  const group = MOCK_GROUPS.find((g) => g.id === id) ?? null
  return group
}
