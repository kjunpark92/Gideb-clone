import * as React from 'react'
import { TouchableOpacity } from 'react-native'
import { Div, Text, Icon } from 'react-native-magnus'
import Styles from '../util/Styles'

interface Props {
  onPress: () => void
  selectionName: string
}

export default function GDMyPageSelectionSelectors({
  onPress,
  selectionName,
}: Props) {
  return (
    <TouchableOpacity onPress={onPress}>
      <Div
        borderBottomWidth={1}
        borderBottomColor={Styles.colors.grayscale.lightGray}
        p="md"
        m="lg">
        <Div row justifyContent="space-between">
          <Text fontSize="lg">{selectionName}</Text>
          <Icon
            fontFamily="MaterialIcons"
            name="arrow-forward-ios"
            fontSize="lg"
            color="gray900"
          />
        </Div>
        <Div p="xs" />
      </Div>
    </TouchableOpacity>
  )
}
