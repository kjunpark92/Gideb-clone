import React from 'react'
import { Div, Text, Input, Icon } from 'react-native-magnus'

export default function GDSearchInput({ containerProps, inputProps }) {
  return (
    <Div {...containerProps}>
      <Input
        rounded="circle"
        bg="gray100"
        placeholder="Search"
        suffix={<Icon name="search" fontFamily="FontAwesome5" />}
        {...inputProps}
      />
    </Div>
  )
}
