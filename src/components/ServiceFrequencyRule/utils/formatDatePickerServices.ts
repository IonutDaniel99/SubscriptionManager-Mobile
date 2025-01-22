import { NativeDateService } from '@ui-kitten/components'
import { useTranslation } from 'react-i18next'

export const formatDatePickerService = () => {
    const { i18n, t } = useTranslation()
    return new NativeDateService(i18n.language, {
        i18n: {
            dayNames: {
                long: [
                    t('sunday'),
                    t('monday'),
                    t('tuesday'),
                    t('wednesday'),
                    t('thursday'),
                    t('friday'),
                    t('saturday')
                ],
                short: [t('sun'), t('mon'), t('tue'), t('wed'), t('thu'), t('fri'), t('sat')]
            },
            monthNames: {
                short: [
                    t('jan'),
                    t('feb'),
                    t('mar'),
                    t('apr'),
                    t('may'),
                    t('jun'),
                    t('jul'),
                    t('aug'),
                    t('sep'),
                    t('oct'),
                    t('nov'),
                    t('dec')
                ],
                long: [
                    t('january'),
                    t('february'),
                    t('march'),
                    t('april'),
                    t('may'),
                    t('june'),
                    t('july'),
                    t('august'),
                    t('september'),
                    t('october'),
                    t('november'),
                    t('december')
                ]
            }
        },
        startDayOfWeek: 1,
        format: 'DD MMMM YYYY'
    })
}
