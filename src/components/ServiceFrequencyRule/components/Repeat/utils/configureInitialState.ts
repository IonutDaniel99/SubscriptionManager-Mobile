import { isEmpty, uniqueId } from 'lodash'
import moment from 'moment'
import { DATE_TIME_FORMAT } from '../../../constants'
import {
    Config,
    ConfigData,
    ConfigureStateReturn,
    EndMode,
    Frequency,
    MonthlyMode,
    YearlyMode
} from '../../../types/IRepeatProps'
import computeRRule from '../../../utils/computeRRule/toString/computeRRule'

const configureState = (config: Config = {}, id?: string): ConfigureStateReturn => {
    const configureFrequency = (): Frequency => (config.repeat ? config.repeat[0] : 'Yearly')
    const configureYearly = (): YearlyMode => config.yearly || 'on'
    const configureMonthly = (): MonthlyMode => config.monthly || 'on'
    const configureEnd = (): EndMode => (config.end ? config.end[0] : 'Never')
    const configureHideStart = (): boolean => (typeof config.hideStart === 'undefined' ? true : config.hideStart)
    const uniqueRruleId = isEmpty(id) ? uniqueId('rrule-') : id

    const data: ConfigData = {
        start: {
            onDate: {
                date: moment().format(DATE_TIME_FORMAT),
                options: {
                    weekStartsOnSunday: config.weekStartsOnSunday
                }
            }
        },
        repeat: {
            frequency: configureFrequency(),
            yearly: {
                mode: configureYearly(),
                on: {
                    month: 'Jan',
                    day: 1
                },
                onThe: {
                    month: 'Jan',
                    day: 'Monday',
                    which: 'First'
                },
                options: {
                    modes: config.yearly
                }
            },
            monthly: {
                mode: configureMonthly(),
                interval: 1,
                on: {
                    day: 1
                },
                onThe: {
                    day: 'Monday',
                    which: 'First'
                },
                options: {
                    modes: config.monthly
                }
            },
            weekly: {
                interval: 1,
                days: {
                    mon: false,
                    tue: false,
                    wed: false,
                    thu: false,
                    fri: false,
                    sat: false,
                    sun: false
                },
                options: {
                    weekStartsOnSunday: config.weekStartsOnSunday
                }
            },
            daily: {
                interval: 1
            },
            hourly: {
                interval: 1
            },
            options: {
                frequency: config.repeat
            }
        },
        end: {
            mode: configureEnd(),
            after: 1,
            onDate: {
                date: moment().format(DATE_TIME_FORMAT),
                options: {
                    weekStartsOnSunday: config.weekStartsOnSunday
                }
            },
            options: {
                modes: config.end
            }
        },
        options: {
            hideStart: configureHideStart(),
            hideEnd: config.hideEnd,
            hideError: config.hideError,
            weekStartsOnSunday: config.weekStartsOnSunday
        },
        error: null
    }

    return {
        id: uniqueRruleId,
        data,
        rrule: computeRRule(data) // Replace this with your rrule logic
    }
}

export default configureState
