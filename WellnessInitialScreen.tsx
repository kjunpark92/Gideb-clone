import * as React from 'react'
import { Dimensions, ScrollView, StyleSheet, Platform } from 'react-native'
import { Div, Text, Button, Image, Icon, Radio } from 'react-native-magnus'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import Styles from '../util/Styles'
import screens from '../navigation/screens'
import {
  GDFontText,
  GDHeader,
  Refund,
  IconTile,
  HorizontalCardView,
  TestimonialCardComponent,
  RecTiles,
} from '../components'
// import { SecondWindItemBox,  } from '../components'
import { useI18n } from '../hooks'
import Log from '../util/Log'
import dayjs from 'dayjs'

const TEMP_LANG = {
  ko: {
    topPicGreenHeader: '건강한 나를 찾는 시간',
    topPicBoldHeader: '웰니스 온라인 교육\n프로그램',
    groupFeature: '그룹별 토론형',
    wellnessTabsTextsArr: ['교육소개', '커리큘럼', '교육키트', '환불정책'],
    wellnessTabOneDescOne: `2012년 NAAPIMHA라는 단체에서 만든 프로그램으로 하버\n드대 의대정신건강학과 Ed Wang 교수와 미 보건복지부 지\n원으로 만들어진교육입니다.`,
    withParenthesesAWH: 'AWH(Achieving Whole Health)',
    descForAWH:
      '몸, 마음, 정신의 조화를 통해 사람들에게 건강한 삶을 살 수\n 있는 방법을 알려주고 ‘나만의 8주 건강목표 달성하기’를 통\n해 건강한 습관을 만들기를 도와주는 교육 프로그램입니다.',
    recommendationForThesePeople: ['이런 분들', '에게', '추천합니다!'],
  },
}

const TESTIMONIALS = [
  {
    img: Styles.images.wellness.profilePicOne,
    name: '헤일*',
    date: dayjs('2021-02-18').format('YYYY.MM.DD'),
    text: '교육이 어렵고 지루할 것이라 생각했는데.. 토론식으로 진행되어서 좋\n았어요. 쉬우면서도 제 자신을 돌아보고 건강한 삶을 위해 계획을 세울\n수 있어 유익했습니다!',
  },
  {
    img: Styles.images.wellness.profilePicTwo,
    name: '그레이*',
    date: dayjs('2021-02-18').format('YYYY.MM.DD'),
    text: '정신건강과 웰니스에 초점을 둔 교육이 있어서 좋았어요!\n쉬우면서도 깊이 있는 주제로 대화하다 보니 어느 순간 힐링이 되었어\n요~ 제가 세운 건강 목표도 달성해서 건강한 삶을 위해 한발 내딛는 계\n기가 되어 좋았습니다.',
  },
  {
    img: Styles.images.wellness.profilePicThree,
    name: '지*',
    date: dayjs('2021-02-18').format('YYYY.MM.DD'),
    text: '건강하고 행복한 변화를 위해 도움이 되는 교육이었어요~회차별 잘 짜\n인 커리큘럼과 다양한 사람들의 생각을 들고 배우는 시간이 유익했습니\n다. 건강 목표를 달성하면서 스마트밴드로 측정되는 서비스도 정말 좋 \n았어요! ',
  },
]

const RECS = [
  {
    bgColor: '#fFE3ED',
    imgSource: Styles.images.wellness.guyBlackHair,
    text: '고민이 많은 학생',
  },
  {
    bgColor: '#F6C291',
    imgSource: Styles.images.wellness.girlBlondeHair,
    text: '최근 우울한 감정을\n많이 느끼는 사람',
  },
  {
    bgColor: '#BAEFE2',
    imgSource: Styles.images.wellness.girlPinkHair,
    text: '업무 스트레스가\n많은 회사원',
  },
]

interface WellnessInitialScreenProps {
  navigation: any
}

const KIT_SCROLL_CARDS = [
  {
    index: 0,
    kitImg: Styles.images.wellness.secondWindHorizontal1,
    headerText: '활동량 관리',
    detailsText:
      '밴드가 측정한 걸음수, 걸음형태, 소모칼로리, 심박수를\n일단위로 확인할 수 있습니다.',
  },
  {
    index: 1,
    kitImg: Styles.images.wellness.secondWindHorizontal2,
    headerText: '스트레스 관리',
    detailsText:
      '밴드를 차고만 계시면 자동으로 스트레스를 측정하며, 그날\n그날의 스트레스 상태에 따른 코멘트를 제공합니다.',
  },
  {
    index: 2,
    kitImg: Styles.images.wellness.secondWindHorizontal3,
    headerText: '수면 관리',
    detailsText:
      '불편하게 수면시작과 끝을 입력하실 필요가 없습니다.\nDOFIT은 사용자의 심박, 활동량, 밴드착용 유무를 확인하여\n사용자의 수면 상태를 알아내고 패턴을 분석하여 얼마나 양\n질의 수면을 취하셨는지 평가해드립니다.',
  },
  {
    index: 3,
    kitImg: Styles.images.wellness.secondWindHorizontal4,
    headerText: '운동 관리',
    detailsText:
      '앱을 통해 운동을 시작해 보세요.\nDOFIT을 착용하고 앱과 함께 운동하면 사용자에게 맞춘 운\n동 시간과 목표 심박수를 제공하여 알맞은 강도로 운동할 수\n있도록 가이드 해드립니다.',
  },
]

