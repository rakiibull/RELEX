import { app, ipcMain } from 'electron'
import { pathToFileURL } from 'url'
import { CH } from '../shared/channels'
import type { BreakAction, Settings, TimerState } from '../shared/types'
import { EXERCISES, pickNextExercise } from '../shared/exercises'
import { isWithinWorkHours } from '../shared/workHours'
import { initLog, log } from './log'
import * as scheduler from './scheduler'
import { registerPowerEvents } from './powerEvents'
import { createTray, updateTray, destroyTray } from './tray'
import { soundPath } from './paths'
import { getLaunchAtLogin, setLaunchAtLogin } from './loginItem'
import {
  getRecentExerciseIds,
  getSettings,
  setRecentExerciseIds,
  setSettings,
} from './store'
import {
  createReminderWindow,
  showReminder,
  hideReminder,
  sendTimerState,
  sendBreakComplete,
} from './windows/reminderWindow'
import {
  createSettingsWindow,
  showSettings,
  hideSettings,
  sendSettings,
  markQuitting,
} from './windows/settingsWindow'

/** Waiting out a 30-minute interval to check a change is impractical, so both
 *  durations can be overridden for a dev run:
 *    RELEX_INTERVAL_SEC=10 RELEX_BREAK_SEC=15 npm run dev */
function devOverrideSec(envVar: string): number | null {
  const raw = Number(process.env[envVar])
  return Number.isFinite(raw) && raw > 0 ? raw : null
}

/** How long the "Nice work" card stays up after a completed break. */
const NICE_WORK_MS = 3000
const RECENT_LIMIT = 6

let settings: Settings
let hideTimer: NodeJS.Timeout | null = null

function schedulerConfig(): scheduler.SchedulerConfig {
  const intervalSec = devOverrideSec('RELEX_INTERVAL_SEC')
  const breakSec = devOverrideSec('RELEX_BREAK_SEC')
  return {
    intervalMinutes: intervalSec !== null ? intervalSec / 60 : settings.intervalMinutes,
    breakDurationSec: breakSec ?? settings.breakDurationSec,
    snoozeMinutes: settings.snoozeMinutes,
    maxSnoozes: settings.maxSnoozes,
  }
}

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

/** Ids of the last few exercises, oldest first, persisted so variety survives
 *  a restart. */
function nextExerciseId(): string {
  const recent = getRecentExerciseIds()
  const exercise = pickNextExercise(EXERCISES, recent)
  setRecentExerciseIds([...recent, exercise.id].slice(-RECENT_LIMIT))
  return exercise.id
}

function onState(state: TimerState): void {
  updateTray(state)
  sendTimerState(state)
}

function startBreak(): void {
  // Outside work hours the scheduler keeps running but the popup is suppressed
  // and the interval restarts — stopping it would need separate restart logic.
  if (!isWithinWorkHours(settings.workHours, new Date())) {
    scheduler.skipNext()
    return
  }

  clearHideTimer()
  showReminder({
    breakDurationSec: schedulerConfig().breakDurationSec,
    exerciseId: nextExerciseId(),
    soundEnabled: settings.soundEnabled,
    volume: settings.volume,
    chimeUrl: pathToFileURL(soundPath('chime.wav')).toString(),
    doneUrl: pathToFileURL(soundPath('done.wav')).toString(),
    canSnooze: scheduler.snoozesLeft() > 0,
    snoozeMinutes: settings.snoozeMinutes,
  })
}

// Two copies running would mean two sets of reminders.
if (!app.requestSingleInstanceLock()) {
  app.quit()
} else {
  // Before anything else, so a crash during startup still gets written down.
  initLog()
  process.on('uncaughtException', (err) => {
    log(`uncaught: ${err.stack ?? String(err)}`)
  })
  log(`launched, packaged=${app.isPackaged}`)

  app.whenReady().then(() => {
    log(`ready, userData=${app.getPath('userData')}`)
    // Menu-bar app: no Dock icon.
    app.dock?.hide()

    settings = getSettings()
    // The user can revoke launch-at-login in System Settings behind our back.
    settings.launchAtLogin = getLaunchAtLogin()

    createReminderWindow()
    createSettingsWindow()

    createTray({
      breakNow: () => scheduler.breakNow(),
      skipNext: () => scheduler.skipNext(),
      pauseFor: (minutes) => scheduler.pauseFor(minutes),
      pauseUntilTomorrow: () => scheduler.pauseUntilTomorrow(),
      resume: () => scheduler.resume(),
      openSettings: showSettings,
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

    ipcMain.handle(CH.SETTINGS_GET, () => settings)

    ipcMain.handle(CH.SETTINGS_SET, (_e, next: Settings) => {
      const previous = settings
      settings = setSettings(next)

      if (settings.launchAtLogin !== previous.launchAtLogin) {
        setLaunchAtLogin(settings.launchAtLogin)
      }
      scheduler.updateConfig(schedulerConfig())
      sendSettings(settings)
      return settings
    })

    ipcMain.handle(CH.SETTINGS_TEST_SOUND, () => ({
      url: pathToFileURL(soundPath('chime.wav')).toString(),
      volume: settings.volume,
    }))

    ipcMain.handle(CH.WINDOW_CLOSE, () => hideSettings())

    registerPowerEvents()

    log(`ready, interval=${schedulerConfig().intervalMinutes}min`)

    scheduler.start(schedulerConfig(), {
      onBreakStart: startBreak,
      onBreakEnd: (completed) => {
        // A break that ran its course leaves the "Nice work" card up briefly;
        // one the user dismissed should disappear at once.
        if (completed) {
          sendBreakComplete()
          hideAfter(NICE_WORK_MS)
        } else {
          hideReminder()
        }
      },
      onState,
    })
  })

  // Keep running with no visible window — this is a menu-bar app.
  app.on('window-all-closed', () => {
    // Intentionally empty: do not quit.
  })

  app.on('before-quit', () => {
    markQuitting()
    scheduler.stop()
    destroyTray()
  })
}
