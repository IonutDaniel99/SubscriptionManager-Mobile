import { Text } from '@ui-kitten/components'
import React, { useCallback, useMemo } from 'react'
import { Dimensions, View } from 'react-native'
import { LineChart } from 'react-native-chart-kit'
import { ISubscriptions } from '../../../common/atoms/useSubscriptionsAtom'
import { getAllFromRRule } from '../../../components/ServiceFrequencyRule/utils/computeRRule/getAllFromRRule'
import { useOrientation } from '../../../hooks/useOrientation'
import { AbstractChartConfig } from 'react-native-chart-kit/dist/AbstractChart'
import { currentThemeAtom } from '../../../common/atoms/useCurrentTheme'
import { useAtomValue } from 'jotai'
import { servicesCurrencySymbolAtom } from '../../../common/atoms/useServicesLogoAtom'
import { useTranslation } from 'react-i18next'

function PayByAllMonthsChart({ currentSubscriptions }: { currentSubscriptions: ISubscriptions }) {
    if (Object.values(currentSubscriptions).length === 0) return null
    const { t } = useTranslation()
    const getCurrencySymbol = useAtomValue(servicesCurrencySymbolAtom)
    const currentTheme = useAtomValue<'light' | 'dark'>(currentThemeAtom)
    const isOriented = useOrientation()

    const chartConfig = useMemo<AbstractChartConfig>(
        () => ({
            backgroundColor: currentTheme === 'light' ? '#B73010' : '#022173', //B73010 - orange / 022173 - blue
            backgroundGradientFrom: currentTheme === 'light' ? '#FF6821' : '#022173', //FF6821 - orange / 022173 - blue
            backgroundGradientTo: currentTheme === 'light' ? '#FF9858' : '#1b3fa0', //FF9858 - orange / 1b3fa0 - blue
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            style: {
                borderRadius: 16
            },
            propsForDots: {
                r: '4',
                strokeWidth: '2',
                stroke: '#ffa726'
            }
        }),
        [isOriented, currentTheme]
    )

    const widthDimension = useMemo(() => Dimensions.get('window').width, [isOriented])

    const groupItemsByDate = useCallback((): { month: string; totalPrice: number }[] => {
        const groupedMap = new Map<string, number[]>() // Map to store prices for each month
        const result: { month: string; totalPrice: number }[] = []

        if (!currentSubscriptions || Object.keys(currentSubscriptions).length === 0) {
            return []
        }

        const currentDate = new Date()

        for (let i = 0; i < 12; i++) {
            const futureDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + i)
            const monthYear = futureDate.toLocaleString('default', { month: 'short' })
            groupedMap.set(t(monthYear.toLocaleLowerCase()), []) // Set an empty array for each month
        }

        Object.values(currentSubscriptions).forEach((subscription) => {
            const { rrule, subscriptionData } = subscription
            const allDates = getAllFromRRule(rrule)

            allDates.forEach((dateString) => {
                const date = new Date(dateString)

                // Only consider dates within the next 12 months
                const monthsDifference =
                    (date.getFullYear() - currentDate.getFullYear()) * 12 + (date.getMonth() - currentDate.getMonth())
                if (monthsDifference >= 0 && monthsDifference < 12) {
                    const monthYear = date.toLocaleString('default', { month: 'short' })

                    // Convert price to a number, handle NaN by defaulting to 0
                    const price = Number(subscriptionData.price) || 0
                    groupedMap.get(t(monthYear.toLocaleLowerCase()))?.push(price)
                }
            })
        })

        // Build the result array based on groupedMap and ensure all 12 months are included
        Array.from(groupedMap.entries()).forEach(([month, prices]) => {
            result.push({
                month, // e.g., 'Jan'
                totalPrice: prices.reduce((acc, price) => acc + price, 0) // Sum up all prices for the month
            })
        })

        return result
    }, [currentSubscriptions])

    const groupedItems = groupItemsByDate()

    return (
        <View style={{ marginVertical: 12 }}>
            <Text category="h6" style={{ marginBottom: 2 }}>
                Next 12 Months
            </Text>
            <LineChart
                data={{
                    labels: groupedItems.map((item) => item.month),
                    datasets: [
                        {
                            data: groupedItems.map((item) => item.totalPrice)
                        }
                    ]
                }}
                width={widthDimension - 40} // from react-native
                height={220}
                yAxisSuffix={getCurrencySymbol}
                chartConfig={chartConfig}
                bezier
                style={{
                    marginVertical: 8,
                    borderRadius: 16
                }}
            />
        </View>
    )
}

export default PayByAllMonthsChart

