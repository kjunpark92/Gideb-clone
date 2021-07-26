import * as React from 'react'
import { Div, Image } from 'react-native-magnus'

import GDFontText from './GDFontText'

interface RecProps {
  bgColor: string
  imgSource: any
  text: string
}

export default function RecTiles({ bgColor, imgSource, text }: RecProps) {
  return (
    <Div flex={1} alignItems="center">
      <Image
        resizeMode="contain"
        bg={bgColor}
        rounded="lg"
        h={98}
        w={98}
        mx="md"
        source={imgSource}
      />
      <GDFontText mt="lg" textAlign="center">
        {text}
      </GDFontText>
    </Div>
  )
}
