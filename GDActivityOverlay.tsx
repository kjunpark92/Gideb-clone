import * as React from 'react'
import { ActivityIndicator } from 'react-native'
import { Overlay } from 'react-native-magnus'

interface Props {
  visible: boolean
}

export default function GDActivityOverlay({ visible }: Props) {
  return (
    <Overlay visible={visible} p="xl" bg="transparent">
      <ActivityIndicator color="#63B3ED" size={150} />
    </Overlay>
  )
}
