import React, { useCallback, useEffect, useState } from 'react'
import { Avatar, Divider, Text } from '@ui-kitten/components'
import { ScrollView, StyleSheet, View } from 'react-native'
// assuming both components are in the same directory
import { useAtom, useAtomValue } from 'jotai'
import uuid from 'react-native-uuid'
import subscriptionEmitter from '../../common/emiters/subscriptionsEmitter'
import LoadingIndicator from '../LoadingIndicator'
import { hasSameMonthAndYear } from '../../common/utils/time_date/time_date_utils'
import moment from 'moment'
import { getAllFromRRule } from '../ServiceFrequencyRule/utils/computeRRule/getAllFromRRule'
import { currentSubscriptionsAtom } from '../../common/atoms/useSubscriptionsAtom'
import { useTranslation } from 'react-i18next'
import { ListItem } from './ListItem'
import AdComponent from '../AdComponent/AdComponent'
import { isUserPremiumAtom } from '../../common/atoms/useCurrentUserAtom'
import { servicesCurrencySymbolAtom } from '../../common/atoms/useServicesLogoAtom'

export interface IListItem {
    subscriptionID: string
    title: string
    description: string
    logo: string
    price: number | string
    category: string
}

interface GroupedItems {
    date: Date
    items: IListItem[]
    price: number
}

export const CustomList = ({ currentSelectedDate }: { currentSelectedDate: Date }) => {
    const { t } = useTranslation()
    const [isLoading, setIsLoading] = useState(true)
    const [currentSubscriptions] = useAtom(currentSubscriptionsAtom)
    const [isPremium] = useAtom(isUserPremiumAtom)
    const [listOfItems, setListOfItems] = useState<GroupedItems[]>([])
    const getCurrencySymbol = useAtomValue(servicesCurrencySymbolAtom)

    const groupItemsByDate = useCallback((): GroupedItems[] => {
        const groupedMap = new Map<string, IListItem[]>()

        if (!currentSubscriptions || Object.keys(currentSubscriptions).length === 0) {
            return []
        }

        Object.values(currentSubscriptions).forEach((subscription) => {
            const { rrule, subscriptionData } = subscription
            const allDates = getAllFromRRule(rrule)

            allDates.forEach((dateString) => {
                const date = new Date(dateString).toDateString() // Normalize the date format

                // Initialize array if the date does not exist in the map
                if (!groupedMap.has(date)) {
                    groupedMap.set(date, [])
                }

                // Create an IListItem object from subscriptionData
                const listItem: IListItem = {
                    subscriptionID: subscription.subscriptionID,
                    title: subscriptionData.name,
                    description: `Service ${subscriptionData.name}`,
                    logo: subscriptionData.logo,
                    price: subscriptionData.price,
                    category: subscriptionData.category
                }

                groupedMap.get(date)?.push(listItem)
            })
        })

        return Array.from(groupedMap.entries()).map(([date, items]) => ({
            date: new Date(date),
            price: items.reduce((acc, item) => acc + Number(item.price), 0),
            items
        }))
    }, [currentSubscriptions])

    const fetchSubscriptions = useCallback(() => {
        const sortedGroupedItems = groupItemsByDate().sort((a, b) => a.date.getTime() - b.date.getTime())
        setListOfItems(sortedGroupedItems)
        setIsLoading(false)
    }, [currentSubscriptions, currentSelectedDate])

    useEffect(() => {
        setIsLoading(true)
        fetchSubscriptions()

        const subscriptionListener = () => fetchSubscriptions()
        subscriptionEmitter.on('update', subscriptionListener)

        return () => {
            subscriptionEmitter.off('update', subscriptionListener)
        }
    }, [fetchSubscriptions])

    if (isLoading) {
        return <LoadingIndicator />
    }

    const filteredListOfItems = listOfItems.filter((item) => hasSameMonthAndYear(item.date, currentSelectedDate))

    if (filteredListOfItems.length === 0) {
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', opacity: 0.3 }}>
                <Avatar
                    style={{ height: 80, width: 80, marginBottom: 16, opacity: 0.3 }}
                    shape="rounded"
                    source={require('../../assets/icons/close.png')}
                />
                <Text category="p1" style={{ fontWeight: '700' }}>
                    {t('noSubscriptionFound', { date: moment(currentSelectedDate).format('MMMM YYYY') })}
                </Text>
            </View>
        )
    }
    return (
        <ScrollView style={styles.listContainer}>
            {filteredListOfItems.map((group, groupIndex) => {
                const groupItemsLength = Math.floor(filteredListOfItems.length / 2)
                return (
                    <React.Fragment key={`${group.date.toString()}-${uuid.v4()}`}>
                        {/* AdComponent inserted at the middle */}
                        {!isPremium && groupIndex === groupItemsLength && (
                            <AdComponent key={`Advertiser-${uuid.v4()}`} />
                        )}

                        {/* ListItemView */}
                        <View style={styles.listView}>
                            <View style={styles.listViewTitle}>
                                <Text style={styles.listViewText} category="s1">
                                    {moment(group.date).format('dddd, DD MMMM YYYY')}
                                </Text>
                                <Text category="s2">
                                    {t('totalPrice', { price: group.price, currency: getCurrencySymbol })}
                                </Text>
                            </View>
                            <View style={{ borderRadius: 20, paddingTop: 5, overflow: 'hidden' }}>
                                {group.items.map((item, index) => {
                                    return (
                                        <React.Fragment key={`${item.subscriptionID}-${uuid.v4()}`}>
                                            <ListItem {...item} key={`${uuid.v4()}`} symbol={getCurrencySymbol} />
                                            {index !== group.items.length - 1 && <Divider />}
                                        </React.Fragment>
                                    )
                                })}
                            </View>
                        </View>
                    </React.Fragment>
                )
            })}
            <View style={{ height: 80 }} />
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    listContainer: {
        paddingHorizontal: 16,
        width: '100%'
    },
    listView: {
        paddingVertical: 16
    },
    listViewText: {
        fontWeight: '700'
    },
    listViewTitle: {
        alignItems: 'center',
        borderRadius: 22,
        paddingHorizontal: 8,
        flexDirection: 'row',
        justifyContent: 'space-between'
    }
})

