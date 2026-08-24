/** What the popup is told to display when a break fires. */
export interface ReminderShowPayload {
  /** Seconds the user is asked to move for. */
  breakDurationSec: number
  /** Which exercise to show. Main picks the id; the renderer resolves it to
   *  an SVG component, so no React reaches the main bundle. */
  exerciseId: string
}

/** What the popup sends back when the user acts on it. */
export type BreakAction =
  | { type: 'done' }
  | { type: 'snooze'; minutes: number }
  | { type: 'dismiss' }

export type Phase = 'counting' | 'breaking' | 'paused'

export interface TimerState {
  phase: Phase
  /** Time left in the current phase. */
  remainingMs: number
  /** Epoch ms the next break fires at; 0 while paused. */
  nextBreakAt: number
  /** Epoch ms the pause lifts at, or null for an indefinite pause. */
  pausedUntil: number | null
}

export type BodyArea = 'neck' | 'shoulder' | 'back' | 'wrist' | 'eyes' | 'legs' | 'fullBody'

/** Exercise metadata. Deliberately free of React so the main process can
 *  import it to pick one; the renderer maps id -> SVG component. */
export interface Exercise {
  id: string
  name: { en: string; bn: string }
  bodyArea: BodyArea
  steps: { en: string[]; bn: string[] }
  reps?: string
}
