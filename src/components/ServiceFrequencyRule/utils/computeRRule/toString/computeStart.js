import moment from 'moment'

const computeStart = ({ onDate: { date } }) => {
    if (!moment.isMoment(moment(date))) {
        date = new Date().setMilliseconds(0)
    }
    return {
        dtstart: moment.utc(date).set({ hour: 12, minute: 0, second: 0 }).toDate()
    }
}

export default computeStart
