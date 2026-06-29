import { randomUUID } from 'node:crypto'
import type { ServerResponse } from 'node:http'
import { Database } from '../database.ts'
import type { ExtendedRequest, Router } from '../router.ts'

interface Task {
  id: string
  title: string
  description: string
  completedAt: string | null
  createdAt: string
  updatedAt: string
}

const db = new Database()

function send(res: ServerResponse, status: number, data: unknown) {
  res.writeHead(status).end(JSON.stringify(data))
}

export function registerTaskRoutes(router: Router) {
  // GET /tasks?search=
  router.get('/tasks', (req: ExtendedRequest, res: ServerResponse) => {
    const { search } = req.query
    const tasks = db.select<Task>('tasks', search ? { title: search, description: search } : undefined)
    send(res, 200, tasks)
  })

  // POST /tasks
  router.post('/tasks', (req: ExtendedRequest, res: ServerResponse) => {
    const { title, description } = (req.body ?? {}) as { title?: string; description?: string }

    if (!title?.trim()) {
      send(res, 400, { error: 'title is required' })
      return
    }

    const task = db.insert<Task>('tasks', {
      id: randomUUID(),
      title: title.trim(),
      description: description?.trim() ?? '',
      completedAt: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })

    send(res, 201, task)
  })

  // DELETE /tasks/:id
  router.delete('/tasks/:id', (req: ExtendedRequest, res: ServerResponse) => {
    const deleted = db.delete('tasks', req.params.id)

    if (!deleted) {
      send(res, 404, { error: 'Task not found' })
      return
    }

    res.writeHead(204).end()
  })

  // PUT /tasks/:id — update title and/or description
  router.put('/tasks/:id', (req: ExtendedRequest, res: ServerResponse) => {
    const { title, description } = (req.body ?? {}) as { title?: string; description?: string }

    if (!title?.trim() && description === undefined) {
      send(res, 400, { error: 'Provide at least title or description' })
      return
    }

    const updated = db.update<Task>('tasks', req.params.id, {
      ...(title?.trim() && { title: title.trim() }),
      ...(description !== undefined && { description: description.trim() }),
      updatedAt: new Date().toISOString(),
    })

    if (!updated) {
      send(res, 404, { error: 'Task not found' })
      return
    }

    send(res, 200, updated)
  })
}
