import React, { useEffect, useState } from 'react'
import { Button } from '@ui-kitten/components'
import { useTranslation } from 'react-i18next'
import {
    finishTransaction,
    getProducts,
    purchaseErrorListener,
    purchaseUpdatedListener,
    requestPurchase
} from 'react-native-iap'
import { google_play_iap_skus } from '../common/utils/sku'
import Logger from '../common/utils/logger/logger'

function PaymentButton() {
    const { t } = useTranslation()

    const [products, setProducts] = useState<any>([])
    const [isLoading, setLoading] = useState(true)

    useEffect(() => {
        const purchaseUpdateSubscription = purchaseUpdatedListener(async (purchase) => {
            const receipt = purchase.transactionReceipt
            if (receipt) {
                try {
                    await finishTransaction({ purchase, isConsumable: false })
                } catch (error) {
                    console.error('An error occurred while completing transaction', error)
                }
                notifySuccessfulPurchase()
            }
        })
        const purchaseErrorSubscription = purchaseErrorListener((error) =>
            console.error('Purchase error', error.message)
        )
        const fetchProducts = async () => {
            try {
                const result = await getProducts({ skus: google_play_iap_skus.productSkus })
                setProducts(result)
                setLoading(false)
            } catch (error) {
                Logger.warn('fetchProducts', 'Error occurred while fetching products', error)
            }
        }
        fetchProducts()
        return () => {
            purchaseUpdateSubscription.remove()
            purchaseErrorSubscription.remove()
        }
    }, [])

    const notifySuccessfulPurchase = () => {
        Logger.info('notifySuccessfulPurchase', 'Purchase successful')
    }

    const handlePurchase = async (productId: any) => {
        setLoading(true)
        try {
            await requestPurchase({ skus: [productId] })
        } catch (error) {
            Logger.error('handlePurchase', 'Error occurred while purchasing', error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Button style={{ marginTop: 16 }} onPress={() => handlePurchase(products[0].productId)}>
            {isLoading ? t('loading') : t('subscribePayButton', { price: products[0].price })}
        </Button>
    )
}

export default PaymentButton
