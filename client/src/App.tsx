import { useEffect, useState } from 'react'
import { api } from './api.ts'
import { TaskForm } from './components/TaskForm.tsx'
import { TaskItem } from './components/TaskItem.tsx'
import type { Task } from './types.ts'

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  async function load(term?: string) {
    setLoading(true)
    const data = await api.list(term)
    setTasks(data)
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [])

  useEffect(() => {
    const id = setTimeout(() => load(search || undefined), 300)
    return () => clearTimeout(id)
  }, [search])

  async function handleCreate(data: { title: string; description?: string }) {
    const task = await api.create(data)
    setTasks((prev) => [task, ...prev])
  }

  async function handleToggle(id: string) {
    const updated = await api.toggleComplete(id)
    setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)))
  }

  async function handleUpdate(id: string, data: { title?: string; description?: string }) {
    const updated = await api.update(id, data)
    setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)))
  }

  async function handleDelete(id: string) {
    await api.remove(id)
    setTasks((prev) => prev.filter((t) => t.id !== id))
  }

  const pending = tasks.filter((t) => !t.completedAt)
  const done = tasks.filter((t) => t.completedAt)

  return (
    <div className="min-h-screen bg-zinc-50 px-4 py-10">
      <div className="mx-auto max-w-2xl">
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-zinc-900">Tasks</h1>
          <p className="mt-1 text-sm text-zinc-500">Native Node.js · Streams · JSON DB</p>
        </header>

        <div className="mb-6">
          <TaskForm onSubmit={handleCreate} />
        </div>

        <div className="mb-6">
          <input
            type="text"
            placeholder="Search tasks…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-zinc-200 bg-white px-4 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 outline-none focus:border-zinc-400 focus:ring-2 focus:ring-zinc-100"
          />
        </div>

        {loading ? (
          <div className="py-16 text-center text-sm text-zinc-400">Loading…</div>
        ) : tasks.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-sm text-zinc-400">No tasks yet. Add one above.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {pending.length > 0 && (
              <section>
                <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-zinc-400">
                  Pending · {pending.length}
                </h2>
                <div className="flex flex-col gap-2">
                  {pending.map((task) => (
                    <TaskItem
                      key={task.id}
                      task={task}
                      onToggle={handleToggle}
                      onUpdate={handleUpdate}
                      onDelete={handleDelete}
                    />
                  ))}
                </div>
              </section>
            )}

            {done.length > 0 && (
              <section>
                <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-zinc-400">
                  Completed · {done.length}
                </h2>
                <div className="flex flex-col gap-2">
                  {done.map((task) => (
                    <TaskItem
                      key={task.id}
                      task={task}
                      onToggle={handleToggle}
                      onUpdate={handleUpdate}
                      onDelete={handleDelete}
                    />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
