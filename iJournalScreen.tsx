import * as React from 'react'
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Touchable,
  TouchableOpacity,
  TextInput,
  Modal,
} from 'react-native'
import {
  Div,
  Text,
  Icon,
  Input,
  Radio,
  Button,
  Image,
  // Modal,
} from 'react-native-magnus'
import Slider from '@react-native-community/slider'

import dayjs from 'dayjs'
import {
  useFirebase,
  useFirestore,
  useFirestoreConnect,
} from 'react-redux-firebase'
import { useSelector } from 'react-redux'

// react-navigation
import {
  NavigationParams,
  NavigationScreenProp,
  NavigationState,
} from 'react-navigation'

import { useI18n } from '../hooks'

import Styles from '../util/Styles'
import Log from '../util/Log'

import JournalService, { journalPkgProps } from '../services/journal'

interface iJournalScreenProps {
  yearMonthDate: string
  navigation: NavigationScreenProp<NavigationState, NavigationParams>
  route: any
}

export interface MoodModalProps {
  isVisible: boolean
  mood: string
  defaultVal?: number
}

const { useState, useEffect } = React

const iJournalScreen: React.FC<iJournalScreenProps> = ({
  navigation,
  route,
}) => {
  const t = useI18n('iJournal')
  const { yearMonthDate, journal } = route.params
  const profile = useSelector((state: any) => state.firebase.profile)

  Log.debug(yearMonthDate, '***')
  Log.debug('route.params: journal:', journal, journal.docId, '***')

  const firebase = useFirebase()
  const firestore = useFirestore()

  const [moodModalVisible, setMoodModalVisible] = useState<boolean>(false)
  const [iPromptModalVisible, setiPromptModalVisible] = useState(false)
  const [moodMorning, setMoodMorning] = useState<any>(null)
  const [moodAfternoon, setMoodAfternoon] = useState<any>(null)
  const [moodEvening, setMoodEvening] = useState<any>(null)
  const [title, setTitle] = useState<string>('')
  const [entry, setEntry] = useState<string>('')
  const [isShared, setIsShared] = useState(false)
  const [loadSave, setLoadSave] = useState(false)
  const [selectedMood, setSelectedMood] = useState(null)
  const [modalMoodSelector, setModalMoodSelector] = useState<any>(null)
  const [docId, setDocId] = useState<string | null>(null)
  const [questionSelector, setQuestionSelector] = useState<boolean>(false)
  // const [date, setDate] = useState('')

  const handleGettingJournalInfo = async () => {
    // Log.debug('selectedJournal:', selectedJournal)
    if (journal) {
      const {
        moodMorning,
        moodAfternoon,
        moodEvening,
        title,
        entry,
        isShared,
        docId,
      } = journal
      setMoodMorning(moodMorning)
      setMoodAfternoon(moodAfternoon)
      setMoodEvening(moodEvening)
      setTitle(title)
      setEntry(entry)
      setIsShared(isShared)
      setDocId(docId)
    }
    Log.debug(
      'iJournalScreen: handleGettingJournalInfo: selectedJournal:',
      journal,
      firestore.collection('journals'),
    )
  }

  // const userJournal = useSelector((state: any) => state.firestore.data)
  // Log.debug('userJournal:', userJournal)

  useEffect(() => {
    Log.debug('useEffect in iJournalScreen')
    handleGettingJournalInfo()
    // journalsArr.length == 0 ? null : journals[journalsArr[0]],
  }, [])

  const handleSharedRadioButtonPressed = (bool: boolean) => {
    setIsShared(bool)
  }

  const handleMoodModalVisible = (mood: any) => {
    setMoodModalVisible(!moodModalVisible)
    setSelectedMood(mood)
    switch (mood) {
      case 'morning':
        setModalMoodSelector(moodMorning)
        break
      case 'afternoon':
        setModalMoodSelector(moodAfternoon)
        break
      case 'evening':
        setModalMoodSelector(moodEvening)
        break
      default:
        setModalMoodSelector(null)
        break
    }
  }

  const handleiPromptModalVisible = () =>
    setiPromptModalVisible(!iPromptModalVisible)

  const handleSaveEntry = async () => {
    Log.debug('handleSaveEntry:', yearMonthDate, 'docId:', journal.docId)
    // Log.debug('profile', profile)
    setLoadSave(true)
    // if (docId) {
    const journalPkg = {
      moodMorning,
      moodAfternoon,
      moodEvening,
      title,
      entry,
      isShared,
      theme: null,
      readBy: [],
      uid: firebase.auth().currentUser.uid,
      yearMonthDate,
      docId,
      updatedAt: firestore.FieldValue.serverTimestamp(),
    }
    Log.debug('journalPkg:', journalPkg)
    const ref = firestore.collection('journals').doc(journalPkg.docId)
    Log.debug('ref:', ref)
    try {
      Log.debug('iJournalScreen: handleSaveEntry: journalPkg:', journalPkg)
      await ref.update(journalPkg)
      navigation.goBack()
    } catch (error) {
      Log.debug('Failed to save', error)
    } finally {
      setLoadSave(false)
    }
    return
  }

  const MoodModal: React.FC<MoodModalProps> = ({ isVisible, mood }) => (
    <Modal
      visible={isVisible}
      transparent
      onDismiss={() => {
        if (mood == 'morning') setMoodMorning(modalMoodSelector)
        if (mood == 'afternoon') setMoodAfternoon(modalMoodSelector)
        if (mood == 'evening') setMoodEvening(modalMoodSelector)
        else return
      }}>
      <Div
        h={'50%'}
        bg={Styles.colors.grayscale.white}
        top={500}
        rounded="xl"
        borderWidth={1}>
        <Div alignItems="center" justifyContent="center" m={25}>
          <Image source={handleMoods(modalMoodSelector)} h={35} w={35} />
        </Div>

        <Slider
          minimumTrackTintColor={Styles.colors.grayscale.blackGray}
          minimumValue={1}
          maximumValue={5}
          step={1}
          value={modalMoodSelector}
          onValueChange={setModalMoodSelector}
        />
        <Button onPress={() => handleMoodModalVisible(null)}>Close</Button>
      </Div>
    </Modal>
  )

  // const handleMoodEmoji = (moodNum: number) => {
  //   if (!moodNum) return 'emoji-neutral'
  //   if (moodNum <= 2) return 'emoji-sad'
  //   if (moodNum == 3) return 'emoji-neutral'
  //   return 'emoji-happy'
  // }
  const handleMoods = (moodNum: number) =>
    Styles.images.emoji[`m${moodNum?.toString()}`] ||
    Styles.images.emoji.default

  return (
    <Div style={{ flex: 1 }}>
      <ScrollView>
        <Modal visible={iPromptModalVisible} transparent>
          <Div
            bg={Styles.colors.grayscale.white}
            h={'50%'}
            top={400}
            rounded="xl">
            {['option1', 'option2', 'option3', 'option4'].map((option) => (
              <TouchableOpacity
                onPress={() => setQuestionSelector(!questionSelector)}
                key={option}>
                <Div h={100} w={100} borderWidth={1}>
                  <Text>{option}</Text>
                </Div>
              </TouchableOpacity>
            ))}
            {questionSelector ? (
              <ScrollView horizontal>
                {['q1', 'q2', 'q3', 'q4'].map((question) => (
                  <TouchableOpacity onPress={() => setTitle(question)}>
                    <Div>
                      <Text>{question}</Text>
                    </Div>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            ) : null}
            <Button onPress={handleiPromptModalVisible}>Close</Button>
          </Div>
        </Modal>
        <MoodModal isVisible={moodModalVisible} mood={selectedMood} />
        <Div flex={1} bg={Styles.colors.background.light} pl={10} pr={10}>
          <Div
            row
            h={50}
            alignItems={'center'}
            mr={10}
            justifyContent="space-between">
            <Text fontSize="2xl" fontWeight="bold">
              {dayjs(yearMonthDate).format('YYYY.MM.DD')}
            </Text>
            <Div alignItems="center">
              <TouchableOpacity>
                <Icon
                  fontFamily="MaterialCommunityIcons"
                  name="calendar"
                  fontSize="5xl"
                />
              </TouchableOpacity>
            </Div>
          </Div>
          <Div>
            <Text fontWeight="bold" fontSize="3xl">
              {profile.nickname}
              {t.howWasYourDay}
            </Text>
          </Div>
          <Div p="sm" />
          <Div
            mx="xl"
            bg={Styles.colors.grayscale.lightGray}
            h={100}
            rounded="xl"
            row
            justifyContent={'space-between'}
            pl={40}
            pr={40}>
            <TouchableOpacity
              onPress={() => handleMoodModalVisible('morning')}
              style={styles.moodButtons}>
              {/* <Icon
                name={handleMoodEmoji(moodMorning)}
                fontFamily="Entypo"
                fontSize={75}
                color={
                  moodMorning
                    ? Styles.colors.grayscale.allBlack
                    : Styles.colors.grayscale.silver
                }
              /> */}
              <Image source={handleMoods(moodMorning)} h={35} w={35} />

              <Text>{t.morning}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleMoodModalVisible('afternoon')}
              style={styles.moodButtons}>
              {/* <Icon
                name={handleMoodEmoji(moodAfternoon)}
                fontFamily="Entypo"
                fontSize={75}
                color={
                  moodAfternoon
                    ? Styles.colors.grayscale.allBlack
                    : Styles.colors.grayscale.silver
                }
              /> */}
              <Image source={handleMoods(moodAfternoon)} h={35} w={35} />

              <Text>{t.afternoon}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleMoodModalVisible('evening')}
              style={styles.moodButtons}>
              {/* <Icon
                name={handleMoodEmoji(moodEvening)}
                fontFamily="Entypo"
                fontSize={75}
                color={
                  moodEvening
                    ? Styles.colors.grayscale.allBlack
                    : Styles.colors.grayscale.silver
                }
              /> */}
              <Image source={handleMoods(moodEvening)} h={35} w={35} />

              <Text>{t.evening}</Text>
            </TouchableOpacity>
          </Div>
          <Div p="sm" />
          <Div row pt={10}>
            <Text fontSize="3xl" fontWeight="bold">
              {t.titleOfTheDay}
            </Text>
            <TouchableOpacity
              style={styles.iPromptButton}
              onPress={handleiPromptModalVisible}>
              <Text
                color={Styles.colors.text.light}
                fontWeight="bold"
                fontSize="lg">
                {t.iPromptCardUse}
              </Text>
            </TouchableOpacity>
          </Div>
          <Div>
            <Input
              borderTopWidth={0}
              borderLeftWidth={0}
              borderRightWidth={0}
              focusBorderColor="blue700"
              value={title}
              onChangeText={setTitle}
            />
          </Div>
          <Div p="lg" />
          <Div>
            <Text fontWeight="bold" fontSize="3xl">
              {t.entryOfTheDay}
            </Text>
            <Div p="sm" />
            <TextInput
              // pt={0}
              multiline={true}
              numberOfLines={30}
              value={entry}
              onChangeText={setEntry}
              style={styles.journalEntry}
            />
          </Div>
          <Div p="lg" />
          <Div row>
            <Text fontWeight="bold" fontSize="3xl">
              {t.doYouWantToShare}{' '}
            </Text>
            <Icon fontFamily="AntDesign" name="questioncircle" fontSize="xl" />
          </Div>
          <Div p="lg" />
          <Div row justifyContent="flex-start">
            <Radio
              activeColor={Styles.colors.grayscale.blackGray}
              p="lg"
              value={1}
              checked={!isShared}
              onPress={() => handleSharedRadioButtonPressed(false)}>
              <Text fontSize="2xl"> {t.noToShared}</Text>
            </Radio>
            <Radio
              activeColor={Styles.colors.grayscale.blackGray}
              p="lg"
              value={2}
              checked={isShared}
              onPress={() => handleSharedRadioButtonPressed(true)}>
              <Text fontSize="2xl"> {t.yesToShared}</Text>
            </Radio>
          </Div>
          <Div p="lg" />
          <Div>
            <Button
              onPress={handleSaveEntry}
              loading={loadSave}
              block
              bg={Styles.colors.grayscale.allBlack}
              p={12}
              color="white"
              rounded="circle"
              mt="lg">
              {t.saveEntry}
            </Button>
          </Div>
          <Div p="lg" />
        </Div>
      </ScrollView>
    </Div>
  )
}

const styles = StyleSheet.create({
  moodButtons: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  iPromptButton: {
    height: 30,
    backgroundColor: Styles.colors.grayscale.allBlack,
    borderRadius: 15,
    width: 150,
    justifyContent: 'center',
    alignItems: 'center',
    left: 10,
  },
  journalEntry: {
    textAlignVertical: 'top',
    height: 300,
    width: '100%',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    paddingTop: 10,
  },
})

export default iJournalScreen

// {
//   createdAt,
//   title,
//   entry,
//   isShared,
//   morning,
//   afternoon,
//   evening,
//   theme,
//   readby
// }
