import React from 'react'
import { StyleSheet, View } from 'react-native'
import { Button, Icon, IconElement, IconProps, Text } from '@ui-kitten/components'
import { useTranslation } from 'react-i18next'
import Share, { ShareOptions } from 'react-native-share'
import Logger from '../../../common/utils/logger/logger'
import RNBlobUtil from 'react-native-blob-util'

const ActivityIcon = (props: IconProps): IconElement => <Icon {...props} name="activity-outline" />

export default function DebugActions() {
    const { t } = useTranslation()
    const logFilePath = `${RNBlobUtil.fs.dirs.DownloadDir}/SubscriptionManagerLogs.txt`

    const exportDebugFile = async () => {
        try {
            // Check if the file exists
            const fileExists = await RNBlobUtil.fs.exists(logFilePath)

            if (fileExists) {
                const shareOptions: ShareOptions = {
                    title: 'Send log file',
                    url: `file://${logFilePath}`,
                    type: 'text/plain',
                    filename: 'SubscriptionManagerLogs.txt', // Renamed file extension to .txt
                    message: 'Please check the attached log file for the error details.'
                }

                await Share.open(shareOptions)
                Logger.info('exportDebugFile', 'User exported debug file!')
            } else {
                Logger.error('exportDebugFile', 'Log file does not exist at the specified location.')
            }
        } catch (error) {
            console.log('Error sharing log file:', error)
            Logger.error('exportDebugFile', 'Error sharing log file:' + error)
        }
    }
    return (
        <View
            style={{
                marginTop: 20
            }}
        >
            <Text category="h6" style={{ marginBottom: 12 }}>
                {t('debug')}
            </Text>
            <View style={styles.container}>
                <Button style={styles.button} size="medium" accessoryLeft={ActivityIcon} onPress={exportDebugFile}>
                    <Text>{t('exportDebug')}</Text>
                </Button>
            </View>
        </View>
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
        gap: 12,
        paddingHorizontal: 12,
        paddingVertical: 12,
        width: '90%'
    },
    icon: {
        height: 20,
        width: 20
    }
})

