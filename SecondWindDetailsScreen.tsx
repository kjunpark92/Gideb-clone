import * as React from 'react'
import { Dimensions, Platform, StyleSheet, ScrollView } from 'react-native'
import { Div, Image, Text, Button, Icon, Radio } from 'react-native-magnus'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import Log from '../../../util/Log'

import Styles from '../../../util/Styles'
import {
  GDHeader,
  WellnessProductBox,
  Refund,
  GDFontText,
} from '../../../components'

// import { useI18n } from '../hooks'
// import text from '../util/Lang'
import screens from '../../../navigation/screens'

interface SecondWindDetailsScreenProps {
  navigation: any
  route: any
}

const KIT_SCROLL_CARDS = [
  {
    index: 0,
    kitImg: Styles.images.wellness.secondWindHorizontal1,
    headerText: '활동량 관리',
    detailsText:
      '밴드가 측정한 걸음수, 걸음형태, 소모칼로리, 심박수를 일단위로 확인할 수 있습니다.',
  },
  {
    index: 1,
    kitImg: Styles.images.wellness.secondWindHorizontal2,
    headerText: '스트레스 관리',
    detailsText:
      '밴드를 차고만 계시면 자동으로 스트레스를 측정하며, 그날그날의 스트레스 상태에 따른 코멘트를 제공합니다.',
  },
  {
    index: 2,
    kitImg: Styles.images.wellness.secondWindHorizontal3,
    headerText: '수면 관리',
    detailsText:
      '불편하게 수면시작과 끝을 입력하실 필요가 없습니다. DOFIT은 사용자의 심박, 활동량, 밴드착용 유무를 확인하여 사용자의 수면 상태를 알아내고 패턴을 분석하여 얼마나 양질의 수면을 취하셨는지 평가해드립니다.',
  },
  {
    index: 3,
    kitImg: Styles.images.wellness.secondWindHorizontal4,
    headerText: '운동 관리',
    detailsText:
      '앱을 통해 운동을 시작해 보세요. DOFIT을 착용하고 앱과 함께 운동하면 사용자에게 맞춘 운동 시간과 목표 심박수를 제공하여 알맞은 강도로 운동할 수 있도록 가이드 해드립니다.',
  },
]

interface HorizontalCardViewProps {
  kitImg: any
  headerText: string
  detailsText: string
  index: number
}

