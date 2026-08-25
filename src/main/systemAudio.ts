import { execFile } from 'child_process'

/** Whether the Mac's own output is muted or silent. A chime that plays into a
 *  muted system fails invisibly: play() resolves, nothing is heard, and the
 *  user has no way to tell the reminder from a missed one. */
export interface OutputState {
  muted: boolean
  /** 0-100, or null when it could not be read. */
  volume: number | null
}

export function getOutputState(): Promise<OutputState> {
  return new Promise((resolve) => {
    execFile(
      'osascript',
      ['-e', 'set s to (get volume settings)', '-e', '(output muted of s as text) & "," & (output volume of s as text)'],
      { timeout: 2000 },
      (err, stdout) => {
        // Never let a failed check block the sound; assume audible.
        if (err) return resolve({ muted: false, volume: null })
        const [mutedText, volumeText] = stdout.trim().split(',')
        const volume = Number(volumeText)
        resolve({
          muted: mutedText === 'true',
          volume: Number.isFinite(volume) ? volume : null,
        })
      },
    )
  })
}
