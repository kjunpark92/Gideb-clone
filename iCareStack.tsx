import * as React from 'react'

import { createStackNavigator } from '@react-navigation/stack'
import { iCareScreen } from '../screens'

import screens from './screens'

const Stack = createStackNavigator()

const iCareStack: React.FC = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name={screens.iCARE} component={iCareScreen} />
  </Stack.Navigator>
)

export default iCareStack
