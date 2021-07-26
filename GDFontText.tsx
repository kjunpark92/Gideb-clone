import * as React from 'react'
import { Platform } from 'react-native'
import { Text, Div } from 'react-native-magnus'

interface Props {
  children: any
  textWeight?: string
  fontSize?: any
  color?: any
  w?: any
  h?: any
  p?: any
  pl?: any
  pt?: any
  px?: any
  pb?: any
  mx?: any
  mb?: any
  py?: any
  ml?: any
  mt?: any
  textAlign?: string
  lineHeight?: number
  letterSpacing?: number
  rest?: any
  onPress?: () => void
}

const { useState, useEffect } = React
export default function GDFontText({
  children,
  textWeight,
  onPress,
  lineHeight,
  ...rest
}: Props) {
  const [textWeightErr, setTextWeightErr] = useState(false)
  const acceptableVals = ['100', '300', '400', '500', '700', '900', 'bold']
  let lineHeightWasPassedAsProp = false

  useEffect(() => {
    if (textWeight) {
      if (!acceptableVals.includes(textWeight)) setTextWeightErr(true)
      if (lineHeight) lineHeightWasPassedAsProp = true
      return () => {
        // cleanup
      }
    }
  }, [])

  const lex: any = {
    ios: {
      '100': 'Noto Sans KR Thin',
      '300': 'Noto Sans KR Light',
      '400': 'Noto Sans KR Regular',
      '500': 'Noto Sans KR Medium',
      '700': 'Noto Sans KR Bold',
      '900': 'Noto Sans KR Black',
      default: 'Noto Sans KR Regular',
    },
    android: {
      '100': 'NotoSansKR-Thin',
      '300': 'NotoSansKR-Light',
      '400': 'NotoSansKR-Regular',
      '500': 'NotoSansKR-Medium',
      '700': 'NotoSansKR-Bold',
      '900': 'NotoSansKR-Black',
      default: 'NotoSansKR-Regular',
    },
  }

  return (
    <>
      <Text
        {...(lineHeightWasPassedAsProp ? lineHeight : null)}
        {...(Platform.OS == 'android'
          ? {
              lineHeight: 24,
            }
          : null)}
        // lineHeight={Platform.OS == 'android' ? 24 : 0}
        // lineHeight={30}
        onPress={onPress}
        fontFamily={
          textWeight == 'bold'
            ? 'Noto Sans KR Bold'
            : textWeight
            ? lex[Platform.OS][textWeight]
            : lex[Platform.OS].default
        }
        {...rest}>
        {!textWeightErr ? children : 'READ DISCORD DUMBSHIT'}
        {/* ^^^^^^{Platform.OS}^^^^^{lex[Platform.OS][textWeight]} */}
      </Text>
    </>
  )
}
