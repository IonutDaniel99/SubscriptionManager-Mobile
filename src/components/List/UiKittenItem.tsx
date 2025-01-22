import { Avatar, Icon, IconElement, IconProps, ListItem, Text } from '@ui-kitten/components'
import React from 'react'
import { StyleSheet, View } from 'react-native'
import { ReturnRequireLogo } from '../../common/utils/logos/returnRequireLogo'
import { ImageProps } from 'react-native-svg'
import { currentThemeAtom } from '../../common/atoms/useCurrentTheme'
import { useAtomValue } from 'jotai'

export interface UiKittenListItemProps extends React.ComponentProps<typeof ListItem> {
    id?: string
    title: string
    description: string
    itemStyle?: any
    avatarLeft?: string
    iconLeft?: string
    iconBackground?: string | undefined
    renderItemAccessory?: any | undefined
}

function UiKittenItem({
    title,
    description,
    itemStyle,
    avatarLeft,
    iconLeft,
    renderItemAccessory,
    iconBackground,
    ...props
}: UiKittenListItemProps) {
    const currentTheme = useAtomValue<'light' | 'dark'>(currentThemeAtom)

    const renderIconOrAvatar = (props: ImageProps): IconElement | any => {
        if (iconLeft) {
            return <Icon height={28} width={28} name={iconLeft} {...props} />
        } else {
            return (
                <Avatar
                    style={[styles.avatar, { tintColor: avatarLeft === 'noImage' ? 'gray' : '' }]}
                    source={ReturnRequireLogo(avatarLeft || 'noImage')}
                />
            )
        }
    }

    return (
        <ListItem
            {...props}
            style={{ ...styles.container, ...itemStyle }}
            title={
                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        padding: 16,
                        borderWidth: 2,
                        borderColor: '#fff'
                    }}
                >
                    {title && <Text style={{ fontSize: 16, fontWeight: 'bold', textAlign: 'left' }}>{title}</Text>}
                    {description && (
                        <Text
                            style={{
                                fontSize: 12,
                                textAlign: 'left',
                                fontWeight: '700',
                                opacity: 0.3
                            }}
                        >
                            {`${description}`}
                        </Text>
                    )}
                    <View style={styles.backgroundIconContainer}>
                        {iconBackground !== undefined && (
                            <Icon
                                name={iconBackground}
                                fill={currentTheme === 'light' ? '#1b3fa0' : '#fff'}
                                style={styles.backgroundIcon}
                                {...props}
                            />
                        )}
                    </View>
                </View>
            }
            accessoryLeft={(props: any) => renderIconOrAvatar(props)}
            accessoryRight={renderItemAccessory}
        />
    )
}

export default UiKittenItem

const styles = StyleSheet.create({
    container: {
        height: 64,
        width: '100%',
        overflow: 'hidden'
    },
    avatar: {
        height: 40,
        margin: 8,
        width: 40
    },
    backgroundIconContainer: {
        position: 'absolute',
        right: 20
    },
    backgroundIcon: {
        height: 72,
        width: 44,
        tintColor: '#FF9858',
        opacity: 0.3
    }
})

