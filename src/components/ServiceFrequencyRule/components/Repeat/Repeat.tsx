import React, { useEffect, useState } from 'react'
import RepeatYearly from './Yearly/Yearly'

import { View } from 'react-native'
import { IndexPath, Select, SelectItem } from '@ui-kitten/components'
import { Frequency, IRepeatProps } from '../../types/IRepeatProps'
import RepeatMonthly from './Monthly/Monthly'
import RepeatWeekly from './Weekly/Weekly'
import RepeatDaily from './Daily/Daily'
import { useTranslation } from 'react-i18next'
import { capitalize } from 'lodash'

type RepeatProps = IRepeatProps & { isEditMode: boolean }

const Repeat = ({ repeat, isEditMode, handleChange }: RepeatProps) => {
    const { t } = useTranslation()
    const { yearly, monthly, weekly, daily } = repeat
    const selectOptions: { label: string; value: string }[] = [
        { label: 'yearly', value: 'Yearly' },
        { label: 'monthly', value: 'Monthly' },
        { label: 'weekly', value: 'Weekly' },
        { label: 'daily', value: 'Daily' }
    ]

    const [selectedIndex, setSelectedIndex] = useState(new IndexPath(0))

    useEffect(() => {
        if (isEditMode) {
            const newIndex = selectOptions.findIndex((option) => option.value === repeat.frequency)
            setSelectedIndex(new IndexPath(newIndex))
        }
    }, [repeat.frequency, isEditMode])

    const handleSelectChange = (index: IndexPath) => {
        handleChange({ target: { name: 'repeat.frequency', value: selectOptions[index.row].value } })
        setSelectedIndex(new IndexPath(index.row))
    }
    const isOptionSelected = (option: Frequency) => repeat.frequency === option
    return (
        <View className="py-2">
            <View>
                <Select
                    style={{ paddingTop: 8 }}
                    size="medium"
                    label={t('frequency')}
                    selectedIndex={selectedIndex}
                    value={capitalize(t(selectOptions[selectedIndex.row].label.toLowerCase()))}
                    onSelect={(index) => handleSelectChange(index as IndexPath)}
                >
                    {selectOptions.map((option) => (
                        <SelectItem key={option.value} title={capitalize(t(option.label))} />
                    ))}
                </Select>
            </View>
            <View className="px-2 pt-4">
                {isOptionSelected('Yearly') && (
                    <RepeatYearly isEditMode={isEditMode} yearly={yearly} handleChange={(e) => handleChange(e)} />
                )}
                {isOptionSelected('Monthly') && (
                    <RepeatMonthly monthly={monthly} handleChange={(e) => handleChange(e)} />
                )}
                {isOptionSelected('Weekly') && <RepeatWeekly weekly={weekly} handleChange={(e) => handleChange(e)} />}
                {isOptionSelected('Daily') && <RepeatDaily daily={daily} handleChange={handleChange} />}
            </View>
        </View>
    )
}

export default Repeat
