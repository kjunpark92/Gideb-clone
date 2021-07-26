import * as React from 'react'
import { ScrollView, TouchableOpacity } from 'react-native'
import { Div, Text, Icon, Button } from 'react-native-magnus'
import { GDFontText, GDHeader } from '../components'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { useI18n } from '../hooks'
import Log from '../util/Log'
import Styles from '../util/Styles'

import Geolocation from '@react-native-community/geolocation'
import { useFirestore } from 'react-redux-firebase'
import { useSelector } from 'react-redux'
import screens from '../navigation/screens'
import stacks from '../navigation/stacks'
import { inlineStyles } from 'react-native-svg'

interface HospitalBookmarksScreenProps {}

const { useEffect, useState } = React
const HospitalBookmarksScreen: React.FC<HospitalBookmarksScreenProps> = ({
  navigation,
}) => {
  const t = useI18n('hospitalBookmarks')
  const firestore = useFirestore()
  const insets = useSafeAreaInsets()

  const profile = useSelector((state: any) => state.firebase.profile)
  const [myHospitals, setMyHospitals] = useState(
    profile?.favoriteHospitals ?? [],
  )
  const [isLoading, setIsLoading] = useState(false)

  const [myFavorites, setMyFavorites] = useState([])

  const colorCode = {
    정신의료기관: '#788AE5',
    상담센터: '#D678E5',
    정신건강증진센터: '#9BDE67',
  }
  const [userGeoLocation, setUserGeoLocation] = useState({})

  const initData = async () => {
    const { favoriteHospitals = [] } = profile
    Log.debug('favoriteHospitals = ', favoriteHospitals)
    try {
      const populatedHospitals = await Promise.all(
        favoriteHospitals.map(async (uid) =>
          (await firestore.collection('hospitals').doc(uid).get()).data(),
        ),
      )
      // Log.debug(firestore.app().collection('hospitals').doc(uid).get().data())
      await Log.debug('populated hospitals = ', populatedHospitals)
      setMyFavorites(populatedHospitals)
    } catch (error) {
      console.error('error ', error)
    }
  }

  const getCurrentPosition = async () => {
    try {
      // const granted = await PermissionsAndroid.request(
      //   PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      //   {
      //     title: 'Cool Photo App Camera Permission',
      //     message:
      //       'Cool Photo App needs access to your camera ' +
      //       'so you can take awesome pictures.',
      //     buttonNeutral: 'Ask Me Later',
      //     buttonNegative: 'Cancel',
      //     buttonPositive: 'OK',
      //   },
      // )
      // if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      Geolocation.getCurrentPosition(({ coords }) => {
        Log.debug('getCurrentPosition: info:', coords)
        setUserGeoLocation(coords)
        Log.debug('userGeoLocation:', userGeoLocation)
      })
      // } else {
      //   console.log('Permission denied')
      // }
    } catch (err) {
      console.warn(err)
    }
  }
  useEffect(() => {
    Log.debug('**** HOSPITALBOOKMARKS SCREEN ***')
    initData()
    getCurrentPosition()
  }, [])

  const getDistance = (coordinate2: object) => {
    const toRadian = (n) => (n * Math.PI) / 180
    let lat2 = coordinate2.lat
    let lon2 = coordinate2.lon
    let cc = userGeoLocation
    let lat1 = cc.latitude
    let lon1 = cc.longitude
    let R = 6371 // km
    let x1 = lat2 - lat1
    let dLat = toRadian(x1)
    let x2 = lon2 - lon1
    let dLon = toRadian(x2)
    let a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRadian(lat1)) *
        Math.cos(toRadian(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2)
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    let d = R * c
    return d.toFixed(1) + 'km'
  }

  interface HospitalCardProps {
    hospital: object
  }

  const HospitalCard: React.FC<HospitalCardProps> = ({ hospital }) => (
    <TouchableOpacity
      onPress={() => {
        // navigation.navigate(screens.PROVIDER_DETAIL, {
        //   hospital,
        // })
        navigation.navigate(stacks.SEARCH_STACK, {
          screen: screens.PROVIDER_DETAIL,
          params: {
            hospital: {
              ...hospital,
              distanceInKm: getDistance({
                lon: hospital.lng,
                lat: hospital.lat,
              }),
            },
          },
        })
      }}>
      <Div bg="gray150" rounded="2xl" p="xl" my="md">
        <Div row justifyContent="space-between">
          <Div row>
            <Icon
              fontFamily="FontAwesome"
              name="circle"
              fontSize="4xl"
              color={colorCode['정신의료기관']}
            />
            <Text ml="md" fontSize="lg">
              {hospital.category}
              {/* {
                <Button onPress={() => Log.debug('DEV***', hospital)}>
                  DEV
                </Button>
              } */}
              {/* {JSON.stringify(hospital)} */}
            </Text>
          </Div>
          <Div justifyContent="center">
            <Icon
              fontFamily="FontAwesome"
              name="star"
              fontSize="4xl"
              color="gray900"
            />
          </Div>
        </Div>
        <Div my="lg">
          <GDFontText fontSize="xl">{hospital.title1}</GDFontText>
          <Div row alignItems="center" mt="lg">
            <Text color="gray500" fontSize="lg">
              {getDistance({ lon: hospital.lng, lat: hospital.lat })}
            </Text>
            <Text color="gray500" ml="md" fontSize="lg">
              {hospital.address1}
            </Text>
          </Div>
        </Div>
      </Div>
    </TouchableOpacity>
  )

  return (
    <Div flex={1} bg="white" pt={insets.top}>
      <ScrollView style={{ flex: 1 }} bounces={false}>
        <GDHeader>{t.title}</GDHeader>

        <Div
          bg="white"
          style={{ flex: 1 }}
          p="lg"
          borderTopWidth={1}
          borderColor={Styles.colors.grayscale.lightGray}>
          {myHospitals.length == 0 ? (
            <Div top={100} justifyContent="center" alignSelf="center" flex={1}>
              <GDFontText
                lineHeight={30}
                textAlign="center"
                color="gray900"
                fontSize="xl">
                {t.noBookmarks}
              </GDFontText>
            </Div>
          ) : isLoading ? (
            <Div flex={1} justifyContent="center">
              <Text textAlign="center">Loading...</Text>
            </Div>
          ) : (
            <>
              <Div row my="2xl">
                <GDFontText fontSize="3xl" textWeight="700">
                  {t.number}
                </GDFontText>
                <GDFontText fontSize="3xl" ml="md" textWeight="700">
                  {myHospitals.length}
                </GDFontText>
                <GDFontText textWeight="700" fontSize="3xl">
                  {t.items}
                </GDFontText>
              </Div>
              {myFavorites.map((h, i) => (
                <HospitalCard hospital={h} key={String(i)} />
              ))}
              <Div mb="xl" />
            </>
          )}
        </Div>
      </ScrollView>
    </Div>
  )
}

export default HospitalBookmarksScreen
