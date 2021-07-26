// NEED TO FIX FONTS
import * as React from 'react'
import { FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native'
import {
  Div,
  Text,
  Icon,
  Button,
  Radio,
  Image,
  Dropdown,
} from 'react-native-magnus'
import dayjs from 'dayjs'
import _, { filter } from 'lodash'
// react-navigation
import {
  NavigationParams,
  NavigationScreenProp,
  NavigationState,
} from 'react-navigation'
import { useIsFocused } from '@react-navigation/native'

import Styles from '../util/Styles'
import Log from '../util/Log'
import screens from '../navigation/screens'
import stacks from '../navigation/stacks'
import { GDHeader, GDJournalHeader, GDFontText } from '../components'
import { useI18n } from '../hooks'
import { selectDateToView } from '../redux/Journal/JournalActions'

import {
  useFirebase,
  useFirestore,
  useFirestoreConnect,
} from 'react-redux-firebase'
import { useSelector, useDispatch } from 'react-redux'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

interface iJournalOverviewScreenProps {
  navigation: NavigationScreenProp<NavigationState, NavigationParams>
}

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
}

const { useEffect, useState, createRef } = React
const iJournalOverviewScreen: React.FC<iJournalOverviewScreenProps> = ({
  navigation,
}) => {
  const insets = useSafeAreaInsets()

  const t = useI18n('iJournalOverview')
  const editDropdownRef = createRef()
  const [writtenJournalsList, setWrittenJournalsList] = useState<any[]>([])
  const [selectWrittenJournals, setSelectWrittenJournals] = useState(true)
  const [selectMissedJournals, setSelectMissedJournals] = useState(false)
  const [missedJournalList, setMissedJournalsList] = useState<any[]>([])
  const [journalsToDelete, setJournalsToDelete] = useState<String[]>([])
  const [journalsToShow, setJournalsToShow] = useState([])
  const [showEdit, setShowEdit] = useState(false)
  const [showDeleteSelector, setShowDeleteSelector] = useState<boolean>(false)

  const firebase = useFirebase()
  const firestore = useFirestore()
  const isFocused = useIsFocused()
  const profile = useSelector((state: any) => state.firebase.profile)
  const userJournals = useSelector(
    (state: any) => state.firestore.ordered.journals,
  )
  const selectedDate = useSelector((state: any) => state.journal.selectedDate)
  const dispatch = useDispatch()

  useFirestoreConnect([
    {
      collection: 'journals',
      where: [
        ['uid', '==', firebase.auth()?.currentUser?.uid ?? null],
        // ['yearMonthDate', '<=', dayjs().format('YYYY-MM-DD')],
        // [
        //   'yearMonthDate',
        //   '>=',
        //   dayjs().subtract(14, 'days').format('YYYY-MM-DD'),
        // ],
      ],
      orderBy: [['yearMonthDate', 'desc']],
      // limit: 5,
    },
  ])

  const handleJournalPressed = async (yearMonthDate: string) => {
    await dispatch(selectDateToView(yearMonthDate))
    await Log.debug('handleJournalPressed: call to redux:', selectedDate)
    // await navigation.navigate(screens.iJOURNAL, { yearMonthDate, journal })
    await navigation.navigate(stacks.iJOURNAL_ACTIONS_STACK)
  }

  const handleMoods = (moodNum: number) =>
    Styles.images.emoji[`m${moodNum?.toString()}`] ||
    Styles.images.emoji.default

  useEffect(() => {
    // Log.debug('iJournalOverviewScreen: useEffect: journalRedux:', selectedDate)
    userJournals &&
      (selectWrittenJournals
        ? setJournalsToShow(userJournals.filter((journal) => journal.complete))
        : setJournalsToShow(
            userJournals.filter((journal) => !journal.complete),
          ))
  }, [isFocused, userJournals])

  const handleWriteJournal = () =>
    navigation.navigate(stacks.iJOURNAL_ACTIONS_STACK)

  const handleGoToWeeklyMoodChart = () => {
    navigation.navigate(screens.iJOURNAL_WEEKLY_MOOD_CHART, {
      fromDate: dayjs().format('YYYY-MM-DD'),
    })
  }

  const handlePushOrRemoveJournalToDelete = (docId: string) =>
    !journalsToDelete.includes(docId)
      ? setJournalsToDelete([...journalsToDelete, docId])
      : setJournalsToDelete(journalsToDelete.filter((val) => val != docId))

  const handleDeleteOfJournals = () => {
    setShowEdit(!showEdit)
    // only if true. this will delete array of docIds
    showEdit &&
      journalsToDelete.map((docId) => {
        const journalRef = firestore.collection('journals').doc(docId)
        journalRef.delete()
      })
  }

  const handleJournalsToShow = () => {
    setSelectMissedJournals(!selectMissedJournals)
    setSelectWrittenJournals(!selectWrittenJournals)
  }

  const EditDropdown = () => (
    <Dropdown
      ref={editDropdownRef}
      w={'100%'}
      showSwipeIndicator={true}
      roundedTop="xl">
      <Div>
        <TouchableOpacity onPress={() => setShowEdit(!showEdit)}>
          <Div p="lg">
            <GDFontText textAlign="center" textWeight="bold" fontSize="xl">
              {t.editEntry}
            </GDFontText>
          </Div>
        </TouchableOpacity>
      </Div>
    </Dropdown>
  )

  const JournalInfoBlock = ({ data }: JournalInfoData) => {
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
    const yearMonth = yearMonthDate.substring(0, 7)
    const day = yearMonthDate.substring(8, 10)

    return (
      <>
        {showEdit ? (
          <Radio
            value={docId}
            position={'absolute'}
            top={40}
            pl="xs"
            checked={journalsToDelete.includes(docId)}
            onChange={handlePushOrRemoveJournalToDelete}
            zIndex={10}
            activeColor={Styles.colors.grayscale.blackGray}>
            <Div />
          </Radio>
        ) : null}
        <TouchableOpacity onPress={() => handleJournalPressed(yearMonthDate)}>
          <Div
            left={showEdit ? 10 : 0}
            mx="xl"
            h={100}
            m="sm"
            p="sm"
            rounded="xl"
            bg="gray100"
            row>
            <Div flex={2} justifyContent="center" alignItems="center">
              <Text>{yearMonth}</Text>
              <GDFontText fontSize="6xl" textWeight="bold">
                {day}
              </GDFontText>
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
              <Div row ml="xl" mt="md" alignItems="center">
                {theme && (
                  <Icon
                    fontFamily="MaterialCommunityIcons"
                    name="folder-star-outline"
                    color="system900"
                    fontSize="4xl"
                    mr="sm"
                  />
                )}
                <Text textAlign="left" numberOfLines={1} w="100%">
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
      </>
    )
  }

  return (
    <>
      <EditDropdown />
      <Div
        style={{ flex: 1, paddingTop: insets.top, backgroundColor: 'white' }}>
        <GDHeader
          shadow="none"
          alignment="center"
          fontWeight="bold"
          fontSize={18}
          lineHeight={26}
          prefix={
            !showEdit ? (
              <Button bg="transparent" onPress={() => navigation.goBack()}>
                <Icon
                  name="arrow-back-ios"
                  fontFamily="MaterialIcons"
                  fontSize="3xl"
                  color="gray900"
                />
              </Button>
            ) : (
              <TouchableOpacity
                style={{
                  paddingLeft: 8,
                }}
                onPress={() => {
                  journalsToDelete.length == 0
                    ? setJournalsToDelete(
                        userJournals.map(({ docId }) => docId),
                      )
                    : setJournalsToDelete([])
                }}>
                <Text>
                  {journalsToDelete.length == 0 ? t.selectAll : t.unselectAll}
                </Text>
              </TouchableOpacity>
            )
          }
          suffix={
            !showEdit ? (
              <Button
                bg="transparent"
                onPress={() => editDropdownRef.current.open()}>
                <Icon
                  color="black"
                  name="more-vertical"
                  fontFamily="Feather"
                  fontSize="3xl"
                />
              </Button>
            ) : (
              <Div row pr="sm">
                <TouchableOpacity
                  disabled={journalsToDelete.length == 0}
                  onPress={() =>
                    Alert.alert(t.confirmDeleteTitle, t.confirmDeleteText, [
                      {
                        text: t.cancel,
                        style: 'cancel',
                        onPress: () => {
                          setJournalsToDelete([])
                          setShowEdit(!showEdit)
                        },
                      },
                      {
                        text: t.delete,
                        style: 'destructive',
                        onPress: () => {
                          handleDeleteOfJournals()
                          setShowEdit(!showEdit)
                        },
                      },
                    ])
                  }>
                  <Text p="sm">{t.delete}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setShowEdit(!showEdit)}>
                  <Text p="sm">{t.cancel}</Text>
                </TouchableOpacity>
              </Div>
            )
          }>
          i일기쓰기
        </GDHeader>
        <Div borderBottomColor="gray300" borderBottomWidth={1}></Div>
        <Div pt="lg" flex={1} bg={Styles.colors.background.light}>
          <Div
            row
            mx="1%"
            h={50}
            alignItems={'center'}
            pl={10}
            pr={10}
            mr={10}
            justifyContent="space-between">
            <Text fontSize={18} fontFamily="Noto Sans KR Bold">
              {t.myWrittenJournalEntries}
            </Text>
            <Div row w={75} justifyContent="space-around" alignItems="center">
              <TouchableOpacity onPress={handleGoToWeeklyMoodChart}>
                <Icon
                  fontFamily="MaterialIcons"
                  name="bar-chart"
                  fontSize={28}
                  color="black"
                  style={{ transform: [{ scaleX: -1 }] }}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() =>
                  handleJournalPressed(dayjs().format('YYYY-MM-DD'))
                }>
                <Icon
                  fontFamily="MaterialIcons"
                  name="create"
                  fontSize={24}
                  color="black"
                />
              </TouchableOpacity>
            </Div>
          </Div>
          <Div mx="1%" row h={50} pl="md" alignItems="center">
            <Div row>
              <Div
                pb="md"
                borderBottomWidth={selectWrittenJournals ? 2 : 0}
                borderBottomColor="rgba(18,18,18,1)">
                <GDFontText
                  fontSize="xl"
                  color={selectWrittenJournals ? 'black' : 'gray500'}
                  textWeight={selectWrittenJournals ? 'bold' : '400'}
                  onPress={handleJournalsToShow}>
                  {t.selectAllJournals}
                </GDFontText>
              </Div>
              <Div
                pb="md"
                ml="lg"
                borderBottomWidth={selectMissedJournals ? 2 : 0}>
                <GDFontText
                  fontSize="xl"
                  color={selectMissedJournals ? 'black' : 'gray500'}
                  textWeight={selectMissedJournals ? 'bold' : '400'}
                  onPress={handleJournalsToShow}>
                  {' '}
                  {t.selectMissedJournals}
                </GDFontText>
              </Div>
            </Div>
          </Div>
          <Div flex={1}>
            {userJournals?.length == 0 ? (
              <Div
                pt={0}
                p={50}
                justifyContent="center"
                alignItems="center"
                flex={1}>
                <Image source={Styles.images.emoji.default} h={50} w={50} />
                <Div p="lg" />
                <GDFontText textAlign="center" fontSize="lg" textWeight="bold">
                  {t.noJournalsText}
                </GDFontText>
                <Div p="lg" />
                <Button
                  h={50}
                  alignSelf="center"
                  w="110%"
                  rounded="circle"
                  bg="main900"
                  onPress={() =>
                    handleJournalPressed(dayjs().format('YYYY-MM-DD'))
                  }>
                  <Text color="white" fontSize="lg">
                    {t.writeFirstJournal}
                  </Text>
                </Button>
              </Div>
            ) : (
              <FlatList
                bounces={false}
                showsVerticalScrollIndicator
                data={
                  userJournals
                    ? selectWrittenJournals
                      ? userJournals.filter((journal) => journal.complete)
                      : userJournals.filter((journal) => !journal.complete)
                    : []
                  // journalsToShow
                }
                renderItem={({ item }: any) => <JournalInfoBlock data={item} />}
                keyExtractor={(item: any) => item.yearMonthDate}
              />
            )}
          </Div>
        </Div>
      </Div>
    </>
  )
}

const styles = StyleSheet.create({})

export default iJournalOverviewScreen
