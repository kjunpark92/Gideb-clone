import * as React from 'react'
import { TouchableOpacity } from 'react-native'
import { Div, Icon, Text, Overlay } from 'react-native-magnus'
import { GDFontText } from '../components'
interface AWHOverlayProps {
  title: string
  text: string
  closeEvent: any
  visible: boolean
}

export default function AWHOverlay({
  title,
  text,
  closeEvent,
  visible,
}: AWHOverlayProps) {
  return (
    <Overlay visible={visible} p="xl" rounded="2xl">
      <Div alignItems="flex-end">
        <TouchableOpacity onPress={closeEvent}>
          <Icon
            fontFamily="MaterialCommunityIcons"
            name="close"
            color="black"
            fontSize="4xl"
          />
        </TouchableOpacity>
      </Div>
      <Div p="lg">
        <Div alignItems="center" justifyContent="center">
          <Icon
            color="main900"
            fontFamily="SimpleLineIcons"
            name="exclamation"
            fontSize="6xl"
          />
          <GDFontText fontSize="xl" textAlign="center" textWeight="700">
            {title}
          </GDFontText>
        </Div>
        <Div>
          <Text textAlign="center">{text}</Text>
        </Div>
      </Div>
    </Overlay>
  )
}
