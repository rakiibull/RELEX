// electron-builder with identity: null leaves the bundle unsigned, and macOS
// will not run an unsigned Electron app. An ad-hoc signature (`-`) needs no
// Apple account and is enough for personal use.
//
// codesign --deep is not used: on an Electron bundle it re-signs nested code
// in the wrong order and yields a bundle that verifies but will not launch.
// Nested code must be signed innermost-first, then the outer app.
const { execFileSync } = require('child_process')
const { existsSync, readdirSync, statSync } = require('fs')
const path = require('path')

function sign(target) {
  execFileSync('codesign', ['--force', '--sign', '-', '--timestamp=none', target], {
    stdio: 'inherit',
  })
}

/** Every Mach-O and nested bundle under a framework, deepest first. */
function signFrameworkContents(frameworkPath) {
  const versions = path.join(frameworkPath, 'Versions')
  if (!existsSync(versions)) return

  for (const version of readdirSync(versions)) {
    if (version === 'Current') continue
    const helpers = path.join(versions, version, 'Helpers')
    if (existsSync(helpers)) {
      for (const helper of readdirSync(helpers)) {
        sign(path.join(helpers, helper))
      }
    }
    const libraries = path.join(versions, version, 'Libraries')
    if (existsSync(libraries)) {
      for (const lib of readdirSync(libraries)) {
        if (lib.endsWith('.dylib')) sign(path.join(libraries, lib))
      }
    }
    // The versioned directory itself carries the framework's signature.
    sign(path.join(versions, version))
  }
}

exports.default = async function adhocSign(context) {
  const app = path.join(
    context.appOutDir,
    `${context.packager.appInfo.productFilename}.app`,
  )
  const frameworks = path.join(app, 'Contents', 'Frameworks')

  if (existsSync(frameworks)) {
    for (const entry of readdirSync(frameworks)) {
      const full = path.join(frameworks, entry)
      if (entry.endsWith('.framework')) signFrameworkContents(full)
    }
    // Helper apps, then loose dylibs.
    for (const entry of readdirSync(frameworks)) {
      const full = path.join(frameworks, entry)
      if (entry.endsWith('.app')) sign(full)
      else if (entry.endsWith('.dylib') && statSync(full).isFile()) sign(full)
    }
  }

  // Outer bundle last, so it seals over already-signed contents.
  sign(app)
  console.log(`  • ad-hoc signed  ${app}`)
}
