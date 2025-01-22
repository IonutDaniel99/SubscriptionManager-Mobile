export type IRepeatProps = {
    repeat: RepeatOptions
    // eslint-disable-next-line no-unused-vars
    handleChange: (event: HandleRRULEObject) => void
}

export interface HandleRRULEObject {
    target: {
        name: string
        value: string | number | boolean
    }
}

export type Frequency = 'Yearly' | 'Monthly' | 'Weekly' | 'Daily'
export type WhichDay = 'First' | 'Second' | 'Third' | 'Fourth' | 'Last'
export type DayOfWeek = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday'
export type Month = 'Jan' | 'Feb' | 'Mar' | 'Apr' | 'May' | 'Jun' | 'Jul' | 'Aug' | 'Sep' | 'Oct' | 'Nov' | 'Dec'
export type EndMode = 'Never' | 'After' | 'On Date'
export type YearlyMode = 'on' | 'on the'
export type MonthlyMode = 'on' | 'on the'

export interface StartOptions {
    weekStartsOnSunday?: boolean
}

export interface DateOptions {
    date: string
    options: StartOptions
}

export interface YearlyOptions {
    mode: YearlyMode
    on: {
        month: Month
        day: number
    }
    onThe: {
        month: Month
        day: DayOfWeek
        which: WhichDay
    }
    options: {
        modes?: YearlyMode
    }
}

export interface MonthlyOptions {
    mode: MonthlyMode
    interval: number
    on: {
        day: number
    }
    onThe: {
        day: DayOfWeek
        which: WhichDay
    }
    options: {
        modes?: MonthlyMode
    }
}

export interface WeeklyOptions {
    interval: number
    days: {
        mon: boolean
        tue: boolean
        wed: boolean
        thu: boolean
        fri: boolean
        sat: boolean
        sun: boolean
    }
    options: {
        weekStartsOnSunday?: boolean
    }
}

export interface DailyOptions {
    interval: number
}

export interface HourlyOptions {
    interval: number
}

export interface RepeatOptions {
    frequency: Frequency
    yearly: YearlyOptions
    monthly: MonthlyOptions
    weekly: WeeklyOptions
    daily: DailyOptions
    hourly: HourlyOptions
    options: {
        frequency?: Frequency[]
    }
}

export interface EndOptions {
    mode: EndMode
    after: number
    onDate: DateOptions
    options: {
        modes?: EndMode[]
    }
}

export interface ConfigureStateOptions {
    hideStart: boolean
    hideEnd?: boolean
    hideError?: boolean
    weekStartsOnSunday?: boolean
}

export interface ConfigData {
    start: {
        onDate: DateOptions
    }
    repeat: RepeatOptions
    end: EndOptions
    options: ConfigureStateOptions
    error: any
}

export interface Config {
    repeat?: Frequency[]
    yearly?: YearlyMode
    monthly?: MonthlyMode
    end?: EndMode[]
    hideStart?: boolean
    hideEnd?: boolean
    hideError?: boolean
    weekStartsOnSunday?: boolean
}

export interface ConfigureStateReturn {
    id?: string
    data: ConfigData
    rrule: string
}
