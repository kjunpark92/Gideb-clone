import React, { forwardRef } from 'react'
import { ScrollView, TouchableOpacity } from 'react-native'
import { Div, Text, Dropdown, Button, Modal, Icon } from 'react-native-magnus'
import { useI18n } from '../hooks'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import GDFontText from './GDFontText'

const TOSModal = (props) => {
  const t = useI18n('TOS')
  const insets = useSafeAreaInsets()

  return (
    <Modal
      isVisible={props.isVisible}
      // ref={TOSRef}
      // showSwipeIndicator={true}
      roundedTop="2xl"
      h="90%"
      pt={insets.top}>
      <Div alignSelf="flex-end">
        <TouchableOpacity onPress={props.closeFunc}>
          <Icon
            fontFamily="MaterialCommunityIcons"
            name="close"
            fontSize="4xl"
            color="black"
            p="lg"
          />
        </TouchableOpacity>
      </Div>
      <Div alignSelf="center" mb="xl">
        <GDFontText fontSize="xl" textWeight="700">
          {t.title}
        </GDFontText>
      </Div>
      <ScrollView>
        <Div flex={1} bg="white">
          <Div p="lg" />
          <Div alignSelf="center">
            <Text fontSize="lg" px="lg">
              {t.text}
            </Text>
          </Div>
        </Div>
        <Div mt="2xl" />
      </ScrollView>
    </Modal>
  )
}
// export default forwardRef(TOSModal)

export default TOSModal
