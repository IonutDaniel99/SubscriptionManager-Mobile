import { View, StyleSheet } from 'react-native'
import React from 'react'
import { DateOptions, HandleRRULEObject } from '../../types/IRepeatProps'
import { Datepicker, Icon, IconElement, IconProps } from '@ui-kitten/components'
import { addOneDayAndSetToNoon } from '../../../../common/utils/time_date/time_date_utils'
import moment from 'moment'
import { DATE_TIME_FORMAT } from '../../constants'
import { useTranslation } from 'react-i18next'
import { formatDatePickerService } from '../../utils/formatDatePickerServices'

interface IRepeatProps {
    onDate: DateOptions
    // eslint-disable-next-line no-unused-vars
    handleChange: (event: HandleRRULEObject) => void
}

const CalendarIcon = (props: IconProps): IconElement => <Icon {...props} name="calendar" />

export default function OnDate({ onDate: { date }, handleChange }: IRepeatProps) {
    const { t } = useTranslation()
    const [endDate, setEndDate] = React.useState(new Date(date))
    const formatDateService = formatDatePickerService()
    const yesterday = new Date(2000, 1, 1)
    const tomorrow = new Date(2050, 11, 31)

    return (
        <View className="flex-row">
            <Datepicker
                label={t('endDate')}
                style={styles.picker}
                placeholder={t('endDate')}
                date={endDate}
                dateService={formatDateService}
                min={yesterday}
                max={tomorrow}
                onSelect={(value) => {
                    setEndDate(value)
                    const editedEvent = {
                        target: {
                            value: moment(addOneDayAndSetToNoon(value)).format(DATE_TIME_FORMAT),
                            name: 'end.onDate.date'
                        }
                    }

                    handleChange(editedEvent)
                }}
                accessoryRight={CalendarIcon}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    picker: {
        flex: 1,
        marginHorizontal: 2
    }
})
