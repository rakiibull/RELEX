#!/usr/bin/env node
// Start and stop RELEX at the work hours it is configured with, using macOS
// launchd. "Launch at login" only covers boot; this covers the clock.
//
//   node scripts/schedule.js install    read work hours, install the agents
//   node scripts/schedule.js uninstall  remove them
//   node scripts/schedule.js status     show what is installed
//
// Two agents are needed: launchd can start a job on a schedule, but has no
// notion of stopping one, so the stop side is a tiny script of its own.

const { execFileSync } = require('child_process')
const { writeFileSync, unlinkSync, existsSync, mkdirSync, readFileSync } = require('fs')
const os = require('os')
const path = require('path')

const APP = '/Applications/RELEX.app'
const AGENTS = path.join(os.homedir(), 'Library', 'LaunchAgents')
const START_LABEL = 'com.rakiibull.relex.start'
const STOP_LABEL = 'com.rakiibull.relex.stop'
const CONFIG = path.join(os.homedir(), 'Library', 'Application Support', 'relex', 'config.json')

const plistPath = (label) => path.join(AGENTS, `${label}.plist`)

function fail(message) {
  console.error(`\n✗ ${message}\n`)
  process.exit(1)
}

function parseHHMM(value, what) {
  const m = /^(\d{1,2}):(\d{2})$/.exec(value ?? '')
  if (!m) fail(`Could not read ${what} from your settings (got ${JSON.stringify(value)}).`)
  const hour = Number(m[1])
  const minute = Number(m[2])
  if (hour > 23 || minute > 59) fail(`${what} is not a valid time: ${value}`)
  return { hour, minute }
}

function readWorkHours() {
  if (!existsSync(CONFIG)) {
    fail('No settings file yet. Open RELEX once, set your work hours, then run this again.')
  }
  const { settings } = JSON.parse(readFileSync(CONFIG, 'utf8'))
  const wh = settings?.workHours
  if (!wh?.enabled) {
    fail('Work hours are switched off in RELEX. Turn them on in Settings first.')
  }
  return { start: parseHHMM(wh.start, 'start time'), end: parseHHMM(wh.end, 'end time') }
}

/** launchd wants literal XML; keep it in one place. */
function plist(label, programArgs, { hour, minute }) {
  const args = programArgs.map((a) => `      <string>${a}</string>`).join('\n')
  return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
  <dict>
    <key>Label</key>
    <string>${label}</string>
    <key>ProgramArguments</key>
    <array>
${args}
    </array>
    <key>StartCalendarInterval</key>
    <dict>
      <key>Hour</key><integer>${hour}</integer>
      <key>Minute</key><integer>${minute}</integer>
    </dict>
    <key>RunAtLoad</key>
    <false/>
  </dict>
</plist>
`
}

function load(label) {
  // bootout first so a re-install replaces cleanly; it fails when nothing is
  // loaded, which is fine.
  try {
    execFileSync('launchctl', ['bootout', `gui/${process.getuid()}/${label}`], { stdio: 'pipe' })
  } catch {
    /* not loaded */
  }
  execFileSync('launchctl', ['bootstrap', `gui/${process.getuid()}`, plistPath(label)], {
    stdio: 'inherit',
  })
}

function unload(label) {
  try {
    execFileSync('launchctl', ['bootout', `gui/${process.getuid()}/${label}`], { stdio: 'pipe' })
  } catch {
    /* not loaded */
  }
  if (existsSync(plistPath(label))) unlinkSync(plistPath(label))
}

function install() {
  if (!existsSync(APP)) fail(`${APP} not found. Install the app there first.`)
  const { start, end } = readWorkHours()

  mkdirSync(AGENTS, { recursive: true })

  writeFileSync(
    plistPath(START_LABEL),
    // -g keeps RELEX from stealing focus as it opens.
    plist(START_LABEL, ['/usr/bin/open', '-g', '-a', APP], start),
  )
  // pkill matches the binary path so it cannot hit anything else.
  writeFileSync(
    plistPath(STOP_LABEL),
    plist(STOP_LABEL, ['/usr/bin/pkill', '-f', `${APP}/Contents/MacOS/RELEX`], end),
  )

  load(START_LABEL)
  load(STOP_LABEL)

  const fmt = (t) => `${String(t.hour).padStart(2, '0')}:${String(t.minute).padStart(2, '0')}`
  console.log(`\n✓ RELEX will start at ${fmt(start)} and quit at ${fmt(end)} every day.`)
  console.log('  Change your work hours in Settings, then run this again to match.\n')
}

function uninstall() {
  unload(START_LABEL)
  unload(STOP_LABEL)
  console.log('\n✓ Scheduled start/stop removed. RELEX no longer opens on a timer.\n')
}

function status() {
  for (const label of [START_LABEL, STOP_LABEL]) {
    const installed = existsSync(plistPath(label))
    let loaded = false
    try {
      execFileSync('launchctl', ['print', `gui/${process.getuid()}/${label}`], { stdio: 'pipe' })
      loaded = true
    } catch {
      /* not loaded */
    }
    console.log(`${label}: ${installed ? 'installed' : 'not installed'}${loaded ? ', loaded' : ''}`)
  }
}

const command = process.argv[2] ?? 'install'
if (command === 'install') install()
else if (command === 'uninstall') uninstall()
else if (command === 'status') status()
else fail(`Unknown command: ${command}\nUse install, uninstall, or status.`)
