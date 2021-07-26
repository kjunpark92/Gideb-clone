import React from 'react'
import { SafeAreaView, StyleSheet } from 'react-native'
import { Div, Input, Text } from 'react-native-magnus'

import Log from '../util/Log'

import { InputWithTitle, LoginIconText } from '../components'
import Styles from '../util/Styles'
// import LoginIconText from '../components/LoginIconText'

interface LoginScreenProps {
  navigation: any
  route: object
}

const LoginScreenTest: React.FC<LoginScreenProps> = ({ navigation, route }) => {
  Log.debug(route)
  return (
    <Div>
      <Div>
        <Text>Login Screen Test</Text>
        <InputWithTitle
          placeholder="something"
          focusBorderColor="pink"
          icon="eye"
          iconColor={Styles.colors.grayscale.lightGray}
        />
        <LoginIconText mainText="something" subText="more something" />
      </Div>
    </Div>
  )
}

export default LoginScreenTest
