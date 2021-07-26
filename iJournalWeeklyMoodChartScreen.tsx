import * as React from 'react'
import {
  StyleSheet,
  SafeAreaView,
  Dimensions,
  TouchableOpacity,
  Modal,
} from 'react-native'
import { Div, Text, Icon, Image, Button, Dropdown } from 'react-native-magnus'
import { BarChart } from 'react-native-chart-kit'
import { useFirebase, useFirestore } from 'react-redux-firebase'
import dayjs from 'dayjs'
import { Calendar } from 'react-native-calendars'
import { useSelector } from 'react-redux'
import _ from 'lodash'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import Config from '../config'
import Styles from '../util/Styles'
import Log from '../util/Log'

import { GDJournalHeader, GDFontText } from '../components'

interface iJournalWeeklyMoodChartScreenProps {}

const SCREEN_WIDTH = Dimensions.get('screen').width
const { useState, useEffect, createRef } = React

const iJournalWeeklyMoodChartScreen: React.FC<iJournalWeeklyMoodChartScreenProps> =
  ({}) => {
    const firestore = useFirestore()
    const firebase = useFirebase()
    const dropdownRef = createRef()
    const [daysToSubtract, setDaysToSubtract] = useState<number>(0)
    const [weekOfMoods, setWeekOfMoods] = useState<number[]>([])
    const [avgMood, setAvgMood] = useState<number>(0)
    const [selectedDate, setSelectedDate] = useState(
      dayjs().format('YYYY-MM-DD'),
    )
    const insets = useSafeAreaInsets()

    const daysToShow = useSelector((state: any) => {
      const userJournals = state.firestore.ordered.journals
      // Log.debug('userJournals: *', userJournals, daysToSubtract)
      // return userJournals
      const journalsToShow = [
        _.find(userJournals, {
          yearMonthDate: dayjs()
            .subtract(daysToSubtract, 'days')
            .format('YYYY-MM-DD'),
        }),
        _.find(userJournals, {
          yearMonthDate: dayjs()
            .subtract(daysToSubtract + 1, 'days')
            .format('YYYY-MM-DD'),
        }),
        _.find(userJournals, {
          yearMonthDate: dayjs()
            .subtract(daysToSubtract + 2, 'days')
            .format('YYYY-MM-DD'),
        }),
        _.find(userJournals, {
          yearMonthDate: dayjs()
            .subtract(daysToSubtract + 3, 'days')
            .format('YYYY-MM-DD'),
        }),
        _.find(userJournals, {
          yearMonthDate: dayjs()
            .subtract(daysToSubtract + 4, 'days')
            .format('YYYY-MM-DD'),
        }),
        _.find(userJournals, {
          yearMonthDate: dayjs()
            .subtract(daysToSubtract + 5, 'days')
            .format('YYYY-MM-DD'),
        }),
        _.find(userJournals, {
          yearMonthDate: dayjs()
            .subtract(daysToSubtract + 6, 'days')
            .format('YYYY-MM-DD'),
        }),
      ]
      Log.debug('these journals to show', journalsToShow)
      return journalsToShow
    })

    const weeklyMoodGenerator = (weekArr: any[]) => {
      let moodsArr = {
        [dayjs()
          .subtract(daysToSubtract + 6, 'days')
          .format('YYYY-MM-DD')]: 0,
        [dayjs()
          .subtract(daysToSubtract + 5, 'days')
          .format('YYYY-MM-DD')]: 0,
        [dayjs()
          .subtract(daysToSubtract + 4, 'days')
          .format('YYYY-MM-DD')]: 0,
        [dayjs()
          .subtract(daysToSubtract + 3, 'days')
          .format('YYYY-MM-DD')]: 0,
        [dayjs()
          .subtract(daysToSubtract + 2, 'days')
          .format('YYYY-MM-DD')]: 0,
        [dayjs()
          .subtract(daysToSubtract + 1, 'days')
          .format('YYYY-MM-DD')]: 0,
        [dayjs().subtract(daysToSubtract, 'days').format('YYYY-MM-DD')]: 0,
      }
      if (!weekArr) return moodsArr
      weekArr.map((entry) => {
        // Log.debug(entry, '**')
        if (!entry) return
        if (Object.keys(moodsArr).includes(entry.yearMonthDate)) {
          let numberToDivideBy = 3
          const { moodMorning, moodAfternoon, moodEvening } = entry
          const moodsTotal = [moodMorning, moodAfternoon, moodEvening].reduce(
            (total, num) => {
              Log.debug('num', num, num == null)
              if (num == null) numberToDivideBy--
              return total + num
            },
          )
          moodsArr[entry.yearMonthDate] = moodsTotal / (numberToDivideBy * 5)
        }
      })
      Log.debug('weekArr map: moodsArr:', moodsArr)
      try {
        setAvgMood(
          Math.ceil(
            (Object.values(moodsArr)
              .filter((num) => num != 0)
              .reduce((total = 0, num = 0) => total + num) *
              10) /
              Object.values(moodsArr).filter((num) => num != 0).length /
              2,
          ),
        )
      } catch (error) {
        setAvgMood(0)
      }
      Log.debug('avgMood', avgMood)
      return Object.values(moodsArr)
    }

    useEffect(() => {
      Log.debug('daysToShow', daysToShow)
      Log.debug(weeklyMoodGenerator(daysToShow))
      Log.debug(
        'startDate:',
        dayjs()
          .subtract(daysToSubtract + 6, 'days')
          .format('YYYY-MM-DD'),
        dayjs().subtract(daysToSubtract, 'days').format('YYYY-MM-DD'),
      )

      setWeekOfMoods(weeklyMoodGenerator(daysToShow))
    }, [daysToSubtract])

    const handleRangeColor = (percentage) => {
      switch (true) {
        case percentage / 100 <= 0.2:
          return Styles.colors.journalColors[0]
        case percentage / 100 > 0.2 && percentage / 100 <= 0.4:
          return Styles.colors.journalColors[1]
        case percentage / 100 > 0.4 && percentage / 100 <= 0.6:
          return Styles.colors.journalColors[2]
        case percentage / 100 > 0.6 && percentage / 100 <= 0.8:
          return Styles.colors.journalColors[3]
        case percentage / 100 > 0.8:
          return Styles.colors.journalColors[4]
        default:
          return 'black'
      }
    }

    const VerticalRange = ({ percentage }) => (
      <Div w={20} h={200} rounded="xl" justifyContent="flex-end" bg="gray300">
        <Div
          h={`${String(percentage)}%`}
          bg={handleRangeColor(percentage)}
          rounded="xl"
        />
      </Div>
    )

    const handleDaysToSubtract = (plusOrMinus: string) => {
      if (plusOrMinus == 'plus') {
        return setDaysToSubtract(daysToSubtract + 1)
      }

      return setDaysToSubtract(daysToSubtract - 1)
    }

    const CalendarViewer = () => {
      let selectedDate = dayjs()
        .subtract(daysToSubtract, 'days')
        .format('YYYY-MM-DD')
      return (
        <Dropdown
          ref={dropdownRef}
          title={
            <GDFontText
              mx="xl"
              color="gray900"
              pb="md"
              fontSize="3xl"
              textWeight="700"
              textAlign="center">
              날짜 선택
            </GDFontText>
          }
          // mt="md"
          // pb="2xl"
          w={'100%'}
          showSwipeIndicator={true}
          roundedTop="xl">
          <Div w="100%" px="xl" justifyContent="center">
            <Calendar
              markingType="period"
              markedDates={{
                [dayjs(selectedDate)
                  .subtract(daysToSubtract + 6, 'days')
                  .format('YYYY-MM-DD')]: {
                  selected: true,
                  startingDay: true,
                  color: '#50cebb',
                },
                [dayjs(selectedDate)
                  .subtract(daysToSubtract + 5, 'days')
                  .format('YYYY-MM-DD')]: {
                  color: '#70d7c7',
                  textColor: 'white',
                },
                [dayjs(selectedDate)
                  .subtract(daysToSubtract + 4, 'days')
                  .format('YYYY-MM-DD')]: {
                  color: '#70d7c7',
                  textColor: 'white',
                },
                [dayjs(selectedDate)
                  .subtract(daysToSubtract + 3, 'days')
                  .format('YYYY-MM-DD')]: {
                  color: '#70d7c7',
                  textColor: 'white',
                },
                [dayjs(selectedDate)
                  .subtract(daysToSubtract + 2, 'days')
                  .format('YYYY-MM-DD')]: {
                  color: '#70d7c7',
                  textColor: 'white',
                },
                [dayjs(selectedDate)
                  .subtract(daysToSubtract + 1, 'days')
                  .format('YYYY-MM-DD')]: {
                  color: '#70d7c7',
                  textColor: 'white',
                },
                [dayjs(selectedDate)
                  .subtract(daysToSubtract, 'days')
                  .format('YYYY-MM-DD')]: {
                  selected: true,
                  endingDay: true,
                  color: '#50cebb',
                },
              }}
              // Initially visible month. Default = Date()
              // current={'2012-03-01'}
              // // Minimum date that can be selected, dates before minDate will be grayed out. Default = undefined
              // minDate={'2012-05-10'}
              // // Maximum date that can be selected, dates after maxDate will be grayed out. Default = undefined
              // maxDate={'2012-05-30'}
              // // Handler which gets executed on day press. Default = undefined
              onDayPress={(day: any) => {
                Log.debug(
                  dayjs()
                    .subtract(daysToSubtract)
                    .diff(dayjs(day.dateString), 'days'),
                )
                selectedDate = dayjs(day.dateString).format('YYYY-MM-DD')
                // Log.debug('selectedDate:', selectedDate)
                // setSelectedDate(
                //   // dayjs(day.dateString).subtract(7, 'days').format('YYYY-MM-DD'),
                //   dayjs(day.dateString).subtract(-6, 'days').format('YYYY-MM-DD'),
                // )
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
              // renderArrow={(direction) => <Arrow />}
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
              // onPressArrowLeft={(subtractMonth) => subtractMonth()}
              // // Handler which gets executed when press arrow icon right. It receive a callback can go next month
              // onPressArrowRight={(addMonth) => addMonth()}
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
              <Text color={Styles.colors.text.light}>선택하기</Text>
            </Button>
          </Div>
        </Dropdown>
      )
    }

    return (
      <>
        <Div flex={1} bg="white" pt={insets.top}>
          <GDJournalHeader
            headerText={'i일기쓰기'}
            suffixFunction={() => Log.debug('edit function here')}
          />
          <Div borderBottomWidth={1} borderBottomColor="gray300"></Div>
          <Div p={20}>
            <Div
              row
              h={50}
              alignItems={'center'}
              mr={10}
              justifyContent="space-between">
              <GDFontText fontSize="2xl" textWeight="bold">
                주간 그래프
              </GDFontText>
              <Div alignItems="center">
                <TouchableOpacity onPress={() => dropdownRef.current.open()}>
                  <Icon
                    color="black"
                    fontFamily="MaterialCommunityIcons"
                    name="calendar"
                    fontSize="5xl"
                  />
                </TouchableOpacity>
              </Div>
            </Div>
            <Div alignItems="center" my={20}>
              <Div w={150} row justifyContent="center" alignItems="center">
                <Div flex={1}>
                  <TouchableOpacity
                    onPress={() => handleDaysToSubtract('plus')}>
                    <Icon
                      color="black"
                      fontFamily="MaterialCommunityIcons"
                      name="chevron-left"
                      fontSize="4xl"
                      mr="5%"
                    />
                  </TouchableOpacity>
                </Div>
                <Div alignItems="center" flex={4}>
                  <GDFontText fontSize="xl" textWeight="700">
                    {dayjs()
                      .subtract(daysToSubtract + 6, 'days')
                      .format('YYYY.MM.DD')}
                  </GDFontText>
                  <GDFontText fontSize="xl" textWeight="700">
                    {dayjs()
                      .subtract(daysToSubtract, 'days')
                      .format('YYYY.MM.DD')}
                  </GDFontText>
                </Div>
                <Div flex={1}>
                  <TouchableOpacity
                    onPress={() =>
                      daysToSubtract == 0 ? null : handleDaysToSubtract('minus')
                    }>
                    <Icon
                      fontFamily="MaterialCommunityIcons"
                      name="chevron-right"
                      fontSize="4xl"
                      color="black"
                      ml="6%"
                    />
                  </TouchableOpacity>
                </Div>
              </Div>
            </Div>
            {/* thinking is here somwhere ** text must be rendered inside text ERR**  NOT !!*/}
            <Div rounded="xl" row h={250} p="lg" bg="gray200">
              <Div flex={1}>
                <Div flex={1} justifyContent="center" alignItems="center">
                  <Image source={Styles.images.emoji.m5} h={25} w={25} />
                </Div>
                <Div flex={1} justifyContent="center" alignItems="center">
                  <Image source={Styles.images.emoji.m4} h={25} w={25} />
                </Div>
                <Div flex={1} justifyContent="center" alignItems="center">
                  <Image source={Styles.images.emoji.m3} h={25} w={25} />
                </Div>
                <Div flex={1} justifyContent="center" alignItems="center">
                  <Image source={Styles.images.emoji.m2} h={25} w={25} />
                </Div>
                <Div flex={1} justifyContent="center" alignItems="center">
                  <Image source={Styles.images.emoji.m1} h={25} w={25} />
                </Div>
              </Div>
              {weekOfMoods.map((moodPercentage, i) => {
                return (
                  <Div
                    flex={1}
                    justifyContent="flex-end"
                    alignItems="center"
                    key={String(i)}>
                    <VerticalRange percentage={String(moodPercentage * 100)} />
                    <Text>
                      {dayjs()
                        .subtract(
                          daysToSubtract + weekOfMoods.length - i - 1,
                          'days',
                        )
                        .locale(Config.getLang())
                        .format('ddd')}
                    </Text>
                  </Div>
                )
              })}
            </Div>
            <Div p={20} />
            {avgMood ? (
              <Div alignItems="center">
                <GDFontText
                  fontSize="lg"
                  mb="md"
                  textWeight="700">{`총 ${String(
                  weekOfMoods.filter((entry) => entry).length,
                )} 개의 기록을 남기셨네요.`}</GDFontText>
                <Div row>
                  <GDFontText fontSize="lg" mb="md" textWeight="700">
                    평균 기분은
                  </GDFontText>
                  <Image
                    source={Styles.images.emoji[`m${avgMood}`]}
                    h={20}
                    w={20}
                    mx="1%"
                  />
                  <GDFontText fontSize="lg" mb="md" textWeight="700">
                    이네요.
                  </GDFontText>
                </Div>
              </Div>
            ) : null}
          </Div>
        </Div>
        <CalendarViewer />
      </>
    )
  }

export default iJournalWeeklyMoodChartScreen
