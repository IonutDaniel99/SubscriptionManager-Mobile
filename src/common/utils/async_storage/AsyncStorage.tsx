import subscriptionEmitter from '../../emiters/subscriptionsEmitter'
import AsyncStorage from '@react-native-async-storage/async-storage'
// eslint-disable-next-line react-native/split-platform-components
import { ToastAndroid } from 'react-native'
import { Subscription } from '../../interfaces/Subscription'
import Logger from '../logger/logger'
import { CustomShowToast } from '../../../components/Toast/ToastComponent'

export const storeSingleValueData = async (key: string, value: any) => {
    try {
        await AsyncStorage.setItem(key, value)
    } catch (e: any) {
        Logger.error('storeSingleValueData', 'Error storing data:', e)
        CustomShowToast('error', 'An error occured!')
    }
}

export const storeObjectValueData = async (key: string, value: any) => {
    try {
        const jsonValue = JSON.stringify(value)
        await AsyncStorage.setItem(key, jsonValue)
    } catch (e: any) {
        Logger.error('storeObjectValueData', 'Error storing data:', e)
        CustomShowToast('error', 'An error occured!')
    }
}

export const getSingleValueData = async (key: string) => {
    try {
        const value = await AsyncStorage.getItem(key)
        if (value !== null) {
            return value
        }
        return null
    } catch (e: any) {
        Logger.error('getSingleValueData', 'Error fetching data:', e)
        CustomShowToast('error', 'An error occured!')
    }
}

export const getObjectValueData = async (key: string) => {
    try {
        const jsonValue = await AsyncStorage.getItem(key)
        return jsonValue != null ? JSON.parse(jsonValue) : null
    } catch (e: any) {
        Logger.error('getObjectValueData', 'Error fetching data:', e)
        CustomShowToast('error', 'An error occured!')
    }
}

export const getOrSetSingleValueData = async (key: string, defaultValue: string) => {
    try {
        const value = await AsyncStorage.getItem(key)
        if (value !== null) {
            return value
        } else {
            await AsyncStorage.setItem(key, defaultValue)
            return defaultValue
        }
    } catch (e: any) {
        Logger.error('getOrSetSingleValueData', 'Error fetching data:', e)
        return defaultValue
    }
}

export const getOrSetObjectData = async (key: string, defaultValue: any) => {
    try {
        const value = await AsyncStorage.getItem(key)
        if (value !== null) {
            return JSON.parse(value)
        } else {
            const defaultValueString = JSON.stringify(defaultValue)
            await AsyncStorage.setItem(key, defaultValueString)
            return defaultValue
        }
    } catch (e: any) {
        Logger.error('getOrSetObjectData', 'Error fetching data:', e)
        return defaultValue
    }
}

// Get all subscriptions
export const getSubscriptions = async (): Promise<Record<string, any>> => {
    try {
        const jsonValue = await AsyncStorage.getItem('subscriptions')
        return jsonValue != null ? JSON.parse(jsonValue) : {}
    } catch (e: any) {
        Logger.error('getSubscriptions', 'Error fetching subscriptions:`, e')
        return {}
    }
}

export const getSubscriptionById = async (id: string): Promise<Subscription | null> => {
    try {
        const jsonValue = await AsyncStorage.getItem('subscriptions')
        if (jsonValue === null) {
            return null
        }

        const subscriptions: Record<string, Subscription> = JSON.parse(jsonValue)
        const subscription = subscriptions[id] || null

        return subscription
    } catch (e: any) {
        Logger.error('getSubscriptionById', 'Error fetching subscription:', e)
        return null
    }
}

// Save or update a subscription
export const importSubscriptions = async (subscription: any) => {
    try {
        await AsyncStorage.setItem('subscriptions', JSON.stringify(subscription))
        subscriptionEmitter.emit('update')
        Logger.info('importSubscriptions', 'Subscriptions imported successfully!')
    } catch (e: any) {
        Logger.error('importSubscriptions', 'Error importing subscriptions:', e)
    }
}

// Save or update a subscription
export const storeSubscription = async (id: string, subscription: any) => {
    try {
        const subscriptions = await getSubscriptions()
        subscriptions[id] = subscription
        await AsyncStorage.setItem('subscriptions', JSON.stringify(subscriptions))
        subscriptionEmitter.emit('update')
        Logger.info('storeSubscription', 'Subscription stored:', id)
    } catch (e: any) {
        Logger.error('storeSubscription', 'Error storing subscription:', e)
    }
}

// Edit an existing subscription
export const editSubscription = async (id: string, updatedData: any) => {
    try {
        const subscriptions = await getSubscriptions()
        if (subscriptions[id]) {
            subscriptions[id] = {
                ...subscriptions[id],
                ...updatedData
            }
            await AsyncStorage.setItem('subscriptions', JSON.stringify(subscriptions))
        } else {
            ToastAndroid.show('Subscription not found', ToastAndroid.SHORT)
            Logger.warn('editSubscription', 'Subscription not found:', id)
        }
    } catch (e: any) {
        Logger.error('editSubscription', 'Error editing subscription:', e)
    }
}

// Delete a subscription by its id
export const deleteSubscription = async (id: string) => {
    try {
        const subscriptions = await getSubscriptions()
        if (subscriptions[id]) {
            delete subscriptions[id]
            await AsyncStorage.setItem('subscriptions', JSON.stringify(subscriptions))
            subscriptionEmitter.emit('update')
            Logger.info('deleteSubscription', 'Subscription deleted:', id)
        } else {
            ToastAndroid.show('Subscription not found', ToastAndroid.SHORT)
            Logger.warn('deleteSubscription', 'Subscription not found:', id)
        }
    } catch (e: any) {
        Logger.error('deleteSubscription', 'Error deleting subscription:', e)
    }
}

// Clear all subscriptions
export const clearAllSubscriptions = async () => {
    try {
        await AsyncStorage.removeItem('subscriptions')
        subscriptionEmitter.emit('update')
    } catch (e: any) {
        CustomShowToast('error', 'An error occured!')
        Logger.error('clearAllSubscriptions', 'Error clearing subscriptions:', e)
    }
}

export const logCurrentStorage = async () => {
    try {
        const keys = await AsyncStorage.getAllKeys()
        const stores = await AsyncStorage.multiGet(keys)
        stores.forEach((store) => {
            const key = store[0]
            const value = store[1]

            try {
                const parsedValue = JSON.parse(value || '{}') // Try to parse the value
                console.log({ [key]: parsedValue })
            } catch (e) {
                console.log({ [key]: value }) // If it's not JSON, log it as-is
            }
        })
    } catch (error) {
        console.error('Error fetching data from AsyncStorage:', error)
    }
}
