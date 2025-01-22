import React, { useEffect, useState } from 'react'
import { Datepicker, Icon, IconElement, IconProps } from '@ui-kitten/components'
import { StyleSheet, View } from 'react-native'
import { useTranslation } from 'react-i18next'
import { DateOptions, HandleRRULEObject } from '../../types/IRepeatProps'
import moment from 'moment'
import { DATE_TIME_FORMAT } from '../../constants'
import { useAtom } from 'jotai'
import { addOneDayAndSetToNoon } from '../../../../common/utils/time_date/time_date_utils'
import { currentBottomDateAtom } from '../../../../common/atoms/useSubscriptionsAtom'
import { formatDatePickerService } from '../../utils/formatDatePickerServices'

type StartProps = {
    daily: {
        onDate: DateOptions
    }
    isEditMode: boolean
    // eslint-disable-next-line no-unused-vars
    handleChange: (value: HandleRRULEObject) => void
}

const CalendarIcon = (props: IconProps): IconElement => <Icon {...props} name="calendar" />

export default function Start({
    daily: {
        onDate: { date }
    },
    isEditMode,
    handleChange
}: StartProps) {
    const { t } = useTranslation()
    const [currentBottomDate] = useAtom(currentBottomDateAtom)
    const formatDateService = formatDatePickerService()
    const startWithFirstDayOfMonth = moment(currentBottomDate).startOf('month').toDate()
    const [localDate, setLocalDate] = useState<Date>(startWithFirstDayOfMonth)

    const yesterday = new Date(2000, 1, 1)
    const tomorrow = new Date(2050, 11, 31)

    useEffect(() => {
        if (isEditMode) {
            const todayDate = moment(date).toDate()
            const selectedDate = moment(addOneDayAndSetToNoon(todayDate)).toDate()
            const editedEvent = {
                target: {
                    value: moment(selectedDate).format(DATE_TIME_FORMAT),
                    name: 'start.onDate.date'
                }
            }
            handleChange(editedEvent)
        } else {
            const editedEvent = {
                target: {
                    value: moment(startWithFirstDayOfMonth).format(DATE_TIME_FORMAT),
                    name: 'start.onDate.date'
                }
            }

            handleChange(editedEvent)
        }
    }, [])

    return (
        <View className="flex-row py-2">
            <Datepicker
                label={t('startDate')}
                style={styles.picker}
                placeholder={t('startDate')}
                dateService={formatDateService}
                date={localDate}
                min={yesterday}
                max={tomorrow}
                onSelect={(value) => {
                    const selectedDate = moment(addOneDayAndSetToNoon(value)).toDate()
                    setLocalDate(selectedDate)

                    const editedEvent = {
                        target: {
                            value: moment(selectedDate).format(DATE_TIME_FORMAT),
                            name: 'start.onDate.date'
                        }
                    }

                    handleChange(editedEvent) // Trigger handleChange
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
