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
  timeoutMs = 8_000,
): Promise<T> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)

  try {
    const headers: HeadersInit = { 'Content-Type': 'application/json' }

    const res = await fetch(`${BASE_URL}${path}`, {
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
      } catch {}
      throw new ApiError(message, res.status, code)
    }

    return res.json() as Promise<T>
  } catch (e) {
    if (e instanceof Error && e.name === 'AbortError') {
      throw new ApiError('Request timed out. Is the backend running?', 408, 'TIMEOUT')
    }
    throw e
  } finally {
    clearTimeout(timer)
  }
}
