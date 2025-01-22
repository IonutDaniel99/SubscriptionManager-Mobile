import { Button, Icon, IconElement, IconProps, Popover, Text } from '@ui-kitten/components'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import { clearAllSubscriptions } from '../../../common/utils/async_storage/AsyncStorage'
import {
    deleteAccountFromCloud,
    deleteUserDataFromCloud
} from '../../../common/utils/firebase_realtime/firebase_realtime'
import { CustomShowToast } from '../../../components/Toast/ToastComponent'
import { currentThemeAtom } from '../../../common/atoms/useCurrentTheme'
import { useAtom, useSetAtom } from 'jotai'
import CustomModal from '../../../components/CustomModal/CustomModal'
import Logger from '../../../common/utils/logger/logger'
import { currentUserAtom } from '../../../common/atoms/useCurrentUserAtom'

const BinIcon = (props: IconProps): IconElement => <Icon {...props} name="trash-outline" />
const UserXIcon = (props: IconProps): IconElement => <Icon {...props} name="person-delete-outline" />
const InfoIcon = (props: IconProps): IconElement => <Icon {...props} name="info-outline" />

export default function AccountActions() {
    const setUser = useSetAtom(currentUserAtom)

    const [visible, setVisile] = React.useState(false)
    const { t } = useTranslation()
    const [currentTheme] = useAtom<'light' | 'dark'>(currentThemeAtom)
    const [isDeleteDataModalVisible, setIsDeleteDataModalVisible] = useState(false)
    const [isDeleteAccountModalVisible, setIsDeleteAccountModalVisible] = useState(false)

    const renderToggleButton = (text: string, ...props: any): React.ReactElement => (
        <TouchableOpacity
            activeOpacity={1}
            onPress={() => setVisile(true)}
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

    const handleDeleteData = async () => {
        await clearAllSubscriptions()
        await deleteUserDataFromCloud()
        Logger.warn('handleDeleteData', 'All data deleted!')
        CustomShowToast('info', t('allDataDeleted'))
        setIsDeleteDataModalVisible(false)
    }

    const handleDeleteAccount = async () => {
        await clearAllSubscriptions()
        await deleteAccountFromCloud()
        setUser(undefined)
        Logger.warn('handleDeleteAccount', 'Account deleted!')
        CustomShowToast('info', t('accountDeleted'))
        setIsDeleteAccountModalVisible(false)
    }

    return (
        <>
            <CustomModal
                title={t('areYouSureYouWantToDeleteYourData')}
                description={t('areYouSureYouWantToDeleteYourDataDesc')}
                visible={isDeleteDataModalVisible}
                handleModal={(val: boolean) => setIsDeleteDataModalVisible(val)}
                handleYes={() => handleDeleteData()}
            />
            <CustomModal
                title={t('areYouSureYouWantToDeleteYourAccount')}
                description={t('areYouSureYouWantToDeleteYourAccountDesc')}
                visible={isDeleteAccountModalVisible}
                handleModal={(val: boolean) => setIsDeleteAccountModalVisible(val)}
                handleYes={() => handleDeleteAccount()}
            />
            <View style={{ marginTop: 20 }}>
                <Popover
                    backdropStyle={styles.backdrop}
                    placement={'top'}
                    visible={visible}
                    anchor={() => renderToggleButton(t('Account'))}
                    onBackdropPress={() => setVisile(false)}
                >
                    <View style={styles.content}>
                        <View>
                            <Text category="h6">{t('deleteData')}</Text>
                            <Text category="p2">{t('deleteDataDesc')}</Text>
                        </View>
                        <View>
                            <Text category="h6">{t('deleteAccount')}</Text>
                            <Text category="p2">{t('deleteAccountDesc')}</Text>
                        </View>
                    </View>
                </Popover>
                <View style={styles.container}>
                    <Button
                        style={styles.button}
                        size="medium"
                        status="danger"
                        accessoryLeft={BinIcon}
                        onPress={() => setIsDeleteDataModalVisible(true)}
                    >
                        <Text>{t('deleteData')}</Text>
                    </Button>
                    <Button
                        style={styles.button}
                        size="medium"
                        status="danger"
                        accessoryLeft={UserXIcon}
                        onPress={() => setIsDeleteAccountModalVisible(true)}
                    >
                        <Text>{t('deleteAccount')}</Text>
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
