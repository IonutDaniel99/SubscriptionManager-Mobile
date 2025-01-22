import React from 'react'
import { Drawer, DrawerGroup, DrawerItem, Text } from '@ui-kitten/components'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

export const FAQ = (): React.ReactElement => {
    const { t } = useTranslation()

    const supportEmail = 'gamma.bear10@gmail.com'

    return (
        <View style={{ marginTop: 20 }}>
            <Text category="h6" style={{ marginBottom: 12 }}>
                {t('faq')}
            </Text>
            <View>
                <Drawer>
                    <DrawerGroup title={t('howToAddSubscription')}>
                        <DrawerItem title={t('howToAddSubscriptionDetails')} />
                    </DrawerGroup>
                    <DrawerGroup title={t('howToEditOrDeleteSubscription')}>
                        <DrawerItem title={t('howToEditOrDeleteSubscriptionDetails')} />
                    </DrawerGroup>
                    <DrawerGroup title={t('viewMonthlySpending')}>
                        <DrawerItem title={t('viewMonthlySpendingDetails')} />
                    </DrawerGroup>
                    <DrawerGroup title={t('contactDeveloper')}>
                        <DrawerItem title={t('contactDeveloperDetails', { email: supportEmail })} />
                    </DrawerGroup>
                    <DrawerGroup title={t('sendErrorLogs')}>
                        <DrawerItem title={t('sendErrorLogsDetails')} />
                    </DrawerGroup>
                    <DrawerGroup title={t('exportSubscriptionData')}>
                        <DrawerItem title={t('exportSubscriptionDataDetails')} />
                    </DrawerGroup>
                    <DrawerGroup title={t('resetOrClearData')}>
                        <DrawerItem title={t('resetOrClearDataDetails')} />
                    </DrawerGroup>
                </Drawer>
            </View>
        </View>
    )
}

