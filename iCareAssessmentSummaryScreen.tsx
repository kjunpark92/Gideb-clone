import * as React from 'react'
import { TouchableOpacity, ScrollView, Platform } from 'react-native'
import { Div, Icon, Text, Header, Image } from 'react-native-magnus'
import { useFirebase, useFirestore } from 'react-redux-firebase'
import auth, { firebase } from '@react-native-firebase/auth'
import { useSelector, useDispatch } from 'react-redux'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import awhQ4Assessment from '../assets/awhQ4Assessment'
import screens from '../navigation/screens'
import Styles from '../util/Styles'
import Log from '../util/Log'
import Config from '../config'
import { useI18n } from '../hooks'
import axios from 'axios'
import { AWHOverlay, GDFontText } from '../components'

interface iCareAssessmentSummaryScreenProps {
  navigation: any
  route: any
}

const { useState, useEffect } = React
export default function iCareAssessmentSummaryScreen({
  navigation,
  route,
}: iCareAssessmentSummaryScreenProps) {
  const { 0: a1, 1: a2, 2: a3, 3: a4, 4: a5 } = route.params.data
  const [showOverlay, setShowOverlay] = useState(false)
  const insets = useSafeAreaInsets()

  const firestore = useFirestore()
  const firebase = useFirebase()

  const [currentIndex, setCurrentIndex] = useState(0)
  const { videoChatId: awhIdToken } = useSelector((state: any) => state.WT)

  const profile = useSelector((state: any) => state.firebase.profile)
  const q = useI18n('iCareAssessmentScreen')
  const t = useI18n('iCareAssessmentSummaryScreen')
  const o = useI18n('iCareMyAssOverlay')

  // useEffect(() => {
  //   // firebase.updateProfile({goals: {}})
  //   Log.debug('iCare answers: route.params =', route.params)
  //   Log.debug('iCare answers: awhIdToken =', awhIdToken)
  // }, [])

  const goToPrevQuestion = () => {
    if (currentIndex == 0) return
    setCurrentIndex(currentIndex - 1)
  }
  const goToNextQuestion = () => {
    if (currentIndex == awhQ4Assessment[Config.getLang()].length - 1) return
    setCurrentIndex(currentIndex + 1)
  }

  const Q4qBox = () => {
    return (
      <Div
        w="100%"
        bg="gray150"
        borderWidth={1}
        borderColor="gray300"
        rounded="xl"
        p="lg">
        <Div row justifyContent="space-between">
          <TouchableOpacity onPress={goToPrevQuestion}>
            <Icon
              fontFamily="MaterialCommunityIcons"
              name="chevron-left"
              fontSize="6xl"
            />
          </TouchableOpacity>
          <Div
            // pt={Platform.OS == 'ios' ? 3 : 0}
            // h={24}
            rounded="circle"
            bg="main900"
            alignSelf="center"
            row
            py="xs"
            px="lg"
            justifyContent="center"
            alignItems="center">
            <Text color="white" fontSize={12}>
              {currentIndex + 1} / 31
            </Text>
          </Div>
          <TouchableOpacity onPress={goToNextQuestion}>
            <Icon
              fontFamily="MaterialCommunityIcons"
              name="chevron-right"
              fontSize="6xl"
            />
          </TouchableOpacity>
        </Div>
        <Div mt="xl">
          <Text fontSize={16} mb="lg">
            {/* 1. {t.q4q[currentIndex].q} */}
            {String(currentIndex + 1)}.{' '}
            {awhQ4Assessment[Config.getLang()][currentIndex].text}
          </Text>
          {q.q4q.answers.map((ans, idx) => {
            let checked = a4?.[currentIndex] == idx
            return (
              <Div key={String(idx)}>
                <Div
                  // flex={1}
                  mt="md"
                  rounded="circle"
                  bg={checked ? 'rgba(79, 209, 197, .1)' : 'white'}
                  borderColor="main500"
                  borderWidth={checked ? 1 : 0}
                  pl="lg"
                  py={16}
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

                  <Div justifyContent="center">
                    {checked ? (
                      <Text fontSize="md" ml="xl" color="gray900">
                        {ans}
                      </Text>
                    ) : (
                      <Text fontSize="md" ml="xl" color="gray900">
                        {ans}
                      </Text>
                    )}
                  </Div>
                </Div>
              </Div>
            )
          })}
        </Div>
      </Div>
    )
  }

  const updateProfileWithResults = async (answers: any) => {
    try {
      const uid = await firebase.auth().currentUser.uid

      const res = await firestore
        .collection('awhSessions')
        .doc(awhIdToken)
        .collection('activities')
        .doc(uid)
        .update({
          'homework.assessment': {
            0: a1,
            1: a2,
            2: a3,
            3: a4,
            4: a5,
          },
        })
      Log.debug('res =', res)
    } catch (error) {
      Log.debug('update profile error', error)
    }
  }

  const deleteProfile = async () => {
    try {
      const uid = await firebase.auth().currentUser.uid
      let res = await firestore
        .collection('awhSessions')
        .doc(awhIdToken)
        .collection('activities')
        .doc(uid)
        .update({
          'homework.assessment': {
            0: ['', '', '', '', ''],
            1: '',
            2: '',
            3: '',
            4: [],
            5: '',
          },
        })
    } catch (error) {
      Log.debug('deleteProfile error: ', error)
    }
  }

  // const resetHandler = async () => {
  //   await deleteProfile()
  //   navigation.navigate(screens.iCARE_ASSESSMENT)
  // }

  const exitHandler = async () => {
    await updateProfileWithResults({
      a1,
      a2,
      a3,
      a4,
      a5,
    })
    navigation.navigate(screens.iCARE_AWH_INITIAL)
  }

  return (
    <>
      <AWHOverlay
        text={o.text}
        title={o.title}
        visible={showOverlay}
        closeEvent={() => setShowOverlay(false)}
      />
      <Div flex={1} bg="white" pt={insets.top}>
        <Header
          borderBottomWidth={1}
          borderBottomColor="gray_line"
          shadow="none"
          pb={0}
          prefix={
            <Div row alignItems="center">
              <GDFontText fontSize={18} textWeight="500" mr="lg">
                {q.header}
              </GDFontText>
              <TouchableOpacity onPress={() => setShowOverlay(true)}>
                <Icon
                  fontFamily="SimpleLineIcons"
                  name="question"
                  fontSize="3xl"
                />
              </TouchableOpacity>
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
        <Div p={15}>
          <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
            <Div>
              <GDFontText textWeight="700" fontSize="xl">
                {`${profile.nickname},\n ${t.title}`}
              </GDFontText>
            </Div>
            <Div borderBottomWidth={1} borderColor="gray_line" my="lg" />
            <Div flex={1}>
              <Div>
                <GDFontText textWeight="700" fontSize="xl">
                  {q.q1.overview}
                </GDFontText>
              </Div>
              {Platform.OS == 'ios' && <Div p="sm" />}
              <Div bg="gray150" rounded="xl" p="lg">
                {a1?.map((text, i) => (
                  <Div key={String(i)}>
                    <Text fontSize={14}>{`${String(i + 1)}. ${text}`}</Text>
                    {/* <Text numberOfLines={1}>{`${String(i + 1)}. ${text}`}</Text> */}
                    <Div p={1} />
                  </Div>
                ))}
              </Div>
            </Div>
            <Div flex={1} mt="lg">
              <Div>
                <GDFontText textWeight="700" fontSize="xl">
                  {q.q2.overview}
                </GDFontText>
              </Div>
              {Platform.OS == 'ios' && <Div p="sm" />}

              <Div bg="gray150" rounded="xl" p="lg" py={17}>
                <Text>{a2}</Text>
              </Div>
            </Div>
            <Div flex={1} mt="lg">
              <Div>
                <GDFontText textWeight="700" fontSize="xl">
                  {q.q3.overview}
                </GDFontText>
              </Div>
              {Platform.OS == 'ios' && <Div p="sm" />}

              <Div bg="gray150" rounded="xl" p="lg" py={17}>
                <Text>{a3}</Text>
              </Div>
            </Div>
            <Div flex={1} mt="lg">
              <Div>
                <GDFontText textWeight="700" fontSize="xl">
                  {q.q4.overview}
                </GDFontText>
              </Div>
              {Platform.OS == 'ios' && <Div p="sm" />}

              <Q4qBox />
            </Div>
            <Div flex={1} mt="lg">
              <Div>
                <GDFontText
                  textWeight="700"
                  fontSize="xl"

                  // borderWidth={1}
                >
                  {q.q5.overview}
                </GDFontText>
              </Div>
              {Platform.OS == 'ios' && <Div p="sm" />}

              <Div bg="gray150" rounded="xl" p="lg" py={17}>
                <Text fontSize={14}>{a5}</Text>
                {/* <Text numberOfLines={4}>{a5}</Text> */}
              </Div>
            </Div>

            <Div p="3xl" />
          </ScrollView>
        </Div>
      </Div>
    </>
  )
}
