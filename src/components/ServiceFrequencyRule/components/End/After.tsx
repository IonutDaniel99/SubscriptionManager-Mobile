import { View, StyleSheet, Dimensions } from 'react-native'
import React, { useState } from 'react'
import numericalFieldHandler from '../Repeat/utils/numericalFIeldHandler'
import { Input, Text } from '@ui-kitten/components'
import { HandleRRULEObject } from '../../types/IRepeatProps'
import { useTranslation } from 'react-i18next'
import { CustomShowToast } from '../../../Toast/ToastComponent'

const screenWidth = Dimensions.get('window').width

interface IAfterProps {
    after: number
    // eslint-disable-next-line no-unused-vars
    handleChange: (event: HandleRRULEObject) => void
}

export default function After({ after, handleChange }: IAfterProps) {
    const { t } = useTranslation()
    const [value, setValue] = useState(after.toString())

    const handleValueOnBlur = () => {
        if (value === '') {
            handleValueChange('1')
        }
    }

    const handleValueChange = (val: string) => {
        if (!/^\d*$/.test(val)) {
            return CustomShowToast('error', t('onlyNumbersAllowed'))
        } else {
            setValue(val)
            handleChange(numericalFieldHandler('end.after', val))
        }
    }

    return (
        <View className="px-2">
            <View style={styles.everyInput}>
                <Text style={styles.every}>{t('every')}</Text>
                <Input
                    style={styles.input}
                    placeholder={t('number')}
                    value={value}
                    onBlur={handleValueOnBlur}
                    onChangeText={(val) => handleValueChange(val)}
                />
                <Text style={styles.month}>{t('executions')}</Text>
            </View>
        </View>
    )
}

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
