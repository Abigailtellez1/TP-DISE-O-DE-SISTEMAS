const DEFAULT_BASE_URL = 'http://localhost:8080'

export const API_BASE_URL =
  (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? DEFAULT_BASE_URL

export class ApiError extends Error {
  status: number
  body?: unknown

  constructor(message: string, status: number, body?: unknown) {
    super(message)
    this.status = status
    this.body = body
  }
}

type QueryValue = string | number | boolean | null | undefined

export type RequestOptions = Omit<RequestInit, 'body'> & {
	query?: Record<string, QueryValue>
	/** Body can be a plain object; it will be JSON stringified. */
	body?: BodyInit | object | null
}

const buildUrl = (path: string, query?: Record<string, QueryValue>) => {
  const url = new URL(path.startsWith('http') ? path : `${API_BASE_URL}${path}`)
  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      if (value === undefined || value === null) return
      url.searchParams.append(key, String(value))
    })
  }
  return url.toString()
}

const getAuthToken = (): string | null => {
  try {
    const stored = localStorage.getItem('aeu:currentUser')
    if (!stored) return null
    const parsed = JSON.parse(stored) as { token?: string }
    return parsed.token || null
  } catch {
    return null
  }
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { query, headers, body, method, ...rest } = options
  const finalHeaders = new Headers(headers)
  let finalBody: BodyInit | null | undefined = null

  // Add Authorization header if token exists
  const token = getAuthToken()
  if (token) {
    finalHeaders.set('Authorization', `Bearer ${token}`)
  }

  if (body !== undefined && body !== null) {
    if (typeof body === 'object' && !(body instanceof FormData) && !(body instanceof Blob)) {
      finalHeaders.set('Content-Type', 'application/json')
      finalBody = JSON.stringify(body)
    } else {
      finalBody = body as BodyInit
    }
  }

  const response = await fetch(buildUrl(path, query), {
    method: method ?? 'GET',
    headers: finalHeaders,
    body: finalBody ?? undefined,
    ...rest,
  })

  const contentType = response.headers.get('content-type')
  const isJson = contentType?.includes('application/json')
  const parsedBody = isJson ? await response.json().catch(() => null) : await response.text()

  if (!response.ok) {
    const message = typeof parsedBody === 'string' && parsedBody.length > 0 ? parsedBody : response.statusText
    throw new ApiError(message, response.status, parsedBody)
  }

  return parsedBody as T
}
