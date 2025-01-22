// eslint-disable-next-line react-native/split-platform-components
import Toast, { BaseToast, ToastType } from 'react-native-toast-message'
import Logger from '../../common/utils/logger/logger'

export const CustomShowToast = (type: ToastType, message: string, shortError?: string) => {
    const toastOptions: { type: ToastType; text1: string; text2?: string } = {
        type: type,
        text1: `${message}`
    }
    if (shortError) {
        toastOptions.text2 = `${shortError}`
    }

    const handleUserPressToast = () => {
        Logger.info('CustomShowToast', 'User pressed the toast')
    }

    Toast.show({ ...toastOptions, position: 'top', visibilityTime: 4000, onPress: () => handleUserPressToast() })
}

