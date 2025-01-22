import React, { useCallback, useMemo } from 'react'
import { Dimensions, View } from 'react-native'
import { PieChart } from 'react-native-chart-kit'
import { useOrientation } from '../../../hooks/useOrientation'
import { AbstractChartConfig } from 'react-native-chart-kit/dist/AbstractChart'
import { currentThemeAtom } from '../../../common/atoms/useCurrentTheme'
import { useAtomValue } from 'jotai'
import { ISubscriptions } from '../../../common/atoms/useSubscriptionsAtom'
import { PieChartColorsList } from './utils'
import { useTranslation } from 'react-i18next'
import { Text } from '@ui-kitten/components'

function NumberOfCategoriesChart({ currentSubscriptions }: { currentSubscriptions: ISubscriptions }) {
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

    const groupItemsByDate = useCallback((): { name: string; value: number }[] => {
        const categoryCounts: Record<string, number> = {}
        Object.values(currentSubscriptions).forEach((subscription) => {
            const category = subscription.subscriptionData.category
            categoryCounts[category] = (categoryCounts[category] || 0) + 1
        })

        const formattedCategoryCounts = Object.entries(categoryCounts)
            .map(([title, description], index) => ({
                name: t(title),
                value: Number(description),
                legendFontSize: 12,
                legendFontColor: currentTheme !== 'light' ? '#fff' : '#000',
                color: PieChartColorsList[index % PieChartColorsList.length]
            }))
            .sort((a, b) => b.value - a.value)

        return formattedCategoryCounts
    }, [currentSubscriptions, currentTheme])

    const chartItems = groupItemsByDate()

    return (
        <View style={{ marginVertical: 12 }}>
            <Text category="h6" style={{ marginBottom: 2 }}>
                Number of services per category
            </Text>
            <PieChart
                data={chartItems}
                width={widthDimension - 40}
                height={220}
                chartConfig={chartConfig}
                paddingLeft={'-10'}
                backgroundColor={'transparent'}
                center={[20, 10]}
                accessor={'value'}
                absolute
            />
        </View>
    )
}

export default NumberOfCategoriesChart

