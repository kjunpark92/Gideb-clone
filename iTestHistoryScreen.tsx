import * as React from 'react'
import {
  Platform,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native'
import { Div, Text, Icon, Image, Button, Dropdown } from 'react-native-magnus'
import dayjs from 'dayjs'
import _ from 'lodash'
import { useFirebase } from 'react-redux-firebase'
import { useSelector } from 'react-redux'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { GDHeader, ExplanationModalForTests, GDFontText } from '../components'
import Styles from '../util/Styles'
import Log from '../util/Log'
import TEST_TYPES from '../assets/iTest/testTypes'
import Config from '../config'

import screens from '../navigation/screens'
import stacks from '../navigation/stacks'
import iTestResults from '../util/iTestResults'

import StyledText from 'react-native-styled-text'

interface iTestHistoryScreenProps {
  navigation: any
}

// did global replace --> not so sure if correct ** need more checking..AUDIT looks fine
//  maybe logic needs some work too
const { useEffect, useState, useRef } = React
const iTestHistoryScreen: React.FC<iTestHistoryScreenProps> = ({
  navigation,
}) => {
  const firebase = useFirebase()
  const profile = useSelector((state: any) => state.firebase.profile)
  let testTypeTemp = ''

  const [modalSubtitleAcro, setModalSubtitleAcro] = useState('')
  const [modalRefURL, setModalRefURL] = useState('')
  const [modalImg, setModalImg] = useState('')
  const [modalHeader, setModalHeader] = useState('')
  const [modalDescription, setModalDescription] = useState('')
  const [testTypeSelected, setTestTypeSelected] = useState('')
  const [modalQuestionLengthNum, setModalQuestionLengthNum] = useState('')
  const [explainationModal, setExplainationModal] = useState(false)
  const [MDQ, setMDQ] = useState(null)
  const [DASS, setDASS] = useState(null)
  const [AUDIT, setAUDIT] = useState(null)
  const [AUDITDetails, setAUDITDetails] = useState<any>({})
  const [DASSDetails, setDASSDetails] = useState<any>(null)
  const [MDQDetails, setMDQDetails] = useState<any>({})

  const insets = useSafeAreaInsets()

  const testDropdownRef = useRef()

  const chosenLangTest: any = TEST_TYPES[Config.getLang()]

  const handleExplainationModal = (testChosen: any) => {
    setModalSubtitleAcro(testChosen.subtitleAcro || '')
    setModalRefURL(testChosen.refURL)
    setModalImg(testChosen.img)
    setModalHeader(testChosen.header || '')
    setModalDescription(testChosen.description || '')
    setTestTypeSelected(testChosen.name || '')
    setModalQuestionLengthNum(testChosen.numberOfQuestions)
    setExplainationModal(!explainationModal)
  }
  const takenTestFinder = () => {
    // Log.debug('takenTestFinder =', profile)
    setMDQ(profile?.MDQ?.answers ?? null)
    setDASS(profile?.DASS?.answers ?? null)
    setAUDIT(profile?.AUDIT?.answers ?? null)
  }

  useEffect(() => {
    // Log.debug('TEST_TYPES:', TEST_TYPES)
    takenTestFinder()
    if (profile.AUDIT) {
      setAUDITDetails(
        iTestResults['alcoholAbuse'](profile.AUDIT.answers, profile),
      )
    }
    if (profile.MDQ) {
      setMDQDetails(iTestResults['bipolar'](profile.MDQ.answers, profile))
    }

    if (profile.DASS) {
      Log.debug('in this DASS if condition')
      const { total } = iTestResults['depressionAnxietyStress'](
        profile.DASS.answers,
        profile,
      )
      Log.debug('total =', total)
      setDASSDetails(total)
    }
  }, [])

  const handleGoingToTest = async (testType: string) => {
    await setExplainationModal(false)
    await navigation.navigate(stacks.iTEST_STACK, {
      screen: screens.iTEST_QUESTIONS,
      params: { testType },
    })
  }

  const handleTestSelection = (selectedTest: string) => {
    testDropdownRef.current.close()
    handleExplainationModal(selectedTest)
  }

  const TestStartSelector = () => (
    <Dropdown
      ref={testDropdownRef}
      h="42%"
      w="100%"
      rounded="2xl"
      title={
        <Div alignItems="center" mb="2xl">
          <GDFontText fontSize="3xl" letterSpacing={0.4} textWeight="700">
            {'테스트를 선택하세요'}
          </GDFontText>
        </Div>
      }>
      <Div row px="lg">
        {chosenLangTest.map((test, i) => (
          <TouchableOpacity
            key={String(i)}
            onPress={() => {
              handleTestSelection(test)
            }}
            style={{ height: 200, flex: 1 }}>
            <Div
              bg="gray150"
              rounded="xl"
              h={Platform.OS == 'android' ? 175 : 195}
              m="xs"
              justifyContent="center"
              alignItems="center">
              <Div pt="sm">
                <Div flex={2} my={5} mb={15}>
                  <Image
                    source={test.iconLink}
                    h={85}
                    w={85}
                    resizeMode="contain"
                  />
                </Div>
                <Div p="sm" />
                <Div
                  bottom={8}
                  flex={3}
                  alignItems="center"
                  w="100%"
                  justifyContent="space-around">
                  <Div
                    w={60}
                    h={24}
                    rounded="circle"
                    borderColor="main900"
                    borderWidth={1}>
                    <Text
                      pt={2}
                      textAlign="center"
                      color="main900"
                      textAlignVertical="center">
                      {String(test.numberOfQuestions)} 문항
                    </Text>
                  </Div>
                  <Div w={91} h={86} bottom={8}>
                    <GDFontText
                      textAlign="center"
                      fontSize="sm"
                      py="xl"
                      textWeight="700">
                      {test.display}
                    </GDFontText>
                  </Div>
                </Div>
              </Div>
            </Div>
          </TouchableOpacity>
        ))}
      </Div>
    </Dropdown>
  )

  const TakenTestBlock: React.FC<any> = ({
    display,
    dateCompleted,
    resultNum,
    resultText,
    onPress,
    emojiSrc,
  }) => (
    <Div bg="gray100" rounded="xl" p="xl" m="sm" h={136} w={343}>
      <Div row justifyContent="space-between" mb="sm">
        <Text color="gray500" fontSize="xs">
          {display}
        </Text>
        <Text color="gray500" fontSize="xs">
          {dateCompleted
            ? '최근 검사일 : ' + dayjs().diff(dateCompleted, 'days') + '일 전'
            : 'NOT COMPLETED'}
        </Text>
      </Div>
      <Div row alignItems="center">
        <Image
          resizeMode="contain"
          source={
            resultNum
              ? Styles.images.emoji[`m${resultNum}`]
              : Styles.images.emoji.default
          }
          h={56}
          w={56}
        />
        <StyledText
          style={{ padding: 16, flex: 3, fontSize: 12 }}
          textStyles={textStyles}>
          {resultText ? resultText : 'NOT COMPLETED'}
        </StyledText>
        <Button
          disabled={onPress ? false : true}
          alignSelf="center"
          bg="main900"
          w={48}
          h={48}
          rounded={16}
          onPress={onPress}>
          <Icon
            fontFamily="Entypo"
            name="arrow-long-right"
            color="white"
            fontSize="4xl"
          />
        </Button>
      </Div>
    </Div>
  )

  return (
    <>
      <ExplanationModalForTests
        visible={explainationModal}
        modalHeader={modalHeader}
        modalDescription={modalDescription}
        modalSubtitleAcro={modalSubtitleAcro}
        testTypeSelected={testTypeSelected}
        modalRefURL={modalRefURL}
        modalQuestionLengthNum={Number(modalQuestionLengthNum)}
        handleGoingToTest={() => handleGoingToTest(testTypeSelected)}
        close={() => setExplainationModal(false)}
      />
      <Div style={{ flex: 1, backgroundColor: 'white' }} pt={insets.top}>
        <GDHeader>지난 결과보기</GDHeader>
        <Div borderTopWidth={1} borderColor="gray200" mb="sm" />
        <ScrollView bounces={false}>
          <Div p="lg">
            {DASS ? (
              <TakenTestBlock
                display="우울증 / 불안장애 / 스트레스"
                dateCompleted={dayjs(profile.DASS.dateCompleted).format(
                  'YYYY-MM-DD',
                )}
                resultNum={DASSDetails.emojiNum}
                resultText={`당신의 우울증 / 불안장애 / 스트레스 지수는 <b>'${
                  DASSDetails.message
                }'</b> 입니다.\n${
                  DASSDetails.emojiNum === 5
                    ? '훌륭합니다!'
                    : '관리가 필요해요!'
                }`}
                onPress={() => {
                  navigation.navigate(screens.iTEST_RESULTS, {
                    testType: 'depressionAnxietyStress',
                    answers: DASS,
                  })
                }}
              />
            ) : (
              <TakenTestBlock display="우울증 / 불안장애 / 스트레스" />
            )}
            {MDQ ? (
              <TakenTestBlock
                display="조울증"
                dateCompleted={dayjs(profile.MDQ.dateCompleted).format(
                  'YYYY-MM-DD',
                )}
                resultNum={MDQDetails.emojiNum}
                resultText={`당신의 조울증 지수는<b>'${
                  MDQDetails.message
                }'</b>입니다.\n${
                  MDQDetails.emojiNum === 5 ? '훌륭합니다!' : '관리가 필요해요!'
                }`}
                onPress={() => {
                  navigation.navigate(screens.iTEST_RESULTS, {
                    testType: 'bipolar',
                    answers: MDQ,
                  })
                }}
              />
            ) : (
              <TakenTestBlock
                display="조울증"
                // dateCompleted={dayjs('2021-05-01')}
                // resultText={`당신의 조울증 지수는\n‘나쁨’ 입니다.\n관리가 필요해요!`}
              />
            )}
            {AUDIT ? (
              <TakenTestBlock
                display="알코올 중독"
                dateCompleted={dayjs(profile.AUDIT.dateCompleted).format(
                  'YYYY-MM-DD',
                )}
                resultNum={AUDITDetails.emojiNum}
                resultText={`당신의 알코올 중독\n지수는<b>'${
                  AUDITDetails.message
                }'</b> 입니다.\n${
                  AUDITDetails.emojiNum === 5
                    ? '훌륭합니다!'
                    : '관리가 필요해요!'
                }`}
                onPress={() => {
                  // navigation.navigate('alcoholAbuse', AUDIT)
                  navigation.navigate(screens.iTEST_RESULTS, {
                    testType: 'alcoholAbuse',
                    answers: AUDIT,
                  })
                }}
              />
            ) : (
              <TakenTestBlock display="알코올 중독" />
            )}
          </Div>
        </ScrollView>
        <Div
          p="lg"
          position="absolute"
          bottom={0}
          pb={Platform.OS == 'android' ? insets.bottom + 15 : insets.bottom}>
          <Button
            block
            rounded="circle"
            bg="main900"
            h={48}
            onPress={() => testDropdownRef.current.open()}>
            <Text color="white" fontSize="lg" fontWeight="600">
              테스트 다시하기
            </Text>
          </Button>
        </Div>
      </Div>

      <TestStartSelector />
    </>
  )
}

const styles = StyleSheet.create({})
const textStyles = StyleSheet.create({})

export default iTestHistoryScreen
