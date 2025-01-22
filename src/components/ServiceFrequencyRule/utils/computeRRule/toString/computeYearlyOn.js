import { MONTHS } from '../../../constants'

const computeYearlyOn = (on) => {
    return {
        bymonth: MONTHS.indexOf(on.month) + 1,
        bymonthday: on.day
    }
}

export default computeYearlyOn
