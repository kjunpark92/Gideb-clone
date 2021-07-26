import * as React from 'react'
import { ScrollView, TouchableOpacity, Modal, Platform } from 'react-native'
import {
  Div,
  Text,
  Icon,
  Button,
  Header,
  Image,
  Radio,
} from 'react-native-magnus'
import { useFirebase, useFirestore } from 'react-redux-firebase'
import { useSelector } from 'react-redux'
import _ from 'lodash'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

// import Log from '../util/Log'
import Styles from '../util/Styles'
import iTest from '../assets/iTest/'
import Config from '../config'
import screens from '../navigation/screens'
import stacks from '../navigation/stacks'
import { GDHeader, ExplanationModalForTests, GDFontText } from '../components'
import TEST_TYPES from '../assets/iTest/testTypes'

interface iTestInitialScreenProps {
  navigation: any
}

interface ExplainationModalProps {
  name?: string
  numberOfQuestions?: number
  header?: string
  description?: string
  img: any
  refURL: string
  subTitleAcro: string
  iconLink: any
}

const { basicInfo } = iTest
const { useState, useEffect } = React
const iTestInitialScreen: React.FC<iTestInitialScreenProps> = ({
  navigation,
}) => {
  const firebase = useFirebase()
  const firestore = useFirestore()
  const profile = useSelector((state: any) => state.firebase.profile)
  const insets = useSafeAreaInsets()

  const [modalSubtitleAcro, setModalSubtitleAcro] = useState('')
  const [modalQuestionLengthNum, setModalQuestionLengthNum] = useState(0)
  const [modalRefURL, setModalRefURL] = useState('')
  const [modalImg, setModalImg] = useState('')
  const [explainationModal, setExplainationModal] = useState<boolean>(false)
  const [modalHeader, setModalHeader] = useState('')
  const [modalDescription, setModalDescription] = useState('')
  const [testTypeSelected, setTestTypeSelected] = useState('')
  const [testType, setTestType] = useState('')
  const [questionNum, setQuestionNum] = useState(0)
  const [basicInfoModalVisible, setBasicInfoModalVisible] =
    useState<boolean>(false)
  const [basicInfoQuestions, setBasicInfoQuestions] = useState([])
  const [basicInfoQuestion, setBasicInfoQuestion] = useState('')
  const [basicInfoAnswers, setBasicInfoAnswers] = useState({})
  const [basicInfoQuestionNum, setBasicInfoQuestionNum] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)
  const [chosenVal, setChosenVal] = useState(null)

  const chosenLangTest = TEST_TYPES[Config.getLang()]

  useEffect(() => {
    if (!profile.basicInfo) {
      // Log.debug(basicInfo)
      setBasicInfoQuestions(basicInfo[Config.getLang()])
      setBasicInfoModalVisible(true)
      setIsLoaded(true)
    }
  }, [])

  const handleExplainationModal = (testChosen: ExplainationModalProps) => {
    setModalSubtitleAcro(testChosen.subtitleAcro)
    setModalRefURL(testChosen.refURL)
    setModalImg(testChosen.img)
    setModalHeader(testChosen.header || '')
    setModalDescription(testChosen.description || '')
    setTestTypeSelected(testChosen.name || '')
    setModalQuestionLengthNum(testChosen.numberOfQuestions)
    setExplainationModal(!explainationModal)
  }

  const handleGoingToTest = async (testType: string) => {
    await setExplainationModal(false)
    await navigation.navigate(stacks.iTEST_STACK, {
      screen: screens.iTEST_QUESTIONS,
      params: { testType },
    })
  }

  const updateProfileForBasicInfo = async (basicInfo) => {
    await firebase.updateProfile({ basicInfo })
  }

  const handleBasicInfoAnswerInput = async (option) => {
    if (questionNum + 1 == basicInfoQuestions.length) {
      setBasicInfoAnswers({ ...basicInfoAnswers, ...option })

      setBasicInfoModalVisible(false)
      updateProfileForBasicInfo({ ...basicInfoAnswers, ...option })
      return
    }
    setQuestionNum(questionNum + 1)
    setBasicInfoAnswers({ ...basicInfoAnswers, ...option })

    setTimeout(() => {
      setChosenVal(null)
    }, 300)
  }

  const BasicInfoModal = ({ isVisible }: any) => {
    // Log.debug('BasicInfoModal: basicInfoQuestions:', basicInfoQuestions)
    return (
      <Modal visible={isVisible}>
        <Div pt={insets.top}>
          <Header
            p="lg"
            shadow="none"
            alignment="center"
            fontSize="xl"
            prefix={
              <Button bg="transparent" onPress={() => navigation.goBack()}>
                <Icon
                  name="chevron-left"
                  fontFamily="Entypo"
                  fontSize="3xl"
                  color="gray900"
                />
              </Button>
            }>
            <GDFontText textWeight="700" fontSize="xl">
              {String(questionNum + 1) +
                '/' +
                String(basicInfoQuestions.length)}
            </GDFontText>
          </Header>
          <Div p="sm">
            {isLoaded && (
              <>
                <GDFontText fontSize="xl" textWeight="700">
                  {basicInfoQuestions[questionNum].question}
                </GDFontText>
                {Object.values(basicInfoQuestions[questionNum].options).map(
                  (option, i) => (
                    <TouchableOpacity
                      key={String(i)}
                      onPress={() =>
                        handleBasicInfoAnswerInput({
                          [basicInfoQuestions[questionNum].question]: option,
                        })
                      }>
                      <Div
                        justifyContent="flex-start"
                        p="lg"
                        m={10}
                        h={75}
                        rounded="xl"
                        row
                        alignItems="center"
                        bg={Styles.colors.grayscale.lighterGray}>
                        <Radio
                          top={6}
                          // justifyContent="center"
                          // alignItems="center"
                          m="sm"
                          disabled>
                          {({ checked }) =>
                            checked ? (
                              <Icon
                                fontSize="3xl"
                                fontFamily="MaterialCommunityIcons"
                                name="checkbox-marked-circle"
                              />
                            ) : (
                              <Icon
                                fontSize="3xl"
                                fontFamily="MaterialCommunityIcons"
                                name="checkbox-blank-circle-outline"
                              />
                            )
                          }
                        </Radio>
                        <Text>{option}</Text>
                      </Div>
                    </TouchableOpacity>
                  ),
                )}
              </>
            )}
          </Div>
        </Div>
      </Modal>
    )
  }

  const handleTestSelection = (selectedTest: string) => {
    if (testType == selectedTest) {
      const findTest: any = _.find(chosenLangTest, { name: selectedTest })
      handleExplainationModal(findTest)
    }
    setTestType(selectedTest)
  }

  return (
    <>
      <BasicInfoModal isVisible={basicInfoModalVisible} />
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
      <Div flex={1} bg="white" pt={insets.top}>
        <GDHeader bottomLine>i테스트</GDHeader>
        <ScrollView style={{ backgroundColor: 'white' }} bounces={false}>
          <Div p="md" />
          <Div p="lg">
            <TouchableOpacity
              onPress={() =>
                navigation.navigate(stacks.iTEST_STACK, {
                  screen: screens.iTEST_EXPLANATION,
                })
              }>
              <Div
                rounded="xl"
                h={147}
                row
                p="xl"
                m="sm"
                bg="rgba(246, 173, 85, 0.1)">
                <Div flex={3} top={5}>
                  <GDFontText fontSize={18} textWeight="bold" lineHeight={26}>
                    {'당신의 마음은\n지금 어떤가요?'}
                  </GDFontText>
                  <Button
                    bg="main900"
                    rounded="xl"
                    onPress={() =>
                      navigation.navigate(stacks.iTEST_STACK, {
                        screen: screens.iTEST_EXPLANATION,
                      })
                    }
                    h={23}
                    p={0}
                    top={16}
                    w={82}
                    fontSize={12}>
                    {'테스트 소개'}
                  </Button>
                </Div>
                <Div flex={2} justifyContent="center" alignItems="center">
                  <Image
                    source={Styles.images.iTest.iTestGuy}
                    h={100}
                    w={100}
                  />
                </Div>
              </Div>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate(stacks.iTEST_STACK, {
                  screen: screens.iTEST_HISTORY,
                })
              }>
              <Div rounded="xl" h={147} row p="xl" m="sm" bg="gray150">
                <Div flex={3} pt="lg">
                  <GDFontText fontSize={18} textWeight="bold" lineHeight={26}>
                    {'잘 지내셨나요?'}
                  </GDFontText>
                  <Button
                    bg="system900"
                    rounded="xl"
                    h={23}
                    p={0}
                    top={16}
                    w={118}
                    fontSize={12}>
                    {'지난 결과 확인하기'}
                  </Button>
                </Div>
                <Div flex={2} justifyContent="center" alignItems="center">
                  <Image
                    source={Styles.images.iTest.iTestGirl}
                    h={100}
                    w={100}
                  />
                </Div>
              </Div>
            </TouchableOpacity>
            <Div p="sm" />
            <Div px="sm">
              <GDFontText
                fontSize={18}
                textWeight="700"
                mt="2xl"
                letterSpacing={0.3}>
                {'테스트'}
              </GDFontText>
            </Div>
            <Div p="xs" />
            <Radio.Group
              // px="xs"
              flex={1}
              row
              onChange={(selection) => handleTestSelection(selection)}>
              {chosenLangTest.map((test, i) => (
                <Radio value={test.name} key={String(i)} flex={1}>
                  {({ checked }) => (
                    <Div
                      // flex={1}
                      bg="gray150"
                      // opacity={checked ? 0.2 : 1}
                      borderWidth={checked ? 1.5 : 0}
                      borderColor="main900"
                      rounded="xl"
                      h={193}
                      w={114}
                      m="sm"
                      justifyContent="center"
                      alignItems="center">
                      <Div top={15} position="absolute">
                        <Image source={test.iconLink} h={80} w={80} />
                      </Div>
                      <Div position="absolute" top={100}>
                        <Div
                          bg={profile[test.type] ? 'main900' : 'transparent'}
                          borderWidth={1}
                          borderColor="main900"
                          rounded="xl"
                          w={70}
                          h={25}
                          justifyContent="center"
                          alignItems="center"
                          alignSelf="center">
                          {profile[test.type] ? (
                            <GDFontText color="white" textWeight="bold">
                              {'완료'}
                            </GDFontText>
                          ) : (
                            <Text color="main900">
                              {String(test.numberOfQuestions)} {'문항'}
                            </Text>
                          )}
                        </Div>
                        <Div pt="lg" />
                        <Div>
                          <GDFontText
                            textAlign="center"
                            textWeight="bold"
                            fontSize="md"
                            lineHeight={20}>
                            {test.display}
                          </GDFontText>
                        </Div>
                      </Div>
                    </Div>
                  )}
                </Radio>
              ))}
            </Radio.Group>
            {Platform.OS == 'android' && <Div p="md" />}
          </Div>
        </ScrollView>
      </Div>
    </>
  )
}

export default iTestInitialScreen