const SCREEN_HEIGHT = Dimensions.get('screen').height
const { useState, useEffect, useRef } = React
const SecondWindDetailsScreen: React.FC<SecondWindDetailsScreenProps> = ({
  navigation,
}) => {
  const insets = useSafeAreaInsets()

  const [selectedTab, setSelectedTab] = useState('상품소개')
  const [showRefundModal, setShowRefundModal] = useState(false)

  useEffect(() => {
    // if (route.params != undefined) setSelectedTab(route.params.tab)
    // setSelectedTab(route.params.tab)
    // Log.debug('SecondWindDetailsScreen: useEffect: selectedTab:', selectedTab)
  }, [])

  // const t = useI18n('wellnessDetailsScreen')
  // const t = text.wellnessDetailsScreen

  const scrollViewRef = useRef()

  const switchTab = (item) => {
    Log.debug('switchTab fired: new tab:', item)
    setSelectedTab(item)
    scrollViewRef.current.scrollTo({ y: 0 })
  }

  const toggleRefundModal = () => {
    Log.debug('toggle refund modal fired')
    setShowRefundModal(!showRefundModal)
  }

  const goToProducts = () => {
    Log.debug('goToProducts fired')
    navigation.navigate(screens.PRODUCT_OPTIONS, { from: 'secondwind' })
  }

  //for horizontal scroll
  const CARD_WIDTH = Dimensions.get('window').width - 60
  // const CARD_HEIGHT = Dimensions.get('window').height * 0.7
  // const SPACING_FOR_CARD_INSET = Dimensions.get('window').width * 0.1 - 10

  const HorizontalCardView: React.FC<HorizontalCardViewProps> = ({
    kitImg,
    headerText,
    detailsText,
    index,
  }) => (
    <Div w={CARD_WIDTH} m="sm" p="sm" mb="xl">
      <Div style={styles.horizontalScrollImages} bg="gray100">
        {index == 0 ? null : (
          <Icon fontFamily="SimpleLineIcons" name="arrow-left" fontSize="3xl" />
        )}

        <Image source={kitImg} h={270} w={240} />
        {index == KIT_SCROLL_CARDS.length - 1 ? null : (
          <Icon
            fontFamily="SimpleLineIcons"
            name="arrow-right"
            fontSize="3xl"
          />
        )}
      </Div>
      <GDFontText fontSize="xl">{headerText}</GDFontText>
      <Text fontSize="lg" mt="lg">
        {detailsText}
      </Text>
    </Div>
  )

  const IconTile = ({ imgSrc, text }: any) => (
    <Div flex={1} m="xs">
      <Div
        rounded="xl"
        h={110}
        mb={5}
        bg="gray150"
        justifyContent="center"
        alignItems="center">
        <Image source={imgSrc} h={70} w={70} resizeMode="contain" />
      </Div>
      <Div w={'100%'} bg="white">
        <GDFontText textAlign="center">{text}</GDFontText>
      </Div>
    </Div>
  )

  return (
    <Div pt={insets.top} flex={1} bg="white">
      <GDHeader bottomLine bottomLineWidth={1}>
        세컨드 윈드
      </GDHeader>
      <ScrollView
        style={{ backgroundColor: 'white' }}
        stickyHeaderIndices={[0]}
        bounces={false}
        // borderTopWidth={1}
        borderColor={Styles.colors.grayscale.lightGray}
        ref={scrollViewRef}
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: 'space-between',
        }}>
        {/* <Div> */}
        <Radio.Group
          // pt="md"
          defaultValue="introduction"
          bg="white"
          h={50}
          // my="xl"
          borderBottomWidth={1}
          borderColor={Styles.colors.grayscale.lightGray}
          justifyContent="space-around"
          row>
          {/* <Div
            bg="white"
            h={48}
            // my="xl"
            borderBottomWidth={1}
            borderColor={Styles.colors.grayscale.lightGray}
            justifyContent="space-around"
            row> */}
          {/* {['introduction', 'curriculum', 'kit', 'refund'].map( */}
          {['상품소개', '결합상품', '환불정책'].map((item, i) => (
            <Radio
              value={item}
              key={String(i)}
              onPress={() => {
                switchTab(item)
              }}>
              {({ checked }) => (
                <Div>
                  <Div
                    flex={1}
                    py="lg"
                    borderBottomWidth={item == selectedTab ? 3 : 0}>
                    <Text
                      color={item == selectedTab ? 'dark' : 'gray500'}
                      fontSize="xl">
                      {item}
                    </Text>
                  </Div>
                </Div>
              )}
            </Radio>
          ))}
          {/* </Div> */}
        </Radio.Group>

        {/* TAB 1 */}
        {selectedTab == '상품소개' ? (
          <>
            <Div mt="2xl" px="xl">
              <GDFontText fontSize="3xl">교육키트</GDFontText>
              <Div bg="gray150" my="lg" rounded="2xl" p="md" py="lg">
                <Text fontSize="lg">
                  교육 진행에 필요한 교육키트를 사전에 보내드립니다.{'\n'}
                  (교육키트는 별도 비용이 발생하지 않으며, 교육비에 포함되어
                  있습니다.)
                </Text>
              </Div>
            </Div>

            {/* point one */}
            <Div px="xl">
              <GDFontText fontSize="3xl" mt="2xl" pb="lg">
                {'첫 번째 혜택\nDOFIT 스마트밴드'}
              </GDFontText>
              <Text>
                스마트밴드로 측정한 신체 데이터를 바탕으로 목표를 실천하도록
                독려하고, 측정 가능한 지표를 통해 건강을 개선할 수 있도록
                도와줍니다.
              </Text>
              <Div
                alignItems="center"
                mt="2xl"
                py="2xl"
                px="3xl"
                bg="gray150"
                rounded="2xl">
                <Image
                  source={Styles.images.secondwind.smallBandPic}
                  resizeMode="contain"
                  h={202}
                  w={177}
                />
                <GDFontText mt="2xl" fontSize="lg" textAlign="center">
                  DOFIT 스마트밴드{'\n'}
                  <Text fontWeight="normal">(87,000원 상당)</Text>
                </GDFontText>
              </Div>
            </Div>
            <Div px="xl" mt="lg" row justifyContent="space-around" flex={1}>
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

            <Div mt="2xl" px="xl">
              <GDFontText fontSize="xl">
                {'두번 째 혜택\n‘세컨드 윈드’ 앱 무료 이용권'}
              </GDFontText>
              <Text mt="lg" fontSize="lg">
                {
                  '‘세컨드 윈드’는 사용자의 건강한 삶을 위한 개인 맞춤형 전문 건강관리 솔루션입니다.\n국내의 최고의 의료진들과 건강관리 임상 전문가들이 함께 개발한 솔루션으로 영양, 운동관리, 복약/금연 관리, 질환별 교육등의 기능을 갖춘  헬스케어 서비스입니다.'
                }
              </Text>
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
          </>
        ) : null}

        {/* TAB 2 */}
        {selectedTab == '결합상품' ? (
          <Div px="lg" flex={1}>
            <Div p="lg" />
            <WellnessProductBox option={1} mode="small" buttonDisabled={true} />
            <Div row mt="2xl">
              <Div flex={1}>
                <Icon
                  fontFamily="MaterialCommunityIcons"
                  name="bell-outline"
                  fontSize="2xl"
                  color="gray500"
                />
              </Div>
              <Div flex={9} pr={30} pb="lg">
                <Text color="gray500" fontSize="sm">
                  교육 구매 시 불편한 부분이 있으면 부담없이 아래 고객센터로
                  문의해주세요.
                </Text>
                <Div p="xs" />
                <Div borderBottomWidth={0.5} borderColor="gray500" w={112}>
                  <Text color="gray500" fontSize="sm">
                    카카오톡으로 문의하기
                  </Text>
                </Div>
              </Div>
            </Div>
          </Div>
        ) : null}

        {/* TAB 3 */}
        {selectedTab == '환불정책' ? (
          <Div px="xl" flex={1} mt="2xl">
            <Refund showHeader={true} />
          </Div>
        ) : null}
        {/* </Div> */}
      </ScrollView>
      {/* <Button block onPress={goToProducts} py="xl" bg="main900">
        구매하기
      </Button> */}
      {Platform.OS == 'android' ? (
        <Div position="absolute" bottom={0}>
          <Button
            h={48}
            block
            rounded="none"
            onPress={goToProducts}
            py="xl"
            bg="main900">
            구매하기
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
            onPress={goToProducts}
            // py="xl"
            bg="main900"
            fontSize="lg">
            구매하기
          </Button>
        </Div>
      )}
    </Div>
  )
}

const styles = StyleSheet.create({
  horizontalScrollImages: {
    marginVertical: 24,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderRadius: 10,
  },

  selectedTab: {
    color: Styles.colors.grayscale.blackGray,
    borderBottomColor: 'black',
    borderBottomWidth: 3,
  },
})

export default SecondWindDetailsScreen
