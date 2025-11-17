import splash from './splash.svg' with { type: 'text' }
import pear from './pear.svg' with { type: 'text' }
import interRegular from './fonts/Inter-Regular.woff2' with { type: 'binary' }
import interMedium from './fonts/Inter-Medium.woff2' with { type: 'binary' }
import interSemiBold from './fonts/Inter-SemiBold.woff2' with { type: 'binary' }

const AUTO_LAUNCH = true
const SLOW_TIMEOUT = 180000 // 3 minutes

const html = String.raw

export default html`
  <style>
    @font-face {
      font-family: 'Inter';
      font-style: normal;
      font-weight: 400;
      font-display: swap;
      src: url('data:font/woff2;base64,${interRegular.toString('base64')}') format('woff2');
    }
    @font-face {
      font-family: 'Inter';
      font-style: normal;
      font-weight: 500;
      font-display: swap;
      src: url('data:font/woff2;base64,${interMedium.toString('base64')}') format('woff2');
    }
    @font-face {
      font-family: 'Inter';
      font-style: normal;
      font-weight: 600;
      font-display: swap;
      src: url('data:font/woff2;base64,${interSemiBold.toString('base64')}') format('woff2');
    }

    :root {
      --color-white: #ffffff;
      --color-green-400: #33f59a;
      --color-grey-100: #ced3dc;
      --color-grey-500: #30333f;
      --color-grey-800: #151823;
      --color-grey-950: #00020a;
      --color-blue-400: #26d2e8;
      --color-blue-500: #0cb6ce;
      --color-blue-600: #0d91ad;
      --color-blue-950: #0a3342;
      --color-red-300: #ff6c72;
      --color-red-400: #ff1831;
      --color-gradient-background: linear-gradient(
        180deg,
        var(--color-blue-950) 0%,
        var(--color-grey-800) 100%
      );
    }

    html {
      font-size: 16px;
      overflow: hidden;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      background-color: red;
    }

    body {
      margin: 0;
      background: var(--color-gradient-background);
      color: var(--color-white);
      font-family: 'Inter', sans-serif;
    }

    img {
      flex: 1;
      padding: 0 100px;
    }

    h1 {
      font-weight: 600;
      font-size: 1.25rem;
      margin: 0;
    }

    p {
      margin: 0;
      font-weight: 400;
      font-size: 0.875rem;
    }

    span {
      font-weight: 400;
      font-size: 0.75rem;
      color: var(--color-grey-100);
    }

    main {
      display: flex;
      gap: 0.5rem;
      align-items: center;
      flex-direction: column;
      justify-content: center;
      padding: 0 4rem;
      height: 100vh;
    }

    header {
      display: flex;
      align-items: center;
      flex-direction: column;
      text-align: center;
    }

    article {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      gap: 0.5rem;
      width: 100%;
    }

    footer {
      gap: 0.5rem;
      text-align: center;
      display: flex;
      align-items: center;
      flex-direction: column;
    }

    button {
      background-color: var(--color-blue-400);
      color: var(--color-grey-950);
      font-size: 0.938rem;
      font-weight: 600;
      height: 2.75rem;
      padding: 0 2.5rem;
      border-radius: 3.125rem;
      border: none;
      letter-spacing: -0.02em;
      margin-top: 1.125rem;
      margin-bottom: 3.125rem;
      transition: background-color 0.2s ease;
      white-space: nowrap;
    }

    button:hover {
      background-color: var(--color-blue-500);
    }

    button:active {
      background-color: var(--color-blue-600);
    }

    button,
    button:focus {
      outline: none;
    }

    button.secondary {
      color: var(--color-blue-400);
      border: 1px solid var(--color-blue-400);
      background-color: transparent;
    }

    button.secondary:hover {
      color: var(--color-blue-400);
      border-color: var(--color-blue-500);
      background-color: transparent;
    }

    .hidden {
      display: none !important;
    }

    .button-group {
      display: flex;
      gap: 1rem;
      margin-top: 1.125rem;
      margin-bottom: 0;
      width: 100%;
    }

    .button-group button {
      flex: 1;
      min-width: 0;
      margin: 0;
      padding: 0 1rem;
    }

    .message {
      font-size: 0.813rem;
      width: 100%;
      text-align: left;
    }

    .message.error {
      color: var(--color-red-400);
    }

    .status {
      width: 100%;
      height: 129px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      gap: 0.5rem;
    }

    @keyframes indeterminate {
      0% {
        transform: translateX(-100%);
      }
      100% {
        transform: translateX(400%);
      }
    }

    .progress {
      width: 100%;
      height: 6px;
      background-color: var(--color-grey-500);
      border-radius: 4px;
      overflow: hidden;
    }

    .progress > div {
      height: 100%;
      width: 25%;
      border-radius: 4px;
      background-color: var(--color-blue-400);
      animation: indeterminate 1.5s ease-in-out infinite;
    }

    .progress.red > div {
      background-color: var(--color-red-400);
    }

    .progress.green > div {
      background-color: var(--color-green-400);
    }

    .progress.complete > div {
      width: 100%;
      animation: none;
      background-color: var(--color-green-400);
    }
  </style>

  <main>
    <header>${splash}</header>
    <article>
      <h1 id="title">Welcome to Keet</h1>
      <p id="message">Ready to start the installation. This will only take a moment.</p>

      <button id="installBtn">Install Keet</button>

      <div id="status" class="status hidden">
        <div id="progress" class="progress"><div></div></div>
        <p id="warning" class="message hidden"></p>
        <div id="buttonGroup" class="button-group hidden">
          <button id="quitBtn" class="secondary">Quit</button>
          <button id="retryBtn">Retry installation</button>
        </div>
        <button id="launchBtn" class="hidden" style="margin-top: 1.125rem; margin-bottom: 0;">
          Launch Keet
        </button>
      </div>
    </article>
    <footer>
      ${pear}
      <span>Powered by Pear</span>
    </footer>
  </main>
  <script>
    const SLOW_TIMEOUT = ${SLOW_TIMEOUT}
    const AUTO_LAUNCH = ${AUTO_LAUNCH}

    const elements = {
      title: document.getElementById('title'),
      message: document.getElementById('message'),
      status: document.getElementById('status'),
      progress: document.getElementById('progress'),
      warning: document.getElementById('warning'),
      buttonGroup: document.getElementById('buttonGroup'),
      installBtn: document.getElementById('installBtn'),
      quitBtn: document.getElementById('quitBtn'),
      retryBtn: document.getElementById('retryBtn'),
      launchBtn: document.getElementById('launchBtn')
    }

    let timer = null

    function startTimer() {
      timer = setTimeout(() => setState('slow'), SLOW_TIMEOUT)
    }

    function onMessage(element, fn) {
      element.addEventListener('message', fn)
    }

    function onClick(element, fn) {
      element.addEventListener('click', fn)
    }

    function resetElements(e) {
      e.installBtn.classList.add('hidden')
      e.status.classList.remove('hidden')
      e.progress.classList.remove('red', 'green', 'complete')
      e.warning.classList.add('hidden')
      e.warning.classList.remove('error')
      e.buttonGroup.classList.add('hidden')
      e.launchBtn.classList.add('hidden')
    }

    function setState(state) {
      const { title, message, installBtn, progress, warning, buttonGroup, launchBtn } = elements

      resetElements(elements)
      clearTimeout(timer)
      timer = null

      switch (state) {
        case 'installing':
          title.textContent = 'Welcome to Keet'
          message.textContent = 'It will launch once it is done.'
          break
        case 'slow':
          title.textContent = 'Welcome to Keet'
          message.textContent = 'It will launch once it is done.'
          warning.textContent = "It's taking a bit of time, please check your connection."
          warning.classList.remove('hidden')
          break
        case 'error':
          title.textContent = 'Welcome to Keet'
          message.textContent = 'It will launch once it is done.'
          progress.classList.add('red')
          warning.textContent = "Installation didn't complete."
          warning.classList.remove('hidden')
          warning.classList.add('error')
          buttonGroup.classList.remove('hidden')
          break
        case 'complete':
          title.textContent = 'Installation complete!'
          progress.classList.add('complete')
          if (AUTO_LAUNCH) {
            message.textContent = 'Keet app will launch shortly'
            setTimeout(() => bridge.postMessage('launch'), 500)
          } else {
            message.textContent = 'Keet is ready to launch.'
            launchBtn.classList.remove('hidden')
          }
          break
      }
    }

    onMessage(bridge, (event) => {
      const msg = event.data
      if (msg && msg.type === 'state') {
        setState(msg.state)
      }
    })

    onClick(installBtn, () => {
      setState('installing')
      bridge.postMessage('install')
      startTimer()
    })

    onClick(retryBtn, () => {
      setState('installing')
      bridge.postMessage('install')
      startTimer()
    })

    onClick(quitBtn, () => {
      bridge.postMessage('quit')
    })

    onClick(launchBtn, () => {
      bridge.postMessage('launch')
    })
  </script>
`
