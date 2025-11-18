import Thread from 'bare-thread'
import { App, Screen, Window, WebView } from 'fx-native'
import appling from 'appling-native'
import { encode, decode } from './lib/utils'
import { preflight } from './lib/preflight'
import html from './lib/view.html'

const WINDOW_HEIGHT = 548
const WINDOW_WIDTH = 500

const APP_ID = 'keet'

using lock = await preflight(APP_ID)

const PLATFORM_KEY = 'pzcjqmpoo6szkoc4bpkw65ib9ctnrq7b6mneeinbhbheihaq6p6o'
const PLATFORM_DIR = lock.dir

const app = App.shared()

const config = {
  dir: PLATFORM_DIR,
  key: PLATFORM_KEY,
  app: APP_ID,
  link: `pear://${APP_ID}`
}

let window
let view

function onViewMessage(message) {
  const msg = message.toString()
  switch (msg) {
    case 'quit':
      window.close()
      break
    case 'install':
      app.broadcast(encode({ type: 'install' }))
      break
    case 'launch': {
      lock.unlock()
      const app = new appling.App(APP_ID)
      app.open()
      window.close()
      break
    }
  }
}

function onWorkerMessage(message) {
  const msg = decode(message)
  switch (msg.type) {
    case 'ready':
      app.broadcast(encode({ type: 'config', data: config }))
      break
    case 'complete':
      view.postMessage({ type: 'state', state: 'complete' })
      break
    case 'error':
      view.postMessage({ type: 'state', state: 'error' })
      break
  }
}

app
  .on('launch', () => {
    new Thread(import.meta.resolve('./lib/worker'))

    const { width, height } = Screen.main().getBounds()

    window = new Window(
      (width - WINDOW_WIDTH) / 2,
      (height - WINDOW_HEIGHT) / 2,
      WINDOW_WIDTH,
      WINDOW_HEIGHT,
      { frame: false }
    )

    view = new WebView(0, 0, WINDOW_WIDTH, WINDOW_HEIGHT)
    view.on('message', onViewMessage).loadHTML(html)

    window.appendChild(view)
    window.show()
  })
  .on('terminate', () => {
    window.destroy()
  })
  .on('message', onWorkerMessage)
  .run()
