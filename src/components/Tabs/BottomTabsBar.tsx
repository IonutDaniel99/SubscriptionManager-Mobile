import React, { useEffect } from 'react'
import { Animated } from 'react-native'
import { BottomNavigation, BottomNavigationTab, Icon, IconElement, IconProps } from '@ui-kitten/components'
import { APP_ROUTES } from '../../common/enums/appRoutes'
import { BottomTabBarProps } from '@react-navigation/bottom-tabs'
import { currentRouteNameAtom } from '../../common/atoms/useCurrentRouteNameAtom'
import { useSetAtom } from 'jotai'
import { useTranslation } from 'react-i18next'

const ROOT_ROUTES: string[] = [APP_ROUTES.HOME, APP_ROUTES.SETTINGS, APP_ROUTES.STATS]

export const BottomTabsBar = ({ navigation, state }: BottomTabBarProps): React.ReactElement | null => {
    const { t } = useTranslation()
    const setCurrentRouteNameAtom = useSetAtom(currentRouteNameAtom)

    const currentRouteName = state.routeNames[state.index]
    const shouldDisplayBar = ROOT_ROUTES.includes(currentRouteName)

    // Move setCurrentRouteNameAtom call inside useEffect
    useEffect(() => {
        setCurrentRouteNameAtom(currentRouteName)
    }, [currentRouteName, setCurrentRouteNameAtom])

    if (!shouldDisplayBar) {
        return null
    }

    const HouseIcon = (props: IconProps): IconElement => <Icon {...props} name="home-outline" />
    const SettingsIcon = (props: IconProps): IconElement => <Icon {...props} name="settings-2-outline" />
    const StatsIcon = (props: IconProps): IconElement => <Icon {...props} name="pie-chart-outline" />

    const onSelect = (index: number): void => {
        const selectedTabRoute: string = state.routeNames[index]
        navigation.navigate(selectedTabRoute)
    }

    return (
        <Animated.View>
            <BottomNavigation selectedIndex={state.index} onSelect={onSelect}>
                <BottomNavigationTab title={t('statistics')} icon={StatsIcon} />
                <BottomNavigationTab title={t('home')} icon={HouseIcon} />
                <BottomNavigationTab title={t('settings')} icon={SettingsIcon} />
            </BottomNavigation>
        </Animated.View>
    )
}
