import type { Exercise } from '../types'
import { EXERCISES } from './data'

export { EXERCISES }

export function findExercise(id: string): Exercise | undefined {
  return EXERCISES.find((e) => e.id === id)
}

/** Pick an exercise the user has not seen recently, preferring a body area
 *  they have not just worked. recentIds is oldest-first. */
export function pickNextExercise(all: Exercise[], recentIds: string[]): Exercise {
  // Half the catalogue at most, so the pool can never empty out.
  const historyLen = Math.min(recentIds.length, Math.floor(all.length / 2))
  const recent = new Set(recentIds.slice(recentIds.length - historyLen))

  let pool = all.filter((e) => !recent.has(e.id))

  // Prefer a muscle group that has not come up lately.
  const recentAreas = new Set(all.filter((e) => recent.has(e.id)).map((e) => e.bodyArea))
  const fresh = pool.filter((e) => !recentAreas.has(e.bodyArea))
  if (fresh.length > 0) pool = fresh

  if (pool.length === 0) pool = all
  return pool[Math.floor(Math.random() * pool.length)]
}
