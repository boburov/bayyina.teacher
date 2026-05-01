import { http } from '@/shared/api/http'
import type { Group, GroupsResponse, GroupDetailResponse, ApiGroup } from './types'

function mapApiGroup(g: ApiGroup): Group {
  return {
    id:                   g._id,
    name:                 g.name,
    description:          g.description,
    ...(g.price != null && { price: g.price }),
    teacher:              g.teacher,
    schedule:             g.schedule,
    room:                 g.room,
    createdBy:            g.createdBy,
    createdAt:            g.createdAt,
    updatedAt:            g.updatedAt,
    showPaymentsToTeacher: g.showPaymentsToTeacher ?? false,
    studentCount:         0,
    students:             [],
  }
}

export async function fetchGroups(): Promise<Group[]> {
  const res = await http.get<GroupsResponse | ApiGroup[]>('groups')

  if (Array.isArray(res)) {
    return res.map(mapApiGroup)
  }
  const list = (res as GroupsResponse).groups
  if (!Array.isArray(list)) {
    throw new Error(`Unexpected /groups response shape: ${JSON.stringify(res)}`)
  }
  return list.map(mapApiGroup)
}

export async function fetchGroupById(id: string): Promise<Group | null> {
  const res = await http.get<GroupDetailResponse | ApiGroup>(`groups/${id}`)

  const raw = (res as GroupDetailResponse).group ?? (res as ApiGroup)
  if (!raw?._id) {
    throw new Error(`Unexpected /groups/${id} response shape: ${JSON.stringify(res)}`)
  }
  return mapApiGroup(raw)
}
