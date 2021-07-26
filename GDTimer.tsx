import * as React from 'react'
import { useTimer } from 'react-timer-hook'
import dayjs from 'dayjs'
import { Div, Text } from 'react-native-magnus'

export interface IGDTimerProps {
  expiryTimestamp: Date | number
  onExpire?: () => {}
}

export const GDTimer = React.memo((props: IGDTimerProps) => {
  const { expiryTimestamp, onExpire } = props
  const {
    seconds,
    minutes,
    hours,
    days,
    isRunning,
    start,
    pause,
    resume,
    restart,
  } = useTimer({
    expiryTimestamp,
    onExpire,
  })

  React.useEffect(() => {
    start()
    return () => {
      // cleanup
    }
  }, [])

  return (
    <Div>
      <Text>
        {hours} : {minutes} : {seconds}
      </Text>
    </Div>
  )
})
