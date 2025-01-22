export interface IFirebaseUser {
    profile: {
        createdAt: string
        hasPremium: boolean
        displayName: string
        email: string
        uid: string
        photoURL: string
        isAnonymous: boolean
        lastSignInTime: string
    }
    data: { [key: string]: any }
}

export type IFirebaseUserDefault = IFirebaseUser | null | undefined
