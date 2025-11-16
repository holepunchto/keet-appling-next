import { App } from 'fx-native'
import bootstrap from 'pear-updater-bootstrap'
import appling from 'appling-native'
import { encode, decode } from './utils'

const app = App.shared()

let config
let platform

function setConfig(data) {
  config = data
}

async function runBootstrap() {
  try {
    try {
      platform = await appling.resolve(config.dir)
    } catch (e) {
      await bootstrap(config.key, config.dir, { lock: false })
      platform = await appling.resolve(config.dir)
    }
    await platform.preflight(config.link)
    app.broadcast(encode({ type: 'complete' }))
  } catch (e) {
    console.error('Bootstrap error: %o', e)
    app.broadcast(encode({ type: 'error', error: e.message }))
  }
}

function launchApp() {
  try {
    platform.launch(config.app)
  } catch (e) {
    console.error('Launch error: %o', e)
    app.broadcast(encode({ type: 'error', error: e.message }))
  }
}

app.on('message', async (message) => {
  const msg = decode(message)
  switch (msg.type) {
    case 'config':
      setConfig(msg.data)
      break
    case 'bootstrap':
      await runBootstrap()
      break
    case 'launch':
      launchApp()
      break
  }
})

app.broadcast(encode({ type: 'ready' }))
