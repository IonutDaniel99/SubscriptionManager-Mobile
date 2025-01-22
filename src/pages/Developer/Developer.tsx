import React, { useEffect } from 'react'
import { Button, Layout, Text } from '@ui-kitten/components'
import { TopNavigationBar } from '../../components/Tabs/TopNavigation'
import {
    clearAllSubscriptions,
    getSingleValueData,
    logCurrentStorage,
    storeSingleValueData
} from '../../common/utils/async_storage/AsyncStorage'
import { CustomShowToast } from '../../components/Toast/ToastComponent'
import moment from 'moment'
import { useAtom, useSetAtom } from 'jotai'
import { isDeveloperMode, isUserPremiumAtom } from '../../common/atoms/useCurrentUserAtom'
import PushNotification from 'react-native-push-notification'
import { useTranslation } from 'react-i18next'

export default function Developer({ navigation }: { navigation: any }) {
    const { t } = useTranslation()
    const setIsDeveloper = useSetAtom(isDeveloperMode)

    const handleDeleteAllSubs = async () => {
        await clearAllSubscriptions()
        CustomShowToast('info', 'All subscriptions deleted')
    }
    const handleAllShowStorage = async () => {
        await logCurrentStorage()
        CustomShowToast('info', 'Check Console ')
    }
    const setDaysBefore = async () => {
        const now = moment().days(-7)
        await storeSingleValueData('lastUploadTime', now.toISOString())
        console.log(now.toISOString())
    }

    const firstTimeTrue = async () => {
        await storeSingleValueData('firstInteraction', 'true')
    }

    const flipFlopIsDevMore = async () => {
        const storedCount = await getSingleValueData('isDeveloperMode')
        await storeSingleValueData('isDeveloperMode', storedCount === 'true' ? 'false' : 'true')
        setIsDeveloper(storedCount === 'true')
        console.log('was', storedCount, 'now', storedCount === 'true' ? 'false' : 'true')
    }

    const showToast = () => {
        CustomShowToast(
            'success',
            t('success'),
            'This is a success toast with a very very very long text to test the truncate model'
        )
    }
    const raiseNotification = () => {
        console.log('Notification')
        PushNotification.localNotification({
            channelId: 'default-channel-id',
            title: 'Text1',
            message: 'Message1',
            playSound: true,
            soundName: 'default',
            importance: 'high',
            priority: 'high'
        })
    }

    return (
        <>
            <TopNavigationBar navigation={navigation} displayBackButton title={'Developer Settings'} />
            <Layout style={{ flex: 1, padding: 20, gap: 8 }} level="2">
                <Button onPress={() => handleDeleteAllSubs()}>
                    <Text>Delete all subs in storage</Text>
                </Button>
                <Button onPress={() => handleAllShowStorage()}>
                    <Text>Show storage</Text>
                </Button>
                <Button onPress={() => setDaysBefore()}>
                    <Text>-7 Days</Text>
                </Button>
                <Button onPress={() => firstTimeTrue()}>
                    <Text>Set frist time to True</Text>
                </Button>
                <Button onPress={() => flipFlopIsDevMore()}>
                    <Text>flipFlopIsDevMore</Text>
                </Button>
                <Button onPress={() => showToast()}>
                    <Text>Show toast</Text>
                </Button>
                <Button onPress={() => raiseNotification()}>
                    <Text>Run Notification</Text>
                </Button>
            </Layout>
        </>
    )
}

