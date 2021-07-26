import * as React from 'react'
import {
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  Platform,
  StyleSheet,
  StatusBar,
} from 'react-native'
import {
  Div,
  Text,
  Button,
  Icon,
  Dropdown,
  Overlay,
  Modal,
  Image,
} from 'react-native-magnus'
// import dayjs from 'dayjs'
import stacks from '../navigation/stacks'
import DropDownPicker from 'react-native-dropdown-picker'
import { useI18n } from '../hooks'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { find } from 'lodash'

import Styles from '../util/Styles'
import Log from '../util/Log'
// import Styles from '../util/Styles'
// import screens from '../navigation/screens'
import {
  GDHeader,
  WellnessProductBox,
  GDActivityOverlay,
  GDFontText,
} from '../components'
import auth, { firebase } from '@react-native-firebase/auth'
// import { useIsFocused, useFocusEffect } from '@react-navigation/native'
import { useSelector, useDispatch } from 'react-redux'
import { useFirebase, useFirestore } from 'react-redux-firebase'
import {
  setVideoChatId,
  setAWHStart,
} from '../redux/WellnessTraining/WTActions'
import axios from 'axios'

const CLASS_TIMES = {
  MWFMorning: {
    label: 'MonWedFri Morning',
    value: 'MWFMorning',
    daysOfWeek: [1, 3, 5],
    endTime: '12:00',
    startTime: '10:00',
    title: '월,수,금 오전반',
    trainingLength: '12',
  },
  MWFNight: {
    label: 'MonWedFri Night',
    value: 'MWFNight',
    daysOfWeek: [1, 3, 5],
    endTime: '21:00',
    startTime: '19:00',
    title: '월,수,금 오후반',
    trainingLength: '12',
  },
  TThSMorning: {
    label: 'TuesThursSat Morning',
    value: 'TThSMorning',
    daysOfWeek: [2, 4, 6],
    endTime: '12:00',
    startTime: '10:00',
    title: '월,수,금 오후반',
    trainingLength: '12',
  },
  TThSEvening: {
    label: 'TuesThursSat Night',
    value: 'TThSNight',
    daysOfWeek: [2, 4, 6],
    endTime: '21:00',
    startTime: '19:00',
    title: '월,수,금 오후반',
    trainingLength: '12',
  },
}

interface iCareScreenProps {
  navigation: any
}

