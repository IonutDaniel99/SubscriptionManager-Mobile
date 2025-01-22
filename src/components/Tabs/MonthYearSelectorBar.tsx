import React from 'react'
import { Icon, IconElement, IconProps, Text, TopNavigation, TopNavigationAction } from '@ui-kitten/components'
import { StyleSheet } from 'react-native'

import moment from 'moment'
import { capitalize } from 'lodash'

export default function MonthYearSelectorBar({
    currentDate,
    handleDate
}: {
    currentDate: Date
    // eslint-disable-next-line no-unused-vars
    handleDate: (val: number) => void
}) {
    const LeftIcon = (props: IconProps): IconElement => <Icon {...props} name="arrow-ios-back-outline" />
    const RightIcon = (props: IconProps): IconElement => <Icon {...props} name="arrow-ios-forward-outline" />

    const renderRightAction = (): React.ReactElement => {
        return (
            <TopNavigationAction
                icon={RightIcon}
                style={[styles.arrowButtons, { paddingLeft: 20 }]}
                onPress={() => handleDate(1)}
            />
        )
    }

    const renderLeftAction = (): React.ReactElement => {
        return (
            <TopNavigationAction
                icon={LeftIcon}
                style={[styles.arrowButtons, { paddingRight: 20 }]}
                onPress={() => handleDate(-1)}
            />
        )
    }

    const renderMonth = () => {
        return <Text>{capitalize(moment(currentDate).format('MMMM YYYY'))}</Text>
    }

    return (
        <TopNavigation
            style={{ height: 54, display: 'flex', justifyContent: 'space-between' }}
            alignment="center"
            title={renderMonth}
            accessoryRight={renderRightAction}
            accessoryLeft={renderLeftAction}
        />
    )
}

const styles = StyleSheet.create({
    arrowButtons: {
        alignItems: 'center',
        height: 54,
        justifyContent: 'center',
        width: 80
    }
})
