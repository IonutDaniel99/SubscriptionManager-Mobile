import React, { useState } from 'react'
import { Divider, Layout, Button, Text } from '@ui-kitten/components'
import { ScrollView, StyleSheet, View } from 'react-native'
import { TopNavigationBar } from '../../components/Tabs/TopNavigation'
import { NavigationProp } from '@react-navigation/native'
import ServiceLogoAndName from './components/ServiceLogoAndName'
import { cloneDeep, set } from 'lodash'
import uuid from 'react-native-uuid'
import { CustomShowToast } from '../../components/Toast/ToastComponent'
import configureState from '../../components/ServiceFrequencyRule/components/Repeat/utils/configureInitialState'
import { HandleRRULEObject } from '../../components/ServiceFrequencyRule/types/IRepeatProps'
import computeRRuleToString from '../../components/ServiceFrequencyRule/utils/computeRRule/toString/computeRRule'
import ServiceFrequencyRule from '../../components/ServiceFrequencyRule/ServiceFrequencyRule'
import { useTranslation } from 'react-i18next'
import { Subscription, SubscriptionCategory } from '../../common/interfaces/Subscription'
import { storeSubscription } from '../../common/utils/async_storage/AsyncStorage'
import subscriptionEmitter from '../../common/emiters/subscriptionsEmitter'
import { APP_ROUTES } from '../../common/enums/appRoutes'
import Logger from '../../common/utils/logger/logger'

interface IAddSubscriptionScreen {
    navigation: NavigationProp<any>
}

export default function AddSubscriptionScreen({ navigation }: IAddSubscriptionScreen) {
    const { t } = useTranslation()
    const nameIconData = { name: 'Empty', price: 0, logo: 'noImage', category: 'othercategory' }
    const [nameLogo, setNameLogo] = useState(nameIconData)

    const [initialState, setInitialState] = useState(configureState({ hideStart: false, hideEnd: false }, undefined))
    const [rRule, setRRule] = useState('DTSTART:20190301T230000Z\nRRULE:FREQ=YEARLY;BYMONTH=1;BYMONTHDAY=1;COUNT=50')
    const { data } = initialState

    const handleNameLogo = (name: string, val: string) => {
        Logger.info('AddSubscription - handleNameLogo', `name: ${name}, val: ${val}`)

        setNameLogo((prev) => {
            const newData = cloneDeep(prev)
            set(newData, name, val)
            return {
                ...newData
            }
        })
    }

    const handleRRule = ({ target }: HandleRRULEObject) => {
        Logger.info('AddSubscription - handleRRule', `Target: ${target.name}, Value: ${target.value}`)
        const newData = cloneDeep(data)
        set(newData, target.name, target.value)
        const rrule = computeRRuleToString(newData)
        setInitialState((prev) => ({
            ...prev,
            data: newData
        }))
        setRRule(rrule)
    }

    const handleButton = async () => {
        if (nameLogo.name === 'Empty') {
            CustomShowToast('error', t('pleaseProvideNameForSubscription'))
            Logger.error('AddSubscription - handleButton', 'Name is empty')
            return
        }
        const randomUUID = `subs-${uuid.v4()}`
        const jsonData: Subscription = {
            rrule: rRule,
            subscriptionID: randomUUID,
            subscriptionData: {
                name: nameLogo.name,
                price: nameLogo.price,
                logo: nameLogo.logo,
                category: nameLogo.category as SubscriptionCategory
            }
        }
        Logger.info('AddSubscription - handleButton', 'Subscription data:', jsonData)
        await storeSubscription(randomUUID, jsonData).then(() => {
            subscriptionEmitter.emit('update') // Emit the event to update subscriptions
            navigation.navigate(APP_ROUTES.HOME) // Navigate back to Home
        })
    }

    return (
        <>
            <TopNavigationBar navigation={navigation} displayBackButton title={'addNewSubscription'} />
            <Layout level="2" style={{ height: '100%' }}>
                <ScrollView>
                    <View style={styles.container}>
                        <ServiceLogoAndName handleChange={handleNameLogo} />
                        <Divider />
                        <ServiceFrequencyRule isEditMode={false} data={data} handleChange={handleRRule} />
                        <View className="flex-row justify-end py-2">
                            <Button onPress={handleButton}>
                                <Text>{t('saveSubscription')}</Text>
                            </Button>
                        </View>
                    </View>
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
