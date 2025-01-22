import React from 'react'
import { StatusBar, StyleSheet } from 'react-native'
import {
    Divider,
    Icon,
    IconElement,
    IconProps,
    Layout,
    Text,
    TopNavigation,
    TopNavigationAction
} from '@ui-kitten/components'
import { APP_ROUTES } from '../../common/enums/appRoutes'
import { NavigationProp, useNavigation } from '@react-navigation/native'
import { TouchableWebElement } from '@ui-kitten/components/devsupport'
import { useTranslation } from 'react-i18next'
import Logger from '../../common/utils/logger/logger'

interface ITopNavBar {
    navigation: NavigationProp<any>
    shouldDisplayBar?: boolean
    displayBackButton?: boolean
    title?: string
    state?: any
}
export const TopNavigationBar = ({
    displayBackButton = false,
    title = '',
    shouldDisplayBar = true
}: ITopNavBar): React.ReactElement => {
    const navigation = useNavigation()
    const { t } = useTranslation()

    if (!shouldDisplayBar) return <></>
    const renderTitle = () => {
        const handleDevMode = () => {
            if (__DEV__) {
                return navigation?.navigate(APP_ROUTES.DEVELOPER as never)
            } else {
                Logger.warn('TopNavigationBar', 'handleDevMode', 'Dev mode is not enabled')
            }
        }

        return (
            <Text category="h6" onPress={() => handleDevMode()}>
                {t(title)}
            </Text>
        )
    }

    const BackIcon = (props: IconProps): IconElement => <Icon {...props} name="arrow-back" />

    const renderBackAction = (): TouchableWebElement => {
        if (!displayBackButton) return <></>
        return <TopNavigationAction icon={BackIcon} onPress={() => navigation?.navigate(APP_ROUTES.HOME as never)} />
    }

    return (
        <Layout style={styles.container} level="1">
            <TopNavigation alignment="center" title={renderTitle} accessoryLeft={renderBackAction} />
            <Divider />
        </Layout>
    )
}

const styles = StyleSheet.create({
    container: {
        paddingTop: StatusBar.currentHeight,
        zIndex: 9999
    }
})

