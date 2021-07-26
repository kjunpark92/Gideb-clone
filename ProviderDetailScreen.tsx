import React, { useState, useEffect, useRef } from 'react'
import {
  Alert,
  Linking,
  Platform,
  SafeAreaView,
  ScrollView,
  Share,
  StyleSheet,
  TouchableOpacity,
} from 'react-native'
import {
  Button,
  Div,
  Text,
  Dropdown,
  DropdownRef,
  Icon,
  Radio,
} from 'react-native-magnus'
import { useSelector } from 'react-redux'
import { useFirebase, useFirestore } from 'react-redux-firebase'
import UserService from '../services/user'
import Toast from 'react-native-toast-message'
import { useI18n } from '../hooks'
import { GDHeader } from '../components'
import Styles from '../util/Styles'
import MapView, { PROVIDER_GOOGLE, Marker, Callout } from 'react-native-maps'
import Log from '../util/Log'
import { getClinicCategoryThemeColorByCategory } from './SearchProvidersScreen'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

// when providers is starred -> use popup ( overlay ) that designers made instead of toast
export default function ProviderDetailScreen({ route }) {
  const { hospital } = route.params // data from 'hospitals collection' which was from 'data.gov' open api
  const [clinic, setClinic] = useState(undefined) // data from 'clinics collection' which are our partners
  const [provider, setProvider] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const t = useI18n('providerDetail')
  const insets = useSafeAreaInsets()

  const dropdownRef = React.createRef()
  const {
    nickname,
    email,
    favoriteHospitals = [],
  } = useSelector((state: any) => state.firebase.profile)
  const firebase = useFirebase()
  const firestore = useFirestore()

  const functions = firebase.app().functions('asia-northeast3')
  const getPartnerCallable = functions.httpsCallable('getPartner')
  const requestChatCallable = functions.httpsCallable('requestProviderChat')

  const [uid, setUid] = useState('')
  const getUid = async () => {
    let out = await firebase.auth().currentUser.uid
    setUid(out)
  }

  const loadClinic = async () => {
    try {
      const response = await getPartnerCallable({
        hospitalId: hospital.hospitalId,
      })
      setClinic(response.data)
      Log.info('response.data', response.data)
    } catch (error) {
      Log.error('failed to load clinic: ', error)
    }
  }

  useEffect(() => {
    loadClinic()
    getUid()
    return () => {
      // cleanup
    }
  }, [])

  const handleRequestChat = async () => {
    const requester = {
      uid: firebase.auth().currentUser.uid,
      nickname,
      email,
    }
    const requestee = {
      uid: provider.uid,
      name: provider.name,
      nickname: provider.nickname,
      email: provider.email,
    }

    Log.info('requestee', requestee)
    Log.info('requester', requester)
    try {
      setIsLoading(true)
      const { data } = await requestChatCallable({ requestee, requester })
      const { result } = data
      Log.info('result', result)
      Toast.show({
        type: 'info',
        text1:
          result === 'ok'
            ? t.requestChatSuccess
            : result === 'already requested'
            ? t.requestChatAlreadySent
            : t.requestChatFailure,
      })
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: t.requestChatFailure,
      })
      console.error('failed to requestChat: ', error)
    } finally {
      setIsLoading(false)
      dropdownRef?.current?.close()
    }
  }

  const handleRequestLinkClinic = async () => {
    const requester = {
      uid: firebase.auth().currentUser.uid,
      nickname,
      email,
    }
    try {
      setIsLoading(true)
      const { result } = await UserService.requestLinkClinic(
        hospital,
        requester,
      )
      Toast.show({
        type: 'info',
        text1:
          result === 'ok'
            ? t.requestLinkClinicSuccess
            : result === 'already requested'
            ? t.requestLinkClinicAlreadySent
            : t.requestLinkClinicFailure,
      })
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: t.requestLinkClinicFailure,
      })
      console.error('failed to requestLinkClinic: ', error)
    } finally {
      setIsLoading(false)
      dropdownRef?.current?.close()
    }
  }

  const handleShare = () => {
    Log.info('share')
    Share.share({
      message: `[${hospital.title1}]\n-주소: ${hospital.address1}\n-전화: ${hospital.phoneNo}\n-홈페이지: ${hospital.website}`,
      url: 'https://gideb.com',
    })
  }

  const handleStar = () => {
    Log.info('set favorite')
    setFavorite()
  }

  const setFavorite = async () => {
    Log.debug('setFavorite fired; hospital: ', hospital)
    try {
      const isAlreadyFavorite = favoriteHospitals.includes(hospital.hospitalId)
      let res = await firestore
        .collection('users')
        .doc(uid)
        .update({
          favoriteHospitals: isAlreadyFavorite
            ? firestore.FieldValue.arrayRemove(hospital.hospitalId)
            : firestore.FieldValue.arrayUnion(hospital.hospitalId),
        })
      Toast.show({
        type: 'info',
        text1: isAlreadyFavorite ? t.favoriteRemoved : t.favoriteAdded,
      })
    } catch (error) {
      Log.debug('err', error)
      Toast.show({
        type: 'error',
        text1: error,
      })
    }
  }

  const GidebRequestButton = ({ clinic }) => (
    <Div p={Platform.OS == 'ios' ? 'lg' : 0}>
      <Button
        rounded={Platform.OS == 'ios' ? 'circle' : 'none'}
        bg="main900"
        block
        my="xl"
        p="xl"
        disabled={clinic && !provider}
        onPress={() => dropdownRef.current.open()}
        loading={clinic === undefined || isLoading}>
        <Text fontSize="xl" fontWeight="800" color="white">
          {clinic ? t.requestChat : t.requestLinkClinicButtonTitle}
        </Text>
      </Button>

      <Dropdown
        ref={dropdownRef}
        title={
          <Text
            mx="xl"
            color="gray900"
            pb="md"
            fontSize="3xl"
            textAlign="center">
            {clinic ? t.confirmRequestChat : t.confirmRequestLinkClinic}
          </Text>
        }
        mt="md"
        pb="2xl"
        showSwipeIndicator={true}
        roundedTop="xl">
        <Div w="100%" p="xl" justifyContent="center">
          <Button
            loading={isLoading}
            block
            mb="md"
            onPress={clinic ? handleRequestChat : handleRequestLinkClinic}>
            {t.yes}
          </Button>
          <Button block onPress={() => dropdownRef.current.close()}>
            {t.no}
          </Button>
        </Div>
      </Dropdown>
    </Div>
  )

  const Providers = ({ providers = {} }) => {
    return (
      <Radio.Group
        row
        justifyContent="space-around"
        onChange={(provider) => {
          Log.info('provider = ', provider)
          setProvider(provider)
        }}>
        {Object.keys(providers)
          .map((uid) => {
            return { uid, ...providers[uid] }
          })
          .map((_provider, idx) => (
            <Radio
              key={idx}
              value={_provider}
              bg="gray300"
              justifyContent="center"
              alignItems="center"
              rounded="xl">
              {({ checked }) => (
                <Div
                  p="xl"
                  rounded="xl"
                  key={idx}
                  borderColor={
                    provider?.uid === _provider.uid ? 'black' : 'white'
                  }
                  borderWidth={2}>
                  <Icon
                    color="black"
                    fontSize="6xl"
                    name="user"
                    fontFamily="AntDesign"
                  />
                  <Text color="black">{_provider?.name}</Text>
                </Div>
              )}
            </Radio>
          ))}
      </Radio.Group>
    )
  }

  const RoundBox = ({ title, value }) => (
    <Div bg="gray100" p="xl" mb="sm">
      <Text color="gray500" mb="lg">
        {title}
      </Text>
      <Text>{value}</Text>
    </Div>
  )

  return (
    <Div flex={1} bg="white" pt={insets.top}>
      <GDHeader
        borderBottomWidth={1}
        borderBottomColor={Styles.colors.grayscale.lightGray}
        p={0}
        suffix={
          <Div row w={80} m={10} justifyContent="space-between">
            <TouchableOpacity onPress={handleShare}>
              <Icon
                fontFamily="MaterialIcons"
                name="share"
                fontSize={'5xl'}
                color={Styles.colors.grayscale.blackGray}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleStar}>
              <Icon
                fontFamily="MaterialIcons"
                name={
                  favoriteHospitals.includes(hospital.hospitalId)
                    ? 'star'
                    : 'star-border'
                }
                fontSize={'5xl'}
                color={Styles.colors.grayscale.blackGray}
              />
            </TouchableOpacity>
          </Div>
        }>
        {hospital.title1}
      </GDHeader>

      <ScrollView contentContainerStyle={{ marginBottom: 0 }}>
        <MapView
          // provider={PROVIDER_GOOGLE} // remove if not using Google Maps
          style={{ height: 214, width: '100%' }}
          region={{
            latitude: hospital.lat,
            longitude: hospital.lng,
            latitudeDelta: 0.015 / 10,
            longitudeDelta: 0.0121 / 10,
          }}>
          <Marker
            key={hospital.hospitalId}
            coordinate={{
              latitude: hospital.lat,
              longitude: hospital.lng,
            }}>
            <Div
              rounded="circle"
              w={20}
              h={20}
              bg={getClinicCategoryThemeColorByCategory(hospital.category)[0]}
            />
            <Callout>
              <Div w={100} justifyContent="center" alignItems="center">
                <Text fontSize="md">{hospital.title1}</Text>
                <Text fontSize="sm" color="gray600">
                  {hospital.category}
                </Text>
                <Text fontSize="sm">{hospital.address1}</Text>
                <Text fontSize="sm">{hospital.phoneNo}</Text>
              </Div>
            </Callout>
          </Marker>
        </MapView>
        <Div px="llg">
          <Div row alignItems="center" pt="lg">
            <Div
              mr="lg"
              rounded="circle"
              w={20}
              h={20}
              bg={getClinicCategoryThemeColorByCategory(hospital.category)[0]}
            />
            <Text fontSize="lg">{hospital.category}</Text>
            <Button bg="white">
              <Icon
                fontFamily="SimpleLineIcons"
                name="question"
                fontSize={20}
              />
            </Button>
          </Div>
          <Div row alignItems="center" justifyContent="space-between">
            <Text fontSize="xl" fontWeight="bold">
              {hospital.title1}
            </Text>
            <Button
              bg="gray100"
              rounded="circle"
              py="md"
              onPress={() => Linking.openURL(`tel:${hospital.phoneNo}`)}>
              <Icon
                name="phone"
                fontFamily="MaterialIcons"
                color="black"
                pr="sm"
              />
              <Text>전화</Text>
            </Button>
          </Div>
          <Div row>
            <Text color="gray500">
              {/* {hospital?.distanceInKm?.toFixed(1) ?? 'N/a'} km */}
            </Text>
          </Div>
          <RoundBox title="주소" value={hospital.address1} />
          <RoundBox title="번호" value={hospital.phoneNo} />
          <RoundBox title="홈페이지" value={hospital.website} />

          <Providers providers={clinic?.providers} />
        </Div>
      </ScrollView>
      <Div position="absolute" bottom={0}>
        <GidebRequestButton clinic={clinic} />
      </Div>
    </Div>
  )
}
