import React, { useCallback } from 'react'
import { StyleSheet, View } from 'react-native'
import { useOrientation } from '../../../hooks/useOrientation'
import { currentThemeAtom } from '../../../common/atoms/useCurrentTheme'
import { useAtomValue } from 'jotai'
import UiKittenItem, { UiKittenListItemProps } from '../../../components/List/UiKittenItem'
import { Text } from '@ui-kitten/components'
import { useTranslation } from 'react-i18next'
import { CategorySubscriptionOptions } from '../../../common/utils/categoriesList'
import { ISubscriptions } from '../../../common/atoms/useSubscriptionsAtom'
import uuid from 'react-native-uuid'
import { servicesCurrencySymbolAtom } from '../../../common/atoms/useServicesLogoAtom'

function SpentByCategoryGrid({ currentSubscriptions }: { currentSubscriptions: ISubscriptions }) {
    const { t } = useTranslation()
    const currentTheme = useAtomValue<'light' | 'dark'>(currentThemeAtom)
    const getCurrencySymbol = useAtomValue(servicesCurrencySymbolAtom)

    const getTotalSpentByCategory = useCallback((): UiKittenListItemProps[] => {
        const categoryTotals = CategorySubscriptionOptions.map((category) => {
            // Filter subscriptions that match the current category
            const subscriptionsInCategory = Object.values(currentSubscriptions).filter(
                (subscription) => subscription.subscriptionData.category === category.value
            )

            // Calculate the total price for this category
            const totalPrice = subscriptionsInCategory.reduce((sum, subscription) => {
                return sum + parseFloat(subscription.subscriptionData.price.toString() || '0')
            }, 0)

            return {
                category: category.value,
                icon: category.accessoryLeft,
                totalPrice: totalPrice > 0 ? totalPrice.toFixed(2) : 0
            }
        })

        return Object.values(categoryTotals)
            .sort((a, b) => Number(b.totalPrice) - Number(a.totalPrice))
            .map((subscription) => ({
                id: `spentCategory-${uuid.v4()}`,
                title: t(subscription.category),
                description: `${subscription.totalPrice} ${getCurrencySymbol}`,
                iconLeft: subscription.icon
            }))
    }, [currentSubscriptions, currentTheme, getCurrencySymbol])

    const chartItems = getTotalSpentByCategory()

    return (
        <View style={{ marginVertical: 12 }}>
            <Text category="h6" style={{ marginBottom: 12 }}>
                {t('totalSpentByCategory')}
            </Text>
            <View style={styles.gridContainer}>
                {chartItems.map((subscription) => {
                    return <UiKittenItem key={subscription.id} disabled itemStyle={styles.paidCard} {...subscription} />
                })}
            </View>
        </View>
    )
}

export default SpentByCategoryGrid

const styles = StyleSheet.create({
    gridContainer: {
        marginBottom: 12,
        gap: 8,
        alignItems: 'flex-start',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        width: '100%'
    },
    paidCard: {
        borderRadius: 10,
        width: '48%'
    }
})

