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
}
