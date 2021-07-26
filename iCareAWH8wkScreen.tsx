import * as React from 'react'
import {
  Alert,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  View,
  Platform,
  TextInput,
} from 'react-native'
import {
  Div,
  Input,
  Button,
  Icon,
  Text,
  Header,
  Overlay,
  Image,
} from 'react-native-magnus'
import Slider from '@react-native-community/slider'
import { useFirebase, useFirestore } from 'react-redux-firebase'
import { useSelector } from 'react-redux'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import screens from '../navigation/screens'
import Styles from '../util/Styles'
import Log from '../util/Log'
import Config from '../config'
import { useI18n } from '../hooks'
import axios from 'axios'
import DropDownPicker from 'react-native-dropdown-picker'
import { rest } from 'lodash'

import { GDActivityOverlay, GDFontText } from '../components'

const t = useI18n('iCareAWHDay5Screen')
// const d = useI18n('iCareDays')

interface iCareAWH8wkScreenProps {
  navigation: any
  route: any
}

const { useState, useEffect, useRef } = React
export default function iCareAWH8wkScreen({
  navigation,
  route,
}: iCareAWH8wkScreenProps) {
  const firebase = useFirebase()
  const firestore = useFirestore()
  const profile = useSelector((state: any) => state.firebase.profile)

  const [showOverlay, setShowOverlay] = useState(0)
  const [displayOverview, setDisplayOverview] = useState(false)
  const [isLoading, setIsloading] = useState(true)
  const [keybVisible, setKeybVisible] = useState(false)
  const weekScrollRef = useRef()

  // let refList = [0, 1, 2, 3, 4]
  // const inputRef = refList.map((el) => useRef(null))
  // const scrollToInput = () => {
  //   if (inputRef[inputIndex]) inputRef[inputIndex].current.scrollIntoView()
  // }
  // inputRef[inputIndex].current.focus()

  const insets = useSafeAreaInsets()

  interface day5OverlayProps {
    visible: boolean
    closeEvent: any
    button1Event: Function
    button2Event: Function
    button3Event: Function
    content: object
    id: number
  }

  const Day5Overlay = ({
    visible,
    closeEvent,
    button1Event,
    button2Event,
    button3Event,
    content,
    id,
  }: day5OverlayProps) => (
    <Overlay visible={visible} rounded="2xl">
      <Div alignItems="flex-end" m="sm">
        <TouchableOpacity onPress={id == 4 ? button1Event : closeEvent}>
          <Icon
            fontFamily="MaterialCommunityIcons"
            name="close"
            color="black"
            fontSize="4xl"
          />
        </TouchableOpacity>
      </Div>
      <Div px="lg" pt="lg">
        <Div alignItems="center" justifyContent="center">
          {id == 1 ? (
            <Image
              source={Styles.images.smallLogo}
              w={28}
              h={21}
              resizeMode="contain"
              mb="lg"
            />
          ) : id == 4 ? (
            <Image source={Styles.images.badgeGreen} w={30} h={30} pb="lg" />
          ) : (
            <Icon
              color="main900"
              fontFamily="AntDesign"
              name="exclamationcircleo"
              fontSize="6xl"
              pb="lg"
            />
          )}

          <Div row justifyContent="center" mt="lg">
            {id == 4 && (
              <GDFontText
                fontSize={16}
                textWeight="700"
                textAlign="center"
                lineHeight={24}>
                {weekIndex + 1}
              </GDFontText>
            )}
            <GDFontText
              fontSize={16}
              textWeight="700"
              textAlign="center"
              lineHeight={24}>
              {content.title}
            </GDFontText>
          </Div>
        </Div>

        <Div mt="lg">
          {id == 1 ? (
            <Div>
              <Div row>
                <Div alignSelf="flex-start">
                  <Text mx="md">{'\u2022'}</Text>
                </Div>
                <Text fontSize="md" textAlign="left">
                  {content.text1}
                </Text>
              </Div>
              <Div row>
                <Div alignSelf="flex-start">
                  <Text mx="md">{'\u2022'}</Text>
                </Div>
                <Text fontSize="md" textAlign="left">
                  {content.text2}
                </Text>
              </Div>
            </Div>
          ) : id != 4 ? (
            <>
              <Text fontSize="md" textAlign="center">
                {content.text}
              </Text>
              <Div pb="lg" />
            </>
          ) : (
            <Text fontSize="md" textAlign="center">
              {content.text1}
              {weekIndex + 2}
              {content.text2}
            </Text>
          )}
        </Div>

        <Div>
          {id != 2 && id != 4 && (
            <Div>
              <Button
                block
                bg="main900"
                rounded="circle"
                h={50}
                onPress={button1Event}>
                <GDFontText
                  textWeight="500"
                  color="white"
                  fontSize={14}
                  lineHeight={16}>
                  {content.buttons[0]}
                </GDFontText>
              </Button>
              {content.buttons.length > 1 && (
                <Div>
                  <Button
                    block
                    bg="white"
                    rounded="circle"
                    borderColor="main900"
                    borderWidth={1}
                    mt="md"
                    h={50}
                    onPress={button2Event}>
                    <GDFontText
                      textWeight="500"
                      color="main900"
                      fontSize={14}
                      lineHeight={16}>
                      {content.buttons[1]}
                    </GDFontText>
                  </Button>
                  <Button
                    block
                    bg="white"
                    mt="md"
                    rounded="circle"
                    h={50}
                    onPress={button3Event}>
                    <GDFontText
                      textWeight="500"
                      color="main900"
                      fontSize={14}
                      lineHeight={16}>
                      {content.buttons[2]}
                    </GDFontText>
                  </Button>
                </Div>
              )}
            </Div>
          )}
        </Div>
        <Div p="md" />
      </Div>
    </Overlay>
  )

  const HorizontalRange = ({ percentage }) => {
    let color = typeof percentage
    parseInt(percentage.slice(0, -1)) >= 70
      ? (color = '#7BDAFD')
      : (color = '#EF7475')
    return (
      <Div rounded="circle" h={20} bg="white">
        <Div bg={color} h={20} w={percentage} rounded="xl" />
      </Div>
    )
    // return <Text>{color}</Text>
  }

  const [questionIndex, setQuestionIndex] = useState<number>(0)
  const [weekIndex, setWeekIndex] = useState<number>(7)
  const [inputIndex, setInputIndex] = useState<number>(0)
  const [items, setItems] = useState<object>({})
  const [sliderInput, setSliderInput] = useState<number>(0)
  const [inputIsValid, setInputIsValid] = useState<boolean>(false)
  const [showInputError, setShowInputError] = useState<boolean>(false)
  const [displayCheckGoals, setDisplayCheckGoals] = useState<boolean>(false)
  const [clientId, setClientId] = useState('')
  const [awhData, setAhwData] = useState({})
  const [giveUp, setGiveUp] = useState<boolean>(false)
  const [giveupReason, setGiveupReason] = useState<number>(0)
  const [customReason, setCustomReason] = useState<string>('')
  const [hasCompletedAll, setHasCompletedAll] = useState<boolean>(false)
  const [dropdownInputFocused, setDropdownInputFocused] =
    useState<boolean>(false)
  const { videoChatId: awhIdToken } = useSelector((state: any) => state.WT)

  const scrollViewRef = useRef()

  useEffect(() => {
    const fetchData = async () => {
      try {
        let res = await firebase.auth().currentUser.uid
        setClientId(res)

        // Log.debug('BEFORE FETCH: awhid: ', awhIdToken, '\ncid: ', res)
        const resp = await axios.post(
          'https://asia-northeast3-gideb-firebase.cloudfunctions.net/getHomeworkInfo',
          { awhId: awhIdToken, clientId: res },
        )
        setAhwData(resp.data.homework)
        // Log.debug('fetchdata resp: ', resp.data.homework.wk8)
        if (resp.data.homework.wk8) {
          setItems(resp.data.homework.wk8)

          if (route?.params?.mode == 'overview') setDisplayOverview(true)
          else {
            //determine which week to show
            if (resp.data.homework.wk8[0] !== '') {
              let tmp = resp.data.homework.wk8[1]
              setQuestionIndex(1)

              for (let i = 0; i < Object.keys(tmp).length; i++) {
                if (
                  tmp[i].a.some((inp) => inp === '') ||
                  tmp[i].confidence < 7
                ) {
                  setWeekIndex(i)
                  return
                }
              }
              if (
                route.params.week !== 0 ||
                (resp.data.homework.wk8[0] !== '' &&
                  Object.values(tmp).every(
                    (wk) =>
                      wk.confidence > 6 &&
                      Object.values(wk.a).every((ans) => ans !== ''),
                  ))
              ) {
                setWeekIndex(route.params.week)
                setShowOverlay(3)
              }
            }
          }
        } else initData()
      } catch (error) {
        Log.debug('fetchData err: ', error)
      } finally {
        setIsloading(false)
      }
    }
    fetchData()

    return () => {
      // cleanup
    }
  }, [])

  const createEmptyItems = () => {
    let out = {
      0: '',
      1: {
        0: {},
        1: {},
        2: {},
        3: {},
        4: {},
        5: {},
        6: {},
        7: {},
      },
    }
    Object.values(out[1]).forEach((el, i) => {
      // if (el == {}) {

      out[1][i].a = ['', '', '', '', '']
      out[1][i].attainment = null
      out[1][i].confidence = 0
      out[1][i].giveUpReason = ''
      out[1][i].modifiedGoal = ''
    })
    return out
  }

  const initData = () => {
    setItems(createEmptyItems())
  }

  useEffect(() => {
    if (items[1] != undefined && items[1] != {}) {
      // Log.debug('$$$$$', weekIndex)
      setSliderInput(items[1][weekIndex].confidence)
      if (
        Object.values(items[1]).every(
          (wk) => wk.attainment === true && wk.a.every !== '',
        )
      )
        setHasCompletedAll(true)
    }
    return () => {
      // cleanup
    }
  }, [items, weekIndex])

  useEffect(() => {
    if (scrollViewRef.current)
      scrollViewRef.current.scrollTo({ x: 0, y: 0, animated: true })
    if (weekIndex == 7)
      weekScrollRef?.current?.scrollTo({ x: 0, y: 0, animated: true }) ?? null
    if (weekIndex == 0) {
      Log.debug('in weekIndex 0?')
      weekScrollRef?.current.scrollToEnd({ animated: true })
    }
    return () => {
      // cleanup
    }
  }, [weekIndex])

  // useEffect(() => {
  //   Log.debug('in this show overlay effect', showOverlay)
  //   if (showOverlay == 3) {
  //     // overlayCloseHandler()
  //     setDisplayCheckGoals(true)
  //   }
  // }, [showOverlay])

  const overlayCloseHandler = () => {
    setShowOverlay(0)
  }

  const overlayButtonHandler = (ind) => {
    if (showOverlay == 4) {
      if (weekIndex < 7) setWeekIndex(weekIndex + 1)
      setShowOverlay(0)
    }
    if (ind === 1) {
      // if (showOverlay == 1) overlayCloseHandler()
      if (showOverlay == 3) {
        overlayCloseHandler()
        setDisplayCheckGoals(true)
      }
      if (showOverlay == 5) {
        overlayCloseHandler()
        if (items[1][weekIndex].giveUpReason != '')
          setGiveupReason(items[1][weekIndex].giveUpReason)
      }
      // else overlayCloseHandler()
    } else if (ind == 2) {
      // if (showOverlay == 3) overlayCloseHandler()
      // if (showOverlay == 3) {
      setDisplayCheckGoals(false)
      setQuestionIndex(0)
      setShowOverlay(0)
      // }
    } else {
      if (showOverlay == 3) navigation.navigate(screens.iCARE_AWH_INITIAL)
      // else overlayCloseHandler()
    }
  }

  const updateInputHandler = (val) => {
    let tmp = { ...items }
    if (questionIndex == 0) tmp[0] = val
    else tmp[1][weekIndex].a[inputIndex] = val
    setItems(tmp)
    Log.debug('updateInputHandler: val: ', val)
    Log.debug('\nupdateInputHandler: tmp: ', tmp)
    if (val != '') setInputIsValid(true)
    else setInputIsValid(false)
  }

  const updateProfileWithResults = async (itm = null) => {
    setIsloading(true)
    if (itm === null) itm = items
    try {
      let out = { ...awhData }

      // if (awhData.wk8 == undefined)
      out.wk8 = itm
      // else if (awhData?.achievement?.[week] == undefined)
      //   out.achievement[week] = { 5: items }
      // else out.achievement[week][5] = items

      Log.debug(`**UPDATE out:`, out)
      const res = await firestore
        .collection('awhSessions')
        .doc(awhIdToken)

        .collection('activities')
        .doc(clientId)
        .set({
          homework: out,
        })
      Log.debug('res =', res)
    } catch (error) {
      Log.debug('update profile error', error)
    } finally {
      setIsloading(false)
    }
  }

  const emojiCompute = (val) => {
    let out
    if (val > 6) out = 'm4'
    else if (val > 3) out = 'm3'
    else out = 'm1'
    return Styles.images.emoji[out]
  }
  const emojiColorCompute = () => {
    let out
    if (sliderInput > 6) out = '#7BDAFD'
    else if (sliderInput > 3) out = '#FFCA00'
    else out = '#EF7475'
    return out
  }
  const sliderStyle = {
    sliderBG: {
      backgroundColor: 'white',
      width: 315,
      height: 25,
      borderRadius: 50,
      position: 'absolute',
    },
    sliderBar: {
      backgroundColor: emojiColorCompute(),
      width: sliderInput * 29 + 25,
      height: 25,
      borderRadius: 50,
      position: 'absolute',
      // zIndex: 1,
    },
  }

  // const resetHandler = async () => {
  //   try {
  //     await updateProfileWithResults(createEmptyItems())
  //   } catch (error) {
  //     Log.error('resetHadnler err: ', error)
  //   }
  //   initData()
  //   setQuestionIndex(0)
  //   setWeekIndex(7)
  //   setDisplayOverview(false)
  //   setDisplayCheckGoals(false)
  // }

  const exitHandler = async () => {
    try {
      await updateProfileWithResults()
      navigation.navigate(screens.iCARE_AWH_INITIAL)
    } catch (error) {
      Log.error('resetHadnler err: ', error)
    }
  }

  const goToNextHandler = () => {
    Log.debug('goToNextHandler fired')
    Log.debug('hasCompletedAll  =', hasCompletedAll)
    Log.debug('giveUp  =', giveUp)
    Log.debug('displayOverview =', displayOverview)
    let tmp
    if (hasCompletedAll || displayOverview) {
      updateProfileWithResults()
      navigation.navigate(screens.iCARE_AWH_INITIAL)
    } else if (giveUp) {
      tmp = items
      tmp[1][weekIndex].giveUpReason = giveupReason
      setItems(tmp)
      updateProfileWithResults()
      setGiveUp(false)
    } else if (displayOverview && !hasCompletedAll) {
      setDisplayOverview(false)
      setDisplayCheckGoals(true)
      // } else if (!displayCheckGoals) {
      //   if (weekIndex < 7) {
      //     let out = { ...items }
      //     out[1][7].modifiedGoal = out[0]
      //     setItems(out)
      //     setQuestionIndex(questionIndex + 1)
      //   }
    } else {
      if (questionIndex == 0)
        if (items[0] == '') setShowInputError(true)
        else {
          let tmp = items
          tmp[1][7].modifiedGoal = tmp[0]
          setItems(tmp)
          setQuestionIndex(questionIndex + 1)
        }
      else {
        if (
          sliderInput < 7 ||
          Object.values(items[1][weekIndex].a).some((el) => el === '')
        ) {
          setShowOverlay(2)
          return false
        } else if (
          Object.values(items[1]).every(
            (wk) =>
              wk.confidence > 6 &&
              Object.values(wk.a).every((ans) => ans !== '') &&
              wk.modifiedGoal !== '',
          )
        ) {
          Log.debug('BBBB')
          let tmp = { ...items }
          tmp[1][weekIndex].confidence = sliderInput
          setShowOverlay(3)
          setItems(tmp)
          updateProfileWithResults()
          Log.debug('BBBB2222', tmp)
        } else {
          if (weekIndex > 0) {
            Log.debug('AAAAA')
            let tmp = { ...items }
            tmp[1][weekIndex].confidence = sliderInput
            tmp[1][weekIndex - 1].modifiedGoal = tmp[1][weekIndex].modifiedGoal
            tmp[1][weekIndex - 1].a = [...tmp[1][weekIndex].a]

            setWeekIndex(weekIndex - 1)
            updateProfileWithResults()
          } else {
            Alert.alert('Please make sure you filled out everything!')
          }
        }
      }
    }
  }

  const sliderInputHandler = (val) => {
    setSliderInput(val)
    Log.debug('sliderInputHandler: set val:', val)
    let tmp = { ...items }
    tmp[1][weekIndex].confidence = val
    setItems(tmp)
  }

  const checkGoalHandler = (i) => {
    let tmp = { ...items }
    if (i === 0) {
      tmp[1][weekIndex].attainment = true
      setItems(tmp)
      updateProfileWithResults()
    } else {
      tmp[1][weekIndex].attainment = false
      setItems(tmp)
      setGiveUp(true)
    }
    setShowOverlay(3 + 2 * i)
  }

  const completionPercentage = () => {
    let tmp = 0
    for (let wk of Object.values(items[1])) {
      if (wk.attainment === true) ++tmp
    }
    return `${(tmp / 8) * 100}%`
  }

  // const dropDownSelectHandler = (item) => {
  //   let r = t.checkGoals.drpOptions.indexOf(item)
  //   Log.debug('dropDownSelectHandler-> item: ', item, '\nindex: ', r)
  //   setGiveupReason(r)
  // }

  const augData = () => {
    let out = t.checkGoals.drpOptions.map((reason, idx) => ({
      label: reason,
      value: idx,
    }))
    return out
  }

  const modifyGoalHandler = (val) => {
    let out = { ...items }
    out[1][weekIndex].modifiedGoal = val
    setItems(out)
  }

  return (
    <>
      <GDActivityOverlay visible={isLoading} />
      {t.overlays.map((ol, i) => (
        <Day5Overlay
          key={String(i)}
          id={i + 1}
          content={ol}
          visible={showOverlay == i + 1}
          closeEvent={overlayCloseHandler}
          button1Event={() => overlayButtonHandler(1)}
          button2Event={() => overlayButtonHandler(2)}
          button3Event={() => overlayButtonHandler(3)}
        />
      ))}

      <Div pt={insets.top} flex={1} bg="white">
        <Header
          shadow="none"
          pb={0}
          borderBottomColor="gray_line"
          borderBottomWidth={1}
          prefix={
            <Div row>
              <GDFontText fontSize={18} textWeight="500" mr="lg">
                {t.header}
              </GDFontText>
              <Div justifyContent="center">
                <TouchableOpacity onPress={() => setShowOverlay(1)}>
                  <Icon
                    color="gray400"
                    fontFamily="SimpleLineIcons"
                    name="question"
                    fontSize="3xl"
                  />
                </TouchableOpacity>
              </Div>
            </Div>
          }
          suffix={
            <Div row mr="xs">
              <TouchableOpacity onPress={() => exitHandler()}>
                <Image source={Styles.images.exit} h={24} w={24} />
              </TouchableOpacity>
            </Div>
          }
        />
        <Div flex={1}>
          {items != undefined && Object.keys(items).length !== 0 && (
            <ScrollView ref={scrollViewRef}>
              <Div px={15}>
                {questionIndex == 0 && !displayOverview ? (
                  <Div mt="2xl">
                    <GDFontText fontSize="xl" textWeight="700" lineHeight={26}>
                      {profile.nickname + ' '}
                      {t.questions[0].q}
                    </GDFontText>
                    <Text color="gray500" fontSize="sm" mt="sm">
                      {t.questions[0].note}
                    </Text>
                    <Div mt="2xl" />
                    <TextInput
                      // rounded="xl"
                      // borderColor={
                      //   !inputIsValid && showInputError ? 'error' : 'gray400'
                      // }
                      // borderWidth={1}
                      // placeholderTextColor="dark_5"
                      placeholder={t.questions[0].ph}
                      // p="lg"
                      multiline={true}
                      numberOfLines={25}
                      placeholderTextColor="#888888"
                      style={{
                        fontSize: 14,
                        height: 400,
                        textAlignVertical: 'top',
                        borderRadius: 15,
                        borderColor:
                          !inputIsValid && showInputError
                            ? 'red'
                            : 'rgba(18, 18, 18, 0.1)',
                        borderWidth: 1,
                        padding: 16,
                        paddingTop: 15,
                      }}
                      onChangeText={(val) => updateInputHandler(val)}
                      value={items[0]}
                    />
                    {showInputError && !inputIsValid && (
                      <Text color="error" mt="md" fontSize="sm" ml={17}>
                        {t.questions[0].error}
                      </Text>
                    )}
                  </Div>
                ) : displayOverview ? (
                  // overview *****************************
                  <Div>
                    <Div my="xl">
                      <GDFontText textWeight="700" fontSize={14}>
                        {t.questions[1].userInput}
                      </GDFontText>
                      <Div bg="gray150" rounded="lg" p="lg" my="md">
                        <Text>{items[0]}</Text>
                      </Div>
                    </Div>
                    <GDFontText textWeight="700" fontSize={14}>
                      {t.overview.title}
                    </GDFontText>
                    {Object.values(items[1]).map((ans, i) => (
                      <Div key={String(i)} mt="md">
                        <Div
                          bg={ans.attainment ? 'provider_primary' : 'main900'}
                          py="md"
                          px="lg"
                          my="sm"
                          rounded="circle"
                          // w={ans.attainment ? 115 : 85}
                          alignItems="center"
                          alignSelf="flex-start"
                          row>
                          <Div>
                            <Text color="white" fontSize={14}>
                              {i + 1}
                              {ans.attainment
                                ? t.overview.completeSuffix
                                : t.overview.incompleteSuffix}
                            </Text>
                          </Div>
                          {ans.attainment && (
                            <Div>
                              <Image
                                source={Styles.images.badge}
                                ml="sm"
                                h={15}
                                w={15}
                              />
                            </Div>
                          )}
                        </Div>

                        <Div bg="gray150" p="lg" py={17} rounded="lg">
                          <Text fontSize={14}>{ans.modifiedGoal}</Text>
                        </Div>
                      </Div>
                    ))}
                    <Div mt="2xl" />
                  </Div>
                ) : (
                  // questionIndex != 0 ?
                  <Div mt="md">
                    {!dropdownInputFocused && (
                      <>
                        <GDFontText fontSize={14} textWeight="700" mt="md">
                          {t.questions[1].userInput}
                        </GDFontText>

                        <Input
                          multiline={true}
                          textAlignVertical="top"
                          rounded="lg"
                          fontSize={14}
                          borderWidth={0}
                          bg="gray150"
                          editable={!giveUp}
                          value={items[1][weekIndex].modifiedGoal}
                          onChangeText={(val) => modifyGoalHandler(val)}
                        />
                      </>
                    )}
                    {!displayOverview ? (
                      <Div mt="lg">
                        {!hasCompletedAll && !giveUp && (
                          <>
                            <Div mt="lg" />
                            {displayCheckGoals && (
                              <GDFontText textWeight="700" fontSize={18}>
                                {t.checkGoals.title}
                              </GDFontText>
                            )}

                            <ScrollView
                              horizontal
                              decelerationRate="fast"
                              bounces={false}
                              ref={weekScrollRef}>
                              {Object.keys(items[1])
                                .map((wk, i) => (
                                  <TouchableOpacity
                                    onPress={() => setWeekIndex(i)}
                                    key={String(i)}>
                                    <Div
                                      bg={
                                        weekIndex == i
                                          ? 'main900'
                                          : items[1][i].attainment
                                          ? 'provider_primary'
                                          : 'gray150'
                                      }
                                      rounded="circle"
                                      py="sm"
                                      px="lg"
                                      mr="sm">
                                      <Div row alignItems="center">
                                        <GDFontText
                                          lineHeight={20}
                                          textWeight="500"
                                          color={
                                            weekIndex != i &&
                                            items[1][i].attainment !== true
                                              ? 'gray500'
                                              : 'white'
                                          }
                                          fontSize={14}>
                                          {i + 1}
                                          {t.questions[1].week}
                                        </GDFontText>
                                        {items[1][i].attainment && (
                                          <Image
                                            h={15}
                                            w={15}
                                            ml={2}
                                            source={Styles.images.badge}
                                          />
                                        )}
                                      </Div>
                                    </Div>
                                  </TouchableOpacity>
                                ))
                                .reverse()}
                            </ScrollView>
                          </>
                        )}
                        {!displayCheckGoals ? (
                          <>
                            <Div mt="2xl">
                              <GDFontText
                                textWeight="700"
                                fontSize={14}
                                lineHeight={18}>
                                {weekIndex + 1}
                                {t.questions[1].title}
                              </GDFontText>
                              {t.questions[1].q.map((quest, i) => (
                                <Div key={String(i)} mt={13}>
                                  <Text fontSize={14}>{quest.q}</Text>
                                  <Input
                                    // ref={inputRef[i]}
                                    borderColor="gray_line"
                                    mt="sm"
                                    rounded="lg"
                                    p="lg"
                                    value={items[1][weekIndex].a[i]}
                                    placeholder={quest.ph}
                                    onFocus={() => {
                                      // if (inputRef[i])
                                      //   inputRef[i].current.focus()
                                      // scrollToInput()
                                      setKeybVisible(true)
                                      setInputIndex(i)
                                    }}
                                    onBlur={() => {
                                      setKeybVisible(false)
                                      setInputIndex(0)
                                    }}
                                    // onChange={changeInputHandler}

                                    onChangeText={(val) =>
                                      updateInputHandler(val)
                                    }
                                  />
                                </Div>
                              ))}
                            </Div>
                            <Div
                              my="xl"
                              py="xl"
                              px="lg"
                              bg="gray150"
                              rounded="xl">
                              <Div row justifyContent="space-between">
                                <Div row alignItems="center">
                                  <Image
                                    source={emojiCompute(sliderInput)}
                                    h={24}
                                    w={24}
                                    resizeMode="contain"
                                  />
                                  <Div ml="lg">
                                    <GDFontText fontSize={16} textWeight="700">
                                      {t.graphTitle}
                                    </GDFontText>
                                  </Div>
                                </Div>
                                <Div justifyContent="center" mr={10}>
                                  <Text fontSize={16}>
                                    {sliderInput}/10{t.points}
                                  </Text>
                                </Div>
                              </Div>
                              <View
                                style={
                                  {
                                    // overflow: 'hidden',
                                    // borderRadius: 50,
                                    // marginTop: 20,
                                  }
                                }>
                                <View
                                  style={{
                                    position: 'absolute',
                                  }}>
                                  <View
                                    style={{
                                      position: 'relative',
                                      flexDirection: 'row',
                                    }}></View>
                                  {/* <View style={sliderStyle.sliderBar}></View> */}
                                  <View style={sliderStyle.sliderBG}></View>
                                  <View style={sliderStyle.sliderBar}></View>
                                </View>
                                <Slider
                                  style={{
                                    ...styles.slider,
                                  }}
                                  thumbTintColor={emojiColorCompute()}
                                  minimumValue={0}
                                  maximumValue={10}
                                  step={1}
                                  value={sliderInput}
                                  onValueChange={sliderInputHandler}
                                  minimumTrackTintColor={'transparent'}
                                  maximumTrackTintColor={'transparent'}
                                />
                              </View>
                              <Div row justifyContent="space-around" ml={5}>
                                {Array.apply(null, { length: 11 }).map(
                                  (e, i) => (
                                    <Text
                                      color="gray500"
                                      fontSize={13}
                                      key={String(i)}>
                                      {i}
                                    </Text>
                                  ),
                                )}
                              </Div>
                            </Div>
                          </>
                        ) : (
                          // checkgoals ***************************
                          <Div>
                            {!giveUp && !hasCompletedAll && (
                              <Div mt="lg">
                                <GDFontText textWeight="700" fontSize={14}>
                                  {weekIndex + 1}
                                  {t.checkGoals.weekTitle}
                                </GDFontText>
                                <Div p="lg" bg="gray150" rounded="lg">
                                  <Text>{items[0]}</Text>
                                </Div>
                                <Div
                                  px={16}
                                  py="xl"
                                  bg="gray150"
                                  rounded="xl"
                                  mt="md">
                                  <Div
                                    row
                                    justifyContent="space-between"
                                    alignItems="center">
                                    <Div>
                                      <GDFontText
                                        textWeight="700"
                                        fontSize={16}
                                        lineHeight={18}>
                                        {t.checkGoals.ratingTitle}
                                      </GDFontText>
                                    </Div>
                                    <Div>
                                      <Text fontSize={16}>
                                        {items != {}
                                          ? items[1][weekIndex].confidence
                                          : null}
                                        /10 {t.points}
                                      </Text>
                                    </Div>
                                  </Div>
                                  <Div
                                    row
                                    mt="lg"
                                    justifyContent="space-between"
                                    alignItems="center">
                                    <Div>
                                      <GDFontText
                                        textWeight="700"
                                        fontSize={16}
                                        lineHeight={18}>
                                        {t.checkGoals.ratingOptions}
                                      </GDFontText>
                                    </Div>
                                    <Div row ml={10}>
                                      {[true, false].map((option, idx) => {
                                        const checked =
                                          items[1][weekIndex].attainment ===
                                          option
                                        return (
                                          <TouchableOpacity
                                            onPress={() =>
                                              checkGoalHandler(idx)
                                            }
                                            key={String(idx)}>
                                            <Div row ml="lg">
                                              {!checked ? (
                                                <Icon
                                                  fontFamily="MaterialCommunityIcons"
                                                  name={
                                                    'checkbox-blank-circle-outline'
                                                  }
                                                  fontSize={20}
                                                  color="gray900"
                                                />
                                              ) : (
                                                <Image
                                                  source={Styles.images.check}
                                                  w={20}
                                                  h={20}
                                                />
                                              )}
                                              <Text ml="md" fontSize={13}>
                                                {idx == 0
                                                  ? t.checkGoals.option1
                                                  : t.checkGoals.option2}
                                              </Text>
                                            </Div>
                                          </TouchableOpacity>
                                        )
                                      })}
                                    </Div>
                                  </Div>
                                </Div>
                              </Div>
                            )}
                            {!dropdownInputFocused && (
                              <Div bg="gray150" rounded="xl" px="lg" py={20}>
                                <HorizontalRange
                                  percentage={completionPercentage()}
                                />
                                <Div mt="xl" />
                                <Div row justifyContent="space-between">
                                  <GDFontText
                                    textWeight="700"
                                    fontSize={16}
                                    lineHeight={18}>
                                    {t.checkGoals.completetionPercentage}
                                  </GDFontText>
                                  <GDFontText
                                    textWeight="700"
                                    fontSize={16}
                                    lineHeight={18}>
                                    {completionPercentage()}
                                  </GDFontText>
                                </Div>
                              </Div>
                            )}
                            {hasCompletedAll && (
                              <Div mt="2xl" alignSelf="center" w="60%">
                                <Div my="2xl" />
                                <Image
                                  alignSelf="center"
                                  source={Styles.images.smallLogo}
                                  w={48}
                                  h={48}
                                  resizeMode="contain"
                                />
                                <Div mt="xl">
                                  <Text textAlign="center">
                                    <Text>{t.checkGoals.completionMsgPt1}</Text>
                                    <GDFontText textWeight="700">
                                      {profile.nickname}
                                    </GDFontText>
                                    <Text>{t.checkGoals.completionMsgPt2}</Text>
                                  </Text>
                                </Div>
                              </Div>
                            )}
                            {giveUp && (
                              <Div mt="2xl">
                                <Text mb="md">
                                  {t.checkGoals.dropdownTitle}
                                </Text>
                                {giveupReason != 5 ? (
                                  <DropDownPicker
                                    items={augData()}
                                    defaultValue={
                                      items[1][weekIndex].giveUpReason === ''
                                        ? 0
                                        : items[1][weekIndex].giveUpReason
                                    }
                                    containerStyle={{
                                      height: 50,
                                      marginBottom: 100,
                                    }}
                                    style={{ backgroundColor: '#ffffff' }}
                                    dropDownStyle={{
                                      backgroundColor: 'white',
                                    }}
                                    onChangeItem={(item) => {
                                      Log.debug('onChangeItem: ', item)
                                      setGiveupReason(item.value)
                                    }}
                                  />
                                ) : (
                                  <Div
                                    row
                                    justifyContent="space-between"
                                    rounded="xl"
                                    borderWidth={1}
                                    borderColor="gray150"
                                    px="md">
                                    <Div flex={8}>
                                      <Input
                                        borderWidth={0}
                                        value={customReason}
                                        fontSize={14}
                                        onFocus={() =>
                                          setDropdownInputFocused(true)
                                        }
                                        onBlur={() =>
                                          setDropdownInputFocused(false)
                                        }
                                        onChangeText={(val) =>
                                          setCustomReason(val)
                                        }
                                      />
                                    </Div>
                                    <Div p="lg" flex={1}>
                                      <TouchableOpacity
                                        onPress={() => {
                                          setDropdownInputFocused(false)
                                          setGiveupReason(0)
                                        }}>
                                        <Icon
                                          fontFamily="FontAwesome5"
                                          name="caret-down"
                                          fontSize="2xl"
                                        />
                                      </TouchableOpacity>
                                    </Div>
                                  </Div>
                                )}
                                <Div mt="2xl" />
                                <Div mt="2xl">
                                  <Image
                                    alignSelf="center"
                                    source={Styles.images.smallLogo}
                                    h={26}
                                    w={34}
                                    resizeMode="contain"
                                  />
                                  <Text textAlign="center" mt="2xl">
                                    {t.checkGoals.tryAgainMsg}
                                  </Text>
                                </Div>
                                <Div mt="2xl" />
                                <Div mt="2xl" />
                              </Div>
                            )}
                          </Div>
                        )}
                        <Div mt="2xl" />
                      </Div>
                    ) : null}
                  </Div>
                )}
                <Div mt="2xl" />
              </Div>
            </ScrollView>
          )}
        </Div>
        {!keybVisible &&
          // <Div position="absolute" bottom={0}>
          //   <Button
          //     bg="main900"
          //     block
          //     onPress={goToNextHandler}
          //     py={12}
          //     // disabled={shownQuestion == 4 && !q4IsComplete}
          //     >
          //     <GDFontText textWeight="500" color="white">
          //       {hasCompletedAll || displayOverview
          //         ? t.goToNextBtn.start
          //         : giveUp
          //         ? t.goToNextBtn.submit
          //         : !displayCheckGoals && weekIndex == 0
          //         ? t.goToNextBtn.review
          //         : t.goToNextBtn.next}
          //       {/* // : displayOverview ||
          //         //   Object.values(items[1]).every((el) => el.attainment === true)
          //         // ? t.goToNextBtn.start */}
          //     </GDFontText>
          //   </Button>
          // </Div>
          (Platform.OS == 'android' ? (
            <Div position="absolute" bottom={0}>
              <Button
                bg="main900"
                block
                onPress={goToNextHandler}
                py={12}
                // disabled={shownQuestion == 4 && !q4IsComplete}
              >
                <GDFontText textWeight="500" color="white">
                  {hasCompletedAll || displayOverview
                    ? t.goToNextBtn.start
                    : giveUp
                    ? t.goToNextBtn.submit
                    : !displayCheckGoals && weekIndex == 0
                    ? t.goToNextBtn.review
                    : t.goToNextBtn.next}
                  {/* // : displayOverview ||
                  //   Object.values(items[1]).every((el) => el.attainment === true)
                  // ? t.goToNextBtn.start */}
                </GDFontText>
              </Button>
            </Div>
          ) : (
            <Div
              position="absolute"
              bottom={0}
              pb={insets.bottom}
              bg="white"
              p="md">
              <Button
                rounded="circle"
                bg="main900"
                block
                onPress={goToNextHandler}
                py={12}
                // disabled={shownQuestion == 4 && !q4IsComplete}
              >
                <GDFontText textWeight="500" color="white">
                  {hasCompletedAll || displayOverview
                    ? t.goToNextBtn.start
                    : giveUp
                    ? t.goToNextBtn.submit
                    : !displayCheckGoals && weekIndex == 0
                    ? t.goToNextBtn.review
                    : t.goToNextBtn.next}
                  {/* // : displayOverview ||
                  //   Object.values(items[1]).every((el) => el.attainment === true)
                  // ? t.goToNextBtn.start */}
                </GDFontText>
              </Button>
            </Div>
          ))}
      </Div>
    </>
  )
}

const styles = StyleSheet.create({
  slider: {
    height: 30,
    borderRadius: 50,
    backgroundColor: 'transparent',
  },
})

{
  /* <Div row>
<Button
  onPress={() =>
    Log.debug(
      // '***DEV*** wkIndex: ',
      // weekIndex,
      '***DEV*** items ',
      items,
      // questionIndex,
      // '\n items: ',
      // items,
      // '\nAWHDATA: ',
      // awhData,
    )
  }>
  DEV
</Button>

<Button
  onPress={() => {
    Log.debug('here')
    setShowOverlay(3)
  }}>
  DEV2
</Button> */
}

{
  /*
<Button
  onPress={() => {
    Log.debug('set give up-> true')
    setGiveUp(true)
  }}>
  DEV3
</Button>
<Button
  onPress={() => {
    Log.debug('set hasCompletedAll-> true')
    setHasCompletedAll(true)
  }}>
  DEV4
</Button>*/
}
{
  /* </Div> */
}
