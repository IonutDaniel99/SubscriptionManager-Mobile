import { isNaN } from 'lodash'
import { HandleRRULEObject } from '../../../types/IRepeatProps'

const numericalFieldHandler = (name: string, value: string): HandleRRULEObject => {
    // Convert input from a string to a number
    const inputNumber = +value
    // Check if is a number and is less than 1000
    if (isNaN(inputNumber) || inputNumber >= 1000) return { target: { name: name, value: 1 } }

    const editedEvent: HandleRRULEObject = { target: { name: name, value: value.toString() } }
    return editedEvent
}

export default numericalFieldHandler
