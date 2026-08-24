import { BrowserWindow, screen, shell } from 'electron'
import { join } from 'path'
import { CH } from '../../shared/channels'
import type { ReminderShowPayload } from '../../shared/types'

let win: BrowserWindow | null = null

export function createReminderWindow(): BrowserWindow {
  win = new BrowserWindow({
    width: 720,
    height: 560,
    show: false,
    frame: false,
    transparent: true,
    backgroundColor: '#00000000',
    resizable: false,
    minimizable: false,
    maximizable: false,
    // Must stay false: .fullScreenAuxiliary and .fullScreenPrimary are mutually
    // exclusive, so a fullscreenable window silently ignores visibleOnFullScreen.
    fullscreenable: false,
    skipTaskbar: true,
    // A shadow on a transparent window leaves grey rectangle ghosts on macOS.
    hasShadow: false,
    // Without this the first click only activates the window, so every
    // dismissal would take two clicks.
    acceptFirstMouse: true,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      contextIsolation: true,
      nodeIntegration: false,
      backgroundThrottling: false,
      // The popup appears with no user gesture, so audio.play() would be
      // blocked and the alarm would be silently missing.
      autoplayPolicy: 'no-user-gesture-required',
    },
  })

  win.setAlwaysOnTop(true, 'screen-saver')
  win.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true })

  win.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url)
    return { action: 'deny' }
  })

  if (process.env['ELECTRON_RENDERER_URL']) {
    win.loadURL(`${process.env['ELECTRON_RENDERER_URL']}/reminder.html`)
  } else {
    win.loadFile(join(__dirname, '../renderer/reminder.html'))
  }

  return win
}

/** Centre on whichever display holds the cursor — the best proxy for where
 *  the user is actually looking. Re-run on every show; displays come and go. */
function positionOnActiveDisplay(w: BrowserWindow): void {
  const cursor = screen.getCursorScreenPoint()
  // workArea excludes the menu bar and Dock; bounds would sit the card low.
  const { workArea } = screen.getDisplayNearestPoint(cursor)
  const { width, height } = w.getBounds()
  w.setBounds({
    x: Math.round(workArea.x + (workArea.width - width) / 2),
    y: Math.round(workArea.y + (workArea.height - height) / 2),
    width,
    height,
  })
}

export function showReminder(payload: ReminderShowPayload): void {
  if (!win || win.isDestroyed()) return

  positionOnActiveDisplay(win)
  // Re-assert: these can be lost across space/display changes.
  win.setAlwaysOnTop(true, 'screen-saver')
  win.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true })

  win.webContents.send(CH.REMINDER_SHOW, payload)

  // showInactive, never show: show() steals keyboard focus and would swallow
  // keystrokes from the editor mid-typing.
  win.showInactive()
}

export function hideReminder(): void {
  if (win && !win.isDestroyed()) win.hide()
}
