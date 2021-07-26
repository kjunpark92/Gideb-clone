import React, { useContext } from 'react'
import { StyleSheet, TouchableOpacity } from 'react-native'
import { Image, Div, Text, ThemeContext } from 'react-native-magnus'

import Styles from '../util/Styles'
import Log from '../util/Log'
import Config from '../config'
import screens from '../navigation/screens'
import { GDFontText } from '../components'
import THEMES from '../util/Themes'
import { UserTypeContext } from '../context/UserTypeContext'

interface InitialScreenProps {
  navigation: any
}

const InitialScreen: React.FC<InitialScreenProps> = ({ navigation }) => {
  const { setTheme } = useContext(ThemeContext)
  const { setUserType } = useContext(UserTypeContext)

  const clientTilePressed = () => {
    // Log.debug('clientTilePressed')
    setTheme(THEMES.client)
    setUserType('client')
    navigation.navigate(screens.LOGIN)
  }

  const providerTilePressed = () => {
    // Log.debug('providerTilePressed')
    setTheme(THEMES.provider)
    setUserType('provider')
    navigation.navigate(screens.LOGIN)
  }

  return (
    <Div style={styles.container}>
      <Div m="xl">
        {/* logo change to original --> green and blue one */}
        <Image
          h={75}
          w={75}
          source={Styles.images.smallLogo}
          right={5}
          resizeMode="contain"
        />
        <GDFontText
          // borderWidth={1}
          pt="sm"
          textWeight="700"
          fontSize="4xl"
          lineHeight={28}>
          {/* need to put line break for just 2 lines and put it after '안녕하세요' */}
          {Config.i18n('initialGreet')}
        </GDFontText>
        <Div px="md" py="md" />
        <Text fontSize="lg">{Config.i18n('initialSubText')}</Text>
      </Div>
      <Div row m="lg" alignSelf="flex-end" pb="2xl">
        {/* <TouchableOpacity
          onPress={clientTilePressed}
          style={styles.selectorTileButtons}>
          <Div
            h={150}
            flex={1}
            bg={Styles.colors.client.main}
            rounded="lg"
            style={styles.selectorTiles}>
            <GDFontText
              color={Styles.colors.text.light}
              fontSize="5xl"
              textWeight="700">
              {Config.i18n('initialClient')}
            </GDFontText>
          </Div>
        </TouchableOpacity> */}
        <TouchableOpacity
          onPress={clientTilePressed}
          style={styles.selectorTileButtons}>
          <Div
            h={150}
            bg={Styles.colors.client.main}
            rounded="lg"
            style={styles.selectorTiles}>
            <Text color={Styles.colors.text.light} fontSize="5xl">
              {Config.i18n('initialClient')}
            </Text>
          </Div>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={providerTilePressed}
          style={styles.selectorTileButtons}>
          <Div
            h={150}
            bg={Styles.colors.provider.main}
            rounded="lg"
            style={styles.selectorTiles}>
            <Text color={Styles.colors.text.light} fontSize="5xl">
              {Config.i18n('initialProvider')}
            </Text>
          </Div>
        </TouchableOpacity>
      </Div>
    </Div>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Styles.colors.background.light,
    justifyContent: 'flex-end',
    flex: 1,
  },
  selectorTileButtons: {
    flex: 1,
    padding: 10,
  },
  selectorTiles: {
    alignItems: 'center',
    justifyContent: 'center',
  },
})

export default InitialScreen
