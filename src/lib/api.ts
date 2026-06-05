// HTTP client — currently unused (all data comes from the mock service).
// When the backend is ready: set NEXT_PUBLIC_API_URL and replace mock calls
// in /src/services/queue.service.ts with calls to `apiFetch`.

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? ''

type Method = 'GET' | 'POST' | 'PATCH' | 'DELETE'

export class ApiError extends Error {
  status: number
  code: string

  constructor(message: string, status: number, code = 'UNKNOWN_ERROR') {
    super(message)
    this.status = status
    this.code = code
    this.name = 'ApiError'
  }
}

export async function apiFetch<T>(
  path: string,
  method: Method = 'GET',
  body?: unknown,
): Promise<T> {
  const headers: HeadersInit = { 'Content-Type': 'application/json' }

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
    cache: 'no-store',
  })

  if (!res.ok) {
    let message = `HTTP ${res.status}`
    let code = 'HTTP_ERROR'
    try {
      const err = await res.json()
      message = err.message ?? message
      code = err.code ?? code
    } catch {}
    throw new ApiError(message, res.status, code)
  }

  return res.json() as Promise<T>
}
