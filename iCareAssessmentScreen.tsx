import * as React from 'react'
import {
  ActivityIndicator,
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
import { useSelector, useDispatch } from 'react-redux'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { GDActivityOverlay, GDFontText } from '../components'
import awhQ4Assessment from '../assets/awhQ4Assessment'
import screens from '../navigation/screens'
import Styles from '../util/Styles'
import Log from '../util/Log'
import Config from '../config'
import { useI18n } from '../hooks'
import axios from 'axios'

const { useEffect, useState } = React

const t = useI18n('iCareAssessmentScreen')
const o = useI18n('iCareMyAssOverlay')

export default function iCareAssessmentScreen({ navigation, route }: any) {
  const firebase = useFirebase()
  const firestore = useFirestore()
  const insets = useSafeAreaInsets()

  const [profile, setProfile] = useState({})

  const [shownQuestion, setShownQuestion] = useState(1)
  const [a1, setA1] = useState<string[]>(['', '', '', '', ''])
  const [a2, setA2] = useState<string>('')
  const [a3, setA3] = useState<string>('')
  const [a4, setA4] = useState<string[]>([])
  const [a5, setA5] = useState<string>('')
  const [activeInput, setActiveInput] = useState<number>(0)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [awhData, setAhwData] = useState({})

  useEffect(() => {
    Log.debug('USEEFFECT ROUTE PARAMS', route?.params)

    if (route?.params?.mode == 'edit') setShowInputError(true)
    if (route?.params?.mode !== 'reset') {
      getHomeworkInfo()
      if (profile) {
        let index = 5
        // if (profile.assessment[4] == '') index--
        if (a4.length != 31) --index
        if (a3 == '') --index
        if (a2 == '') --index
        if (a1.some((ans) => ans == '')) --index

        // else {
        setShownQuestion(index)
        // }

        if (a4.length ?? 0 > 0) setQ4index(a4.length - 1)
      }
    }
    return () => {
      // cleanup
    }
  }, [navigation])

  const getHomeworkInfo = async () => {
    setIsLoading(true)
    try {
      const res = await firebase.auth().currentUser.uid
      setClientId(res)
      Log.debug('getHomeworkInfo =', clientId, awhIdToken)

      const resp = await axios.post(
        'https://asia-northeast3-gideb-firebase.cloudfunctions.net/getHomeworkInfo',
        { awhId: awhIdToken, clientId: res },
      )
      Log.debug('gethw: resp: ', resp.data)
      if (resp.data.homework?.assessment != undefined) {
        let tmp = resp.data.homework.assessment
        setAhwData(resp.data.homework)
        setProfile(tmp)
        setA1(tmp[0])
        setA2(tmp[1])
        setA3(tmp[2])
        setA4(tmp[3])
        setA5(tmp[4])
      }
    } catch (error) {
      Log.debug('getHomeworkInfo error: ', error)
    } finally {
      setIsLoading(false)
    }
  }

  const Q4qBox = () => {
    return (
      <Div>
        <Div
          rounded="circle"
          bg="main900"
          px="lg"
          py="xs"
          alignSelf="center"
          mt="sm">
          <Text color="white" fontSize="md">
            {q4index + 1} / 31
          </Text>
        </Div>
        <Div mt="xl">
          <Text fontSize={16} mb="lg">
            {/* 1. {t.q4q[q4index].q} */}
            {String(q4index + 1)}.{' '}
            {awhQ4Assessment[Config.getLang()][q4index].text}
          </Text>
          {/* {t.q4q[q4index].answers.map((ans, idx) => { */}
          {t.q4q.answers.map((ans, idx) => {
            const checked = a4[q4index] == idx

            return (
              <TouchableOpacity
                onPress={() => q4QuestionsHandler(idx)}
                key={String(idx)}>
                <Div
                  mt="md"
                  rounded="circle"
                  bg={checked ? 'rgba(79, 209, 197, .1)' : 'white'}
                  borderColor="main500"
                  borderWidth={checked ? 1 : 0}
                  px="lg"
                  py={10}
                  alignItems="center"
                  row>
                  {!checked ? (
                    <Icon
                      fontFamily="MaterialCommunityIcons"
                      name={'checkbox-blank-circle-outline'}
                      fontSize="xl"
                      color="gray900"
                    />
                  ) : (
                    <Image source={Styles.images.check} w={13.33} h={13.33} />
                  )}
                  <Div>
                    <GDFontText
                      fontSize="md"
                      ml="xl"
                      color="gray900"
                      textWeight={checked ? '700' : '400'}>
                      {ans}
                    </GDFontText>
                  </Div>
                </Div>
              </TouchableOpacity>
            )
          })}
        </Div>
      </Div>
    )
  }

  const [q4index, setQ4index] = useState(0)

  const [showMyAssOverlay, setShowMyAssOverlay] = useState(false)
  const [showMyAssTooltip, setShowMyAssTooltip] = useState(false)

  const [showInputError, setShowInputError] = useState(false)

  const [clientId, setClientId] = useState('')
  const { videoChatId: awhIdToken } = useSelector((state: any) => state.WT)

  //workaround so state can change to force re-render
  const [loadCounter, setLoadCounter] = useState(0)

  const changeTextHandler = (val) => {
    let tmp = [...a1]
    tmp[activeInput - 1] = val
    setA1(tmp)
  }

  const q4IsComplete = () => {
    if (q4index + 1 == a4.length - 1) return true
    else return false
  }

  const q4QuestionsHandler = (answer) => {
    Log.debug('q4QuestHandler: answer, q4index ', answer, q4index)
    let tmp = { ...a4 }
    tmp[q4index] = answer
    setA4(tmp)
    setTimeout(() => {
      if (q4index == 30) setShownQuestion(5)
      else setQ4index(q4index + 1)
    }, 300)
  }

  const isValid = () => {
    if (shownQuestion == 1) {
      Log.debug('isValid: shownQuestion==1, answers: ', a1, a2, a3, a4, a5)

      return !a1.some((el) => el == '')
    } else if (shownQuestion == 2) {
      return a2 != ''
    } else if (shownQuestion == 3) {
      return a3 != ''
    } else if (shownQuestion == 5) {
      return a5 != ''
    } else return true
  }

  const nextQuestionHandler = () => {
    Log.debug('nextQuestionHandler: shownquestion: ', shownQuestion)

    if (isValid()) {
      if (shownQuestion < 5) {
        Log.debug('nextQhandler: shownq<5: answers: ', a1, a2, a3, a4, a5)
        setShownQuestion(shownQuestion + 1)
        setShowInputError(false)
      } else {
        Log.debug('last q answered. navigating to answer page')
        navigation.navigate(screens.iCARE_ASS_SUMM, {
          data: { 0: a1, 1: a2, 2: a3, 3: a4, 4: a5 },
        })
      }
    } else setShowInputError(true)
  }

  const inputPlaceholder = (idx) => {
    if (idx == 0) return t.q1.ph1
    else if (idx == 1) return t.q1.ph2
    else return ''
  }

  const cantContinueHandler = () => {
    Log.debug('cantContinueHandler fired')

    setShowMyAssOverlay(!setShowMyAssOverlay)
  }

  const updateProfileWithResults = async () => {
    try {
      let out = { ...awhData }
      out.assessment = { 0: a1, 1: a2, 2: a3, 3: a4, 4: a5 }
      const res = await firestore
        .collection('awhSessions')
        .doc(awhIdToken)
        .collection('activities')
        .doc(clientId)
        .set({ homework: out })
    } catch (error) {
      Log.debug('update profile error', error)
    }
  }

  const exitHandler = async () => {
    Log.debug('exithandler fired')
    await updateProfileWithResults()
    navigation.navigate(screens.iCARE_AWH_INITIAL)
  }
  const toggleShowMyAssTooltip = () => {
    Log.debug('tooltiphandler fired')
    setShowMyAssTooltip(!showMyAssTooltip)
  }

  return (
    <Div flex={1} bg="white" pt={insets.top}>
      <GDActivityOverlay visible={isLoading} />
      <Overlay visible={showMyAssOverlay}>
        <Div bg="background" justifyContent="center">
          <Div alignSelf="flex-end">
            <Icon
              fontFamily="MaterialCommunityIcons"
              name="close"
              fontSize="4xl"
              p="xl"
              color="gray900"
            />
          </Div>
          <Div>
            <Icon
              fontFamily="AntDesign"
              name="exclamationcircleo"
              fontSize="6xl"
              color="main900"
            />
          </Div>
          <Div>
            <GDFontText textWeight="700" fontSize="lg" color="black">
              {t.myAssOverlay.title}
            </GDFontText>
            <Text mt="lg" fontSize="md" color="black">
              {t.myAssOverlay.text}
            </Text>
          </Div>
        </Div>
      </Overlay>
      <Overlay visible={showMyAssTooltip} p="xl" rounded="2xl">
        <Div p="md">
          <Div alignItems="flex-end">
            <TouchableOpacity onPress={() => toggleShowMyAssTooltip()}>
              <Icon
                fontFamily="MaterialCommunityIcons"
                name="close"
                color="black"
                fontSize="4xl"
              />
            </TouchableOpacity>
          </Div>
          <Div alignItems="center" justifyContent="center">
            <Icon
              color="main900"
              fontFamily="SimpleLineIcons"
              name="question"
              fontSize="6xl"
              pb="sm"
            />
            <GDFontText
              mt="lg"
              fontSize="xl"
              textAlign="center"
              textWeight="700">
              {o.title}
            </GDFontText>
          </Div>
          <Div p="lg" />
          <Div>
            <Text fontSize="md" textAlign="center">
              {o.text}
            </Text>
          </Div>
          <Div p="lg" />
        </Div>
      </Overlay>
      <Header
        shadow="none"
        pb={0}
        borderBottomWidth={1}
        borderBottomColor="gray300"
        prefix={
          <>
            <GDFontText textWeight="700" fontSize="2xl" mr="md">
              {t.header}
            </GDFontText>
            <TouchableOpacity onPress={() => toggleShowMyAssTooltip()}>
              <Icon
                color="gray400"
                fontFamily="SimpleLineIcons"
                name="question"
                fontSize="3xl"
              />
            </TouchableOpacity>
          </>
        }
        suffix={
          <Div row mr="xs">
            <TouchableOpacity onPress={() => exitHandler()}>
              <Image source={Styles.images.exit} h={24} w={24} />
            </TouchableOpacity>
          </Div>
        }
      />
      <ScrollView bounces={false}>
        <Div px={15} py="lg">
          {shownQuestion == 1 && (
            <>
              <Div row mt="xl">
                <Div
                  alignSelf="flex-start"
                  justifyContent="flex-start"
                  alignItems="flex-start"
                  mr="sm">
                  <GDFontText
                    textWeight="700"
                    fontSize="xl"
                    // lineHeight={26}
                  >
                    Q1.
                  </GDFontText>
                </Div>
                <Div mr="xl">
                  <GDFontText
                    textWeight="700"
                    fontSize="xl"
                    // lineHeight={26}
                  >
                    {t.q1.question}
                  </GDFontText>
                  <Text color="gray500" fontSize="sm" mt="sm">
                    {t.note}
                  </Text>
                </Div>
              </Div>
              <Div mt="lg">
                {a1.map((a1Answer, idx) => (
                  <Div key={String(idx)}>
                    <Input
                      h={56}
                      fontSize="lg"
                      placeholder={inputPlaceholder(idx)}
                      // placeholder={ph(idx)}
                      value={a1Answer}
                      onFocus={() => setActiveInput(idx + 1)}
                      onBlur={() => setActiveInput(0)}
                      onChangeText={(val) => changeTextHandler(val)}
                      p="md"
                      rounded="lg"
                      mt="xl"
                      borderColor={
                        `a${idx}` == '' && showInputError
                          ? '#FF0000'
                          : 'rgba(18, 18, 18, 0.1)'
                      }
                    />
                    {a1[idx] == '' && showInputError && (
                      <Text color="error" mt="xs" ml="lg">
                        {t.inputError}
                      </Text>
                    )}
                  </Div>
                ))}
              </Div>
              <Div mt="2xl" />
              <Div mt="xl" />
            </>
          )}
          {shownQuestion == 2 && (
            <>
              <Div row mt="xl">
                <Div
                  alignSelf="flex-start"
                  justifyContent="flex-start"
                  alignItems="flex-start"
                  mr="sm">
                  <GDFontText
                    textWeight="700"
                    fontSize="xl"
                    // lineHeight={26}
                  >
                    Q2.
                  </GDFontText>
                </Div>
                <Div mr="xl" alignItems="flex-start" alignSelf="flex-start">
                  <GDFontText
                    textWeight="700"
                    fontSize="xl"
                    // lineHeight={26}
                    mr="lg">
                    {t.q2.question}
                  </GDFontText>
                  <Text color="gray500" fontSize="sm" mt="sm">
                    {t.note}
                  </Text>
                </Div>
              </Div>

              <Div mt="2xl">
                <TextInput
                  value={a2}
                  onChangeText={(val) => {
                    setA2(val)
                  }}
                  placeholder={a2 == '' ? t.q2.ph : a2}
                  multiline={true}
                  numberOfLines={25}
                  style={{
                    height: 400,
                    borderWidth: 1,
                    borderColor:
                      a2 == '' && showInputError
                        ? 'red'
                        : 'rgba(18, 18, 18, 0.1)',
                    borderRadius: 20,
                    padding: 15,
                    textAlignVertical: 'top',
                    paddingTop: 15,
                  }}
                />
                {a2 == '' && showInputError && (
                  <Text color="error" mt="xs" ml="lg">
                    {t.inputError}
                  </Text>
                )}
              </Div>
            </>
          )}
          {shownQuestion == 3 && (
            <>
              <Div row mt="xl">
                <Div
                  alignSelf="flex-start"
                  justifyContent="flex-start"
                  alignItems="flex-start"
                  mr="sm">
                  <GDFontText
                    textWeight="700"
                    fontSize="xl"
                    // lineHeight={26}
                  >
                    Q3.
                  </GDFontText>
                </Div>
                <Div mr="xl">
                  <GDFontText
                    textWeight="700"
                    fontSize="2xl"
                    // lineHeight={26}
                  >
                    {t.q3.question}
                  </GDFontText>
                  <Text color="gray500" fontSize="sm" mt="sm">
                    {t.note}
                  </Text>
                </Div>
              </Div>
              <Div mt="2xl">
                <TextInput
                  value={a3}
                  onChangeText={(val) => {
                    setA3(val)
                  }}
                  placeholder={a3 == '' ? t.q3.ph : a3}
                  // placeholder={t.q3.ph}
                  multiline={true}
                  numberOfLines={25}
                  style={{
                    height: 400,
                    borderWidth: 1,
                    borderColor:
                      a3 == '' && showInputError
                        ? 'red'
                        : 'rgba(18, 18, 18, 0.1)',
                    borderRadius: 20,
                    padding: 15,
                    textAlignVertical: 'top',
                    paddingTop: 15,
                  }}
                />
                {a3 == '' && showInputError && (
                  <Text color="error" mt="xs" ml="lg">
                    {t.inputError}
                  </Text>
                )}
              </Div>
            </>
          )}
          {shownQuestion == 4 && (
            <>
              <Div row mt="xl">
                <Div>
                  <GDFontText
                    textWeight="700"
                    fontSize="xl"
                    mr="sm"
                    // lineHeight={26}
                  >
                    Q4.
                  </GDFontText>
                </Div>
                <Div mr="lg">
                  <GDFontText
                    textWeight="700"
                    fontSize="xl"
                    //  lineHeight={26}
                  >
                    {t.q4.question}
                  </GDFontText>
                  <Text color="gray500" fontSize="sm" mt="sm">
                    {t.note}
                  </Text>
                </Div>
              </Div>
              <Div
                mt="2xl"
                bg="gray150"
                borderWidth={1}
                borderColor="gray300"
                rounded="2xl"
                p="lg"
                pt={16}
                pb="xl">
                <Text color="dark_5" fontSize="xl">
                  {t.q4.boxTitle}
                </Text>
                <Div ml="md">
                  <Text color="gray500" fontSize="md" mt="sm">
                    {'\u2022  '} {t.q4.boxListPoint1}
                  </Text>
                  <Text color="gray500" fontSize="md">
                    {'\u2022  '} {t.q4.boxListPoint2}
                  </Text>
                </Div>
                <Div mt="lg">
                  <Q4qBox />
                </Div>
              </Div>
            </>
          )}
          {shownQuestion == 5 && (
            <>
              <Div row mt="xl">
                <Div mr="sm" alignItems="flex-start">
                  <GDFontText fontSize="xl" textWeight="700" lineHeight={26}>
                    Q5.{' '}
                  </GDFontText>
                </Div>
                <Div mr="xl" alignItems="flex-start" alignSelf="flex-start">
                  <GDFontText
                    textWeight="700"
                    fontSize="xl"
                    // lineHeight={26}
                    mr="lg">
                    {t.q5.question}
                  </GDFontText>
                  <Text color="gray500" fontSize="sm" mt="sm">
                    {t.note}
                  </Text>
                </Div>
                {/* <Div>
                  <Text color="gray500" fontSize="sm" mt="sm">
                    {t.note}
                  </Text>
                </Div> */}
              </Div>
              <Div mt="2xl">
                <TextInput
                  value={a5}
                  onChangeText={(val) => {
                    setA5(val)
                  }}
                  placeholder={a5 == '' ? t.q5.ph : a5}
                  // placeholder={t.q5.ph}
                  multiline={true}
                  numberOfLines={25}
                  style={{
                    height: 400,
                    borderWidth: 1,
                    borderColor:
                      a5 == '' && showInputError
                        ? '#FF0000'
                        : 'rgba(18, 18, 18, 0.1)',
                    borderRadius: 20,
                    padding: 15,
                    textAlignVertical: 'top',
                    paddingTop: 15,
                  }}
                />
                {a5 == '' && showInputError && (
                  <Text color="error" mt="xs" ml="lg">
                    {t.inputError}
                  </Text>
                )}
              </Div>
            </>
          )}
        </Div>
      </ScrollView>

      {Platform.OS == 'android' ? (
        <Div position="absolute" bottom={0}>
          <Button
            bg="main900"
            block
            onPress={nextQuestionHandler}
            py={19}
            color="white"
            rounded="none"
            disabled={shownQuestion == 4 && !q4IsComplete}>
            {shownQuestion == 4 && !q4IsComplete
              ? t.goToNextButton[1]
              : t.goToNextButton[0]}
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
            bg="main900"
            h={48}
            block
            onPress={nextQuestionHandler}
            // py={19}
            color="white"
            rounded="circle"
            disabled={shownQuestion == 4 && !q4IsComplete}>
            {shownQuestion == 4 && !q4IsComplete
              ? t.goToNextButton[1]
              : t.goToNextButton[0]}
          </Button>
        </Div>
      )}
    </Div>
  )
}
