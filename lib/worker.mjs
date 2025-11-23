import { App } from 'fx-native'
import bootstrap from 'pear-updater-bootstrap'
import appling from 'appling-native'
import { encode, decode } from './utils'
import { Progress } from './progress'

const app = App.shared()

let config
let platform

function setup(data) {
  config = data
}

async function install() {
  const progress = new Progress(app, [0.8, 0.2])
  const platformFound = false
  try {
    try {
      platform = await appling.resolve(config.dir)
      platformFound = true
    } catch (e) {
      await bootstrap(config.platform, config.dir, { lock: false, onupdater: progress.onupdate })
      platform = await appling.resolve(config.dir)
    }
    if (platformFound) {
      progress.stage(0, 1)
    }
    await platform.preflight(config.link)
    progress.complete()
    app.broadcast(encode({ type: 'complete' }))
  } catch (e) {
    console.error('Bootstrap error: %o', e)
    app.broadcast(encode({ type: 'error', error: e.message }))
  }
}

app.on('message', async (message) => {
  const msg = decode(message)
  switch (msg.type) {
    case 'config':
      setup(msg.data)
      break
    case 'install':
      await install()
      break
  }
})

app.broadcast(encode({ type: 'ready' }))
