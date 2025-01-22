import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { APP_ROUTES } from '../../common/enums/appRoutes'
import AuthScreen from '../../pages/Auth/AuthScreen'

const { Navigator, Screen } = createBottomTabNavigator()

export const AuthStack = () => (
    <Navigator screenOptions={{ headerShown: false }} tabBar={() => null}>
        <Screen name={APP_ROUTES.AUTH} component={AuthScreen} />
    </Navigator>
)
