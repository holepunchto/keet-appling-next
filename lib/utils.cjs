const byteSize = require('tiny-byte-size')
const fs = require('bare-fs')

function format(u) {
  if (u.drive?.core) {
    return {
      speed: byteSize.perSecond(u.downloadSpeed()),
      progress: u.downloadProgress,
      peers: u.drive.core.peers.length,
      bytes: u.downloadedBytes
    }
  }

  return {
    speed: u.downloadSpeed === 0 ? undefined : byteSize.perSecond(u.downloadSpeed),
    progress: u.downloadProgress === 0 ? undefined : u.downloadProgress,
    peers: u.peers === 0 ? undefined : u.peers,
    bytes: u.downloadedBytes
  }
}

function getError(error) {
  const message = error?.message || String(error)
  const stack = error?.stack || null
  return { message, stack }
}

async function nuke(dir) {
  const tmp = dir + '.tmp'
  await fs.promises.rm(tmp, { recursive: true, force: true })
  try {
    await fs.promises.rename(dir, tmp)
    await fs.promises.rm(tmp, { recursive: true, force: true })
  } catch (e) {
    if (e.code !== 'ENOENT') throw e
  }
}

module.exports = { format, getError, nuke }
