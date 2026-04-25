export const BASE_URL = 'https://api.bayyina.org.uz/api/api'

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

async function request<T>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const url = `${BASE_URL}/${path}`

  const res = await fetch(url, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init.headers ?? {}),
    },
  })

  if (!res.ok) {
    let message = `HTTP ${res.status}`
    try {
      const body = await res.json()
      message = body?.message ?? message
    } catch {
      // ignore parse error
    }
    throw new ApiError(res.status, message)
  }

  return res.json() as Promise<T>
}

export const http = {
  post<T>(path: string, body: unknown, token?: string) {
    return request<T>(path, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    })
  },
  put<T>(path: string, body: unknown, token?: string) {
    return request<T>(path, {
      method: 'PUT',
      body: JSON.stringify(body),
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    })
  },
  get<T>(path: string, token?: string) {
    return request<T>(path, {
      method: 'GET',
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    })
  },
}
