const appling = require('appling-native')

const PEAR_LEGACY = '6b8374f1c0809ed23cfc371e87896c8d3bb593f2451d4d8de895d628941818dc'

async function preflight(id, dir) {
  const lock = await appling.lock(dir)

  let platform
  try {
    platform = await appling.resolve(dir)
  } catch {
    return lock
  }

  if (platform.key.toString('hex') === PEAR_LEGACY) return lock

  if (platform.ready(`pear://${id}`) === false) return lock

  await lock.unlock()

  platform.launch(id)

  Bare.exit()
}

module.exports = { preflight }
