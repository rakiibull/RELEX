import { BrowserWindow, shell } from 'electron'
import { join } from 'path'
import { CH } from '../../shared/channels'
import type { Settings } from '../../shared/types'

let win: BrowserWindow | null = null
let isQuitting = false

export function markQuitting(): void {
  isQuitting = true
}

export function createSettingsWindow(): BrowserWindow {
  win = new BrowserWindow({
    width: 520,
    height: 880,
    show: false,
    title: 'RELEX Settings',
    titleBarStyle: 'hiddenInset',
    backgroundColor: '#16181d',
    resizable: false,
    maximizable: false,
    fullscreenable: false,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      contextIsolation: true,
      nodeIntegration: false,
      // The Test sound button needs to play without a prior gesture in some
      // states; the popup window needs it always.
      autoplayPolicy: 'no-user-gesture-required',
    },
  })

  win.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url)
    return { action: 'deny' }
  })

  // Closing must hide, not destroy — this is a menu-bar app that outlives its
  // windows. The isQuitting guard keeps Cmd+Q working.
  win.on('close', (e) => {
    if (!isQuitting) {
      e.preventDefault()
      win?.hide()
    }
  })

  if (process.env['ELECTRON_RENDERER_URL']) {
    win.loadURL(`${process.env['ELECTRON_RENDERER_URL']}/index.html`)
  } else {
    win.loadFile(join(__dirname, '../renderer/index.html'))
  }

  return win
}

export function showSettings(): void {
  if (!win || win.isDestroyed()) return
  win.show()
  win.focus()
}

export function hideSettings(): void {
  if (win && !win.isDestroyed()) win.hide()
}

export function sendSettings(settings: Settings): void {
  if (win && !win.isDestroyed()) win.webContents.send(CH.SETTINGS_CHANGED, settings)
}
