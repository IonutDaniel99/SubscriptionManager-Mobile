import React, { useEffect } from 'react'
import { Divider, Layout } from '@ui-kitten/components'
import { FlatList, ScrollView, StyleSheet, View } from 'react-native'
import Subscriptions from './components/Subscriptions'
import ProfileDetails from './components/ProfileDetails'
import Notifications from './components/Notifications'
import Language from './components/Language'
import { FAQ } from './components/FAQ'
import DataActions from './components/DataActions'
import AccountActions from './components/AccountActions'
import DebugActions from './components/DebugActions'
import { isDeveloperMode } from '../../common/atoms/useCurrentUserAtom'
import { useAtom } from 'jotai'
import { getSingleValueData } from '../../common/utils/async_storage/AsyncStorage'
import Currency from './components/Currency'
import Contact from './components/Contact'

export default function SettingsScreen() {
    const [isDeveloper, setIsDeveloper] = useAtom(isDeveloperMode)

    useEffect(() => {
        const fetchPressCount = async () => {
            const storedCount = await getSingleValueData('isDeveloperMode')
            setIsDeveloper(storedCount === 'true')
        }

        fetchPressCount()
    }, [])

    return (
        <ScrollView>
            <Layout style={styles.container} level="2">
                <ProfileDetails />
                <Divider />
                <Language />
                <Currency />
                {/* <Notifications />  TODO: WIP Notifications */}
                <FAQ />
                <DataActions />
                <Subscriptions />
                <Contact />
                <AccountActions />
                {isDeveloper && <DebugActions />}
            </Layout>
        </ScrollView>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20
    }
})

