import React from 'react'
import { Image, Text, ImageProps } from 'react-native-magnus'
import Styles from '../util/Styles'

export default function GDLogo<ImageProps>(props: any) {
  return (
    <Image
      resizeMode="contain"
      w={78}
      h={78}
      {...props}
      source={Styles.images.originalLogo}
    />
  )
}
