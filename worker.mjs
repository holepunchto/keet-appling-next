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
    const link = appling.parse(config.link)
    await platform.preflight(link)
    app.broadcast(encode({ type: 'complete' }))
  } catch (e) {
    console.error('ERROR', e.message)
    app.broadcast(encode({ type: 'error', error: e.message }))
  }
}

function launchApp() {
  try {
    const keetApp = new appling.App(config.link)
    platform.launch(keetApp, config.link, 'Keet')
  } catch (e) {
    console.error('Launch error:', e.message)
    app.broadcast(encode({ type: 'error', error: e.message }))
  }
}

app.on('message', async (message) => {
  const msg = decode(message)
  console.log('Worker received:', msg)

  switch (msg.type) {
    case 'config':
      setConfig(msg.data)
      break
    case 'bootstrap':
      await runBootstrap()
      break
    case 'launch':
      await launchApp()
      break
  }
})

app.broadcast(encode({ type: 'ready' }))
