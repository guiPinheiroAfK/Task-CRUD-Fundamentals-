import type { IncomingMessage, ServerResponse } from 'node:http'
import { buildRoutePath } from './utils/build-route-path.ts'

export interface ExtendedRequest extends IncomingMessage {
  params: Record<string, string>
  query: Record<string, string>
  body: unknown
}

type Handler = (req: ExtendedRequest, res: ServerResponse) => void | Promise<void>

interface Route {
  method: string
  path: RegExp
  handler: Handler
}

export class Router {
  #routes: Route[] = []

  #register(method: string, path: string, handler: Handler) {
    this.#routes.push({ method, path: buildRoutePath(path), handler })
  }

  get(path: string, handler: Handler) { this.#register('GET', path, handler) }
  post(path: string, handler: Handler) { this.#register('POST', path, handler) }
  put(path: string, handler: Handler) { this.#register('PUT', path, handler) }
  patch(path: string, handler: Handler) { this.#register('PATCH', path, handler) }
  delete(path: string, handler: Handler) { this.#register('DELETE', path, handler) }

  async handle(req: IncomingMessage, res: ServerResponse): Promise<void> {
    const extReq = req as ExtendedRequest
    const url = req.url ?? '/'

    const route = this.#routes.find(
      (r) => r.method === req.method && r.path.test(url),
    )

    if (!route) {
      res.writeHead(404).end(JSON.stringify({ error: 'Route not found' }))
      return
    }

    const { query = '', ...params } = url.match(route.path)?.groups ?? {}
    extReq.params = params as Record<string, string>
    extReq.query = query
      ? Object.fromEntries(new URLSearchParams(query.slice(1)))
      : {}

    await route.handler(extReq, res)
  }
}
