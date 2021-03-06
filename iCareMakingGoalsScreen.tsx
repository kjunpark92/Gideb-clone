import * as React from 'react'
import {
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native'
import {
  Div,
  Text,
  Icon,
  Tooltip,
  Header,
  Overlay,
  Button,
} from 'react-native-magnus'
import { useFirestore, useFirebase } from 'react-redux-firebase'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import stacks from '../navigation/stacks'
import screens from '../navigation/screens'
import Log from '../util/Log'
import Styles from '../util/Styles'
import Config from '../config'

interface iCareMakingGoalsScreenProps {
  navigation: any
  route: any
}

const ContentComponents = {
  StartBlock: ({ onPress }: any) => {
    return (
      <TouchableOpacity style={{ width: '100%' }} onPress={onPress}>
        <Div
          bg="#E9F8F7"
          // opacity={0.3}
          rounded="xl"
          h={100}
          borderColor="main900"
          borderStyle="dashed"
          borderWidth={1}
          justifyContent="center"
          alignItems="center">
          <Text color="main900" fontSize="xl">
            {'μμνκΈ°'}
          </Text>
        </Div>
      </TouchableOpacity>
    )
  },
  DayBlock: ({ text, onPress }: any) => {
    return (
      <TouchableOpacity
        style={{ width: '100%', margin: 5 }}
        onPress={onPress}
        disabled={true}>
        <Div
          row
          bg="gray200"
          // opacity={0.3}
          rounded="xl"
          h={100}
          p="lg"
          justifyContent="space-between"
          alignItems="center">
          <Text fontSize="lg">{text}</Text>
          <Icon
            fontFamily="MaterialCommunityIcons"
            name="arrow-right"
            fontSize="4xl"
            color="black"
          />
        </Div>
      </TouchableOpacity>
    )
  },
  QuestionMoreInfoOverlay: ({
    visible,
    closeEvent,
    continuationEvent,
  }: any) => (
    <Overlay visible={visible} p="xl">
      <Div p="md" rounded="circle">
        <Div alignItems="flex-end">
          <TouchableOpacity onPress={closeEvent}>
            <Icon
              fontFamily="MaterialCommunityIcons"
              name="close"
              color="black"
              fontSize="4xl"
            />
          </TouchableOpacity>
        </Div>
        <Div alignItems="center" justifyContent="center">
          <Icon
            color="main900"
            fontFamily="SimpleLineIcons"
            name="question"
            fontSize="6xl"
            pb="sm"
          />
          <Text fontSize="xl" textAlign="center">
            μκΈ°νκ°ν
          </Text>
        </Div>
        <Div p="lg" />
        <Div>
          <Text>
            {`μ°λμ€ μ¨λΌμΈ κ΅μ‘ μ§νμ νμν μ€λ¬Έμ‘°μ¬ μλλ€.\n

μνν κ΅μ‘ μ§νμ μν΄ κΌ­ μ°Έμ¬ λΆνλλ¦½λλ€.`}
          </Text>
        </Div>
        <Div p="lg" />
        <Div>
          <Button block bg="main900" rounded="circle" h={50}>
            <Text color="white">κ³Όμ  μ΄μ΄νκΈ°</Text>
          </Button>
        </Div>
      </Div>
    </Overlay>
  ),
}

const { useEffect, useState } = React
export default function iCareMakingGoalsScreen({
  navigation,
  route,
}: iCareMakingGoalsScreenProps) {
  const insets = useSafeAreaInsets()
  const dayBlockInfo = [
    {
      text: 'Day 1    |    μ μ²΄',
      onPress: () => Log.debug('example'),
    },
    {
      text: 'Day 2-1    |    μ μ ',
      onPress: () => Log.debug('example'),
    },
    {
      text: 'Day 2-2    |    μνΌ',
      onPress: () => Log.debug('example'),
    },
    {
      text: 'Day 3    |    IMPACT νλ κ³νν',
      onPress: () => Log.debug('example'),
    },
    {
      text: '8μ£Ό λ¬μ± λͺ©ν μΈμ°κΈ°',
      onPress: () => Log.debug('example'),
    },
  ]

  const [questionMoreInfoVisible, setQuestionMoreInfoVisible] =
    useState<boolean>(false)

  return (
    <>
      <ContentComponents.QuestionMoreInfoOverlay
        visible={questionMoreInfoVisible}
        closeEvent={() => setQuestionMoreInfoVisible(!questionMoreInfoVisible)}
        continuationEvent={() => Log.debug('how to continue')}
      />
      <Div style={{ flex: 1, backgroundColor: 'white' }} pt={insets.top}>
        <Header
          prefix={
            <TouchableOpacity>
              <Text fontSize="xl" fontWeight="bold">
                {'κ³Όμ νκΈ°'}
              </Text>
            </TouchableOpacity>
          }
          suffix={
            <TouchableOpacity
              onPress={() => navigation.navigate(stacks.iCARE_STACK)}>
              <Icon
                fontFamily="MaterialIcons"
                name="close"
                fontSize="4xl"
                color="black"
              />
            </TouchableOpacity>
          }
        />
        <Div borderBottomWidth={1} borderBottomColor="gray200" />
        <ScrollView bounces={false}>
          <Div p="lg" bg="white">
            <Text fontSize="xl" fontWeight="bold" textAlignVertical="center">
              μκΈ° νκ°ν{' '}
              <TouchableOpacity
                onPress={() =>
                  setQuestionMoreInfoVisible(!questionMoreInfoVisible)
                }>
                <Icon
                  fontFamily="SimpleLineIcons"
                  name="question"
                  fontSize="xl"
                  pt="sm"
                />
              </TouchableOpacity>
            </Text>
            <Div justifyContent="center" alignItems="center">
              <Div p="sm" />
              <ContentComponents.StartBlock
                onPress={() => navigation.navigate(screens.iCARE_QUESTIONS)}
              />
            </Div>
          </Div>
          <Div p="lg" bg="white">
            <Text fontSize="xl" fontWeight="bold" textAlignVertical="center">
              μκΈ° νκ°ν{' '}
              <Icon
                fontFamily="SimpleLineIcons"
                name="question"
                fontSize="xl"
                pt="sm"
              />
            </Text>
            <Div justifyContent="center" alignItems="center">
              <Div p="sm" />
              {/* <GoalsComponents.DayBlock
              text="example"
              onPress={() => Log.debug('example')}
            /> */}
              {dayBlockInfo.map(({ text, onPress }, i) => (
                <ContentComponents.DayBlock
                  key={String(i)}
                  text={text}
                  onPress={onPress}
                />
              ))}
            </Div>
          </Div>
        </ScrollView>
      </Div>
    </>
  )
}
