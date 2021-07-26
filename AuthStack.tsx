import React from 'react'
import { View, Text } from 'react-native'
import { Div } from 'react-native-magnus'

import { createStackNavigator } from '@react-navigation/stack'
import {
  ForgotEmailScreen,
  ForgotPasswordScreen,
  InitialScreen,
  LoginScreen,
  SignupScreen,
  ExtraInfoForSocialInfo,
} from '../screens'

import CheckBoldText from '../screens/CheckBoldText'

import screens from './screens'

// TEST
// import VideoChatScreen from '../screens/VideoChatScreen'
// import KitchenSink from '../screens/KitchenSink'
import LoginScreenTest from '../screens/LoginScreenTest'

const Stack = createStackNavigator()

const AuthStack: React.FC = () => (
  <Div style={{ flex: 1, backgroundColor: 'white' }}>
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      {/* <Stack.Screen name={'checkBoldText'} component={CheckBoldText} /> */}
      <Stack.Screen name={screens.INITIAL} component={InitialScreen} />
      <Stack.Screen name={screens.LOGIN} component={LoginScreen} />
      <Stack.Screen name={screens.SIGNUP} component={SignupScreen} />
      <Stack.Screen name={screens.FORGOT_EMAIL} component={ForgotEmailScreen} />
      <Stack.Screen
        name={screens.FORGOT_PASSWORD}
        component={ForgotPasswordScreen}
      />
      <Stack.Screen
        name={screens.SOCIAL_LOGIN_EXTRA_INFO}
        component={ExtraInfoForSocialInfo}
      />
      {/* Test */}
      <Stack.Screen name={'login-test'} component={LoginScreenTest} />
    </Stack.Navigator>
  </Div>
)

export default AuthStack
