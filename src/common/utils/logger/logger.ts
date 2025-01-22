import moment from 'moment'
import RNBlobUtil from 'react-native-blob-util'

class Logger {
    private static logFileName = 'SubscriptionManagerLogs.txt'

    private static async logToFile(formattedMessage: string) {
        // Choose Documents or Downloads depending on where you want to store
        const filePath = `${RNBlobUtil.fs.dirs.DownloadDir}/${this.logFileName}`

        try {
            // Append to the file
            await RNBlobUtil.fs.appendFile(filePath, formattedMessage, 'utf8')
        } catch (error) {
            console.error('Failed to write log:', error)
        }
    }

    private static async log(level: 'INFO' | 'WARN' | 'ERROR', location: string, message: string, ...rest: any[]) {
        const timestamp = moment().format('YYYY-MM-DD HH:mm:ss:SSSS')
        const formattedRest = rest.length
            ? '\nOthers: ' +
              rest.map((item) => (typeof item === 'object' ? JSON.stringify(item, null, 2) : String(item))).join(' ')
            : ''

        const formattedMessage = `[${level}] | ${timestamp} | ${location} | ${message} ${formattedRest}\n`
        console.log(formattedMessage)

        await this.logToFile(formattedMessage)
    }

    static async info(location: string, message: string, ...rest: any[]) {
        await this.log('INFO', location, message, ...rest)
    }

    static async warn(location: string, message: string, ...rest: any[]) {
        await this.log('WARN', location, message, ...rest)
    }

    static async error(location: string, message: string, ...rest: any[]) {
        await this.log('ERROR', location, message, ...rest)
    }
}

export default Logger

