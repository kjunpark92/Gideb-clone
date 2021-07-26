import React from 'react'
import { Image } from 'react-native-magnus'
import Styles from '../util/Styles'

export default function GDAvatar({ photoURL = null, w = 32, h = 32, ...rest }) {
  return (
    <Image
      bg="gray300"
      rounded="circle"
      source={photoURL ? { uri: photoURL } : Styles.images.profile}
      w={w}
      h={h}
      {...rest}
    />
  )
}
