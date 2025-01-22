import { Layout } from '@ui-kitten/components'
import React from 'react'
import { StyleSheet } from 'react-native'
import { BarIndicator } from 'react-native-indicators'

function LoadingIndicator() {
    return (
        <Layout style={styles.container} level="1" key={'LayoutSpinner'}>
            <BarIndicator color="#FF6821" count={5} size={80} key={'BarIndicatorLoadingSpinner'} />
        </Layout>
    )
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        flex: 1,
        height: '100%',
        justifyContent: 'center',
        width: '100%'
    }
})

export default LoadingIndicator
