import React from 'react'
import { View } from 'react-native'
import RepeatYearlyOnThe from './OnThe'
import RepeatYearlyOn from './On'
import { HandleRRULEObject } from '../../../types/IRepeatProps'

type RepeatYearlyProps = {
    isEditMode: boolean
    yearly: {
        mode: 'on' | 'on the'
        on: { month: string; day: number }
        onThe: {
            which: string
            month: string
            day: string
        }
        options: {
            modes?: 'on' | 'on the'
        }
    }
    // eslint-disable-next-line no-unused-vars
    handleChange: (event: HandleRRULEObject) => void
}

const RepeatYearly = ({ isEditMode, yearly: { mode, on, onThe, options }, handleChange }: RepeatYearlyProps) => {
    const isTheOnlyOneMode = (option: string) => options.modes === option
    const isOptionAvailable = (option: string) => !options.modes || isTheOnlyOneMode(option)
    return (
        <View>
            {isOptionAvailable('on') && (
                <RepeatYearlyOn
                    isEditMode={isEditMode}
                    mode={mode}
                    on={on}
                    hasMoreModes={!isTheOnlyOneMode('on')}
                    handleChange={handleChange}
                />
            )}
            {isOptionAvailable('on the') && (
                <RepeatYearlyOnThe
                    isEditMode={isEditMode}
                    mode={mode}
                    onThe={onThe}
                    hasMoreModes={!isTheOnlyOneMode('on the')}
                    handleChange={handleChange}
                />
            )}
        </View>
    )
}

export default RepeatYearly
