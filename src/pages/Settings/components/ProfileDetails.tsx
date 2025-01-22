import React, { useState } from 'react'
import useSession from '../../../hooks/useSession'
import { Avatar, Icon, IconProps, Text } from '@ui-kitten/components'
import { StyleSheet, View } from 'react-native'
import { ThemeContext } from '../../../common/context/theme-context'
import { currentUserAtom, isDeveloperMode, isUserPremiumAtom } from '../../../common/atoms/useCurrentUserAtom'
import { useAtom, useAtomValue } from 'jotai'
import { TouchableWithoutFeedback } from '@ui-kitten/components/devsupport'
import { useTranslation } from 'react-i18next'
import { CustomShowToast } from '../../../components/Toast/ToastComponent'
import Logger from '../../../common/utils/logger/logger'
import { storeSingleValueData } from '../../../common/utils/async_storage/AsyncStorage'

export default function ProfileDetails() {
    const { t } = useTranslation()
    const { removeUser } = useSession()

    const themeContext = React.useContext(ThemeContext)

    const [user] = useAtom(currentUserAtom)
    const [pressCount, setPressCount] = useState(0)
    const isPremiumAtom = useAtomValue(isUserPremiumAtom)

    const [isDevMode, setIsDeveloper] = useAtom(isDeveloperMode)

    const isPremium = isPremiumAtom ? t('premium') : t('free')

    const SunIcon = (props: IconProps) => <Icon {...props} style={styles.icon} fill="#8F9BB3" name="sun-outline" />
    const MoonIcon = (props: IconProps) => <Icon {...props} style={styles.icon} fill="#8F9BB3" name="moon-outline" />
    const LogOutIcon = (props: IconProps) => (
        <Icon {...props} style={styles.icon} fill="#8F9BB3" name="log-out-outline" />
    )

    const handleDeveloperMode = async () => {
        const isDev = isDevMode
        if (isDev) {
            CustomShowToast('info', t('youAreAlreadyDeveloper'))
            Logger.info('TopNavigationBar', 'You are already a developer!')
            return
        } else {
            const newPressCount = pressCount + 1
            setPressCount(newPressCount)
            Logger.info('TopNavigationBar', `Press count: ${newPressCount}`)
            if (newPressCount >= 5) {
                await storeSingleValueData('isDeveloperMode', 'true')
                CustomShowToast('info', t('devModeActivated'))
                setIsDeveloper(true)
                Logger.info('TopNavigationBar', 'Developer mode enabled')
            }
        }
    }

    return (
        <View className="flex flex-row items-center justify-between my-3">
            <View className="flex flex-row justify-between items-center gap-2.5">
                <Avatar size="giant" source={{ uri: user?.profile.photoURL }} />
                <TouchableWithoutFeedback onPress={() => handleDeveloperMode()}>
                    <View className="flex flex-col items-start">
                        <Text category="h6">{user?.profile.displayName}</Text>
                        <Text category="c2" appearance="hint">
                            {t('status')}: {isPremium}
                        </Text>
                    </View>
                </TouchableWithoutFeedback>
            </View>
            <View className="flex flex-row items-center justify-between gap-4">
                <TouchableWithoutFeedback className="mx-1" onPress={themeContext.toggleTheme} activeOpacity={0.5}>
                    {themeContext.theme === 'light' ? <SunIcon /> : <MoonIcon />}
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback className="mx-1" onPress={removeUser} activeOpacity={0.5}>
                    <LogOutIcon />
                </TouchableWithoutFeedback>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    icon: {
        height: 28,
        width: 28
    }
})

