import { Divider, Text } from '@ui-kitten/components'
import React, { useMemo, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Dimensions, StyleSheet, View } from 'react-native'
import { BannerAd, BannerAdSize, PaidEvent, TestIds } from 'react-native-google-mobile-ads'
import appJson from '../../../app.json'
import Logger from '../../common/utils/logger/logger'
const adUnitId = __DEV__ ? TestIds.BANNER : appJson['react-native-google-mobile-ads'].banner_id

export default function AdComponent() {
    const bannerRef = useRef<BannerAd>(null)

    const { t } = useTranslation()

    const onAdClosed = () => {
        Logger.info('AdComponent', 'onAdClosed')
    }

    const onAdFailedToLoad = (e: Error) => {
        Logger.error('AdComponent', 'onAdFailedToLoad', e)
    }

    const onAdLoaded = (dimensions: { width: number; height: number }) => {
        const screenWidth = Math.round(Dimensions.get('window').width)
        const heightWidth = Math.round(Dimensions.get('window').height)

        Logger.info('AdComponent', 'onAdLoaded', {
            screenSize: `${screenWidth}x${heightWidth}`,
            adSize: `${dimensions.width}x${dimensions.height}`
        })
    }
    const onAdOpen = () => {
        Logger.info('AdComponent', 'onAdOpen', 'User clicked on ad!')
    }

    const onPaid = (e: PaidEvent) => {
        Logger.info('AdComponent', 'onPaid', e)
    }

    return (
        <View style={[styles.listView, { alignItems: 'center' }]}>
            <View style={styles.listViewTitle}>
                <Text style={styles.listViewText} category="s1">
                    {t('advertiser')}
                </Text>
            </View>
            <BannerAd
                ref={bannerRef}
                size={BannerAdSize.BANNER}
                unitId={adUnitId}
                onAdClosed={onAdClosed}
                onAdFailedToLoad={onAdFailedToLoad}
                onAdOpened={onAdOpen}
                onAdLoaded={onAdLoaded}
                onPaid={(e) => onPaid(e)}
            />
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        height: 64,
        width: '100%'
    },
    listView: {
        paddingVertical: 16
    },
    listViewText: {
        fontWeight: '700',
        paddingHorizontal: 8,
        paddingBottom: 8
    },
    listViewTitle: {
        alignItems: 'center',
        borderRadius: 22,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between'
    }
})

