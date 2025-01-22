import React, { useCallback, useMemo } from 'react'
import { Dimensions } from 'react-native'
import { PieChart } from 'react-native-chart-kit'
import { useOrientation } from '../../../hooks/useOrientation'
import { AbstractChartConfig } from 'react-native-chart-kit/dist/AbstractChart'
import { currentThemeAtom } from '../../../common/atoms/useCurrentTheme'
import { useAtomValue } from 'jotai'
import { PieChartColorsList } from './utils'
import { useTranslation } from 'react-i18next'
import { CategorySubscriptionOptions } from '../../../common/utils/categoriesList'
import { ISubscriptions } from '../../../common/atoms/useSubscriptionsAtom'

interface ChartProps {
    name: string
    price: number
    legendFontSize: number
    legendFontColor: string
    color: string
}
function SpentByCategoryChart({ currentSubscriptions }: { currentSubscriptions: ISubscriptions }) {
    if (Object.values(currentSubscriptions).length === 0) return null

    const { t } = useTranslation()
    const currentTheme = useAtomValue<'light' | 'dark'>(currentThemeAtom)
    const isOriented = useOrientation()

    const chartConfig = useMemo<AbstractChartConfig>(
        () => ({
            backgroundColor: currentTheme === 'light' ? '#B73010' : '#022173', //B73010 - orange / 022173 - blue
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`
        }),
        [isOriented, currentTheme]
    )

    const widthDimension = useMemo(() => Dimensions.get('window').width, [isOriented])

    const getTotalSpentByCategory = useCallback((): ChartProps[] => {
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

        return categoryTotals
            .sort((a, b) => Number(b.totalPrice) - Number(a.totalPrice))
            .filter((item) => Number(item.totalPrice) > 0)
            .map((item, index) => {
                return {
                    name: t(item.category),
                    price: Number(item.totalPrice),
                    legendFontSize: 12,
                    legendFontColor: currentTheme !== 'light' ? '#fff' : '#000',
                    color: PieChartColorsList[index % PieChartColorsList.length]
                }
            })
    }, [currentSubscriptions, currentTheme])

    const chartItems = getTotalSpentByCategory()

    return (
        <PieChart
            data={chartItems}
            width={widthDimension - 40}
            height={220}
            chartConfig={chartConfig}
            paddingLeft={'-10'}
            backgroundColor={'transparent'}
            center={[20, 10]}
            accessor={'price'}
            avoidFalseZero
        />
    )
}

export default SpentByCategoryChart

