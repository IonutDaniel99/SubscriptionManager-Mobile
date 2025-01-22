import React, { useCallback, useEffect, useMemo, useState } from 'react'
import {
    Avatar,
    Card,
    Divider,
    Icon,
    IconElement,
    IconProps,
    IndexPath,
    Input,
    Modal,
    Select,
    SelectItem,
    Text
} from '@ui-kitten/components'
import {
    Dimensions,
    ImageProps,
    KeyboardAvoidingView,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View
} from 'react-native'
import { servicesLogoAtom } from '../../../common/atoms/useServicesLogoAtom'
import { useAtom } from 'jotai'
import { upperFirst, debounce, capitalize } from 'lodash'
import { SubscriptionData } from '../../../common/interfaces/Subscription'
import { useTranslation } from 'react-i18next'
import { ReturnRequireLogo } from '../../../common/utils/logos/returnRequireLogo'
import { CategorySubscriptionOptions } from '../../../common/utils/categoriesList'

const { height } = Dimensions.get('window')
const MAX_NUMBER_OF_CHARACTERS = 30

interface IServiceLogoAndName {
    data: SubscriptionData
    // eslint-disable-next-line no-unused-vars
    handleChange: (name: string, value: string) => void
}

const IconComponent = (name: string, props: IconProps): IconElement => <Icon {...props} name={name} />

