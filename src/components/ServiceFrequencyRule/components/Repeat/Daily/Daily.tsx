import React, { useState } from 'react'

import { Input, Text } from '@ui-kitten/components'
import { Dimensions, StyleSheet, View } from 'react-native'
import { DailyOptions, HandleRRULEObject } from '../../../types/IRepeatProps'
import numericalFieldHandler from '../utils/numericalFIeldHandler'
import { useTranslation } from 'react-i18next'
import { CustomShowToast } from '../../../../Toast/ToastComponent'

const screenWidth = Dimensions.get('window').width

type RepeatDailyProps = {
    daily: DailyOptions
    // eslint-disable-next-line no-unused-vars
    handleChange: (value: HandleRRULEObject) => void
}

const RepeatDaily = ({ daily, handleChange }: RepeatDailyProps) => {
    const { t } = useTranslation()
    const [value, setValue] = useState(daily.interval.toString())

    const handleValueChange = (val: string) => {
        if (!/^\d*$/.test(val)) {
            return CustomShowToast('error', t('onlyNumbersAllowed'))
        } else {
            setValue(val)
            handleChange(numericalFieldHandler('repeat.daily.interval', val))
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
                    onBlur={handleValueOnBlur}
                    onChangeText={(val) => handleValueChange(val)}
                />
                <Text style={styles.month}>{t('day')}</Text>
            </View>
        </View>
    )
}

export default RepeatDaily

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
