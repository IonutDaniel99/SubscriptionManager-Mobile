import React from 'react'
import { useMemo } from 'react'
import { Avatar, Icon, IconElement, IconProps, Spinner } from '@ui-kitten/components'
import { IFirebaseUserDefault } from '../../common/interfaces/IFirebaseUser'

interface ProfilePhotoProps {
    user: IFirebaseUserDefault
    isLoading: boolean
}
const PersonIcon = (props: IconProps): IconElement => <Icon {...props} name="person" />

const ProfilePhoto: React.FC<ProfilePhotoProps> = ({ user, isLoading }) => {
    const profilePhoto = useMemo(() => {
        if (isLoading) return <Spinner />
        if (user?.profile.photoURL) {
            return <Avatar source={{ uri: user.profile.photoURL }} />
        } else {
            return <PersonIcon />
        }
    }, [user?.profile.photoURL, isLoading])

    return profilePhoto
}

export default ProfilePhoto
