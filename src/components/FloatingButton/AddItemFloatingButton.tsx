import React from 'react'
import { Button, Icon, IconProps, PopoverPlacements, Text, Tooltip } from '@ui-kitten/components'
import { useAtom } from 'jotai'
import { hasReachedSubscriptionLimitAtom } from '../../common/atoms/useSubscriptionsAtom'
import { isUserPremiumAtom } from '../../common/atoms/useCurrentUserAtom'
import { StyleSheet } from 'react-native'
import { NavigationProp } from '@react-navigation/native'
import { APP_ROUTES } from '../../common/enums/appRoutes'

interface IFloatingButton {
    navigation: NavigationProp<any>
}

function AddItemFloatingButton({ navigation }: IFloatingButton) {
    const [hasReachedSubscriptionLimit] = useAtom(hasReachedSubscriptionLimitAtom)
    const [isPremium] = useAtom(isUserPremiumAtom)
    const [visible, setVisible] = React.useState(false)

    const plusIcon = (props: IconProps) => <Icon name="plus-outline" style={[{ ...props.style, ...styles.icon }]} />
    const infoIcon = (props: IconProps) => <Icon name="info-outline" style={[{ ...props.style, ...styles.icon }]} />
    const InfoButton = () => (
        <Tooltip
            anchor={() => (
                <Button
                    style={[styles.floatingButton, { backgroundColor: '#1e293b', borderColor: '#475569' }]}
                    status="info"
                    appearance="filled"
                    onPress={() => setVisible(true)}
                    accessoryRight={infoIcon}
                />
            )}
            style={{ width: 264 }}
            visible={visible}
            placement={PopoverPlacements.LEFT}
            onBackdropPress={() => setVisible(false)}
        >
            <Text status="warning">You've reached the limit of 12 subscriptions available for free users.</Text>
        </Tooltip>
    )
    const AddButton = () => (
        <Button
            style={styles.floatingButton}
            onPress={() => navigation.navigate(APP_ROUTES.ADD_SUBSCRIPTION)}
            accessoryRight={plusIcon}
        />
    )
    if (isPremium) return <AddButton />
    if (hasReachedSubscriptionLimit) {
        return <InfoButton />
    }
    return <AddButton />
}

export default AddItemFloatingButton

const styles = StyleSheet.create({
    icon: {
        height: 32,
        width: 32
    },
    floatingButton: {
        width: 56,
        height: 56
    }
})
