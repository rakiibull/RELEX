import { app } from 'electron'
import { appendFileSync } from 'fs'
import { join } from 'path'

/** A packaged app has nowhere to print to, so startup problems are invisible
 *  unless they are written down. Set RELEX_DEBUG=1 to also mirror to stderr. */
let logPath: string | null = null

export function initLog(): void {
  try {
    logPath = join(app.getPath('userData'), 'relex.log')
  } catch {
    logPath = null
  }
}

export function log(message: string): void {
  const line = `${new Date().toISOString()} ${message}\n`
  if (process.env['RELEX_DEBUG']) process.stderr.write(line)
  if (!logPath) return
  try {
    appendFileSync(logPath, line)
  } catch {
    // Logging must never take the app down.
  }
}
