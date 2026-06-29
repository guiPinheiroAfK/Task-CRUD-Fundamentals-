import type { IncomingMessage, ServerResponse } from 'node:http'
import type { ExtendedRequest } from '../router.ts'

// Reads request body chunk-by-chunk via async iteration of the readable stream.
// Buffers never exceed the actual payload — no all-at-once allocation.
export async function jsonMiddleware(req: IncomingMessage, res: ServerResponse): Promise<void> {
  const isJson = req.headers['content-type']?.includes('application/json')

  if (isJson) {
    const chunks: Buffer[] = []

    for await (const chunk of req) {
      chunks.push(chunk as Buffer)
    }

    try {
      ;(req as ExtendedRequest).body = JSON.parse(Buffer.concat(chunks).toString('utf-8'))
    } catch {
      ;(req as ExtendedRequest).body = null
    }
  } else {
    ;(req as ExtendedRequest).body = null
  }

  res.setHeader('Content-Type', 'application/json')
}
