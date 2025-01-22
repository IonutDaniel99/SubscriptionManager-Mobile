import React from 'react'
import { Divider } from '@ui-kitten/components'
import { View } from 'react-native'
import Repeat from './components/Repeat/Repeat'
import { ConfigData, HandleRRULEObject } from './types/IRepeatProps'
import Start from './components/Start/Start'
import End from './components/End/End'

interface IServiceLogoAndName {
    data: ConfigData
    isEditMode: boolean
    // eslint-disable-next-line no-unused-vars
    handleChange: (event: HandleRRULEObject) => void
}
export default function ServiceFrequencyRule({ data, isEditMode, handleChange }: IServiceLogoAndName) {
    return (
        <View className="flex gap-2 px-2 mt-2">
            <Start daily={data.start} isEditMode={isEditMode} handleChange={handleChange} />
            <Divider />
            <Repeat repeat={data.repeat} isEditMode={isEditMode} handleChange={handleChange} />
            <Divider />
            <End end={data.end} isEditMode={isEditMode} handleChange={handleChange} />
        </View>
    )
}
