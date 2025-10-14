const { App } = require('fx-native')

const app = App.shared()

app.broadcast('worker ready')
