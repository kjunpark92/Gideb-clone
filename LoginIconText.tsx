import React from 'react'
import { StyleSheet } from 'react-native'
import { Image, Div, Text } from 'react-native-magnus'

import Styles from '../util/Styles'
import Log from '../util/Log'
import Config from '../config'
import GDFontText from './GDFontText'

interface LoginIconTextProps {
  mainText: string
  subText: string
}

const LoginIconText: React.FC<LoginIconTextProps> = ({ mainText, subText }) => (
  <Div m="xl">
    {/* change image to original green and blue */}
    <Image
      resizeMode="contain"
      h={75}
      w={75}
      m={10}
      source={Styles.images.smallLogo}
      right={18}
    />
    <GDFontText fontSize="5xl" textWeight="700">
      {mainText}
    </GDFontText>
    {/* <Div px="md" py="md" /> */}
    <GDFontText fontSize="lg">{subText}</GDFontText>
  </Div>
)

export default LoginIconText
