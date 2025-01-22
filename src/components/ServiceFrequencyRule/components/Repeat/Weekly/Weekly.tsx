import React, { useState } from 'react'
import { capitalize, toPairs } from 'lodash'

import { CheckBox, Input, Text } from '@ui-kitten/components'
import { Dimensions, StyleSheet, View } from 'react-native'
import { HandleRRULEObject, WeeklyOptions } from '../../../types/IRepeatProps'
import numericalFieldHandler from '../utils/numericalFIeldHandler'
import { useTranslation } from 'react-i18next'
import { CustomShowToast } from '../../../../Toast/ToastComponent'

const screenWidth = Dimensions.get('window').width

type RepeatWeeklyProps = {
    weekly: WeeklyOptions
    // eslint-disable-next-line no-unused-vars
    handleChange: (value: HandleRRULEObject) => void
}

const RepeatWeekly = ({ weekly, handleChange }: RepeatWeeklyProps) => {
    const { t } = useTranslation()

    let daysArray = toPairs(weekly.days)
    if (weekly.options.weekStartsOnSunday) {
        daysArray = daysArray.slice(-1).concat(daysArray.slice(0, -1))
    }

    const [value, setValue] = useState(weekly.interval.toString())

    const handleValueChange = (val: string) => {
        if (!/^\d*$/.test(val)) {
            return CustomShowToast('error', t('onlyNumbersAllowed'))
        } else {
            setValue(val)
            handleChange(numericalFieldHandler('repeat.weekly.interval', val))
        }
    }

    const handleValueOnBlur = () => {
        if (value === '') {
            handleValueChange('1')
        }
    }

    const handleButtonPress = (dayName: string, isDayActive: boolean) => {
        const editedEvent = {
            target: {
                value: !isDayActive,
                name: `repeat.weekly.days[${dayName}]`
            }
        }

        handleChange(editedEvent)
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
                <Text style={styles.month}>{t('week')}</Text>
            </View>
            <View className="flex-row items-center justify-around py-3">
                {daysArray.map(([dayName, isDayActive]) => {
                    return (
                        <View key={dayName} className="flex-col items-center justify-between pt-2">
                            <Text category="s1">{capitalize(t(dayName.toLowerCase()))}</Text>
                            <CheckBox onChange={() => handleButtonPress(dayName, isDayActive)} checked={isDayActive} />
                        </View>
                    )
                })}
            </View>
        </View>
    )
}

export default RepeatWeekly

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
