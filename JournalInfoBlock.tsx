import * as React from 'react'
import { TouchableOpacity } from 'react-native'
import { Div, Image, Text, Icon } from 'react-native-magnus'
import Log from '../util/Log'
import Styles from '../util/Styles'
import GDFontText from './GDFontText'

interface JournalInfoBlockProps {
  yearMonth: string
  day: string
  moodMorning: number
  moodAfternoon: number
  moodEvening: number
  isShared: boolean
  yearMonthDate: string
  title: string
  docId: string
  theme: string
}

interface JournalInfoData {
  data: JournalInfoBlockProps
  onPress?: () => void
}

const JournalInfoBlock = ({ data, onPress }: JournalInfoData) => {
  const {
    moodMorning,
    moodAfternoon,
    moodEvening,
    isShared,
    yearMonthDate,
    title,
    docId,
    theme,
  } = data
  // Log.debug('whats in here', data)
  const yearMonth = yearMonthDate.substring(0, 7)
  const day = yearMonthDate.substring(8, 10)

  const handleMoods = (moodNum: number) =>
    Styles.images.emoji[`m${moodNum?.toString()}`] ||
    Styles.images.emoji.default

  return (
    <TouchableOpacity onPress={onPress}>
      <Div
        mx="xl"
        h={100}
        m="sm"
        p="sm"
        rounded="xl"
        bg="gray100"
        borderColor="black"
        // borderWidth={1}
        // shadow="xs"
        row>
        <Div flex={2} justifyContent="center" alignItems="center">
          <Text>{yearMonth}</Text>
          <GDFontText fontSize="6xl">{day}</GDFontText>
        </Div>
        <Div flex={6} alignItems="center" justifyContent="center">
          <Div row w={200} justifyContent="flex-start">
            <Div px="md" justifyContent="center" alignItems="center">
              <Image source={handleMoods(moodMorning)} h={40} w={40} />
            </Div>
            <Div px="md" justifyContent="center" alignItems="center">
              <Image source={handleMoods(moodAfternoon)} h={40} w={40} />
            </Div>
            <Div px="md" justifyContent="center" alignItems="center">
              <Image source={handleMoods(moodEvening)} h={40} w={40} />
            </Div>
          </Div>
          <Div row ml="xl" mt="md">
            <Icon
              fontFamily="MaterialCommunityIcons"
              name="folder-star-outline"
              color="system900"
              fontSize="4xl"
            />
            <Text textAlign="left" numberOfLines={1} w="100%">
              {/* {theme && (
                )} */}
              {title}
            </Text>
          </Div>
        </Div>
        <Div flex={2} justifyContent="center">
          {isShared ? (
            <Icon
              color="gray400"
              name="lock-open"
              fontFamily="MaterialIcons"
              fontSize="6xl"
            />
          ) : (
            <Icon
              color="system900"
              name="lock"
              fontFamily="MaterialIcons"
              fontSize="6xl"
            />
          )}
        </Div>
      </Div>
    </TouchableOpacity>
  )
}

export default JournalInfoBlock
