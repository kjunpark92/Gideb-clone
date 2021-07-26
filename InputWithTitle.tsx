import React from 'react'
import { Input, Icon, Text, Div, InputProps } from 'react-native-magnus'
import Styles from '../util/Styles'

interface InputWithTitleProps extends InputProps {
  icon: string
  iconColor: string
  iconSize: number | string
  title: string
  validity: boolean
}

const InputWithTitle: React.FC<InputWithTitleProps> = ({
  placeholder,
  focusBorderColor,
  icon,
  iconColor,
  iconSize,
  title,
  validity,
  ...rest
}) => (
  <Div h={65}>
    {/*  */}
    <Input
      bg={'transparent'}
      placeholder={placeholder}
      p="lg"
      focusBorderColor={validity ? 'validBorder' : 'invalidBorder'}
      suffix={
        validity ? (
          <Icon
            name="check"
            color="green900"
            fontSize="xl"
            fontFamily="Feather"
          />
        ) : (
          <Icon
            name={icon}
            color={iconColor}
            fontSize={iconSize}
            fontFamily="Feather"
          />
        )
      }
      {...rest}
    />
    <Div
      bg={Styles.colors.background.light}
      px="md"
      style={{ position: 'absolute', top: -8, marginLeft: 8 }}>
      <Text>{title}</Text>
    </Div>
  </Div>
)

export default InputWithTitle
