import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import * as RNLocalize from 'react-native-localize'
import en from './locales/en.json'
import fr from './locales/fr.json'
import de from './locales/de.json'

const resources = {
    en: { translation: en },
    fr: { translation: fr },
    de: { translation: de },
}

const languageDetector = {
    type: 'languageDetector',
    async: true,
    detect: (callback) => {
        const { languageTag } = RNLocalize.getLocales()[0]
        callback(languageTag)
    },
    init: () => {},
    cacheUserLanguage: () => {}
}

i18n.use(initReactI18next)
    // .use(languageDetector)
    .init({
        compatibilityJSON: 'v3',
        resources,
        //language to use if translations in user language are not available
        fallbackLng: 'en',
    })

export default i18n
