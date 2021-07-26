import React from 'react'
import { Button } from 'react-native-magnus'
import { StyleSheet } from 'react-native'
import Log from '../util/Log'

const defaultStyle = {
  px: 'xl',
  py: 'md',
  mr: 'md',
  rounded: 'circle',
}
const defaultCheckedStyle = {
  bg: 'black',
  color: 'white',
  borderWidth: StyleSheet.hairlineWidth,
}

const defaultUncheckedStyle = {
  bg: 'white',
  color: 'black',
  borderColor: 'black',
  borderWidth: StyleSheet.hairlineWidth,
}

export default function GDCheckButton({
  checked,
  checkedStyle = { ...defaultStyle, ...defaultCheckedStyle },
  uncheckedStyle = { ...defaultStyle, ...defaultUncheckedStyle },
  ...rest
}) {
  // Log.debug('checkedStyle = ', checkedStyle)
  return (
    <Button
      {...rest}
      {...(checked
        ? { ...defaultStyle, ...defaultCheckedStyle, ...checkedStyle }
        : { ...defaultStyle, ...defaultUncheckedStyle, ...uncheckedStyle })}
    />
  )
}
