import { atom } from 'jotai'
import { APP_ROUTES } from '../enums/appRoutes'

export const currentRouteNameAtom = atom<string>(APP_ROUTES.HOME)