export default function ServiceLogoAndName({ data, handleChange }: IServiceLogoAndName) {
    const { t } = useTranslation()
    const { logo, price, name, category } = data
    const [servicesLogo] = useAtom(servicesLogoAtom)
    const [visible, setVisible] = React.useState(false)
    const [subsName, setSubsName] = useState<string>('')
    const [charCount, setCharCount] = useState<number>(0)
    const [subsPrice, setSubsPrice] = useState<string>('')
    const [priceError, setPriceError] = useState<{ status: string; error: string }>({ status: 'basic', error: ' ' })
    const [logoSearchName, setLogoSearchName] = useState<string>('')

    const [logoName, setLogoName] = useState<string>(data.logo)

    const [selectedIndex, setSelectedIndex] = useState(new IndexPath(0))

    useEffect(() => {
        if (data) {
            setSubsName(name)
            setSubsPrice(price.toString())
            setLogoName(logo)
            setSelectedIndex(
                new IndexPath(CategorySubscriptionOptions.findIndex((option) => option.value === category))
            )
        }
    }, [data])

    const handleLogoSearchName = useCallback(
        debounce((text: string) => {
            setLogoSearchName(text)
        }, 1000),
        []
    )

    const filteredServices = useMemo(() => {
        const servicesArray = Object.entries(servicesLogo)

        if (!logoSearchName) {
            return servicesArray.map(([, path]) => path)
        }

        return servicesArray
            .filter(([name]) => name.toLowerCase().includes(logoSearchName.toLowerCase()))
            .map(([, path]) => path)
    }, [logoSearchName, servicesLogo])

    const handleLogoSelectionButton = (index: string) => {
        setLogoName(index)
        handleChange('logo', index)
        setVisible(false)
        setLogoSearchName('')
    }

    const RenderToggleButton = (): React.ReactElement => {
        return (
            <TouchableOpacity className="flex items-center gap-3 py-2" onPress={() => setVisible(true)}>
                <Avatar
                    style={[styles.avatar, { tintColor: logoName === 'noImage' ? 'gray' : '' }]}
                    source={ReturnRequireLogo(logoName)}
                />
                <Text category="label">{t('pressToChange')}</Text>
            </TouchableOpacity>
        )
    }

    const handleSubsName = (val: string) => {
        if (val.length <= 40) {
            setSubsName(val)
            setCharCount(val.length)
            handleChange('name', val)
        }
    }

    const handlePrice = (val: string) => {
        if (!/^\d*\.?\d*$/.test(val)) {
            setPriceError({ status: 'danger', error: 'Price must be a number' })
        } else {
            setPriceError({ status: 'basic', error: ' ' })
            setSubsPrice(val)
            handleChange('price', val) // Pass 'price' and value directly
        }
    }

    const handleSelectChange = (index: IndexPath) => {
        handleChange('category', CategorySubscriptionOptions[index.row].value)
        setSelectedIndex(new IndexPath(index.row))
    }
    return (
        <View
            style={{
                flexDirection: 'row',
                paddingBottom: 20,
                gap: 16,
                zIndex: 30,
                overflow: 'hidden'
            }}
        >
            <RenderToggleButton />
            <Modal
                visible={visible}
                backdropStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
                onBackdropPress={() => setVisible(false)}
                animationType="fade"
                style={{ position: 'relative', top: '30%' }}
            >
                <Card style={[styles.modalContent, { height: '100%' }]} disabled={true}>
                    <Text category="h6" style={{ paddingBottom: 12, textAlign: 'center' }}>
                        {t('selectCompanyLogo')}
                    </Text>
                    <Input
                        style={{ paddingBottom: 12, marginHorizontal: 30 }}
                        size="medium"
                        placeholder={t('searchForLogoCompany')}
                        onChangeText={(text) => handleLogoSearchName(text)}
                    />
                    <Divider />
                    <ScrollView style={styles.scrollViewStyle} contentContainerStyle={styles.modalCardScrollStyle}>
                        <KeyboardAvoidingView style={styles.gridContainer}>
                            {filteredServices.map((service, index) => (
                                <TouchableOpacity
                                    onPress={() => handleLogoSelectionButton(service.key)}
                                    key={index}
                                    style={styles.companyContainer}
                                >
                                    <Avatar
                                        style={[
                                            styles.avatarCard,
                                            { tintColor: service.key === 'noImage' ? 'gray' : '' }
                                        ]}
                                        source={ReturnRequireLogo(service.key)}
                                    />
                                    <Text allowFontScaling adjustsFontSizeToFit>
                                        {upperFirst(service.name)}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </KeyboardAvoidingView>
                    </ScrollView>
                </Card>
            </Modal>
            <View style={styles.inputContainer}>
                <View style={styles.namePriceContainer}>
                    <Input
                        size="medium"
                        placeholder={t('subscriptionName')}
                        value={subsName}
                        style={{ width: '65%' }}
                        onChangeText={handleSubsName}
                        maxLength={30}
                        caption={t('usedCharacters', { count: charCount, max: MAX_NUMBER_OF_CHARACTERS })}
                    />
                    <Input
                        size="medium"
                        placeholder={`${t('price')}`}
                        keyboardType="numeric"
                        style={{ width: '30%' }}
                        value={subsPrice}
                        onChangeText={handlePrice}
                        caption={priceError.error}
                    />
                </View>
                <Select
                    size="medium"
                    selectedIndex={selectedIndex}
                    value={capitalize(t(CategorySubscriptionOptions[selectedIndex.row].label.toLowerCase()))}
                    onSelect={(index) => handleSelectChange(index as IndexPath)}
                >
                    {CategorySubscriptionOptions.map((option) => (
                        <SelectItem
                            key={option.value}
                            title={capitalize(t(option.label))}
                            accessoryLeft={(props: ImageProps | undefined) =>
                                IconComponent(option.accessoryLeft, props)
                            }
                        />
                    ))}
                </Select>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    avatar: {
        height: 64,
        width: 64
    },
    avatarCard: {
        height: 48,
        marginBottom: 2,
        width: 48
    },
    companyContainer: {
        alignItems: 'center',
        marginBottom: 24,
        width: '30%'
    },

    gridContainer: {
        alignItems: 'center',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        paddingBottom: 64,
        width: '100%'
    },
    inputContainer: {
        flex: 1,
        gap: 12
    },
    modalCardScrollStyle: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center'
    },
    modalContent: {
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20
    },
    scrollViewStyle: {
        height: height * 0.625
    },
    namePriceContainer: {
        display: 'flex',
        flexDirection: 'row',
        gap: 12
    }
})

