import * as React from 'react'
import { Dimensions, StyleSheet, ScrollView } from 'react-native'
import { Div, Image, Text, Button, Icon, Radio } from 'react-native-magnus'
import { SafeAreaView as NavSafeAreaView } from 'react-native-safe-area-context'

import Log from '../util/Log'
import Styles from '../util/Styles'
import { GDHeader, Refund } from '../components'

// import { useI18n } from '../hooks'
// import text from '../util/Lang'
import screens from '../navigation/screens'

interface WellnessDetailsScreenProps {
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

const { useState, useRef } = React
const WellnessDetailsScreen: React.FC<WellnessDetailsScreenProps> = ({
  navigation,
}) => {
  const [selectedTab, setSelectedTab] = useState('교육소개')

  // const t = useI18n('wellnessDetailsScreen')
  // const t = text.wellnessDetailsScreen
  // const [showRefundModal, setShowRefundModal] = useState(false)

  const SCREEN_HEIGHT = Dimensions.get('screen').height

  const scrollViewRef = useRef()

  const switchTab = (item) => {
    Log.debug('switchTab fired: new tab:', item)
    setSelectedTab(item)
    scrollViewRef.current.scrollTo({ y: 0 })
  }

  const goToProducts = () =>
    navigation.navigate(screens.PRODUCT_OPTIONS, { from: 'wellness' })

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
    <Div w={CARD_WIDTH} m="sm" p="sm">
      <Div bg="gray100" style={styles.horizontalScrollImages}>
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
      <Text fontWeight="bold" fontSize="xl">
        {headerText}
      </Text>
      <Text fontSize="lg" mt="2xl">
        {detailsText}
      </Text>
    </Div>
  )

