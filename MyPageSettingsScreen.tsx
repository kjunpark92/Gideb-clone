import React, { useContext } from 'react'
import { StyleSheet, TouchableOpacity, Alert } from 'react-native'
import { SafeAreaView as NavSafeAreaView } from 'react-native-safe-area-context'
import { Div, Text, Icon, Overlay } from 'react-native-magnus'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import UserService from '../services/user'
// react-navigation
// import {
//   NavigationParams,
//   NavigationScreenProp,
//   NavigationState,
// } from 'react-navigation'

import { version } from '../../package.json'
import auth from '@react-native-firebase/auth'
import Log from '../util/Log'
import Styles from '../util/Styles'
import {
  GDHeader,
  TOSModal,
  PrivacyPolicyModal,
  GDFontText,
} from '../components'
import { useI18n } from '../hooks'
import screens from '../navigation/screens'
import stacks from '../navigation/stacks'
// import stacks from '../navigation/stacks'
import { useFirebase } from 'react-redux-firebase'
// import axios from 'axios'
import { UserTypeContext } from '../context/UserTypeContext'

interface MyPageSettingsScreenProps {
  // navigation: NavigationScreenProp<NavigationState, NavigationParams>
  navigation: any
}

const { createRef, useState, useRef } = React
const MyPageSettingsScreen: React.FC<MyPageSettingsScreenProps> = ({
  navigation,
}) => {
  const { userType } = useContext(UserTypeContext)
  const t = useI18n('myPageSettings')
  const deleteAccDropdownRef = createRef()
  const [showTOSModal, setShowTOSModal] = useState(false)
  const [showPPModal, setShowPPModal] = useState(false)
  const [showDelAccOverlay, setShowDelAccOverlay] = useState(false)
  const [showLogoutOverlay, setShowLogoutOverlay] = useState(false)
  // const [chatOptionsOverlay, setChatOptionsOverlay] = useState(false)

  const firebase = useFirebase()
  const insets = useSafeAreaInsets()

  const logout = async () => {
    await firebase.updateProfile({
      deviceTokens: [],
    })
    // unsubscribe fcm topic GIDEB_CLIENTS or GIDEB_PROVIDERS
    if (userType === 'client') {
      await firebase.messaging().unsubscribeFromTopic('GIDEB_CLIENTS')
    }
    if (userType === 'provider') {
      await firebase.messaging().unsubscribeFromTopic('GIDEB_PROVIDERS')
    }
    await firebase.logout()
    Log.debug('User signed out!')
  }

  const deleteAccount = async () => {
    const { uid } = firebase.auth().currentUser
    const deletedUser = await UserService.terminateAcct(uid)
    if (deletedUser) return firebase.auth().signOut()
    Alert.alert(t.deleteAccFailBoxTitle, t.deleteAccFailBoxMsg, [
      {
        text: t.deleteAccFailBoxButton1,
        onPress: () => auth().signOut(),
      },
      {
        text: t.deleteAccFailBoxButton2,
        onPress: () => Log.debug('delete account canceled'),
      },
    ])
  }
  const SETTINGS_OPTIONS = [
    {
      name: 'privacy-policy',
      display: t.privacyPolicy,
      // onPress: () => PPRef.current.open(),
      onPress: () => setShowPPModal(true),
    },
    {
      name: 'app-version',
      display: t.version,
    },
    {
      name: 'tos',
      display: t.termsOfService,
      // onPress: () => TOSRef.current.open(),
      onPress: () => setShowTOSModal(true),
    },
    {
      name: 'about',
      display: t.aboutCompany,
      onPress: () => {
        Log.debug('pressed about')
        navigation.navigate(stacks.MODAL_STACK, {
          screen: screens.ABOUT,
          navigationOptions: { animationEnabled: false },
        })
      },
    },
    {
      name: 'logout',
      display: t.logout,
      onPress: () => {
        setShowLogoutOverlay(true)
      },
    },
    {
      name: 'terminate',
      display: t.terminate,
      onPress: () => {
        setShowDelAccOverlay(true)
      },
    },
    {
      name: 'change-pw',
      display: t.changePw,
      onPress: () => {
        Log.debug('change pw pressed')
        navigation.navigate(stacks.MODAL_STACK, {
          screen: screens.PW_RESET,
        })
      },
    },
    {
      name: 'lang',
      display: t.lang,
      onPress: () => {
        Log.debug('lang pressed')
        navigation.navigate(stacks.MODAL_STACK, { screen: screens.LANGUAGE })
      },
    },
  ]

  return (
    <Div flex={1} bg="white" pt={insets.top}>
      <GDHeader>{t.header}</GDHeader>
      <Div borderBottomWidth={1} borderBottomColor="gray200" />
      <Div p="lg" />
      <TOSModal
        isVisible={showTOSModal}
        closeFunc={() => setShowTOSModal(false)}
      />
      <PrivacyPolicyModal
        isVisible={showPPModal}
        closeFunc={() => setShowPPModal(false)}
      />
      <Overlay visible={showDelAccOverlay} mb={'40%'} rounded="2xl">
        <Div p="2xl">
          <GDFontText
            fontSize="xl"
            color="gray800"
            textAlign="center"
            textWeight="700">
            {t.deleteAccBoxTitle}
          </GDFontText>
          <Text fontSize="lg" mt="lg" textAlign="center">
            {t.deleteAccBoxMsg}
          </Text>
          <Div mt="2xl" row justifyContent="space-around" px="2xl">
            <TouchableOpacity onPress={() => setShowDelAccOverlay(false)}>
              <GDFontText fontSize="xl" color="gray600">
                {t.deleteAccBoxCancel}
              </GDFontText>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => deleteAccount()}>
              <GDFontText fontSize="xl" color="main900">
                {t.deleteAccBoxAccept}
              </GDFontText>
            </TouchableOpacity>
          </Div>
        </Div>
      </Overlay>
      <Overlay visible={showLogoutOverlay} mb={'40%'} rounded="2xl">
        <Div p="2xl">
          <GDFontText
            fontSize="xl"
            color="gray800"
            textAlign="center"
            textWeight="700">
            {t.logoutBoxTitle}
          </GDFontText>
          <Text fontSize="lg" mt="lg" textAlign="center">
            {t.logoutBoxMsg}
          </Text>
          <Div mt="2xl" row justifyContent="space-around" px="2xl">
            <TouchableOpacity onPress={() => setShowLogoutOverlay(false)}>
              <GDFontText fontSize="xl" color="gray600">
                {t.logoutBoxCancel}
              </GDFontText>
            </TouchableOpacity>
            <TouchableOpacity onPress={logout}>
              <GDFontText fontSize="xl" color="main900">
                {t.logoutBoxAccept}
              </GDFontText>
            </TouchableOpacity>
          </Div>
        </Div>
      </Overlay>
      <Div>
        {SETTINGS_OPTIONS.map((setting, i) =>
          setting.name == 'app-version' ? (
            <Div
              key={String(i)}
              row
              borderBottomWidth={1}
              borderBottomColor={Styles.colors.grayscale.lightGray}
              p="lg"
              mx={10}
              justifyContent="space-between">
              <Text fontSize="lg">{setting.display}</Text>
              <Text fontSize="md">{version}</Text>
            </Div>
          ) : (
            <TouchableOpacity key={String(i)} onPress={setting.onPress}>
              <Div
                row
                borderBottomWidth={1}
                borderBottomColor={Styles.colors.grayscale.lightGray}
                p="lg"
                mx={10}
                justifyContent="space-between">
                <Text fontSize="lg">{setting.display}</Text>
                <Icon
                  fontFamily="Entypo"
                  name="chevron-right"
                  fontSize="4xl"
                  color={Styles.colors.grayscale.allBlack}
                />
              </Div>
            </TouchableOpacity>
          ),
        )}
      </Div>
    </Div>
  )
}

// const styles = StyleSheet.create({})

export default MyPageSettingsScreen