const HEADER_HEIGHT = 20
const { useState, useRef } = React
const WellnessInitialScreen: React.FC<WellnessInitialScreenProps> = ({
  navigation,
}) => {
  const t = useI18n('wellnessInitialScreen')
  const n = useI18n('wellnessNotes')
  const [selectedTab, setSelectedTab] = useState('교육소개')
  const insets = useSafeAreaInsets()

  const scrollViewRef = useRef()
  const CARD_WIDTH = Dimensions.get('window').width - 60

  const switchTab = async (item) => {
    if (item == '교육소개') setRadioTopBorder(false)
    setRadioTopBorder(true)
    // Log.debug('switchTab fired: new tab:', item)
    await scrollViewRef.current.scrollTo({ y: 0 })
    await setSelectedTab(item)
  }

  const handleGoToNext = () =>
    navigation.navigate(screens.PRODUCT_OPTIONS, { from: 'wellness' })

  // const isCloseToBottom = ({
  //   layoutMeasurement,
  //   contentOffset,
  //   contentSize,
  // }) => {
  //   const paddingToBottom = 20
  //   return (
  //     layoutMeasurement.height + contentOffset.y >=
  //     contentSize.height - paddingToBottom
  //   )
  // }
  // const isCloseToTop = ({ layoutMeasurement, contentOffset, contentSize }) => {
  //   const paddingToTop = 10
  //   return (
  //     contentSize.height - layoutMeasurement.height - paddingToTop <=
  //     contentOffset.y
  //   )
  // }

  // const [tabIdx, setIdx] = useState(0)
  // const handleScroll = (e: Object) => {
  //   // let num = 0
  //   const tabs = ['교육소개', '커리큘럼', '교육키트', '환불정책']
  //   const { nativeEvent } = e
  //   if (isCloseToBottom(nativeEvent)) {
  //     Log.debug('**this is close to Bottom**', selectedTab, tabIdx)
  //     // if (num == 0) {
  //     //   setIdx(tabIdx + 1)
  //     //   num++
  //     // }
  //     if (selectedTab == '커리큘럼') {
  //       switchTab(tabs[2])
  //     }

  //     if (selectedTab == tabs[2]) {
  //       switchTab(tabs[3])
  //     }

  //     switch (true) {
  //       case selectedTab == tabs[0] && tabs[tabIdx] == selectedTab:
  //         switchTab(tabs[1])
  //         break
  //       case selectedTab == tabs[1] && tabs[tabIdx] == selectedTab:
  //         switchTab(tabs[2])
  //         break
  //       case selectedTab == tabs[2] && tabs[tabIdx] == selectedTab:
  //         switchTab(tabs[3])
  //         break
  //       default:
  //         break
  //     }
  //   }
  // }

  // const handleScroll = (e: any) => {
  //   Log.debug('e =', e)
  //   const {
  //     nativeEvent: { contentOffset: y },
  //   } = e
  //   Log.debug('y =', y)
  // }

  const [radioTopBorder, setRadioTopBorder] = useState<boolean>(false)

  return (
    <Div flex={1} bg="white" pt={insets.top}>
      <GDHeader bottomLine>{t.title}</GDHeader>
      <ScrollView
        scrollEventThrottle={16}
        onScroll={(event) => {
          const y = event.nativeEvent.contentOffset.y
          if (y >= 565) {
            if (radioTopBorder) return
            setRadioTopBorder(true)
            return
          } else {
            if (!radioTopBorder) return
            setRadioTopBorder(false)
          }
        }}
        bounces={false}
        ref={scrollViewRef}
        stickyHeaderIndices={[selectedTab == '교육소개' ? 1 : 0]}>
        {selectedTab == '교육소개' && (
          <>
            <Div row bg="gray150">
              <Div justifyContent="center" h={214} flex={1}>
                <GDFontText
                  ml="lg"
                  fontSize="sm"
                  color="main900"
                  textWeight="400">
                  {TEMP_LANG.ko.topPicGreenHeader}
                </GDFontText>
                <Div p="xs" />
                <GDFontText ml="lg" fontSize={20} textWeight="700">
                  {TEMP_LANG.ko.topPicBoldHeader}
                </GDFontText>
              </Div>
              <Div flex={1} ml="2xl" mt="2xl">
                <Div
                  bg="white"
                  overflow="visible"
                  rounded="circle"
                  w={160}
                  h={160}
                  alignItems="center"
                  justifyContent="center">
                  <Image
                    resizeMode="contain"
                    source={Styles.images.wellness.wellingLaptop}
                    h={214}
                    w={157}
                    bottom={8}
                  />
                </Div>
              </Div>
            </Div>
            <Div px="xl" mt="2xl" pb="xl">
              <Div row justifyContent="space-between">
                <GDFontText fontSize="3xl" textWeight="700">
                  {t.itemName}
                </GDFontText>
                <GDFontText fontSize="3xl" textWeight="700">
                  {t.discountPrice}
                </GDFontText>
              </Div>
              <Div row justifyContent="space-between">
                <Div row>
                  <Div
                    rounded="circle"
                    bg="main900"
                    mt="md"
                    mr="md"
                    h={23}
                    w={66}
                    alignItems="center"
                    justifyContent="center">
                    <Text color="white" fontSize="sm">
                      {t.courseLength}
                    </Text>
                  </Div>
                  <Div
                    rounded="circle"
                    bg="main900"
                    mt="md"
                    mr="3xl"
                    h={23}
                    w={85}
                    alignItems="center"
                    justifyContent="center">
                    <Text color="white" fontSize="sm">
                      {TEMP_LANG.ko.groupFeature}
                    </Text>
                  </Div>
                </Div>
                <Text
                  textDecorLine="line-through"
                  color="gray500"
                  fontSize="md">
                  {t.price}
                </Text>
              </Div>
              <Text
                pr={0}
                letterSpacing={0.5}
                lineHeight={19}
                my="lg"
                mb="xs"
                fontSize={13.5}>
                {t.paragraph}
              </Text>
            </Div>
          </>
        )}
        {/* <Div p="lg" /> */}
        <Radio.Group
          defaultValue={TEMP_LANG.ko.wellnessTabsTextsArr[0]}
          bg="white"
          mb="xl"
          borderTopWidth={radioTopBorder ? 0 : 1}
          borderBottomWidth={1}
          borderColor={Styles.colors.grayscale.lightGray}
          justifyContent="space-around"
          row>
          {TEMP_LANG.ko.wellnessTabsTextsArr.map((wellnessTabSelection, i) => (
            <Radio
              value={wellnessTabSelection}
              key={String(i)}
              onPress={() => {
                switchTab(wellnessTabSelection)
              }}>
              {({ checked }) => (
                <Div>
                  <Div
                    flex={1}
                    py="lg"
                    borderBottomWidth={
                      wellnessTabSelection == selectedTab ? 1.5 : 0
                    }>
                    <Text
                      // color={wellnessTabSelection == selectedTab ? 'dark' : 'gray500'}
                      color={checked ? 'dark' : 'gray500'}
                      fontSize="lg">
                      {wellnessTabSelection}
                    </Text>
                  </Div>
                </Div>
              )}
            </Radio>
          ))}
        </Radio.Group>

        {selectedTab == '교육소개' && (
          <Div>
            <Div px="xl">
              <GDFontText fontSize="2xl" mb="lg" textWeight="700">
                {TEMP_LANG.ko.wellnessTabsTextsArr[0]}
              </GDFontText>
              <Div p="xs" />
              <GDFontText fontSize={14}>
                {TEMP_LANG.ko.wellnessTabOneDescOne}
              </GDFontText>
              <GDFontText mt="xl" fontSize="lg" textWeight="700">
                {TEMP_LANG.ko.withParenthesesAWH}
              </GDFontText>
              <GDFontText fontSize={14}>{TEMP_LANG.ko.descForAWH}</GDFontText>
              <Div mt="xl" borderBottomColor="gray400" borderBottomWidth={1} />

              <Div row mt="xl">
                <GDFontText fontSize="2xl" color="main900" textWeight="700">
                  {TEMP_LANG.ko.recommendationForThesePeople[0]}
                </GDFontText>
                <GDFontText fontSize="2xl" textWeight="700">
                  {TEMP_LANG.ko.recommendationForThesePeople[1]}
                </GDFontText>
              </Div>
              <GDFontText fontSize="2xl" textWeight="700">
                {TEMP_LANG.ko.recommendationForThesePeople[2]}
              </GDFontText>
              <Div
                alignItems="center"
                mt="xl"
                rounded="2xl"
                bg="gray150"
                py="2xl">
                <Text fontSize="lg">
                  요즘 정신적으로{' '}
                  <GDFontText fontSize="lg" textWeight="700">
                    {' '}
                    많이 힘드세요?
                  </GDFontText>{' '}
                  😢
                </Text>
              </Div>
              <Div
                alignItems="center"
                mt="md"
                rounded="2xl"
                bg="gray150"
                py="2xl">
                <Text fontSize="lg">
                  <GDFontText textWeight="700" fontSize="lg">
                    건강한 스트레스 해소법
                  </GDFontText>
                  을 알고 계세요? 💪
                </Text>
              </Div>
              <Div
                alignItems="center"
                mt="md"
                rounded="2xl"
                bg="gray150"
                py="2xl">
                <Text fontSize="lg">
                  <GDFontText fontSize="lg" textWeight="700">
                    지금보다 더 건강한 삶
                  </GDFontText>
                  을 살고 싶으세요? 🍀
                </Text>
              </Div>
              <Div
                alignItems="center"
                mt="md"
                rounded="2xl"
                bg="gray150"
                py="2xl"
                mb="md">
                <Text fontSize="lg">
                  <GDFontText textWeight="700" fontSize="lg">
                    마음이 아픈 사람들
                  </GDFontText>
                  을 체계적으로{'\n'}도와주는 법을 알고 싶으세요? ✍🏻
                </Text>
              </Div>
            </Div>
            <Div bg="gray150" mt="2xl" h={900}>
              <Div px="xl" pt="2xl">
                <Div row>
                  <GDFontText textWeight="700" fontSize="2xl" color="main900">
                    실제 수강생들
                  </GDFontText>
                  <GDFontText textWeight="700" fontSize="2xl">
                    의
                  </GDFontText>
                </Div>
                <GDFontText fontSize="2xl" textWeight="700">
                  생생한 후기
                </GDFontText>
                <Div row justifyContent="space-around" my="xl">
                  <Div>
                    <Text color="gray500" fontSize="lg">
                      누적 수강생
                    </Text>
                    <GDFontText
                      textWeight="900"
                      fontSize="6xl"
                      textAlign="center">
                      500+
                    </GDFontText>
                  </Div>
                  <Div>
                    <Text color="gray500" fontSize="lg">
                      수강생 만족도
                    </Text>
                    <GDFontText
                      textWeight="900"
                      fontSize="6xl"
                      textAlign="center">
                      98
                      <GDFontText textWeight="300" fontSize="xl">
                        %
                      </GDFontText>
                    </GDFontText>
                  </Div>
                </Div>
                <Image
                  h={214}
                  w={'100%'}
                  resizeMode="contain"
                  source={Styles.images.wellness.wellnessRectangleOne}
                />
                <Div mt="2xl" />
                {TESTIMONIALS.map(
                  (testimonial: TestimonialProps, idx: number) => {
                    const { img, name, date, text } = testimonial
                    return (
                      <TestimonialCardComponent
                        key={String(idx)}
                        img={img}
                        name={name}
                        date={date}
                        text={text}
                      />
                    )
                  },
                )}
              </Div>
            </Div>
            <Div mt="2xl" px="xl">
              <GDFontText fontSize="2xl" textWeight="700" color="main900">
                건강한 삶을 위한
              </GDFontText>
              <GDFontText fontSize="2xl" textWeight="700">
                웰니스 교육
              </GDFontText>
              <GDFontText fontSize="2xl" textWeight="700">
                프로그램 입니다.
              </GDFontText>
            </Div>
            <Div bg="gray150" rounded="2xl" mx="lg" mt="xl">
              <Div px="xl">
                <Div mt="xl" justifyContent="center" alignItems="center">
                  <GDFontText mt="md" fontSize="md">
                    #건강한삶 #마음다스리기 #웰니스교육
                  </GDFontText>
                  <GDFontText mt="md" textWeight="700" fontSize="2xl">
                    웰니스 교육 프로그램
                  </GDFontText>
                  <Div
                    mt="md"
                    bg="main900"
                    rounded="circle"
                    h={27}
                    w={207}
                    justifyContent="center"
                    alignItems="center"
                    row>
                    <GDFontText textWeight="700" fontSize="sm" color="white">
                      평점 4.5
                    </GDFontText>
                    <GDFontText
                      textWeight="700"
                      fontSize="sm"
                      color="white"
                      ml="lg">
                      3회 강의 + 8주 목표달성
                    </GDFontText>
                  </Div>
                </Div>
                <Div
                  mt="xl"
                  borderBottomColor="gray300"
                  borderBottomWidth={1}
                />

                <Div row mt="lg" justifyContent="flex-start">
                  <GDFontText textWeight="700" fontSize="md" color="dark_5">
                    수강 기간{' '}
                  </GDFontText>
                  <GDFontText textWeight="700" fontSize="md">
                    1회 당 2시간30분{' '}
                  </GDFontText>
                  <Text fontSize="md">(총 3회 진행)</Text>
                </Div>

                <Div
                  mt="lg"
                  mb="sm"
                  borderBottomColor="gray300"
                  borderBottomWidth={1}
                />

                <Div mt="lg" mb="md">
                  <GDFontText textWeight="700" fontSize="md" color="dark_5">
                    {'제공 자료'}
                  </GDFontText>
                </Div>

                <Div row alignItems="center">
                  <Div
                    mt="md"
                    mb="sm"
                    bg="main900"
                    rounded="circle"
                    h={27}
                    w={39}
                    justifyContent="center"
                    alignItems="center"
                    row>
                    <GDFontText textWeight="700" fontSize="sm" color="white">
                      공통
                    </GDFontText>
                  </Div>
                  <GDFontText
                    color="black"
                    ml="lg"
                    fontSize="md"
                    textAlign="center">
                    사전 과제, 8주달성목표 차트
                  </GDFontText>
                </Div>
                <Div row alignItems="center">
                  <Div
                    mt="md"
                    bg="main900"
                    rounded="circle"
                    mb="sm"
                    h={27}
                    w={39}
                    justifyContent="center"
                    alignItems="center"
                    row>
                    <GDFontText fontSize="sm" color="white" textWeight="700">
                      선택
                    </GDFontText>
                  </Div>
                  <GDFontText
                    color="black"
                    ml="lg"
                    fontSize="md"
                    textAlign="center">
                    DOFIT 스마트밴드 + Secondwind 앱
                  </GDFontText>
                </Div>

                <Div
                  mt="md"
                  mb="sm"
                  borderBottomColor="gray300"
                  borderBottomWidth={1}
                />
                <Div row mt="sm">
                  <GDFontText fontSize="md" textWeight="700" color="dark_5">
                    난이도{' '}
                  </GDFontText>
                  <GDFontText fontSize="md" color="black">
                    {' '}
                    입문 초급
                  </GDFontText>
                </Div>
                <Div
                  mt="lg"
                  mb="sm"
                  borderBottomColor="gray400"
                  borderBottomWidth={1}
                />
                <Div my="xl">
                  <GDFontText
                    textAlign="center"
                    color="black"
                    textWeight="700"
                    fontSize="xl">
                    추천대상
                  </GDFontText>
                </Div>
                <Div row flex={1}>
                  {RECS.map((rec, idx) => {
                    const { bgColor, imgSource, text } = rec
                    return (
                      <RecTiles
                        key={String(idx)}
                        bgColor={bgColor}
                        imgSource={imgSource}
                        text={text}
                      />
                    )
                  })}
                </Div>
                <Div bg="white" mt="2xl" rounded="2xl">
                  <Div mt="xl">
                    <GDFontText
                      textAlign="center"
                      color="black"
                      textWeight="700"
                      fontSize="2xl">
                      이런 부분을 얻을 수 있어요!
                    </GDFontText>
                  </Div>
                  <Div ml="lg">
                    <Div mt="2xl" row alignItems="flex-start">
                      <Image
                        h={20}
                        w={20}
                        resizeMode="contain"
                        source={Styles.images.wellness.numberOne}
                      />

                      <GDFontText fontSize="sm" ml="md" w={263}>
                        {
                          '건강한 삶을 위해 몸, 마음, 정신을\n함께 관리하는 방법을 함께 배워보세요.'
                        }
                      </GDFontText>
                    </Div>
                    <Div mt="xl" row alignItems="flex-start">
                      <Image
                        h={20}
                        w={20}
                        resizeMode="contain"
                        source={Styles.images.wellness.numberTwo}
                      />
                      <GDFontText fontSize="sm" ml="md" w={263}>
                        {
                          '1회성 교육이 아닌 3개월동안 달성할 목표를 세우고\n달성해서 건강한 삶의 습관을 함께 만들어가요.'
                        }
                      </GDFontText>
                    </Div>
                    <Div mt="xl" row alignItems="flex-start">
                      <Image
                        h={20}
                        w={20}
                        resizeMode="contain"
                        source={Styles.images.wellness.numberThree}
                      />
                      <GDFontText fontSize="sm" ml="md" w={263}>
                        {
                          '스마트밴드를 통해 나의 건강데이터를 바탕으로\n스마트한 헬스케어 서비스까지 누려보세요.'
                        }
                      </GDFontText>
                    </Div>
                    <Div my="xl" row alignItems="flex-start">
                      <Image
                        h={20}
                        w={20}
                        resizeMode="contain"
                        source={Styles.images.wellness.numberFour}
                      />
                      <GDFontText fontSize="sm" ml="md" w={263}>
                        {
                          '나뿐만 아니라 타인의 삶에도 긍정적인 변화를\n일으킬 수 있는 방법을 알려줍니다.'
                        }
                      </GDFontText>
                    </Div>
                  </Div>
                </Div>
              </Div>
              <Div justifyContent="center" alignItems="center" mt="2xl">
                <GDFontText fontSize="2xl" textWeight="700">
                  {'튜터들의 이야기'}
                </GDFontText>
              </Div>

              <Div
                row
                flex={1}
                py="xl"
                mt="xl"
                my="sm"
                mx="xl"
                bg="white"
                rounded="2xl"
                justifyContent="space-around">
                <Div ml={-50} flex={1} mr={15}>
                  <Image
                    h={'100%'}
                    w={'100%'}
                    resizeMode="contain"
                    source={Styles.images.wellness.bunHairLady}
                  />
                </Div>
                <Div flex={1}>
                  <GDFontText ml={-55} textWeight="700" fontSize="lg">
                    이경미 튜터 ‘나를 찾아가는 시간’
                  </GDFontText>
                  <Text ml={-55} fontSize="sm">
                    건강 달성 목표 세우기와 다양한{'\n'}액티비티를 통해 나를
                    알아가는 시간을{'\n'}가져보세요.
                  </Text>
                </Div>
              </Div>

              <Div
                row
                flex={1}
                py="xl"
                my="sm"
                mx="xl"
                bg="white"
                rounded="2xl"
                justifyContent="space-around">
                <Div ml={-50} flex={1} mr={15}>
                  <Image
                    h={'100%'}
                    w={'100%'}
                    resizeMode="contain"
                    source={Styles.images.wellness.handbandGirl}
                  />
                </Div>
                <Div flex={1}>
                  <GDFontText ml={-55} textWeight="700" fontSize="lg">
                    이영주 튜터 ‘나, 너, 그리고 우리’
                  </GDFontText>
                  <GDFontText ml={-55} fontSize="sm">
                    서로를 이해하고 소통하는 시간을 통해{'\n'}혼자가 아닌 함께
                    살아가는 법을 깨닫게{'\n'}되실 거예요.
                  </GDFontText>
                </Div>
              </Div>

              <Div
                row
                flex={1}
                py="xl"
                my="sm"
                mx="xl"
                bg="white"
                rounded="2xl"
                justifyContent="space-around">
                <Div ml={-50} flex={1} mr={15}>
                  <Image
                    ml="xl"
                    h={'80%'}
                    w={'80%'}
                    resizeMode="contain"
                    source={Styles.images.wellness.spikeyHairGuy}
                  />
                </Div>
                <Div flex={1}>
                  <GDFontText ml={-55} textWeight="700" fontSize="lg">
                    태양 튜터 ‘건강한 습관 만들기’
                  </GDFontText>
                  <Text ml={-55} fontSize="sm">
                    몸, 마음, 정신을 건강하게 관리하는{'\n'}방법을 배우고
                    스마트밴드와 연동한{'\n'}8주 달성 목표 실천을 통해{'\n'}
                    건강한 습관을 만들어 보세요!
                  </Text>
                </Div>
              </Div>

              <Div justifyContent="center" alignItems="center" mt="lg">
                <GDFontText textWeight="700" fontSize="2xl">
                  자주 묻는 질문
                </GDFontText>
              </Div>
              <Div mx="lg">
                <Div
                  mt="xl"
                  py="lg"
                  my="sm"
                  px="lg"
                  bg="white"
                  rounded="2xl"
                  row
                  alignItems="center">
                  <Image
                    h={20}
                    w={20}
                    resizeMode="contain"
                    source={Styles.images.wellness.numberOne}
                  />

                  <GDFontText textWeight="700" fontSize="lg" ml="md">
                    언제부터 수강할 수 있나요?
                  </GDFontText>
                </Div>

                <Div mt="md" ml="xl">
                  <Text mb="sm" fontSize="sm">
                    1. 수강을 원하는 일정을 선택
                  </Text>
                  <Text mb="sm" fontSize="sm">
                    2. 기댑 담당자가 스케줄 확인
                  </Text>
                  <Text mb="sm" fontSize="sm">
                    3. 수강 확정으로 변경되면 완료!
                  </Text>
                  <Text mt="sm" fontSize="sm" color="main900">
                    *일정 변경을 윈하시면 ‘고객센터’로 문의해 주세요
                  </Text>
                </Div>
                <Div
                  mt="xl"
                  py="lg"
                  my="sm"
                  px="lg"
                  bg="white"
                  rounded="2xl"
                  row
                  alignItems="center">
                  <Image
                    h={20}
                    w={20}
                    resizeMode="contain"
                    source={Styles.images.wellness.numberTwo}
                  />

                  <GDFontText textWeight="700" fontSize="lg" ml="md">
                    언제부터 수강할 수 있나요?
                  </GDFontText>
                </Div>
                <Div mt="md" ml="xl" justifyContent="center">
                  <Text fontSize="sm">
                    일방적은 주입식 교육이 아닌 토론 형태로 진행됩니다.
                  </Text>
                  <Text fontSize="sm">
                    주제에 맞는 다양한 액티비티로 구성되어 있습니다.
                  </Text>
                </Div>
                <Div
                  mt="xl"
                  py="lg"
                  my="sm"
                  px="lg"
                  bg="white"
                  rounded="2xl"
                  row
                  alignItems="center">
                  <Image
                    h={20}
                    w={20}
                    resizeMode="contain"
                    source={Styles.images.wellness.numberThree}
                  />

                  <GDFontText textWeight="700" fontSize="lg" ml="md">
                    온라인 말고 오프라인 교육도 가능한가요?
                  </GDFontText>
                </Div>
                <Div mt="md" ml="xl" justifyContent="center">
                  <Text fontSize="sm">
                    네 가능하세요. ‘고객센터’로 문의해 주세요.
                  </Text>
                </Div>
                <Div py="lg" />
              </Div>
            </Div>
            <Div p="lg" />
          </Div>
        )}

        {selectedTab == '커리큘럼' && (
          <Div px="xl" mb="3xl">
            <Div>
              <GDFontText fontSize="3xl" textWeight="700">
                웰니스 온라인 교육 커리큘럼
              </GDFontText>
              <Text mt="lg" color="gray500" fontSize="lg">
                웰니스 교육은 총 12주 과정입니다.
              </Text>
            </Div>

            <Div mt="2xl">
              <GDFontText fontSize="xl" textWeight="700">
                1. 온라인 그룹 교육 (6시간)
              </GDFontText>

              <Div mt="xl">
                <Div row>
                  <Div bg="gray150" style={styles.tableCellLeft}>
                    <GDFontText textWeight="700" fontSize="xl">
                      1주
                    </GDFontText>
                    <Text fontSize="lg" color="gray500">
                      (2시간)
                    </Text>
                  </Div>
                  <Div style={styles.tableCellRight}>
                    <Text fontSize="lg">
                      - 건강한 삶의 질{'\n'}- 건강한 식습관 3단계{'\n'}- 편안한
                      수면
                    </Text>
                  </Div>
                </Div>

                <Div row>
                  <Div bg="gray100" style={styles.tableCellLeft}>
                    <GDFontText textWeight="700" fontSize="xl">
                      2주
                    </GDFontText>
                    <Text fontSize="lg" color="gray500">
                      (2시간)
                    </Text>
                  </Div>
                  <Div style={styles.tableCellRight}>
                    <Text fontSize="lg">
                      - 안정을 취하는 법{'\n'}- 낙관주의와 희망{'\n'}- 긍정적인
                      자세
                    </Text>
                  </Div>
                </Div>

                <Div row>
                  <Div bg="gray100" style={styles.tableCellLeft}>
                    <GDFontText textWeight="700" fontSize="xl">
                      3주
                    </GDFontText>
                    <GDFontText fontSize="lg" color="gray500">
                      (2시간)
                    </GDFontText>
                  </Div>
                  <Div style={styles.tableCellRight}>
                    <Text fontSize="lg">
                      - 영적 믿음과 행위{'\n'}- 지지적 관계{'\n'}- 삶의 의미와
                      목적
                    </Text>
                  </Div>
                </Div>
              </Div>
            </Div>

            {/* point2 */}
            <Div mt="2xl">
              <GDFontText fontSize="xl" textWeight="700">
                2. 달성 목표 세우기 (2시간))
              </GDFontText>
              <Div mt="xl">
                <Div row>
                  <Div bg="gray100" style={styles.tableCellLeft}>
                    <GDFontText textWeight="700" fontSize="xl">
                      1단계
                    </GDFontText>
                  </Div>
                  <Div style={styles.tableCellRight}>
                    <Text fontSize="lg">- 자가 건강 진단표 작성</Text>
                  </Div>
                </Div>

                <Div row>
                  <Div bg="gray100" style={styles.tableCellLeft}>
                    <GDFontText textWeight="700" fontSize="xl">
                      2단계
                    </GDFontText>
                  </Div>
                  <Div style={styles.tableCellRight} row>
                    <Div>
                      <Text fontSize="lg">- </Text>
                    </Div>
                    <Div>
                      <Text fontSize="lg">
                        IMPACT에 따른 건강 달성 목표 정하기
                      </Text>
                    </Div>
                  </Div>
                </Div>

                <Div row>
                  <Div bg="gray100" style={styles.tableCellLeft}>
                    <GDFontText textWeight="700" fontSize="xl">
                      3단계
                    </GDFontText>
                  </Div>
                  <Div style={styles.tableCellRight}>
                    <Text fontSize="lg">- 8주 건강 달성 목표 세우기</Text>
                  </Div>
                </Div>
              </Div>
            </Div>

            {/* point3 */}
            <Div mt="2xl">
              <GDFontText fontSize="xl" textWeight="700">
                3. 건강한 습관 만들기 (8주)
              </GDFontText>
              <Div mt="xl">
                <Div row>
                  <Div bg="gray100" style={styles.tableCellLeft}>
                    <GDFontText textWeight="700" fontSize="xl">
                      1단계
                    </GDFontText>
                  </Div>
                  <Div style={styles.tableCellRight}>
                    <Text fontSize="lg">
                      8주간 본인이 설정한 건강 달성 목표에 실천하기
                    </Text>
                  </Div>
                </Div>

                <Div row>
                  <Div bg="gray100" style={styles.tableCellLeft}>
                    <GDFontText textWeight="700" fontSize="xl">
                      2단계
                    </GDFontText>
                  </Div>
                  <Div style={styles.tableCellRight}>
                    <Text fontSize="lg">
                      스마트밴드로 바이오 리듬을 측정하고 스트레스, 운동,
                      수면관리 하기
                    </Text>
                  </Div>
                </Div>

                <Div row>
                  <Div bg="gray100" style={styles.tableCellLeft}>
                    <GDFontText textWeight="700" fontSize="xl">
                      3단계
                    </GDFontText>
                  </Div>
                  <Div style={styles.tableCellRight}>
                    <Text fontSize="lg">교육 전, 후 리포트 받기</Text>
                  </Div>
                </Div>
              </Div>
            </Div>
          </Div>
        )}
        {selectedTab == '교육키트' && (
          <Div mb="2xl">
            <Div px="xl">
              <GDFontText textWeight="700" fontSize="3xl">
                교육키트
              </GDFontText>
              <Div bg="gray150" mt="xl" mb="xl" rounded="2xl">
                <Text pt="xl" ml="lg" pb="xl" fontSize="lg">
                  교육 진행에 필요한 교육키트를 사전에 보내드립니다.(교육키트는
                  별도 비용이 발생하지 않으며, 교육비에 포함되어 있습니다.)
                </Text>
              </Div>
            </Div>

            {/* point one */}
            <Div px="xl" py="lg">
              <GDFontText textWeight="700" fontSize="3xl">
                첫 번째 혜택{'\n'}DOFIT 스마트밴드
              </GDFontText>
              <Text mt="xl" fontSize="lg">
                스마트밴드로 측정한 신체 데이터를 바탕으로 목표를 실천하도록
                독려하고, 측정 가능한 지표를 통해 건강을 개선할 수 있도록
                도와줍니다.
              </Text>
              <Div
                alignItems="center"
                mt="xl"
                bg="gray100"
                rounded="xl"
                py="2xl"
                px="3xl">
                <Image
                  source={Styles.images.secondwind.smallBandPic}
                  resizeMode="contain"
                  h={202}
                  w={177}
                />
                <Text mt="2xl" fontSize="lg">
                  <GDFontText textWeight="700">
                    DOFIT 스마트밴드{'\n'}
                  </GDFontText>
                  (87,000원 상당)
                </Text>
              </Div>
            </Div>

            <Div px="xl" row justifyContent="space-around" flex={1}>
              <IconTile
                imgSrc={Styles.images.wellness.heartBeatWatch}
                text={'걸음 수 측정'}
              />
              <IconTile
                imgSrc={Styles.images.wellness.manRunning}
                text={'소모 칼로리 계산'}
              />
              <IconTile
                imgSrc={Styles.images.wellness.heartBeat}
                text={'심박수 측정'}
              />
            </Div>
            <Div p="xs" />
            <Div px="xl" row justifyContent="space-around">
              <IconTile
                imgSrc={Styles.images.wellness.spiralHead}
                text={'스트레스 측정'}
              />
              <IconTile
                imgSrc={Styles.images.wellness.moonSleep}
                text={'수면 측정'}
              />
              <IconTile
                imgSrc={Styles.images.wellness.cellText}
                text={'SNS 알림 기능'}
              />
            </Div>

            <Div px="xl">
              <GDFontText textWeight="700" fontSize="3xl" mt="xl" pt="2xl">
                두번 째 혜택{'\n'}‘세컨드 윈드’ 앱 무료 이용권
              </GDFontText>
              <GDFontText mt="xl" fontSize="lg">
                '세컨드 윈드'는 사용자의 건강한 삶을 위한 개인 맞춤형 전문
                건강관리 솔루션입니다.{'\n'}국내의 최고의 의료진들과 건강관리
                임상 전문가들이 함께 개발한 솔루션으로 영양, 운동관리, 복약/금연
                관리, 질환별 교육등의 기능을 갖춘 헬스케어 서비스입니다.
              </GDFontText>
            </Div>
            <Div px="xl">
              <ScrollView
                horizontal
                decelerationRate="fast"
                snapToOffsets={KIT_SCROLL_CARDS.map(
                  (card) => card.index * (CARD_WIDTH + 17),
                )}
                snapToAlignment="center"
                pagingEnabled>
                {KIT_SCROLL_CARDS.map((card, i) => (
                  <HorizontalCardView
                    index={i}
                    key={String(i)}
                    kitImg={card.kitImg}
                    headerText={card.headerText}
                    detailsText={card.detailsText}
                  />
                ))}
              </ScrollView>
            </Div>
          </Div>
        )}
        {/* {selectedTab == 'refund' ? ( */}
        {selectedTab == '환불정책' && <Refund showHeader={true} />}
        {/* </Div> */}
        <Div p="2xl" />
        <Div p="md" />
      </ScrollView>
      {Platform.OS == 'android' ? (
        <Div position="absolute" bottom={0}>
          <Button
            h={48}
            block
            rounded="none"
            onPress={handleGoToNext}
            py="xl"
            bg="main900">
            {'교육 신청하기'}
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
            // h={64}
            h={48}
            block
            rounded="circle"
            onPress={handleGoToNext}
            // py="xl"
            bg="main900"
            fontSize="lg">
            {'교육 신청하기'}
          </Button>
        </Div>
      )}
    </Div>
  )
}

const styles = StyleSheet.create({
  tableCellLeft: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    paddingHorizontal: 20,
    borderWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 0,
    borderColor: Styles.colors.grayscale.darkGray,
  },
  tableCellRight: {
    flex: 1.5,
    justifyContent: 'center',
    alignContent: 'center',
    paddingHorizontal: 30,
    paddingVertical: 20,
    borderWidth: 0,
    borderRightWidth: 1,
    borderLeftWidth: 1,
    borderBottomWidth: 0.5,
    borderTopWidth: 0.5,
    borderColor: Styles.colors.grayscale.darkGray,
  },
  horizontalScrollImages: {
    marginVertical: 24,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderRadius: 10,
  },
  circleBg: {
    height: 80,
    width: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 20,
  },
  selectedTab: {
    color: Styles.colors.grayscale.blackGray,
    borderBottomColor: 'black',
    borderBottomWidth: 3,
  },
})
export default WellnessInitialScreen
