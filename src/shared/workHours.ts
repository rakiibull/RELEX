import type { WorkHours } from './types'

function toMinutes(hhmm: string): number | null {
  const m = /^(\d{1,2}):(\d{2})$/.exec(hhmm)
  if (!m) return null
  const h = Number(m[1])
  const min = Number(m[2])
  if (h > 23 || min > 59) return null
  return h * 60 + min
}

/** True when reminders should fire. An unparseable or disabled window means
 *  always on, so a bad setting can never silence the app permanently. */
export function isWithinWorkHours(wh: WorkHours, now: Date): boolean {
  if (!wh.enabled) return true

  const start = toMinutes(wh.start)
  const end = toMinutes(wh.end)
  if (start === null || end === null || start === end) return true

  const cur = now.getHours() * 60 + now.getMinutes()

  // An overnight window (22:00–06:00) wraps midnight, so the test is an OR
  // rather than the AND a same-day window needs.
  return start < end ? cur >= start && cur < end : cur >= start || cur < end
}
