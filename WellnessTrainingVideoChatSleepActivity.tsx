import * as React from 'react'
import { SafeAreaView } from 'react-native'
import { Div, Text, Button, useTheme } from 'react-native-magnus'
import CircleSlider from 'react-native-circle-slider'
import Slider from '@react-native-community/slider'
import CircularSlider from 'react-native-circular-slider'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import Log from '../util/Log'
import GDFontText from './GDFontText'

const { useState } = React
export default function WellnessTrainingVideoChatSleepActivity({
  closeActFunc,
}) {
  const [sleepTime, setSleepTime] = useState(6)
  const insets = useSafeAreaInsets()
  const { theme } = useTheme()

  const onUpdate = ({ startAngle, angleLength }) => {
    Log.debug(startAngle, angleLength)
  }

  const handleValueChange = (degree: number) => {
    const hour = angleToHour(degree)
    setSleepTime(hour)
    console.log(hour)
    return hour
  }
  const angleToHour = (angle: number) => Math.round(angle / 20)
  const hourToAngle = (hour: number) => hour * 20

  const meterColor =
    sleepTime < 6
      ? theme.colors.error
      : sleepTime < 9
      ? theme.colors.main900
      : theme.colors.system900

  const fillColor =
    sleepTime < 6
      ? 'rgba(229, 62, 62, 0.08)'
      : sleepTime < 9
      ? 'rgba(79, 209, 197, 0.08)'
      : 'rgba(246, 173, 85, 0.08)'

  return (
    <Div pt={insets.top} justifyContent="center" alignItems="center" flex={1}>
      <Div borderWidth={1} justifyContent="center" alignItems="center">
        <Text>{sleepTime}</Text>
        <Div
          p="xl"
          justifyContent="center"
          alignItems="center"
          // style={{ transform: [{ rotateZ: '-120deg' }] }}
        >
          <CircleSlider
            onValueChange={handleValueChange}
            btnRadius={14}
            dialRadius={118}
            dialWidth={18}
            strokeWidth={20}
            value={hourToAngle(sleepTime)}
            meterColor={meterColor}
            fillColor={fillColor}
            // xCenter={3}
            // yCenter={1}
            textColor="black"
            max={240}
            min={0}>
            <Div
              borderWidth={1}
              w={'100%'}
              h={'100%'}
              justifyContent="center"
              alignItems="center">
              <GDFontText fontSize={28} color={meterColor}>
                {sleepTime} {'시간'}
              </GDFontText>
              <GDFontText fontSize={12} color="gray500" lineHeight={17.5}>
                {'평균 수면시간'}
              </GDFontText>
            </Div>
          </CircleSlider>
        </Div>
        {/* <Slider
          style={{
            width: 200,
            height: 40,
            borderRadius: 20,
            borderWidth: 1,
            transform: [
              { perspective: 850 },
              { translateX: 400 * 0.24 },
              { rotateY: '100deg' },
            ],
          }}
          minimumValue={0}
          maximumValue={1}
          minimumTrackTintColor="#FFFFFF"
          maximumTrackTintColor="#000000"
        /> */}
        {/* <CircularSlider
          startAngle={(Math.PI * 10) / 6}
          angleLength={(Math.PI * 7) / 6}
          onUpdate={onUpdate}
          segments={5}
          strokeWidth={40}
          radius={145}
          gradientColorFrom="#ff9800"
          gradientColorTo="#ffcf00"
          showClockFace
          clockFaceColor="#9d9d9d"
          bgCircleColor="#171717"
          // stopIcon={
          //   <G scale="1.1" transform={{ translate: '-8, -8' }}>
          //     {WAKE_ICON}
          //   </G>
          // }
          // startIcon={
          //   <G scale="1.1" transform={{ translate: '-8, -8' }}>
          //     {BEDTIME_ICON}
          //   </G>
          // }
        /> */}
        <Button onPress={closeActFunc}>close</Button>
      </Div>
    </Div>
  )
}
