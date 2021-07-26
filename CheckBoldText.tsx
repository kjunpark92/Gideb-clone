import * as React from 'react'
import { Div } from 'react-native-magnus'
import { GDFontText } from '../components'

export default function CheckBoldText() {
  return (
    <Div flex={1} justifyContent="center" alignItems="center">
      <GDFontText>NO PROPS</GDFontText>
      <GDFontText textWeight="100">Text with textWeight 100</GDFontText>
      <GDFontText textWeight="300">Text with textWeight 300</GDFontText>
      <GDFontText textWeight="400">Text with textWeight 400</GDFontText>
      <GDFontText textWeight="500">text with 500</GDFontText>
      <GDFontText textWeight="700">text with 700</GDFontText>
      <GDFontText textWeight="900">text with 900</GDFontText>
      <GDFontText textWeight={1}>
        text with thickness thin and mode black
      </GDFontText>
      <GDFontText fontSize="xl" textWeight="300">
        HELLO this is xl
      </GDFontText>
      <GDFontText>aaa</GDFontText>
    </Div>
  )
}
