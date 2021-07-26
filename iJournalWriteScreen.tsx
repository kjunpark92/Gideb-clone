import * as React from 'react'
import {
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from 'react-native'
import {
  Div,
  Text,
  Button,
  Icon,
  Input,
  Radio,
  Header,
  Dropdown,
  Image,
  Tooltip,
  Overlay,
  Modal as MNModal,
} from 'react-native-magnus'
import { Calendar } from 'react-native-calendars'
import Slider from '@react-native-community/slider'
import { useSelector, useDispatch } from 'react-redux'
import { useFirebase, useFirestore } from 'react-redux-firebase'
import dayjs from 'dayjs'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import _ from 'lodash'

import { useI18n } from '../hooks'
import Log from '../util/Log'
import Styles from '../util/Styles'
import iPromptThemes from '../assets/iPromptThemes'
import Config from '../config'
import { selectDateToView } from '../redux/Journal/JournalActions'
import { GDFontText } from '../components'

interface iJournalWriteScreenProps {
  navigation: any
  route: any
}

const themeIcons = [
  Styles.images.iJournal.themes.lovelyMe,
  Styles.images.iJournal.themes.timeTravelers,
  Styles.images.iJournal.themes.gameNights,
  Styles.images.iJournal.themes.topSecret,
  Styles.images.iJournal.themes.withFriends,
]

const questionPics = {
  'Lovely Me': Styles.images.iJournal.questions.lovelyMe,
  'Time Traveler’s Wish': Styles.images.iJournal.questions.timeTravelers,
  'Game Nights': Styles.images.iJournal.questions.gameNights,
  'Top Secret': Styles.images.iJournal.questions.topSecret,
  'With Friends': Styles.images.iJournal.questions.withFriends,
}

// change all bottom button heights to 48 [ iPrompt, saveJournal, moodSelector ]
const { width: SCREEN_WIDTH } = Dimensions.get('screen')
const { useState, useEffect, createRef } = React
const iJournalWriteScreen: React.FC<iJournalWriteScreenProps> = ({
  navigation,
}) => {
  const t = useI18n('iJournalWrite')
  const firebase = useFirebase()
  const firestore = useFirestore()
  const calendarRef = createRef()
  const editRef = createRef()
  const dispatch = useDispatch()
  const privateOrSharedToolTipRef = createRef()
  const insets = useSafeAreaInsets()

  const { profile = null } = useSelector((state: any) => state.firebase)

  const themeTextHandler = (themeText: string) => {
    switch (themeText) {
      case 'Lovely Me':
        return Config.getLang() == 'ko' ? '아름다운 당신' : 'Lovely me'
      case 'Time Traveler’s Wish':
        return Config.getLang() == 'ko'
          ? '시간여행자의 소원'
          : 'Time Traveler’s Wish'
      case 'Game Nights':
        return Config.getLang() == 'ko' ? '게임파티 하자' : 'Game Nights'
      case 'Top Secret':
        return Config.getLang() == 'ko' ? '쉿, 이건 비밀' : 'Top Secret'
      case 'With Friends':
        return Config.getLang() == 'ko' ? '친구와 함께' : 'With Friends'
      default:
        return 'MESSED UP SOMEWHERE'
    }
  }

  const selectedDate = useSelector((state: any) => state.journal.selectedDate)

  const todayJournal = useSelector((state) => {
    const userJournals = state.firestore.ordered.journals
    return _.find(userJournals, {
      yearMonthDate: selectedDate,
    })
  })

  const [iPromptModalVisible, setiPromptModalVisible] = useState(false)
  const [loadSave, setLoadSave] = useState(false)
  const [moodModalVisible, setMoodModalVisible] = useState(false)
  const [selectedMood, setSelectedMood] = useState('')
  const [modalMoodSelector, setModalMoodSelector] = useState<any>(null)
  const [themesExpand, setThemesExpand] = useState<boolean>(false)
  const [questionsExpand, setQuestionsExpand] = useState<boolean>(false)
  const [themeSelected, setThemeSelected] = useState(null)
  const [title, setTitle] = useState('')
  const [entry, setEntry] = useState('')
  const [isShared, setIsShared] = useState(false)
  const [moodMorning, setMoodMorning] = useState<any>(null)
  const [moodAfternoon, setMoodAfternoon] = useState<any>(null)
  const [moodEvening, setMoodEvening] = useState<any>(null)
  const [docId, setDocId] = useState('')
  const [yearMonthDate, setYearMonthDate] = useState(null)
  const [complete, setComplete] = useState(false)
  const [confirmShared, setConfirmShared] = useState(false)

  useEffect(() => {
    setTitle(todayJournal?.title ?? '')
    setEntry(todayJournal?.entry ?? '')
    setIsShared(todayJournal?.isShared ?? false)
    setMoodMorning(todayJournal?.moodMorning ?? null)
    setMoodAfternoon(todayJournal?.moodAfternoon ?? null)
    setMoodEvening(todayJournal?.moodEvening ?? null)
    setDocId(todayJournal?.docId ?? '')
    setComplete(todayJournal?.complete ?? false)
    setThemeSelected(todayJournal?.theme ?? null)

    setYearMonthDate(selectedDate)
    Log.debug('iJournalWriteScreen: useeffect: todayJournal =', todayJournal)
  }, [selectedDate])

  const handleiPromptModalVisible = (openOrClose) => {
    setiPromptModalVisible(!iPromptModalVisible)
    setThemesExpand(openOrClose == 'open' ? true : false)
  }

  const handleSaveEntry = async (backOrSave: boolean) => {
    const journalPkg = {
      moodMorning,
      moodAfternoon,
      moodEvening,
      title,
      entry,
      isShared,
      theme: themeSelected,
      readBy: [],
      uid: firebase.auth().currentUser.uid,
      yearMonthDate: yearMonthDate
        ? yearMonthDate
        : dayjs().format('YYYY-MM-DD'),
      docId: docId ? docId : firestore.collection('journals').doc().id,
      updatedAt: firestore.FieldValue.serverTimestamp(),
      complete: complete ? complete : backOrSave,
    }

    const ref = firestore.collection('journals').doc(journalPkg.docId)
    try {
      // 1. check if there is a journal stored at this date
      //  if not set it in firestore
      if (todayJournal === undefined) {
        // if (!docId) {
        journalPkg.createdAt = firestore.FieldValue.serverTimestamp()
        await ref.set(journalPkg)
        // 2. if there is such journal at date update
        // updates if there is journal
      } else ref.update(journalPkg)
      navigation.goBack()
    } catch (error) {
    } finally {
      setLoadSave(false)
    }
  }

  const ConfirmSharedEntryOverlay = ({ visible, saveFunc, closeFunc }: any) => {
    return (
      <Overlay
        visible={visible}
        p="xl"
        rounded="xl"
        pt="xl"
        w={279}
        h={200}
        justifyContent="center">
        <Div>
          <GDFontText fontSize="xl" textAlign="center" textWeight="bold">
            {'일기 공유하기'}
          </GDFontText>
          <Div p="sm" />
          <Text textAlign="center">
            {`일기를 공유하면 제3자(치료기관 및 상담사)\n에게 내용이 공유됩니다.\n동의하시겠습니까?`}
          </Text>
          <Div p="md" />
          <Div row>
            <Div flex={1} />
            <Button
              bg="transparent"
              flex={1}
              onPress={closeFunc}
              justifyContent="flex-end"
              alignItems="flex-end">
              <GDFontText fontSize="lg" textWeight="bold" color="gray600">
                취소
              </GDFontText>
            </Button>
            <Button
              bg="transparent"
              flex={1}
              onPress={saveFunc}
              justifyContent="flex-start"
              alignItems="flex-start">
              <GDFontText
                fontSize="lg"
                textWeight="bold"
                color="main900"
                textAlign="right">
                확인
              </GDFontText>
            </Button>
            <Div flex={1} />
          </Div>
        </Div>
      </Overlay>
    )
  }

  const handleEditButton = () => editRef.current.open()

  const handleDeleteEntry = () => {
    const ref = firestore.collection('journals').doc(docId)
    ref.delete()
    navigation.goBack()
  }

  // const handleSharedRadioButtonPressed = (bool: boolean) => setIsShared(bool)

  const handleMoods = (moodNum: number) =>
    Styles.images.emoji[`m${moodNum?.toString()}`] ||
    Styles.images.emoji.default

  const handleMoodModalVisible = (mood: any) => {
    setMoodModalVisible(!moodModalVisible)
    setSelectedMood(mood)
    switch (mood) {
      case 'morning':
        setMoodMorning(3)
        setModalMoodSelector(moodMorning)
        break
      case 'afternoon':
        setMoodAfternoon(3)
        setModalMoodSelector(moodAfternoon)
        break
      case 'evening':
        setMoodEvening(3)
        setModalMoodSelector(moodEvening)
        break
      default:
        setModalMoodSelector(null)
        break
    }
  }

  // isVisible={moodModalVisible}
  // mood={selectedMood}
  // defaultVal={3}
  // const MoodModal: React.FC<MoodModalProps> = ({
  //   isVisible,
  //   mood,
  //   defaultVal,
  // }) => (
  //   <Modal visible={isVisible} transparent>
  const MoodModal = (
    // <Modal
    //   visible={moodModalVisible}
    //   style={{ backgroundColor: 'transparent' }}>
    <MNModal isVisible={moodModalVisible} bg="transparent">
      <Div
        top={insets.top - 20}
        flex={1}
        roundedTop="2xl"
        alignItems="flex-start"
        justifyContent="flex-end">
        <Div
          zIndex={10}
          opacity={1}
          w={SCREEN_WIDTH}
          bg="white"
          rounded="xl"
          p={20}>
          <Div alignItems="center" justifyContent="center">
            <Div mb="md" w={SCREEN_WIDTH}>
              <TouchableOpacity
                style={{
                  height: 20,
                }}
                onPress={handleMoodModalVisible}>
                <Div
                  borderWidth={3}
                  mx={150}
                  borderColor="gray300"
                  rounded="circle"
                />
              </TouchableOpacity>
            </Div>
            <Div p="md" />
            <GDFontText textWeight="bold" fontSize="2xl">
              점심 기분 선택하기
            </GDFontText>
          </Div>
          <Div alignItems="center" justifyContent="center" m={25}>
            <Image
              source={handleMoods(modalMoodSelector ? modalMoodSelector : 3)}
              h={75}
              w={75}
            />
          </Div>
          <Slider
            // minimumTrackTintColor={Styles.colors.grayscale.blackGray}
            minimumTrackTintColor={
              Styles.colors.journalColors[
                modalMoodSelector ? modalMoodSelector - 1 : 2
              ]
            }
            minimumValue={1}
            maximumValue={5}
            step={1}
            value={modalMoodSelector ? modalMoodSelector : 3}
            onValueChange={setModalMoodSelector}
          />
          <Div p="sm" />
          <Button
            bg="main900"
            mt="lg"
            rounded="circle"
            block
            h={50}
            onPress={() => {
              // setModalMoodSelector(moodVal)
              // moodVal = null
              handleMoodModalVisible(null)
              if (!modalMoodSelector) {
                // Log.debug('going in here from no selection')
                if (selectedMood == 'morning') setMoodMorning(3)
                if (selectedMood == 'afternoon') setMoodAfternoon(3)
                if (selectedMood == 'evening') setMoodEvening(3)
                return
              }
              if (selectedMood == 'morning') setMoodMorning(modalMoodSelector)
              if (selectedMood == 'afternoon')
                setMoodAfternoon(modalMoodSelector)
              if (selectedMood == 'evening') setMoodEvening(modalMoodSelector)
              else return
            }}>
            선택완료
          </Button>
        </Div>
      </Div>
    </MNModal>
  )

  const handleChoosePrompt = (userChoice: string) => {
    setTitle(userChoice)
    setiPromptModalVisible(!iPromptModalVisible)
    // setThemeSelected(null)
    setQuestionsExpand(!questionsExpand)
  }

  // const ThemeModal = ({ isVisible }) => {
  //   return (
  //     <Modal visible={isVisible} transparent>
  const ThemeModal = (
    <MNModal isVisible={iPromptModalVisible} bg="transparent">
      <Div
        top={insets.top - 20}
        rounded="2xl"
        // bg="rgba(0,0,0,0.7)"
        flex={1}
        alignItems="flex-start"
        justifyContent="flex-end">
        <Div
          p={20}
          h={'87%'}
          w={SCREEN_WIDTH}
          bg="white"
          rounded="xl"
          alignItems="center">
          <Div mb="md" w={SCREEN_WIDTH}>
            <TouchableOpacity
              style={{
                height: 20,
              }}
              onPress={() => handleiPromptModalVisible('close')}>
              <Div
                borderWidth={3}
                mx={150}
                borderColor="gray300"
                rounded="circle"
              />
            </TouchableOpacity>
            <Header p="lg" shadow={0} alignment="center">
              <GDFontText fontSize="2xl" textWeight="bold">
                {'i생각카드 선택하기'}
              </GDFontText>
            </Header>
          </Div>
          <Div
            mx="sm"
            row
            justifyContent="space-between"
            borderTopWidth={1}
            borderBottomWidth={1}
            borderColor="gray200"
            h={52}
            w={SCREEN_WIDTH - 25}
            p="lg">
            <Div alignItems="center">
              <GDFontText fontSize="lg" textWeight="bold">
                {'1. 테마를 선택해주세요.'}
              </GDFontText>
            </Div>
            <Button
              alignItems="center"
              p={0}
              onPress={() => setThemesExpand(!themesExpand)}
              bg="transparent">
              <Icon
                color="black"
                fontFamily="Entypo"
                name={themesExpand ? 'minus' : 'plus'}
                fontSize="3xl"
              />
            </Button>
          </Div>
          <Div p="sm" />
          {themesExpand && (
            <Div
              flex={1}
              row
              flexWrap="wrap"
              borderBottomWidth={1}
              borderBottomColor="gray200">
              {Object.keys(iPromptThemes[Config.getLang()]).map(
                (iPromptTheme, i) => {
                  // Log.debug(iPromptTheme)
                  return (
                    <Div w="32%" key={String(i)} p="sm">
                      <Button
                        borderWidth={themeSelected == iPromptTheme ? 2.5 : 0}
                        borderColor="main900"
                        h={104}
                        rounded="xl"
                        w="100%"
                        bg={
                          themeSelected == iPromptTheme
                            ? 'rgba(79, 209, 197, 0.1)'
                            : 'gray100'
                        }
                        p={0}
                        onPress={() => {
                          setThemeSelected(iPromptTheme)
                          setTitle(
                            iPromptThemes[Config.getLang()][themeSelected][0],
                          )
                          setTimeout(() => {
                            setThemesExpand(false)
                            setQuestionsExpand(true)
                          }, 300)
                        }}>
                        <Div justifyContent="center" alignItems="center">
                          <Image
                            source={themeIcons[i]}
                            h={50}
                            w={50}
                            resizeMode="contain"
                          />
                        </Div>
                      </Button>
                      <Div p="sm" />
                      <Div>
                        <Text textAlign="center">
                          {themeTextHandler(iPromptTheme)}
                        </Text>
                      </Div>
                    </Div>
                  )
                },
              )}
            </Div>
          )}
          <Div
            row
            justifyContent="space-between"
            borderTopWidth={!questionsExpand ? 1 : 0}
            // borderTopWidth={1}
            borderBottomWidth={1}
            borderColor="gray200"
            p="lg"
            w={SCREEN_WIDTH - 25}>
            <GDFontText fontSize="lg" textWeight="bold">
              2. 질문을 선택해주세요.
            </GDFontText>
            <TouchableOpacity
              disabled={questionsExpand}
              onPress={() => {
                questionsExpand
                  ? setQuestionsExpand(true)
                  : setThemesExpand(false)
                setTitle(iPromptThemes[Config.getLang()][themeSelected][0])
              }}>
              <Icon
                color="black"
                fontFamily="Entypo"
                name={!themesExpand ? 'minus' : 'plus'}
                fontSize="3xl"
              />
            </TouchableOpacity>
          </Div>
          {questionsExpand && themeSelected && !themesExpand && (
            <Div flex={1}>
              <Div p="sm" />
              <ScrollView
                // onScroll={(e) => {
                //   Log.debug('somethin ghappening')
                // }}
                scrollEventThrottle={16}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                horizontal
                decelerationRate={0}
                // snapToInterval={SCREEN_WIDTH - 100}
                snapToAlignment={'center'}>
                <Radio.Group
                  onChange={(selection) => setTitle(selection)}
                  row
                  defaultValue={
                    iPromptThemes[Config.getLang()][themeSelected][0]
                  }>
                  {iPromptThemes[Config.getLang()][themeSelected].map(
                    (titleQuestion: string, i: number) => {
                      return (
                        <Radio
                          key={String(i)}
                          value={titleQuestion}
                          shadow="lg"
                          shadowColor="#C4C4C4"
                          m="sm"
                          h={304}
                          w={247}
                          rounded="2xl">
                          {({ checked }) => (
                            <Div opacity={checked ? 1 : 0.6} flex={1}>
                              <Div
                                justifyContent="center"
                                alignItems="center"
                                borderColor="white"
                                borderWidth={0}
                                top={15}
                                left={15}
                                bg="white"
                                position="absolute"
                                zIndex={100}
                                h={24}
                                w={24}
                                rounded="circle">
                                {checked && (
                                  <Icon
                                    fontFamily="MaterialCommunityIcons"
                                    name="check-bold"
                                    fontSize="2xl"
                                    color="main900"
                                  />
                                )}
                              </Div>
                              <Image
                                resizeMode="contain"
                                resizeMethod="auto"
                                source={questionPics[themeSelected]}
                                w={'100%'}
                                h={187}
                              />
                              <Div
                                p="lg"
                                bg="#FAFAFA"
                                roundedBottom="xl"
                                flex={1}>
                                <Text lineHeight={18}>
                                  <GDFontText
                                    fontSize="lg"
                                    textWeight="500">{`Q${
                                    i + 1
                                  }. `}</GDFontText>
                                  {titleQuestion}
                                </Text>
                              </Div>
                            </Div>
                          )}
                        </Radio>
                      )
                    },
                  )}
                </Radio.Group>
              </ScrollView>
            </Div>
          )}
          <Div p="lg" />
          <Button
            h={50}
            mb="md"
            onPress={() => handleChoosePrompt(title)}
            block
            rounded="circle"
            bg="main900">
            <Text color="white" fontSize="xl">
              선택완료
            </Text>
          </Button>
        </Div>
      </Div>
    </MNModal>
  )

  const CalendarViewer = () => {
    // Make the button rounded on bottom.
    return (
      <Dropdown
        ref={calendarRef}
        title={
          <Text
            mx="xl"
            color="gray900"
            pb="md"
            fontSize="3xl"
            textAlign="center">
            Calendar
          </Text>
        }
        w={'100%'}
        showSwipeIndicator={true}
        roundedTop="xl">
        <Div w="100%" p="xl" justifyContent="center">
          <Calendar
            // Initially visible month. Default = Date()
            current={selectedDate}
            // Minimum date that can be selected, dates before minDate will be grayed out. Default = undefined
            // minDate={'2012-05-10'}
            // Maximum date that can be selected, dates after maxDate will be grayed out. Default = undefined
            // maxDate={'2012-05-30'}
            // Handler which gets executed on day press. Default = undefined
            onDayPress={({ dateString }: any) => {
              Log.debug(selectedDate)
              dispatch(selectDateToView(dateString))
              Log.debug(selectedDate)
            }}
            // // Handler which gets executed on day long press. Default = undefined
            // onDayLongPress={(day) => {
            //   console.log('selected day', day)
            // }}
            // // Month format in calendar title. Formatting values: http://arshaw.com/xdate/#Formatting
            // monthFormat={'yyyy MM'}
            // // Handler which gets executed when visible month changes in calendar. Default = undefined
            // onMonthChange={(month) => {
            //   console.log('month changed', month)
            // }}
            // // Hide month navigation arrows. Default = false
            // hideArrows={true}
            // // Replace default arrows with custom ones (direction can be 'left' or 'right')
            // // renderArrow={(direction) => <Arrow />}
            // // Do not show days of other months in month page. Default = false
            // hideExtraDays={true}
            // // If hideArrows=false and hideExtraDays=false do not switch month when tapping on greyed out
            // // day from another month that is visible in calendar page. Default = false
            // disableMonthChange={true}
            // // If firstDay=1 week starts from Monday. Note that dayNames and dayNamesShort should still start from Sunday.
            // firstDay={1}
            // // Hide day names. Default = false
            // hideDayNames={true}
            // // Show week numbers to the left. Default = false
            // showWeekNumbers={true}
            // // Handler which gets executed when press arrow icon left. It receive a callback can go back month
            // // onPressArrowLeft={(subtractMonth) => subtractMonth()}
            // // Handler which gets executed when press arrow icon right. It receive a callback can go next month
            // // onPressArrowRight={(addMonth) => addMonth()}
            // // Disable left arrow. Default = false
            // disableArrowLeft={true}
            // // Disable right arrow. Default = false
            // disableArrowRight={true}
            // // Disable all touch events for disabled days. can be override with disableTouchEvent in markedDates
            // disableAllTouchEventsForDisabledDays={true}
            // // Replace default month and year title with custom one. the function receive a date as parameter.
            // renderHeader={(date) => () => Log.debug(date)}
            // // Enable the option to swipe between months. Default = false
            // enableSwipeMonths={true}
          />
          <Button block bg={Styles.colors.client.main}>
            <Text color={Styles.colors.text.light}>SELECTION WEEK</Text>
          </Button>
        </Div>
      </Dropdown>
    )
  }

  const EditViewer = ({}) => (
    <Dropdown
      ref={editRef}
      w={'100%'}
      showSwipeIndicator={true}
      roundedTop="xl">
      <Div>
        <TouchableOpacity onPress={() => Log.debug('edit function')}>
          <Div p="lg">
            <GDFontText textAlign="center" textWeight="bold" fontSize="xl">
              {t.editEntry}
            </GDFontText>
          </Div>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleDeleteEntry}>
          <Div p="lg">
            <GDFontText textAlign="center" textWeight="bold" fontSize="xl">
              {t.deleteEntry}
            </GDFontText>
          </Div>
        </TouchableOpacity>
      </Div>
    </Dropdown>
  )

  return (
    <>
      {MoodModal}
      {ThemeModal}
      <CalendarViewer />
      <EditViewer />
      <ConfirmSharedEntryOverlay
        visible={confirmShared}
        saveFunc={() => handleSaveEntry(true)}
        closeFunc={() => setConfirmShared(false)}
      />
      <Div
        bg="white"
        pt={insets.top}
        style={{
          flex: 1,
        }}>
        <Header
          shadow="none"
          borderTopWidth={0}
          alignment="center"
          borderBottomWidth={1.5}
          borderBottomColor="gray300"
          prefix={
            <Button
              bg="transparent"
              onPress={() => {
                handleSaveEntry(false)
                // navigation.goBack()
              }}>
              <Icon
                name="arrow-back-ios"
                fontFamily="MaterialIcons"
                fontSize="3xl"
                color="gray900"
              />
            </Button>
          }
          suffix={
            <Button bg="transparent" onPress={handleEditButton}>
              <Icon
                name="more-vertical"
                fontFamily="Feather"
                fontSize="3xl"
                color="black"
              />
            </Button>
          }>
          <Text fontSize="2xl">{'i일기쓰기'}</Text>
        </Header>
        <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
          <Div flex={1} bg={Styles.colors.background.light} px="lg">
            <Div
              row
              h={50}
              alignItems={'center'}
              mr="lg"
              justifyContent="space-between">
              <GDFontText fontSize="2xl" textWeight="700">
                {dayjs(selectedDate).format('YYYY.MM.DD')}
              </GDFontText>
              <Div alignItems="center">
                <TouchableOpacity onPress={() => calendarRef.current.open()}>
                  <Icon
                    fontFamily="MaterialCommunityIcons"
                    name="calendar"
                    color="black"
                    fontSize="4xl"
                  />
                </TouchableOpacity>
              </Div>
            </Div>
            <Div p="xs" />
            <Div>
              <GDFontText textWeight="bold" fontSize="3xl">
                {profile.nickname}
                {t.howWasYourDay}
              </GDFontText>
            </Div>
            <Div p="lg" />
            <Div
              mx="xl"
              bg="gray150"
              h={100}
              w="95%"
              alignSelf="center"
              rounded="2xl"
              row
              justifyContent={'space-around'}
              pl={70}
              pr={70}>
              <TouchableOpacity
                onPress={() => handleMoodModalVisible('morning')}
                style={styles.moodButtons}>
                <Image source={handleMoods(moodMorning)} h={45} w={45} />
                <Text pt="md">{t.morning}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleMoodModalVisible('afternoon')}
                style={styles.moodButtons}>
                <Image source={handleMoods(moodAfternoon)} h={45} w={45} />
                <Text pt="md">{t.afternoon}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleMoodModalVisible('evening')}
                style={styles.moodButtons}>
                <Image source={handleMoods(moodEvening)} h={45} w={45} />
                <Text pt="md">{t.evening}</Text>
              </TouchableOpacity>
            </Div>
            <Div p="sm" />
            <KeyboardAvoidingView
              behavior="position"
              keyboardVerticalOffset={Platform.OS === 'ios' ? 30 : 0}>
              <Div row pt={10} bg="white">
                <GDFontText fontSize="3xl" textWeight="bold">
                  {t.titleOfTheDay}
                </GDFontText>
                <TouchableOpacity
                  style={styles.iPromptButton}
                  onPress={() => handleiPromptModalVisible('open')}>
                  <Div
                    justifyContent="center"
                    alignItems="center"
                    borderWidth={1}
                    rounded="xl"
                    borderColor="system900"
                    px="lg"
                    row>
                    <Icon
                      mr="xs"
                      fontSize="2xl"
                      fontFamily="MaterialIcons"
                      name="folder-special"
                      color="system900"
                    />
                    <Text color="system900" fontSize="md">
                      {t.iPromptCardUse}
                    </Text>
                  </Div>
                </TouchableOpacity>
              </Div>
              <Div bg="white">
                <Input
                  fontSize="lg"
                  borderBottomColor="gray250"
                  multiline
                  borderTopWidth={0}
                  borderLeftWidth={0}
                  borderRightWidth={0}
                  focusBorderColor="main900"
                  value={title}
                  onChangeText={setTitle}
                />
              </Div>

              <Div p="lg" bg="white" />

              <Div bg="white">
                <GDFontText textWeight="bold" fontSize="3xl">
                  {t.entryOfTheDay}
                </GDFontText>
                <Div p="sm" />

                <TextInput
                  // onFocus={() => Log.debug('something')}
                  multiline={true}
                  numberOfLines={30}
                  value={entry}
                  onChangeText={setEntry}
                  style={[
                    styles.journalEntry,
                    {
                      borderColor: Styles.colors.grayscale.lightGray,
                    },
                  ]}
                />
              </Div>
            </KeyboardAvoidingView>

            <Div p="lg" />
            <Div row>
              <GDFontText textWeight="700" fontSize="2xl">
                {t.doYouWantToShare}{' '}
              </GDFontText>
              <Tooltip
                ref={privateOrSharedToolTipRef}
                rounded="xl"
                bg="gray100"
                color="gray700"
                text={
                  '일기를 공유하면 제 3자(치료기관 및\n상담사 등 에게) 내용이 공유 됩니다.'
                }>
                <TouchableOpacity
                  onPress={() => {
                    if (privateOrSharedToolTipRef.current)
                      privateOrSharedToolTipRef.current.show()
                  }}>
                  <Icon
                    fontFamily="AntDesign"
                    name="questioncircle"
                    fontSize="2xl"
                    color="gray300"
                  />
                </TouchableOpacity>
              </Tooltip>
            </Div>
            <Div p="lg" />

            <Radio.Group
              onChange={(val) => {
                if (val == t.noToShared) setIsShared(false)
                else setIsShared(true)
              }}
              row
              flex={1}
              justifyContent="flex-start"
              defaultValue={t.noToShared}>
              {[t.noToShared, t.yesToShared].map((option, idx) => {
                return (
                  <Radio
                    value={option}
                    key={String(idx)}
                    flex={1}
                    justifyContent="center"
                    alignItems="center">
                    {({ checked }) => (
                      <Div
                        flex={1}
                        row
                        justifyContent="flex-start"
                        alignItems="flex-start">
                        <Icon
                          alignSelf="center"
                          color="black"
                          pr="md"
                          fontSize="3xl"
                          fontFamily="MaterialIcons"
                          name={
                            checked ? 'check-circle' : 'radio-button-unchecked'
                          }
                        />
                        <Text fontSize="2xl">{option}</Text>
                      </Div>
                    )}
                  </Radio>
                )
              })}
              <Div flex={1} />
            </Radio.Group>
            <Div p="lg" />
          </Div>
        </ScrollView>
        <Div p="lg" mb="lg">
          <Button
            onPress={() => {
              if (isShared) {
                // Log.debug('this is a public entry')
                setConfirmShared(true)
                return
              }
              handleSaveEntry(true)
            }}
            loading={loadSave}
            block
            bg="main900"
            p="lg"
            color="white"
            rounded="circle"
            mt="lg">
            {t.saveEntry}
          </Button>
        </Div>
      </Div>
    </>
  )
}

const styles = StyleSheet.create({
  moodButtons: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  iPromptButton: {
    height: 25,
    backgroundColor: 'transparent',
    borderRadius: 15,
    width: 100,
    justifyContent: 'center',
    alignItems: 'center',
    left: 5,
  },
  journalEntry: {
    color: 'black',
    textAlignVertical: 'top',
    height: 300,
    width: '100%',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    paddingTop: 10,
  },
})

export default iJournalWriteScreen
