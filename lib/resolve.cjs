const appling = require('appling-native')

const PEAR_LEGACY = '6b8374f1c0809ed23cfc371e87896c8d3bb593f2451d4d8de895d628941818dc'

async function resolve(dir) {
  const platform = await appling.resolve(dir)

  if (platform.key.toString('hex') === PEAR_LEGACY) {
    throw new Error('Platform is on legacy key')
  }

  return platform
}

module.exports = { resolve }
