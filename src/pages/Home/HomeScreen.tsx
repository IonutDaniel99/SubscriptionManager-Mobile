import React from 'react'
import { Divider, Layout } from '@ui-kitten/components'
import { StyleSheet, View } from 'react-native'
import { NavigationProp } from '@react-navigation/native'
import { CustomList } from '../../components/List/List'
import { deleteSubscription } from '../../common/utils/async_storage/AsyncStorage'
import { useAtom } from 'jotai'
import MonthYearSelectorBar from '../../components/Tabs/MonthYearSelectorBar'
import moment from 'moment'
import { currentBottomDateAtom, currentDeleteModalAtom } from '../../common/atoms/useSubscriptionsAtom'
import { useTranslation } from 'react-i18next'
import CustomModal from '../../components/CustomModal/CustomModal'
import Logger from '../../common/utils/logger/logger'
import AddItemFloatingButton from '../../components/FloatingButton/AddItemFloatingButton'

interface IHomeScreen {
    navigation: NavigationProp<any>
}

export default function HomeScreen({ navigation }: IHomeScreen) {
    const { t } = useTranslation()
    const [currentDeleteModal, setCurrentDeleteModal] = useAtom(currentDeleteModalAtom)
    const [currentBottomDate, setCurrentBottomDate] = useAtom(currentBottomDateAtom)

    const handleCurrentBottomDate = (value: number) => {
        const newDate = moment(currentBottomDate).add(value, 'months').toDate()
        setCurrentBottomDate(newDate)
        Logger.info('handleCurrentBottomDate', 'New date:', newDate)
    }

    const handleDelete = async (subscriptionID: string) => {
        Logger.info('handleDelete', 'Deleting subscription:', subscriptionID)
        setCurrentDeleteModal({ ...currentDeleteModal, visible: false })
        await deleteSubscription(subscriptionID)
    }
    return (
        <>
            <CustomModal
                title={t('areYouSureYouWantToDelete', { name: currentDeleteModal.itemName })}
                description={t('deleteingCurrentItem', { name: currentDeleteModal.itemName })}
                visible={currentDeleteModal.visible}
                handleModal={() => setCurrentDeleteModal({ ...currentDeleteModal, visible: false })}
                handleYes={() => handleDelete(currentDeleteModal.itemId)}
            />
            <Layout style={styles.container} level="2">
                <CustomList currentSelectedDate={currentBottomDate} />
                <View style={styles.floatingButtonContainer}>
                    <AddItemFloatingButton navigation={navigation} />
                </View>
            </Layout>
            <Divider />
            <MonthYearSelectorBar handleDate={handleCurrentBottomDate} currentDate={currentBottomDate} />
            <Divider />
        </>
    )
}
const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        flex: 1,
        height: '100%',
        justifyContent: 'center',
        width: '100%'
    },

    floatingButtonContainer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        bottom: 28,
        right: 28
    }
})
