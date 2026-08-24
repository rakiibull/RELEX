# RELEX

A macOS menu-bar reminder to stand up and move. Every 30 minutes it shows a
popup with a stretch to do, so hours at the keyboard do not pass unnoticed.

- Lives in the menu bar with a live countdown to the next break
- Popup appears over other apps without stealing keyboard focus
- 13 stretches — neck, shoulders, back, wrists, eyes, legs — with animated
  figures and instructions in English and Bengali
- Chime on break start and finish
- Work hours, snooze cap, launch at login

## Requirements

- macOS 12 (Monterey) or later
- Node 22+ for development

## Development

```bash
npm install
npm run dev
```

Waiting out a 30-minute interval to check a change is impractical, so both
durations can be overridden for a dev run:

```bash
RELEX_INTERVAL_SEC=15 RELEX_BREAK_SEC=10 npm run dev
```

Other scripts: `npm run typecheck`, `npm run build`.

## Building the app

```bash
npm run pack:mac   # release/mac/RELEX.app
npm run dist:mac   # also a .dmg
```

Install by copying `release/mac/RELEX.app` to `/Applications`. A build made
locally carries no quarantine attribute, so it opens normally. If macOS ever
refuses to open it, right-click the app and choose **Open**, then **Open**
again; if it claims the app is damaged, clear the attribute:

```bash
xattr -dr com.apple.quarantine /Applications/RELEX.app
```

The build is ad-hoc signed rather than signed with an Apple Developer
certificate. That is enough for personal use and needs no Apple account.

## Notes

- **Electron is pinned to 43.4.1 without a caret.** Electron 44 requires
  macOS 13, so a caret range would silently upgrade into a build that will not
  launch on Monterey.
- **`ELECTRON_RUN_AS_NODE` must not be set.** VS Code's integrated terminal
  sets it, and with it Electron boots as plain Node: `require('electron')`
  returns a path string instead of the API. `npm run dev` and the packaging
  scripts unset it. Launching the installed app from Finder is unaffected.
- Runtime problems are written to
  `~/Library/Application Support/RELEX/relex.log`. Set `RELEX_DEBUG=1` to
  mirror them to stderr.
