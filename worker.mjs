import { App } from 'fx-native'

const app = App.shared()

app.broadcast('worker ready')
