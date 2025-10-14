const { Thread } = Bare
const { App, Screen, Window, WebView } = require('fx-native')

const app = App.shared()

let window

app
  .on('launch', () => {
    Thread.create(require.resolve('./worker'))

    const screen = Screen.main()

    const { width, height } = screen.getBounds()

    window = new Window((width - 500) / 2, (height - 500) / 2, 500, 500, { frame: false })

    const webView = new WebView(0, 0, 500, 500)

    webView.on('message', (message) => {
      console.log(message)
    })

    webView.loadHTML(`
      <style>
        :root {
          background-color: #18191f;
        }

        div {
          height: 100vh;
          display: flex;
          align-items: center;
        }

        img {
          flex: 1;
          padding: 0 100px;
        }
      </style>

      <div><img src="https://holepunch.to/images/holepunch-logo-short.svg"></div>

      <script>
        bridge.postMessage('web view ready')
      </script>
    `)

    window.appendChild(webView)
    window.show()
  })
  .on('terminate', () => {
    window.destroy()
  })
  .on('message', (message) => {
    console.log(message.toString())
  })
  .run()
