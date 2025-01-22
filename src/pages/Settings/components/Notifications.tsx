import { CheckBox, Text } from '@ui-kitten/components'
import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'
import Logger from '../../../common/utils/logger/logger'
import PushNotification from 'react-native-push-notification'
import { getObjectValueData, storeObjectValueData } from '../../../common/utils/async_storage/AsyncStorage'
import { INotificationsInitObject } from '../../../common/interfaces/Notifications'

export default function Notifications() {
    const { t } = useTranslation()

    const [reminder3Days, setReminder3Days] = React.useState(false)
    const [dailyUsage, setDailyUsage] = React.useState(false)
    const [weeklyUsage, setWeeklyUsage] = React.useState(false)
    const [otherNotifications, setOtherNotifications] = React.useState(false)

    useEffect(() => {
        const getNotificationsFromStorage = async () => {
            const notifications = (await getObjectValueData('notifications')) as INotificationsInitObject
            return notifications
        }

        getNotificationsFromStorage().then((notifications) => {
            setReminder3Days(notifications.reminder3Days.isEnabled)
            setDailyUsage(notifications.dailyUsage.isEnabled)
            setWeeklyUsage(notifications.weeklyUsage.isEnabled)
            setOtherNotifications(notifications.otherNotifications.isEnabled)
        })
    }, [])

    const handleNotificationChange = async (key: keyof INotificationsInitObject, value: boolean) => {
        Logger.info(`handleNotificationChange`, `Updating ${key}: ${value}`)

        try {
            // Retrieve the current notifications object
            const notifications = (await getObjectValueData('notifications')) as INotificationsInitObject

            // Update the specific key's value
            const updatedNotifications = {
                ...notifications,
                [key]: {
                    ...notifications[key],
                    isEnabled: value
                }
            }

            // Save the updated notifications object back to storage
            await storeObjectValueData('notifications', updatedNotifications)

            // Update the corresponding state based on the key
            switch (key) {
                case 'reminder3Days':
                    setReminder3Days(value)
                    break
                case 'dailyUsage':
                    setDailyUsage(value)
                    break
                case 'weeklyUsage':
                    setWeeklyUsage(value)
                    break
                case 'otherNotifications':
                    setOtherNotifications(value)
                    break
                // Add other cases as needed for more notifications
                default:
                    break
            }
        } catch (e: any) {
            Logger.error('handleNotificationChange', `Error updating ${key}:`, e)
        }
    }

    const handleReminder3Days = async (value: boolean) => {
        Logger.info('handleReminder3Days', `Reminder 3 days: ${value}`)
        handleNotificationChange('reminder3Days', value)
    }

    const handleDailyUsage = async (value: boolean) => {
        Logger.info('handleDailyUsage', `Daily usage: ${value}`)
        handleNotificationChange('dailyUsage', value)
    }

    const handleWeeklyUsage = (value: boolean) => {
        Logger.info('handleWeeklyUsage', `Weekly usage: ${value}`)
        handleNotificationChange('weeklyUsage', value)
    }

    const handleOtherNotifications = (value: boolean) => {
        Logger.info('handleOtherNotifications', `Other notifications: ${value}`)
        handleNotificationChange('otherNotifications', value)
    }

    return (
        <View style={{ marginTop: 20 }}>
            <Text category="h6" style={{ marginBottom: 12 }}>
                {t('notifications')}
            </Text>
            <View className="flex flex-row flex-wrap items-center justify-between gap-2 mx-2">
                <CheckBox
                    style={{ margin: 2 }}
                    checked={reminder3Days}
                    onChange={(value) => handleReminder3Days(value)}
                >
                    <View>
                        <Text category="label">{t('subscriptionReminderLabel')}</Text>
                        <Text category="c1">{t('subscriptionReminderDesc')}</Text>
                    </View>
                </CheckBox>
                <CheckBox style={{ margin: 2 }} checked={dailyUsage} onChange={(value) => handleDailyUsage(value)}>
                    <View>
                        <Text category="label">{t('dailyUsageLabel')}</Text>
                        <Text category="c1">{t('dailyUsageDesc')}</Text>
                    </View>
                </CheckBox>
                <CheckBox style={{ margin: 2 }} checked={weeklyUsage} onChange={(value) => handleWeeklyUsage(value)}>
                    <View>
                        <Text category="label">{t('weeklyUsageLabel')}</Text>
                        <Text category="c1">{t('weeklyUsageDesc')}</Text>
                    </View>
                </CheckBox>
                <CheckBox
                    style={{ margin: 2 }}
                    checked={otherNotifications}
                    onChange={(value) => handleOtherNotifications(value)}
                >
                    <View>
                        <Text category="label">{t('otherNotificationsLabel')}</Text>
                        <Text category="c1">{t('otherNotificationsDesc')}</Text>
                    </View>
                </CheckBox>
            </View>
        </View>
    )
}
