# Task CRUD — Node.js Fundamentals

A full-stack task manager built to understand how HTTP and I/O work at their most primitive level — no Express, no ORM, no magic.

## Concepts explored

| Layer | Concept |
|---|---|
| **Routing** | Native `http.createServer` intercepts every request; method + regex matching dispatches to handlers |
| **Streams** | Request body is consumed chunk-by-chunk via `for await...of` on the readable stream |
| **JSON Database** | In-memory store backed by `db.json`; synchronous read on boot, async write on every mutation |
| **REST conventions** | Correct status codes (200, 201, 204, 400, 404), PATCH for partial toggle, PUT for full field update |

## Stack

- **Backend** — Node.js + TypeScript (tsx), native `node:http`, `node:crypto`, `node:fs`
- **Frontend** — React 18 + Tailwind CSS + Vite (proxy → avoids CORS in dev)

## Setup

### Backend
```bash
cd server
npm install
npm run dev          # tsx watch — hot-reload on save
```
Runs on **http://localhost:3333**

### Frontend
```bash
cd client
npm install
npm run dev
```
Runs on **http://localhost:5173** — API calls are proxied to port 3333.

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/tasks?search=` | List all tasks, optional keyword filter |
| `POST` | `/tasks` | Create a task `{ title, description? }` |
| `PUT` | `/tasks/:id` | Update title and/or description |
| `PATCH` | `/tasks/:id/complete` | Toggle completed status |
| `DELETE` | `/tasks/:id` | Remove a task |
