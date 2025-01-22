import React from 'react'
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native'
import { GoogleSignin } from '@react-native-google-signin/google-signin'
import auth from '@react-native-firebase/auth'
import { ImageOverlay } from '../../components/ImageOverlay'
import { Text } from '@ui-kitten/components'
import { firebaseRealtime } from '../../common/utils/firebase_realtime/firebase_realtime'
import Logger from '../../common/utils/logger/logger'

export default function AuthScreen() {
    const onGoogleButtonPress = async () => {
        Logger.info('onGoogleButtonPress', 'Starting Google sign-in process')
        try {
            await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true })
            Logger.info('onGoogleButtonPress', 'Play services are available')
            const data = await GoogleSignin.signIn()
            const idToken = data.data?.idToken || null
            Logger.info('onGoogleButtonPress', 'Google sign-in successful')
            const googleCredential = auth.GoogleAuthProvider.credential(idToken)
            Logger.info('onGoogleButtonPress', 'GoogleCredential')

            // Sign in the user with Google credentials
            const userCredential = await auth().signInWithCredential(googleCredential)
            Logger.info('onGoogleButtonPress', 'User signed in with Google credentials')
            const user = userCredential.user
            Logger.info('onGoogleButtonPress', 'User details: ', user)

            if (user) {
                const uid = user.uid

                // Check if user already exists in the Realtime Database
                const userRef = firebaseRealtime.ref(`/users/${uid}`)
                const snapshot = await userRef.once('value')
                Logger.info('onGoogleButtonPress', 'User snapshot: ', snapshot.val())
                if (!snapshot.exists()) {
                    Logger.info('onGoogleButtonPress', 'New user detected, saving to the database')
                    await userRef.set({
                        profile: {
                            uid: uid,
                            email: user.email,
                            displayName: user.displayName,
                            photoURL: user.photoURL,
                            isAnonymous: user.isAnonymous,
                            createdAt: user.metadata.creationTime,
                            lastSignInTime: user.metadata.lastSignInTime,
                            hasPremium: false
                        },
                        data: {}
                    })

                    Logger.info('onGoogleButtonPress', 'New user saved to the database')
                }
            }
        } catch (error) {
            Logger.error('AuthScreen', 'Error during Google sign-in or saving user data: ', error)
        }
    }
    return (
        <ImageOverlay style={styles.container} source={require('../../assets/auth/auth-background.jpg')}>
            <View style={styles.headerContainer}>
                <Text category="h1" status="control">
                    Hello there!
                </Text>
                <Text style={{ paddingTop: 16 }} category="h6" status="control">
                    Sign in to your account
                </Text>
            </View>
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.googleContainer} activeOpacity={0.5}>
                    <View style={styles.iconContainer}>
                        <Image source={require('../../assets/auth/Google.png')} style={styles.signInGoogleImage} />
                    </View>
                    <Text style={styles.text} onPress={() => onGoogleButtonPress()}>
                        Login with Google!
                    </Text>
                </TouchableOpacity>
            </View>
        </ImageOverlay>
    )
}

const styles = StyleSheet.create({
    buttonContainer: {
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center'
    },
    container: {
        flex: 1,
        justifyContent: 'space-between',
        paddingVertical: 40
    },
    headerContainer: {
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center',
        minHeight: 216
    },
    googleContainer: {
        alignItems: 'center',
        backgroundColor: '#1c73e8',
        borderRadius: 6,
        flex: 1,
        flexDirection: 'row',
        gap: 16,
        maxHeight: 56,
        padding: 2
    },
    iconContainer: {
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 4,
        flex: 1,
        height: 48,
        justifyContent: 'center',
        marginHorizontal: 2,
        maxWidth: 48
    },
    signInGoogleImage: {
        borderRadius: 4,
        height: 28,
        position: 'relative',
        width: 28
    },
    text: {
        borderWidth: 0,
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 8,
        marginRight: 20
    }
})

