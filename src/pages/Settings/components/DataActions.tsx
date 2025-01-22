import { Button, Icon, IconElement, IconProps, Popover, Text } from '@ui-kitten/components'
import { useAtom } from 'jotai'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import { currentSubscriptionsAtom } from '../../../common/atoms/useSubscriptionsAtom'
import { isUserPremiumAtom } from '../../../common/atoms/useCurrentUserAtom'
import { currentThemeAtom } from '../../../common/atoms/useCurrentTheme'
import RNBlobUtil from 'react-native-blob-util'
import moment from 'moment'
import Logger from '../../../common/utils/logger/logger'
import DocumentPicker, { types } from 'react-native-document-picker'
import Share from 'react-native-share'
import { SubscriptionsRecord } from '../../../common/interfaces/Subscription'
import { isValidSubscriptions } from './utils'
import { CustomShowToast } from '../../../components/Toast/ToastComponent'
import { importSubscriptions } from '../../../common/utils/async_storage/AsyncStorage'
import { canUpload, saveSubscriptionsToCloud } from '../../../common/utils/firebase_realtime/firebase_realtime'

const DownloadIcon = (props: IconProps): IconElement => <Icon {...props} name="download-outline" />
const UploadIcon = (props: IconProps): IconElement => <Icon {...props} name="upload-outline" />
const InfoIcon = (props: IconProps): IconElement => <Icon {...props} name="info-outline" />

export default function DataActions() {
    const [isPremium] = useAtom(isUserPremiumAtom)
    const [visible, setVisible] = React.useState(false)
    const { t } = useTranslation()
    const [currentSubscriptions] = useAtom(currentSubscriptionsAtom)
    const [currentTheme] = useAtom<'light' | 'dark'>(currentThemeAtom)

    const renderToggleButton = (text: string, ...props: any): React.ReactElement => (
        <TouchableOpacity
            activeOpacity={1}
            onPress={() => setVisible(true)}
            className="flex flex-row items-center justify-between mb-3"
        >
            <Text category="h6">{text}</Text>
            <View style={{ display: 'flex', flexDirection: 'row', gap: 4, marginRight: 4 }}>
                <Text category="p2" style={{ paddingTop: 1 }}>
                    {t('pressForInfo')}
                </Text>
                <InfoIcon {...props} style={styles.icon} fill={currentTheme === 'light' ? '#000' : '#fff'} />
            </View>
        </TouchableOpacity>
    )

    const exportAndShareData = async () => {
        const now = moment().format('YYYY-MM-DD-HH-mm-ss')
        const path = `${RNBlobUtil.fs.dirs.DownloadDir}/${now}-subscriptions.json` // Save to Downloads directory

        const options = {
            url: `file://${path}`,
            type: 'application/json',
            title: 'Export Subscriptions',
            filename: 'SubscriptionManager-Data.json',
            message: 'Share this file with others to import your subscriptions.'
        }

        try {
            // Check if the file exists, if not, create it
            const fileExists = await RNBlobUtil.fs.exists(path)
            if (!fileExists) {
                // Create the file with initial empty content or start with your first log entry
                await RNBlobUtil.fs.createFile(path, '', 'utf8')
                Logger.info('exportAndShareData', `File created at ${path}`)
            }

            // Now, append the JSON data to the file
            const jsonData = JSON.stringify(currentSubscriptions, null, 2)
            await RNBlobUtil.fs.appendFile(path, jsonData, 'utf8')
            Logger.info('exportAndShareData', 'User exported data successfully!')
        } catch (error) {
            Logger.error('exportAndShareData', 'Error exporting data:' + error)
            return // Exit if the export fails
        }

        try {
            // Share the file after it has been successfully exported
            const res = await Share.open(options)
            Logger.info('exportAndShareData', 'Share successful:', res)
        } catch (err) {
            Logger.error('exportAndShareData', 'Error sharing file:' + err)
        }
    }

    const handleImportData = async () => {
        Logger.info('handleImportData', 'User started importing data...')
        try {
            // Document Picker to select the file
            const res = await DocumentPicker.pickSingle({
                mode: 'import',
                allowMultiSelection: false,
                type: [types.json]
            })

            // Read file content from the selected file using RNBlobUtil
            const fileContent = await RNBlobUtil.fs.readFile(res.uri, 'utf8')
            const parsedData: SubscriptionsRecord = JSON.parse(fileContent)

            // Validate the file content
            if (!isValidSubscriptions(parsedData)) {
                Logger.error('handleImportData', 'Invalid data imported!', parsedData)
                CustomShowToast('error', t('errorImportData'))
            } else {
                Logger.info('handleImportData', 'Will import:', parsedData)
                await importSubscriptions(parsedData)
                Logger.info('handleImportData', 'Data imported successfully!')

                const result = await canUpload()
                Logger.info('handleImportData', `User can upload data: ${result}`)

                if (result && isPremium) {
                    await saveSubscriptionsToCloud(parsedData)
                    Logger.info('handleImportData', 'Data uploaded to cloud successfully!')
                } else {
                    Logger.warn('handleImportData', 'User is not premium or cannot upload data!')
                }
                CustomShowToast('success', t('dataImported'))
            }
        } catch (err: any) {
            if (DocumentPicker.isCancel(err)) {
                Logger.error('handleImportData', 'User canceled the document picker' + err)
            } else {
                Logger.error('handleImportData', 'Unknown error:' + err)
                CustomShowToast('error', t('undexpectedError'))
            }
        }
    }

    return (
        <>
            <View style={{ marginTop: 20 }}>
                <Popover
                    backdropStyle={styles.backdrop}
                    visible={visible}
                    anchor={() => renderToggleButton(t('dataActions'))}
                    onBackdropPress={() => setVisible(false)}
                >
                    <View style={styles.content}>
                        <View>
                            <Text category="h6">{t('export')}</Text>
                            <Text category="p2">{t('exportDesc')}</Text>
                        </View>
                        <View>
                            <Text category="h6">{t('import')}</Text>
                            <Text category="p2">{t('importDesc')}</Text>
                            <Text category="p2" status="danger">
                                {t('importDescWarn')}
                            </Text>
                        </View>
                    </View>
                </Popover>
                <View style={styles.container}>
                    <Button
                        style={styles.button}
                        size="medium"
                        status="basic"
                        accessoryLeft={DownloadIcon}
                        onPress={exportAndShareData}
                    >
                        <Text>{t('export')}</Text>
                    </Button>
                    <Button
                        style={styles.button}
                        size="medium"
                        status="basic"
                        accessoryLeft={UploadIcon}
                        onPress={handleImportData}
                    >
                        <Text>{t('import')}</Text>
                    </Button>
                </View>
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    backdrop: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)'
    },
    button: {
        flex: 1,
        margin: 2
    },
    container: {
        alignItems: 'center',
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
    content: {
        alignItems: 'flex-start',
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
        paddingHorizontal: 20,
        paddingVertical: 20,
        width: '90%'
    },
    icon: {
        height: 20,
        width: 20
    }
})

