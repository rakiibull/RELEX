#!/usr/bin/env node
// One command to cut a release: bump the version, rebuild, refresh the
// download page, tag, push, and upload the .dmg to GitHub Releases.
//
//   npm run release           # 0.1.0 -> 0.1.1
//   npm run release -- minor  # 0.1.0 -> 0.2.0
//   npm run release -- 1.4.0  # explicit version

const { execFileSync, execSync } = require('child_process')
const { readFileSync, writeFileSync, statSync } = require('fs')
const path = require('path')

const ROOT = path.join(__dirname, '..')
const run = (cmd, args, opts = {}) =>
  execFileSync(cmd, args, { cwd: ROOT, stdio: 'inherit', ...opts })
const capture = (cmd) => execSync(cmd, { cwd: ROOT, encoding: 'utf8' }).trim()

function fail(message) {
  console.error(`\n✗ ${message}\n`)
  process.exit(1)
}

function nextVersion(current, arg) {
  if (arg && /^\d+\.\d+\.\d+$/.test(arg)) return arg
  const [major, minor, patch] = current.split('.').map(Number)
  if (arg === 'major') return `${major + 1}.0.0`
  if (arg === 'minor') return `${major}.${minor + 1}.0`
  if (!arg || arg === 'patch') return `${major}.${minor}.${patch + 1}`
  fail(`Unrecognised version argument: ${arg}\nUse patch, minor, major, or an explicit x.y.z.`)
}

// --- checks that are cheaper to fail now than halfway through -------------

if (capture('git status --porcelain')) {
  fail('You have uncommitted changes. Commit or stash them first.')
}

try {
  execFileSync('gh', ['auth', 'status'], { stdio: 'pipe' })
} catch {
  fail('Not logged in to GitHub. Run: gh auth login')
}

const pkgPath = path.join(ROOT, 'package.json')
const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'))
const version = nextVersion(pkg.version, process.argv[2])

if (capture('git tag').split('\n').includes(`v${version}`)) {
  fail(`Tag v${version} already exists.`)
}

console.log(`\n▸ Releasing ${pkg.version} → ${version}\n`)

// --- version bump ---------------------------------------------------------

pkg.version = version
writeFileSync(pkgPath, `${JSON.stringify(pkg, null, 2)}\n`)

// --- build ----------------------------------------------------------------

console.log('▸ Building…\n')
run('npm', ['run', 'dist:mac'])

const dmg = path.join(ROOT, 'release', `RELEX-${version}.dmg`)
let sizeMb
try {
  sizeMb = Math.round(statSync(dmg).size / 1_000_000)
} catch {
  fail(`Build finished but ${path.basename(dmg)} is missing.`)
}

// --- keep the download page pointing at this release ----------------------

const sitePath = path.join(ROOT, 'site', 'index.html')
const site = readFileSync(sitePath, 'utf8')
  .replace(/RELEX-\d+\.\d+\.\d+\.dmg/g, `RELEX-${version}.dmg`)
  .replace(/\d+ MB &middot; macOS/, `${sizeMb} MB &middot; macOS`)
writeFileSync(sitePath, site)

// --- commit, tag, push ----------------------------------------------------

console.log('\n▸ Committing and tagging…\n')
run('git', ['add', 'package.json', 'package-lock.json', 'site/index.html'])
run('git', ['commit', '-m', `Release v${version}`])
run('git', ['tag', `v${version}`])
run('git', ['push'])
run('git', ['push', '--tags'])

// --- publish --------------------------------------------------------------

console.log('\n▸ Uploading to GitHub Releases…\n')
run('gh', [
  'release', 'create', `v${version}`, dmg,
  '--title', `RELEX ${version}`,
  '--notes', `macOS 12 Monterey or later, Intel.\n\nDownload RELEX-${version}.dmg below.`,
])

console.log(`\n✓ Released v${version} (${sizeMb} MB)`)
console.log('  The website redeploys itself from the push.\n')
