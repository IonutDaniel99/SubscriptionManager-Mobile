import { atom } from 'jotai'
import { Subscription } from '../interfaces/Subscription'

export type ISubscriptions = Record<string, Subscription>

export const currentSubscriptionsAtom = atom<ISubscriptions>({})

export const currentDeleteModalAtom = atom<{ itemId: string; itemName: string; visible: boolean }>({
    itemId: '',
    itemName: '',
    visible: false
})

export const currentBottomDateAtom = atom<Date>(new Date())

export const hasReachedSubscriptionLimitAtom = atom<boolean>(false)
