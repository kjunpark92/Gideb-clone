import * as React from 'react'
import { ScrollView, StyleSheet } from 'react-native'
import { Div, Text, Image, Radio } from 'react-native-magnus'
import _ from 'lodash'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useSelector } from 'react-redux'

import { GDHeader, ExplanationModalForTests, GDFontText } from '../components'
import Styles from '../util/Styles'
import Log from '../util/Log'
import screens from '../navigation/screens'
import TEST_TYPES from '../assets/iTest/testTypes'
import Config from '../config'

interface iTestExplanationScreenProps {
  navigation: any
}

const { useState, useEffect, createRef } = React
const iTestExplanationScreen: React.FC<iTestExplanationScreenProps> = ({
  navigation,
}) => {
  const testSelectorRef = createRef()
  const profile = useSelector((state: any) => state.firebase.profile)

  const [testType, setTestType] = useState<string>('')
  const [testSelectorVisible, setTestSelectorVisible] = useState(false)
  const [modalSubtitleAcro, setModalSubtitleAcro] = useState('')
  const [modalQuestionLengthNum, setModalQuestionLengthNum] = useState(0)
  const [modalRefURL, setModalRefURL] = useState('')
  const [modalImg, setModalImg] = useState('')
  const [explainationModal, setExplainationModal] = useState<boolean>(false)
  const [modalHeader, setModalHeader] = useState('')
  const [modalDescription, setModalDescription] = useState('')
  const [testTypeSelected, setTestTypeSelected] = useState('')
  const [explanationModal, setExplanationModal] = useState(false)
  let testTypeTemp = ''
  const insets = useSafeAreaInsets()
  const chosenLangTest = TEST_TYPES[Config.getLang()]

  // const handleTestTypeSelectAndNav = (type: string) => {
  //   if (type == '') return
  //   setTestType(type)
  //   navigation.navigate(screens.iTEST_QUESTIONS, { testType: type })
  // }

  const handleExplainationModal = (testChosen: any) => {
    setModalSubtitleAcro(testChosen.subtitleAcro)
    setModalRefURL(testChosen.refURL)
    setModalImg(testChosen.img)
    setModalHeader(testChosen.header || '')
    setModalDescription(testChosen.description || '')
    setTestTypeSelected(testChosen.name || '')
    setModalQuestionLengthNum(testChosen.numberOfQuestions)
    setExplainationModal(!explainationModal)
  }

  const handleTestSelection = (selectedTest: string) => {
    if (testTypeTemp == selectedTest) {
      setTestSelectorVisible(!testSelectorVisible)
      // setTestType('')
      const findTest: any = _.find(chosenLangTest, { name: selectedTest })
      handleExplainationModal(findTest)
    }
    testTypeTemp = selectedTest
  }

  const handleGoingToTest = async (testType: string) => {
    await setExplainationModal(false)
    await navigation.navigate(screens.iTEST_QUESTIONS, { testType })
  }

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
      <Div pt={insets.top} bg="white" flex={1}>
        <GDHeader bottomLine>i???????????? ?</GDHeader>
        <ScrollView bounces={false}>
          <Div flex={1} bg="white">
            <Div row h={214} bg="gray150" flex={1}>
              <Div justifyContent="center" flex={1}>
                <Text fontSize="md" color="main900" ml="lg">
                  {'????????? ?????? ?????? ??????'}
                </Text>
                <Div p={3} />
                <GDFontText textWeight="700" fontSize="2xl" ml="lg">
                  {'???????????? ?????????\ni?????????'}
                </GDFontText>
              </Div>
              <Div ml="2xl" mt="2xl" flex={1}>
                <Div
                  bg="white"
                  overflow="visible"
                  rounded="circle"
                  w={155}
                  h={155}
                  alignItems="center"
                  justifyContent="center">
                  <Image
                    resizeMode="contain"
                    source={Styles.images.iTest.iTestClipboard}
                    h={139}
                    w={94}
                    bottom={13}
                  />
                </Div>
              </Div>
            </Div>
            <Div p="lg" mt="xl" pl="lg" flex={1}>
              <GDFontText textWeight="700" fontSize="2xl" lineHeight={25}>
                {'????????? ????????? ?????? ?????????????'}
              </GDFontText>
              <Div p="lg" />
              <Text
                lineHeight={20}
                fontSize="md"
                letterSpacing={0.5}
                color="gray900">
                {
                  '????????? ??????????????? ????????????????????? ???????????? ??????????????????. \n????????? ???????????? ?????? ?????? ????????? ????????? ?????? ???????????? ???\n????????????.'
                }
              </Text>
              <Text py="xl" fontSize="md" letterSpacing={0.5} color="gray900">
                {'5?????? ????????? ?????? ??????????????? ????????????. ???????????????????'}
              </Text>
            </Div>
            <Radio.Group
              px="md"
              flex={1}
              row
              onChange={(selection) => handleTestSelection(selection)}>
              {chosenLangTest.map((test: any, idx: number) => (
                <Radio value={test.name} key={String(idx)} flex={1}>
                  {({ checked }) => (
                    <Div
                      bg="gray150"
                      borderWidth={checked ? 1.5 : 0}
                      borderColor="main900"
                      rounded="xl"
                      h={186}
                      w={115}
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
                            <GDFontText color="white">{'??????'}</GDFontText>
                          ) : (
                            <Text color="main900">
                              {String(test.numberOfQuestions)} {'??????'}
                            </Text>
                          )}
                        </Div>
                        <Div pt="lg" />
                        <Div>
                          <GDFontText
                            textWeight="700"
                            textAlign="center"
                            fontSize="sm"
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
            <Div p="lg" alignItems="center">
              <Text color="gray500" fontSize="sm">
                {
                  '??????????????? ????????? ????????? ??????????????? ???????????? ???????????? ????????? ????????? ????????? ???????????? ????????? ????????? ???????????? ??????????????????.'
                }
              </Text>
            </Div>
            <Div p="lg" />
            <Div p="lg" />
          </Div>
        </ScrollView>
      </Div>
    </>
  )
}

const styles = StyleSheet.create({})

export default iTestExplanationScreen
