import * as React from 'react'
import { Dimensions, StyleSheet } from 'react-native'
import { Div, Image, Text, Icon } from 'react-native-magnus'

import Log from '../util/Log'
import Styles from '../util/Styles'
import GDFontText from './GDFontText'
// import Icons from 'react-native-vector-icons/SimpleLineIcons'
// import text from '../util/Lang'

export default function HorizontalScrollCard<HorizontalScrollCardProps>(
  props: any,
) {
  // const CARD_WIDTH = Dimensions.get('window').width * 0.7
  return (
    <>
      <Div
        // w={CARD_WIDTH}
        flex={1}>
        <GDFontText fontSize="3xl" my={12}>
          {props.title}
        </GDFontText>
        <Text>{props.text}</Text>
        <Div
          py={20}
          row
          justifyContent="space-around"
          bg={Styles.colors.grayscale.lightGray}>
          <Image source={props.image} h={250} w={250} />
          <Icon
            fontFamily="SimpleLineIcons"
            name="arrow-right"
            fontSize="5xl"
            borderWidth={1}
          />
        </Div>
        <GDFontText fontSize="3xl" my={12}>
          {props.paragraphTitle}
        </GDFontText>
        <Text>{props.paragraphText}</Text>
      </Div>
    </>
  )
}
