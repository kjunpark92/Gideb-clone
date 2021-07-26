import * as React from 'react'
import {
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Modal,
} from 'react-native'
import { Div, Button, Text, Header, Icon, Image } from 'react-native-magnus'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { GDView } from '../components'
import Log from '../util/Log'
import Styles from '../util/Styles'
import screens from '../navigation/screens'
import { useSelector, useDispatch } from 'react-redux'

import WellnessTrainingVideoChatSleepActivity from '../components/WellnessTrainingVideoChatSleepActivity'

interface WellnessTrainingClassInitialScreenProps {
  navigation: any
  route: any
}

const SCREEN_WIDTH = Dimensions.get('screen').width
const { useState, useEffect, useRef } = React
const WellnessTrainingClassInitialScreen: React.FC<WellnessTrainingClassInitialScreenProps> =
  ({ navigation, route }) => {
    const [pagination, setPagination] = useState(0)
    const handleScroll = (e: any) => {
      const scrollPosition = e.nativeEvent.contentOffset.x
      setPagination(Math.ceil(scrollPosition / SCREEN_WIDTH))
    }

    const insets = useSafeAreaInsets()

    // const { videoChatId } = route.params
    useEffect(() => {
      // Log.debug('videoChatId =', videoChatId)
    }, [])

    const WelcomePage = () => (
      <Div w={SCREEN_WIDTH} px="xl" pt="xl" alignItems="center">
        <Image
          style={{ resizeMode: 'contain' }}
          h={'38%'}
          w={'100%'}
          source={Styles.images.wellnessTraining.wellnessLaptopCircle}
        />
        <Div p="md" />
        <Div>
          <Text fontSize="3xl" fontWeight="bold">
            웰니스 온라인 교육
          </Text>
        </Div>
        <Div p="md" />
        <Div>
          <Text fontSize="md">환영합니다!</Text>
        </Div>
        <Div p="sm" />
        <Div justifyContent="center">
          <Text fontSize="md" textAlign="center">
            {
              '웰니스 온라인 교육은 몸, 마음, 정신의 조화를 통해\n건강한 삶을 살 수 있게 도와주는 교육프로그램입니다.'
            }
          </Text>
        </Div>
        <Div p="sm" />
        <Div>
          <Text fontSize="md" textAlign="center">
            {
              '시작하려니 긴장되세요?\n강사분이 하나 하나 설명해 주실거에요!\n걱정하지 마세요~'
            }
          </Text>
        </Div>
        <Div p="sm" />
        <Div>
          <Text fontSize="md">함께 시작해 볼까요?</Text>
        </Div>
      </Div>
    )

    const InstructionsPage = () => (
      <Div w={SCREEN_WIDTH} px={50}>
        {/* <Div>
          <Text fontSize="4xl" textAlign="center">
            사용 방법을 알려드릴게요!
          </Text>
        </Div> */}
        <Div p="lg" />
        <Div h={500}>
          <Image
            style={{ resizeMode: 'contain' }}
            h={'100%'}
            w={'100%'}
            source={Styles.images.wellnessTraining.videoInstructions}
          />
        </Div>
      </Div>
    )

    const StartToUsePage = () => (
      <Div w={SCREEN_WIDTH} px={50}>
        {/* <Div>
          <Text fontSize="4xl" textAlign="center">
            사용 방법을 알려드릴게요!
          </Text>
        </Div> */}
        <Div p="lg" />
        <Div h={500}>
          <Image
            style={{ resizeMode: 'contain' }}
            h={'100%'}
            w={'100%'}
            source={Styles.images.wellnessTraining.activityInstructions}
          />
        </Div>
      </Div>
    )

    const [act, setAct] = useState(false)

    return (
      <Div pt={insets.top} bg="white" flex={1}>
        <Div alignItems="flex-end">
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon
              p="lg"
              color="black"
              fontFamily="MaterialCommunityIcons"
              name="close"
              fontSize="5xl"
            />
          </TouchableOpacity>
        </Div>
        <ScrollView
          // style={styles.container}
          pagingEnabled
          horizontal={true}
          decelerationRate={0}
          snapToAlignment={'center'}
          showsVerticalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          contentInset={{
            top: 0,
            left: 30,
            bottom: 0,
            right: 30,
          }}>
          <WelcomePage />
          <InstructionsPage />
          <StartToUsePage />
        </ScrollView>
        <Div
          p="lg"
          row
          justifyContent="space-around"
          w={120}
          position="absolute"
          bottom={65}
          alignSelf="center">
          <Div
            h={10}
            w={pagination == 0 ? 20 : 10}
            rounded="xl"
            bg={
              pagination == 0
                ? Styles.colors.client.main
                : Styles.colors.grayscale.silver
            }
          />
          <Div
            h={10}
            w={pagination == 1 ? 20 : 10}
            rounded="xl"
            bg={
              pagination == 1
                ? Styles.colors.client.main
                : Styles.colors.grayscale.silver
            }
          />
          <Div
            h={10}
            w={pagination == 2 ? 20 : 10}
            rounded="xl"
            bg={
              pagination == 2
                ? Styles.colors.client.main
                : Styles.colors.grayscale.silver
            }
          />
        </Div>
        <Modal visible={act}>
          <WellnessTrainingVideoChatSleepActivity
            closeActFunc={() => setAct(!act)}
          />
        </Modal>
        <Div
          h={60}
          justifyContent="flex-end"
          position="absolute"
          bottom={0}
          w={SCREEN_WIDTH}>
          {/* <Button block onPress={() => setAct(!act)}>
            Test Activity
          </Button> */}
          <Button
            bg="main900"
            h={60}
            block
            onPress={() => navigation.navigate('video')}>
            {'시작하기'}
          </Button>
        </Div>
      </Div>
    )
  }

const styles = StyleSheet.create({})

export default WellnessTrainingClassInitialScreen
