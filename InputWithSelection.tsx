import React, { useState } from 'react'
import {
  Input,
  Icon,
  Text,
  Div,
  Button,
  Select,
  InputProps,
  SelectRef,
} from 'react-native-magnus'
import Styles from '../util/Styles'
import InputWithTitle from './InputWithTitle'

interface InputWithSelectionProps extends InputProps {
  icon: string
  iconColor: string
  iconSize: number | string
  title: string
  options: Array<any>
  onSelected: Function
  validity: boolean
}

const InputWithSelection: React.FC<InputWithSelectionProps> = ({
  placeholder,
  focusBorderColor,
  icon,
  iconColor,
  iconSize,
  title,
  options = [],
  onSelected,
  validity,
  ...rest
}) => {
  const [selectValue, setSelectedValue] = useState(null)
  const selectRef = React.createRef<SelectRef>()
  return (
    <Div>
      <InputWithTitle
        {...{
          placeholder,
          focusBorderColor,
          icon,
          iconColor,
          iconSize,
          title,
          validity,
          ...rest,
        }}
      />
      <Button
        position="absolute"
        w={'100%'}
        h={'80%'}
        p={0}
        bg="transparent"
        onPress={() => selectRef?.current?.open()}
      />
      <Select
        onSelect={onSelected}
        ref={selectRef}
        value={selectValue}
        title={title}
        mt="md"
        pb="2xl"
        message={placeholder}
        roundedTop="xl"
        data={options}
        renderItem={(item, index) => (
          <Select.Option value={item} py="md" px="xl">
            <Text>{item}</Text>
          </Select.Option>
        )}
      />
    </Div>
  )
}

export default InputWithSelection
