import { IndexPath, Select, SelectItem, Text } from '@ui-kitten/components'
import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'
import CountryFlag from 'react-native-country-flag'
import { getSingleValueData, storeSingleValueData } from '../../../common/utils/async_storage/AsyncStorage'
import moment from 'moment'
import Logger from '../../../common/utils/logger/logger'

const EnIcon = () => <CountryFlag isoCode="us" size={16} />
const FrIcon = () => <CountryFlag isoCode="fr" size={16} />
const DeIcon = () => <CountryFlag isoCode="de" size={16} />

const languages = [
    { name: 'English', iso: 'en', icon: EnIcon },
    { name: 'French', iso: 'fr', icon: FrIcon },
    { name: 'Deutsch', iso: 'de', icon: DeIcon }
]

export default function Language() {
    const { t, i18n } = useTranslation()
    const [selectedIndex, setSelectedIndex] = React.useState<IndexPath>(new IndexPath(0))
    const [isLoading, setIsLoading] = React.useState(true)

    useEffect(() => {
        getSingleValueData('language').then((language) => {
            if (language) {
                const index = languages.findIndex((lang) => lang.iso === language)
                moment.locale(i18n.language)
                setSelectedIndex(new IndexPath(index))
            }
            setIsLoading(false)
        })
    }, [])

    const handleSelect = async (index: IndexPath) => {
        setSelectedIndex(index)
        i18n.changeLanguage(languages[index.row].iso)
        moment.locale(i18n.language)
        await storeSingleValueData('language', languages[index.row].iso)
        Logger.info('Language', `Language changed to: ${languages[index.row].iso}`)
    }

    return (
        <View className="flex gap-2 mt-2">
            <Text category="h6">{t('language')}</Text>
            <Select
                size="medium"
                value={isLoading ? t('loading') : languages[selectedIndex.row].name}
                selectedIndex={selectedIndex}
                onSelect={(index) => handleSelect(index as IndexPath)}
            >
                {languages.map((language) => {
                    return <SelectItem key={language.iso} title={language.name} accessoryLeft={language.icon} />
                })}
            </Select>
        </View>
    )
}

