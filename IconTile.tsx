import * as React from 'react'
import { Div, Image } from 'react-native-magnus'

import GDFontText from './GDFontText'

interface Props {
  imgSrc: any
  text: string
}

export default function IconTile({ imgSrc, text }: Props) {
  return (
    <Div flex={1} m="xs">
      <Div
        rounded="xl"
        h={110}
        mb={5}
        bg="gray150"
        justifyContent="center"
        alignItems="center">
        <Image source={imgSrc} h={70} w={70} resizeMode="contain" />
      </Div>
      <Div w={'100%'} bg="white">
        <GDFontText textAlign="center" fontSize="sm">
          {text}
        </GDFontText>
      </Div>
    </Div>
  )
}
