import * as eva from '@eva-design/eva'
import { ConfigureParams, GoogleSignin } from '@react-native-google-signin/google-signin'
import { ApplicationProvider, IconRegistry } from '@ui-kitten/components'
import { EvaIconsPack } from '@ui-kitten/eva-icons'
import { useAtom, useSetAtom } from 'jotai'
import moment from 'moment'
import 'moment/locale/de'
import 'moment/locale/fr'
import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { PermissionsAndroid, Platform, StatusBar } from 'react-native'
import 'react-native-devsettings'
import 'react-native-devsettings/withAsyncStorage'
import mobileAds from 'react-native-google-mobile-ads'
import PushNotification from 'react-native-push-notification'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import Toast from 'react-native-toast-message'
import { default as customTheme } from '../theme.json'
import { currentThemeAtom } from './common/atoms/useCurrentTheme'
import { ThemeContext } from './common/context/theme-context'
import {
    getObjectValueData,
    getOrSetObjectData,
    getOrSetSingleValueData,
    storeSingleValueData
} from './common/utils/async_storage/AsyncStorage'
import Logger from './common/utils/logger/logger'
import ErrorBoundary from './components/ErrorBoundry'
import RootNavigation from './components/Navigation/RootNavigator'
import { NOTIFICATIONS_INIT_OBJECT } from './pages/Settings/components/utils'

import { endConnection, flushFailedPurchasesCachedAsPendingAndroid, initConnection } from 'react-native-iap'
import { servicesCurrencySymbolAtom } from './common/atoms/useServicesLogoAtom'

// * Theme
type Theme = 'light' | 'dark'

// * Google
const GoogleSingInConfigs: ConfigureParams = {
    webClientId: '614302998318-ht6scdafq9aaaenolj06bqiul1bbheta.apps.googleusercontent.com',
    offlineAccess: false
}

GoogleSignin.configure(GoogleSingInConfigs)

// * Notifications
PushNotification.createChannel(
    {
        channelId: 'default-channel-id', // Channel ID
        channelName: 'Reminders', // Channel name
        importance: 4, // Importance level for notifications
        vibrate: true // Vibration setting
    },
    (created) => console.log(`createChannel returned '${created}'`) // Logs the channel creation status
)

PushNotification.configure({
    // Called when a remote or local notification is opened or received
    onNotification: function (notification) {
        Logger.info('onNotification', 'NOTIFICATION:', notification)
    },
    requestPermissions: true
})

// * Permissions

const App = (): React.ReactElement => {
    const [currentTheme, setCurrentTheme] = useAtom<Theme>(currentThemeAtom)
    const setCurrency = useSetAtom(servicesCurrencySymbolAtom)
    const { i18n } = useTranslation()

    const toggleTheme = async () => {
        const nextTheme = currentTheme === 'light' ? 'dark' : 'light'
        await storeSingleValueData('theme', nextTheme)
        Logger.info('toggleTheme', `Theme changed to: ${nextTheme}`)
        setCurrentTheme(nextTheme)
    }

    useEffect(() => {
        const initialize = async () => {
            // Ads
            mobileAds()
                .initialize()
                .then((adapterStatuses) => {
                    Logger.info('mobileAds', `Mobile Ads Adapter Status`, adapterStatuses)
                })
            // Theme
            const theme: Theme = (await getOrSetSingleValueData('theme', 'dark')) as Theme
            setCurrentTheme(theme)

            // Currency
            const getCurrencySymbol = await getObjectValueData('currency')
            setCurrency(getCurrencySymbol.symbol || '€')

            // Language
            const language = (await getOrSetSingleValueData('language', 'en')) as string
            i18n.changeLanguage(language)
            moment.locale(language)

            //Notifications
            await getOrSetObjectData('notifications', NOTIFICATIONS_INIT_OBJECT)
        }
        initialize()
    }, [])

    useEffect(() => {
        const init = async () => {
            try {
                await initConnection()
                if (Platform.OS === 'android') {
                    flushFailedPurchasesCachedAsPendingAndroid()
                }
            } catch (error) {
                Logger.error('init', 'Error occurred during initilization', error)
            }
        }
        init()
        return () => {
            endConnection()
        }
    }, [])

    return (
        <>
            <IconRegistry icons={EvaIconsPack} />
            <ErrorBoundary>
                <ThemeContext.Provider value={{ theme: currentTheme, toggleTheme }}>
                    <ApplicationProvider
                        {...eva}
                        theme={{ ...eva[currentTheme], ...customTheme }}
                        mapping={eva.mapping}
                    >
                        <SafeAreaProvider>
                            <StatusBar
                                barStyle={currentTheme !== 'light' ? 'light-content' : 'dark-content'}
                                translucent
                                backgroundColor="transparent"
                            />

                            <RootNavigation />
                        </SafeAreaProvider>
                    </ApplicationProvider>
                </ThemeContext.Provider>
            </ErrorBoundary>
            <Toast />
        </>
    )
}

export default App
