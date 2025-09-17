import { navigateTo } from '#app'
import type { NitroFetchOptions } from 'nitropack'

async function apiFetch<T>(
  endpoint: string,
  options: NitroFetchOptions<any> = {}
): Promise<T> {
  const config = useRuntimeConfig()
  const token = useCookie<string | null>('token')

  try {
    return await $fetch<T>(endpoint, {
      baseURL: config.public.apiBaseUrl,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...(token.value ? { Authorization: `Bearer ${token.value}` } : {}),
        ...(options.headers || {}),
      },
      method: options.method as
        | 'GET'
        | 'POST'
        | 'PUT'
        | 'PATCH'
        | 'DELETE'
        | 'HEAD'
        | 'OPTIONS'
        | undefined,
      body: options.body,
    })
  } catch (err: any) {
    // Interceptor error global
    if (err?.status === 401) {
      // hapus token
      token.value = null
      // redirect ke login
      return navigateTo('/login') as unknown as T
    }

    throw err
  }
}

export const api = {
  get: <T>(url: string, opts: Omit<RequestInit, 'method'> = {}) =>
    apiFetch<T>(url, { ...opts, method: 'GET' }),

  post: <T>(url: string, body?: any, opts: Omit<RequestInit, 'method'> = {}) =>
    apiFetch<T>(url, { ...opts, method: 'POST', body }),

  put: <T>(url: string, body?: any, opts: Omit<RequestInit, 'method'> = {}) =>
    apiFetch<T>(url, { ...opts, method: 'PUT', body }),

  patch: <T>(url: string, body?: any, opts: Omit<RequestInit, 'method'> = {}) =>
    apiFetch<T>(url, { ...opts, method: 'PATCH', body }),

  delete: <T>(url: string, opts: Omit<RequestInit, 'method'> = {}) =>
    apiFetch<T>(url, { ...opts, method: 'DELETE' }),
}
