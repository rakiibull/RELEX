/** What the popup is told to display when a break fires. */
export interface ReminderShowPayload {
  /** Seconds the user is asked to move for. */
  breakDurationSec: number
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
