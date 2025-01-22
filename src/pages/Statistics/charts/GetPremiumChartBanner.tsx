import { useNavigation } from '@react-navigation/native'
import { Button, Text } from '@ui-kitten/components'
import React, { useMemo } from 'react'
import { Dimensions, StyleSheet, View } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import { APP_ROUTES } from '../../../common/enums/appRoutes'
import { currentThemeAtom } from '../../../common/atoms/useCurrentTheme'
import { useAtomValue } from 'jotai'
import { useTranslation } from 'react-i18next'
import { useOrientation } from '../../../hooks/useOrientation'
import { LineChart } from 'react-native-chart-kit'
import { AbstractChartConfig } from 'react-native-chart-kit/dist/AbstractChart'

function GetPremiumChartBanner() {
    const { t } = useTranslation()
    const isOriented = useOrientation()
    const navigate = useNavigation()
    const currentTheme = useAtomValue<'light' | 'dark'>(currentThemeAtom)

    const mockChartData = [
        {
            month: '1',
            totalPrice: 16
        },
        {
            month: '2',
            totalPrice: 15.9
        },
        {
            month: '3',
            totalPrice: 16
        },
        {
            month: '4',
            totalPrice: 15
        }
    ]

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

    const dynamicValues = useMemo(() => {
        if (currentTheme === 'light') {
            return {
                gradient: ['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 0.7)', 'rgba(255, 255, 255, 1)'],
                background: 'rgba(255, 255, 255, 1)'
            }
        } else {
            return {
                gradient: ['rgba(26, 33, 56, 0)', 'rgba(26, 33, 56, 0.7)', 'rgba(26, 33, 56, 1)'],
                background: 'rgba(26, 33, 56, 1)'
            }
        }
    }, [currentTheme])

    const widthDimension = useMemo(() => Dimensions.get('window').width, [isOriented])

    return (
        <>
            <LineChart
                data={{
                    labels: mockChartData.map((item) => item.month),
                    datasets: [
                        {
                            data: mockChartData.map((item) => item.totalPrice)
                        }
                    ]
                }}
                width={widthDimension - 40}
                height={220}
                yAxisSuffix="$"
                chartConfig={chartConfig}
                bezier
                style={{
                    marginVertical: 8,
                    borderRadius: 16
                }}
            />
            <View style={[styles.container, { width: widthDimension }]}>
                <LinearGradient colors={dynamicValues.gradient} style={styles.gradient} />
                <View style={[styles.premiumDetails, { backgroundColor: dynamicValues.background }]}>
                    <View style={styles.premiumContainer}>
                        <Text category="h4">{t('upgradeToPremium')}</Text>
                        <Text category="s1" style={styles.premiumText}>
                            {t('unlockPremiumStatistics')}
                        </Text>
                        <Button
                            style={styles.premiumButton}
                            onPress={() => navigate.navigate(APP_ROUTES.SETTINGS as string as never)}
                        >
                            {t('subscribeNow')}
                        </Button>
                    </View>
                </View>
            </View>
        </>
    )
}

export default GetPremiumChartBanner

const styles = StyleSheet.create({
    container: {
        zIndex: 1000,
        height: 280,
        position: 'absolute',
        bottom: 0
    },
    gradient: {
        height: 80,
        width: '100%',
        position: 'relative'
    },
    premiumDetails: {
        position: 'relative',
        height: 200,
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 20
    },
    premiumContainer: {
        width: '90%',
        display: 'flex',
        gap: 8,
        justifyContent: 'center',
        alignItems: 'center'
    },
    premiumText: {
        textAlign: 'center',
        width: '70%',
        fontWeight: '600'
    },
    premiumButton: {
        marginTop: 12,
        width: '70%'
    }
})
