import { app } from 'electron'
import { join } from 'path'

// The main bundle always lands in out/main/, so the project root is two levels
// up in dev. app.getAppPath() is not reliable here — under electron-vite it can
// resolve to the script's directory rather than the project root.
const DEV_ROOT = join(__dirname, '../..')

/** Files under build/ ship as extraResources, so their location differs
 *  between dev and a packaged app. Route every asset through here. */
export function assetPath(...segments: string[]): string {
  const base = app.isPackaged ? process.resourcesPath : join(DEV_ROOT, 'build')
  return join(base, ...segments)
}

/** Sound files live outside the asar so Audio() can load them as real files. */
export function soundPath(file: string): string {
  const base = app.isPackaged
    ? join(process.resourcesPath, 'sounds')
    : join(DEV_ROOT, 'resources/sounds')
  return join(base, file)
}
