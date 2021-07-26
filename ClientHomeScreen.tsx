import * as React from 'react'
import { useEffect } from 'react'
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Dimensions,
} from 'react-native'
import {
  Image,
  Avatar,
  Div,
  Icon,
  Input,
  Text,
  Portal,
  Fab,
  Button,
  Host,
  useTheme,
  Overlay,
} from 'react-native-magnus'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

// react-navigation
import {
  NavigationParams,
  NavigationScreenProp,
  NavigationState,
} from 'react-navigation'
import { useIsFocused } from '@react-navigation/native'

// firebase
// import auth, { firebase } from '@react-native-firebase/auth'

// rrf
import { useSelector } from 'react-redux'
import {
  useFirebase,
  useFirestore,
  useFirestoreConnect,
} from 'react-redux-firebase'

import screens from '../navigation/screens'
import stacks from '../navigation/stacks'

import { UserTypeContext } from '../context/UserTypeContext'
import {
  ClientNavTiles,
  GDFontText,
  FloatingChatOptionsButton,
} from '../components/'

import { useI18n } from '../hooks'
import Log from '../util/Log'

import Styles from '../util/Styles'

const { useContext } = React

const t = useI18n('clientHome')

interface ClientHomeScreenProps {
  navigation: NavigationScreenProp<NavigationState, NavigationParams>
  route: any
}

export const ChatOptions = ({ visible, navigateToChatStack, closeFunc }) => {
  return (
    <Overlay
      visible={visible}
      bg="transparent"
      h={SCREEN_HEIGHT}
      w={SCREEN_WIDTH}>
      <Div
        bottom={80}
        flex={1}
        justifyContent="flex-end"
        alignItems="flex-end"
        pb="lg"
        pr="lg">
        <Div justifyContent="flex-end" alignItems="flex-end">
          <Button
            p="none"
            bg="transparent"
            justifyContent="flex-end"
            // onPress={() => navigation.navigate(stacks.CHAT_STACK)}
            onPress={navigateToChatStack}>
            <Div rounded="sm" bg="transparent" p="sm">
              <GDFontText color="white" fontSize="lg">
                {t.notificationBot}
              </GDFontText>
            </Div>

            <Image
              ml="md"
              source={Styles.images.smallLogo}
              h={50}
              w={50}
              rounded="circle"
            />
          </Button>
          <Div p="sm" />
          <Button
            pl="lg"
            p="none"
            bg="transparent"
            justifyContent="flex-end"
            // onPress={() => navigation.navigate(stacks.CHAT_STACK)}
            onPress={navigateToChatStack}>
            <Div rounded="sm" bg="transparent" p="sm">
              <GDFontText color="white" fontSize="lg">
                {t.chatBot}
              </GDFontText>
            </Div>

            <Image
              ml="md"
              source={Styles.images.chatbotAvatar}
              h={50}
              w={50}
              rounded="xl"
            />
          </Button>
          <Div p="sm" />

          <Button
            // pl="lg"
            p="none"
            bg="transparent"
            // justifyContent="flex-end"
            // onPress={handleChatIconPressed}
            onPress={closeFunc}>
            <Div rounded="sm" bg="transparent" p="sm" w={60}></Div>

            <Image
              // ml="md"
              source={Styles.images.closeBubble}
              h={50}
              w={50}
              rounded="xl"
            />
          </Button>
        </Div>
      </Div>
    </Overlay>
  )
}

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('screen')
const ClientHomeScreen: React.FC<ClientHomeScreenProps> = ({
  navigation,
  route,
}) => {
  const t = useI18n('clientHome')
  const { theme } = useTheme()
  const { userType } = useContext(UserTypeContext)
  const purchaseSuccess = route?.params?.purchaseSuccess ?? null
  const isFocused = useIsFocused()

  const profile = useSelector((state: any) => state.firebase.profile)

  const firebase = useFirebase()

  useEffect(() => {
    if (purchaseSuccess == true) Alert.alert('Purchase Success')
    if (purchaseSuccess == false) Alert.alert('Purchase Failed')
  }, [profile])

  const clientNavScreens = [
    {
      screenName: t.wellnessTraining,
      picture: Styles.images.clientNavTile.wellnessTraining,
      iconSize: { w: 65, h: 65 },
      onPress: () => navigation.navigate(stacks.WELLNESS_STACK),
    },
    {
      screenName: t.secondwind,
      picture: Styles.images.clientNavTile.secondWind,
      iconSize: { w: 65, h: 67 },
      onPress: () => navigation.navigate(stacks.SECONDWIND_STACK),
    },
    {
      screenName: t.iTest,
      picture: Styles.images.clientNavTile.iTest,
      iconSize: { w: 65, h: 66 },
      onPress: () => navigation.navigate(screens.iTEST_INITIAL),
    },
    {
      screenName: t.iJournal,
      picture: Styles.images.clientNavTile.iJournal,
      iconSize: { w: 68, h: 65 },
      onPress: () => navigation.navigate(stacks.iJOURNAL_STACK),
    },
    {
      screenName: t.overallHealth,
      picture: Styles.images.clientNavTile.overallHealth,
      iconSize: { w: 65, h: 65 },
      onPress: () => navigation.navigate(screens.RSS_BLOG),
    },
    {
      screenName: t.searchProviders,
      picture: Styles.images.clientNavTile.searchProviders,
      iconSize: { w: 65, h: 68 },
      onPress: () => navigation.navigate(stacks.SEARCH_STACK),
    },
  ]
  const insets = useSafeAreaInsets()

  const [chatPressed, setChatPressed] = React.useState<boolean>(false)
  const handleChatIconPressed = () => {
    setChatPressed(!chatPressed)
  }

  return (
    <Div bg="gray150" flex={1} pt={insets.top} style={{ zIndex: 0 }}>
      <ScrollView bounces={false} style={{ zIndex: 0 }}>
        <Div px="xl" pt={38}>
          <Div row justifyContent={'space-between'} alignItems="center">
            <Div>
              <Image
                source={
                  profile?.photoURL
                    ? { uri: profile.photoURL }
                    : Styles.images.smallLogo
                }
                h={50}
                w={50}
                mb={16}
                rounded="circle"
              />
              <Div row mb={34}>
                <GDFontText
                  textWeight="700"
                  fontSize={24}
                  mr={5}
                  lineHeight={32}>
                  {profile.nickname}
                  {t.howWasYourDay}
                </GDFontText>
              </Div>
            </Div>
          </Div>
          <Div row pb={10} justifyContent="space-between" alignItems="center" />
          <Div row flexWrap="wrap" justifyContent="space-between">
            {clientNavScreens.map((navTile, i) => (
              <ClientNavTiles key={String(i)} {...navTile} />
            ))}
          </Div>
        </Div>
      </ScrollView>
      <FloatingChatOptionsButton
        navigateToChatbot={() =>
          navigation.navigate(stacks.CHAT_STACK, { screen: screens.CHATBOT })
        }
        navigateToNotification={() =>
          navigation.navigate(stacks.CHAT_STACK, {
            screen: screens.NOTIFICATION,
          })
        }
      />
    </Div>
  )
}

export default ClientHomeScreen
