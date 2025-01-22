import { useState, useEffect, useCallback } from 'react'
import { useAtom, useSetAtom } from 'jotai'
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth'
import { currentUserAtom, isUserPremiumAtom } from '../common/atoms/useCurrentUserAtom'
import { CustomShowToast } from '../components/Toast/ToastComponent'
import { firebaseRealtime } from '../common/utils/firebase_realtime/firebase_realtime'
import { GoogleSignin } from '@react-native-google-signin/google-signin'
import { useTranslation } from 'react-i18next'
import Logger from '../common/utils/logger/logger'
import { getAvailablePurchases } from 'react-native-iap'
import { google_play_iap_skus } from '../common/utils/sku'

const useSession = () => {
    const { t } = useTranslation()
    const [user, setUser] = useAtom(currentUserAtom)
    const setIsPremium = useSetAtom(isUserPremiumAtom)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const subscriber = auth().onAuthStateChanged(async (user: FirebaseAuthTypes.User | null) => {
            setIsLoading(true)
            setError(null)
            if (!user) {
                setUser(null)
                setIsLoading(false)
                return
            }

            try {
                const userSnapshot = await firebaseRealtime.ref(`/users/${user.uid}`).once('value')

                if (userSnapshot.exists()) {
                    const userDetails = userSnapshot.val()
                    setUser(userDetails)
                } else {
                    setError('User data not found')
                }
            } catch (err) {
                console.error('Error fetching user data:', err)
                setError('Failed to fetch user data. Please try again later.')
            } finally {
                setIsLoading(false)
            }
        })

        const getPurchase = async () => {
            try {
                const result = await getAvailablePurchases()
                const hasPurchased = result.find((product) => product.productId === google_play_iap_skus.productSkus[0])
                Logger.info('hasPurchased', String(!!hasPurchased))
                if (hasPurchased) {
                    setIsPremium(true)
                } else {
                    setIsPremium(false)
                }
            } catch (error) {
                Logger.error('useSession', 'Error occurred while fetching purchases', error)
            }
        }
        getPurchase()

        return () => subscriber()
    }, [])

    // Function to handle user sign out
    const removeUser = async () => {
        try {
            await auth().signOut()
            await GoogleSignin.revokeAccess()
            setUser(null)
            CustomShowToast('info', t('loggedOut'))
            Logger.info('removeUser', 'User signed out successfully')
        } catch (error) {
            Logger.error('removeUser', 'Error signing out:', error)
            setError('Failed to sign out')
        }
    }

    return { user, isLoading, error, removeUser }
}

export default useSession

