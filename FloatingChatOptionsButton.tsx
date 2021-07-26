import * as React from 'react'
import { Dimensions } from 'react-native'
import { Overlay, Div, Button, Image } from 'react-native-magnus'
import GDFontText from './GDFontText'
import Styles from '../util/Styles'
import { useI18n } from '../hooks'

interface Props {
  navigateToChatbot: () => void
  navigateToNotification: () => void
  buttonPositionRest?: any
  overlayPositonRest?: any
}

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('screen')
const { useState } = React
export default function FloatingChatOptionsButton({
  navigateToChatbot,
  navigateToNotification,
  buttonPositionRest,
  overlayPositonRest,
}: Props) {
  const t = useI18n('chatOverlay')
  const [visible, setVisible] = useState(false)

  const toggleVisible = () => setVisible(!visible)

  return (
    <>
      {!visible && (
        <Button
          shadow="lg"
          shadowColor="#C4C4C4"
          bottom={15}
          right={15}
          position="absolute"
          bg="transparent"
          onPress={toggleVisible}
          {...buttonPositionRest}>
          <Image
            // ml="md"
            resizeMode="contain"
            source={Styles.images.chatBubble}
            h={50}
            w={50}
            rounded="xl"
          />
        </Button>
      )}
      <Overlay
        visible={visible}
        bg="transparent"
        h={SCREEN_HEIGHT}
        w={SCREEN_WIDTH}
        {...overlayPositonRest}>
        <Div
          bottom={80}
          flex={1}
          justifyContent="flex-end"
          alignItems="flex-end"
          pb="lg"
          pr="lg">
          <Div justifyContent="flex-end" alignItems="flex-end">
            <Div justifyContent="flex-end" alignItems="flex-end">
              <Button
                p="none"
                bg="transparent"
                justifyContent="flex-end"
                onPress={() => {
                  toggleVisible()
                  navigateToNotification()
                }}>
                <Div rounded="sm" bg="transparent" p="sm">
                  <GDFontText color="white" fontSize="lg">
                    {t.notificationBot}
                  </GDFontText>
                </Div>
                <Image
                  bg="white"
                  resizeMode="contain"
                  ml="md"
                  source={Styles.images.smallLogo}
                  h={50}
                  w={50}
                  rounded="circle"
                />
              </Button>
              <Div p="sm" />
              <Button
                // added padding left here because of short chatbot text
                // don't know if same on android
                pl={14}
                p="none"
                bg="transparent"
                justifyContent="flex-end"
                onPress={() => {
                  toggleVisible()
                  navigateToChatbot()
                }}>
                <Div rounded="sm" bg="transparent" p="sm">
                  <GDFontText color="white" fontSize="lg">
                    {t.chatBot}
                  </GDFontText>
                </Div>

                <Image
                  resizeMode="contain"
                  ml="md"
                  source={Styles.images.chatbotAvatar}
                  h={50}
                  w={50}
                  rounded="xl"
                />
              </Button>
            </Div>
            <Div p="sm" />
            <Button p="none" bg="transparent" onPress={toggleVisible}>
              <Div rounded="sm" bg="transparent" p="sm" w={60}></Div>
              <Image
                resizeMode="contain"
                source={Styles.images.closeBubble}
                h={50}
                w={50}
                rounded="xl"
              />
            </Button>
          </Div>
        </Div>
      </Overlay>
    </>
  )
}
