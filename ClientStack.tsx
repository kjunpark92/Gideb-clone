import * as React from 'react'

import { createStackNavigator } from '@react-navigation/stack'
import {
  ClientHomeScreen,
  RSSBlogOverallHealthScreen,
  iTestInitialScreen,
} from '../screens'
// import RSSBlogOverallHealthScreens from '../screens/RSSBlogOverallHealthScreen'

import iTestStack from './iTestStack'

import screens from './screens'
import stacks from './stacks'

const Stack = createStackNavigator()

const ClientStack: React.FC = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
    }}>
    <Stack.Screen name={screens.CLIENT_HOME} component={ClientHomeScreen} />
    {/* <Stack.Screen
      name={screens.RSS_BLOG}
      component={RSSBlogOverallHealthScreen}
    /> */}
    <Stack.Screen name={screens.iTEST_INITIAL} component={iTestInitialScreen} />
  </Stack.Navigator>
)

export default ClientStack
