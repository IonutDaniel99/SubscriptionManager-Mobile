import React, { useEffect, useState } from 'react'
import { Button, Card, Icon, IconProps, Text, ViewPager } from '@ui-kitten/components'
import { Alert, StyleSheet, View } from 'react-native'
import { useTranslation } from 'react-i18next'
import { MAXIMUM_NUMBER_OF_SUBSCRIPTIONS_FOR_NON_PREMIUM_USERS } from '../../../global'
import {
    finishTransaction,
    getProducts,
    purchaseErrorListener,
    purchaseUpdatedListener,
    requestPurchase
} from 'react-native-iap'
import { google_play_iap_skus } from '../../../common/utils/sku'
import Logger from '../../../common/utils/logger/logger'
import PaymentButton from '../../../components/PaymentButton'
import { isUserPremiumAtom } from '../../../common/atoms/useCurrentUserAtom'
import { useAtomValue } from 'jotai'

export default function Subscriptions() {
    const [selectedIndex, setSelectedIndex] = React.useState(0)
    const { t } = useTranslation()
    const isPremium = useAtomValue(isUserPremiumAtom)

    const ActivityIcon = (props: IconProps) => <Icon {...props} style={styles.featureIcon} name="activity-outline" />
    const VideoIcon = (props: IconProps) => <Icon {...props} style={styles.featureIcon} name="video-outline" />
    const CloudOffIcon = (props: IconProps) => (
        <Icon {...props} style={styles.featureIcon} name="cloud-upload-outline" />
    )
    const HeadphoneIcon = (props: IconProps) => <Icon {...props} style={styles.featureIcon} name="headphones-outline" />
    const GiftIcon = (props: IconProps) => <Icon {...props} style={styles.featureIcon} name="gift-outline" />
    const BarChartIcon = (props: IconProps) => <Icon {...props} style={styles.featureIcon} name="bar-chart-outline" />

    const freeDetails = [
        {
            title: t('limitedAccessTitle'),
            description: t('limitedAccessDesc', {
                noOfServices: MAXIMUM_NUMBER_OF_SUBSCRIPTIONS_FOR_NON_PREMIUM_USERS
            }),
            icon: ActivityIcon
        },
        {
            title: t('adsIncludedTitle'),
            description: t('adsIncludedDesc'),
            icon: VideoIcon
        },
        {
            title: t('noCloudSaveTitle'),
            description: t('noCloudSaveDesc'),
            icon: CloudOffIcon
        },
        {
            title: t('noAdvancedStatsTitle'),
            description: t('noAdvancedStatsDesc'),
            icon: BarChartIcon
        },
        {
            title: t('basicSupportTitle'),
            description: t('basicSupportDesc'),
            icon: HeadphoneIcon
        }
    ]

    const paidDetails = [
        {
            title: t('unlimitedServicesTitle'),
            description: t('unlimitedServicesDesc'),
            icon: ActivityIcon
        },
        {
            title: t('adFreeExperienceTitle'),
            description: t('adFreeExperienceDesc'),
            icon: VideoIcon
        },
        {
            title: t('cloudSyncTitle'),
            description: t('cloudSyncDesc'),
            icon: CloudOffIcon
        },
        {
            title: t('advancedStatsTitle'),
            description: t('advancedStatsDesc'),
            icon: BarChartIcon
        },
        {
            title: t('donationTitle'),
            description: t('donationDesc'),
            icon: GiftIcon
        }
    ]

    return (
        <View style={styles.subscriptionContainer}>
            <Text category="h6" style={{ marginBottom: 12 }}>
                {t('subscriptions')}
            </Text>
            {!isPremium ? (
                <ViewPager selectedIndex={selectedIndex} onSelect={(index) => setSelectedIndex(index)}>
                    <Card style={styles.cardBasic} status="basic">
                        <Text category="h6" style={{ marginBottom: 12 }}>
                            {t('free')}
                        </Text>
                        <View style={{ gap: 12 }}>
                            {freeDetails.map((item, index) => (
                                <View key={index} className="flex flex-row items-center gap-3">
                                    {item.icon({ fill: '#8F9BB3' })}
                                    <View className="flex-1">
                                        <Text category="label" className="truncate">
                                            {item.title}
                                        </Text>
                                        <Text category="c1" className="truncate">
                                            {item.description}
                                        </Text>
                                    </View>
                                </View>
                            ))}
                        </View>
                        <Button style={{ marginTop: 16 }} disabled={true}>
                            {t('subscribeFreeButton')}
                        </Button>
                    </Card>
                    <Card style={styles.cardPremium} status="warning">
                        <Text category="h6" style={{ marginBottom: 12 }}>
                            {t('premium')}
                        </Text>
                        <View style={{ gap: 12 }}>
                            {paidDetails.map((item, index) => (
                                <View key={index} className="flex flex-row items-center gap-3">
                                    {item.icon({ fill: '#8F9BB3' })}
                                    <View className="flex-1">
                                        <Text category="label" className="truncate">
                                            {item.title}
                                        </Text>
                                        {item.description && (
                                            <Text category="c1" className="truncate">
                                                {item.description}
                                            </Text>
                                        )}
                                    </View>
                                </View>
                            ))}
                        </View>
                        <PaymentButton />
                    </Card>
                </ViewPager>
            ) : (
                <Card style={styles.cardPremium} status="warning">
                    <Text category="h6" style={{ marginBottom: 12 }}>
                        {t('premium')}
                    </Text>
                    <View style={{ gap: 12 }}>
                        {paidDetails.map((item, index) => (
                            <View key={index} className="flex flex-row items-center gap-3">
                                {item.icon({ fill: '#8F9BB3' })}
                                <View className="flex-1">
                                    <Text category="label" className="truncate">
                                        {item.title}
                                    </Text>
                                    {item.description && (
                                        <Text category="c1" className="truncate">
                                            {item.description}
                                        </Text>
                                    )}
                                </View>
                            </View>
                        ))}
                    </View>
                    <Button style={{ marginTop: 16 }} disabled={true}>
                        {t('subscribeFreeButton')}
                    </Button>
                </Card>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    cardBasic: {
        marginLeft: 0,
        marginRight: 12,
        marginVertical: 4
    },
    cardPremium: {
        marginRight: 0,
        marginVertical: 4
    },
    featureIcon: {
        height: 24,
        width: 24
    },
    subscriptionContainer: {
        marginTop: 20
    }
})

