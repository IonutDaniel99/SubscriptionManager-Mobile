import { atom } from 'jotai'

export const currentThemeAtom = atom<'light' | 'dark'>('dark')
