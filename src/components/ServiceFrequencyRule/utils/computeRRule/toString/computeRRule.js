import computeRepeat from './computeRepeat'
import computeEnd from './computeEnd'
import computeOptions from './computeOptions'
import { RRule } from 'rrule'
import computeStart from './computeStart'

const computeRRuleToString = ({ start, repeat, end, options }) => {
    const rruleObject = {
        ...computeStart(start),
        ...computeRepeat(repeat),
        ...computeEnd(end),
        ...computeOptions(options)
    }
    const rrule = new RRule(rruleObject)
    return rrule.toString()
}

export default computeRRuleToString
