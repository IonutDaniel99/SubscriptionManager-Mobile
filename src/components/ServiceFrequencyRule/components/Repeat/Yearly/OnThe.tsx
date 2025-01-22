import React, { useEffect } from 'react'
import { View, StyleSheet, Dimensions } from 'react-native'
import { DAYS, MONTHS } from '../../../constants'
import { IndexPath, Radio, Select, SelectItem, Text } from '@ui-kitten/components'
import { HandleRRULEObject } from '../../../types/IRepeatProps'
import { useTranslation } from 'react-i18next'
import { capitalize } from 'lodash'

type RepeatYearlyOnTheProps = {
    mode: 'on' | 'on the'
    onThe: {
        which: string
        month: string
        day: string
    }
    hasMoreModes: boolean
    isEditMode: boolean
    // eslint-disable-next-line no-unused-vars
    handleChange: (value: HandleRRULEObject) => void
}

const screenWidth = Dimensions.get('window').width

const RepeatYearlyOnThe = ({ isEditMode, mode, onThe, hasMoreModes, handleChange }: RepeatYearlyOnTheProps) => {
    const { t } = useTranslation()
    const isActive = mode === 'on the'

    const [whichIndexInput, setWhichIndexInput] = React.useState<IndexPath>(new IndexPath(0))
    const [dayIndexInput, setDayIndexInput] = React.useState<IndexPath>(new IndexPath(0))
    const [montlyIndexInput, setMontlyIndexInput] = React.useState<IndexPath>(new IndexPath(0))
    const NUMERALS = ['First', 'Second', 'Third', 'Fourth', 'Last']

    useEffect(() => {
        if (isEditMode && onThe) {
            const whichIndex = NUMERALS.findIndex((num) => num === onThe.which)
            const dayIndex = DAYS.findIndex((day) => day === onThe.day)
            const monthIndex = MONTHS.findIndex((month) => month === onThe.month)

            setWhichIndexInput(new IndexPath(whichIndex))
            setDayIndexInput(new IndexPath(dayIndex))
            setMontlyIndexInput(new IndexPath(monthIndex))
        }
    }, [isEditMode, onThe])

    const handleWhichIndexSelect = (val: IndexPath) => {
        setWhichIndexInput(val as IndexPath)
        handleChange({
            target: { name: 'repeat.yearly.onThe.which', value: `${NUMERALS[val.row]}` }
        })
    }
    const handleDayIndexSelect = (val: IndexPath) => {
        setDayIndexInput(val as IndexPath)
        handleChange({
            target: { name: 'repeat.yearly.onThe.day', value: DAYS[val.row] }
        })
    }
    const handleMonthIndexSelect = (val: IndexPath) => {
        setMontlyIndexInput(val as IndexPath)
        handleChange({
            target: { name: 'repeat.yearly.onThe.month', value: MONTHS[val.row] }
        })
    }
    return (
        <View style={styles.container}>
            {hasMoreModes && (
                <Radio
                    style={styles.radio}
                    checked={isActive}
                    onChange={() => handleChange({ target: { name: 'repeat.yearly.mode', value: 'on the' } })}
                >
                    <Text>{t('onThe')}</Text>
                </Radio>
            )}
            <Select
                style={{ width: screenWidth * 0.2, marginHorizontal: 2 }}
                selectedIndex={whichIndexInput}
                accessoryRight={() => <></>}
                disabled={!isActive}
                value={t(onThe.which.toLowerCase())}
                onSelect={(val) => handleWhichIndexSelect(val as IndexPath)}
            >
                <SelectItem title={t('first')} />
                <SelectItem title={t('second')} />
                <SelectItem title={t('third')} />
                <SelectItem title={t('fourth')} />
                <SelectItem title={t('fifth')} />
            </Select>
            <Select
                style={{ width: screenWidth * 0.25, marginHorizontal: 2 }}
                selectedIndex={dayIndexInput}
                accessoryRight={() => <></>}
                disabled={!isActive}
                value={capitalize(t(onThe.day.toLowerCase()))}
                onSelect={(index) => handleDayIndexSelect(index as IndexPath)}
            >
                {DAYS.map((day) => (
                    <SelectItem key={day} title={capitalize(t(day.toLowerCase()))} />
                ))}
            </Select>
            <Text style={{ paddingHorizontal: 6 }}>{t('of')}</Text>
            <Select
                style={{ width: screenWidth * 0.15, marginHorizontal: 2 }}
                selectedIndex={montlyIndexInput}
                accessoryRight={() => <></>}
                disabled={!isActive}
                value={capitalize(t(onThe.month.toLowerCase()))}
                onSelect={(index) => handleMonthIndexSelect(index as IndexPath)}
            >
                {MONTHS.map((month) => (
                    <SelectItem key={month} title={capitalize(t(month.toLowerCase()))} />
                ))}
            </Select>
        </View>
    )
}

export default RepeatYearlyOnThe

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        paddingVertical: 10
    },
    radio: {
        width: screenWidth * 0.18
    }
})
