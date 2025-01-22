import React from 'react'
import { Layout } from '@ui-kitten/components'
import { ScrollView, StyleSheet } from 'react-native'
import { currentSubscriptionsAtom, ISubscriptions } from '../../common/atoms/useSubscriptionsAtom'
import { useAtomValue } from 'jotai'
import PayByAllMonthsChart from './charts/PayByAllMonthsChart'
import GetPremiumChartBanner from './charts/GetPremiumChartBanner'
import { isUserPremiumAtom } from '../../common/atoms/useCurrentUserAtom'
import SpentByCategoryGrid from './charts/SpentByCategoryGrid'
import NumberOfCategoriesChart from './charts/NumberOfCategoriesChart'
import HighLowPaidSubscriptionChart from './charts/HighLowPaidSubscriptionChart'
import SpentByCategoryChart from './charts/SpentByCategoryChart'

export default function StatisticsScreen() {
    const isPremium = useAtomValue(isUserPremiumAtom)
    const currentSubscriptions: ISubscriptions = useAtomValue(currentSubscriptionsAtom)

    return (
        <Layout level="2" style={{ height: '100%' }}>
            <ScrollView>
                <Layout style={styles.container} level="2">
                    <HighLowPaidSubscriptionChart currentSubscriptions={currentSubscriptions} />
                    <SpentByCategoryGrid currentSubscriptions={currentSubscriptions} />
                    {isPremium ? (
                        <>
                            <SpentByCategoryChart currentSubscriptions={currentSubscriptions} />
                            <PayByAllMonthsChart currentSubscriptions={currentSubscriptions} />
                            <NumberOfCategoriesChart currentSubscriptions={currentSubscriptions} />
                        </>
                    ) : (
                        <GetPremiumChartBanner />
                    )}
                </Layout>
            </ScrollView>
        </Layout>
    )
}
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

