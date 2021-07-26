import * as React from 'react'
import { Div, Image } from 'react-native-magnus'

import GDFontText from './GDFontText'

interface TestimonialProps {
  img: any
  name: string
  date: any
  text: string
}

export default function TestimonialCardComponent({
  img,
  name,
  date,
  text,
}: TestimonialProps) {
  return (
    <>
      <Div bg="transparent" h={123} w={343}>
        <Div row>
          <Image h={44} w={44} source={img} />
          <Div ml="md" justifyContent="center">
            <GDFontText fontSize="md" color="black">
              {name}
            </GDFontText>
            <GDFontText color="gray500" fontSize="xs">
              {date}
            </GDFontText>
          </Div>
        </Div>
        <Div p="xs" />
        <GDFontText fontSize={11.5}>{text}</GDFontText>
      </Div>
      <Div p="sm" />
    </>
  )
}
