import * as React from 'react'
import {
  Alert,
  Platform,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native'
import {
  Div,
  Text,
  Button,
  Icon,
  Dropdown,
  Modal,
  Image,
} from 'react-native-magnus'
import Postcode from 'react-native-daum-postcode'
import {
  firestoreConnect,
  useFirebase,
  useFirestore,
  useFirestoreConnect,
} from 'react-redux-firebase'
import { useSelector } from 'react-redux'
// import auth, { firebase } from '@react-native-firebase/auth'
import axios from 'axios'
import UserService from '../services/user'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

// import products from '../components/Products'
import Config from '../config'
import Log from '../util/Log'
import Styles from '../util/Styles'
import screens from '../navigation/screens'
import stacks from '../navigation/stacks'
import GDUtil from '../util/GDUtil'

import {
  GDHeader,
  WellnessProductBox,
  TextInputWithError,
  GDFontText,
} from '../components'
import { WebView } from 'react-native-webview'
import sha256 from '../util/sha256'
import DropDownPicker from 'react-native-dropdown-picker'

import { useI18n } from '../hooks'

interface PaymentInfoScreenProps {
  navigation: any
  route: any
}

const { useState, useEffect, createRef } = React
const PaymentInfoScreen: React.FC<PaymentInfoScreenProps> = ({
  navigation,
  route,
}) => {
  const firebase = useFirebase()
  // useFirestoreConnect(['awhSessions'])
  const firestore = useFirestore()
  // const awhClasses = useSelector((state: any) => state.firestore)
  const profile = useSelector((state) => state.firebase.profile)
  const t = useI18n('paymentInfo')
  const n = useI18n('wellnessNotes')
  const i = useI18n('wellnessProductBox')
  const currentProduct = i.items[route.params.option]
  const dropdownRef = createRef()

  const [addressFinder, setAddressFinder] = useState<boolean>(false)
  const [AWHDATA, setAWHDATA] = useState<any[]>([])

  // const dropdownRefDates = React.createRef()
  const dropdownRefTimes = React.createRef()
  // const [classDate, setClassDate] = useState('')
  const [classTime, setClassTime] = useState('')
  const [awhId, setAwhId] = useState('')
  const [selectedLanguage, setSelectedLanguage] = useState('ko')
  const insets = useSafeAreaInsets()

  const [name, setName] = useState<string>(profile?.passAppData?.name ?? '')
  const [phoneNo, setPhoneNo] = useState<string>(
    profile?.passAppData['phone num'] ?? '',
  )
  // const [addr, setAddr] = useState<string>(profile?.address ?? '')
  // const [detailAddr, setDetailAddr] = useState<string>(profile?.address2 ?? '')
  const [addr, setAddr] = useState('')
  const [detailAddr, setDetailAddr] = useState('')

  const hasValidName = (str) => str.length > 2
  const hasValidFon = (fon) => fon.length > 10
  const hasValidAddress = (str) => str.length > 2
  const hasValidDetailAddr = (str) => str.length > 2

  const handleAddressFinder = () => setAddressFinder(!addressFinder)

  const [isActive, setIsActive] = useState('')

  const { option: PRODUCT_OPTION } = route.params

  const getAwh = async () => {
    Log.debug('useEffect getAwh fired ***')
    const functions = firebase.app().functions('asia-northeast3')
    const getAwhProgramsCallable = await functions.httpsCallable(
      'getAwhPrograms',
    )({ status: 'register' })
    try {
      const response = getAwhProgramsCallable.data
      Log.debug('awh programs = ', response)
      setAWHDATA(
        response.map((classTime: any) => {
          return { ...classTime, label: classTime.title }
        }),
      )
      // setAWHDATA([
      //   {
      //     label: 'MonWedFri Morning',
      //     value: 'MWFMorning',
      //     daysOfWeek: [1, 3, 5],
      //     endTime: '12:00',
      //     startTime: '10:00',
      //     title: '웰니스 온라인 교육1',
      //   },
      // ])
      // title -> label, startTime, endTime, value => id, title, daysOfWeek
    } catch (error) {
      Log.error('error awh programs = ', error)
    }
  }

  const updatePurchase = async (dataToStore: object) => {
    try {
      await firebase.updateProfile({
        purchaseHistory: firebase.firestore.FieldValue.arrayUnion(dataToStore),
      })
    } catch (error) {
      Log.error('profile update in purchase history error:', error)
    }
  }

  useEffect(() => {
    getAwh()

    return () => {
      // cleanup
    }
  }, [])

  const [showForm, setShowForm] = useState(true)
  const [showSuccessModal, setShowSuccessModal] = useState(false)

  const toggleForm = () => {
    if (!canGoToNext) return false
    else setShowForm(!showForm)
  }

  const goToNext = () => {
    if (!canGoToNext) return false
    else {
      setShowForm(false)
    }
  }

  const setActiveHandler = (value) => {
    // Log.debug('input handler: ', value)
    if (value == 'name') {
      setIsActive(value)
      // Log.debug('name: ', value)
    } else if (value == 'fon') {
      setIsActive(value)
      // Log.debug('fon: ', value)
    } else if (value == 'addr') {
      setIsActive(value)
      // Log.debug('addr: ', value)
    } else {
      setIsActive(value)
      // Log.debug('detail_adr: ', value)
    }
  }

  const setValueHandler = (value) => {
    // Log.debug('input handler: ', value)
    if (isActive == 'name') {
      setName(value)
      // Log.debug('hasValidName: ', hasValidName(value))
    } else if (isActive == 'fon') setPhoneNo(value)
    else if (isActive == 'addr') setAddr(value)
    else setDetailAddr(value)
  }

  let canGoToNext = false
  if (
    hasValidName(name) &&
    hasValidFon(phoneNo) &&
    hasValidAddress(addr) &&
    hasValidDetailAddr(detailAddr)
  )
    canGoToNext = true

  let finalizePurchaseDisabled = true
  if (route.params.option == 0) {
    // if (canGoToNext && classDate != '' && classTime != '')
    if (canGoToNext && classTime !== '') finalizePurchaseDisabled = false
  } else {
    if (canGoToNext) finalizePurchaseDisabled = false
  }

  const successBoxContent = t.successBox

  const weekdays = t.weekdays

  const timePrefix = (str) => {
    let tmp = parseInt(str.replace(/:/gi, ''))

    if (tmp < 1200) return t.am
    else return t.pm
  }

  const finalizePurchase = () => {
    setShowPaymentModal(true)
  }

  const goToNextHandler = () => {
    Log.debug('gotonext fired')
    if (route.params.option == 1)
      navigation.navigate(stacks.CLIENT_STACK, { screens: screens.CLIENT_HOME })
    else Log.debug('GO TO CLASS')
  }

  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [payNAO, setPayNAO] = useState(false)

  const PaymentGatewayModal = () => {
    const newEdiDate = new Date()
      .toISOString()
      .slice(-24)
      .replace(/\D/g, '')
      .slice(0, 14)

    // name, phoneNum, addr, detailAddr

    const newItem =
      PRODUCT_OPTION == 1 ? 'sw-watch-only' : 'awh-watch-and-program'
    const newOrderID =
      PRODUCT_OPTION == 1
        ? 'sw-watch-only' + newEdiDate
        : 'awh-watch-and-program' + newEdiDate
    const newCustName = name + '구매자'
    const newCustPhone = phoneNo
    const newCustEmail = profile.email
    const newCustAddr = addr + ' ' + detailAddr
    const newPayMethod = 'CARD'
    const newMallIP = '172.20.23.183'

    let newMID = 'descry799m'
    let newMKey =
      '9hZAws3UdMx4afH4v8HT+FeTp8klx8yyLIGQRpbz4VWkkgadz8FtfcZ6a85IQ+tFgF+ili+SzfMYPicD4FIKZQ=='
    let newAmt = String(currentProduct.idp)
    if (Config.getPayMode() == 'TEST') {
      newMID = 'nicepay00m'
      newMKey =
        'EYzu8jGGMfqaDEp76gSckuvnaHHu+bC4opsSN6lHv3b2lurNYkVXrZ7Z1AoqQnXI3eLuaUFyoRNC6FkrzVjceg=='
      newAmt = '1004'
    }
    const encHash = sha256(newEdiDate + newMID + newAmt + newMKey)

    let paramsObj = {
      // REQUIRED
      MID: newMID,
      TrKey: newMKey,
      GoodsCnt: '1',
      Moid: newOrderID,
      BuyerName: newCustName,
      BuyerTel: newCustPhone,
      BuyerEmail: newCustEmail,
      ReturnURL: Config.getPaymentReturnUrl(),
      ediDate: newEdiDate,
      PayMethod: newPayMethod,
      Amt: newAmt,
      GoodsName: newItem,
      MallIP: newMallIP,
      GoodsCl: '1',

      // OPTIONAL
      MallUserID: newCustName,
      MallReserved: '',
      BuyerAddr: newCustAddr,
      EncryptData: encHash,
      WapUrl: '',
      IspCancelUrl: '',
    }
    let form_arr = []
    for (var key in paramsObj) {
      // if (paramsObj.hasOwnProperty(key)) {
      form_arr.push(
        `${encodeURIComponent(key)}=${encodeURIComponent(paramsObj[key])}`,
      )
    }

    const form_data = form_arr.join('&')

    const handleWebViewNavigationStateChange = async (newNavState: any) => {
      // newNavState looks something like this:
      // {
      //   url?: string;
      //   title?: string;
      //   loading?: boolean;
      //   canGoBack?: boolean;
      //   canGoForward?: boolean;
      // }
      const { url } = newNavState
      Log.debug(url, 'URL STUFF *****')
      if (!url) return

      // handle certain doctypes
      if (url.includes('/payResult_utf.php')) {
        const { uid } = await firebase.auth().currentUser
        const addAwhApplicant = await UserService.awhApplicant(
          awhId,
          uid,
          new Date(),
        )
        if (!addAwhApplicant.data) {
          // Alert.alert('could not add application')
          return navigation.navigate(screens.CLIENT_HOME, {
            purchaseSuccess: false,
          })
        }

        // open a modal with the PDF viewer
        Log.debug('something here*** handle success or fail')
        // if(condition)
        // firebase.updateProfile({purchaseHistory: profile?.purchaseHistory.push() ?? [].push({}) })
        const dataToStore = {
          status: 'purchased',
          itemName: newItem,
          pgData: {
            newOrderID,
            newCustName,
            newAmt,
            newPayMethod,
            newCustPhone,
            newCustEmail,
          },
          purchaseDate: new Date(),
        }
        try {
          let purchaseData: any = {
            purchaseHistory:
              firebase.firestore.FieldValue.arrayUnion(dataToStore),
          }
          // if order is for AWH and not secondwind. profile is updated with purchased AWH to render bottom tab for icare
          if (PRODUCT_OPTION == 0) {
            purchaseData.purchasedAWH = true
            purchaseData.selectedAWHClass = classTime
          }
          await firebase.updateProfile(purchaseData)

          const doc = await firestore.collection('_purchases').doc()
          await doc.set({
            ...dataToStore,
            uid,
          })

          navigation.navigate(screens.CLIENT_HOME, { purchaseSuccess: true })
        } catch (error) {
          Log.error('profile update in purchase history error:', error)
          navigation.navigate(screens.CLIENT_HOME, { purchaseSuccess: false })
        }
      }
    }
    return (
      <Modal isVisible={showPaymentModal}>
        <Div flex={1} p="xl" pt={insets.top}>
          {!payNAO && (
            <Div justifyContent="center" alignItems="center" flex={1}>
              {/* <Text>{form_data.split('&').map((field) => field + '\n')}</Text> */}
              <Icon
                fontFamily="MaterialIcons"
                name="verified"
                fontSize="6xl"
                color="main900"
              />
              <Div p="md" />
              <Text fontSize="xl">{name}</Text>
              <Text fontSize="xl">{currentProduct.discountPrice}</Text>
              <Div p="md" />
              <Button
                block
                onPress={() => setPayNAO(true)}
                rounded="xl"
                bg="main900">
                Confirm Purchase
              </Button>
              <Div p="md" />
              <Text
                color="main900"
                fontSize="lg"
                onPress={() => navigation.goBack()}>
                Cancel Purchase
              </Text>
            </Div>
          )}
          {payNAO && (
            <WebView
              source={{
                uri: Config.getPaymentGatewayUrl(),
                method: 'POST',
                body: form_data,
                headers: {
                  'Content-Type': 'application/x-www-form-urlencoded',
                },
              }}
              useWebKit={false} // Stupid Korean cookies loving finance websites.
              // onShouldStartLoadWithRequest={onNavigationStateChange}  // Not called on first load for Android
              onNavigationStateChange={handleWebViewNavigationStateChange}
              // failure={failure}
              sharedCookiesEnabled={true}
            />
          )}
          <TouchableOpacity
            onPress={() => setShowPaymentModal(false)}
            style={{
              zIndex: 10000,
              position: 'absolute',
              top: 15,
              right: 25,
            }}>
            <Image source={Styles.images.close} w={27} h={27} />
          </TouchableOpacity>
        </Div>
      </Modal>
    )
  }

  return (
    <>
      <PaymentGatewayModal />
      <Modal isVisible={addressFinder}>
        <Postcode
          style={{ width: '100%', height: 400 }}
          jsOptions={{ animation: true }}
          onSelected={async (data) => {
            await Log.debug(JSON.stringify(data))
            ;(await selectedLanguage) == 'ko'
              ? setAddr(JSON.stringify(data.address))
              : setAddr(JSON.stringify(data.addressEnglish))
            await handleAddressFinder()
          }}
          onError={(err) => Log.debug('postcode error', err)}
        />
        <Button onPress={handleAddressFinder} bg="main900" py="lg" block>
          <Text color="white">{t.close}</Text>
        </Button>
      </Modal>

      <Dropdown
        // isVisible={showSuccessModal}
        ref={dropdownRef}
        pb="2xl"
        showSwipeIndicator={true}
        roundedTop="2xl"
        w="100%"
        title={
          <>
            <Div alignSelf="flex-end" px="lg" mx="lg" mt={-15}>
              <TouchableOpacity onPress={() => dropdownRef.current.close()}>
                <Icon
                  fontFamily="MaterialCommunityIcons"
                  name="close"
                  fontSize="xl"
                  color="dark"
                />
              </TouchableOpacity>
            </Div>
            <Div alignItems="center" mb="2xl">
              <GDFontText textWeight="700" fontSize="3xl">
                {t.successBox[route.params.option].title}
                {/* {successBoxContent[route.params.option].title} */}
              </GDFontText>
            </Div>
          </>
        }>
        <Div alignSelf="center" alignItems="center">
          <Div w="70%" mb="md">
            <Text textAlign="center">
              {t.successBox[route.params.option].msg}
            </Text>
          </Div>

          <Div my="md">
            <Button
              onPress={() => goToNextHandler()}
              bg="main900"
              rounded="circle"
              py="xs"
              alignItems="center"
              justifyContent="center"
              px={100}
              fontSize="xl">
              {t.successBox[route.params.option].btn1}
            </Button>
          </Div>
          <Div my="xs">
            <TouchableOpacity>
              <GDFontText
                color="main900"
                textWeight="700"
                fontSize="xl"
                onPress={() => dropdownRef.current.close()}>
                {t.successBox[route.params.option].btn2}
              </GDFontText>
            </TouchableOpacity>
          </Div>
        </Div>
      </Dropdown>

      <Div style={{ flex: 1 }} pt={insets.top} bg="white">
        <GDHeader>{t.title}</GDHeader>
        <Div borderBottomWidth={1} borderBottomColor="gray200" />
        <ScrollView bounces={false}>
          <Div
            py="xl"
            px="lg"
            pb="3xl"
            bg="background"
            style={Platform.OS !== 'android' && { zIndex: 10 }}>
            <GDFontText fontSize="3xl" textWeight="700" mt="lg">
              {t.title}
            </GDFontText>

            <Div row alignItems="center" mt="md" pb="lg" mb="lg">
              <Icon
                fontFamily="MaterialIcons"
                name="check-circle-outline"
                mr="md"
                fontSize="3xl"
                color="gray500"
              />
              <Text color="gray500" fontSize="lg">
                {n.freeDelivery}
              </Text>
            </Div>

            {/* Form */}

            {route.params.option == 0 && (
              <>
                <Div
                  row
                  justifyContent="space-between"
                  py="sm"
                  borderTopWidth={1}
                  borderBottomWidth={1}
                  borderColor="gray_line">
                  <Div justifyContent="center" alignItems="center">
                    <GDFontText
                      flex={8}
                      textWeight="700"
                      fontSize="lg"
                      textAlignVertical="center"
                      // borderWidth={1}
                      pt={Platform.OS == 'ios' ? 15 : 0}>
                      {t.showForm}
                    </GDFontText>
                  </Div>
                  <TouchableOpacity onPress={toggleForm}>
                    <Icon
                      fontFamily="MaterialCommunityIcons"
                      name={showForm == true ? 'minus' : 'plus'}
                      fontSize="4xl"
                      color="dark"
                      p="lg"
                    />
                  </TouchableOpacity>
                </Div>
              </>
            )}

            {showForm && (
              <Div mt="xl">
                <Div flex={1}>
                  <TextInputWithError
                    label="name"
                    value={name}
                    placeholder={t.formName}
                    error={t.nameError}
                    isActive={isActive == 'name'}
                    isValid={hasValidName(name)}
                    setActive={setActiveHandler}
                    setValue={setValueHandler}
                  />
                </Div>

                <Div mt="xs">
                  <TextInputWithError
                    label="fon"
                    value={phoneNo}
                    placeholder={t.formFon}
                    error={t.formFon}
                    isActive={isActive == 'fon'}
                    isValid={hasValidFon(phoneNo)}
                    setActive={setActiveHandler}
                    setValue={setValueHandler}
                  />
                </Div>

                <Div row mt="xs">
                  <Div flex={2.5} pt="xs">
                    <TextInputWithError
                      label="addr"
                      value={addr}
                      placeholder={t.formAddr}
                      error={t.formAddr}
                      isActive={isActive == 'addr'}
                      isValid={hasValidAddress(addr)}
                      setActive={setActiveHandler}
                      setValue={setValueHandler}
                    />
                  </Div>
                  <Div flex={1} left={7}>
                    <Button
                      onPress={handleAddressFinder}
                      w={95}
                      h={56}
                      // mx={5}
                      // mt={3}
                      // py={23}
                      rounded="xl"
                      bg="main900">
                      {t.search}
                    </Button>
                  </Div>
                </Div>

                <Div mt="xs">
                  <TextInputWithError
                    label="detailAddr"
                    value={detailAddr}
                    placeholder={t.formDetailAddr}
                    error={t.formDetailAddr}
                    isActive={isActive == 'detailAddr'}
                    isValid={hasValidDetailAddr(detailAddr)}
                    setActive={setActiveHandler}
                    setValue={setValueHandler}
                  />
                </Div>

                {route.params.option == 0 && (
                  <Div>
                    <Button
                      // disabled={addr == '' && detailAddr == ''}
                      onPress={goToNext}
                      block
                      py={17}
                      rounded="circle"
                      mb="xl"
                      bg="main900">
                      <Text color="white" opacity={!canGoToNext ? 0.35 : 1}>
                        {t.next}
                      </Text>
                    </Button>
                  </Div>
                )}
              </Div>
            )}

            {route.params.option == 0 && (
              <Div
                row
                justifyContent="space-between"
                borderTopWidth={1}
                borderBottomWidth={1}
                borderTopColor={showForm ? 'gray_line' : 'white'}
                borderBottomColor="gray_line"
                py="sm">
                <Div alignSelf="center">
                  <GDFontText textWeight="700" fontSize="lg">
                    {t.showAdditonalInfo}
                  </GDFontText>
                </Div>
                <Div>
                  <TouchableOpacity onPress={toggleForm}>
                    <Icon
                      fontFamily="MaterialCommunityIcons"
                      name={showForm == false ? 'minus' : 'plus'}
                      fontSize="4xl"
                      p="lg"
                      color="dark"
                    />
                  </TouchableOpacity>
                </Div>
              </Div>
            )}

            {!showForm && route.params.option == 0 && (
              <Div mt="lg" style={Platform.OS !== 'android' && { zIndex: 10 }}>
                <WellnessProductBox
                  option={route.params.option}
                  mode="small"
                  buttonDisabled={true}
                />

                <Div row mb="xl" mt="md">
                  <Div flex={1}>
                    <Icon
                      fontFamily="AntDesign"
                      name="exclamationcircleo"
                      fontSize="xl"
                      color="gray500"
                    />
                  </Div>
                  <Div flex={11}>
                    <Text color="gray500" fontSize="md">
                      {n.courseComplete}
                    </Text>
                  </Div>
                </Div>
                {/* flex-start the dropdown container text style */}
                <DropDownPicker
                  items={AWHDATA}
                  placeholder={t.classDropdownPlaceholder}
                  containerStyle={{ height: 60, marginBottom: 100 }}
                  style={{ backgroundColor: '#ffffff' }}
                  dropDownStyle={{
                    backgroundColor: 'white',
                  }}
                  onChangeItem={({ value, id }) => {
                    // Log.debug('onChangeItem: ', item)
                    setClassTime(value)
                    setAwhId(id)
                    Log.debug('chosen awh', value, id)
                  }}
                />
                <Div
                  pb="2xl"
                  borderBottomWidth={1}
                  borderBottomColor={Styles.colors.grayscale.lightGray}
                />
              </Div>
            )}
            <Div>
              <Div row justifyContent="space-between" my="lg">
                <Div>
                  <GDFontText textWeight="700" fontSize="2xl">
                    {t.totalAmount}
                  </GDFontText>
                </Div>
                <Div alignItems="flex-end">
                  <GDFontText textWeight="700" fontSize="2xl">
                    {currentProduct.discountPrice}
                  </GDFontText>
                  <Text color="gray400" textDecorLine="line-through">
                    {currentProduct.price}
                  </Text>
                </Div>
              </Div>
            </Div>
          </Div>
          {Platform.OS == 'android' ? <Div p="xl" /> : <Div p="2xl" />}
          <Div p="2xl" />
        </ScrollView>
        <Div
          px="lg"
          position="absolute"
          bottom={0}
          bg="white"
          pb={Platform.OS == 'android' ? insets.bottom + 15 : insets.bottom}>
          <Div>
            <Button
              disabled={finalizePurchaseDisabled}
              onPress={() => finalizePurchase()}
              py={17}
              rounded="circle"
              mt="lg"
              mb="xl"
              block
              bg="main900">
              <Text color="white" fontSize="lg">
                {t.finalizePurchase}
              </Text>
            </Button>
          </Div>

          <Div flex={1} row>
            <Div flex={1}>
              <Icon
                fontFamily="MaterialCommunityIcons"
                name="bell-outline"
                fontSize="4xl"
              />
            </Div>
            <Div flex={9}>
              <Text color="gray500" style={{ flexWrap: 'wrap' }} fontSize="md">
                {n.contactCS}
              </Text>
              <Text
                mt="sm"
                color="gray500"
                fontSize="md"
                mt="sm"
                textDecorLine="underline"
                textDecorColor="gray500">
                {n.kakaoCSLink}
              </Text>
            </Div>
          </Div>
        </Div>
      </Div>
    </>
  )
}

export default PaymentInfoScreen
