import * as React from 'react'

import { createStackNavigator } from '@react-navigation/stack'

import screens from './screens'
import ChatRoomsScreen from '../screens/ChatRoomsScreen'
import ChatRoomScreen from '../screens/ChatRoomScreen'
import ChatbotScreen from '../screens/ChatbotScreen'
import { ProviderProfileScreen } from '../screens/providers/ProviderProfileScreen'

const Stack = createStackNavigator()

const ChatStack: React.FC = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name={screens.CHATROOMS} component={ChatRoomsScreen} />
    {/* <Stack.Screen name={screens.CHATROOM} component={ChatRoomScreen} /> */}
    {/* <Stack.Screen name={screens.CHATBOT} component={ChatbotScreen} /> */}
    <Stack.Screen
      name={screens.PROVIDER_PROFILE}
      component={ProviderProfileScreen}
    />
  </Stack.Navigator>
)

export default ChatStack
