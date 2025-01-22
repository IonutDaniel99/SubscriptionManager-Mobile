import React, { useEffect, useState } from 'react'
import { Divider, Layout, Button, Text } from '@ui-kitten/components'
import { ScrollView, StyleSheet, View } from 'react-native'
import { TopNavigationBar } from '../../components/Tabs/TopNavigation'
import { NavigationProp, RouteProp } from '@react-navigation/native'
import ServiceLogoAndName from './components/ServiceLogoAndName'
import { cloneDeep, set } from 'lodash'
import { editSubscription, getSubscriptionById } from '../../common/utils/async_storage/AsyncStorage'
import { APP_ROUTES } from '../../common/enums/appRoutes'
import subscriptionEmitter from '../../common/emiters/subscriptionsEmitter'
import { CustomShowToast } from '../../components/Toast/ToastComponent'
import { Subscription, SubscriptionCategory, SubscriptionData } from '../../common/interfaces/Subscription'
import configureState from '../../components/ServiceFrequencyRule/components/Repeat/utils/configureInitialState'
import {
    ConfigData,
    ConfigureStateReturn,
    HandleRRULEObject
} from '../../components/ServiceFrequencyRule/types/IRepeatProps'
import ServiceFrequencyRule from '../../components/ServiceFrequencyRule/ServiceFrequencyRule'
import computeRRuleToString from '../../components/ServiceFrequencyRule/utils/computeRRule/toString/computeRRule'
import LoadingIndicator from '../../components/LoadingIndicator'
import computeRRule from '../../components/ServiceFrequencyRule/utils/computeRRule/fromString/computeRRule'
import { useTranslation } from 'react-i18next'
import Logger from '../../common/utils/logger/logger'

interface IAddSubscriptionScreen {
    navigation: NavigationProp<any>
    route: RouteProp<{ params: { subscriptionID: string } }>
}

const NameIconStaticData: SubscriptionData = { name: 'Empty', price: 0, logo: 'noImage', category: 'othercategory' }

export default function EditSubscriptionScreen({ route, navigation }: IAddSubscriptionScreen) {
    const { t } = useTranslation()
    const isEditMode = route.name.toString() === APP_ROUTES.EDIT_SUBSCRIPTION
    const [isLoading, setIsLoading] = useState(true)
    const { subscriptionID } = route.params

    const [currentSubscriptions, setCurrentSubscriptions] = useState<Subscription | null>(null)
    const [nameLogo, setNameLogo] = useState<SubscriptionData>(NameIconStaticData)
    const [initialState, setInitialState] = useState<ConfigureStateReturn>(
        configureState({ hideStart: false, hideEnd: false }, undefined)
    )
    const [rRule, setRRule] = useState<ConfigData>(initialState.data)

    useEffect(() => {
        setIsLoading(true)
        const fetchSubscription = async () => {
            const subscription: Subscription | null = await getSubscriptionById(subscriptionID).then((data) => {
                return data
            })
            setCurrentSubscriptions(subscription)
            setNameLogo(subscription?.subscriptionData || NameIconStaticData)
            const rrule = computeRRule(initialState.data, subscription?.rrule)
            setRRule(rrule)
            setIsLoading(false)
        }
        fetchSubscription()
    }, [subscriptionID])

    const handleNameLogo = (name: string, val: string) => {
        Logger.info('EditSubscription - handleNameLogo', `index: ${name}, val: ${val}`)
        setNameLogo((prev) => {
            const newData = cloneDeep(prev)
            set(newData, name, val)
            return {
                ...newData
            }
        })
    }

    const handleRRule = ({ target }: HandleRRULEObject) => {
        Logger.info('EditSubscription - handleRRule', `Target: ${target.name}, Value: ${target.value}`)
        const newData = cloneDeep(rRule)
        set(newData, target.name, target.value)
        setInitialState((prev: any) => ({
            ...prev,
            data: newData
        }))
        setRRule(newData)
    }

    const handleButton = async () => {
        if (nameLogo.name === 'Empty') {
            CustomShowToast('error', t('pleaseProvideNameForSubscription'))
            Logger.error('EditSubscription - handleButton', 'Name is empty')
            return
        }
        const jsonData = {
            rrule: computeRRuleToString(rRule),
            subscriptionID: subscriptionID,
            subscriptionData: {
                name: nameLogo.name,
                price: nameLogo.price,
                logo: nameLogo.logo,
                category: nameLogo.category as SubscriptionCategory
            }
        }
        Logger.info('EditSubscription - handleButton', 'Subscription data:', jsonData)
        await editSubscription(subscriptionID, jsonData).then(() => {
            subscriptionEmitter.emit('update') // Emit the event to update subscriptions
            navigation.navigate(APP_ROUTES.HOME as never) // Navigate back to Home
        })
    }

    if (!currentSubscriptions && isLoading && rRule && nameLogo) return <LoadingIndicator />
    return (
        <>
            <TopNavigationBar navigation={navigation} displayBackButton title={'editSubscription'} />
            <Layout level="2" style={{ height: '100%' }}>
                <ScrollView>
                    <Layout style={styles.container} level="2">
                        <ServiceLogoAndName data={nameLogo} handleChange={handleNameLogo} />
                        <Divider />
                        <ServiceFrequencyRule data={rRule} isEditMode={isEditMode} handleChange={handleRRule} />
                        <View className="flex-row justify-end py-2">
                            <Button onPress={handleButton}>
                                <Text>{t('saveSubscription')}</Text>
                            </Button>
                        </View>
                    </Layout>
                </ScrollView>
            </Layout>
        </>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20
    }
})
