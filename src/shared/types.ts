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
