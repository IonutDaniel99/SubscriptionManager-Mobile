import React from 'react'
import { NavigationContainer, NavigationProp } from '@react-navigation/native'
import LoadingIndicator from '../LoadingIndicator'
import useSession from '../../hooks/useSession'
import { AuthStack } from './AuthStack'
import { AppStack } from './AppStack'

export default function RootNavigation({ navigation }: { navigation?: NavigationProp<any> }) {
    const { user, isLoading } = useSession()
    if (isLoading) return <LoadingIndicator />
    return (
        <NavigationContainer>
            {user ? <AppStack navigation={navigation} user={user} /> : <AuthStack />}
        </NavigationContainer>
    )
}

