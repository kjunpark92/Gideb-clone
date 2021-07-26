import * as React from 'react'
import {
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native'
import {
  Avatar,
  Div,
  Icon,
  Input,
  Text,
  Portal,
  Fab,
  Button,
  Host,
} from 'react-native-magnus'

// react-navigation
import {
  NavigationParams,
  NavigationScreenProp,
  NavigationState,
} from 'react-navigation'

// firebase
import auth, { firebase } from '@react-native-firebase/auth'

// rrf
import { useSelector } from 'react-redux'
import { useFirebase } from 'react-redux-firebase'

import screens from '../navigation/screens'
import stacks from '../navigation/stacks'

import { UserTypeContext } from '../context/UserTypeContext'
import { ClientNavTiles } from '../components'

import { useI18n } from '../hooks'
import Log from '../util/Log'

import Styles from '../util/Styles'

const { useContext } = React

interface ProviderHomeScreenProps {
  navigation: NavigationScreenProp<NavigationState, NavigationParams>
}

const ProviderHomeScreen: React.FC<ProviderHomeScreenProps> = ({
  navigation,
}) => {
  const t = useI18n('providerHome')
  const { userType } = useContext(UserTypeContext)

  const profile = useSelector((state: any) => state.firebase.profile)
  Log.debug('profile = ', profile)

  const firebase = useFirebase()

  const providerNavScreens = [
    {
      screenName: t.newClients,
      picture: Styles.images.smallLogo,
      onPress: () => Log.debug('something here'),
    },
    {
      screenName: t.manageClients,
      picture: Styles.images.smallLogo,
      onPress: () => Log.debug('something here'),
    },
    {
      screenName: t.chattings,
      picture: Styles.images.smallLogo,
      onPress: () => navigation.navigate(stacks.CHAT_STACK),
    },
    {
      screenName: t.settings,
      picture: Styles.images.smallLogo,
      onPress: () => Log.debug('go settings'),
    },
  ]
  return (
    <Div style={{ flex: 1 }}>
      <Host>
        <ScrollView>
          <Div py={'lg'} />
          <Div px={25}>
            <Div row justifyContent={'space-between'} alignItems="center">
              <Div>
                <Div row>
                  <Text fontSize="5xl" mr={5} fontWeight="bold">
                    {profile.nickname}
                    {t.howWasYourDay}
                  </Text>
                </Div>
              </Div>
            </Div>
            <Div py={'lg'} />

            {/* <Div my={30}>
            <Input
              py={15}
              px={25}
              bg="white"
              rounded={30}
              placeholder="Search Class"
              prefix={
                <Icon name="search" color="gray900" fontFamily="Feather" />
              }
            />
          </Div> */}
            <Div
              row
              pb={10}
              justifyContent="space-between"
              alignItems="center"></Div>
            <Div row flexWrap="wrap" justifyContent="space-between">
              {providerNavScreens.map((navTile, i) => (
                <ClientNavTiles key={String(i)} {...navTile} />
              ))}
            </Div>
          </Div>
        </ScrollView>
        <Portal>
          <Fab bg="gray" h={50} w={50}>
            <Button p="none" bg="transparent" justifyContent="flex-end">
              <Div rounded="sm" bg="white" p="sm">
                <Text>Chat</Text>
              </Div>
              <Icon
                name="chat"
                color="gray"
                h={50}
                w={50}
                rounded="circle"
                ml="md"
                bg="white"
                fontFamily="MaterialIcons"
              />
            </Button>
            <Button
              p="none"
              bg="transparent"
              justifyContent="flex-end"
              onPress={firebase.logout}>
              <Div rounded="sm" bg="white" p="sm">
                <Text>Cancel</Text>
              </Div>
              <Icon
                name="cancel"
                color="gray"
                h={50}
                w={50}
                rounded="circle"
                ml="md"
                bg="white"
                fontFamily="MaterialIcons"
              />
            </Button>
          </Fab>
        </Portal>
      </Host>
      {/* <TouchableOpacity
        style={styles.chatBubble}
        onPress={() => Log.debug('Go To Chat')}>
        <Icon
          name="chat"
          // color="yellow700"
          fontSize="6xl"
          fontFamily="MaterialIcons"
        />
      </TouchableOpacity> */}
    </Div>
  )
}

const styles = StyleSheet.create({
  chatBubble: {
    backgroundColor: 'black',
    height: 50,
    width: 50,
    borderRadius: 25,
    position: 'absolute',
    bottom: 50,
    right: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
})

export default ProviderHomeScreen
