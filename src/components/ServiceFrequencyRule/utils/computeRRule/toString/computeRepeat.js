import computeYearly from './computeYearly'
import computeMonthly from './computeMonthly'
import computeWeekly from './computeWeekly'
import computeDaily from './computeDaily'

const computeRepeat = ({ frequency, yearly, monthly, weekly, daily }) => {
    switch (frequency) {
        case 'Yearly': {
            return computeYearly(yearly)
        }
        case 'Monthly': {
            return computeMonthly(monthly)
        }
        case 'Weekly': {
            return computeWeekly(weekly)
        }
        case 'Daily': {
            return computeDaily(daily)
        }
        default:
            return {}
    }
}

export default computeRepeat
