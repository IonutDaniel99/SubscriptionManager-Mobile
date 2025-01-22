import { View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { IndexPath, Select, SelectItem, Text } from '@ui-kitten/components'
import After from './After'
import OnDate from './OnDate'
import { EndOptions, HandleRRULEObject } from '../../types/IRepeatProps'
import { useTranslation } from 'react-i18next'
import { capitalize } from 'lodash'

interface IRepeatProps {
    end: EndOptions
    isEditMode: boolean
    // eslint-disable-next-line no-unused-vars
    handleChange: (event: HandleRRULEObject) => void
}

export default function End({ end, isEditMode, handleChange }: IRepeatProps) {
    const { t } = useTranslation()
    const { mode, after, onDate } = end
    const [selectedIndex, setSelectedIndex] = useState(new IndexPath(0))
    const isOptionAvailable = (option: string) => mode === option

    const selectOptions: { label: string; value: string }[] = [
        { label: t('never'), value: 'Never' },
        { label: t('after'), value: 'After' },
        { label: t('onDate'), value: 'On date' }
    ]

    useEffect(() => {
        if (isEditMode) {
            const newIndex = selectOptions.findIndex((option) => option.value === mode)
            setSelectedIndex(new IndexPath(newIndex))
        }
    }, [mode, after, isEditMode])

    const handleSelectChange = (index: IndexPath) => {
        if (mode === 'After') {
            handleChange({ target: { name: 'end.after', value: 1 } })
            end.after = 1
        }
        handleChange({ target: { name: 'end.mode', value: selectOptions[index.row].value } })
        setSelectedIndex(new IndexPath(index.row))
    }

    return (
        <View className="py-2">
            <Select
                style={{ paddingTop: 8 }}
                size="medium"
                label={t('end')}
                selectedIndex={selectedIndex}
                value={capitalize(t(selectOptions[selectedIndex.row].label.toLowerCase()))}
                onSelect={(index) => handleSelectChange(index as IndexPath)}
            >
                {selectOptions.map((option, index) => (
                    <SelectItem key={index} title={capitalize(t(option.label))} />
                ))}
            </Select>
            <View className="pt-4">
                {isOptionAvailable('Never') && <Text category="label">{t('maxItterations')}</Text>}
                {isOptionAvailable('After') && <After after={after} handleChange={(e) => handleChange(e)} />}
                {isOptionAvailable('On date') && <OnDate onDate={onDate} handleChange={(e) => handleChange(e)} />}
            </View>
        </View>
    )
}
