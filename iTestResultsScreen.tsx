import * as React from 'react'
import { Alert, ScrollView, TouchableOpacity, Linking } from 'react-native'
import {
  Div,
  Button,
  Text,
  Header,
  Icon,
  Image,
  Radio,
} from 'react-native-magnus'
import { useFirebase } from 'react-redux-firebase'
import { useSelector } from 'react-redux'
import _ from 'lodash'

import { useI18n } from '../hooks'
import iTestResults from '../util/iTestResults'
import Log from '../util/Log'
import Styles from '../util/Styles'
import screens from '../navigation/screens'
import stacks from '../navigation/stacks'
import dayjs from 'dayjs'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { GDFontText } from '../components'

interface iTestResultsScreenProps {
  navigation: any
  route: any
}

const { useState, useEffect } = React
const iTestResultsScreen: React.FC<iTestResultsScreenProps> = ({
  navigation,
  route,
}) => {
  const t = useI18n('iTestResults')
  const firebase = useFirebase()
  const profile = useSelector((state: any) => state.firebase.profile)
  const [result, setResult] = useState<any>(null)
  const [isLoaded, setIsLoaded] = useState<boolean>(false)
  const [selectedTab, setSelectedTab] = useState('우울증')
  const insets = useSafeAreaInsets()

  const { testType, answers } = route.params

  const switchTab = (item) => {
    Log.debug('switchTab fired: new tab:', item)
    setSelectedTab(item)
    // scrollViewRef.current.scrollTo({ y: 0 })
  }

  const updateProfileWithResults = async (testType, answers) => {
    switch (testType) {
      case 'depressionAnxietyStress':
        await firebase.updateProfile({
          DASS: { answers, dateCompleted: dayjs().format('YYYY-MM-DD') },
        })
        break
      case 'bipolar':
        await firebase.updateProfile({
          MDQ: { answers, dateCompleted: dayjs().format('YYYY-MM-DD') },
        })
        break
      case 'alcoholAbuse':
        await firebase.updateProfile({
          AUDIT: { answers, dateCompleted: dayjs().format('YYYY-MM-DD') },
        })
        break
      default:
        Alert.alert('SOMETHING WENT WRONG')
        break
    }
  }

  useEffect(() => {
    Log.debug('**iTestResults: useEffect:', testType, answers)
    setResult(iTestResults[testType](answers, profile))
    setIsLoaded(true)
    updateProfileWithResults(testType, answers)
  }, [])

  const RangeNums = () => (
    <Div row>
      {_.range(0, 101, 10).map((num: number) => (
        <Div flex={1} key={num}>
          <Text color={Styles.colors.grayscale.silver}>{String(num)}</Text>
        </Div>
      ))}
    </Div>
  )

  const HorizontalRange = ({ percentage, color }) => (
    <Div rounded="xl" h={30} bg={Styles.colors.background.light}>
      <Div bg={color} h={30} w={percentage} rounded="xl" />
    </Div>
  )

  return (
    <Div bg="white" flex={1} pt={insets.top}>
      <Header
        p="lg"
        shadow="none"
        alignment="center"
        fontSize="xl"
        suffix={
          <TouchableOpacity
            onPress={() =>
              navigation.navigate(stacks.CLIENT_STACK, {
                screen: screens.iTEST_INITIAL,
              })
            }>
            <Icon
              fontFamily="MaterialIcons"
              name="close"
              fontSize="4xl"
              color={Styles.colors.grayscale.allBlack}
            />
          </TouchableOpacity>
        }>
        {t.title}
      </Header>
      <Div borderBottomWidth={1} borderColor="gray300" mb="lg" />

      <Div bg="white" pb="3xl">
        <ScrollView bounces={false}>
          {isLoaded ? (
            <>
              {testType == 'depressionAnxietyStress' && (
                <>
                  <Div mx="5%" pb="2xl">
                    <GDFontText py="lg" fontSize="2xl" textWeight="700" w="95%">
                      {t.DASS.testTitles}
                    </GDFontText>
                    <Div borderBottomWidth={1} borderColor="gray300" my="md" />
                    <GDFontText py="lg" fontSize="2xl" textWeight="700">
                      {t.testResultText}
                    </GDFontText>
                    <Div py="lg" mb="md" bg="gray150" rounded="xl" px="md">
                      <Div row mb="md">
                        <Image
                          source={result.depression.emoji}
                          h={25}
                          w={25}
                          mr="lg"
                        />
                        <Text color="black" mr="sm">
                          {t.DASS.barGraphTitles.depression}
                        </Text>
                        <Text color="gray500">
                          {result?.depression.message}
                        </Text>
                      </Div>
                      <HorizontalRange
                        percentage={
                          String(result.depression.percentage * 100) + '%'
                        }
                        color={result.depression.color}
                      />
                      <RangeNums />
                    </Div>
                    <Div py="lg" mb="md" bg="gray150" rounded="xl" px="md">
                      <Div row mb="md">
                        <Image
                          source={result.anxiety.emoji}
                          h={25}
                          w={25}
                          mr="lg"
                        />
                        <Text color="black" mr="sm">
                          {t.DASS.barGraphTitles.anxiety}
                        </Text>
                        <Text color="gray500">{result?.anxiety.message}</Text>
                      </Div>
                      <HorizontalRange
                        percentage={
                          String(result.anxiety.percentage * 100) + '%'
                        }
                        color={result.anxiety.color}
                      />
                      <RangeNums />
                    </Div>
                    <Div py="lg" mb="md" bg="gray150" rounded="xl" px="md">
                      <Div row mb="md">
                        <Image
                          source={result.stress.emoji}
                          h={25}
                          w={25}
                          mr="lg"
                        />
                        <Text color="black" mr="sm">
                          {t.DASS.barGraphTitles.stress}
                        </Text>
                        <Text color="gray500">{result?.stress.message}</Text>
                      </Div>
                      <HorizontalRange
                        percentage={
                          String(result.stress.percentage * 100) + '%'
                        }
                        color={result.stress.color}
                      />
                      <RangeNums />
                    </Div>
                    <Div row justifyContent="space-evenly" my="lg">
                      <Div justifyContent="center" alignItems="center" row>
                        <Image source={Styles.images.emoji.m5} h={18} w={18} />
                        <Text mx="sm" fontSize="sm">
                          {t.DASS.emoji.normal}
                        </Text>
                      </Div>
                      <Div justifyContent="center" alignItems="center" row>
                        <Image source={Styles.images.emoji.m4} h={18} w={18} />
                        <Text mx="sm" fontSize="sm">
                          {t.DASS.emoji.slightly}
                        </Text>
                      </Div>
                      <Div justifyContent="center" alignItems="center" row>
                        <Image source={Styles.images.emoji.m3} h={18} w={18} />
                        <Text mx="sm" fontSize="sm">
                          {t.DASS.emoji.somewhat}
                        </Text>
                      </Div>
                      <Div justifyContent="center" alignItems="center" row>
                        <Image source={Styles.images.emoji.m2} h={18} w={18} />
                        <Text mx="sm" fontSize="sm">
                          {t.DASS.emoji.caution}
                        </Text>
                      </Div>
                      <Div justifyContent="center" alignItems="center" row>
                        <Image source={Styles.images.emoji.m1} h={18} w={18} />
                        <Text mx="sm" fontSize="sm">
                          {t.DASS.emoji.severe}
                        </Text>
                      </Div>
                    </Div>
                    <Div row mt="lg">
                      <Image
                        source={Styles.images.exclamationCircle}
                        h={24}
                        w={24}
                      />
                      <Text ml="lg" color="gray500">
                        {t.selfWarning}
                      </Text>
                    </Div>
                    <Button
                      bg="main900"
                      alignSelf="center"
                      w="95%"
                      rounded="circle"
                      mt="lg"
                      onPress={
                        () =>
                          navigation.navigate(stacks.CLIENT_STACK, {
                            screen: screens.iTEST_INITIAL,
                          })
                        // navigation.reset({
                        //   index: 0,
                        //   routes: [{ name: screens.iTEST_INITIAL }],
                        // })
                      }>
                      {t.anotherTestButton}
                    </Button>
                    <Button
                      bg="white"
                      alignSelf="center"
                      mt="lg"
                      color="main900"
                      w="100%"
                      onPress={() => {
                        // navigation.reset({
                        //   index: 0,
                        //   routes: [{ name: screens.iTEST_INITIAL }],
                        // })
                        navigation.navigate(stacks.CLIENT_STACK, {
                          screen: screens.iTEST_INITIAL,
                        })

                        // navigation.navigate(stacks.iTEST_STACK, {
                        //   screen: screens.iTEST_QUESTIONS,
                        //   params: {
                        //     testType,
                        //     restart: true,
                        //   },
                        // })
                      }}>
                      {t.retakeTestButton}
                    </Button>
                  </Div>
                  <Div>
                    {/* HORIZONTAL NAVBAR */}
                    {/* TAB SELECTOR PAGINATION */}
                    <Radio.Group row defaultValue="introduction">
                      {['우울증', '불안장애', '스트레스'].map((item, i) => (
                        <Radio
                          value={item}
                          key={String(i)}
                          onPress={() => {
                            switchTab(item)
                          }}>
                          {({ checked }) => (
                            <Div
                              px={40}
                              borderTopWidth={1}
                              borderBottomWidth={1}
                              borderColor="gray300">
                              <Div
                                flex={1}
                                py={18}
                                borderBottomWidth={item == selectedTab ? 3 : 0}>
                                <Text
                                  color={
                                    item == selectedTab ? 'dark' : 'gray500'
                                  }
                                  fontSize="xl">
                                  {item}
                                </Text>
                              </Div>
                            </Div>
                          )}
                        </Radio>
                      ))}
                    </Radio.Group>
                  </Div>
                  {selectedTab == '우울증' ? (
                    <Div mx="5%" pb="3xl">
                      <Div pb="xl">
                        <GDFontText
                          mt="2xl"
                          textWeight="700"
                          fontSize="2xl"
                          pb="xl">
                          {t.DASS.switchTab.depression.title}
                        </GDFontText>
                        <Text fontSize={14} color="gray900">
                          {t.DASS.switchTab.depression.explanationText}
                        </Text>
                      </Div>
                      <Div
                        borderBottomWidth={1}
                        borderColor="gray300"
                        mb="xl"
                      />
                      <GDFontText py="lg" textWeight="700" fontSize="2xl">
                        {t.symptom}
                      </GDFontText>
                      <Div>
                        <Div row>
                          <Image
                            source={Styles.images.results.dass.cloudyHead}
                            h={75}
                            w={75}
                          />
                          <Div pl="lg">
                            <GDFontText fontSize="xl" textWeight="700">
                              {t.DASS.symptoms.cloudyHead.title}
                            </GDFontText>
                            <Div row mt="sm">
                              <Div justifyContent="flex-start">
                                <Icon
                                  fontFamily="Entypo"
                                  name="dot-single"
                                  color="main900"
                                  mr="sm"
                                  fontSize="2xl"></Icon>
                              </Div>
                              <Text fontSize="lg">
                                {t.DASS.symptoms.cloudyHead.point1}
                              </Text>
                            </Div>
                            <Div row mt="sm">
                              <Div justifyContent="flex-start">
                                <Icon
                                  fontFamily="Entypo"
                                  name="dot-single"
                                  color="main900"
                                  mr="sm"
                                  fontSize="2xl"></Icon>
                              </Div>
                              <Text fontSize="lg">
                                {t.DASS.symptoms.cloudyHead.point2}
                              </Text>
                            </Div>
                          </Div>
                        </Div>
                        <Div mt="2xl">
                          <Div row>
                            <Image
                              source={Styles.images.results.dass.yieldHead}
                              h={75}
                              w={75}
                            />
                            <Div pl="lg">
                              <GDFontText fontSize="xl" textWeight="700">
                                {t.DASS.symptoms.yieldHead.title}
                              </GDFontText>
                              <Div row mt="sm">
                                <Div justifyContent="flex-start">
                                  <Icon
                                    fontFamily="Entypo"
                                    name="dot-single"
                                    color="main900"
                                    mr="sm"
                                    fontSize="2xl"></Icon>
                                </Div>
                                <Text fontSize="lg">
                                  {t.DASS.symptoms.yieldHead.point1}
                                </Text>
                              </Div>
                              <Div row mt="sm">
                                <Div justifyContent="flex-start">
                                  <Icon
                                    fontFamily="Entypo"
                                    name="dot-single"
                                    color="main900"
                                    mr="sm"
                                    fontSize="2xl"></Icon>
                                </Div>
                                <Text fontSize="lg">
                                  {t.DASS.symptoms.yieldHead.point2}
                                </Text>
                              </Div>
                              <Div row mt="sm">
                                <Div justifyContent="flex-start">
                                  <Icon
                                    fontFamily="Entypo"
                                    name="dot-single"
                                    color="main900"
                                    mr="sm"
                                    fontSize="2xl"></Icon>
                                </Div>
                                <Text fontSize="lg">
                                  {t.DASS.symptoms.yieldHead.point3}
                                </Text>
                              </Div>
                            </Div>
                          </Div>
                        </Div>
                        <Div mt="2xl">
                          <Div row>
                            <Image
                              source={Styles.images.results.dass.mask}
                              h={75}
                              w={75}
                            />
                            <Div pl="lg">
                              <GDFontText fontSize="xl" textWeight="700">
                                {t.DASS.symptoms.mask.title}
                              </GDFontText>
                              <Div row mt="sm">
                                <Div justifyContent="flex-start">
                                  <Icon
                                    fontFamily="Entypo"
                                    name="dot-single"
                                    color="main900"
                                    mr="sm"
                                    fontSize="2xl"></Icon>
                                </Div>
                                <Text fontSize="lg">
                                  {t.DASS.symptoms.mask.point1}
                                </Text>
                              </Div>
                              <Div row mt="sm">
                                <Div justifyContent="flex-start">
                                  <Icon
                                    fontFamily="Entypo"
                                    name="dot-single"
                                    color="main900"
                                    mr="sm"
                                    fontSize="2xl"></Icon>
                                </Div>
                                <Text fontSize="lg">
                                  {t.DASS.symptoms.mask.point2}
                                </Text>
                              </Div>
                            </Div>
                          </Div>
                        </Div>
                        <Div mt="2xl">
                          <Div row>
                            <Image
                              source={Styles.images.results.dass.sittingChair}
                              h={75}
                              w={75}
                            />
                            <Div pl="lg">
                              <GDFontText fontSize="xl" textWeight="700">
                                {t.DASS.symptoms.sittingChair1.title}
                              </GDFontText>
                              <Div row mt="sm">
                                <Div justifyContent="flex-start">
                                  <Icon
                                    fontFamily="Entypo"
                                    name="dot-single"
                                    color="main900"
                                    mr="sm"
                                    fontSize="2xl"></Icon>
                                </Div>
                                <Text fontSize="lg">
                                  {t.DASS.symptoms.sittingChair1.point1}
                                </Text>
                              </Div>
                              <Div row mt="sm">
                                <Div justifyContent="flex-start">
                                  <Icon
                                    fontFamily="Entypo"
                                    name="dot-single"
                                    color="main900"
                                    mr="sm"
                                    fontSize="2xl"></Icon>
                                </Div>
                                <Text fontSize="lg">
                                  {t.DASS.symptoms.sittingChair1.point2}
                                </Text>
                              </Div>
                              <Div row mt="sm">
                                <Div justifyContent="flex-start">
                                  <Icon
                                    fontFamily="Entypo"
                                    name="dot-single"
                                    color="main900"
                                    mr="sm"
                                    fontSize="2xl"></Icon>
                                </Div>
                                <Text fontSize="lg">
                                  {t.DASS.symptoms.sittingChair1.point3}
                                </Text>
                              </Div>
                            </Div>
                          </Div>
                        </Div>
                        <Div mt="2xl">
                          <Div row>
                            <Image
                              source={Styles.images.results.dass.mazeHeader}
                              h={75}
                              w={75}
                            />
                            <Div pl="lg">
                              <GDFontText fontSize="xl" textWeight="700">
                                {t.DASS.symptoms.mazeHeader1.title}
                              </GDFontText>
                              <Div row mt="sm">
                                <Div justifyContent="flex-start">
                                  <Icon
                                    fontFamily="Entypo"
                                    name="dot-single"
                                    color="main900"
                                    mr="sm"
                                    fontSize="2xl"></Icon>
                                </Div>
                                <Text fontSize="lg">
                                  {t.DASS.symptoms.mazeHeader1.point1}
                                </Text>
                              </Div>
                              <Div row mt="sm">
                                <Div justifyContent="flex-start">
                                  <Icon
                                    fontFamily="Entypo"
                                    name="dot-single"
                                    color="main900"
                                    mr="sm"
                                    fontSize="2xl"></Icon>
                                </Div>
                                <Text fontSize="lg">
                                  {t.DASS.symptoms.mazeHeader1.point2}
                                </Text>
                              </Div>
                            </Div>
                          </Div>
                        </Div>
                        <Button
                          bg="main900"
                          alignSelf="center"
                          w="95%"
                          rounded="circle"
                          mt="2xl"
                          onPress={() =>
                            Linking.openURL('https://blog.naver.com/wellingbe')
                          }>
                          {t.learnMoreButton}
                        </Button>
                        <Button
                          bg="white"
                          alignSelf="center"
                          mt="lg"
                          color="main900"
                          w="100%"
                          onPress={() =>
                            navigation.navigate(stacks.SEARCH_STACK)
                          }>
                          {t.findHospitalButton}
                        </Button>
                      </Div>
                    </Div>
                  ) : null}
                  {selectedTab == '불안장애' ? (
                    <Div mx="5%" pb="3xl">
                      <Div pb="xl">
                        <GDFontText
                          mt="2xl"
                          textWeight="700"
                          fontSize="2xl"
                          pb="xl">
                          {t.DASS.switchTab.anxiety.title}
                        </GDFontText>
                        <Text fontSize={14} color="gray900">
                          {t.DASS.switchTab.anxiety.explanationText}
                        </Text>
                      </Div>
                      <Div
                        borderBottomWidth={1}
                        borderColor="gray300"
                        mb="xl"
                      />
                      <GDFontText py="lg" textWeight="700" fontSize="2xl">
                        {t.symptom}
                      </GDFontText>
                      <Div row pb="lg">
                        <Image
                          source={Styles.images.results.numbers.one}
                          h={25}
                          w={25}
                          mr="lg"
                        />
                        <GDFontText textWeight="700" fontSize="2xl">
                          {t.DASS.anxiety.one.title}
                        </GDFontText>
                      </Div>
                      <Text pb="lg">{t.DASS.anxiety.one.text}</Text>
                      <Div mt="2xl">
                        <Div row>
                          <Image
                            source={Styles.images.results.dass.sittingChair}
                            h={75}
                            w={75}
                          />
                          <Div pl="lg">
                            <GDFontText fontSize="xl" textWeight="700">
                              {t.DASS.symptoms.sittingChair2.title}
                            </GDFontText>
                            <Div row mt="sm">
                              <Div justifyContent="flex-start">
                                <Icon
                                  fontFamily="Entypo"
                                  name="dot-single"
                                  color="main900"
                                  mr="sm"
                                  fontSize="2xl"></Icon>
                              </Div>
                              <Text fontSize="lg">
                                {t.DASS.symptoms.sittingChair2.point1}
                              </Text>
                            </Div>
                            <Div row mt="sm">
                              <Div justifyContent="flex-start">
                                <Icon
                                  fontFamily="Entypo"
                                  name="dot-single"
                                  color="main900"
                                  mr="sm"
                                  fontSize="2xl"></Icon>
                              </Div>
                              <Text fontSize="lg">
                                {t.DASS.symptoms.sittingChair2.point2}
                              </Text>
                            </Div>
                            <Div row mt="sm">
                              <Div justifyContent="flex-start">
                                <Icon
                                  fontFamily="Entypo"
                                  name="dot-single"
                                  color="main900"
                                  mr="sm"
                                  fontSize="2xl"></Icon>
                              </Div>
                              <Text fontSize="lg">
                                {t.DASS.symptoms.sittingChair2.point3}
                              </Text>
                            </Div>
                            <Div row mt="sm">
                              <Div justifyContent="flex-start">
                                <Icon
                                  fontFamily="Entypo"
                                  name="dot-single"
                                  color="main900"
                                  mr="sm"
                                  fontSize="2xl"></Icon>
                              </Div>
                              <Text fontSize="lg">
                                {t.DASS.symptoms.sittingChair2.point4}
                              </Text>
                            </Div>
                            <Div row mt="sm">
                              <Div justifyContent="flex-start">
                                <Icon
                                  fontFamily="Entypo"
                                  name="dot-single"
                                  color="main900"
                                  mr="sm"
                                  fontSize="2xl"></Icon>
                              </Div>
                              <Text fontSize="lg">
                                {t.DASS.symptoms.sittingChair2.point5}
                              </Text>
                            </Div>
                            <Div row mt="sm">
                              <Div justifyContent="flex-start">
                                <Icon
                                  fontFamily="Entypo"
                                  name="dot-single"
                                  color="main900"
                                  mr="sm"
                                  fontSize="2xl"></Icon>
                              </Div>
                              <Text fontSize="lg">
                                {t.DASS.symptoms.sittingChair2.point6}
                              </Text>
                            </Div>
                            <Div row mt="sm">
                              <Div justifyContent="flex-start">
                                <Icon
                                  fontFamily="Entypo"
                                  name="dot-single"
                                  color="main900"
                                  mr="sm"
                                  fontSize="2xl"></Icon>
                              </Div>
                              <Text fontSize="lg">
                                {t.DASS.symptoms.sittingChair2.point7}
                              </Text>
                            </Div>
                          </Div>
                        </Div>
                        <Div mt="2xl">
                          <Div row>
                            <Image
                              source={Styles.images.results.dass.mazeHeader}
                              h={75}
                              w={75}
                            />
                            <Div pl="lg">
                              <GDFontText fontSize="xl" textWeight="700">
                                {t.DASS.symptoms.mazeHeader2.title}
                              </GDFontText>
                              <Div row mt="sm">
                                <Div justifyContent="flex-start">
                                  <Icon
                                    fontFamily="Entypo"
                                    name="dot-single"
                                    color="main900"
                                    mr="sm"
                                    fontSize="2xl"></Icon>
                                </Div>
                                <Text fontSize="lg">
                                  {t.DASS.symptoms.mazeHeader2.point1}
                                </Text>
                              </Div>
                              <Div row mt="sm">
                                <Div justifyContent="flex-start">
                                  <Icon
                                    fontFamily="Entypo"
                                    name="dot-single"
                                    color="main900"
                                    mr="sm"
                                    fontSize="2xl"></Icon>
                                </Div>
                                <Text fontSize="lg">
                                  {t.DASS.symptoms.mazeHeader2.point2}
                                </Text>
                              </Div>
                              <Div row mt="sm">
                                <Div justifyContent="flex-start">
                                  <Icon
                                    fontFamily="Entypo"
                                    name="dot-single"
                                    color="main900"
                                    mr="sm"
                                    fontSize="2xl"></Icon>
                                </Div>
                                <Text fontSize="lg">
                                  {t.DASS.symptoms.mazeHeader2.point3}
                                </Text>
                              </Div>
                              <Div row mt="sm">
                                <Div justifyContent="flex-start">
                                  <Icon
                                    fontFamily="Entypo"
                                    name="dot-single"
                                    color="main900"
                                    mr="sm"
                                    fontSize="2xl"></Icon>
                                </Div>
                                <Text fontSize="lg">
                                  {t.DASS.symptoms.mazeHeader2.point4}
                                </Text>
                              </Div>
                            </Div>
                          </Div>
                        </Div>
                        <Div row pb="lg" mt="2xl">
                          <Image
                            source={Styles.images.results.numbers.two}
                            h={25}
                            w={25}
                            mr="lg"
                          />
                          <GDFontText textWeight="700" fontSize="2xl">
                            {t.DASS.anxiety.two.title}
                          </GDFontText>
                        </Div>
                        <Text pb="lg">{t.DASS.anxiety.two.text}</Text>
                        <Div mt="2xl">
                          <Div row>
                            <Image
                              source={Styles.images.results.dass.holdingChest}
                              h={75}
                              w={75}
                            />
                            <Div pl="lg">
                              <GDFontText fontSize="xl" textWeight="700">
                                {t.DASS.symptoms.holdingChest.title}
                              </GDFontText>
                              <Div row mt="sm">
                                <Div justifyContent="flex-start">
                                  <Icon
                                    fontFamily="Entypo"
                                    name="dot-single"
                                    color="main900"
                                    mr="sm"
                                    fontSize="2xl"></Icon>
                                </Div>
                                <Text fontSize="lg">
                                  {t.DASS.symptoms.holdingChest.point1}
                                </Text>
                              </Div>
                              <Div row mt="sm">
                                <Div justifyContent="flex-start">
                                  <Icon
                                    fontFamily="Entypo"
                                    name="dot-single"
                                    color="main900"
                                    mr="sm"
                                    fontSize="2xl"></Icon>
                                </Div>
                                <Text fontSize="lg">
                                  {t.DASS.symptoms.holdingChest.point2}
                                </Text>
                              </Div>
                              <Div row mt="sm">
                                <Div justifyContent="flex-start">
                                  <Icon
                                    fontFamily="Entypo"
                                    name="dot-single"
                                    color="main900"
                                    mr="sm"
                                    fontSize="2xl"></Icon>
                                </Div>
                                <Text fontSize="lg">
                                  {t.DASS.symptoms.holdingChest.point3}
                                </Text>
                              </Div>
                              <Div row mt="sm">
                                <Div justifyContent="flex-start">
                                  <Icon
                                    fontFamily="Entypo"
                                    name="dot-single"
                                    color="main900"
                                    mr="sm"
                                    fontSize="2xl"></Icon>
                                </Div>
                                <Text fontSize="lg">
                                  {t.DASS.symptoms.holdingChest.point4}
                                </Text>
                              </Div>
                            </Div>
                          </Div>
                        </Div>
                        <Div mt="2xl">
                          <Div row>
                            <Image
                              source={Styles.images.results.dass.nuclearHead}
                              h={75}
                              w={75}
                            />
                            <Div pl="lg">
                              <GDFontText fontSize="xl" textWeight="700">
                                {t.DASS.symptoms.nuclearHead.title}
                              </GDFontText>
                              <Div row mt="sm">
                                <Div justifyContent="flex-start">
                                  <Icon
                                    fontFamily="Entypo"
                                    name="dot-single"
                                    color="main900"
                                    mr="sm"
                                    fontSize="2xl"></Icon>
                                </Div>
                                <Text fontSize="lg">
                                  {t.DASS.symptoms.nuclearHead.point1}
                                </Text>
                              </Div>
                              <Div row mt="sm">
                                <Div justifyContent="flex-start">
                                  <Icon
                                    fontFamily="Entypo"
                                    name="dot-single"
                                    color="main900"
                                    mr="sm"
                                    fontSize="2xl"></Icon>
                                </Div>
                                <Text fontSize="lg">
                                  {t.DASS.symptoms.nuclearHead.point2}
                                </Text>
                              </Div>
                              <Div row mt="sm">
                                <Div justifyContent="flex-start">
                                  <Icon
                                    fontFamily="Entypo"
                                    name="dot-single"
                                    color="main900"
                                    mr="sm"
                                    fontSize="2xl"></Icon>
                                </Div>
                                <Text fontSize="lg">
                                  {t.DASS.symptoms.nuclearHead.point3}
                                </Text>
                              </Div>
                              <Div row mt="sm">
                                <Div justifyContent="flex-start">
                                  <Icon
                                    fontFamily="Entypo"
                                    name="dot-single"
                                    color="main900"
                                    mr="sm"
                                    fontSize="2xl"></Icon>
                                </Div>
                                <Text fontSize="lg">
                                  {t.DASS.symptoms.nuclearHead.point4}
                                </Text>
                              </Div>
                              <Div row mt="sm">
                                <Div justifyContent="flex-start">
                                  <Icon
                                    fontFamily="Entypo"
                                    name="dot-single"
                                    color="main900"
                                    mr="sm"
                                    fontSize="2xl"></Icon>
                                </Div>
                                <Text fontSize="lg">
                                  {t.DASS.symptoms.nuclearHead.point5}
                                </Text>
                              </Div>
                            </Div>
                          </Div>
                        </Div>
                        <Div mt="2xl">
                          <Div row>
                            <Image
                              source={Styles.images.results.dass.shakyMan}
                              h={75}
                              w={75}
                            />
                            <Div pl="lg">
                              <GDFontText fontSize="xl" textWeight="700">
                                {t.DASS.symptoms.shakyMan.title}
                              </GDFontText>
                              <Div row mt="sm">
                                <Div justifyContent="flex-start">
                                  <Icon
                                    fontFamily="Entypo"
                                    name="dot-single"
                                    color="main900"
                                    mr="sm"
                                    fontSize="2xl"></Icon>
                                </Div>
                                <Text fontSize="lg">
                                  {t.DASS.symptoms.shakyMan.point1}
                                </Text>
                              </Div>
                              <Div row mt="sm">
                                <Div justifyContent="flex-start">
                                  <Icon
                                    fontFamily="Entypo"
                                    name="dot-single"
                                    color="main900"
                                    mr="sm"
                                    fontSize="2xl"></Icon>
                                </Div>
                                <Text fontSize="lg">
                                  {t.DASS.symptoms.shakyMan.point2}
                                </Text>
                              </Div>
                              <Div row mt="sm">
                                <Div justifyContent="flex-start">
                                  <Icon
                                    fontFamily="Entypo"
                                    name="dot-single"
                                    color="main900"
                                    mr="sm"
                                    fontSize="2xl"></Icon>
                                </Div>
                                <Text fontSize="lg">
                                  {t.DASS.symptoms.shakyMan.point3}
                                </Text>
                              </Div>
                              <Div row mt="sm">
                                <Div justifyContent="flex-start">
                                  <Icon
                                    fontFamily="Entypo"
                                    name="dot-single"
                                    color="main900"
                                    mr="sm"
                                    fontSize="2xl"></Icon>
                                </Div>
                                <Text fontSize="lg">
                                  {t.DASS.symptoms.shakyMan.point4}
                                </Text>
                              </Div>
                            </Div>
                          </Div>
                        </Div>
                        <Div row pb="lg" mt="2xl">
                          <Image
                            source={Styles.images.results.numbers.three}
                            h={25}
                            w={25}
                            mr="lg"
                          />
                          <GDFontText textWeight="700" fontSize="2xl">
                            {t.DASS.anxiety.three.title}
                          </GDFontText>
                        </Div>
                        <Text pb="lg">{t.DASS.anxiety.three.text}</Text>
                        <Div mt="2xl">
                          <Div row>
                            <Image
                              source={Styles.images.results.dass.spiralHead}
                              h={75}
                              w={75}
                            />
                            <Div pl="lg">
                              <GDFontText fontSize="xl" textWeight="700">
                                {t.DASS.symptoms.spiralHead.title}
                              </GDFontText>
                              <Div row mt="sm">
                                <Div justifyContent="flex-start">
                                  <Icon
                                    fontFamily="Entypo"
                                    name="dot-single"
                                    color="main900"
                                    mr="sm"
                                    fontSize="2xl"></Icon>
                                </Div>
                                <Text fontSize="lg">
                                  {t.DASS.symptoms.spiralHead.point1}
                                </Text>
                              </Div>
                            </Div>
                          </Div>
                        </Div>
                        <Div mt="2xl">
                          <Div row>
                            <Image
                              source={Styles.images.results.dass.puzzleHead}
                              h={75}
                              w={75}
                            />
                            <Div pl="lg">
                              <GDFontText fontSize="xl" textWeight="700">
                                {t.DASS.symptoms.puzzleHead.title}
                              </GDFontText>
                              <Div row mt="sm">
                                <Div justifyContent="flex-start">
                                  <Icon
                                    fontFamily="Entypo"
                                    name="dot-single"
                                    color="main900"
                                    mr="sm"
                                    fontSize="2xl"></Icon>
                                </Div>
                                <Text fontSize="lg">
                                  {t.DASS.symptoms.puzzleHead.point1}
                                </Text>
                              </Div>
                            </Div>
                          </Div>
                        </Div>
                        <Button
                          bg="main900"
                          alignSelf="center"
                          w="95%"
                          rounded="circle"
                          mt="2xl"
                          onPress={() =>
                            Linking.openURL('https://blog.naver.com/wellingbe')
                          }>
                          {t.learnMoreButton}
                        </Button>
                        <Button
                          bg="white"
                          alignSelf="center"
                          mt="lg"
                          color="main900"
                          w="100%"
                          onPress={() =>
                            navigation.navigate(stacks.SEARCH_STACK)
                          }>
                          {t.findHospitalButton}
                        </Button>
                      </Div>
                    </Div>
                  ) : null}
                  {selectedTab == '스트레스' ? (
                    <Div mx="5%" pb="3xl">
                      <Div pb="xl">
                        <GDFontText
                          mt="2xl"
                          textWeight="700"
                          fontSize="2xl"
                          pb="xl">
                          {t.DASS.switchTab.stress.title}
                        </GDFontText>
                        <Text fontSize={14} color="gray900">
                          {t.DASS.switchTab.stress.explanationText}
                        </Text>
                      </Div>
                      <Div
                        borderBottomWidth={1}
                        borderColor="gray300"
                        mb="xl"
                      />
                      <GDFontText py="lg" textWeight="700" fontSize="2xl">
                        {t.symptom}
                      </GDFontText>
                      <Div>
                        <Div row>
                          <Image
                            source={Styles.images.results.dass.sittingChair}
                            h={75}
                            w={75}
                          />
                          <Div pl="lg">
                            <GDFontText fontSize="xl" textWeight="700">
                              {t.DASS.symptoms.sittingChair3.title}
                            </GDFontText>
                            <Div row mt="sm">
                              <Div justifyContent="flex-start">
                                <Icon
                                  fontFamily="Entypo"
                                  name="dot-single"
                                  color="main900"
                                  mr="sm"
                                  fontSize="2xl"></Icon>
                              </Div>
                              <Text fontSize="lg">
                                {t.DASS.symptoms.sittingChair3.point1}
                              </Text>
                            </Div>
                            <Div row mt="sm">
                              <Div justifyContent="flex-start">
                                <Icon
                                  fontFamily="Entypo"
                                  name="dot-single"
                                  color="main900"
                                  mr="sm"
                                  fontSize="2xl"></Icon>
                              </Div>
                              <Text fontSize="lg">
                                {t.DASS.symptoms.sittingChair3.point2}
                              </Text>
                            </Div>
                            <Div row mt="sm">
                              <Div justifyContent="flex-start">
                                <Icon
                                  fontFamily="Entypo"
                                  name="dot-single"
                                  color="main900"
                                  mr="sm"
                                  fontSize="2xl"></Icon>
                              </Div>
                              <Text fontSize="lg">
                                {t.DASS.symptoms.sittingChair3.point3}
                              </Text>
                            </Div>
                            <Div row mt="sm">
                              <Div justifyContent="flex-start">
                                <Icon
                                  fontFamily="Entypo"
                                  name="dot-single"
                                  color="main900"
                                  mr="sm"
                                  fontSize="2xl"></Icon>
                              </Div>
                              <Text fontSize="lg">
                                {t.DASS.symptoms.sittingChair3.point4}
                              </Text>
                            </Div>
                            <Div row mt="sm">
                              <Div justifyContent="flex-start">
                                <Icon
                                  fontFamily="Entypo"
                                  name="dot-single"
                                  color="main900"
                                  mr="sm"
                                  fontSize="2xl"></Icon>
                              </Div>
                              <Text fontSize="lg">
                                {t.DASS.symptoms.sittingChair3.point5}
                              </Text>
                            </Div>
                            <Div row mt="sm">
                              <Div justifyContent="flex-start">
                                <Icon
                                  fontFamily="Entypo"
                                  name="dot-single"
                                  color="main900"
                                  mr="sm"
                                  fontSize="2xl"></Icon>
                              </Div>
                              <Text fontSize="lg">
                                {t.DASS.symptoms.sittingChair3.point6}
                              </Text>
                            </Div>
                          </Div>
                        </Div>
                        <Div mt="2xl">
                          <Div row>
                            <Image
                              source={Styles.images.results.dass.mazeHeader}
                              h={75}
                              w={75}
                            />
                            <Div pl="lg">
                              <GDFontText fontSize="xl" textWeight="700">
                                {t.DASS.symptoms.mazeHeader3.title}
                              </GDFontText>
                              <Div row mt="sm">
                                <Div justifyContent="flex-start">
                                  <Icon
                                    fontFamily="Entypo"
                                    name="dot-single"
                                    color="main900"
                                    mr="sm"
                                    fontSize="2xl"></Icon>
                                </Div>
                                <Text fontSize="lg">
                                  {t.DASS.symptoms.mazeHeader3.point1}
                                </Text>
                              </Div>
                              <Div row mt="sm">
                                <Div justifyContent="flex-start">
                                  <Icon
                                    fontFamily="Entypo"
                                    name="dot-single"
                                    color="main900"
                                    mr="sm"
                                    fontSize="2xl"></Icon>
                                </Div>
                                <Text fontSize="lg">
                                  {t.DASS.symptoms.mazeHeader3.point2}
                                </Text>
                              </Div>
                              <Div row mt="sm">
                                <Div justifyContent="flex-start">
                                  <Icon
                                    fontFamily="Entypo"
                                    name="dot-single"
                                    color="main900"
                                    mr="sm"
                                    fontSize="2xl"></Icon>
                                </Div>
                                <Text fontSize="lg">
                                  {t.DASS.symptoms.mazeHeader3.point3}
                                </Text>
                              </Div>
                              <Div row mt="sm">
                                <Div justifyContent="flex-start">
                                  <Icon
                                    fontFamily="Entypo"
                                    name="dot-single"
                                    color="main900"
                                    mr="sm"
                                    fontSize="2xl"></Icon>
                                </Div>
                                <Text fontSize="lg">
                                  {t.DASS.symptoms.mazeHeader3.point4}
                                </Text>
                              </Div>
                              <Div row mt="sm">
                                <Div justifyContent="flex-start">
                                  <Icon
                                    fontFamily="Entypo"
                                    name="dot-single"
                                    color="main900"
                                    mr="sm"
                                    fontSize="2xl"></Icon>
                                </Div>
                                <Text fontSize="lg">
                                  {t.DASS.symptoms.mazeHeader3.point5}
                                </Text>
                              </Div>
                              <Div row mt="sm">
                                <Div justifyContent="flex-start">
                                  <Icon
                                    fontFamily="Entypo"
                                    name="dot-single"
                                    color="main900"
                                    mr="sm"
                                    fontSize="2xl"></Icon>
                                </Div>
                                <Text fontSize="lg">
                                  {t.DASS.symptoms.mazeHeader3.point6}
                                </Text>
                              </Div>
                            </Div>
                          </Div>
                        </Div>
                        <Div mt="2xl">
                          <Div row>
                            <Image
                              source={Styles.images.results.dass.shakyFist}
                              h={75}
                              w={75}
                            />
                            <Div pl="lg">
                              <GDFontText fontSize="xl" textWeight="700">
                                {t.DASS.symptoms.shakyFist.title}
                              </GDFontText>
                              <Div row mt="sm">
                                <Div justifyContent="flex-start">
                                  <Icon
                                    fontFamily="Entypo"
                                    name="dot-single"
                                    color="main900"
                                    mr="sm"
                                    fontSize="2xl"></Icon>
                                </Div>
                                <Text fontSize="lg">
                                  {t.DASS.symptoms.shakyFist.point1}
                                </Text>
                              </Div>
                              <Div row mt="sm">
                                <Div justifyContent="flex-start">
                                  <Icon
                                    fontFamily="Entypo"
                                    name="dot-single"
                                    color="main900"
                                    mr="sm"
                                    fontSize="2xl"></Icon>
                                </Div>
                                <Text fontSize="lg">
                                  {t.DASS.symptoms.shakyFist.point2}
                                </Text>
                              </Div>
                              <Div row mt="sm">
                                <Div justifyContent="flex-start">
                                  <Icon
                                    fontFamily="Entypo"
                                    name="dot-single"
                                    color="main900"
                                    mr="sm"
                                    fontSize="2xl"></Icon>
                                </Div>
                                <Text fontSize="lg">
                                  {t.DASS.symptoms.shakyFist.point3}
                                </Text>
                              </Div>
                              <Div row mt="sm">
                                <Div justifyContent="flex-start">
                                  <Icon
                                    fontFamily="Entypo"
                                    name="dot-single"
                                    color="main900"
                                    mr="sm"
                                    fontSize="2xl"></Icon>
                                </Div>
                                <Text fontSize="lg">
                                  {t.DASS.symptoms.shakyFist.point4}
                                </Text>
                              </Div>
                              <Div row mt="sm">
                                <Div justifyContent="flex-start">
                                  <Icon
                                    fontFamily="Entypo"
                                    name="dot-single"
                                    color="main900"
                                    mr="sm"
                                    fontSize="2xl"></Icon>
                                </Div>
                                <Text fontSize="lg">
                                  {t.DASS.symptoms.shakyFist.point5}
                                </Text>
                              </Div>
                            </Div>
                          </Div>
                        </Div>
                        <Button
                          bg="main900"
                          alignSelf="center"
                          w="95%"
                          rounded="circle"
                          mt="2xl"
                          onPress={() =>
                            Linking.openURL('https://blog.naver.com/wellingbe')
                          }>
                          {t.learnMoreButton}
                        </Button>
                        <Button
                          bg="white"
                          alignSelf="center"
                          mt="lg"
                          color="main900"
                          w="100%"
                          onPress={() =>
                            navigation.navigate(stacks.SEARCH_STACK)
                          }>
                          {t.findHospitalButton}
                        </Button>
                      </Div>
                    </Div>
                  ) : null}
                </>
              )}
              {testType == 'bipolar' && (
                <>
                  <Div mx="5%" pb="3xl">
                    <GDFontText py="lg" fontSize="2xl" textWeight="700" w="95%">
                      {t.MDQ.testTitles}
                    </GDFontText>
                    <Div borderBottomWidth={1} borderColor="gray300" my="md" />

                    <GDFontText py="lg" fontSize="2xl" textWeight="700">
                      {t.testResultText}
                    </GDFontText>
                    <Div py="lg" mb="md" bg="gray150" rounded="xl" px="md">
                      <Div row mb="md">
                        <Image source={result.emoji} h={25} w={25} mr="lg" />
                        <Text>{result.message}</Text>
                      </Div>
                      <HorizontalRange
                        percentage={String(result.percentage * 100) + '%'}
                        color={result.color}
                      />
                      <RangeNums />
                    </Div>
                    <Div row justifyContent="flex-start" my="lg">
                      <Div justifyContent="center" alignItems="center" row>
                        <Image source={Styles.images.emoji.m5} h={18} w={18} />
                        <Text mx="sm" fontSize="sm">
                          {t.MDQ.emoji.normal}
                        </Text>
                      </Div>
                      <Div justifyContent="center" alignItems="center" row>
                        <Image source={Styles.images.emoji.m1} h={18} w={18} />
                        <Text mx="sm" fontSize="sm">
                          {t.MDQ.emoji.severe}
                        </Text>
                      </Div>
                    </Div>
                    <Div row mt="lg">
                      <Image
                        source={Styles.images.exclamationCircle}
                        h={24}
                        w={24}
                      />
                      <Text ml="lg" color="gray500">
                        {t.selfWarning}
                      </Text>
                    </Div>
                    <Button
                      bg="main900"
                      alignSelf="center"
                      w="95%"
                      rounded="circle"
                      mt="lg"
                      onPress={() =>
                        navigation.navigate(stacks.CLIENT_STACK, {
                          screen: screens.iTEST_INITIAL,
                        })
                      }>
                      {t.anotherTestButton}
                    </Button>
                    <Button
                      bg="white"
                      alignSelf="center"
                      mt="lg"
                      color="main900"
                      w="100%"
                      onPress={() =>
                        navigation.navigate(stacks.CLIENT_STACK, {
                          screen: screens.iTEST_INITIAL,
                        })
                      }>
                      {t.retakeTestButton}
                    </Button>
                    <Div pb="xl">
                      <GDFontText
                        mt="2xl"
                        textWeight="700"
                        fontSize="2xl"
                        pb="xl">
                        {t.MDQ.explanationTitle}
                      </GDFontText>
                      <Text fontSize={14} color="gray900">
                        {t.MDQ.explanationText}
                      </Text>
                    </Div>
                    <Div borderBottomWidth={1} borderColor="gray300" mb="xl" />
                    <GDFontText py="lg" textWeight="700" fontSize="2xl">
                      {t.symptom}
                    </GDFontText>
                    <Div>
                      <Div row>
                        <Image
                          source={Styles.images.results.mdq.masks}
                          h={75}
                          w={75}
                        />
                        <Div pl="lg">
                          <GDFontText fontSize="xl" textWeight="700">
                            {t.MDQ.symptoms.masks.title}
                          </GDFontText>
                          <Div row mt="sm">
                            <Div justifyContent="flex-start">
                              <Icon
                                fontFamily="Entypo"
                                name="dot-single"
                                color="main900"
                                mr="sm"
                                fontSize="2xl"></Icon>
                            </Div>
                            <Text fontSize="lg">
                              {t.MDQ.symptoms.masks.point1}
                            </Text>
                          </Div>
                          <Div row mt="sm">
                            <Div justifyContent="flex-start">
                              <Icon
                                fontFamily="Entypo"
                                name="dot-single"
                                color="main900"
                                mr="sm"
                                fontSize="2xl"></Icon>
                            </Div>
                            <Text fontSize="lg">
                              {t.MDQ.symptoms.masks.point2}
                            </Text>
                          </Div>
                          <Div row mt="sm">
                            <Div justifyContent="flex-start">
                              <Icon
                                fontFamily="Entypo"
                                name="dot-single"
                                color="main900"
                                mr="sm"
                                fontSize="2xl"></Icon>
                            </Div>
                            <Text fontSize="lg">
                              {t.MDQ.symptoms.masks.point3}
                            </Text>
                          </Div>
                          <Div row mt="sm">
                            <Div justifyContent="flex-start">
                              <Icon
                                fontFamily="Entypo"
                                name="dot-single"
                                color="main900"
                                mr="sm"
                                fontSize="2xl"></Icon>
                            </Div>
                            <Text fontSize="lg">
                              {t.MDQ.symptoms.masks.point4}
                            </Text>
                          </Div>
                          <Div row mt="sm">
                            <Div justifyContent="flex-start">
                              <Icon
                                fontFamily="Entypo"
                                name="dot-single"
                                color="main900"
                                mr="sm"
                                fontSize="2xl"></Icon>
                            </Div>
                            <Text fontSize="lg">
                              {t.MDQ.symptoms.masks.point5}
                            </Text>
                          </Div>
                          <Div row mt="sm">
                            <Div justifyContent="flex-start">
                              <Icon
                                fontFamily="Entypo"
                                name="dot-single"
                                color="main900"
                                mr="sm"
                                fontSize="2xl"></Icon>
                            </Div>
                            <Text fontSize="lg">
                              {t.MDQ.symptoms.masks.point6}
                            </Text>
                          </Div>
                          <Div row mt="sm">
                            <Div justifyContent="flex-start">
                              <Icon
                                fontFamily="Entypo"
                                name="dot-single"
                                color="main900"
                                mr="sm"
                                fontSize="2xl"></Icon>
                            </Div>
                            <Text fontSize="lg">
                              {t.MDQ.symptoms.masks.point7}
                            </Text>
                          </Div>
                        </Div>
                      </Div>
                      <Div mt="2xl">
                        <Div row>
                          <Image
                            source={Styles.images.results.mdq.rainyHead}
                            h={75}
                            w={75}
                          />
                          <Div pl="lg">
                            <GDFontText fontSize="xl" textWeight="700">
                              {t.MDQ.symptoms.rainyHead.title}
                            </GDFontText>
                            <Div row mt="sm">
                              <Div justifyContent="flex-start">
                                <Icon
                                  fontFamily="Entypo"
                                  name="dot-single"
                                  color="main900"
                                  mr="sm"
                                  fontSize="2xl"></Icon>
                              </Div>
                              <Text fontSize="lg">
                                {t.MDQ.symptoms.rainyHead.point1}
                              </Text>
                            </Div>
                            <Div row mt="sm">
                              <Div justifyContent="flex-start">
                                <Icon
                                  fontFamily="Entypo"
                                  name="dot-single"
                                  color="main900"
                                  mr="sm"
                                  fontSize="2xl"></Icon>
                              </Div>
                              <Text fontSize="lg">
                                {t.MDQ.symptoms.rainyHead.point2}
                              </Text>
                            </Div>
                            <Div row mt="sm">
                              <Div justifyContent="flex-start">
                                <Icon
                                  fontFamily="Entypo"
                                  name="dot-single"
                                  color="main900"
                                  mr="sm"
                                  fontSize="2xl"></Icon>
                              </Div>
                              <Text fontSize="lg">
                                {t.MDQ.symptoms.rainyHead.point3}
                              </Text>
                            </Div>
                            <Div row mt="sm">
                              <Div justifyContent="flex-start">
                                <Icon
                                  fontFamily="Entypo"
                                  name="dot-single"
                                  color="main900"
                                  mr="sm"
                                  fontSize="2xl"></Icon>
                              </Div>
                              <Text fontSize="lg">
                                {t.MDQ.symptoms.rainyHead.point4}
                              </Text>
                            </Div>
                            <Div row mt="sm">
                              <Div justifyContent="flex-start">
                                <Icon
                                  fontFamily="Entypo"
                                  name="dot-single"
                                  color="main900"
                                  mr="sm"
                                  fontSize="2xl"></Icon>
                              </Div>
                              <Text fontSize="lg">
                                {t.MDQ.symptoms.rainyHead.point5}
                              </Text>
                            </Div>
                            <Div row mt="sm">
                              <Div justifyContent="flex-start">
                                <Icon
                                  fontFamily="Entypo"
                                  name="dot-single"
                                  color="main900"
                                  mr="sm"
                                  fontSize="2xl"></Icon>
                              </Div>
                              <Text fontSize="lg">
                                {t.MDQ.symptoms.rainyHead.point6}
                              </Text>
                            </Div>
                            <Div row mt="sm">
                              <Div justifyContent="flex-start">
                                <Icon
                                  fontFamily="Entypo"
                                  name="dot-single"
                                  color="main900"
                                  mr="sm"
                                  fontSize="2xl"></Icon>
                              </Div>
                              <Text fontSize="lg">
                                {t.MDQ.symptoms.rainyHead.point7}
                              </Text>
                            </Div>
                          </Div>
                        </Div>
                      </Div>
                      <Button
                        bg="main900"
                        alignSelf="center"
                        w="95%"
                        rounded="circle"
                        mt="2xl"
                        onPress={() =>
                          Linking.openURL('https://blog.naver.com/wellingbe')
                        }>
                        {t.learnMoreButton}
                      </Button>
                      <Button
                        bg="white"
                        alignSelf="center"
                        mt="lg"
                        color="main900"
                        w="100%"
                        onPress={() =>
                          navigation.navigate(stacks.SEARCH_STACK)
                        }>
                        {t.findHospitalButton}
                      </Button>
                    </Div>
                  </Div>
                </>
              )}
              {testType == 'alcoholAbuse' && (
                <>
                  <Div mx="5%" pb="3xl">
                    <GDFontText py="lg" fontSize="2xl" textWeight="700" w="95%">
                      {t.AUDIT.testTitles}
                    </GDFontText>
                    <Div borderBottomWidth={1} borderColor="gray300" my="md" />
                    <GDFontText py="lg" fontSize="2xl" textWeight="700">
                      {t.testResultText}
                    </GDFontText>
                    <Div py="lg" mb="md" bg="gray150" rounded="xl" px="md">
                      <Div row mb="md">
                        <Image source={result.emoji} h={25} w={25} mr="lg" />
                        <Text>{result.message}</Text>
                      </Div>
                      <HorizontalRange
                        percentage={String(result.percentage * 100) + '%'}
                        color={result.color}
                      />
                      <RangeNums />
                    </Div>
                    <Div row justifyContent="flex-start" my="lg">
                      <Div justifyContent="center" alignItems="center" row>
                        <Image source={Styles.images.emoji.m5} h={18} w={18} />
                        <Text mx="sm" fontSize="sm">
                          {t.AUDIT.emoji.normal}
                        </Text>
                      </Div>
                      <Div justifyContent="center" alignItems="center" row>
                        <Image source={Styles.images.emoji.m2} h={18} w={18} />
                        <Text mx="sm" fontSize="sm">
                          {t.AUDIT.emoji.caution}
                        </Text>
                      </Div>
                      <Div justifyContent="center" alignItems="center" row>
                        <Image source={Styles.images.emoji.m1} h={18} w={18} />
                        <Text mx="sm" fontSize="sm">
                          {t.AUDIT.emoji.severe}
                        </Text>
                      </Div>
                    </Div>
                    <Div row mt="lg">
                      <Image
                        source={Styles.images.exclamationCircle}
                        h={24}
                        w={24}
                      />
                      <Text ml="lg" color="gray500">
                        {t.selfWarning}
                      </Text>
                    </Div>
                    <Button
                      bg="main900"
                      alignSelf="center"
                      w="95%"
                      rounded="circle"
                      mt="lg"
                      onPress={() =>
                        navigation.navigate(stacks.CLIENT_STACK, {
                          screen: screens.iTEST_INITIAL,
                        })
                      }>
                      {t.anotherTestButton}
                    </Button>
                    <Button
                      bg="white"
                      alignSelf="center"
                      mt="lg"
                      color="main900"
                      w="100%"
                      onPress={
                        () =>
                          // navigation.navigate.popToTop() &&
                          navigation.navigate(stacks.CLIENT_STACK, {
                            screen: screens.iTEST_INITIAL,
                          })
                        // navigation.reset({
                        //   index: 0,
                        //   routes: [
                        //     { name: screens.iTEST_INITIAL },
                        //     // { name: screens.iTEST_INITIAL },
                        //   ],
                        // })
                      }>
                      {t.retakeTestButton}
                    </Button>
                    <Div pb="xl">
                      <GDFontText
                        mt="2xl"
                        textWeight="700"
                        fontSize="2xl"
                        pb="xl">
                        {t.AUDIT.explanationTitle}
                      </GDFontText>
                      <Text fontSize={14} color="gray900">
                        {t.AUDIT.explanationText}
                      </Text>
                    </Div>
                    <Div borderBottomWidth={1} borderColor="gray300" mb="xl" />
                    <GDFontText py="lg" textWeight="700" fontSize="2xl">
                      {t.symptom}
                    </GDFontText>
                    <Div>
                      <Div row>
                        <Image
                          source={Styles.images.results.audit.shakyHand}
                          h={75}
                          w={75}
                        />
                        <Div pl="lg">
                          <GDFontText fontSize="xl" textWeight="700">
                            {t.AUDIT.symptoms.shakyHand.title}
                          </GDFontText>
                          <Div row mt="sm">
                            <Div justifyContent="flex-start">
                              <Icon
                                fontFamily="Entypo"
                                name="dot-single"
                                color="main900"
                                mr="sm"
                                fontSize="2xl"></Icon>
                            </Div>
                            <Text fontSize="lg">
                              {t.AUDIT.symptoms.shakyHand.point1}
                            </Text>
                          </Div>
                          <Div row mt="sm">
                            <Div justifyContent="flex-start">
                              <Icon
                                fontFamily="Entypo"
                                name="dot-single"
                                color="main900"
                                mr="sm"
                                fontSize="2xl"></Icon>
                            </Div>
                            <Text fontSize="lg">
                              {t.AUDIT.symptoms.shakyHand.point2}
                            </Text>
                          </Div>
                          <Div row mt="sm">
                            <Div justifyContent="flex-start">
                              <Icon
                                fontFamily="Entypo"
                                name="dot-single"
                                color="main900"
                                mr="sm"
                                fontSize="2xl"></Icon>
                            </Div>
                            <Text fontSize="lg">
                              {t.AUDIT.symptoms.shakyHand.point3}
                            </Text>
                          </Div>
                          <Div row mt="sm">
                            <Div justifyContent="flex-start">
                              <Icon
                                fontFamily="Entypo"
                                name="dot-single"
                                color="main900"
                                mr="sm"
                                fontSize="2xl"></Icon>
                            </Div>
                            <Text fontSize="lg">
                              {t.AUDIT.symptoms.shakyHand.point4}
                            </Text>
                          </Div>
                          <Div row mt="sm">
                            <Div justifyContent="flex-start">
                              <Icon
                                fontFamily="Entypo"
                                name="dot-single"
                                color="main900"
                                mr="sm"
                                fontSize="2xl"></Icon>
                            </Div>
                            <Text fontSize="lg">
                              {t.AUDIT.symptoms.shakyHand.point5}
                            </Text>
                          </Div>
                        </Div>
                      </Div>
                      <Div mt="2xl">
                        <Div row>
                          <Image
                            source={Styles.images.results.audit.mazeHead}
                            h={75}
                            w={75}
                          />
                          <Div pl="lg">
                            <GDFontText fontSize="xl" textWeight="700">
                              {t.AUDIT.symptoms.mazeHead.title}
                            </GDFontText>
                            <Div row mt="sm">
                              <Div justifyContent="flex-start">
                                <Icon
                                  fontFamily="Entypo"
                                  name="dot-single"
                                  color="main900"
                                  mr="sm"
                                  fontSize="2xl"></Icon>
                              </Div>
                              <Text fontSize="lg">
                                {t.AUDIT.symptoms.mazeHead.point1}
                              </Text>
                            </Div>
                            <Div row mt="sm">
                              <Div justifyContent="flex-start">
                                <Icon
                                  fontFamily="Entypo"
                                  name="dot-single"
                                  color="main900"
                                  mr="sm"
                                  fontSize="2xl"></Icon>
                              </Div>
                              <Text fontSize="lg">
                                {t.AUDIT.symptoms.mazeHead.point2}
                              </Text>
                            </Div>
                            <Div row mt="sm">
                              <Div justifyContent="flex-start">
                                <Icon
                                  fontFamily="Entypo"
                                  name="dot-single"
                                  color="main900"
                                  mr="sm"
                                  fontSize="2xl"></Icon>
                              </Div>
                              <Text fontSize="lg">
                                {t.AUDIT.symptoms.mazeHead.point3}
                              </Text>
                            </Div>
                            <Div row mt="sm">
                              <Div justifyContent="flex-start">
                                <Icon
                                  fontFamily="Entypo"
                                  name="dot-single"
                                  color="main900"
                                  mr="sm"
                                  fontSize="2xl"></Icon>
                              </Div>
                              <Text fontSize="lg">
                                {t.AUDIT.symptoms.mazeHead.point4}
                              </Text>
                            </Div>
                            <Div row mt="sm">
                              <Div justifyContent="flex-start">
                                <Icon
                                  fontFamily="Entypo"
                                  name="dot-single"
                                  color="main900"
                                  mr="sm"
                                  fontSize="2xl"></Icon>
                              </Div>
                              <Text fontSize="lg">
                                {t.AUDIT.symptoms.mazeHead.point5}
                              </Text>
                            </Div>
                          </Div>
                        </Div>
                      </Div>
                      <Button
                        bg="main900"
                        alignSelf="center"
                        w="95%"
                        rounded="circle"
                        mt="2xl"
                        onPress={() =>
                          Linking.openURL('https://blog.naver.com/wellingbe')
                        }>
                        {t.learnMoreButton}
                      </Button>
                      <Button
                        bg="white"
                        alignSelf="center"
                        mt="lg"
                        color="main900"
                        w="100%"
                        onPress={() =>
                          navigation.navigate(stacks.SEARCH_STACK)
                        }>
                        {t.findHospitalButton}
                      </Button>
                    </Div>
                  </Div>
                </>
              )}
            </>
          ) : null}
        </ScrollView>
        {/* <Div>
          <Text>somethign something</Text>
          <Text>whateverwhtever</Text>
          <Text>some mor etext here</Text>
        </Div> */}
      </Div>
      {/* <Div row h={50} p="lg" m={20}>
        <Button rounded="xl" flex={1} h={50} mr={5}>
          <Text color="white">start over</Text>
        </Button>
        <Button rounded="xl" flex={1} h={50} ml={5}>
          <Text color="white">take another test</Text>
        </Button>
      </Div>
      <Div>
        <Button block>
          <Text color={Styles.colors.text.light}>FIND HOSPITAL</Text>
        </Button>
      </Div> */}
    </Div>
  )
}

export default iTestResultsScreen
