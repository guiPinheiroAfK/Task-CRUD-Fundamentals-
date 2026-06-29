import http from 'node:http'
import { Router } from './router.ts'
import { jsonMiddleware } from './middlewares/json.ts'
import { registerTaskRoutes } from './routes/tasks.ts'

const router = new Router()
registerTaskRoutes(router)

const server = http.createServer(async (req, res) => {
  // CORS — allows the Vite dev server (port 5173) to call this server
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    res.writeHead(204).end()
    return
  }

  await jsonMiddleware(req, res)
  await router.handle(req, res)
})

const PORT = process.env.PORT ?? 3333
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
