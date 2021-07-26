import { useNavigation } from '@react-navigation/native'
import React from 'react'
import { Header, Button, Icon } from 'react-native-magnus'

interface Props {
  children?: any
  bottomLine?: boolean
  bottomLineWidth?: number
  suffix?: JSX.Element
  rest?: any
}

export default function GDHeader({
  children,
  bottomLine,
  bottomLineWidth,
  suffix,
  ...rest
}: Props) {
  const navigation = useNavigation()
  return (
    <Header
      p={0}
      // borderWidth={1}
      shadow="none"
      alignment="center"
      minH={56}
      fontWeight="bold"
      fontSize={18}
      lineHeight={26}
      suffix={suffix ? suffix : null}
      prefix={
        <Button bg="transparent" onPress={() => navigation.goBack()}>
          <Icon
            name="arrow-back-ios"
            fontFamily="MaterialIcons"
            fontSize="3xl"
            color="gray900"
          />
        </Button>
      }
      textTransform="none"
      {...(bottomLine
        ? {
            borderBottomWidth: bottomLineWidth || 1,
            borderBottomColor: 'gray300',
          }
        : null)}
      {...rest}>
      {children}
    </Header>
  )
}
