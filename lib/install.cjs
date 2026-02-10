const Thread = require('bare-thread')
const path = require('bare-path')
const env = require('bare-env')
const { ALIASES } = require('pear-aliases')
const hypercoreid = require('hypercore-id-encoding')
const appling = require('appling-native')
const { App, Screen, Window, WebView } = require('fx-native')
const { preflight } = require('./preflight')
const view = require('./view.html.cjs')

const WINDOW_HEIGHT = 620
const WINDOW_WIDTH = 500
const APP_NAME = 'Keet'

async function install(id, opts = {}) {
  const { platform = hypercoreid.encode(ALIASES.pear) } = opts
  const html = view({ name: APP_NAME })

  let dir

  if (env.SNAP_USER_COMMON) {
    dir = path.join(env.SNAP_USER_COMMON, 'pear')
  }

  using lock = await preflight(id, dir)

  const config = {
    dir: lock.dir,
    platform,
    link: `pear://${id}`
  }

  const app = App.shared()

  let window
  let webview

  function onViewMessage(message) {
    const msg = message.toString()
    switch (msg) {
      case 'quit':
        window.close()
        break
      case 'install':
        app.broadcast(JSON.stringify({ type: 'install' }))
        break
      case 'launch': {
        lock.unlock()
        const app = new appling.App(id)
        window.close()
        app.open()
        break
      }
      case 'reset':
        app.broadcast(JSON.stringify({ type: 'reset' }))
        webview.postMessage({ type: 'state', state: 'installing' })
        break
    }
  }

  function onWorkerMessage(message) {
    const msg = JSON.parse(message)
    switch (msg.type) {
      case 'ready':
        app.broadcast(JSON.stringify({ type: 'config', data: config }))
        break
      case 'download':
        webview.postMessage({ type: 'progress', data: msg.data })
        break
      case 'complete':
        webview.postMessage({ type: 'state', state: 'complete' })
        break
      case 'nuclear':
        webview.postMessage({ type: 'state', state: 'nuclear' })
        break
      case 'error':
        webview.postMessage({ type: 'state', state: 'error', error: msg.error })
        break
    }
  }

  app
    .on('launch', () => {
      new Thread(require.resolve('./worker'))
      const { width, height } = Screen.main().getBounds()
      window = new Window(
        (width - WINDOW_WIDTH) / 2,
        (height - WINDOW_HEIGHT) / 2,
        WINDOW_WIDTH,
        WINDOW_HEIGHT,
        { frame: false }
      )

      webview = new WebView(0, 0, WINDOW_WIDTH, WINDOW_HEIGHT)
      webview.on('message', onViewMessage).loadHTML(html)

      window.appendChild(webview)
      window.show()
    })
    .on('terminate', () => {
      window.destroy()
    })
    .on('message', onWorkerMessage)
    .run()
}

module.exports = { install }
