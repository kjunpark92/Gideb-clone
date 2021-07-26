// NEED TO FIX FONTS
import * as React from 'react'
import {
  StyleSheet,
  ScrollView,
  Linking,
  TouchableOpacity,
  Touchable,
  Platform,
  ActivityIndicator,
} from 'react-native'
import {
  SafeAreaView as NavSafeAreaView,
  useSafeAreaFrame,
} from 'react-native-safe-area-context'
import {
  Button,
  Div,
  Text,
  Image,
  Header,
  Icon,
  Radio,
  Host,
  Portal,
  Fab,
  Modal,
  Input,
  Toggle,
  Checkbox,
  Select,
  SelectRef,
  useTheme,
} from 'react-native-magnus'

import _, { map } from 'lodash'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import DropDownPicker from 'react-native-dropdown-picker'
import Slider from '@react-native-community/slider'
import { GDHeader, GDFontText } from '../components'

// import Geolocation from '@react-native-community/geolocation'
import Geolocation from 'react-native-geolocation-service'
import MapView, { PROVIDER_GOOGLE, Marker, Callout } from 'react-native-maps'

// react-navigation
import {
  NavigationParams,
  NavigationScreenProp,
  NavigationState,
} from 'react-navigation'

import Lang from '../util/Lang'
import { useI18n } from '../hooks'
import asyncStorage from '../asyncStorage'
import storageItems from '../asyncStorage/storageItems'
import SearchProvidersService from '../services/searchProviders'
import Styles from '../util/Styles'
import Log from '../util/Log'
import screens from '../navigation/screens'
import GDCheckButton from '../components/GDCheckButton'
import { FlatList } from 'react-native'
import { sigunCode } from '../util/sigunCode'
import { useFirebase, useFirestore } from 'react-redux-firebase'

interface SearchProvidersProps {
  navigation: NavigationScreenProp<NavigationState, NavigationParams>
}

interface ListingInfoBlockProps {
  type: string
  name: string
  distance: string
  address: string
}

const CLINIC_CATEGORIES = [
  '광역형정신건강증진센터',
  '기초정신건강증진센터',
  '보건소',
  '자살예방센터',
  '정신요양시설',
  '정신의료기관',
  '중독관리통합지원센터',
  '사회복귀시설',
]

const CLINIC_CATEGORIES_COLORS = [
  ['#788AE5', 'rgba(120, 138, 229, 0.12)'],
  ['#D678E5', 'rgba(214, 120, 229, 0.12)'],
  ['#A8E578', 'rgba(167, 229, 120, 0.12)'],
]

export const getClinicCategoryThemeColorByCategory = (category: string) =>
  CLINIC_CATEGORIES_COLORS[
    _.findLastIndex(CLINIC_CATEGORIES, (item) => item === category) %
      CLINIC_CATEGORIES_COLORS.length
  ]
export const getClinicCategoryThemeColorByIndex = (index: number) =>
  CLINIC_CATEGORIES_COLORS[index % CLINIC_CATEGORIES_COLORS.length]

const RECENT_SEARCH_TERMS = ['Option A', 'Option B', 'Option C', 'Option D']
const CLINCS_SEARCH_LIST = [
  {
    type: 'something',
    name: 'good hospital',
    distance: '1.0',
    address: '서울특별시 관악구 봉천동 168-21',
  },
  {
    type: 'something',
    name: 'good hospital',
    distance: '1.0',
    address: '서울특별시 관악구 봉천동 168-21',
  },
  {
    type: 'something',
    name: 'good hospital',
    distance: '1.0',
    address: '서울특별시 관악구 봉천동 168-21',
  },
]

