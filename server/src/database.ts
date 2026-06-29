import fs from 'node:fs'
import { promises as fsAsync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DB_PATH = path.resolve(__dirname, '../db.json')

type Row = Record<string, unknown>
type DatabaseData = Record<string, Row[]>

export class Database {
  #data: DatabaseData = {}

  constructor() {
    try {
      this.#data = JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'))
    } catch {
      this.#flush()
    }
  }

  // Async write — non-blocking I/O, data is already in memory
  #flush() {
    fsAsync.writeFile(DB_PATH, JSON.stringify(this.#data, null, 2))
  }

  select<T extends Row>(table: string, search?: Partial<Record<keyof T, string>>): T[] {
    const rows = (this.#data[table] ?? []) as T[]
    if (!search) return rows

    const filters = Object.entries(search).filter(([, v]) => Boolean(v))
    if (!filters.length) return rows

    // OR semantics: row matches if any field contains the search term
    return rows.filter((row) =>
      filters.some(([key, value]) => {
        const cell = row[key]
        return typeof cell === 'string' && cell.toLowerCase().includes(value!.toLowerCase())
      }),
    )
  }

  insert<T extends Row>(table: string, row: T): T {
    if (!this.#data[table]) this.#data[table] = []
    this.#data[table].push(row)
    this.#flush()
    return row
  }

  update<T extends Row>(table: string, id: string, data: Partial<T>): T | null {
    const rows = this.#data[table] ?? []
    const idx = rows.findIndex((r) => r.id === id)
    if (idx === -1) return null

    rows[idx] = { ...rows[idx], ...data }
    this.#flush()
    return rows[idx] as T
  }

  delete(table: string, id: string): boolean {
    const rows = this.#data[table] ?? []
    const idx = rows.findIndex((r) => r.id === id)
    if (idx === -1) return false

    rows.splice(idx, 1)
    this.#flush()
    return true
  }
}
