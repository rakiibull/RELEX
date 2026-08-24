import type { Phase, TimerState } from '../shared/types'

const TICK_MS = 1000

export interface SchedulerConfig {
  intervalMinutes: number
  breakDurationSec: number
  snoozeMinutes: number
  maxSnoozes: number
}

export interface SchedulerHooks {
  onBreakStart: () => void
  /** completed is true when the break ran its full duration, false when the
   *  user ended it early (done, snooze, dismiss) or it was interrupted. */
  onBreakEnd: (completed: boolean) => void
  onState: (state: TimerState) => void
}

let config: SchedulerConfig
let hooks: SchedulerHooks

let phase: Phase = 'counting'
/** Epoch ms the current phase ends. The single source of truth — every tick
 *  recomputes from Date.now(), so drift cannot accumulate and a missed tick
 *  (system sleep) self-heals. */
let deadline = 0
let pausedUntil: number | null = null
/** Set while the system paused us (sleep, lock) so a system resume does not
 *  clobber a pause the user asked for. */
let systemPaused = false
/** The work deadline captured when a pause began, so a resume can tell
 *  whether the break fell due while the machine was asleep. */
let deadlineAtPause = 0
let pauseStartedAt = 0
let consecutiveSnoozes = 0
let tick: NodeJS.Timeout | null = null

function remaining(): number {
  return Math.max(0, deadline - Date.now())
}

function state(): TimerState {
  return {
    phase,
    remainingMs: phase === 'paused' ? 0 : remaining(),
    nextBreakAt: phase === 'counting' ? deadline : 0,
    pausedUntil,
  }
}

function emit(): void {
  hooks.onState(state())
}

function onTick(): void {
  if (phase === 'paused') {
    if (pausedUntil !== null && Date.now() >= pausedUntil) resume()
    else emit()
    return
  }

  if (remaining() > 0) {
    emit()
    return
  }

  if (phase === 'counting') startBreak()
  else endBreak()
}

function ensureTicking(): void {
  if (!tick) tick = setInterval(onTick, TICK_MS)
}

function startBreak(): void {
  phase = 'breaking'
  deadline = Date.now() + config.breakDurationSec * 1000
  hooks.onBreakStart()
  emit()
}

function endBreak(): void {
  hooks.onBreakEnd(true)
  startWorkInterval()
}

/** Begin (or restart) a full work interval. */
function startWorkInterval(): void {
  phase = 'counting'
  consecutiveSnoozes = 0
  deadline = Date.now() + config.intervalMinutes * 60_000
  pausedUntil = null
  ensureTicking()
  emit()
}

export function start(cfg: SchedulerConfig, h: SchedulerHooks): void {
  config = cfg
  hooks = h
  startWorkInterval()
}

export function updateConfig(cfg: SchedulerConfig): void {
  const intervalChanged = cfg.intervalMinutes !== config.intervalMinutes
  config = cfg
  // Re-base the current interval so a changed setting takes effect now rather
  // than after the pending one elapses.
  if (intervalChanged && phase === 'counting') startWorkInterval()
}

export function getState(): TimerState {
  return state()
}

export function breakNow(): void {
  startBreak()
}

/** Skip the pending break and start a fresh work interval. */
export function skipNext(): void {
  startWorkInterval()
}

/** Finish the break early. */
export function done(): void {
  hooks.onBreakEnd(false)
  startWorkInterval()
}

/** Returns false when the snooze cap is reached, so the caller can stop
 *  offering it — an uncapped snooze makes the app pointless. */
export function snooze(): boolean {
  if (consecutiveSnoozes >= config.maxSnoozes) return false
  consecutiveSnoozes += 1
  hooks.onBreakEnd(false)
  phase = 'counting'
  deadline = Date.now() + config.snoozeMinutes * 60_000
  ensureTicking()
  emit()
  return true
}

export function snoozesLeft(): number {
  return Math.max(0, config.maxSnoozes - consecutiveSnoozes)
}

export function pauseFor(minutes: number | null, opts: { system?: boolean } = {}): void {
  if (phase === 'breaking') hooks.onBreakEnd(false)
  // Remember what was due so a system resume can tell whether the break came
  // due while we were asleep.
  deadlineAtPause = phase === 'counting' ? deadline : 0
  pauseStartedAt = Date.now()
  phase = 'paused'
  pausedUntil = minutes === null ? null : Date.now() + minutes * 60_000
  systemPaused = opts.system === true
  ensureTicking()
  emit()
}

export function resume(opts: { system?: boolean } = {}): void {
  // A system resume must not lift a pause the user asked for.
  if (opts.system && !systemPaused) return

  // A sleep/lock pause should give back the time that was left when it began,
  // not restart the whole interval — otherwise closing the lid repeatedly
  // would postpone breaks indefinitely.
  const leftover = opts.system && deadlineAtPause > 0 ? deadlineAtPause - pauseStartedAt : 0
  systemPaused = false
  deadlineAtPause = 0

  if (leftover > 0) rescheduleIn(leftover)
  else startWorkInterval()
}

export function pauseUntilTomorrow(): void {
  const tomorrow = new Date()
  tomorrow.setHours(24, 0, 0, 0)
  pauseFor(Math.ceil((tomorrow.getTime() - Date.now()) / 60_000))
}

/** Push the next break out by ms — used after wake so the reminder does not
 *  ambush the user the instant the lid opens. */
export function rescheduleIn(ms: number): void {
  systemPaused = false
  phase = 'counting'
  pausedUntil = null
  deadline = Date.now() + ms
  ensureTicking()
  emit()
}

export function isSystemPaused(): boolean {
  return systemPaused
}

/** True when the break is already due — including one that fell due while the
 *  machine was asleep, which is why the paused case consults the deadline
 *  captured at pause time. */
export function isOverdue(): boolean {
  if (phase === 'counting') return remaining() <= 0
  if (phase === 'paused') return deadlineAtPause > 0 && Date.now() >= deadlineAtPause
  return false
}

export function stop(): void {
  if (tick) clearInterval(tick)
  tick = null
}
