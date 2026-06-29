import type { Task } from './types.ts'

const BASE = '/api'

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...init,
  })
  if (res.status === 204) return undefined as T
  return res.json() as Promise<T>
}

export const api = {
  list: (search?: string) =>
    request<Task[]>(`/tasks${search ? `?search=${encodeURIComponent(search)}` : ''}`),

  create: (data: { title: string; description?: string }) =>
    request<Task>('/tasks', { method: 'POST', body: JSON.stringify(data) }),

  update: (id: string, data: { title?: string; description?: string }) =>
    request<Task>(`/tasks/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  toggleComplete: (id: string) =>
    request<Task>(`/tasks/${id}/complete`, { method: 'PATCH' }),

  remove: (id: string) =>
    request<void>(`/tasks/${id}`, { method: 'DELETE' }),
}
