import React, { Component, ErrorInfo, ReactNode } from 'react'
import { View, Text, Button } from 'react-native'
import Logger from '../common/utils/logger/logger'

interface Props {
    children: ReactNode
}

interface State {
    hasError: boolean
    error: Error | null
}

class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = {
            hasError: false,
            error: null
        }
    }

    static getDerivedStateFromError(error: Error) {
        // Update state so the next render shows the fallback UI
        return { hasError: true, error }
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        // Log the error to an error reporting service
        Logger.info('ErrorBoundary caught an error', error.message, errorInfo)
        // You can log this to a reporting service like Sentry or Firebase Crashlytics
    }

    handleReset = () => {
        // Reset error state when users want to retry
        this.setState({ hasError: false, error: null })
    }

    render() {
        if (this.state.hasError) {
            return (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text>Something went wrong.</Text>
                    <Text>{this.state.error?.message}</Text>
                    <Button title="Try Again" onPress={this.handleReset} />
                </View>
            )
        }

        return this.props.children
    }
}

export default ErrorBoundary
