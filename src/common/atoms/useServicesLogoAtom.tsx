import { atom } from 'jotai'
import { COMPANY_ICONS_PATHS } from '../utils/logos/returnRequireLogo'

export const servicesLogoAtom = atom<Record<string, { path: string; name: string; key: string }>>(COMPANY_ICONS_PATHS)

export const servicesCurrencySymbolAtom = atom<string>('€')
