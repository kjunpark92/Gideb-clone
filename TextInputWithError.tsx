import * as React from 'react'
import { TextInput } from 'react-native'
import { Div, Text } from 'react-native-magnus'
import Styles from '../util/Styles'

import Log from '../util/Log'
const { useEffect } = React

interface TextInputWithErrorProps {
  label: string
  value: string
  placeholder: string
  isActive: boolean
  isValid: boolean
  error: string
  setActive: Function
  setValue: Function
}

const TextInputWithError: React.FC<TextInputWithErrorProps> = ({
  label,
  value,
  placeholder,
  isActive,
  isValid,
  error,
  setActive,
  setValue,
}) => {
  useEffect(() => {
    // Log.debug('label: ', label)
    // Log.debug('value: ', value)
    // Log.debug('placeholder: ', placeholder)
    // Log.debug('isActive: ', isActive)
    // Log.debug('isValid: ', isValid)
    // Log.debug('error: ', error)
    return () => {
      // cleanup
    }
  }, [])

  const onPress = () => {
    // shows input is in focus wiht onFocus prop
    setActive(label)
  }

  const onInput = (newVal: string) => {
    // handling input from TextInput
    setValue(newVal)
  }

  return (
    <Div flex={1}>
      <TextInput
        keyboardType={label == 'fon' ? 'numeric' : 'default'}
        value={value}
        onFocus={() => onPress()}
        onChangeText={(newVal) => onInput(newVal)}
        placeholder={placeholder}
        style={{
          padding: 16,
          borderColor: isActive
            ? '#121212'
            : isValid
            ? 'rgba(18, 18, 18, 0.1)'
            : '#FF0000',

          borderWidth: 1,
          borderRadius: 8,
          color: '#121212',
        }}
        placeholderTextColor={
          isActive || !isValid ? 'rgba(18, 18, 18, 1)' : '#888888'
        }
      />
      {!isValid ? (
        <Text color="error" ml="xl" mt={2} mb={2} fontSize="md">
          {error}
        </Text>
      ) : (
        <Div mb={22} />
      )}
    </Div>
  )
}

export default TextInputWithError
