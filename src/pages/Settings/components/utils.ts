import { RRule } from 'rrule'
import { Subscription, SubscriptionData } from '../../../common/interfaces/Subscription'

export const NOTIFICATIONS_INIT_OBJECT = {
    reminder3Days: {
        isEnabled: false,
        notificationId: null
    },
    dailyUsage: {
        isEnabled: false,
        notificationId: null
    },
    weeklyUsage: {
        isEnabled: false,
        notificationId: null
    },
    otherNotifications: {
        isEnabled: false,
        notificationId: null
    }
}

export function isValidSubscriptionData(data: SubscriptionData): data is SubscriptionData {
    return (
        typeof data === 'object' &&
        data !== null &&
        typeof data.name === 'string' &&
        data.name.length <= 30 &&
        (typeof data.price === 'number' || typeof data.price === 'string') &&
        typeof data.logo === 'string'
    )
}

export function isValidSubscription(data: Subscription): data is Subscription {
    return (
        typeof data === 'object' &&
        data !== null &&
        checkForRRule(data.rrule) &&
        typeof data.subscriptionID === 'string' &&
        data.subscriptionID.startsWith('subs-') &&
        data.subscriptionData !== undefined &&
        isValidSubscriptionData(data.subscriptionData)
    )
}

export function isValidSubscriptions(data: any): boolean {
    if (typeof data !== 'object' || data === null) {
        return false
    }

    // Check if the data is a collection of Subscriptions
    for (const key in data) {
        if (!isValidSubscription(data[key])) {
            return false
        }
    }

    return true
}

function checkForRRule(str: string): boolean {
    if (typeof str !== 'string') {
        return false
    }
    try {
        RRule.fromString(str)
        return true
    } catch (error) {
        return false
    }
}
