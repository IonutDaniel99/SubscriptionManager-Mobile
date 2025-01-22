import React from 'react'
import { View, StyleSheet, Dimensions } from 'react-native'
import { DAYS } from '../../../constants'
import { IndexPath, Radio, Select, SelectItem, Text } from '@ui-kitten/components'
import { HandleRRULEObject } from '../../../types/IRepeatProps'
import { useTranslation } from 'react-i18next'
import { capitalize } from 'lodash'

type RepeatMonthlyOnTheProps = {
    mode: 'on' | 'on the'
    onThe: {
        which: string
        day: string
    }
    hasMoreModes: boolean
    // eslint-disable-next-line no-unused-vars
    handleChange: (value: HandleRRULEObject) => void
}

const screenWidth = Dimensions.get('window').width

const RepeatMonthlyOnThe = ({ mode, onThe, hasMoreModes, handleChange }: RepeatMonthlyOnTheProps) => {
    const { t } = useTranslation()
    const isActive = mode === 'on the'
    const [whichIndexInput, setWhichIndexInput] = React.useState<IndexPath>(new IndexPath(0))
    const [dayIndexInput, setDayIndexInput] = React.useState<IndexPath>(new IndexPath(0))
    const NUMERALS = ['First', 'Second', 'Third', 'Fourth', 'Last']

    const handleWhichIndexSelect = (val: IndexPath) => {
        setWhichIndexInput(val as IndexPath)
        handleChange({
            target: { name: 'repeat.monthly.onThe.which', value: `${NUMERALS[val.row]}` }
        })
    }
    const handleDayIndexSelect = (val: IndexPath) => {
        setDayIndexInput(val as IndexPath)
        handleChange({
            target: { name: 'repeat.monthly.onThe.day', value: DAYS[val.row] }
        })
    }
    return (
        <View style={styles.container}>
            {hasMoreModes && (
                <Radio
                    style={styles.radio}
                    checked={isActive}
                    onChange={() => handleChange({ target: { name: 'repeat.monthly.mode', value: 'on the' } })}
                >
                    <Text>{t('onThe')}</Text>
                </Radio>
            )}
            <Select
                style={{ width: screenWidth * 0.2 }}
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
                style={{ width: screenWidth * 0.25, marginLeft: 4 }}
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
        </View>
    )
}

export default RepeatMonthlyOnThe

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'flex-start'
    },
    radio: {
        width: screenWidth * 0.2
    }
})
