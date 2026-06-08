const BASE_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '') ?? 'http://localhost:3001'

type HttpMethod = 'GET' | 'POST' | 'PATCH' | 'DELETE'

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

function buildUrl(path: string) {
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path
  }
  return `${BASE_URL}${path}`
}

export async function apiFetch<T>(
  path: string,
  method: HttpMethod = 'GET',
  body?: unknown,
  timeoutMs = 8_000,
): Promise<T> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)

  try {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    }

    const res = await fetch(buildUrl(path), {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      cache: 'no-store',
      signal: controller.signal,
    })

    if (!res.ok) {
      let message = `HTTP ${res.status}`
      let code = 'HTTP_ERROR'
      try {
        const err = await res.json()
        message = err.message ?? message
        code = err.code ?? code
      } catch {
        // ignore parsing failures
      }
      throw new ApiError(message, res.status, code)
    }

    return (await res.json()) as T
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new ApiError('Request timed out. Is the backend running?', 408, 'TIMEOUT')
    }
    throw error
  } finally {
    clearTimeout(timer)
  }
}
