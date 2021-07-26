import * as React from 'react'
import { Linking } from 'react-native'
import { SafeAreaView as NavSafeAreaView } from 'react-native-safe-area-context'
import { Div, Text, Icon, Image } from 'react-native-magnus'

import { GDHeader, GDFontText } from '../components'
import Styles from '../util/Styles'
import Log from '../util/Log'
import { TouchableOpacity } from 'react-native-gesture-handler'

interface TextBlockProps {
  header: string
  text: string
}

interface GoToProps {
  text: string
  link: string
}

interface MyPageSelectionScreenProps {
  navigation?: any
  route: any
}

interface MyPageSelectionRouteParamsProps {
  title: string
  textBlocks?: TextBlockProps[]
  goTo: GoToProps
}

const MyPageSelectionScreen: React.FC<MyPageSelectionScreenProps> = ({
  navigation,
  route,
}) => {
  Log.debug('route of MyPageSelectionScreen:', route.params)

  const { title, textBlocks, goTo } = route.params

  return (
    <NavSafeAreaView
      style={{ backgroundColor: Styles.colors.background.light, flex: 1 }}>
      <GDHeader>{title}</GDHeader>
      <Div borderBottomWidth={1} borderBottomColor="gray200" />
      <Div px="xl">
        {textBlocks
          ? textBlocks.map((textBlock: TextBlockProps, i: number) => (
              <Div key={String(i)} mt="2xl">
                <GDFontText fontSize="xl">{textBlock.header}</GDFontText>
                <Div mt="md" />
                <Text fontSize="md" color="gray500">
                  {textBlock.text}
                </Text>

                {goTo.labelFaqLink1 && i == 3 ? (
                  <Div row mt="lg">
                    <Div flex={1}>
                      <Image
                        source={Styles.images.exclamationCircle}
                        h={24}
                        w={24}
                      />
                    </Div>
                    <Div flex={9} pr={30}>
                      <TouchableOpacity
                        onPress={() => Log.debug('faq link 1 pressed')}>
                        <Text color="gray500" textDecorLine="underline">
                          {goTo.labelFaqLink1}
                        </Text>
                      </TouchableOpacity>
                    </Div>
                  </Div>
                ) : null}

                {goTo.labelHelpCenterLink && i == 0 ? (
                  <Div row>
                    <Div flex={1}>
                      <Image
                        source={Styles.images.exclamationCircle}
                        h={24}
                        w={24}
                      />
                    </Div>
                    <Div flex={9} pr={30}>
                      <TouchableOpacity
                        onPress={() => Log.debug('faq link 1 pressed')}>
                        <Text color="gray500" textDecorLine="underline">
                          {goTo.labelHelpCenterLink}
                        </Text>
                      </TouchableOpacity>
                    </Div>
                  </Div>
                ) : null}

                {goTo.labelFaqLink2 && i == 4 ? (
                  <Div row mt="lg">
                    <Div flex={1}>
                      <Image
                        source={Styles.images.exclamationCircle}
                        h={24}
                        w={24}
                      />
                    </Div>
                    <Div flex={9} pr={30}>
                      <TouchableOpacity
                        onPress={() => Log.debug('faq link 2 pressed')}>
                        <Text color="gray500" textDecorLine="underline">
                          {goTo.labelFaqLink2}
                        </Text>
                      </TouchableOpacity>
                    </Div>
                  </Div>
                ) : null}

                {goTo.labelHowToUseLink && i == 2 ? (
                  <Div row mt="lg">
                    <TouchableOpacity
                      onPress={() => Log.debug('howtouse link 1 pressed')}>
                      <Text color="gray800" textDecorLine="underline">
                        {goTo.labelHowToUseLink}
                      </Text>
                    </TouchableOpacity>
                  </Div>
                ) : null}
              </Div>
            ))
          : null}
      </Div>
      <Div p="lg">
        <Text
          textDecorLine="underline"
          onPress={() => Linking.openURL(goTo.link)}>
          {goTo.text}
        </Text>
      </Div>
    </NavSafeAreaView>
  )
}

export default MyPageSelectionScreen
