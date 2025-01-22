import { useState, useEffect, useCallback } from 'react'
import { Dimensions, ScaledSize } from 'react-native'

export function useOrientation() {
    const [orientation, setOrientation] = useState<'PORTRAIT' | 'LANDSCAPE'>(() => {
        const { width, height } = Dimensions.get('window')
        return width < height ? 'PORTRAIT' : 'LANDSCAPE'
    })

    const handleOrientationChange = useCallback(({ window: { width, height } }: { window: ScaledSize }) => {
        setOrientation(width < height ? 'PORTRAIT' : 'LANDSCAPE')
    }, [])

    useEffect(() => {
        const subscription = Dimensions.addEventListener('change', handleOrientationChange)
        return () => {
            subscription?.remove?.() // Clean up listener on unmount
        }
    }, [handleOrientationChange])

    return orientation
}
