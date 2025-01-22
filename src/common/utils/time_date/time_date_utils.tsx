export const addOneDayAndSetToNoon = (input: string | Date): string => {
    const date = typeof input === 'string' ? new Date(input) : input

    // Add one day in UTC correctly
    const newDate = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() + 1, 12, 0, 0, 0))
    return newDate.toISOString()
}

export const hasSameMonthAndYear = (date1: Date, date2: Date): boolean => {
    return date1.getMonth() === date2.getMonth() && date1.getFullYear() === date2.getFullYear()
}
