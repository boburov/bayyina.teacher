export interface NotificationFeedback {
  _id:       string
  role:      string
  author:    string | { _id: string; firstName: string; lastName: string }
  message:   string
  createdAt: string
  updatedAt: string
}

export interface Notification {
  _id:       string
  group:     string | { _id: string; name: string }
  sender:    string | { _id: string; firstName: string; lastName: string }
  title:     string
  message:   string
  type:      'complaint' | 'suggestion' | 'info' | 'request' | string
  status:    'open' | 'closed' | 'pending' | string
  feedback:  NotificationFeedback[]
  createdAt: string
  updatedAt: string
}

export interface NotificationsResponse {
  notifications: Notification[]
  total:         number
  page:          number
  limit:         number
  totalPages:    number
  hasNextPage:   boolean
  hasPrevPage:   boolean
}

export interface FeedbackPayload {
  message: string
}
