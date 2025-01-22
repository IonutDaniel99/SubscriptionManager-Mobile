import React from 'react'
import useSession from '../../hooks/useSession'
import { Button, Layout, Text } from '@ui-kitten/components'
import { StyleSheet } from 'react-native'

export default function CalendarScreen() {
    const { removeUser } = useSession()

    return (
        <>
            <Layout style={styles.container}>
                <Text style={styles.text} category="h1">
                    Welcome to Calendar
                </Text>
                <Button onPress={removeUser}>
                    <Text>Logout</Text>
                </Button>
            </Layout>
        </>
    )
}
const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center'
    },
    text: {
        textAlign: 'center'
    }
})
