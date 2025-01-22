import { IndexPath, Select, SelectItem, Text } from '@ui-kitten/components'
import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'
import CountryFlag from 'react-native-country-flag'
import {
    getObjectValueData,
    getSingleValueData,
    storeObjectValueData,
    storeSingleValueData
} from '../../../common/utils/async_storage/AsyncStorage'
import moment from 'moment'
import Logger from '../../../common/utils/logger/logger'
import { servicesCurrencySymbolAtom } from '../../../common/atoms/useServicesLogoAtom'
import { useSetAtom } from 'jotai'

const UsIcon = () => <CountryFlag isoCode="us" size={16} />
const EUIcon = () => <CountryFlag isoCode="eu" size={16} />
const GbIcon = () => <CountryFlag isoCode="gb" size={16} />

const currencies = [
    { name: 'dollar', iso: 'USD', country: 'United States', symbol: '$', icon: UsIcon },
    { name: 'euro', iso: 'EUR', country: 'Eurozone', symbol: '€', icon: EUIcon },
    { name: 'pound', iso: 'GBP', country: 'United Kingdom', symbol: '£', icon: GbIcon }
]

export default function Currency() {
    const { t, i18n } = useTranslation()
    const [selectedIndex, setSelectedIndex] = React.useState<IndexPath>(new IndexPath(0))
    const [isLoading, setIsLoading] = React.useState(true)
    const setCurrency = useSetAtom(servicesCurrencySymbolAtom)

    useEffect(() => {
        getObjectValueData('currency').then((currency) => {
            if (currency) {
                const index = currencies.findIndex((curr) => curr.iso === currency.iso)
                moment.locale(i18n.language)
                setSelectedIndex(new IndexPath(index))
            }
            setIsLoading(false)
        })
    }, [])

    const handleSelect = async (index: IndexPath) => {
        setSelectedIndex(index)
        setCurrency(currencies[index.row].symbol)
        await storeObjectValueData('currency', { iso: currencies[index.row].iso, symbol: currencies[index.row].symbol })
        Logger.info('handleSelect', `Currency changed to: ${currencies[index.row].iso}`)
    }

    return (
        <View className="flex gap-2 mt-2">
            <Text category="h6">{t('currency')}</Text>
            <Select
                size="medium"
                value={
                    isLoading
                        ? t('loading')
                        : `${t(currencies[selectedIndex.row].name)} - ${currencies[selectedIndex.row].symbol}`
                }
                selectedIndex={selectedIndex}
                onSelect={(index) => handleSelect(index as IndexPath)}
            >
                {currencies.map((currency) => {
                    return (
                        <SelectItem
                            key={currency.iso}
                            title={`${t(currency.name)} - ${currency.symbol}`}
                            accessoryLeft={currency.icon}
                        />
                    )
                })}
            </Select>
        </View>
    )
}

