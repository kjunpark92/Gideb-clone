import * as React from 'react'
import { Dimensions, StyleSheet } from 'react-native'
import { Div, Image, Icon, Text } from 'react-native-magnus'

import { GDFontText } from '.'

const CARD_WIDTH = Dimensions.get('window').width - 60

interface Props {
  kitImg: any
  headerText: string
  detailsText: string
  index: any
}

export default function HorizontalCardView({
  kitImg,
  headerText,
  detailsText,
  index,
}: Props) {
  return (
    <Div w={CARD_WIDTH} mx="sm" px="sm">
      <Div bg="gray100" style={styles.horizontalScrollImages}>
        {index == 0 ? null : (
          <Icon fontFamily="SimpleLineIcons" name="arrow-left" fontSize="3xl" />
        )}
        <Image source={kitImg} h={270} w={240} bg="gray100" />
        {index == 4 - 1 ? null : (
          <Icon
            fontFamily="SimpleLineIcons"
            name="arrow-right"
            fontSize="3xl"
          />
        )}
      </Div>
      <GDFontText textWeight="700" fontSize="xl">
        {headerText}
      </GDFontText>
      <Div w={343}>
        <Text mt="lg">{detailsText}</Text>
      </Div>
    </Div>
  )
}

const styles = StyleSheet.create({
  horizontalScrollImages: {
    marginVertical: 24,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderRadius: 10,
  },
})