  return (
    <NavSafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <GDHeader>웰니스교육</GDHeader>
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: 'space-between',
        }}>
        {selectedTab == '교육소개' ? (
          <Div>
            <Div>
              <Image
                h={214}
                w={'100%'}
                source={Styles.images.wellness.wellness_initial_1}
              />
            </Div>

            <Div px="xl" mt="2xl">
              <Div row justifyContent="space-between">
                <Text fontWeight="bold" fontSize="3xl">
                  웰니스 온라인 교육
                </Text>
                <Text fontWeight="bold" fontSize="3xl">
                  150,000원
                </Text>
              </Div>
              <Div row justifyContent="space-between">
                <Text fontWeight="bold" color="gray500" fontSize="lg">
                  12주 과정
                </Text>
                <Text
                  textDecorLine="line-through"
                  color="gray500"
                  fontSize="lg">
                  200,000원
                </Text>
              </Div>
            </Div>
          </Div>
        ) : null}

        {/* <ScrollView horizontal></ScrollView> */}
        <Radio.Group defaultValue="introduction" px="xl">
          {/* {['introduction', 'curriculum', 'kit', 'refund'].map( */}
          <Div
            my="xl"
            borderTopWidth={1}
            borderBottomWidth={1}
            borderColor={Styles.colors.grayscale.lightGray}
            justifyContent="space-around"
            row>
            {['교육소개', '커리큘럼', '교육키트', '환불정책'].map((item, i) => (
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
          </Div>
        </Radio.Group>

        {selectedTab == '교육소개' ? (
          <Div mt="2xl">
            <Div px="xl">
              <Text fontSize="3xl" fontWeight="bold" mb="xl">
                교육소개
              </Text>
              <Text fontSize="lg">
                2012년 NAAPIMHA라는 단체에서 만든 프로그램으로 하버드대 의대
                정신건강학과 Ed Wang 교수와 미 보건복지부 지원으로 만들어진
                교육입니다.
              </Text>
              <Text mt="xl" fontSize="lg">
                AWH(Achieving Whole Health){'\n'}몸, 마음, 정신의 조화를 통해
                사람들에게 건강한 삶을 살 수 있는 방법을 알려주고 ‘나만의 8주
                건강목표 달성하기’를 통해 건강한 습관을 만들기를 도와주는 교육
                프로그램입니다.
              </Text>

              <Div mt="2xl" row alignItems="flex-start">
                <Text fontWeight="bold" fontSize="lg">
                  1.{' '}
                </Text>
                <Text fontWeight="bold" fontSize="lg">
                  건강한 삶을 위해 몸, 마음, 정신을 함께 관리하는 방법을 함께
                  배워보세요.
                </Text>
              </Div>
              <Div mt="xl" row alignItems="flex-start">
                <Text fontWeight="bold" fontSize="lg">
                  2.{' '}
                </Text>
                <Text fontWeight="bold" fontSize="lg">
                  1회성 교육이 아닌 3개월동안 달성할 목표를 세우고 달성해서
                  건강한 삶의 습관을 함께 만들어가요.
                </Text>
              </Div>
              <Div mt="xl" row alignItems="flex-start">
                <Text fontWeight="bold" fontSize="lg">
                  3.{' '}
                </Text>
                <Text fontWeight="bold" fontSize="lg">
                  스마트밴드를 통해 나의 건강데이터를 바탕으로 스마트한 헬스케어
                  서비스까지 누려보세요.{' '}
                </Text>
              </Div>
              <Div mt="xl" row alignItems="flex-start">
                <Text fontWeight="bold" fontSize="lg">
                  4.{' '}
                </Text>
                <Text fontWeight="bold" fontSize="lg">
                  나뿐만 아니라 타인의 삶에도 긍정적인 변화를 일으킬 수 있는
                  방법을 알려줍니다.
                </Text>
              </Div>
            </Div>
            <Div>
              <Image
                h={214}
                w={'100%'}
                mt="xl"
                source={Styles.images.wellness.wellness_details_1}
              />
            </Div>

            <Div px="xl" mt="2xl">
              <Div>
                <Text fontSize="3xl" fontWeight="bold">
                  웰니스의 3가지 요소
                </Text>
                <Text mt="xl" fontSize="lg">
                  몸, 마음, 정신의 3가지 영역과 10가지 건강 요소, 삶의 회복력에
                  중점을 둔 교육입니다.
                </Text>
              </Div>

              <Div
                row
                alignItems="center"
                mt="2xl"
                justifyContent="space-around">
                <Div style={styles.circleBg} bg="rgba(79, 209, 197, 0.2)">
                  <Text fontSize="2xl" fontWeight="bold" color="main900">
                    몸
                  </Text>
                </Div>
                <Div flex={3} m="xl" pl="lg">
                  <Text fontSize="lg">
                    - 건강한 식생활{'\n'}- 신체 활동{'\n'}- 편안한 수면
                  </Text>
                </Div>
              </Div>

              <Div row alignItems="center" justifyContent="space-around">
                <Div style={styles.circleBg} bg="rgba(79, 209, 197, 0.2)">
                  <Text fontSize="2xl" fontWeight="bold" color="main900">
                    마음
                  </Text>
                </Div>
                <Div flex={3} m="xl" pl="lg">
                  <Text fontSize="lg">
                    - 휴식 기법{'\n'}- 낙천주의와 희망{'\n'}- 긍정적인 태도
                    {'\n'}- 계획하기, 확인하기, 변화하기
                  </Text>
                </Div>
              </Div>

              <Div row alignItems="center">
                <Div style={styles.circleBg} bg="rgba(79, 209, 197, 0.2)">
                  <Text fontSize="2xl" fontWeight="bold" color="main900">
                    정신
                  </Text>
                </Div>
                <Div flex={3} m="xl" pl="lg">
                  <Text fontSize="lg">
                    - 정신적 신념과 실{'\n'}- 지지적 관계{'\n'}- 다른 사람에
                    대한 배려{'\n'}- 목적의식과 의미
                  </Text>
                </Div>
              </Div>
            </Div>

            <Div>
              <Image
                h={214}
                w={'100%'}
                mt="2xl"
                source={Styles.images.wellness.wellness_details_2}
              />
            </Div>

            <Div px="xl" mt="2xl">
              <Text fontSize="lg">
                단순한 웰니스 교육이 아닙니다. {'\n'}
                {'\n'} 10가지 생활 요소를 바탕으로, 몸, 마음을 건강하게 관리하는
                방법을 배웁니다.{'\n'}
                {'\n'}
                일방적으로 교육만 받는 것이 아니라, 각자의 삶의 방식과 문화
                그리고 신념을 이야기하는 시간을 가지고 다양한 홛동을 통해 서로를
                이해하고 소통하는 시간을 갖게 됩니다.{'\n'}
                {'\n'} 자신의 삶만이 아닌 타인의 삶에게 긍정적인 변화를 일으켜
                지역사회에 건강한 문화를 만들어 나가고자 합니다.
              </Text>
            </Div>

            <Div>
              <Image
                h={214}
                w={'100%'}
                mt="2xl"
                source={Styles.images.wellness.wellness_details_3}
              />
            </Div>

            <Div px="xl" mt="2xl" mb="2xl">
              <Text fontSize="3xl" fontWeight="bold">
                교육 성과 & 효과
              </Text>
              <Text mt="2xl" fontSize="lg">
                50,000명이상의 수료한 교육으로 참가자들의 반응은 4.5점(5점
                만점)으로 좋은피드백을 받았습니다.{'\n'} 참가자들은 교육을 통해
                자신과 각자를 이해하는 데 도움이 되었고, AANHPI를 효과적으로
                사용하여 삶의 좋은 습관으로 만드는 데 도움이 되었다고 말합니다.
                {'\n'} 현재 교육 참여자 중에서 500명 이상의 웰니스 코치로 활동을
                하며 웰니스교육을 진행하고 있습니다.
              </Text>
            </Div>
          </Div>
        ) : null}

        {/* {selectedTab == 'curriculum' ? ( */}
        {selectedTab == '커리큘럼' ? (
          <Div px="xl">
            <Div>
              <Text fontSize="3xl" fontWeight="bold">
                커리큘럼
              </Text>
              <Text mt="xl" fontSize="lg">
                웰니스 교육은 총 12주 과정입니다.
              </Text>
            </Div>

            <Div mt="2xl">
              <Text fontSize="xl" fontWeight="bold">
                1. 온라인 그룹 교육 (6시간)
              </Text>

              <Div mt="xl">
                <Div row>
                  <Div bg="gray100" style={styles.tableCellLeft}>
                    <Text fontWeight="bold" fontSize="xl">
                      1주
                    </Text>
                    <Text fontSize="lg" color="gray500">
                      2시간
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
                    <Text fontWeight="bold" fontSize="xl">
                      2주
                    </Text>
                    <Text fontSize="lg" color="gray500">
                      2시간
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
                    <Text fontWeight="bold" fontSize="xl">
                      3주
                    </Text>
                    <Text fontSize="lg" color="gray500">
                      2시간
                    </Text>
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
              <Text fontSize="xl" fontWeight="bold">
                2. 달성 목표 세우기 (2시간))
              </Text>
              <Div mt="xl">
                <Div row>
                  <Div bg="gray100" style={styles.tableCellLeft}>
                    <Text fontWeight="bold" fontSize="xl">
                      1단계
                    </Text>
                  </Div>
                  <Div style={styles.tableCellRight}>
                    <Text fontSize="lg">- 자가 건강 진단표 작성</Text>
                  </Div>
                </Div>

                <Div row>
                  <Div bg="gray100" style={styles.tableCellLeft}>
                    <Text fontWeight="bold" fontSize="xl">
                      2단계
                    </Text>
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
                    <Text fontWeight="bold" fontSize="xl">
                      3단계
                    </Text>
                  </Div>
                  <Div style={styles.tableCellRight}>
                    <Text fontSize="lg">- 8주 건강 달성 목표 세우기</Text>
                  </Div>
                </Div>
              </Div>
            </Div>

            {/* point3 */}
            <Div mt="2xl">
              <Text fontSize="xl" fontWeight="bold">
                3. 건강한 습관 만들기 (8주)
              </Text>
              <Div mt="xl">
                <Div row>
                  <Div bg="gray100" style={styles.tableCellLeft}>
                    <Text fontWeight="bold" fontSize="xl">
                      1단계
                    </Text>
                  </Div>
                  <Div style={styles.tableCellRight}>
                    <Text fontSize="lg">
                      8주간 본인이 설정한 건강 달성 목표에 실천하기
                    </Text>
                  </Div>
                </Div>

                <Div row>
                  <Div bg="gray100" style={styles.tableCellLeft}>
                    <Text fontWeight="bold" fontSize="xl">
                      2단계
                    </Text>
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
                    <Text fontWeight="bold" fontSize="xl">
                      3단계
                    </Text>
                  </Div>
                  <Div style={styles.tableCellRight}>
                    <Text fontSize="lg">교육 전, 후 리포트 받기</Text>
                  </Div>
                </Div>
              </Div>
            </Div>
          </Div>
        ) : null}
        {/* {selectedTab == 'kit' ? ( */}
        {selectedTab == '교육키트' ? (
          <Div px="xl">
            <Div>
              <Text fontSize="3xl" fontWeight="bold">
                교육키트
              </Text>
              <Text mt="2xl" pb="2xl" fontSize="lg">
                교육 진행에 필요한 교육키트를 사전에 보내드립니다.(교육키트는
                별도 비용이 발생하지 않으며, 교육비에 포함되어 있습니다.)
              </Text>
            </Div>

            {/* point one */}
            <Div
              py="2xl"
              borderBottomWidth={1}
              borderTopWidth={1}
              borderBottomColor={Styles.colors.grayscale.lightGray}
              borderTopColor={Styles.colors.grayscale.lightGray}>
              <Text fontWeight="bold" fontSize="3xl">
                1. DOFIT 스마트밴드
              </Text>
              <Text mt="xl" fontSize="lg">
                스마트밴드로 측정한 신체 데이터를 바탕으로 목표를 실천하도록
                독려하고, 측정 가능한 지표를 통해 건강을 개선할 수 있도록
                도와줍니다.
              </Text>
              <Div
                alignItems="center"
                mt="3xl"
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
                  <Text fontWeight="bold">DOFIT 스마트밴드{'\n'}</Text>
                  (87,000원 상당)
                </Text>
              </Div>
            </Div>

            <Div mt="2xl">
              <Text fontSize="xl" fontWeight="bold">
                걸음수 측정
              </Text>
              <Text mt="xl" fontSize="lg">
                서두르는 출퇴근길, 가벼운 산책, 격한 런닝까지~ DOFIT은 걸음,
                빠른걸음, 달리기 등의 다양한 걷기 형태를 모두 구분하여
                측정합니다.
              </Text>
            </Div>

            <Div mt="2xl">
              <Text fontSize="xl" fontWeight="bold">
                소모 칼로리 계산
              </Text>
              <Text mt="xl" fontSize="lg">
                사용자의 활동량 및 걷기형태 등을 분석해 정확한 소모 칼로리를
                구분 합니다. 소모 칼로리는 자정마다 초기화 되며, 앱과 동기화
                되기 전까지 안전하게 저장됩니다.
              </Text>
            </Div>

            <Div mt="2xl">
              <Text fontSize="xl" fontWeight="bold">
                심박수 측정
              </Text>
              <Text mt="xl" fontSize="lg">
                사용자가 아무 신경쓰지 않아도 DOFIT은 규칙적으로 심박을 측정하고
                저장합니다. 이렇게 측정된 심박은 칼로리 계산, 수면 측정 등여러
                상황에서 활용됩니다.
              </Text>
            </Div>

            <Div mt="2xl">
              <Text fontSize="xl" fontWeight="bold">
                스트레스 측정
              </Text>
              <Text mt="xl" fontSize="lg">
                10분에 한번씩 사용자의 HRV(심박변이도)를 통해 스트레스 상태를
                구분하여 기록합니다. 알게 모르게 쌓이고 풀리는 스트레스! DOFIT을
                통해 확인해 보세요!
              </Text>
            </Div>

            <Div mt="2xl">
              <Text fontSize="xl" fontWeight="bold">
                수면 측정
              </Text>
              <Text mt="xl" fontSize="lg">
                밴드만 차고 생활하세요. 1시간 이상의 수면이라면 언제 자고, 언제
                일어나는지 부터, 잘 잤는지, 못 잤는지 까지 모두 체크해 드립니다.
              </Text>
            </Div>

            <Div mt="2xl">
              <Text fontSize="xl" fontWeight="bold">
                전화, SMS, 카카오톡알림
              </Text>
              <Text mt="xl" fontSize="lg">
                스마트폰에 걸려오는 전화, 시시때때로 들어오는 SMS와 카카오톡
                메시지, 어느 것 하나 놓치지 않고 DOFIT이 알려드립니다.
              </Text>
            </Div>

            {/* point two */}
            <Div>
              <Text
                fontWeight="bold"
                fontSize="3xl"
                mt="2xl"
                pt="2xl"
                borderTopWidth={1}
                borderTopColor={Styles.colors.grayscale.lightGray}>
                2. ‘세컨드 원드’ 앱 무료 이용권
              </Text>
              <Text mt="xl" fontSize="lg">
                '세컨드 윈드'는 사용자의 건강한 삶을 위한 개인 맞춤형 전문
                건강관리 솔루션입니다. 국내의 최고의 의료진들과 건강관리 임상
                전문가들이 함께 개발한 솔루션으로 영양, 운동관리, 복약/금연
                관리, 질환별 교육등의 기능을 갖춘 헬스케어 서비스입니다.
              </Text>
            </Div>
            <Div>
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
            <Div mt="2xl">
              <Text
                pt="2xl"
                fontWeight="bold"
                fontSize="3xl"
                borderTopWidth={1}
                borderTopColor={Styles.colors.grayscale.lightGray}>
                3. 교육 준비물
              </Text>
              <Text mt="xl" fontSize="lg">
                온라인 그룹 교육시 필요한 준비물을 보내드립니다. 1, 2, 3주차별로
                교육 진행 시 함께 챙겨 주세요.
              </Text>
            </Div>
          </Div>
        ) : null}
        {/* {selectedTab == 'refund' ? ( */}
        {selectedTab == '환불정책' ? <Refund /> : null}
      </ScrollView>
      <Button
        block
        rounded="none"
        onPress={goToProducts}
        py="xl"
        bg="main900"
        fontSize="lg">
        교육 신청하기
      </Button>
    </NavSafeAreaView>
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
    borderColor: Styles.colors.grayscale.darkGray,
  },
  tableCellRight: {
    flex: 1.5,
    justifyContent: 'center',
    alignContent: 'center',
    paddingHorizontal: 30,
    paddingVertical: 20,
    borderWidth: 1,
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

export default WellnessDetailsScreen
