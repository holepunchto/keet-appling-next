const prettyBytes = require('prettier-bytes')
const fs = require('bare-fs')

function encode(msg) {
  return JSON.stringify(msg)
}

function decode(msg) {
  return JSON.parse(msg.toString())
}

function format(u) {
  if (u.drive?.core) {
    return {
      speed: prettyBytes(u.downloadSpeed()) + '/s',
      progress: u.downloadProgress,
      peers: u.drive.core.peers.length,
      bytes: u.downloadedBytes
    }
  }

  return {
    speed: u.downloadSpeed === 0 ? undefined : prettyBytes(u.downloadSpeed) + '/s',
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

module.exports = { encode, decode, format, getError, nuke }
