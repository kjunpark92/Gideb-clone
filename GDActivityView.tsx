import * as React from 'react'
import { useState, useEffect } from 'react'
import Log from '../util/Log'
import { SafeAreaView, TouchableOpacity } from 'react-native'
import { Header, Text, Div, Icon, Input, Button } from 'react-native-magnus'
import dayjs from 'dayjs'
import { GDTimer } from './GDTimer'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { GDFontText } from '.'

export interface IGDActivityViewProps {
  closeActivity: () => void
}

export function GDActivityView(props: IGDActivityViewProps) {
  const [currentActivityHeaderText, setCurrentActivityHeaderText] =
    useState('Act 1. 건강의 결정요소')
  const [currentQuestionText, setCurrentQuestionText] = useState(
    'Q1. 건강에 좋은 영향을 미치는 요소가 무엇이라고 생각하나요?',
  )
  const [totalDuration, setTotalDuration] = useState(180000)
  const [timerStart, setTimerStart] = useState(false)
  const [timerReset, setTimerReset] = useState(false)
  const [currentWord, setCurrentWord] = useState('')
  const [wordsToDisplay, setWordsToDisplay] = useState<string[]>([])
  const insets = useSafeAreaInsets()
  const options = {
    container: {
      alignItems: 'center',
      backgroundColor: 'white',
      padding: 5,
      borderRadius: 5,
      width: 220,
      // borderWidth: 1,
    },
    text: {
      fontWeight: 'bold',
      fontSize: 20,
      color: '#4FD1C5',
      marginLeft: 7,
    },
  }
  const handleTimerComplete = () => {
    Log.debug(
      'something should happen: close modal, or notify client of timer ending and stop doing activity',
    )
  }

  return (
    // <RNModal visible={visible}>
    <Div flex={1} pt={insets.top}>
      <Header
        shadow="none"
        prefix={
          <GDFontText fontSize="xl">
            {currentActivityHeaderText}
            <Icon
              fontFamily="SimpleLineIcons"
              name="question"
              fontSize="xl"
              pt="sm"
              pl="sm"
            />
          </GDFontText>
        }
        suffix={
          <Div row>
            <TouchableOpacity>
              <Icon fontFamily="MaterialIcons" name="refresh" fontSize="6xl" />
            </TouchableOpacity>
            <Div p="lg" />
            <TouchableOpacity onPress={props.closeActivity}>
              <Icon
                fontFamily="MaterialIcons"
                name="exit-to-app"
                fontSize="6xl"
              />
            </TouchableOpacity>
          </Div>
        }
      />
      <Div p="lg">
        <Div row>
          <Div flex={1}>
            <GDFontText fontSize="2xl">
              {currentQuestionText.split('.')[0]}.
            </GDFontText>
          </Div>
          <Div flex={9}>
            <GDFontText fontSize="2xl">
              {currentQuestionText.split('.')[1]}
            </GDFontText>
            <Text color="gray400" fontSize="md">
              *단어 위주로 입력해주세요.
            </Text>
          </Div>
        </Div>
        <Div alignItems="center">
          {/* <Text>{dayjs().locale('ko').toString()}</Text> */}
          {/* <Timer
              totalDuration={totalDuration}
              start={timerStart}
              reset={timerReset}
              options={options}
              handleFinish={handleTimerComplete}
              // getTime={getFormattedTime}
            /> */}
          <GDTimer expiryTimestamp={dayjs().add(3, 'minute').toDate()} />
        </Div>
        <Div>
          <Input
            multiline
            borderTopWidth={0}
            borderLeftWidth={0}
            borderRightWidth={0}
            focusBorderColor="main900"
            // value={currentWord}
            onChangeText={(text) => setCurrentWord(text)}
            suffix={
              <Button
                bg="main900"
                onPress={() => {
                  setWordsToDisplay([...wordsToDisplay, currentWord])
                  setCurrentWord('')
                }}>
                <Text color="white">입력</Text>
              </Button>
            }
          />
        </Div>
        <Div p="lg">
          {wordsToDisplay.map((word, i) => (
            <Div
              key={String(i)}
              alignItems="center"
              px="xl"
              h={100}
              bg="gray200"
              row
              justifyContent="space-between"
              m="sm"
              rounded="xl">
              <Text fontSize="lg">{word}</Text>
              <TouchableOpacity
                onPress={() => {
                  let wordsList = wordsToDisplay
                  wordsList.splice(i, 1)
                  setWordsToDisplay([...wordsList])
                }}>
                <Icon
                  fontFamily="MaterialCommunityIcons"
                  name="delete"
                  fontSize="4xl"
                />
              </TouchableOpacity>
            </Div>
          ))}
        </Div>
      </Div>
    </Div>
    // </RNModal>
  )
}
