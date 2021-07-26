import React from 'react'
import { ScrollView, TouchableOpacity } from 'react-native'
import { Div, Text, Overlay, Icon, Button, Image } from 'react-native-magnus'
import {
  GDHeader,
  Refund,
  ClientNavTiles,
  GDFontText,
  FloatingChatOptionsButton,
} from '../components'
import dayjs from 'dayjs'
import { useI18n } from '../hooks'
// import { useFirestore, useFirebase } from 'react-redux-firebase'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useNavigation } from '@react-navigation/core'

import { useSelector } from 'react-redux'
import Log from '../util/Log'
import Styles from '../util/Styles'
import stacks from '../navigation/stacks'
import screens from '../navigation/screens'

const TEMP_LANG = {
  ko: {},
}

interface MyPagePurchasesScreenProps {}

const { useEffect, useState, useRef } = React
const MyPagePurchasesScreen: React.FC<MyPagePurchasesScreenProps> = ({}) => {
  const t = useI18n('myPagePurchases')

  const insets = useSafeAreaInsets()
  const navigation = useNavigation()

  const [showDetailsOverlay, setShowDetailsOverlay] = useState(false)
  const [selectedPurchase, setSelectedPurchase] = useState<any>({})

  const profile = useSelector((state: any) => state.firebase.profile)
  const [purchaseData, setPurchaseData] = useState(
    profile?.purchaseHistory ?? [],
  )

  useEffect(() => {
    // var date = new Date().getDate() //Current Date
    // var month = new Date().getMonth() + 1 //Current Month
    // var year = new Date().getFullYear() //Current Year
    // let placeholderDate = `${year}.${month}.${date} `
    // Log.debug('date: ', placeholderDate)
    // let testData = [
    //   {
    //     name: 'item1',
    //     date: placeholderDate,
    //     length: 'placeholder length',
    //     paymentMethod: 'card',
    //     price: 1,
    //     isCancelled: '',
    //     cancellationDate: '',
    //   },
    //   {
    //     name: 'item2',
    //     date: placeholderDate,
    //     length: 'placeholder length',
    //     paymentMethod: 'cucumbers',
    //     price: 1000000,
    //     isCancelled: '',
    //     cancellationDate: '',
    //   },
    //   {
    //     name: 'item3',
    //     date: '',
    //     length: 'placeholder length',
    //     paymentMethod: 'pennies',
    //     price: 25,
    //     isCancelled: '',
    //     cancellationDate: '',
    //   },
    // ]
    // setPurchaseData(testData)
    // let initUserData = async () => {
    //   let resData = await firestore().collection('users').where('').get()
    //   setUserData(resData)
    //   setPurchaseData()
    //   Log.debug('userdata: ', userData)
    // }
    // }
    // initUserData()
    // let initData = async () => {
    //   try {
    //     let resData = await firestore()
    //       .collection('users')
    //       .where('email', '==', profile.email)
    //       .get()
    //     setPurchaseData(resData.purchaseHistory)
    //   } catch (error) {
    //     Log.debug('initData error: ', error)
    //   }
    // }
    // initData()
    // Log.debug('profile: ', profile)
    // setPurchaseData(profile.purchaseHistory)
    // Log.debug('purchaseData: ', purchaseData)
    return () => {
      // cleanup
    }
  }, [])

  const openDetailsOverlay = (purchase: any) => {
    setSelectedPurchase(purchase)
    setShowDetailsOverlay(true)
  }

  const formattedDate = (value) => {
    // Log.debug('value: timestamp =', value)
    if (value) {
      // Log.debug('value = ', new Date(value))
      // let tmp = value.toDate().toLocaleString()
      // Log.debug('value: ', tmp.toString())
      let tmp = new Date(value.seconds * 1000 + value.nanoseconds / 1000000)
      // Log.debug(value, tmp)

      return dayjs(tmp).format('YYYY.MM.DD')
    }
  }

  const productCards = [
    {
      // screenName: '웰니스교육 구매',
      picture: Styles.images.clientNavTile.wellnessTraining,
      onPress: () => navigation.navigate(stacks.WELLNESS_STACK),
    },
    {
      // screenName: '세컨드윈드 구매',
      picture: Styles.images.clientNavTile.secondWind,
      onPress: () => navigation.navigate(stacks.SECONDWIND_STACK),
    },
  ]

  return (
    <Div flex={1} pt={insets.top} bg="white">
      <GDHeader bottomLine>{t.title}</GDHeader>
      <Overlay
        visible={showDetailsOverlay}
        style={{ height: '75%' }}
        rounded="2xl">
        <Div flex={1} bg="background" justifyContent="space-between">
          <Div>
            <Div row>
              <Div alignSelf="center" flex={14}>
                <GDFontText fontSize="2xl" textAlign="center" textWeight="500">
                  {t.detailsOverlayTitle}
                </GDFontText>
              </Div>
              <Div alignSelf="flex-end" flex={1} mb="md">
                <TouchableOpacity onPress={() => setShowDetailsOverlay(false)}>
                  <Icon
                    fontFamily="MaterialCommunityIcons"
                    name="close"
                    fontSize="4xl"
                    color="gray900"
                  />
                </TouchableOpacity>
              </Div>
            </Div>
            <Div
              my="xl"
              borderWidth={1}
              borderColor={Styles.colors.grayscale.lightGray}
            />
            <GDFontText fontSize="2xl" color="gray900">
              {selectedPurchase.itemName}
            </GDFontText>
            <Div mt="2xl" />
            <Div row>
              <Div>
                <GDFontText fontSize="md">{t.purchaseDate}</GDFontText>
              </Div>
              <Text>{' : '}</Text>
              <Text>{formattedDate(selectedPurchase.purchaseDate)}</Text>
            </Div>
            <Div mt="lg" />
            <Div row>
              <Div>
                <GDFontText fontSize="md">{t.paymentMethod}</GDFontText>
              </Div>
              <Text>{': '}</Text>
              <Text>{selectedPurchase?.pgData?.newPayMethod ?? ''}</Text>
            </Div>
            <Div mt="lg" />
            <Div row>
              <GDFontText fontSize="md">{t.price}</GDFontText>
              <Text>{' : '}</Text>
              <Text>
                {selectedPurchase?.pgData?.newAmt ?? ''}
                {t.currency}
              </Text>
            </Div>
            <Div mt="lg" />
            <Div row>
              <GDFontText fontSize="md">{t.is_cancelled}</GDFontText>
              <Text>{' : '}</Text>
              <Text>
                {selectedPurchase.isCancelled == ''
                  ? '-'
                  : selectedPurchase.isCancelled}
              </Text>
            </Div>
            <Div mt="lg" />
            <Div row>
              <GDFontText fontSize="md">{t.cancellation_date}</GDFontText>
              <Text>{' : '}</Text>
              <Text>
                {selectedPurchase.cancellationDate == ''
                  ? '-'
                  : formattedDate(selectedPurchase.cancellationDate)}
              </Text>
            </Div>
          </Div>
          <Div alignSelf="flex-end" mb="2xl">
            <Refund showHeader={false} />
            <Text mt="xl" textDecorLine="underline" fontSize="xs">
              {t.inquireLink}
            </Text>
          </Div>
        </Div>
      </Overlay>
      <Div bg="background" flex={1} style={{ flexGrow: 1 }}>
        <ScrollView>
          {purchaseData.length != 0 ? (
            purchaseData.map((purchase, idx) => (
              <Div
                row
                justifyContent="space-between"
                key={String(idx)}
                bg="gray150"
                px="xl"
                py="xl"
                alignItems="center"
                borderTopWidth={1}
                borderBottomWidth={1}
                borderColor={Styles.colors.grayscale.lightGray}>
                <Div>
                  <Text fontSize="xl">
                    {purchase.itemName == 'sw-watch-only'
                      ? '세컨드 윈드'
                      : '웰니스교육'}
                  </Text>

                  {purchase.purchaseDate != '' ? (
                    <Text fontSize="xs" mt="md">
                      {formattedDate(purchase.purchaseDate)}
                      {t.status_completed}
                    </Text>
                  ) : (
                    <Text>{t.status_incomplete}</Text>
                  )}
                </Div>
                <Div bg="main900" rounded="circle" px="lg">
                  <TouchableOpacity
                    onPress={() => openDetailsOverlay(purchase)}>
                    <Text color="background" fontSize="md" py="sm" px="md">
                      {t.show_details}
                    </Text>
                  </TouchableOpacity>
                </Div>
              </Div>
            ))
          ) : (
            <Div h={200} alignItems="center" p="sm">
              <Div p="xl" />
              <GDFontText fontSize="3xl">
                {'구매 하신 상품이 없습니다'}
              </GDFontText>
              <Div p="lg" />
              {/* <Div> */}
              <Div shadow="lg" shadowColor="#C4C4C4">
                <ClientNavTiles {...productCards[0]} />
                <Div justifyContent="center">
                  <Text fontSize="lg" textAlign="center" h={30}>
                    {'웰니스교육 구매'}
                  </Text>
                </Div>
              </Div>
              <Div p="2xl" />
              <Div shadow="lg" shadowColor="#C4C4C4">
                <ClientNavTiles {...productCards[1]} />
                <Div justifyContent="center">
                  <Text fontSize="lg" textAlign="center" h={30}>
                    {'세컨드윈드 구매'}
                  </Text>
                </Div>
              </Div>
            </Div>
          )}
        </ScrollView>
        <FloatingChatOptionsButton
          navigateToChatbot={() =>
            navigation.navigate(stacks.CHAT_STACK, { screen: screens.CHATBOT })
          }
          navigateToNotification={() =>
            navigation.navigate(stacks.CHAT_STACK, {
              screen: screens.NOTIFICATION,
            })
          }
        />
      </Div>
    </Div>
  )
}

export default MyPagePurchasesScreen
