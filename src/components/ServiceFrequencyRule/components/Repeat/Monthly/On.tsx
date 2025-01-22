import React from 'react'

import { IndexPath, Radio, Select, SelectItem, Text } from '@ui-kitten/components'
import { Dimensions, StyleSheet, View } from 'react-native'
import { HandleRRULEObject } from '../../../types/IRepeatProps'
import { useTranslation } from 'react-i18next'

const screenWidth = Dimensions.get('window').width

type RepeatMonthlyOnProps = {
    mode: 'on' | 'on the'
    on: {
        day: number
    }
    hasMoreModes: boolean
    // eslint-disable-next-line no-unused-vars
    handleChange: (value: HandleRRULEObject) => void
}

const RepeatMonthlyOn = ({ mode, on, hasMoreModes, handleChange }: RepeatMonthlyOnProps) => {
    const { t } = useTranslation()
    const isActive = mode === 'on'
    const [monthIndexInput, setMonthIndexInput] = React.useState<IndexPath>(new IndexPath(on.day - 1))

    const handleMonthIndexSelect = (val: IndexPath) => {
        setMonthIndexInput(val as IndexPath)
        handleChange({
            target: { name: 'repeat.monthly.on.day', value: val.row + 1 }
        })
    }

    return (
        <View style={styles.container}>
            {hasMoreModes && (
                <Radio
                    style={styles.radio}
                    checked={isActive}
                    onChange={() => handleChange({ target: { name: 'repeat.monthly.mode', value: 'on' } })}
                >
                    <Text>{t('onDay')}</Text>
                </Radio>
            )}
            <Select
                style={styles.select}
                selectedIndex={monthIndexInput}
                disabled={!isActive}
                value={monthIndexInput.row + 1}
                accessoryRight={() => <></>}
                onSelect={(val) => handleMonthIndexSelect(val as IndexPath)}
            >
                {[...new Array(31)].map((day, i) => (
                    <SelectItem key={i} title={i + 1} />
                ))}
            </Select>
        </View>
    )
}

export default RepeatMonthlyOn

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        paddingVertical: 10
    },
    radio: {
        width: screenWidth * 0.19
    },
    select: {
        marginLeft: 4, // Optional: Add spacing between elements
        width: screenWidth * 0.2 // 30% of screen width
    }
})
