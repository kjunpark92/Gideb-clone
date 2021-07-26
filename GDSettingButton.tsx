import React from 'react'
import { StyleSheet } from 'react-native'
import { Div, Text, Button, Icon } from 'react-native-magnus'

export default function GDSettingButton({ containerStyle, onPress, children }) {
  return (
    <Div
      borderBottomColor="gray500"
      borderBottomWidth={StyleSheet.hairlineWidth}
      mb="sm"
      pb="sm"
      {...containerStyle}>
      <Button bg="white" block justifyContent="space-between" onPress={onPress}>
        <Text color="gray700" fontSize="lg">
          {children}
        </Text>
        <Icon name="right" color="black" />
      </Button>
    </Div>
  )
}
