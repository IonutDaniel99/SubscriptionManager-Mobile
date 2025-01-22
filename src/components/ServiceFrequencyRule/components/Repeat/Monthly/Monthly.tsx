import React from 'react'
import { Dimensions, StyleSheet, View } from 'react-native'
import { HandleRRULEObject, MonthlyOptions } from '../../../types/IRepeatProps'
import { Input, Text } from '@ui-kitten/components'
import { useState } from 'react'
import numericalFieldHandler from '../utils/numericalFIeldHandler'
import RepeatMonthlyOn from './On'
import RepeatMonthlyOnThe from './OnThe'
import { useTranslation } from 'react-i18next'
import { CustomShowToast } from '../../../../Toast/ToastComponent'

type RepeatMonthlyProps = {
    monthly: MonthlyOptions
    // eslint-disable-next-line no-unused-vars
    handleChange: (value: HandleRRULEObject) => void
}

const screenWidth = Dimensions.get('window').width

const RepeatMonthly = ({ monthly: { mode, interval, on, onThe, options }, handleChange }: RepeatMonthlyProps) => {
    const { t } = useTranslation()

    const isTheOnlyOneMode = (option: string) => options.modes === option
    const isOptionAvailable = (option: string) => !options.modes || isTheOnlyOneMode(option)

    const [value, setValue] = useState(interval.toString())

    const handleValueChange = (val: string) => {
        if (!/^\d*$/.test(val)) {
            return CustomShowToast('error', t('onlyNumbersAllowed'))
        } else {
            setValue(val)
            handleChange(numericalFieldHandler('repeat.monthly.interval', val))
        }
    }
    const handleValueOnBlur = () => {
        if (value === '') {
            handleValueChange('1')
        }
    }

    return (
        <View>
            <View style={styles.everyInput}>
                <Text style={styles.every}>{t('every')}</Text>
                <Input
                    style={styles.input}
                    placeholder={t('number')}
                    value={value}
                    onBlur={() => handleValueOnBlur()}
                    onChangeText={(val) => handleValueChange(val)}
                />
                <Text style={styles.month}>{t('month')}</Text>
            </View>
            {isOptionAvailable('on') && (
                <RepeatMonthlyOn
                    mode={mode}
                    on={on}
                    hasMoreModes={!isTheOnlyOneMode('on')}
                    handleChange={handleChange}
                />
            )}
            {isOptionAvailable('on the') && (
                <RepeatMonthlyOnThe
                    mode={mode}
                    onThe={onThe}
                    hasMoreModes={!isTheOnlyOneMode('on the')}
                    handleChange={handleChange}
                />
            )}
        </View>
    )
}

export default RepeatMonthly

const styles = StyleSheet.create({
    every: {
        width: screenWidth * 0.2
    },
    everyInput: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'flex-start'
    },
    input: {
        width: screenWidth * 0.2
    },
    month: {
        paddingLeft: 10
    }
})
