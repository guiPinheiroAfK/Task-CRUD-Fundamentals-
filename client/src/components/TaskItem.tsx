import { useState } from 'react'
import type { Task } from '../types.ts'

interface Props {
  task: Task
  onToggle: (id: string) => Promise<void>
  onUpdate: (id: string, data: { title?: string; description?: string }) => Promise<void>
  onDelete: (id: string) => Promise<void>
}

export function TaskItem({ task, onToggle, onUpdate, onDelete }: Props) {
  const [editing, setEditing] = useState(false)
  const [title, setTitle] = useState(task.title)
  const [description, setDescription] = useState(task.description)

  const done = Boolean(task.completedAt)

  async function saveEdit() {
    if (!title.trim()) return
    await onUpdate(task.id, { title: title.trim(), description: description.trim() })
    setEditing(false)
  }

  function cancelEdit() {
    setTitle(task.title)
    setDescription(task.description)
    setEditing(false)
  }

  return (
    <div className={`rounded-xl border p-4 transition-colors ${done ? 'border-zinc-100 bg-zinc-50' : 'border-zinc-200 bg-white'}`}>
      {editing ? (
        <div className="flex flex-col gap-2">
          <input
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="rounded-lg border border-zinc-300 px-3 py-1.5 text-sm font-medium text-zinc-900 outline-none focus:border-zinc-500"
          />
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
            className="rounded-lg border border-zinc-300 px-3 py-1.5 text-sm text-zinc-600 outline-none focus:border-zinc-500"
          />
          <div className="flex gap-2 pt-1">
            <button onClick={saveEdit} className="rounded-lg bg-zinc-900 px-4 py-1.5 text-xs font-medium text-white hover:opacity-80">
              Save
            </button>
            <button onClick={cancelEdit} className="rounded-lg border border-zinc-200 px-4 py-1.5 text-xs font-medium text-zinc-600 hover:bg-zinc-50">
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-start gap-3">
          <button
            onClick={() => onToggle(task.id)}
            aria-label={done ? 'Mark as pending' : 'Mark as complete'}
            className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
              done ? 'border-emerald-500 bg-emerald-500 text-white' : 'border-zinc-300 hover:border-zinc-500'
            }`}
          >
            {done && (
              <svg className="h-3 w-3" viewBox="0 0 12 12" fill="none">
                <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </button>

          <div className="min-w-0 flex-1">
            <p className={`text-sm font-medium leading-5 ${done ? 'text-zinc-400 line-through' : 'text-zinc-900'}`}>
              {task.title}
            </p>
            {task.description && (
              <p className={`mt-0.5 text-xs ${done ? 'text-zinc-400' : 'text-zinc-500'}`}>{task.description}</p>
            )}
            <p className="mt-1.5 text-xs text-zinc-400">
              {done
                ? `Completed ${new Date(task.completedAt!).toLocaleDateString()}`
                : `Added ${new Date(task.createdAt).toLocaleDateString()}`}
            </p>
          </div>

          <div className="flex gap-1">
            <button
              onClick={() => setEditing(true)}
              aria-label="Edit task"
              className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700"
            >
              <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none">
                <path d="M11.5 2.5l2 2-8 8H3.5v-2l8-8z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button
              onClick={() => onDelete(task.id)}
              aria-label="Delete task"
              className="rounded-lg p-1.5 text-zinc-400 hover:bg-red-50 hover:text-red-500"
            >
              <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none">
                <path d="M3 4h10M6 4V2.5h4V4M5.5 4l.5 9h4l.5-9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
