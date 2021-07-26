import * as React from 'react'
import {
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Platform,
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
import { useFirebase, useFirestore } from 'react-redux-firebase'
import { useSelector } from 'react-redux'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import screens from '../navigation/screens'
import Styles from '../util/Styles'
import Log from '../util/Log'
import Config from '../config'
import { useI18n } from '../hooks'
import { useIsFocused } from '@react-navigation/native'
import axios from 'axios'
import { AWHOverlay, GDActivityOverlay, GDFontText } from '../components'

const { useState, useEffect } = React
const t = useI18n('iCareAWHDayScreen')
const d = useI18n('iCareDays')

interface iCareAWHDayScreenProps {
  navigation: any
  route: any
}

export default function iCareAWHDayScreen({
  navigation,
  route,
}: iCareAWHDayScreenProps) {
  const [currentIndex, setCurrentIndex] = useState<number>(0)
  const [showInfoOverlay, setShowInfoOverlay] = useState<boolean>(false)
  const [showContinueOverlay, setShowContinueOverlay] = useState<boolean>(false)
  const [showInputError, setShowInputError] = useState<boolean>(false)
  const [cantContinueOverlay, setCantContinueOverlay] = useState<boolean>(false)
  const [input, setInput] = useState<string>('')
  const [selectedInput, setSelectedInput] = useState<number>(0)
  const [inputIsValid, setInputIsValid] = useState<boolean>(false)
  const [validGoalNumber, setValidGoalNumber] = useState<boolean>(false)
  const [items, setItems] = useState({})
  const [displayOverview, setDisplayOverview] = useState<boolean>(false)
  const [week, setWeek] = useState(route?.params?.week)
  const [day, setDay] = useState(route?.params?.day)
  const [q3_1Index, setQ3_1Index] = useState<number>(0)

  const firebase = useFirebase()
  const firestore = useFirestore()
  const [profile, setProfile] = useState<object>({})
  const [clientId, setClientId] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)
  const isFocused = useIsFocused()
  const insets = useSafeAreaInsets()

  const [mode, setMode] = useState<string>(route.params.mode)

  const updateInputHandler = (val) => {
    setInput(val)
    if (val != '') {
      setInputIsValid(true)
    } else setInputIsValid(false)
  }

  const updateInputArrayHandler = (idx, val) => {
    let tmp = { ...items }
    tmp[currentIndex][idx] = val
    setItems(tmp)
    if (val == '' || Object.values(tmp[currentIndex]).some((el) => el == []))
      setInputIsValid(false)
    else setInputIsValid(true)
  }

  const addHandler = (val) => {
    if (day == 3 && currentIndex == 1) {
      let tmp = { ...items }
      tmp[1][q3_1Index] = t.days[3].boxAnswers[val].val
      setItems(tmp)
      setTimeout(() => {
        if (q3_1Index < 5) setQ3_1Index(q3_1Index + 1)
        else setValidGoalNumber(true)
      }, 300)
      // Log.debug(
      //   `addHandler: added  ${t.days[3].boxAnswers[val].val}- items[1][q3_1Index]: `,
      //   items[1][q3_1Index],
      // )
    } else if (day == 3 && currentIndex == 0) {
      updateInputHandler(val)
      let tmp = { ...items }
      tmp[0] = val
      setItems(tmp)
    } else {
      if (input != '') {
        // Log.debug('before addhandler: input: ', input)
        let tmp = { ...items }
        tmp[currentIndex].push(input)
        setItems(tmp)
        setInput('')
        // Log.debug('after addhandler: items: ', items)
      }
    }
  }

  const removeItemHandler = (i) => {
    let tmp = { ...items }

    tmp[currentIndex] = tmp[currentIndex].filter((str, index) => index != i)

    setItems(tmp)
  }

  useEffect(() => {
    if (items[currentIndex] && items[currentIndex].length > 0)
      setValidGoalNumber(true)
    else setValidGoalNumber(false)
    if (day == 3 && currentIndex == 0 && items[0] != '') setInputIsValid(true)
    return () => {
      // cleanup
    }
  }, [items])

  const { videoChatId: awhIdToken } = useSelector((state: any) => state.WT)

  const getHomeworkInfo = async () => {
    try {
      const res = await firebase.auth().currentUser.uid
      setClientId(res)
      Log.debug('getHomeworkInfo =', clientId, awhIdToken)
      // if (awhIdToken) {
      const resp = await axios.post(
        'https://asia-northeast3-gideb-firebase.cloudfunctions.net/getHomeworkInfo',
        { awhId: awhIdToken, clientId: res },
      )

      setProfile(resp.data.homework)

      if (resp.data.homework?.achievement?.[week]?.[day])
        setItems(resp.data.homework?.achievement?.[week]?.[day])
      else {
        setItems(initItems())
      }
      // }
    } catch (error) {
      Log.debug('getHomeworkInfo error: ', error)
    } finally {
      setIsLoading(false)
    }
  }

  const initItems = () => {
    // Log.debug('initiate items: day=', day)
    let tmp = { 1: [] }
    if (day == 3) tmp[0] = ''
    else {
      tmp[2] = []
      tmp[0] = []
      if (day == 2) {
        tmp[3] = []
        // Log.debug(
        //   'initiating items obj depending on day. current day: 2 -  items: ',
        //   tmp,
        // )
      }
    }
    return tmp
  }

  useEffect(() => {
    // Log.debug('DAY SCREEN: ROUTE PARAMS WK: ', route?.params?.week)
    getHomeworkInfo()
    // Log.debug('useeffect: after getHomeworkInfo: profile: ', profile)

    if (mode == 'show') setDisplayOverview(true)
    // Log.debug('useeffect: mode: ', route.params)
    return () => {
      // cleanup
    }
  }, [navigation, route])

  const toggleContinueOverlay = () => {
    setShowContinueOverlay(!showContinueOverlay)
  }

  const updateProfileWithResults = async (par = null) => {
    setIsLoading(true)
    // Log.debug('items:', items)
    try {
      let tmp
      if (par) tmp = par
      else tmp = items

      let out = { ...profile }

      if (profile.achievement == undefined)
        out.achievement = { [week]: { [day]: tmp } }
      else if (profile.achievement[week] == undefined)
        out.achievement[week] = { [day]: tmp }
      else out.achievement[week][day] = tmp

      // Log.debug(`**UPDATE AT week: ${week} & day: ${day}`)
      // Log.debug(`\n**UPDATE tmp: `, tmp)

      const res = await firestore
        .collection('awhSessions')
        .doc(awhIdToken)
        .collection('activities')
        .doc(clientId)
        .set({
          homework: out,
        })
      // Log.debug('res =', res)
    } catch (error) {
      Log.debug('update profile error', error)
    } finally {
      setIsLoading(false)
    }
  }

  const exitHandler = async () => {
    // Log.debug('exithandler fired')
    await updateProfileWithResults()
    // navigation.navigate(screens.iCARE_AWH_INITIAL)
    navigation.goBack()
  }

  const goToNextHandler = () => {
    // Log.debug('gotonexthandlers: displayoverview: ', displayOverview)
    // Log.debug('gotonexthandlers: validgoalnumber: ', validGoalNumber)
    // Log.debug('gotonexthandlers: currentIndex: ', currentIndex)
    // Log.debug('gotonexthandlers: items: ', items)
    if (!displayOverview) {
      let qNumber = t.days[day].questions.length

      if (day == 3 && currentIndex == 1 && q3_1Index < 5)
        if (items[1][q3_1Index] !== undefined) setQ3_1Index(q3_1Index + 1)
        else return
      else if (q3_1Index == 5) setDisplayOverview(true)
      else {
        if (validGoalNumber && currentIndex == qNumber - 1) {
          setDisplayOverview(true)
          // Log.debug('gotonexthandler: setidsplayoverview=true')
        } else if (!validGoalNumber) {
          toggleContinueOverlay()
          setShowInputError(true)
        } else {
          setCurrentIndex(currentIndex + 1)
          setDisplayOverview(false)
          setShowInputError(false)
        }
      }
      // }
    } else if (
      day == 3 &&
      displayOverview &&
      items[1].length == 6 &&
      items[1].some((answ) => answ !== 1)
    )
      setCantContinueOverlay(true)
    else {
      exitHandler()
    }
  }

  interface OverlayProps {
    visible: boolean
  }

  const CantContinueActsOverlay: React.FC<OverlayProps> = ({ visible }) => (
    <Overlay visible={visible} rounded="2xl">
      <Div alignItems="flex-end">
        <TouchableOpacity onPress={() => setCantContinueOverlay(false)}>
          <Icon
            fontFamily="MaterialCommunityIcons"
            name="close"
            color="black"
            fontSize="4xl"
          />
        </TouchableOpacity>
      </Div>
      <Div alignItems="center" justifyContent="center" p="xl">
        <Icon
          color="main900"
          fontFamily="SimpleLineIcons"
          name="exclamation"
          fontSize="6xl"
        />
        <Div>
          <GDFontText fontSize="xl" textWeight="700" textAlign="center" my="lg">
            {t.continueOverlay.title}
          </GDFontText>
          <Text fontSize="md" textAlign="center">
            {t.cantContinue1}
            <GDFontText textWeight="700">{t.cantContinue2}</GDFontText>
            <Text>{t.cantContinue3}</Text>
            <GDFontText textWeight="700">{t.cantContinue4}</GDFontText>
            <Text>{t.cantContinue5}</Text>
          </Text>
        </Div>
        <Div mb="xl" />
      </Div>
    </Overlay>
  )

  const ShowingInfoOverlay: React.FC<OverlayProps> = ({ visible }) => (
    <Overlay visible={visible} p="lg" rounded="2xl">
      <Div alignItems="flex-end">
        <TouchableOpacity onPress={() => setShowInfoOverlay(false)}>
          <Icon
            fontFamily="MaterialCommunityIcons"
            name="close"
            color="black"
            fontSize="4xl"
          />
        </TouchableOpacity>
      </Div>
      <Div p="md" mt="lg">
        <Div alignItems="center" justifyContent="center">
          <Icon
            color="main900"
            fontFamily="SimpleLineIcons"
            name="question"
            fontSize="6xl"
          />
          <GDFontText fontSize="xl" textWeight="700" textAlign="center">
            {t.infoOverlay[day].title}
          </GDFontText>
        </Div>
        {day == 3 ? (
          <Div>
            <Text textAlign="center">{t.infoOverlay[3].text}</Text>
            <Div w="90%" alignSelf="center" mt="lg">
              {t.infoOverlay[3].impact.map((el, i) => (
                <Div row key={String(i)} alignItems="center">
                  <Div flex={1} alignItems="center">
                    <GDFontText textWeight="700" fontSize={12} lineHeight={20}>
                      {el[0]}
                    </GDFontText>
                  </Div>
                  <Div flex={3}>
                    <Text fontSize={12}>{el[1]}</Text>
                  </Div>
                </Div>
              ))}
            </Div>
          </Div>
        ) : (
          <Div>
            <GDFontText>
              <GDFontText fontSize="md" textWeight="700">
                {t.infoOverlay[day].text1}
              </GDFontText>

              {t.infoOverlay[day].text2}
              <GDFontText fontSize="md" textWeight="700">
                {t.infoOverlay[day].text3}
              </GDFontText>
              {t.infoOverlay[day].text4}
              <Text>{t.infoOverlay[day].text5}</Text>
              <Text>{t.infoOverlay[day].text6}</Text>
              <Text>{t.infoOverlay[day].text7}</Text>
              {/* {t.infoOverlay[day].text6}
              {t.infoOverlay[day].text7} */}
              <Text>{t.infoOverlay[day].text8}</Text>
              {day == 2 && <Text>{t.infoOverlay[day].text9}</Text>}
            </GDFontText>
          </Div>
        )}
        <Div p="lg" />
      </Div>
    </Overlay>
  )

  return (
    <>
      {Object.keys(items).length != 0 && (
        <>
          {/* activityIndicator overlay here */}
          <GDActivityOverlay visible={isLoading} />
          {/* overlay will popup when client can not continue activities */}
          <CantContinueActsOverlay visible={cantContinueOverlay} />
          {/* overlay will show when more info needs to display --> depending on day state */}
          <ShowingInfoOverlay visible={showInfoOverlay} />
          {/* AWH general info overlay */}
          <AWHOverlay
            text={t.continueOverlay.text}
            title={t.continueOverlay.title}
            visible={showContinueOverlay}
            closeEvent={toggleContinueOverlay}
          />

          <Div pt={insets.top} flex={1} bg="white">
            <Header
              borderBottomColor="gray_line"
              borderBottomWidth={1}
              shadow="none"
              pb={0}
              prefix={
                <Div row alignItems="center">
                  <GDFontText fontSize={18} textWeight="500">
                    {t.days[route.params.day].header}
                  </GDFontText>
                  <Div ml="lg">
                    <TouchableOpacity onPress={() => setShowInfoOverlay(true)}>
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
              <ScrollView bounces={false}>
                <Div px="lg">
                  {day != 3 && (
                    <Div mt="2xl">
                      <GDFontText
                        fontSize={18}
                        textWeight="700"
                        lineHeight={22}>
                        {t.days[day].title}
                      </GDFontText>
                      <Text color="gray500" fontSize={13}>
                        {t.days[day].notes}
                      </Text>
                    </Div>
                  )}
                  {day == 3 && currentIndex > 0 && (
                    <Div mt="lg">
                      <GDFontText fontSize={14} textWeight="700">
                        {t.days[day].questions[1].userInput}
                      </GDFontText>
                      <Div bg="gray150" p={16} rounded="lg">
                        <Text fontSize={14}>{items[0]}</Text>
                      </Div>
                    </Div>
                  )}
                  {!displayOverview && day == 3 && currentIndex == 0 ? (
                    <>
                      <GDFontText
                        fontSize={18}
                        textWeight="700"
                        mt="xl"
                        lineHeight={26}>
                        {t.days[day].questions[0].q}
                      </GDFontText>
                      <Text color="gray500" fontSize="md" mt="sm">
                        {t.days[day].questions[0].notes}
                      </Text>
                      <Div mt="2xl" />
                      <TextInput
                        value={items[0]}
                        onChangeText={(val) => {
                          addHandler(val)
                        }}
                        placeholder={
                          // items[0] == '' ? t.days[day].questions[0].ph : items[0]
                          t.days[day].questions[0].ph
                        }
                        multiline={true}
                        numberOfLines={25}
                        onFocus={() => setSelectedInput(1)}
                        onBlur={() => setSelectedInput(0)}
                        style={{
                          fontSize: 14,
                          height: 400,
                          borderWidth: 1,
                          borderColor: showInputError
                            ? '#E53E3E'
                            : 'rgba(18, 18, 18, 0.1)',
                          borderRadius: 20,
                          padding: 15,
                          textAlignVertical: 'top',
                          top: 0,
                        }}
                      />
                      {showInputError && (
                        <Text mt="md" ml="lg" color="error" fontSize="md">
                          {t.days[day].questions[0].error}
                        </Text>
                      )}
                    </>
                  ) : !displayOverview && day == 3 && currentIndex == 1 ? (
                    <>
                      <GDFontText textWeight="700" mt="lg" fontSize="lg">
                        {t.days[day].questions[1].titleQuestion}
                      </GDFontText>
                      <Div bg="gray150" rounded="xl" p="xl">
                        <Text color="gray500" fontSize="md">
                          {t.days[day].questions[1].notes}
                        </Text>

                        <Div mt="md">
                          <Div>
                            <Div
                              my="2xl"
                              px={17}
                              py={5}
                              bg="main900"
                              rounded="circle"
                              alignSelf="center">
                              <Text color="white" fontSize={12}>
                                {q3_1Index + 1} / 6
                              </Text>
                            </Div>
                            <Text fontSize="xl">
                              {t.days[day].questions[1].box[q3_1Index].q}
                            </Text>
                            <Text mt="lg" fontSize="lg">
                              {t.days[day].questions[1].box[q3_1Index].details}
                            </Text>
                            <Div mt="lg" />
                            {t.days[day].boxAnswers.map((el, ind) => {
                              let checked = items[1][q3_1Index] === el.val
                              return (
                                <TouchableOpacity
                                  key={String(ind)}
                                  onPress={() => {
                                    addHandler(ind)
                                    Log.debug('onpress: ind: ', ind)
                                  }}>
                                  <Div
                                    p="lg"
                                    py="sm"
                                    mt="md"
                                    rounded="circle"
                                    borderWidth={1}
                                    bg={
                                      checked
                                        ? 'rgba(79, 209, 197, .1)'
                                        : 'white'
                                    }
                                    borderColor={checked ? 'main900' : 'white'}
                                    row>
                                    <Icon
                                      fontFamily="MaterialCommunityIcons"
                                      name={
                                        checked
                                          ? 'check-circle-outline'
                                          : 'checkbox-blank-circle-outline'
                                      }
                                      fontSize="xl"
                                      color={checked ? 'main900' : 'gray900'}
                                      mr="xl"
                                    />
                                    <GDFontText
                                      textWeight={checked ? '700' : '400'}>
                                      {el.label}
                                    </GDFontText>
                                  </Div>
                                </TouchableOpacity>
                              )
                            })}
                          </Div>
                        </Div>
                      </Div>
                    </>
                  ) : !displayOverview && !(day == 2 && currentIndex == 1) ? (
                    <Div mt="xl">
                      <GDFontText fontSize="lg" textWeight="700">
                        {t.days[day].questions[currentIndex].q}
                      </GDFontText>
                      <Div row alignItems="flex-end">
                        <Div flex={1}>
                          <Input
                            rounded="none"
                            borderColor="white"
                            borderBottomColor="gray300"
                            placeholderTextColor="gray400"
                            placeholder={t.days[day].questions[currentIndex].ph}
                            fontSize={14}
                            // p="md"
                            multiline={true}
                            onChangeText={(val) => updateInputHandler(val)}
                            value={input}
                          />
                        </Div>
                        <Div ml="sm">
                          <Button
                            bottom={1}
                            h={48}
                            w={64}
                            onPress={addHandler}
                            bg="main900"
                            rounded="xl"
                            // disabled={!inputIsValid}
                            // px="xl"
                          >
                            <Text
                              fontSize="lg"
                              color={
                                inputIsValid
                                  ? 'white'
                                  : 'rgba(255, 255, 255, .35)'
                              }>
                              {t.add}
                            </Text>
                          </Button>
                        </Div>
                      </Div>

                      <Div mt="xl" />
                      {/* List of added items */}
                      {items[currentIndex] &&
                        items[currentIndex].map((el, i) => (
                          <Div
                            key={String(i)}
                            row
                            rounded="xl"
                            px="xl"
                            borderColor="main900"
                            borderWidth={1}
                            justifyContent="space-between"
                            bg="main600"
                            mt="lg"
                            mx="xl"
                            alignItems="center">
                            <Div>
                              <Text color="main900" fontSize="lg">
                                {el}
                              </Text>
                            </Div>
                            <Div>
                              <TouchableOpacity
                                onPress={() => removeItemHandler(i)}>
                                <Icon
                                  fontFamily="MaterialCommunityIcons"
                                  name="close"
                                  fontSize="3xl"
                                  color="main900"
                                  p="lg"
                                />
                              </TouchableOpacity>
                            </Div>
                          </Div>
                        ))}
                    </Div>
                  ) : !displayOverview && day == 2 && currentIndex == 1 ? (
                    <Div mt="xl">
                      <GDFontText textWeight="700" fontSize={14}>
                        {t.days[2].questions[1].q}
                      </GDFontText>
                      <Div mt="lg" />
                      {t.days[day].questions[1].inputs.map((el, i) => (
                        <Div key={String(i)} mt="lg">
                          <Text
                            color={selectedInput == i ? 'black' : 'gray400'}
                            fontSize={14}>
                            {t.days[day].questions[1].inputs[i].title}
                          </Text>
                          <Input
                            value={items[currentIndex][i]}
                            placeholder={t.days[day].questions[1].inputs[i].ph}
                            onChangeText={(val) =>
                              updateInputArrayHandler(i, val)
                            }
                            onFocus={() => setSelectedInput(i)}
                            // onBlur={() => setSelectedInput(0)}
                            rounded="lg"
                            borderWidth={1}
                            borderColor={
                              selectedInput == i ? 'black' : 'gray400'
                            }
                            p="lg"
                            mt="md"
                            placeholderTextColor="gray300"
                            fontSize={14}
                          />
                        </Div>
                      ))}
                      <Div pt="2xl" />
                      <Div pt="2xl" />
                    </Div>
                  ) : (
                    // show overview after done with input
                    displayOverview &&
                    (day == 3 ? (
                      <Div>
                        {/* <Div mt="lg">
                          <GDFontText textWeight="700">
                            {t.days[day].questions[1].userInput}
                          </GDFontText>
                          <Div mt="md" bg="gray150" p="lg" py={17} rounded="lg">
                            <Text>{items[0]}</Text>
                          </Div>
                        </Div> */}
                        <GDFontText textWeight="700" mt="lg">
                          {t.days[day].questions[1].titleQuestion}
                        </GDFontText>
                        <Div rounded="2xl" p="lg" py={17} bg="gray150" mt="md">
                          <Div borderTopColor="black" borderTopWidth={1}>
                            <Div
                              row
                              bg="white"
                              borderBottomColor="gray150"
                              borderBottomWidth={3}>
                              <Div flex={8} p="md">
                                <GDFontText
                                  textWeight="700"
                                  pl="lg"
                                  fontSize={13}>
                                  {t.days[3].resultTableHeader[0]}
                                </GDFontText>
                              </Div>
                              <Div
                                flex={1}
                                p="md"
                                borderLeftWidth={3}
                                borderRightWidth={3}
                                borderColor="gray150">
                                <GDFontText
                                  textWeight="700"
                                  textAlign="center"
                                  fontSize={13}>
                                  {t.days[3].resultTableHeader[1]}
                                </GDFontText>
                              </Div>
                              <Div flex={2} p="md">
                                <GDFontText
                                  textWeight="700"
                                  textAlign="center"
                                  fontSize={13}>
                                  {t.days[3].resultTableHeader[2]}
                                </GDFontText>
                              </Div>
                            </Div>
                            {t.days[3].questions[1].box.map((question, i) => (
                              <Div
                                key={String(i)}
                                row
                                bg="white"
                                borderBottomColor="gray150"
                                borderBottomWidth={3}>
                                <Div flex={8} p="md">
                                  <Text pl="lg" fontSize={13}>
                                    {question.q}
                                  </Text>
                                </Div>
                                <Div
                                  flex={1}
                                  p="md"
                                  borderLeftWidth={3}
                                  borderRightWidth={3}
                                  borderColor="gray150">
                                  {items?.[1]?.[i] == 1 && (
                                    <TouchableOpacity
                                      onPress={() => {
                                        setDisplayOverview(false)
                                        setCurrentIndex(1)
                                        setQ3_1Index(i)
                                      }}>
                                      <Icon
                                        fontFamily="MaterialCommunityIcons"
                                        name="checkbox-blank-circle-outline"
                                      />
                                    </TouchableOpacity>
                                  )}
                                </Div>
                                <Div flex={2} p="md">
                                  {items?.[1]?.[i] == 0 && (
                                    <TouchableOpacity
                                      onPress={() => {
                                        setDisplayOverview(false)
                                        setCurrentIndex(1)
                                        setQ3_1Index(i)
                                      }}>
                                      <Icon
                                        fontFamily="MaterialCommunityIcons"
                                        name="checkbox-blank-circle-outline"
                                      />
                                    </TouchableOpacity>
                                  )}
                                </Div>
                              </Div>
                            ))}
                          </Div>
                        </Div>
                      </Div>
                    ) : (
                      t.days[day].questions.map((question, index) => (
                        <Div key={String(index)} mt="xl">
                          <GDFontText
                            fontSize={16}
                            textWeight="700"
                            lineHeight={20}>
                            {question.q}
                          </GDFontText>
                          {day == 2 && index == 1
                            ? t.days[day].questions[index].inputs.map(
                                (input, ind) => (
                                  <Div key={String(ind)} mt="md">
                                    <Text>{input.title}</Text>
                                    <Div
                                      rounded="2xl"
                                      px="xl"
                                      py="lg"
                                      bg="gray150">
                                      <Text color="gray900" fontSize={16}>
                                        {items?.[1]?.[ind]}
                                      </Text>
                                    </Div>
                                  </Div>
                                ),
                              )
                            : items?.[index] !== undefined &&
                              items[index].map((el, i) => (
                                <Div
                                  key={String(i)}
                                  rounded="2xl"
                                  px="xl"
                                  py={16}
                                  bg="gray150"
                                  mt="md">
                                  <Text color="gray900" fontSize={16}>
                                    {el}
                                  </Text>
                                </Div>
                              ))}
                        </Div>
                      ))
                    ))
                  )}
                </Div>
              </ScrollView>
              {/* <Div
                position="absolute"
                bottom={0}
                // pb={insets.bottom}
                pb={Platform.OS == 'android' ? 0 : insets.bottom}>
                <Button py="lg" bg="main900" block onPress={goToNextHandler}>
                  <GDFontText
                    fontSize={14}
                    textWeight="500"
                    color={
                      day == 3 &&
                      currentIndex == 1 &&
                      items[1][q3_1Index] == undefined
                        ? 'rgba(255, 255, 255, .35)'
                        : 'white'
                    }>
                    {!displayOverview && day == 3
                      ? t.days[3].next
                      : !displayOverview
                      ? t.next
                      : t.backToStart}
                  </GDFontText>
                </Button>
              </Div> */}
              {Platform.OS == 'android' ? (
                <Div position="absolute" bottom={0}>
                  <Button py="lg" bg="main900" block onPress={goToNextHandler}>
                    <GDFontText
                      fontSize={14}
                      textWeight="500"
                      color={
                        day == 3 &&
                        currentIndex == 1 &&
                        items[1][q3_1Index] == undefined
                          ? 'rgba(255, 255, 255, .35)'
                          : 'white'
                      }>
                      {!displayOverview && day == 3
                        ? t.days[3].next
                        : !displayOverview
                        ? t.next
                        : t.backToStart}
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
                  {/* <Button
            bg="main900"
            h={48}
            block
            onPress={nextQuestionHandler}
            py={19}
            color="white"
            rounded="circle"
            disabled={shownQuestion == 4 && !q4IsComplete}>
            {shownQuestion == 4 && !q4IsComplete
              ? t.goToNextButton[1]
              : t.goToNextButton[0]}
          </Button> */}
                  <Button
                    py="lg"
                    bg="main900"
                    block
                    onPress={goToNextHandler}
                    rounded="circle">
                    <GDFontText
                      fontSize={14}
                      textWeight="500"
                      color={
                        day == 3 &&
                        currentIndex == 1 &&
                        items[1][q3_1Index] == undefined
                          ? 'rgba(255, 255, 255, .35)'
                          : 'white'
                      }>
                      {!displayOverview && day == 3
                        ? t.days[3].next
                        : !displayOverview
                        ? t.next
                        : t.backToStart}
                    </GDFontText>
                  </Button>
                </Div>
              )}
            </Div>
          </Div>
        </>
      )}
    </>
  )
}
