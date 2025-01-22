import { Button, Icon, IconElement, IconProps, Text } from '@ui-kitten/components'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Linking, StyleSheet, View } from 'react-native'

const BinIcon = (props: IconProps): IconElement => <Icon {...props} name="email-outline" />

export default function Contact() {
    const { t } = useTranslation()

    return (
        <>
            <View style={{ marginTop: 20 }}>
                <Text category="h6" style={{ marginBottom: 12 }}>
                    {t('contact')}
                </Text>
                <Button
                    style={styles.button}
                    size="medium"
                    status="danger"
                    accessoryLeft={BinIcon}
                    onPress={() =>
                        Linking.openURL(
                            'mailto:gamma.bear10@gmail.com?subject=Support Request&body=Hello, I need help with...'
                        )
                    }
                >
                    <Text>{t('provideFeedback')}</Text>
                </Button>
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

