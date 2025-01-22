import moment from 'moment'

const computeEnd = ({ mode, after, onDate: { date } }) => {
    const end = {}

    if (mode === 'Never') {
        end.count = 50
    }
    if (mode === 'After') {
        end.count = after
    }
    if (mode === 'On date') {
        end.until = moment.utc(date).set({ hour: 12, minute: 0, second: 0 }).toDate()
    }

    return end
}

export default computeEnd
