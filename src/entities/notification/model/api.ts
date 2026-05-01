import { http } from '@/shared/api/http'
import type {
  Notification,
  NotificationsResponse,
  FeedbackPayload,
} from './types'

export async function fetchNotifications(
  params: { page?: number; limit?: number } = {},
): Promise<NotificationsResponse> {
  const query = new URLSearchParams()
  if (params.page)  query.set('page',  String(params.page))
  if (params.limit) query.set('limit', String(params.limit))

  const path = query.toString() ? `notifications?${query}` : 'notifications'
  return http.get<NotificationsResponse>(path)
}

export async function postFeedback(
  notificationId: string,
  payload: FeedbackPayload,
): Promise<Notification> {
  return http.post<Notification>(
    `notifications/${notificationId}/feedback`,
    payload,
  )
}
