import { firebase } from '@react-native-firebase/database'
import { getOrSetSingleValueData, getSingleValueData, storeSingleValueData } from '../async_storage/AsyncStorage'
import moment from 'moment'
import Logger from '../logger/logger'
import { getAuth } from '@react-native-firebase/auth'
import { GoogleSignin } from '@react-native-google-signin/google-signin'
import { CustomShowToast } from '../../../components/Toast/ToastComponent'
import { SubscriptionsRecord } from '../../interfaces/Subscription'

export const firebaseRealtime = firebase
    .app()
    .database('https://subscription-monitor-a0000-default-rtdb.europe-west1.firebasedatabase.app/')

export const canUpload = async (): Promise<boolean> => {
    const now = moment()
    const lastUploadTimeStr = await getOrSetSingleValueData('lastUploadTime', now.days(-7).toISOString())
    const lastUploadTime = moment(lastUploadTimeStr)
    const nextUploadTime = lastUploadTime.clone().add(24, 'hours')
    const allowedNextUploadTime = nextUploadTime.clone().add(1, 'day').startOf('day')
    const now2 = moment()
    Logger.info('canUpload', `Next upload available at: ${allowedNextUploadTime.format('D MMMM HH:mm')}`)

    return now2.isAfter(allowedNextUploadTime)
}

// Example usage in the save function
export const saveSubscriptionsToCloud = async (subscriptions: any) => {
    if (Object.keys(subscriptions).length === 0) {
        Logger.warn('saveSubscriptionsToCloud', 'No subscriptions to save')
        CustomShowToast('error', 'No subscriptions to save!')
        return null
    }
    // Check if upload is allowed
    const isUploadAllowed = await canUpload()

    if (!isUploadAllowed) {
        const nextUploadTime = moment(await getSingleValueData('lastUploadTime'))
            .clone()
            .add(24, 'hours')
            .add(1, 'day')
            .startOf('day')

        Logger.info('saveSubscriptionsToCloud', `Next upload available at: ${nextUploadTime.format('D MMMM HH:mm')}`)
        return false // Return or handle the case where upload is not allowed
    }

    // Save the current time as the new last upload time
    const now = moment()
    await storeSingleValueData('lastUploadTime', now.toISOString())

    // Retrieve the user ID from Firebase authentication
    const userID = firebase.auth().currentUser?.uid

    const userRef = firebaseRealtime.ref(`/users/${userID}/subscriptions_data`)

    try {
        await userRef.set({
            lastUpdated: now.toISOString(),
            subscriptions: subscriptions
        })
        return true
    } catch (e) {
        Logger.error('saveSubscriptionsToCloud', 'Error saving subscriptions to cloud', e)
    }
}

export const getSubscriptionsFromCloud = async (): Promise<SubscriptionsRecord | null> => {
    try {
        const userID = firebase.auth().currentUser?.uid
        if (!userID) {
            Logger.warn('getSubscriptionsFromCloud', 'User is not authenticated')
            return null
        }

        // Retrieve data from Firebase Realtime Database
        const userRef = firebaseRealtime.ref(`/users/${userID}/subscriptions_data/subscriptions`)
        const snapshot = await userRef.once('value')

        // Export and return the data
        return snapshot.val()
    } catch (e) {
        Logger.error('getSubscriptionsFromCloud', 'Error retrieving subscriptions from cloud:', e)
        return null // Return null or handle the error as needed
    }
}

export const deleteUserDataFromCloud = async () => {
    try {
        const userID = firebase.auth().currentUser?.uid
        if (!userID) {
            Logger.warn('deleteUserDataFromCloud', 'User is not authenticated')
            return null
        }

        const userRef = firebaseRealtime.ref(`/users/${userID}/data`)
        await userRef.remove()
    } catch (e) {
        Logger.error('deleteUserDataFromCloud', 'Error deleting subscriptions from cloud:', e)
        return null // Return null or handle the error as needed
    }
}

export const deleteAccountFromCloud = async () => {
    try {
        const auth = getAuth()
        const userID = auth.currentUser
        if (!userID) {
            Logger.warn('deleteAccountFromCloud', 'User is not authenticated')
            return null
        }

        const userRef = firebaseRealtime.ref(`/users/${userID?.uid}`)
        await userRef.remove()
        await userID.delete()
        await auth.signOut()
        await GoogleSignin.revokeAccess()

        Logger.warn('deleteAccountFromCloud', 'User deleted from cloud')
    } catch (e) {
        Logger.error('deleteAccountFromCloud', 'Error deleting account from cloud:', e)
        return null
    }
}
