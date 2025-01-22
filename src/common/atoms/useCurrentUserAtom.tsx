import { atom } from 'jotai'
import { IFirebaseUserDefault } from '../interfaces/IFirebaseUser'
import { MAXIMUM_NUMBER_OF_SUBSCRIPTIONS_FOR_NON_PREMIUM_USERS } from '../../global'

export const currentUserAtom = atom<IFirebaseUserDefault>(undefined)

export const isUserPremiumAtom = atom<boolean>(false)

export const maximumUserSubscriptionsAtom = atom<number>(MAXIMUM_NUMBER_OF_SUBSCRIPTIONS_FOR_NON_PREMIUM_USERS)

export const isDeveloperMode = atom<boolean>(false)