// Change Request button color and make it rounded
const { useState, useEffect, useRef } = React
const SearchProvidersScreen: React.FC<SearchProvidersProps> = ({
  navigation,
}) => {
  const { theme } = useTheme()
  const frameRect = useSafeAreaFrame()
  const [selectedGu, setSelectedGu] = useState('')
  const [hospitals, setHospitals] = useState([])
  const [filteredHospitals, setFilteredHospitals] = useState([])
  const [viewType, setViewType] = useState('map')
  const [searchModalVisible, setSearchModalVisible] = useState(false)
  const [filterModalVisible, setFilterModalVisible] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [recentSearches, setRecentSearches] = useState([])
  const [filterKoreanSelect, setFilterKoreanSelect] = useState(false)
  const [filterEnglishSelect, setFilterEnglishSelect] = useState(false)
  const [selectedArea, setSelectedArea] = useState(null)
  const [searchRadius, setSearchRadius] = useState(40)
  const [currentLocation, setCurrentLocation] = useState<number[] | null>(null)
  const [selectedCategories, setSelectedCategories] =
    useState(CLINIC_CATEGORIES)
  const [processingHospitals, setProcessingHospitals] = useState(false)

  const selectRef = React.createRef<SelectRef>()

  const t = useI18n('searchProvider')
  const firestore = useFirestore()
  const insets = useSafeAreaInsets()
  // Log.debug('insets = ', insets)

  const settingRecentSearches = async () => {
    const searchTermsFromAsync = await asyncStorage.get(
      storageItems.RECENT_SEARCHES,
    )
    setRecentSearches(searchTermsFromAsync ? searchTermsFromAsync : [])
  }
  useEffect(() => {
    // Geolocation.setRNConfiguration({ authorizationLevel: 'whenInUse' })
    // Geolocation.requestAuthorization()
    // function
    if (Platform.OS == 'ios') {
      Geolocation.requestAuthorization('whenInUse')
        .then((result) => {
          if (result === 'granted') {
            getCurrentPosition()
            settingRecentSearches()
          }
        })
        .catch((error) => console.log(error))
    } else {
      getCurrentPosition()
      settingRecentSearches()
    }
  }, [])

  useEffect(() => {
    getHospitalsByCoords(currentLocation)
    return () => {
      // cleanup
    }
  }, [currentLocation])

  useEffect(() => {
    if (selectedArea) {
      console.log('selectedArea = ', selectedArea)
      getHospitalsBySigunCode(selectedArea)
    }
    return () => {
      // cleanup
    }
  }, [selectedArea])

  useEffect(() => {
    if (!hospitals) return
    // Log.debug('selectedCategories = ', selectedCategories)
    // Log.debug('CLINIC_CATEGORIES = ', CLINIC_CATEGORIES)

    setProcessingHospitals(true)
    const found = _.filter(hospitals, (hospital) =>
      selectedCategories.includes(hospital.category),
    )
    Log.debug('found = ', found.length)
    setFilteredHospitals(found)
    setProcessingHospitals(false)
    return () => {
      // cleanup
    }
  }, [hospitals, selectedCategories])

  const getCurrentPosition = async () => {
    Log.debug('getCurrentPosition in')
    const getCurrentPositionAsync = () =>
      new Promise((resolve, error) =>
        Geolocation.getCurrentPosition(resolve, error, {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 10000,
        }),
      )

    try {
      const result = await getCurrentPositionAsync()
      Log.debug('result = ', result)
      const { coords } = result
      Log.debug('getCurrentPosition: coords:', coords)
      setCurrentLocation([coords.longitude, coords.latitude])
      getHospitalsByCoords([coords.longitude, coords.latitude])
    } catch (error) {
      Log.error('failed to getCurrentPosition = ', error)
    }
  }

  const getHospitalsByCoords = async (coords: any) => {
    try {
      Log.debug('coords = ', coords)
      const { results } = await SearchProvidersService.withinRadius(
        coords[0],
        coords[1],
        4000,
      )
      setHospitals(results)
    } catch (error) {
      Log.error('getHospitalsByCoords: err:', error)
    }
  }

  const getHospitalsBySigunCode = async (selectedArea: number | null) => {
    try {
      const colsnap = await firestore
        .collection('hospitals')
        .where('sicode', '==', selectedArea)
        .get()
      if (colsnap.docs.length > 0) {
        const results = colsnap.docs.map((doc) => doc.data())
        console.log('[getHospitalsBySigunCode] hospitals =', results)
        setHospitals(results)
      } else {
        setHospitals([])
        console.log('not found')
      }
    } catch (error) {
      setHospitals([])
      console.error('failed to get hospitals by sigunCode = ', error)
    }
  }

  const searchHospitalByTerm = async () => {
    const searchedItems = await asyncStorage.get(storageItems.RECENT_SEARCHES)
    if (searchedItems)
      await asyncStorage.set(storageItems.RECENT_SEARCHES, [
        ...searchedItems,
        searchTerm,
      ])
    else await asyncStorage.set(storageItems.RECENT_SEARCHES, [searchTerm])
    Log.debug('anything here?', searchedItems, searchTerm)
    const newTerms = await asyncStorage.get(storageItems.RECENT_SEARCHES)
    setRecentSearches(newTerms)
    setSearchTerm('')
  }

  const ListingInfoBlock: React.FC<ListingInfoBlockProps> = ({
    type,
    name,
    distance,
    address,
  }) => (
    <Div
      mx="xl"
      h={150}
      m={5}
      p={20}
      rounded="xl"
      bg="gray100"
      borderColor="white"
      borderWidth={1}
      shadow="xs">
      <Div row>
        <Div row>
          <Icon
            fontFamily="Ionicons"
            name="medical-outline"
            fontSize="3xl"
            mr={10}
          />
          <Text fontSize="xl">{type}</Text>
        </Div>
      </Div>
      <GDFontText fontSize="3xl" textWeight="bold" pt={10}>
        {name}
      </GDFontText>
      <Text
        pt={20}
        fontSize="lg"
        color={
          Styles.colors.grayscale.dimGray
        }>{`${distance}km ${address}`}</Text>
    </Div>
  )

  const handleSearchClinics = async () => {
    const foundProviders = await SearchProvidersService.search(selectedGu)
    setHospitals(foundProviders)
  }

  const handleViewChange = (type) => setViewType(type)

  const handleSearchModal = () => setSearchModalVisible(!searchModalVisible)

  const handleFilterModal = () => setFilterModalVisible(!filterModalVisible)

  const handleDeleteRecentSearch = async (indexToDelete: number) => {
    recentSearches.splice(indexToDelete, 1)
    await asyncStorage.set(storageItems.RECENT_SEARCHES, [...recentSearches])
    setRecentSearches([...recentSearches])
  }

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() =>
          navigation.navigate(screens.PROVIDER_DETAIL, { hospital: item })
        }>
        <ListingInfoBlock
          type={item.category}
          name={item.title1}
          distance={item.distanceInKm?.toFixed(2)}
          address={item.address1}
        />
      </TouchableOpacity>
    )
  }

  return (
    <Div bg="white" pt={insets.top}>
      <ScrollView bounces={false}>
        {/* Search modal starts here */}
        <Modal isVisible={searchModalVisible}>
          <Header
            borderBottomWidth={1}
            borderBottomColor={Styles.colors.grayscale.lightGray}
            p="lg"
            shadow="none"
            alignment="center"
            fontSize="xl"
            prefix={
              <Button bg="transparent" onPress={handleSearchModal}>
                <Icon
                  name="arrow-back-ios"
                  fontFamily="MaterialIcons"
                  fontSize="3xl"
                  color="gray900"
                />
              </Button>
            }>
            <GDFontText fontSize="xl" textWeight="bold">
              {t.topHeader.search}
            </GDFontText>
          </Header>
          <Div p="lg">
            <Input
              onChangeText={setSearchTerm}
              value={searchTerm}
              bg={Styles.colors.grayscale.lighterGray}
              suffix={
                <TouchableOpacity
                  disabled={searchTerm == '' ? true : false}
                  onPress={searchHospitalByTerm}>
                  <Icon
                    fontFamily="MaterialIcons"
                    name="search"
                    color={
                      searchTerm == ''
                        ? Styles.colors.grayscale.silver
                        : Styles.colors.grayscale.blackGray
                    }
                    fontSize="3xl"
                  />
                </TouchableOpacity>
              }
              borderColor={Styles.colors.grayscale.lighterGray}
              placeholder={t.searchPlaceholder}
            />
          </Div>
          <Div p="lg" row justifyContent="space-between">
            <GDFontText fontSize="2xl" textWeight="bold">
              {t.recentSearches}
            </GDFontText>
            <TouchableOpacity
              onPress={async () => {
                await asyncStorage.set(storageItems.RECENT_SEARCHES, [])
                setRecentSearches([])
              }}>
              <Text color="gray500">{'전체삭제'}</Text>
            </TouchableOpacity>
          </Div>
          <Div p="lg">
            {recentSearches.map((recentSearch, i) => (
              <Div key={String(i)} p={15} justifyContent="space-between" row>
                <Text>{recentSearch}</Text>
                <TouchableOpacity onPress={() => handleDeleteRecentSearch(i)}>
                  <Icon
                    fontFamily="MaterialIcons"
                    name="cancel"
                    fontSize="xl"
                  />
                </TouchableOpacity>
              </Div>
            ))}
          </Div>
        </Modal>
        {/* Filtering modal starts here */}
        <Modal isVisible={filterModalVisible}>
          <Header
            borderBottomWidth={1}
            borderBottomColor={Styles.colors.grayscale.lightGray}
            p="lg"
            shadow="none"
            alignment="center"
            fontSize="xl"
            prefix={
              <Button bg="transparent" onPress={handleFilterModal}>
                <Icon
                  name="arrow-back-ios"
                  fontFamily="MaterialIcons"
                  fontSize="3xl"
                  color="gray900"
                />
              </Button>
            }
            suffix={
              <TouchableOpacity onPress={() => Log.debug('RESET PRESSED')}>
                <Div p="lg">
                  <Text fontSize="xl" color={Styles.colors.grayscale.dimGray}>
                    {t.resetFilter}
                  </Text>
                </Div>
              </TouchableOpacity>
            }>
            <GDFontText fontSize="3xl" textWeight="bold">
              {t.topHeader.filter}
            </GDFontText>
          </Header>
          <Div p={20}>
            <Div row alignItems="center" pb="xl">
              <Checkbox value="searchByArea" mr="sm" />
              <Text fontSize="lg">{t.area}</Text>
            </Div>

            <Select
              onSelect={setSelectedArea}
              ref={selectRef}
              value={selectedArea}
              title={t.selectArea}
              mt="md"
              pb="2xl"
              roundedTop="xl"
              data={sigunCode}
              renderItem={(item, index) => (
                <Select.Option value={item.value}>
                  <Text fontSize="xl">{item.label}</Text>
                </Select.Option>
              )}></Select>
            <Button onPress={() => selectRef.current?.open()}>
              {_.findLast(sigunCode, { value: selectedArea })?.label ||
                t.selectArea}
            </Button>
            {/* <DropDownPicker
              items={sigunCode}
              placeholder={t.selectArea}
              containerStyle={{ height: 50 }}
              // style={{ backgroundColor: '#fafafa' }}
              itemStyle={{
                justifyContent: 'flex-start',
              }}
              dropDownStyle={{ backgroundColor: '#fafafa' }}
              onChangeItem={setSelectedArea}
            /> */}
          </Div>
          <Div
            p="lg"
            m={20}
            borderBottomColor={Styles.colors.grayscale.lightGray}
            borderBottomWidth={1}
          />
          <Div p={20}>
            <Text fontSize="lg" color={Styles.colors.grayscale.dimGray}>
              {t.language}
            </Text>
            <Div pt="xl" row justifyContent="space-between">
              <GDFontText textWeight="bold" fontSize="xl">
                {'한국어'}
              </GDFontText>
              <Toggle
                on={filterKoreanSelect}
                onPress={() => setFilterKoreanSelect(!filterKoreanSelect)}
                bg="gray200"
                circleBg={Styles.colors.grayscale.dimGray}
                activeBg={Styles.colors.grayscale.lightGray} // change to lighter purple
                activeCircleBg={Styles.colors.client.purple}
                h={30}
                w={60}
              />
            </Div>
            <Div py="xs" row justifyContent="space-between">
              <GDFontText textWeight="bold" fontSize="xl">
                {'ENGLISH'}
              </GDFontText>
              <Toggle
                on={filterEnglishSelect}
                onPress={() => setFilterEnglishSelect(!filterEnglishSelect)}
                bg="gray200"
                circleBg={Styles.colors.grayscale.dimGray}
                activeBg={Styles.colors.grayscale.lightGray} // change to lighter purple
                activeCircleBg={Styles.colors.client.purple}
                h={30}
                w={60}
              />
            </Div>
          </Div>
          <Div
            m={20}
            borderBottomColor={Styles.colors.grayscale.lightGray}
            borderBottomWidth={1}
          />
          <Div row justifyContent="space-between" p={20}>
            <Text fontSize="lg" color={Styles.colors.grayscale.dimGray}>
              {'내 현재 위치'}
            </Text>
            <GDFontText fontSize="lg" textWeight="bold">
              {!selectedArea ? 'choose' : selectedArea.label}
            </GDFontText>
          </Div>
          <Div p={20}>
            <Text fontSize="lg" color={Styles.colors.grayscale.dimGray}>
              {'내 위치로부터의 거리(km)'}
            </Text>
            <Slider
              minimumTrackTintColor={Styles.colors.client.purple}
              minimumValue={1}
              maximumValue={100}
              step={1}
              value={searchRadius}
              onValueChange={setSearchRadius}
            />
            <Div row justifyContent="space-between">
              <Text color={Styles.colors.grayscale.dimGray}>{0}</Text>
              <Text>{searchRadius}</Text>
              <Text color={Styles.colors.grayscale.dimGray}>{100}</Text>
            </Div>
          </Div>
        </Modal>
        <Host>
          <GDHeader
            bottomLine
            py={0}
            suffix={
              <Div row w={80} m={10} justifyContent="space-between">
                <TouchableOpacity onPress={handleSearchModal}>
                  <Icon
                    fontFamily="MaterialIcons"
                    name="search"
                    fontSize={32}
                    color={Styles.colors.grayscale.blackGray}
                  />
                </TouchableOpacity>
                <TouchableOpacity onPress={handleFilterModal}>
                  <Icon
                    fontFamily="MaterialIcons"
                    name="tune"
                    fontSize={32}
                    color={Styles.colors.grayscale.blackGray}
                  />
                </TouchableOpacity>
              </Div>
            }>
            {t.topHeader.findClinic}
          </GDHeader>
          <Div
            row
            p={1}
            h={60}
            alignItems="center"
            borderBottomWidth={1}
            borderBottomColor={Styles.colors.grayscale.lightGray}>
            <Div justifyContent="center" mr="md" w={50} h={50} rounded="circle">
              <Icon
                fontFamily="SimpleLineIcons"
                name="question"
                fontSize="3xl"
                fontWeight="bold"
              />
            </Div>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              bounces={true}>
              {/* <GDCheckButton
                loading={processingHospitals}
                checked={selectedCategories.length === CLINIC_CATEGORIES.length}
                onPress={() => {
                  setSelectedCategories(
                    selectedCategories.length === CLINIC_CATEGORIES.length
                      ? []
                      : CLINIC_CATEGORIES,
                  )
                }}>
                전체
              </GDCheckButton> */}
              {CLINIC_CATEGORIES.map((category, idx) => (
                <GDCheckButton
                  checkedStyle={{
                    bg: getClinicCategoryThemeColorByIndex(idx)[1],
                    borderColor: getClinicCategoryThemeColorByIndex(idx)[0],
                    color: getClinicCategoryThemeColorByIndex(idx)[0],
                  }}
                  uncheckedStyle={{
                    bg: 'white',
                    borderColor: 'gray400',
                    color: 'gray400',
                  }}
                  key={idx}
                  loading={processingHospitals}
                  checked={selectedCategories.includes(category)}
                  onPress={() => {
                    const newSelectedCategories = selectedCategories.includes(
                      category,
                    )
                      ? _.difference(selectedCategories, [category])
                      : _.union(selectedCategories, [category])
                    console.log(
                      'newSelectedCategories = ',
                      newSelectedCategories,
                    )
                    setSelectedCategories(newSelectedCategories)
                  }}>
                  {category}
                </GDCheckButton>
              ))}
            </ScrollView>
          </Div>
          <Div
            bg={Styles.colors.grayscale.white}
            h={frameRect.height - 140}
            w={'100%'}>
            {viewType == 'map' ? (
              currentLocation ? (
                <MapView
                  // provider={PROVIDER_GOOGLE} // remove if not using Google Maps
                  style={{ flex: 1 }}
                  region={{
                    longitude: currentLocation[0],
                    latitude: currentLocation[1],
                    latitudeDelta: 0.015 * 20,
                    longitudeDelta: 0.0121 * 20,
                  }}
                  zoomControlEnabled
                  // onRegionChangeComplete={(region) => {
                  //   Log.debug('onRegionChangeComplete entered', region)
                  //   setCurrentLocation([region.longitude, region.latitude])
                  // }}
                >
                  {filteredHospitals.map((hospital, index) => (
                    <Marker
                      key={index}
                      coordinate={{
                        longitude: hospital.lng,
                        latitude: hospital.lat,
                      }}>
                      <Div
                        rounded="circle"
                        w={20}
                        h={20}
                        shadow="xl"
                        bg={
                          getClinicCategoryThemeColorByCategory(
                            hospital.category,
                          )[0]
                        }
                      />
                      <Callout
                        onPress={() => {
                          navigation.navigate(screens.PROVIDER_DETAIL, {
                            hospital,
                          })
                        }}>
                        <Div
                          w={100}
                          justifyContent="center"
                          alignItems="center">
                          <Text fontSize="md">{hospital.title1}</Text>
                          <Text fontSize="sm" color="gray600">
                            {hospital.category}
                          </Text>
                        </Div>
                      </Callout>
                    </Marker>
                  ))}
                </MapView>
              ) : (
                <ActivityIndicator
                  size="large"
                  color={theme.colors.main900}
                  style={{ paddingTop: 18, alignSelf: 'center' }}
                />
              )
            ) : null}
            {viewType == 'list' ? (
              <FlatList
                data={filteredHospitals}
                renderItem={renderItem}
                keyExtractor={(item) => item.hospitalId}
                ListHeaderComponent={
                  <Div p="xl" row justifyContent="space-between">
                    <Div row>
                      <Text fontSize="xl">총 </Text>
                      <GDFontText textWeight="700" fontSize="xl">
                        {filteredHospitals.length}개
                      </GDFontText>
                    </Div>
                  </Div>
                }
              />
            ) : null}
          </Div>
          <Portal>
            <Fab bg={Styles.colors.grayscale.blackGray} h={50} w={50} p={0}>
              <Button
                p={0}
                bg="transparent"
                justifyContent="flex-end"
                onPress={() =>
                  handleViewChange(viewType == 'list' ? 'map' : 'list')
                }>
                <Icon
                  name={viewType == 'map' ? 'view-list-outline' : 'map-outline'}
                  color={Styles.colors.grayscale.blackGray}
                  h={50}
                  w={50}
                  rounded="circle"
                  ml="md"
                  bg="white"
                  fontFamily="MaterialCommunityIcons"
                  fontSize="xl"
                />
              </Button>
              <Button
                p="none"
                bg="transparent"
                justifyContent="flex-end"
                onPress={getCurrentPosition}>
                <Icon
                  name="my-location"
                  color={Styles.colors.grayscale.blackGray}
                  h={50}
                  w={50}
                  rounded="circle"
                  ml="md"
                  bg="white"
                  fontFamily="MaterialIcons"
                  fontSize="xl"
                />
              </Button>
            </Fab>
          </Portal>
        </Host>
      </ScrollView>
    </Div>
  )
}

