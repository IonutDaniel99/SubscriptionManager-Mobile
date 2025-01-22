import { Platform } from 'react-native'
const productSkus = Platform.select({
    android: ['premium_permanent_1']
})
export const google_play_iap_skus = {
    productSkus
} as { productSkus: string[] }
