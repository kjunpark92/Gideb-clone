import React, { useState } from 'react'
import { SafeAreaView, StyleSheet } from 'react-native'
import {
  Input,
  Icon,
  Text,
  Div,
  InputProps,
  Modal,
  Button,
} from 'react-native-magnus'
import Styles from '../util/Styles'
import Postcode from 'react-native-daum-postcode'
import InputWithTitle from './InputWithTitle'

interface InputWithPostcodeProps extends InputProps {
  icon: string
  iconColor: string
  iconSize: number | string
  title: string
  onSelected: Function
  validity: boolean
}

const InputWithPostcode: React.FC<InputWithPostcodeProps> = ({
  placeholder,
  focusBorderColor,
  icon,
  iconColor,
  iconSize,
  title,
  onSelected,
  validity,
  ...rest
}) => {
  const [visible, setVisible] = useState(false)
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
        onPress={() => setVisible(true)}
      />

      <Modal isVisible={visible} bg="white">
        <Div style={{ flex: 1 }}>
          <Postcode
            style={{ flex: 1, marginTop: 50 }}
            jsOptions={{ animated: true }}
            onSelected={(data) => {
              setVisible(false)
              onSelected(data)
            }}
          />
          <Div bg="transparent" style={styles.closeButton}>
            <Button
              bg="transparent"
              h={50}
              w={50}
              style={{
                alignSelf: 'center',
              }}
              onPress={() => setVisible(false)}>
              <Icon
                fontSize="5xl"
                color="gray800"
                name="cross"
                fontFamily="Entypo"
              />
            </Button>
          </Div>
        </Div>
      </Modal>
    </Div>
  )
}

export default InputWithPostcode

const styles = StyleSheet.create({
  closeButton: {
    position: 'absolute',
    borderWidth: 0,
    right: 5,
    top: 0,
  },
})
