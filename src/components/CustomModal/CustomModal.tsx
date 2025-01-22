import { Button, Card, Modal, Text } from '@ui-kitten/components'
import { t } from 'i18next'
import React from 'react'
import { View } from 'react-native'

interface ICustomModal {
    title: string
    description: string
    visible: boolean
    handleModal: (val: boolean) => void
    handleYes: () => void
}

export default function CustomModal({ title, description, visible, handleModal, handleYes }: ICustomModal) {
    return (
        <Modal
            visible={visible}
            backdropStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
            onBackdropPress={() => handleModal(false)}
            animationType="fade"
        >
            <Card style={{ height: '100%', marginHorizontal: 20 }} disabled={true}>
                <Text category="h6" style={{ marginBottom: 10 }}>
                    {title}
                </Text>
                <Text category="s2" style={{ marginBottom: 20 }}>
                    {description}
                </Text>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Button style={{ flex: 1, marginRight: 10 }} onPress={() => handleModal(false)}>
                        {t('no')}
                    </Button>
                    <Button style={{ flex: 1 }} appearance="outline" onPress={() => handleYes()}>
                        {t('yes')}
                    </Button>
                </View>
            </Card>
        </Modal>
    )
}
