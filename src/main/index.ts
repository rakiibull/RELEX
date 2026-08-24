import { app, ipcMain } from 'electron'
import { CH } from '../shared/channels'
import type { BreakAction, TimerState } from '../shared/types'
import { EXERCISES, pickNextExercise } from '../shared/exercises'
import * as scheduler from './scheduler'
import { registerPowerEvents } from './powerEvents'
import { createTray, updateTray, destroyTray } from './tray'
import {
  createReminderWindow,
  showReminder,
  hideReminder,
  sendTimerState,
} from './windows/reminderWindow'

/** Waiting out a 30-minute interval to check a change is impractical, so both
 *  durations can be overridden for a dev run:
 *    RELEX_INTERVAL_SEC=10 RELEX_BREAK_SEC=15 npm run dev
 *  Phase 5 moves these into persisted settings. */
function seconds(envVar: string, fallbackSec: number): number {
  const raw = Number(process.env[envVar])
  return Number.isFinite(raw) && raw > 0 ? raw : fallbackSec
}

const CONFIG = {
  intervalMinutes: seconds('RELEX_INTERVAL_SEC', 30 * 60) / 60,
  breakDurationSec: seconds('RELEX_BREAK_SEC', 180),
  snoozeMinutes: seconds('RELEX_SNOOZE_SEC', 5 * 60) / 60,
  maxSnoozes: 3,
}

/** How long the "Nice work" card stays up after a completed break. */
const NICE_WORK_MS = 3000

/** Ids of the last few exercises shown, oldest first, so the same stretch
 *  does not come round twice in a row. Phase 5 persists this. */
const recentExerciseIds: string[] = []
const RECENT_LIMIT = 6

function nextExerciseId(): string {
  const exercise = pickNextExercise(EXERCISES, recentExerciseIds)
  recentExerciseIds.push(exercise.id)
  if (recentExerciseIds.length > RECENT_LIMIT) recentExerciseIds.shift()
  return exercise.id
}

let hideTimer: NodeJS.Timeout | null = null

function clearHideTimer(): void {
  if (hideTimer) clearTimeout(hideTimer)
  hideTimer = null
}

function hideAfter(ms: number): void {
  clearHideTimer()
  hideTimer = setTimeout(() => {
    hideTimer = null
    hideReminder()
  }, ms)
}

function onState(state: TimerState): void {
  updateTray(state)
  sendTimerState(state)
}

// Two copies running would mean two sets of reminders.
if (!app.requestSingleInstanceLock()) {
  app.quit()
} else {
  app.whenReady().then(() => {
    // Menu-bar app: no Dock icon.
    app.dock?.hide()

    createReminderWindow()

    createTray({
      breakNow: () => scheduler.breakNow(),
      skipNext: () => scheduler.skipNext(),
      pauseFor: (minutes) => scheduler.pauseFor(minutes),
      pauseUntilTomorrow: () => scheduler.pauseUntilTomorrow(),
      resume: () => scheduler.resume(),
      quit: () => app.quit(),
    })

    ipcMain.handle(CH.BREAK_ACTION, (_e, action: BreakAction) => {
      switch (action.type) {
        case 'done':
          scheduler.done()
          break
        case 'snooze':
          // Falls through to a full interval once the snooze cap is hit.
          if (!scheduler.snooze()) scheduler.skipNext()
          break
        case 'dismiss':
          scheduler.skipNext()
          break
      }
    })

    registerPowerEvents()

    scheduler.start(CONFIG, {
      onBreakStart: () => {
        clearHideTimer()
        showReminder({
          breakDurationSec: CONFIG.breakDurationSec,
          exerciseId: nextExerciseId(),
        })
      },
      onBreakEnd: (completed) => {
        // A break that ran its course leaves the "Nice work" card up briefly;
        // one the user dismissed should disappear at once.
        if (completed) hideAfter(NICE_WORK_MS)
        else hideReminder()
      },
      onState,
    })
  })

  // Keep running with no visible window — this is a menu-bar app.
  app.on('window-all-closed', () => {
    // Intentionally empty: do not quit.
  })

  app.on('before-quit', () => {
    scheduler.stop()
    destroyTray()
  })
}
