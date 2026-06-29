import http from 'node:http'

const PORT = process.env.PORT ?? 3333

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify({ message: 'Task CRUD server running' }))
})

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
