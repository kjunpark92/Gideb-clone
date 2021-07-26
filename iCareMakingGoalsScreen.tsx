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
            {'시작하기'}
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
            자기평가표
          </Text>
        </Div>
        <Div p="lg" />
        <Div>
          <Text>
            {`웰니스 온라인 교육 진행에 필요한 설문조사 입니다.\n

원활한 교육 진행을 위해 꼭 참여 부탁드립니다.`}
          </Text>
        </Div>
        <Div p="lg" />
        <Div>
          <Button block bg="main900" rounded="circle" h={50}>
            <Text color="white">과제 이어하기</Text>
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
      text: 'Day 1    |    신체',
      onPress: () => Log.debug('example'),
    },
    {
      text: 'Day 2-1    |    정신',
      onPress: () => Log.debug('example'),
    },
    {
      text: 'Day 2-2    |    영혼',
      onPress: () => Log.debug('example'),
    },
    {
      text: 'Day 3    |    IMPACT 활동 계획표',
      onPress: () => Log.debug('example'),
    },
    {
      text: '8주 달성 목표 세우기',
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
                {'과제하기'}
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
              자기 평가표{' '}
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
              자기 평가표{' '}
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
