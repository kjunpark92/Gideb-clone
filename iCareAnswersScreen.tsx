import * as React from 'react'
import { SafeAreaView, StyleSheet, TouchableOpacity } from 'react-native'
import {
  Div,
  Input,
  Button,
  Icon,
  Text,
  Overlay,
  Header,
} from 'react-native-magnus'
import { useFirebase, useFirestore } from 'react-redux-firebase'
import { useSelector, useDispatch } from 'react-redux'

import Styles from '../util/Styles'
import Log from '../util/Log'
import Config from '../config'
import { GDFontText } from '../components'

interface iCareAnswersScreenProps {
  navigation: any
  route: any
}

const { useState, useEffect } = React
export default function iCareAnswersScreen({
  navigation,
  route,
}: iCareAnswersScreenProps) {
  const { answerOne, answerTwo, answerThree, answerFour, answerFive } =
    route.params

  useEffect(() => Log.debug('iCare answers: route.params =', route.params), [])

  return (
    <Div style={{ flex: 1, backgroundColor: 'white' }}>
      <Header
        prefix={
          <Text>
            자기 평가표
            <Icon
              fontFamily="SimpleLineIcons"
              name="question"
              fontSize="xl"
              pt="sm"
            />
          </Text>
        }
        suffix={
          <Div row>
            <Icon
              fontFamily="SimpleLineIcons"
              name="question"
              fontSize="xl"
              pt="sm"
            />
            <Icon
              fontFamily="SimpleLineIcons"
              name="question"
              fontSize="xl"
              pt="sm"
            />
          </Div>
        }
      />
      <Div borderBottomWidth={1} borderColor="gray200" />
      <Div p="lg" />
      <Div>
        <GDFontText fontSize="xl">
          {`김기댑님,\n
자기평가표 결과 보기`}
        </GDFontText>
      </Div>
      <Div borderBottomWidth={1} borderColor="gray200" />
      <Div p="lg" />
      <Div>
        <GDFontText fontSize="xl">
          Q1. 건강을 개선하고 싶은 이유 5가지
        </GDFontText>
        <Div bg="gray400">
          {answerOne.map((text, i) => (
            <Text key={String(i)}>{`${String(i)}. ${text}`}</Text>
          ))}
        </Div>
      </Div>
    </Div>
  )
}
