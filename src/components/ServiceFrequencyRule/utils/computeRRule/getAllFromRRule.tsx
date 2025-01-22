import { RRule } from 'rrule'

export const getAllFromRRule = (rRule: string) => {
    const rruleFromString = RRule.fromString(rRule)
    const all = new RRule({ ...rruleFromString.options }).all()
    return all
}
