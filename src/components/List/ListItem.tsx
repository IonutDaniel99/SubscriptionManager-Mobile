import React from 'react'
import { Icon, ListItemProps, IconProps } from '@ui-kitten/components'
import { TouchableOpacity } from 'react-native'
import { currentDeleteModalAtom } from '../../common/atoms/useSubscriptionsAtom'
import { useAtom, useAtomValue } from 'jotai'
import { CommonActions, useNavigation } from '@react-navigation/native'
import { APP_ROUTES } from '../../common/enums/appRoutes'
import UiKittenItem from './UiKittenItem'
import { CategorySubscriptionOptions } from '../../common/utils/categoriesList'
import { servicesCurrencySymbolAtom } from '../../common/atoms/useServicesLogoAtom'

interface IListItemProps extends ListItemProps {
    subscriptionID: string
    title: string
    description: string
    logo: string
    symbol: string
    price: number | string
    category: string
}

export const ListItem = ({
    title,
    logo,
    price,
    category,
    symbol,
    subscriptionID,
    ...props
}: IListItemProps): React.ReactElement => {
    const [, setCurrentDeleteModal] = useAtom(currentDeleteModalAtom)
    const navigate = useNavigation()

    const renderItemAccessory = (props: IconProps): React.ReactElement => {
        const handleDelete = () => {
            setCurrentDeleteModal({ visible: true, itemId: subscriptionID, itemName: title })
        }

        const handleEdit = () => {
            return navigate.dispatch(
                CommonActions.navigate({
                    name: APP_ROUTES.EDIT_SUBSCRIPTION,
                    params: {
                        subscriptionID: subscriptionID
                    }
                })
            )
        }

        return (
            <>
                <TouchableOpacity onPress={() => handleEdit()}>
                    <Icon {...props} name="edit-outline" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDelete()}>
                    <Icon {...props} name="trash-outline" />
                </TouchableOpacity>
            </>
        )
    }

    const getCategoryIcon: string | undefined = CategorySubscriptionOptions.find(
        (option) => option.value === category
    )?.accessoryLeft
    return (
        <UiKittenItem
            {...props}
            title={`${title}`}
            description={`${price} ${symbol}`}
            avatarLeft={logo}
            iconBackground={getCategoryIcon}
            renderItemAccessory={renderItemAccessory}
        />
    )
}

