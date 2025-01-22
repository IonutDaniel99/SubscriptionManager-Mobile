import { AppRegistry, LogBox } from 'react-native'
import App from './src/App'
import { name as appName } from './app.json'
import './i18n.config'

AppRegistry.registerComponent(appName, () => App)

LogBox.ignoreLogs([
    'VirtualizedLists should never be nested' // Ignore this specific warning
])
