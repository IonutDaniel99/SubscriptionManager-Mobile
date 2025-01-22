import React, { useEffect } from 'react'
import moment from 'moment'
import { capitalize, range } from 'lodash'

import { MONTHS } from '../../../constants'
import { IndexPath, Radio, Select, SelectItem, Text } from '@ui-kitten/components'
import { Dimensions, StyleSheet, View } from 'react-native'
import { HandleRRULEObject } from '../../../types/IRepeatProps'
import { useTranslation } from 'react-i18next'

const screenWidth = Dimensions.get('window').width

type RepeatYearlyOnProps = {
    mode: 'on' | 'on the'
    on: {
        month: (typeof MONTHS)[number]
        day: number
    }
    hasMoreModes: boolean
    isEditMode: boolean
    // eslint-disable-next-line no-unused-vars
    handleChange: (value: HandleRRULEObject) => void
}

const RepeatYearlyOn = ({ isEditMode, mode, on, hasMoreModes, handleChange }: RepeatYearlyOnProps) => {
    const { t } = useTranslation()
    const isActive = mode === 'on'
    const [monthIndexInput, setMonthIndexInput] = React.useState<IndexPath>(new IndexPath(0))
    const [dayIndexInput, setDayIndexInput] = React.useState<IndexPath>(new IndexPath(0))

    const daysInMonth = moment(MONTHS[monthIndexInput.row], 'MMM').daysInMonth()

    useEffect(() => {
        if (isEditMode && on) {
            const monthIndex = MONTHS.findIndex((m) => m === on.month)
            const dayIndex = on.day - 1

            setMonthIndexInput(new IndexPath(monthIndex))
            setDayIndexInput(new IndexPath(dayIndex))
        }
    }, [isEditMode, on])

    const handleMonthIndexSelect = (val: IndexPath) => {
        setMonthIndexInput(val as IndexPath)
        handleChange({
            target: { name: 'repeat.yearly.on.month', value: MONTHS[val.row] }
        })
    }
    const handleDayIndexSelect = (val: IndexPath) => {
        setDayIndexInput(val)
        handleChange({
            target: { name: 'repeat.yearly.on.day', value: (val.row + 1).toString() }
        })
    }

    return (
        <View style={styles.container}>
            {hasMoreModes && (
                <Radio
                    style={styles.radio}
                    checked={isActive}
                    onChange={() => handleChange({ target: { name: 'repeat.yearly.mode', value: 'on' } })}
                >
                    <Text>{t('on')}</Text>
                </Radio>
            )}
            <Select
                style={styles.select}
                selectedIndex={monthIndexInput}
                disabled={!isActive}
                value={capitalize(t(MONTHS[monthIndexInput.row].toLowerCase()))}
                accessoryRight={() => <></>}
                onSelect={(val) => handleMonthIndexSelect(val as IndexPath)}
            >
                {MONTHS.map((month) => (
                    <SelectItem key={month} title={capitalize(t(month.toLowerCase()))} />
                ))}
            </Select>
            <Select
                style={styles.select}
                disabled={!isActive}
                value={dayIndexInput.row + 1}
                accessoryRight={() => <></>}
                onSelect={(index) => {
                    handleDayIndexSelect(index as IndexPath)
                }}
            >
                {range(0, daysInMonth).map((i) => (
                    <SelectItem key={i} title={i + 1} />
                ))}
            </Select>
        </View>
    )
}

export default RepeatYearlyOn

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        paddingVertical: 10
    },
    radio: {
        width: screenWidth * 0.175
    },
    select: {
        marginHorizontal: 4, // Optional: Add spacing between elements
        width: screenWidth * 0.2 // 30% of screen width
    }
})
