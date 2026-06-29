// Converts "/tasks/:id" → RegExp that captures named params and the query string.
// Named capture groups (e.g. ?<id>) make extraction clean and zero-indexed-free.
export function buildRoutePath(path: string): RegExp {
  const paramPattern = /:([a-zA-Z]+)/g
  const withParams = path.replaceAll(paramPattern, '(?<$1>[a-z0-9\\-_]+)')
  return new RegExp(`^${withParams}(?<query>\\?.*)?$`)
}
