import * as React from 'react'
import { StyleSheet, TouchableOpacity, Platform } from 'react-native'
import {
  Div,
  Button,
  Text,
  Modal,
  Header,
  Icon,
  Radio,
  Checkbox,
  Dropdown,
  Image,
} from 'react-native-magnus'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import Config from '../config'
import Styles from '../util/Styles'
import Log from '../util/Log'
import iTestQuestions from '../assets/iTest'
import { GDFontText, GDHeader, GDView } from '../components'
import screens from '../navigation/screens'
import { useI18n } from '../hooks'

interface iTestQuestionsScreenProps {
  navigation: any
  route: any
}

const RESULTS_TEXT = {
  depressionAnxietyStress:
    'DASS 우울증, 불안장애,\n스트레스 자가진단 테스트가\n완료되었습니다!',
  alcoholAbuse: 'AUDIT 알코올 중독 자가진단 테스트가\n완료되었습니다!',
  bipolar: 'MDQ 조울증 자가진단 테스트가\n완료되었습니다!',
}

const { useState, useEffect, createRef } = React
const iTestQuestionsScreen: React.FC<iTestQuestionsScreenProps> = ({
  navigation,
  route,
}) => {
  const t = useI18n('iTestQuestions')
  const { testType, restart = false } = route.params
  const exitQuestionsScreenDropdownRef = createRef()

  const [questions, setQuestions] = useState([])
  const [questionNum, setQuestionNum] = useState(0)
  const [answers, setAnswers] = useState([])
  const [currentQuestion, setCurrentQuestion] = useState({})
  const [currentOptions, setCurrentOptions] = useState([])
  const [isLoaded, setIsLoaded] = useState(false)
  const [finished, setFinished] = useState(false)
  const [chosenVal, setChosenVal] = useState(null)

  const insets = useSafeAreaInsets()

  const [startOrClose, setStartOrClose] = useState('')

  const getQuestions = (testType: string) => {
    setQuestions(iTestQuestions[testType][Config.getLang()])
  }

  const checkIfIncompleteTest = async () => {
    const incompleteTest = await Config.getIncompleteTest(testType)
    if (incompleteTest) {
      await setQuestionNum(incompleteTest.length)
    }
  }

  useEffect(() => {
    getQuestions(testType)
    Log.debug('testType:', testType, questions, restart)
    setIsLoaded(true)
    if (restart) {
      setQuestionNum(0)
      return setAnswers([])
    }
    checkIfIncompleteTest()
  }, [])

  const handleResult = () => setFinished(!finished)

  interface optionAnswerProps {
    answer: number
    category: string
  }

  const handleAnswerInput = (optionAnswer: optionAnswerProps) => {
    Log.debug(optionAnswer)
    setChosenVal(optionAnswer.answer)
    if (questionNum + 1 == questions.length) {
      const { answer, category } = optionAnswer
      // Log.debug('optionAnswer:', optionAnswer)
      setAnswers([...answers, { answer, category }])
      handleResult()
      return
    }
    let { answer, category } = optionAnswer
    // Log.debug('optionAnswer:', optionAnswer)
    if (testType == 'bipolar') answer = answer == 1 ? 0 : 1

    setAnswers([...answers, { answer, category }])
    setQuestionNum(questionNum + 1)

    setTimeout(() => {
      setChosenVal(null)
    }, 300)
  }

  const handleOptionSelector = (option: number) => {
    switch (option) {
      case 0:
        return t.notAtAll
      case 1:
        return t.notSoMuch
      case 2:
        return t.sometimes
      case 3:
        return t.allTheTime
      default:
        return option
    }
  }

  const handleStartOver = () => {
    setAnswers([])
    setQuestionNum(0)
    setFinished(!finished)
  }

  const handleNavigateToResults = () => {
    setAnswers([])
    navigation.navigate(screens.iTEST_RESULTS, { testType, answers })
    setFinished(!finished)
  }

  const TestFinishedModal = () => (
    <Modal isVisible={finished} bg="transparent">
      <Div
        bg="white"
        rounded="xl"
        p="xl"
        h={'40%'}
        // borderWidth={1}
        position="absolute"
        bottom={0}
        w="100%">
        <TouchableOpacity onPress={() => setFinished(!finished)}>
          <Icon
            fontFamily="MaterialCommunityIcons"
            name="close"
            alignSelf="flex-end"
            fontSize="2xl"
            color="black"
          />
        </TouchableOpacity>
        <Text fontSize="xl" mt="xl" textAlign="center" fontWeight="bold">
          {RESULTS_TEXT[testType]}
        </Text>
        <Div p="lg" />
        <Button
          onPress={handleNavigateToResults}
          block
          bg="main900"
          rounded="circle">
          {t.viewTestResults}
        </Button>
        <Div p="lg" />
        <Text
          color="main900"
          textAlign="center"
          fontSize="lg"
          onPress={handleStartOver}>
          {t.retakeTest}
        </Text>
      </Div>
    </Modal>
  )

  const exitQuestionsScreenDropdownHandler = async (option: string) => {
    setStartOrClose(option)
    exitQuestionsScreenDropdownRef.current.open()
  }

  return (
    <>
      <TestFinishedModal />
      <Div flex={1} bg="white" pt={insets.top}>
        <Header
          pb={0}
          borderBottomWidth={1}
          borderBottomColor="gray300"
          p="lg"
          shadow="none"
          alignment="center"
          fontSize="xl"
          suffix={
            <Button
              bottom={7}
              bg="transparent"
              onPress={() => {
                exitQuestionsScreenDropdownHandler('close')
              }}>
              <Image source={Styles.images.close} h={28} w={28} />
            </Button>
          }>
          <GDFontText textWeight="bold" fontSize="xl">{`${questionNum + 1} / ${
            questions.length
          }`}</GDFontText>
        </Header>
        <Div p={14} />
        <Div>
          {isLoaded ? (
            <>
              <Div px="md" h={75} w={345} left={16} row>
                <Div w={25}>
                  <GDFontText fontSize="lg" textWeight="700">
                    {questions[questionNum]?.number + '.' ?? '0' + '.'}
                  </GDFontText>
                </Div>
                <Div w={330} maxW={320}>
                  <GDFontText textWeight="700" fontSize="lg">
                    {questions[questionNum]?.question ?? ''}
                  </GDFontText>
                </Div>
              </Div>
              {/* <Div p="xs" /> */}
              {/* move contents of test options and put padding left or margin --> just move to RIGHT somehow */}
              {Object.keys(questions[questionNum]?.options ?? {}).map(
                (option, i) => (
                  <TouchableOpacity
                    style={{}}
                    key={String(i)}
                    onPress={() => {
                      // handleAnswerInput(questions[questionNum].options[option])
                      handleAnswerInput({
                        answer: questions[questionNum]?.points
                          ? questions[questionNum]?.points[i]
                          : i,
                        category:
                          testType == 'depressionAnxietyStress'
                            ? questions[questionNum]?.category
                            : null,
                      })
                    }}>
                    <Radio
                      top={14}
                      m="sm"
                      disabled
                      value={questions[questionNum].options[option]}
                      checked={
                        chosenVal == questions[questionNum].options[option]
                      }>
                      {({ checked }) =>
                        checked ? (
                          <Div
                            alignItems="center"
                            pl="xl"
                            my={-2}
                            row
                            borderWidth={1}
                            borderColor="main900"
                            bg="gray150"
                            w="95%"
                            p="md"
                            m={1}
                            mx={4}
                            h={96}
                            rounded="xl">
                            <Icon
                              fontSize="4xl"
                              color="main900"
                              fontFamily="MaterialCommunityIcons"
                              name="checkbox-marked-circle"
                            />
                            <Text
                              h={25}
                              // pt={Platform.OS == 'android' ? 2 : 15}
                              ml="lg"
                              textAlignVertical="center"
                              textAlign="center"
                              fontWeight="bold"
                              fontSize="xl">
                              {handleOptionSelector(
                                questions[questionNum].options[option],
                              )}
                            </Text>
                          </Div>
                        ) : (
                          <Div
                            alignItems="center"
                            pl="xl"
                            my={-2}
                            row
                            bg="gray150"
                            w="95%"
                            p="md"
                            m={1}
                            mx={4}
                            h={96}
                            rounded="xl">
                            <Icon
                              fontSize="4xl"
                              fontFamily="MaterialCommunityIcons"
                              name="checkbox-blank-circle-outline"
                            />
                            <Text
                              h={25}
                              // pt={Platform.OS == 'android' ? 2 : 15}
                              ml="lg"
                              textAlignVertical="center"
                              textAlign="center"
                              fontSize="lg">
                              {handleOptionSelector(
                                questions[questionNum].options[option],
                              )}
                            </Text>
                          </Div>
                        )
                      }
                    </Radio>
                    {/* </Div> */}
                  </TouchableOpacity>
                ),
              )}
            </>
          ) : null}
        </Div>
        <Div position="absolute" bottom={10}>
          <Button
            h={50}
            bg="main900"
            block
            rounded="circle"
            m="lg"
            onPress={() => {
              exitQuestionsScreenDropdownHandler('start')
            }}>
            <Text color="white" fontSize="lg">
              {t.retakeTest}
            </Text>
          </Button>
        </Div>
      </Div>
      {/* <ExitQuestionsScreenDropdown backToStartOrClose={startOrClose} /> */}
      <Dropdown
        ref={exitQuestionsScreenDropdownRef}
        w="100%"
        rounded="2xl"
        title={
          <Div row mx="xl" alignItems="center" p="md" pb="lg">
            <Text
              color="gray900"
              textAlign="center"
              flex={1}
              fontSize="2xl"
              fontWeight="bold">
              {startOrClose == 'start'
                ? '테스트를 처음부터\n다시 시작할까요?'
                : '테스트를 그만하실래요?'}
            </Text>
          </Div>
        }>
        <Div p="lg" />
        <Div justifyContent="center">
          <Button
            bg="main900"
            w="90%"
            alignSelf="center"
            mb="xl"
            h={50}
            rounded="circle"
            onPress={() => {
              if (startOrClose == 'start') {
                setQuestionNum(0)
                setAnswers([])
                return exitQuestionsScreenDropdownRef.current.close()
              }

              Config.setIncompleteTest(testType, answers)
              exitQuestionsScreenDropdownRef.current.close()
              return navigation.goBack()
            }}>
            <Text fontSize="lg" color="white">
              {startOrClose == 'start'
                ? '처음부터 다시하기'
                : '저장하고 그만하기'}
            </Text>
          </Button>
          <Text
            fontSize="lg"
            color="main900"
            textAlign="center"
            onPress={() => {
              exitQuestionsScreenDropdownRef.current.close()
              startOrClose == 'start' ? null : navigation.goBack()
            }}>
            {startOrClose == 'start' ? '취소' : '그냥 나가기'}
          </Text>
        </Div>
      </Dropdown>
    </>
  )
}

const styles = StyleSheet.create({})

export default iTestQuestionsScreen
