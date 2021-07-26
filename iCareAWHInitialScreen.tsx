import * as React from 'react'
import { ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native'
import {
  Div,
  Text,
  Icon,
  Modal,
  Header,
  Overlay,
  Button,
  Dropdown,
  Image,
} from 'react-native-magnus'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { useFirestore, useFirebase } from 'react-redux-firebase'
import { useSelector } from 'react-redux'
import axios from 'axios'
import Styles from '../util/Styles'
import stacks from '../navigation/stacks'
import screens from '../navigation/screens'
import Log from '../util/Log'
import { useI18n } from '../hooks'
import { useIsFocused } from '@react-navigation/native'
import { GDFontText } from '../components'

interface iCareAWHInitialScreenProps {
  navigation: any
  route: any
}

const { useEffect, useState, useRef } = React
export default function iCareAWHInitialScreen({
  navigation,
  route,
}: iCareAWHInitialScreenProps) {
  const firebase = useFirebase()
  const firestore = useFirestore()
  const o = useI18n('iCareMyAssOverlay')
  const t = useI18n('iCareAWHInitialScreen')
  const iCareDays = useI18n('iCareDays')
  const [profile, setProfile] = useState({})
  const isFocused = useIsFocused()
  const insets = useSafeAreaInsets()
  const hwEditRef = useRef(null)
  const resumeAssRef = useRef(null)

  const [selectedDay, setSelectedDay] = useState(0)
  const [week, setWeek] = useState(0)

  const [clientId, setClientId] = useState('')

  const [questionMoreInfoVisible, setQuestionMoreInfoVisible] =
    useState<boolean>(false)
  const [AWHInfoOverlayVisible, setAWHInfoOverlayVisible] =
    useState<boolean>(false)

  const [hasCompletedAssessment, setHasCompletedAssessment] = useState(false)
  const [showConfirmDeleteAss, setShowConfirmDeleteAss] = useState(false)
  const [showConfirmDeleteDay, setShowConfirmDeleteDay] = useState(false)
  const [showDeleteSuccess, setShowDeleteSuccess] = useState(false)
  const [showDayMenu, setShowDayMenu] = useState(false)
  // const [canResume, setCanResume] = useState(false)
  // const [showResumeOverlay, setShowResumeOverlay] = useState(false)

  const [isLoading, setIsLoading] = useState(true)
  const { videoChatId: awhIdToken, startDate: AWHStart } = useSelector(
    (state: any) => state.WT,
  )

  const today = new Date()
  // wk 1
  // const today = new Date('2021-07-02')
  //wk 2
  // const today = new Date('2021-07-09')
  //wk 6
  // const today = new Date('2021-08-06')
  //wk 8
  // const today = new Date('2021-08-30')
  const startDate = new Date(AWHStart)

  const wk0 = new Date(
    startDate.getFullYear(),
    startDate.getMonth(),
    startDate.getDate() + 7,
  )
  const wk1 = new Date(
    startDate.getFullYear(),
    startDate.getMonth(),
    startDate.getDate() + 14,
  )
  const wk2 = new Date(
    startDate.getFullYear(),
    startDate.getMonth(),
    startDate.getDate() + 21,
  )
  const wk3 = new Date(
    startDate.getFullYear(),
    startDate.getMonth(),
    startDate.getDate() + 28,
  )
  const wk4 = new Date(
    startDate.getFullYear(),
    startDate.getMonth(),
    startDate.getDate() + 35,
  )
  const wk5 = new Date(
    startDate.getFullYear(),
    startDate.getMonth(),
    startDate.getDate() + 42,
  )
  const wk6 = new Date(
    startDate.getFullYear(),
    startDate.getMonth(),
    startDate.getDate() + 49,
  )
  const wk7 = new Date(
    startDate.getFullYear(),
    startDate.getMonth(),
    startDate.getDate() + 56,
  )

  const getHomeworkInfo = async () => {
    let tmp
    try {
      const res = await firebase.auth().currentUser.uid
      setClientId(res)
      // Log.debug('getHomeworkInfo =', res, awhIdToken)
      if (awhIdToken) {
        const resp = await axios.post(
          'https://asia-northeast3-gideb-firebase.cloudfunctions.net/getHomeworkInfo',
          { awhId: awhIdToken, clientId: res },
        )
        setProfile(resp.data.homework)
        tmp = resp.data.homework
      }
    } catch (error) {
      Log.debug('getHomeworkInfo error: ', error)
    } finally {
      setIsLoading(false)
      if (!checkAssessmentComplete(tmp)) {
        resumeAssRef.current.open()
      } else {
        setHasCompletedAssessment(true)
      }
    }
  }

  const DropdownEdit = () => (
    <Dropdown
      onModalHide={() => {
        setSelectedDay(0)
      }}
      ref={hwEditRef}
      mt="md"
      pb="3xl"
      showSwipeIndicator={true}
      roundedTop="xl">
      <Dropdown.Option px="xl" block justifyContent="center">
        <TouchableOpacity onPress={showEventHandler}>
          <GDFontText textWeight="700" fontSize={16} lineHeight={18}>
            {t.dayDropdown.show}
          </GDFontText>
        </TouchableOpacity>
      </Dropdown.Option>
      <Dropdown.Option px="xl" block justifyContent="center">
        <TouchableOpacity onPress={editEventHandler}>
          <GDFontText textWeight="700" fontSize={16} lineHeight={18}>
            {t.dayDropdown.edit}
          </GDFontText>
        </TouchableOpacity>
      </Dropdown.Option>
      <Dropdown.Option px="xl" block justifyContent="center">
        <TouchableOpacity onPress={() => setShowConfirmDeleteDay(true)}>
          <GDFontText textWeight="700" fontSize={16} lineHeight={18}>
            {t.dayDropdown.delete}
          </GDFontText>
        </TouchableOpacity>
      </Dropdown.Option>
    </Dropdown>
  )

  // const ResumeOverlay = () => {
  //   return (
  //     <Overlay
  //       ref={resumeAssRef}
  //       visible={showResumeOverlay}
  //       rounded="2xl"
  //       // roundedTop="2xl"
  //       // showSwipeIndicator={true}
  //       py="2xl"
  //       mt="xl">
  //       <Div>
  //         <Div alignSelf="flex-end">
  //           <TouchableOpacity onPress={() => setShowResumeOverlay(false)}>
  //             <Icon
  //               fontFamily="MaterialCommunityIcons"
  //               name="close"
  //               fontSize="4xl"
  //               color="black"
  //               p="lg"
  //             />
  //           </TouchableOpacity>
  //         </Div>
  //GDFontText      <Text  fontSize="xl" textAlign="center">
  //           {t.continueDropdown.title}
  //         </Text>
  //         <Div mt="2xl">
  //           <Button
  //             block
  //             mx="xl"
  //             bg="main900"
  //             py="lg"
  //             rounded="circle"
  //             onPress={() => {
  //               Log.debug('GOGOG')
  //               setShowResumeOverlay(false)
  //               // resumeAssRef.current.close()
  //               navigation.navigate(screens.iCARE_ASSESSMENT, { mode: 'reset' })
  //             }}>
  //             <Text fontSize="lg" color="white" fontWeight="500">
  //               {t.continueDropdown.btn1}
  //             </Text>
  //           </Button>

  //           <TouchableOpacity
  //             style={{ marginVertical: 15 }}
  //             onPress={() => {
  //               Log.debug('GOGOG222222')
  //               // resumeAssRef.current.close()
  //               setShowResumeOverlay(false)
  //               navigation.navigate(screens.iCARE_ASSESSMENT, { mode: 'edit' })
  //             }}>
  //             <Text
  //               fontSize="lg"
  //               color="main900"
  //               fontWeight="500"
  //               textAlign="center">
  //               {t.continueDropdown.btn2}
  //             </Text>
  //           </TouchableOpacity>
  //         </Div>
  //       </Div>
  //     </Overlay>
  //   )
  // }

  useEffect(() => {
    if (isFocused) {
      getHomeworkInfo()

      if (today < wk0) setWeek(0)
      else if (today < wk1) setWeek(1)
      else if (today < wk2) setWeek(2)
      else if (today < wk3) setWeek(3)
      else if (today < wk4) setWeek(4)
      else if (today < wk5) setWeek(5)
      else if (today < wk6) setWeek(6)
      else if (today < wk7) setWeek(7)

      setShowDayMenu(false)
      setSelectedDay(0)
    }

    return () => {
      // cleanup
    }
  }, [isFocused])

  // useEffect(() => {
  //   if (hasCompletedAssessment) {
  //     Log.debug('%%% HASCOMPELTEDASS %%%')
  //     resumeAssRef.current.close()
  //   } else {
  //     Log.debug('%% INCOMPLETE %%')
  //     resumeAssRef.current.open()
  //   }

  //   return () => {
  //     // cleanup
  //   }
  // }, [hasCompletedAssessment])

  useEffect(() => {
    if (selectedDay !== 0) hwEditRef.current.open()
    else if (selectedDay === 0) hwEditRef.current.close()
    return () => {
      // cleanup
    }
  }, [selectedDay])

  const checkAssessmentComplete = (prof) => {
    if (
      prof?.assessment?.[4] != '' &&
      //RE-ENABLE CHECK AFTER CLEAN UP !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
      // tmp?.a4.length == 31 &&
      prof?.assessment?.[2] != '' &&
      prof?.assessment?.[1] != '' &&
      prof?.assessment?.[0].length == 5 &&
      prof?.assessment?.[0]?.every((el) => el !== '')
    ) {
      return true
    } else return false
  }

  const ContentComponents = {
    StartBlock: ({ onPress }: any) => {
      return (
        <TouchableOpacity style={{ width: '100%' }} onPress={onPress}>
          <Div
            bg="#E9F8F7"
            rounded="xl"
            h={100}
            borderColor="main900"
            borderStyle="dashed"
            borderWidth={1}
            justifyContent="center"
            alignItems="center">
            <Text color="main900" fontSize={16}>
              {t.startButton}
            </Text>
          </Div>
        </TouchableOpacity>
      )
    },
    DayBlock: ({ day, name, details, onPress }: any) => {
      return (
        <TouchableOpacity
          style={{ width: '100%', marginVertical: 5 }}
          onPress={onPress}>
          <Div
            row
            bg="gray150"
            rounded="xl"
            h={100}
            p="lg"
            justifyContent="space-between"
            alignItems="center">
            <Div row alignItems="center">
              <Div>
                <Text fontSize="lg">{name}</Text>
              </Div>
              {details !== '' ? (
                <Div row alignItems="center">
                  <Text fontSize="4xl">{'   |   '}</Text>
                  <Text fontSize="lg">{details}</Text>
                </Div>
              ) : null}
              {hasCompletedDay(day) && (
                <Div rounded="circle" bg="main900" ml="lg" py="sm" px="lg">
                  <Text fontSize="sm" color="white">
                    {t.complete}
                  </Text>
                </Div>
              )}
            </Div>
            <Icon
              fontFamily="MaterialCommunityIcons"
              name={hasCompletedDay(day) ? 'dots-vertical' : 'arrow-right'}
              fontSize="4xl"
              color="black"
            />
          </Div>
        </TouchableOpacity>
      )
    },
    QuestionMoreInfoOverlay: ({ visible, closeEvent, deleteEvent }: any) => (
      <Overlay visible={visible} p="xl" rounded="2xl">
        <Div p="md">
          <Div alignItems="flex-end">
            <TouchableOpacity onPress={closeEvent}>
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
            />
            <GDFontText
              fontSize={16}
              textWeight="700"
              textAlign="center"
              my="lg">
              {o.title}
            </GDFontText>
          </Div>
          <Div>
            <Text textAlign="center">{o.text}</Text>
          </Div>
          <Div p="lg" />
        </Div>
      </Overlay>
    ),
    AWHInfoOverlay: ({ visible, closeEvent }: any) => (
      <Overlay visible={visible} p="xl" rounded="2xl">
        <Div p="md">
          <Div alignItems="flex-end">
            <TouchableOpacity onPress={closeEvent}>
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
            />
            <GDFontText
              fontSize={16}
              textWeight="700"
              textAlign="center"
              my="lg">
              {t.AWHInfoBox.title}
            </GDFontText>
          </Div>
          <Div>
            <Text textAlign="center">{t.AWHInfoBox.text}</Text>
          </Div>
          <Div p="lg" />
        </Div>
      </Overlay>
    ),
    ConfirmDeleteOverlay: ({ visible, closeEvent, deleteEvent, type }: any) => (
      <Overlay visible={visible} p="xl" rounded="2xl">
        <Div p="md">
          <Div alignItems="center" justifyContent="center">
            <Icon
              color="main900"
              fontFamily="SimpleLineIcons"
              name="question"
              fontSize="6xl"
              pb="sm"
            />
            <GDFontText
              fontSize={16}
              textWeight="700"
              textAlign="center"
              mt="lg">
              {type === 0 ? t.DeleteBox.title0 : t.DeleteBox.title1}
            </GDFontText>
          </Div>
          <Div p="lg" />
          <Div alignSelf="center">
            <Text fontSize="sm" textAlign="center">
              {t.DeleteBox.text}
            </Text>
          </Div>
          <Div p="lg" />
          <Div row justifyContent="space-around">
            <TouchableOpacity onPress={closeEvent}>
              <GDFontText fontSize="lg" textWeight="700" color="dark_5">
                {t.DeleteBox.button2}
              </GDFontText>
            </TouchableOpacity>
            <TouchableOpacity onPress={deleteEvent}>
              <GDFontText fontSize="lg" textWeight="700" color="main900">
                {t.DeleteBox.button1}
              </GDFontText>
            </TouchableOpacity>
          </Div>
        </Div>
      </Overlay>
    ),
    DeleteSuccessOverlay: ({ visible, closeDeleteSuccess }: any) => (
      <Overlay visible={visible} p="xl" rounded="2xl">
        <Div p="2xl" mt="2xl" alignItems="center" justifyContent="center">
          <Text fontSize="lg">{t.DeleteSuccess.text}</Text>

          <Div p="2xl" />
          <Div>
            <TouchableOpacity onPress={closeDeleteSuccess}>
              <GDFontText color="main900" textWeight="700" fontSize="lg" p="md">
                {t.DeleteSuccess.button}
              </GDFontText>
            </TouchableOpacity>
          </Div>
        </Div>
      </Overlay>
    ),
  }

  const dayBlockInfo =
    // [
    [0, 1, 2, 3, 4].map((item) => ({
      name: iCareDays[item].name,
      details: iCareDays[item].details,
      onPress: () => onPressDayHandler(item),
    }))

  const onPressDayHandler = (day) => {
    // Log.debug('selectedDay, :', selectedDay)
    if (hasCompletedDay(day)) {
      // Log.debug('onPressDayHandler11')
      setSelectedDay(day + 1)
      // hwEditRef.current.open()
      // Log.debug(
      //   'onPressDayHandler: hasCompletedDay == true. toggleDayDropdown, selectedDay: ',
      //   selectedDay,
      // )
    } else {
      // setShowDayMenu(false)
      // Log.debug('set daymenu to: ', showDayMenu)
      if (day != 4)
        navigation.navigate(screens.iCARE_AWH_DAY, { week: week, day: day })
      else {
        navigation.navigate(screens.iCARE_AWH_8WK, { week: week, mode: 'edit' })
      }
    }
  }

  const hasCompletedDay = (day) => {
    // Log.debug('hasCompletedDay: week: ', week)
    // Log.debug('hasCompletedDay: day: ', day)
    // Log.debug(
    //   'hasCompletedDay: profile?.AWH?.answers?.[week]day: ',
    //   profile?.AWH?.answers?.[week]?.[day],
    // )

    if (day < 4) {
      if (
        profile?.achievement?.[week]?.[day] &&
        profile?.achievement?.[week] != {} &&
        profile?.achievement?.[week]?.[day] != {}
      ) {
        //   // let targetAnswerNumbers = [3, 3, 3, 4, [2, 6]]
        let answers = Object.values(profile.achievement[week][day])
        // Log.debug(`hasCompletedDay: answers on day ${day} : `, answers)
        if (answers.length == 0) return false
        else {
          let hasAllAnswers = answers.every((ans) => ans.length != 0)
          // Log.debug('hasCompletedDay: hasAllAnswers: ', hasAllAnswers)
          if (hasAllAnswers && day == 3)
            hasAllAnswers =
              Object.values(answers[1]).every((a) => a === 1) &&
              answers[1].length == 6
          return hasAllAnswers
        }
      } else return false
    } else {
      if (profile.wk8 == undefined) return false
      else {
        if (
          profile?.wk8[0] != '' &&
          Object.values(profile.wk8[1]).every(
            (wk) =>
              wk.a.every((field) => field != '') &&
              wk.confidence > 6 &&
              wk.attainment != null,
          )
        )
          return true
        else return false
      }
    }
  }

  const deleteAWHAssessment = async () => {
    // Log.debug(
    //   'deleteAWHAssessment: awhIdToken: ',
    //   awhIdToken,
    //   '\nclientId: ',
    //   clientId,
    // )
    try {
      let tmp = { ...profile }
      tmp.assessment = { 0: ['', '', '', '', ''], 1: '', 2: '', 3: [], 4: '' }
      const res = await firestore
        .collection('awhSessions')
        .doc(awhIdToken)
        .collection('activities')
        .doc(clientId)
        .set({ homework: tmp })
      // Log.debug('res =', res)
      getHomeworkInfo(awhIdToken)
      setShowConfirmDeleteAss(false)
      setHasCompletedAssessment(false)
      setShowDeleteSuccess(true)
    } catch (error) {
      Log.debug('update profile error', error)
    } finally {
      setIsLoading(false)
    }
  }

  const showEventHandler = () => {
    hwEditRef.current.close()
    if (selectedDay < 5)
      navigation.navigate(screens.iCARE_AWH_DAY, {
        day: selectedDay - 1,
        week: week,
        mode: 'show',
      })
    else
      navigation.navigate(screens.iCARE_AWH_8WK, {
        mode: 'overview',
      })
  }

  const editEventHandler = () => {
    hwEditRef.current.close()
    if (selectedDay == 5)
      navigation.navigate(screens.iCARE_AWH_8WK, { mode: 'edit', week: week })
    else
      navigation.navigate(screens.iCARE_AWH_DAY, {
        day: selectedDay - 1,
        week: week,
        mode: 'edit',
      })
  }

  const deleteAWHDay = async () => {
    await deleteDay()
    setSelectedDay(0)
  }

  const deleteDay = async () => {
    // Log.debug('deleteDay: awhIdToken: ', awhIdToken, '\nclientId: ', clientId)

    let tmp
    if (selectedDay < 5) tmp = `homework.achievement.${week}.${selectedDay - 1}`
    else tmp = 'homework.wk8'
    try {
      const res = await firestore
        .collection('awhSessions')
        .doc(awhIdToken)
        .collection('activities')
        .doc(clientId)
        .update({
          [tmp]: firestore.FieldValue.delete(),
        })

      // Log.debug('res =', res)
      getHomeworkInfo()
      setShowConfirmDeleteDay(false)
      setShowDeleteSuccess(true)
    } catch (error) {
      Log.debug('update profile error', error)
    } finally {
      setIsLoading(false)
    }
  }

  const AssessmentOptions = [
    {
      name: t.goalButtons.view,
      onPress: () =>
        navigation.navigate(screens.iCARE_ASS_SUMM, {
          data: profile?.assessment,
        }),
    },
    {
      name: t.goalButtons.edit,
      onPress: () => navigation.navigate(screens.iCARE_ASSESSMENT),
    },
    {
      name: t.goalButtons.delete,
      onPress: () => setShowConfirmDeleteAss(true),
    },
  ]

  const toggleQuestionMoreInfoOverlay = () => {
    setQuestionMoreInfoVisible(!questionMoreInfoVisible)
  }
  const toggleAWHInfoOverlay = () => {
    setAWHInfoOverlayVisible(!AWHInfoOverlayVisible)
  }

  return (
    <>
      <Overlay visible={isLoading} p="xl" bg="transparent">
        <ActivityIndicator color="#63B3ED" size={150} />
      </Overlay>

      <ContentComponents.QuestionMoreInfoOverlay
        visible={questionMoreInfoVisible}
        closeEvent={toggleQuestionMoreInfoOverlay}
      />
      <ContentComponents.AWHInfoOverlay
        visible={AWHInfoOverlayVisible}
        closeEvent={toggleAWHInfoOverlay}
      />

      <ContentComponents.ConfirmDeleteOverlay
        type={0}
        visible={showConfirmDeleteAss}
        closeEvent={() => setShowConfirmDeleteAss(false)}
        deleteEvent={deleteAWHAssessment}
      />
      <ContentComponents.ConfirmDeleteOverlay
        type={1}
        visible={showConfirmDeleteDay}
        closeEvent={() => setShowConfirmDeleteDay(false)}
        deleteEvent={deleteAWHDay}
      />
      <ContentComponents.DeleteSuccessOverlay
        visible={showDeleteSuccess}
        closeDeleteSuccess={() => setShowDeleteSuccess(false)}
      />
      {/* WIP homework edit */}
      <DropdownEdit />
      {/* <ResumeOverlay /> */}
      <Dropdown ref={resumeAssRef} roundedTop="2xl" showSwipeIndicator={true}>
        <Div>
          <GDFontText fontSize={20} textWeight="700" textAlign="center" mt="lg">
            {t.continueDropdown.title}
          </GDFontText>
          <Div mt="xl">
            <Button
              block
              mx="lg"
              py="md"
              rounded="circle"
              bg="main900"
              onPress={() => {
                resumeAssRef.current.close()
                navigation.navigate(screens.iCARE_ASSESSMENT)
              }}>
              <GDFontText fontSize={14} color="white" textWeight="500">
                {t.continueDropdown.btn1}
              </GDFontText>
            </Button>

            <TouchableOpacity
              onPress={() => {
                resumeAssRef.current.close()
                navigation.navigate(screens.iCARE_ASSESSMENT, { mode: 'reset' })
              }}>
              <GDFontText
                fontSize={14}
                color="main900"
                textWeight="500"
                textAlign="center"
                my="lg">
                {t.continueDropdown.btn2}
              </GDFontText>
            </TouchableOpacity>
          </Div>
        </Div>
      </Dropdown>
      <Modal
        isVisible={showDayMenu}
        bg="rgba(0, 0, 0, 0.5)"
        // position="relative"
        // ref={dropdownRef}
        roundedTop="2xl"
        px="xl">
        <Div
          bg="white"
          alignSelf="center"
          rounded="xl"
          w="100%"
          h="30%"
          position="absolute"
          p="lg"
          bottom={0}>
          <Div alignItems="flex-end">
            <TouchableOpacity onPress={() => setSelectedDay(0)}>
              <Icon
                fontFamily="MaterialCommunityIcons"
                name="close"
                color="black"
                fontSize="4xl"
              />
            </TouchableOpacity>
          </Div>
          <Div px="2xl">
            <Div justifyContent="center">
              <TouchableOpacity onPress={showEventHandler}>
                <GDFontText p="xl" textWeight="700" fontSize={16} mx="2xl">
                  {t.dayDropdown.show}
                </GDFontText>
              </TouchableOpacity>
              <TouchableOpacity onPress={editEventHandler}>
                <GDFontText p="xl" textWeight="700" fontSize={16} mx="2xl">
                  {t.dayDropdown.edit}
                </GDFontText>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setShowConfirmDeleteDay(true)}>
                <GDFontText p="xl" textWeight="700" fontSize={16} mx="2xl">
                  {t.dayDropdown.delete}
                </GDFontText>
              </TouchableOpacity>
            </Div>
          </Div>
        </Div>
      </Modal>
      <Div flex={1} bg="white" pt={insets.top}>
        <Header
          shadow="none"
          pb={0}
          borderBottomColor="gray_line"
          borderBottomWidth={1}
          prefix={
            <TouchableOpacity>
              <GDFontText fontSize={18} textWeight="500">
                {t.header}
              </GDFontText>
            </TouchableOpacity>
          }
          suffix={
            <>
              <TouchableOpacity
                onPress={() => navigation.navigate(stacks.iCARE_STACK)}>
                <Image source={Styles.images.exit} h={24} w={24} />
              </TouchableOpacity>
              {/* <Button
                onPress={() => {
                  Log.debug(
                    // 'canResume: ',
                    // canResume,
                    'DEV***: hweditref.crnt',
                    hwEditRef.current,
                    // '\nprofile?.assessment != undefined: ',
                    // profile?.assessment != undefined,
                    '\n selectedDay:',
                    selectedDay,
                  )
                }}>
                DEV
              </Button> */}
            </>
          }
        />

        <ScrollView bounces={false}>
          <Div p="lg" bg="white" mt="md">
            <Div row>
              <Div justifyContent="center">
                <GDFontText
                  fontSize={18}
                  textWeight="700"
                  textAlignVertical="center">
                  {t.myAss}
                </GDFontText>
              </Div>
              <Div alignItems="center" justifyContent="center">
                <TouchableOpacity onPress={toggleQuestionMoreInfoOverlay}>
                  <Icon
                    fontFamily="SimpleLineIcons"
                    name="question"
                    fontSize="xl"
                    p="md"
                  />
                </TouchableOpacity>
              </Div>
            </Div>
            <Div justifyContent="center" alignItems="center">
              {/* <Div p="sm" /> */}
              {hasCompletedAssessment ? (
                <Div row flex={1} mt="lg">
                  {AssessmentOptions.map((opt, i) => (
                    <TouchableOpacity
                      style={{ flex: 1 }}
                      key={String(i)}
                      onPress={opt.onPress}>
                      <Div
                        mr="md"
                        flex={1}
                        justifyContent="center"
                        alignItems="center"
                        bg="#E9F8F7"
                        rounded="xl"
                        borderWidth={1}
                        borderStyle="dashed"
                        borderColor="main900"
                        h={100}>
                        <Text color="main900" fontSize={16} fontWeight="400">
                          {opt.name}
                        </Text>
                      </Div>
                    </TouchableOpacity>
                  ))}
                </Div>
              ) : (
                <>
                  <ContentComponents.StartBlock
                    onPress={() =>
                      navigation.navigate(screens.iCARE_ASSESSMENT)
                    }
                  />
                </>
              )}
            </Div>
          </Div>
          <Div p="lg" bg="white">
            <Div row>
              <Div justifyContent="center">
                <GDFontText fontSize={18} textWeight="700">
                  {t.goals}
                </GDFontText>
              </Div>
              <Div justifyContent="center">
                <TouchableOpacity onPress={toggleAWHInfoOverlay}>
                  <Icon
                    fontFamily="SimpleLineIcons"
                    name="question"
                    fontSize="xl"
                    p="md"
                  />
                </TouchableOpacity>
              </Div>
            </Div>
            {/* <Div row>
              <Button
                onPress={() => {
                  // Log.debug('iCARE INITIAL ***\nPROFILE: ', profile)
                  // Log.debug('iCARE INITIAL ***\ndropdownRef: ', dropdownRef)
                  // Log.debug('selectedDay ***\n: ', selectedDay)
                  // Log.debug('navigation: ***\n: ', navigation)
                  // Log.debug('showDayMenu: ***\n: ', showDayMenu)
                  Log.debug('today:: ***\n: ', today)
                  Log.debug('awhstart:: ***\n: ', AWHStart)
                  Log.debug('week:: ***\n: ', week)
                }}>
                DEV
              </Button>
              <Button
                onPress={() => {
                  Log.debug('aa: ')
                }}>
                DEV2
              </Button>
              <Button
                onPress={() => {
                  Log.debug(
                    'FORCE NAV 8wk SUMM: ',
                    navigation.navigate(screens.iCARE_AWH_8WK, { week: week }),
                  )
                }}>
                DEV3
              </Button>
            </Div> */}
            <Div justifyContent="center" alignItems="center">
              {/* <GoalsComponents.DayBlock
                text="example"
                onPress={() => Log.debug('example')}
              /> */}
              {dayBlockInfo.map(({ name, details, onPress }, i) => (
                <ContentComponents.DayBlock
                  key={String(i)}
                  name={name}
                  details={details}
                  onPress={onPress}
                  day={i}
                />
              ))}
            </Div>
          </Div>
          <Div p="xl" />
        </ScrollView>
      </Div>
    </>
  )
}
