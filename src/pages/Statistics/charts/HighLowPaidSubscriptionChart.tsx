import React from 'react'
import { Text } from '@ui-kitten/components'
import { StyleSheet, View } from 'react-native'
import { cloneDeep } from 'lodash'
import uuid from 'react-native-uuid'
import { useTranslation } from 'react-i18next'
import { ISubscriptions } from '../../../common/atoms/useSubscriptionsAtom'
import { SubscriptionData } from '../../../common/interfaces/Subscription'
import UiKittenItem, { UiKittenListItemProps } from '../../../components/List/UiKittenItem'
import { useAtomValue } from 'jotai'
import { servicesCurrencySymbolAtom } from '../../../common/atoms/useServicesLogoAtom'

function HighLowPaidSubscriptionChart({ currentSubscriptions }: { currentSubscriptions: ISubscriptions }) {
    const { t } = useTranslation()
    const getCurrencySymbol = useAtomValue(servicesCurrencySymbolAtom)

    const itemObject: SubscriptionData = {
        name: t('noName'),
        price: '0',
        logo: 'noName',
        category: t('othercategory')
    }

    const getHighestSubscription = (): UiKittenListItemProps => {
        let highestSubscriptionPrice = 0
        let highest: SubscriptionData = cloneDeep(itemObject)

        Object.values(currentSubscriptions).forEach((subscriptionValue) => {
            const subscription = subscriptionValue.subscriptionData
            if (Number(subscription.price) > highestSubscriptionPrice) {
                highestSubscriptionPrice = Number(subscription.price)
                highest = subscription
            }
        })
        return {
            id: `highSubs-${uuid.v4()}`,
            title: highest.name,
            description: `${highest.price} ${getCurrencySymbol}`,
            avatarLeft: highest.logo
        }
    }

    const getLowestSubscription = (): UiKittenListItemProps => {
        let lowestSubscriptionPrice = Infinity
        let lowest: SubscriptionData = cloneDeep(itemObject)

        Object.values(currentSubscriptions).forEach((subscriptionValue) => {
            const subscription = subscriptionValue.subscriptionData
            if (Number(subscription.price) < lowestSubscriptionPrice) {
                lowestSubscriptionPrice = Number(subscription.price)
                lowest = subscription
            }
        })
        return {
            id: `lowSubs-${uuid.v4()}`,
            title: lowest.name,
            description: `${lowest.price} ${getCurrencySymbol}`,
            avatarLeft: lowest.logo
        }
    }

    return (
        <View style={styles.flexContainer}>
            <View style={{ marginBottom: 12, flex: 1 }}>
                <Text category="h6" style={{ marginBottom: 12 }}>
                    {t('highestPaid')}
                </Text>
                <UiKittenItem disabled itemStyle={styles.paidCard} {...getHighestSubscription()} />
            </View>
            <View style={{ marginBottom: 12, flex: 1 }}>
                <Text category="h6" style={{ marginBottom: 12 }}>
                    {t('lowestPaid')}
                </Text>
                <UiKittenItem disabled itemStyle={styles.paidCard} {...getLowestSubscription()} />
            </View>
        </View>
    )
}

export default HighLowPaidSubscriptionChart

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20
    },
    flexContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 20
    },
    paidCard: {
        borderRadius: 10
    },
    gridContainer: {
        marginBottom: 12,
        gap: 8,
        alignItems: 'flex-start',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        width: '100%'
    },
    paidCard2: {
        borderRadius: 10,
        width: '48%'
    }
})

