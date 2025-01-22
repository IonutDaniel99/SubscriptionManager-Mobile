import React, { useMemo } from 'react'
import { APP_ROUTES } from '../../common/enums/appRoutes'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import AddSubscriptionScreen from '../../pages/AddSubscription/AddSubscription'
import Developer from '../../pages/Developer/Developer'
import EditSubscriptionScreen from '../../pages/EditSubscription/EditSubscription'
import HomeScreen from '../../pages/Home/HomeScreen'
import SettingsScreen from '../../pages/Settings/SettingsScreen'
import StatisticsScreen from '../../pages/Statistics/StatisticsScreen'
import { currentRouteNameAtom } from '../../common/atoms/useCurrentRouteNameAtom'
import { currentSubscriptionsAtom, hasReachedSubscriptionLimitAtom } from '../../common/atoms/useSubscriptionsAtom'
import subscriptionEmitter from '../../common/emiters/subscriptionsEmitter'
import {
    getOrSetSingleValueData,
    getSubscriptions,
    importSubscriptions,
    storeSingleValueData
} from '../../common/utils/async_storage/AsyncStorage'
import { useAtomValue, useSetAtom } from 'jotai'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { BottomTabsBar } from '../Tabs/BottomTabsBar'
import { TopNavigationBar } from '../Tabs/TopNavigation'
import { IFirebaseUser } from '../../common/interfaces/IFirebaseUser'
import { isUserPremiumAtom } from '../../common/atoms/useCurrentUserAtom'
import {
    getSubscriptionsFromCloud,
    saveSubscriptionsToCloud
} from '../../common/utils/firebase_realtime/firebase_realtime'
import { CustomShowToast } from '../Toast/ToastComponent'

const { Navigator, Screen } = createBottomTabNavigator()

export const AppStack = ({ navigation, user }: { navigation: any; user: IFirebaseUser }) => {
    const { t } = useTranslation()

    const ROOT_ROUTES: string[] = useMemo(() => [APP_ROUTES.HOME, APP_ROUTES.SETTINGS, APP_ROUTES.STATS], [])
    const currentRouteName: string = useAtomValue(currentRouteNameAtom)
    const shouldDisplayBar = ROOT_ROUTES.includes(currentRouteName)

    const setCurrentSubscriptions = useSetAtom(currentSubscriptionsAtom)
    const setHasReachedSubscriptionLimit = useSetAtom(hasReachedSubscriptionLimitAtom)
    const isPremium = useAtomValue(isUserPremiumAtom)

    const fetchSubscriptionsAndCheckLimit = async () => {
        const subscriptions = await getSubscriptions()
        setCurrentSubscriptions(subscriptions)
        const limitReached = !isPremium && Object.keys(subscriptions).length >= 10

        setHasReachedSubscriptionLimit(limitReached)

        if (!limitReached && Object.keys(subscriptions).length > 0) {
            await saveSubscriptionsToCloud(subscriptions)
        }
    }

    const handleFirstInteraction = async () => {
        const firstTime = await getOrSetSingleValueData('firstInteraction', 'true')
        if (firstTime === 'true' && isPremium) {
            await storeSingleValueData('firstInteraction', 'false')
            const subscriptions = await getSubscriptionsFromCloud()
            await importSubscriptions(subscriptions || {})
            if (subscriptions) {
                CustomShowToast('info', t('success'), t('someSubscriptions'))
            }
        } else {
            await fetchSubscriptionsAndCheckLimit()
        }
    }

    useEffect(() => {
        handleFirstInteraction()
    }, [isPremium])

    useEffect(() => {
        const handleSubscriptionUpdate = async () => {
            await fetchSubscriptionsAndCheckLimit()
        }

        subscriptionEmitter.on('update', handleSubscriptionUpdate)

        return () => {
            subscriptionEmitter.off('update', handleSubscriptionUpdate)
        }
    }, [])

    return (
        <>
            <TopNavigationBar
                shouldDisplayBar={shouldDisplayBar}
                navigation={navigation}
                title={`${t('welcome')}, ${user?.profile.displayName}`}
            />
            <Navigator
                tabBar={(props) => <BottomTabsBar {...props} />}
                initialRouteName={APP_ROUTES.HOME}
                screenOptions={{
                    headerShown: false
                }}
            >
                <Screen name={APP_ROUTES.STATS} component={StatisticsScreen} />
                <Screen name={APP_ROUTES.HOME} component={HomeScreen} />
                <Screen name={APP_ROUTES.SETTINGS} component={SettingsScreen} />
                {/* Triggered Pages */}
                <Screen name={APP_ROUTES.DEVELOPER} component={Developer} />
                <Screen
                    name={APP_ROUTES.ADD_SUBSCRIPTION}
                    component={AddSubscriptionScreen}
                    options={{
                        unmountOnBlur: true
                    }}
                />
                <Screen
                    name={APP_ROUTES.EDIT_SUBSCRIPTION}
                    component={EditSubscriptionScreen as never}
                    options={{
                        unmountOnBlur: true
                    }}
                />
            </Navigator>
        </>
    )
}