const { useEffect, useState, useRef, createRef } = React
const iCareScreen: React.FC<iCareScreenProps> = ({ navigation }) => {
  const firebase = useFirebase()
  const firestore = useFirestore()
  const dispatch = useDispatch()
  const profile = useSelector((state: any) => state.firebase.profile)
  const WT = useSelector((state) => state.WT)

  // const [showEditModal, setShowEditModal] = useState(false)
  // const [showSuccessDropdown, setShowSuccessDropdown] = useState(false)
  const insets = useSafeAreaInsets()
  const t = useI18n('iCare')
  const n = useI18n('wellnessNotes')
  const [classTime, setClassTime] = useState('')
  const [classData, setClassData] = useState({
    daysOfWeek: [],
    // startTime: '12:00',
    // endTime: '18:30',
    startTime: '',
    endTime: '',
    title: '',
    traningLength: '',
  })
  // const [videoChatId, setVideoChatId] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    Log.debug('icare screen: profile =', profile.selectedAWHClass)
    // Log.debug(profile)
    const selectedClass = CLASS_TIMES[profile.selectedAWHClass]
    Log.debug('icare screen: selectedClass =', selectedClass)

    // ************************************************************* dev tmp commented to hardcode awhclass
    // Log.debug('icare screen: profile =', profile.selectedAWHClass)
    // const selectedClass = CLASS_TIMES[profile.selectedAWHClass]
    // Log.debug('icare screen: selectedClass =', selectedClass)

    // 'MonWedFri Morning': {
    //   label: 'MonWedFri Morning',
    //   value: 'MWFMorning',
    //   daysOfWeek: [1, 3, 5],
    //   endTime: '12:00',
    //   startTime: '10:00',
    //   title: '웰니스 온라인 교육1',
    // },
    setClassData({
      daysOfWeek: selectedClass?.daysOfWeek,
      startTime: selectedClass?.startTime,
      endTime: selectedClass?.endTime,
      title: selectedClass?.title,
      traningLength: selectedClass?.trainingLength,
    })

    const getAwh = async () => {
      const functions = firebase.app().functions('asia-northeast3')
      const getAwhProgramsCallable = await functions.httpsCallable(
        'getAwhPrograms',
      )({ status: 'active' })
      try {
        const res = await axios.post(
          'https://asia-northeast3-gideb-firebase.cloudfunctions.net/getClassInfoByStatus',
          { status: 'active' },
        )

        Log.debug('new awh id fct: ', res.data[0])
        // const uid = await firebase.auth().currentUser.uid

        const { id, startDate } = find(getAwhProgramsCallable.data, {
          title: selectedClass.title,
        })
        Log.debug('this class =', id)
        dispatch(setVideoChatId(id))
        dispatch(setAWHStart(startDate))
        Log.debug('WT =', WT)
      } catch (error) {
        Log.error('error awh programs = ', error)
      } finally {
        setIsLoading(false)
      }
    }
    getAwh()
    return () => {
      // cleanup
    }
  }, [profile])

  // const isFocused = useIsFocused()

  const successDropdownRef = createRef()
  const editRef = useRef(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const tooltipRef = createRef()

  //AWHDATA DEV
  // awh programs =  [{
  //   "status":"register",
  //   "coach":{
  //     "displayName":"대니얼2",
  //     "uid":"w17ztHkIZNXqyBOXyXCbAPoN8Zy1",
  //     "photoURL":null},
  //     "daysOfWeek":[1,3,5],
  //     "endTime":"12:00",
  //     "id":"vF7o4dNumHyya9gQhVAE",
  //     "startTime":"10:00",
  //     "title":"웰니스 온라인 교육",
  //     "members":2,
  //     "traningLength":12
  //   }]

  const weekdays = ['일', '월', '화', '수', '목', '금', '토']

  const displayClassLabel = (c) => {
    return `${c.title} (${c?.daysOfWeek?.map((day) => weekdays[day])}) ${
      c.startTime
    }-${c.endTime}`
  }

  const computeClassLength = () => {
    if (classData?.startTime) {
      let time_start = parseInt(classData?.startTime?.replace(/:/gi, ''))
      let time_end = parseInt(classData?.endTime?.replace(/:/gi, ''))

      let tmp = (time_end - time_start) / 100

      let hours = `${Math.floor(tmp)}시간`
      let out = hours

      if (tmp % 1 !== 0)
        out += ` ${String(tmp)?.split('.')[1].padEnd(2, '0')}분`

      return out
    }
  }

  const augData = () => {
    // Log.debug(Object.keys(CLASS_TIMES))
    let out = Object.keys(CLASS_TIMES).map((time, idx) => ({
      label: displayClassLabel(CLASS_TIMES[time]),
      value: CLASS_TIMES[time].value,
    }))
    return out
  }

  return (
    <Div flex={1} bg="white" pt={insets.top}>
      {/* overlay for loading for activity indicator */}
      <GDActivityOverlay visible={isLoading} />

      <Modal isVisible={showEditModal} h="95%" roundedTop="2xl">
        <Div flex={1} px="lg" rounded="2xl">
          {/* <Dropdown  h="95%" ref={editRef} px="lg"> */}
          <Div alignSelf="flex-end">
            <TouchableOpacity onPress={() => setShowEditModal(false)}>
              <Icon
                fontFamily="MaterialCommunityIcons"
                name="close"
                fontSize="4xl"
                color="black"
                p="lg"
              />
            </TouchableOpacity>
          </Div>
          <Div alignItems="center" mb="2xl">
            <GDFontText textWeight="700" fontSize="3xl">
              {t.changeDay}
            </GDFontText>
          </Div>
          <ScrollView>
            <WellnessProductBox option={0} mode="small" buttonDisabled={true} />

            <Div row mt="lg">
              <Div flex={1}>
                <Image source={Styles.images.exclamationCircle} h={24} w={24} />
              </Div>
              <Div flex={9}>
                <Text color="gray500">{n.courseComplete}</Text>
              </Div>
            </Div>
            <Div
              bg="transparent"
              mt="2xl"
              style={
                Platform.OS !== 'android'
                  ? { zIndex: 4000 }
                  : { elevation: 4000 }
              }>
              <DropDownPicker
                items={augData()}
                placeholder={displayClassLabel(classData)}
                containerStyle={{
                  height: 60,
                  // marginBottom: 100
                }}
                style={{ backgroundColor: '#ffffff' }}
                dropDownStyle={{
                  backgroundColor: 'white',
                }}
                onChangeItem={(item) => {
                  Log.debug('onChangeItem: ', item)
                  setClassTime(item.value)
                }}
              />
              <Div mt="xl">
                <Button
                  style={{}}
                  onPress={() => {
                    //WIP**
                    firebase.updateProfile({ selectedAWHClass: classTime })
                    // editRef.current.close()
                    setShowEditModal(false)
                    successDropdownRef.current.open()
                  }}
                  bg="main900"
                  rounded="circle"
                  block
                  py="lg">
                  <Text py="xs" fontSize="lg" color="white">
                    {t.classChangeRequest}
                  </Text>
                </Button>
              </Div>
              <Div my="xl" alignSelf="center">
                <TouchableOpacity onPress={() => setShowEditModal(false)}>
                  <Text color="main900" fontSize="lg">
                    {t.cancel}
                  </Text>
                </TouchableOpacity>
              </Div>
            </Div>
            <Div pt="2xl" />
          </ScrollView>
        </Div>
      </Modal>
      <ScrollView bounces={false}>
        <GDHeader>{t.title}</GDHeader>
        <Div borderBottomWidth={1} borderBottomColor="gray200" />
        <Div px="lg">
          <Modal visible={showEditModal}>
            <Div rounded="2xl" flex={1} px="lg" h="90%">
              {/* <Dropdown rounded="2xl" h="95%" ref={editRef} px="lg"> */}
              <ScrollView>
                <Div alignItems="center" mb="2xl">
                  <GDFontText textWeight="700" fontSize="3xl">
                    {t.changeDay}
                  </GDFontText>
                </Div>
                <WellnessProductBox
                  option={0}
                  mode="small"
                  buttonDisabled={true}
                />

                <Div row mt="lg">
                  <Div flex={1}>
                    <Image
                      source={Styles.images.exclamationCircle}
                      h={24}
                      w={24}
                    />
                  </Div>
                  <Div flex={9}>
                    <Text color="gray500">{n.courseComplete}</Text>
                  </Div>
                </Div>
                <Div
                  bg="transparent"
                  mt="2xl"
                  style={
                    Platform.OS !== 'android'
                      ? { zIndex: 4000 }
                      : { elevation: 4000 }
                  }>
                  <DropDownPicker
                    items={augData()}
                    placeholder={displayClassLabel(classData)}
                    containerStyle={{
                      height: 60,
                      // marginBottom: 100
                    }}
                    style={{ backgroundColor: '#ffffff' }}
                    dropDownStyle={{
                      backgroundColor: 'white',
                    }}
                    onChangeItem={(item) => {
                      Log.debug('onChangeItem: ', item)
                      setClassTime(item.value)
                    }}
                  />
                  <Div mt="xl">
                    <Button
                      style={{}}
                      onPress={() => {
                        //WIP**
                        firebase.updateProfile({ selectedAWHClass: classTime })
                        // editRef.current.close()
                        setShowEditModal(false)
                        successDropdownRef.current.open()
                      }}
                      bg="main900"
                      rounded="circle"
                      block
                      py="lg">
                      <Text py="xs" fontSize="lg" color="white">
                        {t.classChangeRequest}
                      </Text>
                    </Button>
                  </Div>
                  <Div my="xl" alignSelf="center">
                    <TouchableOpacity onPress={() => setShowEditModal(false)}>
                      {/* <TouchableOpacity onPress={() => editRef.current.close()}> */}
                      <Text color="main900" fontSize="lg">
                        {t.cancel}
                      </Text>
                    </TouchableOpacity>
                  </Div>
                </Div>
                <Div pt="2xl" />
              </ScrollView>
            </Div>
          </Modal>
          <Dropdown
            ref={successDropdownRef}
            // visible={showSuccessDropdown}
            p="2xl"
            roundedTop="xl"
            title={
              <>
                <Div mt={-20} alignSelf="flex-end">
                  <TouchableOpacity
                    onPress={() => successDropdownRef.current.close()}>
                    <Icon
                      fontFamily="FontAwesome"
                      name="close"
                      fontSize="3xl"
                      color="dark"
                    />
                  </TouchableOpacity>
                </Div>
                <Div alignSelf="center" mt="xl" alignItems="center">
                  <GDFontText fontSize="2xl" textWeight="700">
                    {t.title}
                  </GDFontText>
                  <Text fontSize="xl" color="gray800" mt="xl">
                    {t.changeSuccess}
                  </Text>
                </Div>
                <Div mt="3xl" alignItems="center">
                  <Button
                    block
                    rounded="circle"
                    bg="main900"
                    onPress={() => successDropdownRef.current.close()}>
                    {t.goToClassButton}
                  </Button>
                  <Text
                    onPress={() => successDropdownRef.current.close()}
                    mt="xl"
                    py="md"
                    color="main900"
                    fontSize="lg">
                    {t.later}
                  </Text>
                </Div>
              </>
            }
          />

          <Div>
            <GDFontText fontSize="2xl" textWeight="700" my="lg">
              {t.subtitle}
            </GDFontText>
          </Div>
          <Div>
            <Div bg="gray150" rounded="2xl" p="xl">
              <Div row>
                <Div alignItems="center">
                  <GDFontText textWeight="700" fontSize="3xl" lineHeight={30}>
                    {classData.title}
                  </GDFontText>
                </Div>
                <Div justifyContent="center">
                  <Button
                    onPress={() => setShowEditModal(true)}
                    // onPress={() => editRef.current.open()}
                    mx="md"
                    py="xs"
                    px="lg"
                    rounded="circle"
                    fontSize="md">
                    {t.changeButton}
                  </Button>
                </Div>
                {/* <Tooltip
                  ref={tooltipRef}
                  text="담당자 확인 후 수강 확정이되면 진행
                  가능합니다."
                  // bg="background"
                  // color="dark5"
                >
                  <TouchableOpacity
                    onPress={() => {
                      if (tooltipRef.current) {
                        tooltipRef.current.show()
                      }
                    }}>
                    <Icon
                      fontFamily="SimpleLineIcons"
                      name="question"
                      fontSize="3xl"
                    />
                  </TouchableOpacity>
                </Tooltip> */}
              </Div>
              <Text color="gray500" fontSize="lg">
                {classData.traningLength}주 과정
              </Text>
              <Div mt="xl" row>
                <Text fontSize="lg">
                  {t.classDays}:{' '}
                  {/* {dayjs(()
                        .day(1)
                        .number(1)
                        .subtract(1, 'days')
                        .locale(Config.getLang())
                        .format('ddd'))} */}
                  {classData?.daysOfWeek?.map((day, i) => (
                    <Text key={String(i)} fontSize="lg">
                      {weekdays[day]}
                    </Text>
                  ))}
                </Text>
                <Text fontSize="lg"> (하루 {computeClassLength()})</Text>
              </Div>
              <Text fontSize="lg" mt="xs">
                {t.classTimes}: {classData.startTime} - {classData.endTime} 사이
              </Text>
              <Div row justifyContent="space-between" mt="2xl">
                <Button
                  bg="main900"
                  rounded="circle"
                  px="2xl"
                  w="50%"
                  disabled={isLoading}
                  onPress={() =>
                    navigation.navigate(stacks.WELLNESS_TRAINING_CONTENTS_STACK)
                  }>
                  {t.assignmentButton}
                </Button>
                <Button
                  bg="gray400"
                  rounded="circle"
                  px="2xl"
                  onPress={() =>
                    navigation.navigate(stacks.WELLNESS_TRAINING_CLASS_STACK)
                  }>
                  {t.waitingForClass}
                </Button>
              </Div>
            </Div>
          </Div>

          <Div mt="xl">
            <GDFontText textWeight="700" fontSize="lg">
              {t.waitingForClass}
            </GDFontText>
            <Div row>
              <Text color="gray500" fontSize="lg">
                :{' '}
              </Text>
              <Text color="gray500" fontSize="lg">
                {t.waitingForClassParagraph}
              </Text>
            </Div>
            <GDFontText textWeight="700" fontSize="lg" mt="lg">
              {t.confirmedButton}
            </GDFontText>
            <Div row>
              <Div alignItems="flex-start">
                <Text color="gray500" fontSize="lg">
                  :{' '}
                </Text>
              </Div>
              <Text color="gray500" fontSize="lg">
                {t.confirmedParagraph}
              </Text>
            </Div>
            <GDFontText textWeight="700" fontSize="lg" mt="lg">
              {t.startClass}
            </GDFontText>
            <Div row alignItems="flex-start">
              <Text color="gray500" fontSize="lg">
                :{' '}
              </Text>
              <Text color="gray500" fontSize="lg">
                {t.startClassParagraph}
              </Text>
            </Div>
          </Div>
          <Div row mt="3xl" pb="2xl">
            <Div flex={1}>
              <Image source={Styles.images.exclamationCircle} h={24} w={24} />
            </Div>
            <Div flex={9}>
              <Text color="gray500">{n.contactReEdu}</Text>
              <Text
                mt="sm"
                color="gray500"
                fontSize="md"
                textDecorLine="underline"
                textDecorColor="gray500">
                {n.kakaoCSLink}
              </Text>
            </Div>
          </Div>
        </Div>
      </ScrollView>
    </Div>
  )
}

const styles = StyleSheet.create({})

export default iCareScreen