const styles = StyleSheet.create({
  buttonSelected: {
    backgroundColor: 'black',
    color: 'white',
  },
  buttonUnselected: {
    backgroundColor: 'white',
    color: 'black',
  },
})

export default SearchProvidersScreen

{
  /* <Div row m="xl">
  <Postcode
    style={{ width: '100%', height: 200 }}
    jsOptions={{ animated: true }}
    onSelected={({ sigungu }) => setSelectedGu(sigungu)}
  />
  </Div>
<Div row m="xl">
  <Text>{selectedGu}</Text>
</Div>
<Div row m="xl">
  <Button onPress={handleSearchClinics}>Search</Button>
</Div>
{providersToList.map((clinic, i) => (
  <>
    <Div row m="xl" key={String(i)}>
      <Image
        h={100}
        w={100}
        m={10}
        rounded="circle"
        source={{
          uri: 'https://gideb.com/static/media/img_host.b774ee5a.png',
        }}
      />
      <Text>
        {clinic.address +
          '\n' +
          clinic.name +
          '\n' +
          clinic.typeName +
          '\n' +
          clinic.telephone +
          '\n'}
      </Text>
    </Div>
    {clinic.website != '' ? (
      <Button block onPress={() => Linking.openURL(clinic.website)}>
        go to website
      </Button>
    ) : (
      <Button block disabled>
        go to website
      </Button>
    )}
    <Text>{JSON.stringify(clinic)}</Text> */
}
