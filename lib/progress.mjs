import prettyBytes from 'prettier-bytes'
import { encode, throttle } from './utils'

export class Progress {
  constructor(app, stages = [1], interval = 100) {
    this.app = app
    this.stages = stages // e.g. [0.5, 0.3, 0.2]
    this.values = Array(stages.length).fill(0)
    this.speed = ''
    this.peers = 0
    this.total = 0 // 0 → 100
    this.onupdate = this._onupdate.bind(this)
    this._send = throttle(this._broadcast.bind(this), interval)
  }

  _broadcast() {
    this.app.broadcast(
      encode({
        type: 'download',
        data: {
          speed: this.speed,
          peers: this.peers,
          progress: this.total
        }
      })
    )
  }

  _compute() {
    const v = this.stages.reduce((sum, per, i) => {
      return sum + per * this.values[i]
    }, 0)
    this.total = Math.round(v * 100)
  }

  _onupdate(u) {
    this.speed = prettyBytes(u.downloadSpeed()) + '/s'
    this.peers = u.drive.core.peers.length
    this.stage(0, u.downloadProgress)
  }

  stage(i, value) {
    if (i < 0 || i >= this.values.length) return
    this.values[i] = Math.min(1, Math.max(0, value))
    this._compute()
    this._send()
  }

  complete() {
    this.values = this.values.map(() => 1)
    this._compute()
    this._send()
  }
}
